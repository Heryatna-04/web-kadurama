#!/usr/bin/env python3
"""
generate_kadurama_glb.py
Converts OpenStreetMap XML data into an optimized 3D glTF Binary (.glb) model
specifically cropped to Desa Kadurama, Ciawigebang, Kuningan.
"""

import sys
import os
import math
import struct
import json
import xml.sax

# -----------------------------------------------------------------------------
# 1. PARAMETERS & BOUNDING BOX (DESA KADURAMA, CIAWIGEBANG, KUNINGAN)
# -----------------------------------------------------------------------------
# Real geographic coordinates from Google Maps & OSM:
CENTER_LAT = -6.9775
CENTER_LON = 108.5983

# Bounding box for Desa Kadurama (approx 2.3 km x 2.3 km)
MIN_LAT = -6.9880
MAX_LAT = -6.9670
MIN_LON = 108.5875
MAX_LON = 108.6090

# Scale to 3D scene units (1 meter = 1 unit)
METERS_PER_LAT = 111320.0
METERS_PER_LON = 111320.0 * math.cos(math.radians(CENTER_LAT))

def geo_to_xy(lat, lon):
    """Converts (lat, lon) to local tangent plane (x, z) in meters with center at (0, 0)"""
    x = (lon - CENTER_LON) * METERS_PER_LON
    z = -(lat - CENTER_LAT) * METERS_PER_LAT  # North is -Z, South is +Z
    return x, z

# -----------------------------------------------------------------------------
# 2. EAR-CLIPPING POLYGON TRIANGULATION
# -----------------------------------------------------------------------------
def point_in_triangle(p, a, b, c):
    def sign(p1, p2, p3):
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
    d1 = sign(p, a, b)
    d2 = sign(p, b, c)
    d3 = sign(p, c, a)
    return not ((d1 < 0 or d2 < 0 or d3 < 0) and (d1 > 0 or d2 > 0 or d3 > 0))

def triangulate_polygon(polygon):
    """Triangulates a simple 2D polygon (list of (x, z) points). Returns list of (i, j, k) index tuples."""
    n = len(polygon)
    if n < 3:
        return []
    if n == 3:
        return [(0, 1, 2)]
    if n == 4:
        return [(0, 1, 2), (0, 2, 3)]

    # Compute signed area to check orientation (counter-clockwise)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += polygon[i][0] * polygon[j][1] - polygon[j][0] * polygon[i][1]
    ccw = area > 0

    indices = list(range(n))
    triangles = []
    max_loops = 3 * len(indices)
    curr = 0

    while len(indices) > 3 and max_loops > 0:
        max_loops -= 1
        i = curr % len(indices)
        prev_i = (i - 1) % len(indices)
        next_i = (i + 1) % len(indices)

        a = polygon[indices[prev_i]]
        b = polygon[indices[i]]
        c = polygon[indices[next_i]]

        cp = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        is_convex = (cp > 0) if ccw else (cp < 0)

        if is_convex:
            has_point_inside = False
            for k in range(len(indices)):
                if k in (prev_i, i, next_i):
                    continue
                if point_in_triangle(polygon[indices[k]], a, b, c):
                    has_point_inside = True
                    break
            if not has_point_inside:
                triangles.append((indices[prev_i], indices[i], indices[next_i]))
                indices.pop(i)
                max_loops = 3 * len(indices)
                continue
        curr += 1

    if len(indices) == 3:
        triangles.append((indices[0], indices[1], indices[2]))
    return triangles

# -----------------------------------------------------------------------------
# 3. FAST SAX PARSER TO EXTRACT KADURAMA OSM ELEMENTS
# -----------------------------------------------------------------------------
class KaduramaOSMParser(xml.sax.ContentHandler):
    def __init__(self):
        self.nodes = {}
        self.buildings = []
        self.roads = []
        self.waterways = []
        self.in_way = False
        self.current_way_nodes = []
        self.current_tags = {}

    def startElement(self, name, attrs):
        if name == 'node':
            lat = float(attrs['lat'])
            lon = float(attrs['lon'])
            # Store node if inside or close to box
            if MIN_LAT - 0.005 <= lat <= MAX_LAT + 0.005 and MIN_LON - 0.005 <= lon <= MAX_LON + 0.005:
                self.nodes[attrs['id']] = (lat, lon)
        elif name == 'way':
            self.in_way = True
            self.current_way_nodes = []
            self.current_tags = {}
        elif name == 'nd' and self.in_way:
            self.current_way_nodes.append(attrs['ref'])
        elif name == 'tag' and self.in_way:
            self.current_tags[attrs['k']] = attrs['v']

    def endElement(self, name):
        if name == 'way':
            # Check if at least 2 nodes are in our stored nodes
            valid_nodes = [self.nodes[nid] for nid in self.current_way_nodes if nid in self.nodes]
            if len(valid_nodes) >= 2:
                # Check bounding box
                has_in_box = any(MIN_LAT <= lat <= MAX_LAT and MIN_LON <= lon <= MAX_LON for lat, lon in valid_nodes)
                if has_in_box:
                    if 'building' in self.current_tags:
                        self.buildings.append((valid_nodes, self.current_tags))
                    elif 'highway' in self.current_tags:
                        self.roads.append((valid_nodes, self.current_tags))
                    elif 'waterway' in self.current_tags:
                        self.waterways.append((valid_nodes, self.current_tags))
            self.in_way = False

# -----------------------------------------------------------------------------
# 4. GLTF 2.0 BINARY (.GLB) BUILDER
# -----------------------------------------------------------------------------
class GLBBuilder:
    def __init__(self):
        self.bin_data = bytearray()
        self.buffer_views = []
        self.accessors = []
        self.materials = []
        self.meshes = []
        self.nodes = []

    def add_material(self, name, r, g, b, roughness=0.6, metallic=0.05, alpha=1.0):
        mat_idx = len(self.materials)
        self.materials.append({
            "name": name,
            "pbrMetallicRoughness": {
                "baseColorFactor": [r, g, b, alpha],
                "metallicFactor": metallic,
                "roughnessFactor": roughness
            },
            "doubleSided": True
        })
        return mat_idx

    def add_mesh_primitive(self, name, positions, normals, indices, material_idx):
        """Adds a primitive mesh with float32 positions/normals and uint32 indices."""
        pos_offset = len(self.bin_data)
        # Pack positions (x, y, z as float32)
        min_pos = [float('inf'), float('inf'), float('inf')]
        max_pos = [float('-inf'), float('-inf'), float('-inf')]
        pos_bytes = bytearray()
        for x, y, z in positions:
            pos_bytes += struct.pack('<fff', x, y, z)
            min_pos[0] = min(min_pos[0], x)
            min_pos[1] = min(min_pos[1], y)
            min_pos[2] = min(min_pos[2], z)
            max_pos[0] = max(max_pos[0], x)
            max_pos[1] = max(max_pos[1], y)
            max_pos[2] = max(max_pos[2], z)
        
        self.bin_data += pos_bytes
        pos_bv_idx = len(self.buffer_views)
        self.buffer_views.append({
            "buffer": 0,
            "byteOffset": pos_offset,
            "byteLength": len(pos_bytes),
            "target": 34962 # ARRAY_BUFFER
        })

        # Pack normals (x, y, z as float32)
        norm_offset = len(self.bin_data)
        norm_bytes = bytearray()
        for nx, ny, nz in normals:
            norm_bytes += struct.pack('<fff', nx, ny, nz)
        self.bin_data += norm_bytes
        norm_bv_idx = len(self.buffer_views)
        self.buffer_views.append({
            "buffer": 0,
            "byteOffset": norm_offset,
            "byteLength": len(norm_bytes),
            "target": 34962 # ARRAY_BUFFER
        })

        # Pack indices (uint32)
        pad = (4 - (len(self.bin_data) % 4)) % 4
        self.bin_data += b'\x00' * pad
        idx_offset = len(self.bin_data)
        idx_bytes = bytearray()
        for idx in indices:
            idx_bytes += struct.pack('<I', idx)
        self.bin_data += idx_bytes
        idx_bv_idx = len(self.buffer_views)
        self.buffer_views.append({
            "buffer": 0,
            "byteOffset": idx_offset,
            "byteLength": len(idx_bytes),
            "target": 34963 # ELEMENT_ARRAY_BUFFER
        })

        # Accessors
        pos_acc_idx = len(self.accessors)
        self.accessors.append({
            "bufferView": pos_bv_idx,
            "byteOffset": 0,
            "componentType": 5126, # FLOAT
            "count": len(positions),
            "type": "VEC3",
            "min": min_pos,
            "max": max_pos
        })

        norm_acc_idx = len(self.accessors)
        self.accessors.append({
            "bufferView": norm_bv_idx,
            "byteOffset": 0,
            "componentType": 5126, # FLOAT
            "count": len(normals),
            "type": "VEC3"
        })

        idx_acc_idx = len(self.accessors)
        self.accessors.append({
            "bufferView": idx_bv_idx,
            "byteOffset": 0,
            "componentType": 5125, # UNSIGNED_INT
            "count": len(indices),
            "type": "SCALAR"
        })

        mesh_idx = len(self.meshes)
        self.meshes.append({
            "name": name,
            "primitives": [{
                "attributes": {
                    "POSITION": pos_acc_idx,
                    "NORMAL": norm_acc_idx
                },
                "indices": idx_acc_idx,
                "material": material_idx
            }]
        })

        node_idx = len(self.nodes)
        self.nodes.append({
            "name": name,
            "mesh": mesh_idx
        })
        return node_idx

    def build_glb(self):
        # Root node that parents all child nodes
        root_children = list(range(len(self.nodes)))
        root_node_idx = len(self.nodes)
        self.nodes.append({
            "name": "Kadurama_Village_Model",
            "children": root_children
        })

        # Pad binary buffer to 4 bytes
        pad = (4 - (len(self.bin_data) % 4)) % 4
        self.bin_data += b'\x00' * pad

        gltf_json = {
            "asset": {
                "version": "2.0",
                "generator": "Kadurama OSM 3D Converter"
            },
            "scene": 0,
            "scenes": [{"name": "Kadurama_Scene", "nodes": [root_node_idx]}],
            "nodes": self.nodes,
            "meshes": self.meshes,
            "accessors": self.accessors,
            "bufferViews": self.buffer_views,
            "buffers": [{"byteLength": len(self.bin_data)}],
            "materials": self.materials
        }

        json_bytes = json.dumps(gltf_json, separators=(',', ':')).encode('utf-8')
        json_pad = (4 - (len(json_bytes) % 4)) % 4
        json_bytes += b' ' * json_pad

        header_len = 12
        chunk0_header_len = 8
        chunk1_header_len = 8
        total_len = header_len + chunk0_header_len + len(json_bytes) + chunk1_header_len + len(self.bin_data)

        glb = bytearray()
        # 12-byte glTF header: magic (4), version (4), length (4)
        glb += struct.pack('<4sII', b'glTF', 2, total_len)
        # Chunk 0 (JSON): length (4), type (4), bytes
        glb += struct.pack('<I4s', len(json_bytes), b'JSON')
        glb += json_bytes
        # Chunk 1 (BIN): length (4), type (4), bytes
        glb += struct.pack('<I4s', len(self.bin_data), b'BIN\x00')
        glb += self.bin_data
        return glb

# -----------------------------------------------------------------------------
# 5. MAIN EXECUTION
# -----------------------------------------------------------------------------
def main():
    osm_path = '/home/jrilym/Projects/Next/desa/map'
    output_public = '/home/jrilym/Projects/Next/desa/frontend/public/kadurama_village.glb'
    output_mockup = '/home/jrilym/Projects/Next/desa/mockups/kadurama_village.glb'

    print(f"Reading and parsing OSM XML from {osm_path}...")
    handler = KaduramaOSMParser()
    with open(osm_path, 'r', encoding='utf-8') as f:
        xml.sax.parse(f, handler)

    print(f"Extracted Kadurama elements:")
    print(f" - Buildings: {len(handler.buildings)}")
    print(f" - Roads: {len(handler.roads)}")
    print(f" - Waterways: {len(handler.waterways)}")

    glb_builder = GLBBuilder()

    # Materials
    # 1. Buildings: Ivory white civic architecture
    mat_building = glb_builder.add_material("Mat_Buildings", 0.93, 0.95, 0.97, roughness=0.55, metallic=0.05)
    # 2. Roads: Dark slate asphalt
    mat_road = glb_builder.add_material("Mat_Roads", 0.25, 0.29, 0.35, roughness=0.88, metallic=0.0)
    # 3. Waterways: Freshwater cyan
    mat_water = glb_builder.add_material("Mat_Waterways", 0.08, 0.65, 0.78, roughness=0.2, metallic=0.15)
    # 4. Ground base: Deep Kuningan dark teal
    mat_ground = glb_builder.add_material("Mat_Ground", 0.02, 0.15, 0.13, roughness=0.92, metallic=0.0)

    # -------------------------------------------------------------------------
    # A. CONSTRUCT 3D BUILDINGS
    # -------------------------------------------------------------------------
    b_positions = []
    b_normals = []
    b_indices = []

    for nodes, tags in handler.buildings:
        if len(nodes) < 3:
            continue
        # Convert to local 2D coordinates (x, z)
        poly = [geo_to_xy(lat, lon) for lat, lon in nodes]
        # If last point is identical to first, remove it for triangulation
        if poly[0] == poly[-1] and len(poly) > 3:
            poly = poly[:-1]
        if len(poly) < 3:
            continue

        # Approximate building perimeter to determine realistic height
        perimeter = 0.0
        for i in range(len(poly)):
            p1 = poly[i]
            p2 = poly[(i + 1) % len(poly)]
            perimeter += math.hypot(p2[0] - p1[0], p2[1] - p1[1])

        # Residential houses: ~3.8m. Larger civic buildings (schools, clinics): ~6.5m
        height = 6.5 if perimeter > 75.0 else 3.8

        # 1. Extrude Walls
        for i in range(len(poly)):
            p1 = poly[i]
            p2 = poly[(i + 1) % len(poly)]
            dx = p2[0] - p1[0]
            dz = p2[1] - p1[1]
            seg_len = math.hypot(dx, dz)
            if seg_len < 0.001:
                continue
            # Normal pointing outward
            nx = -dz / seg_len
            nz = dx / seg_len

            start_idx = len(b_positions)
            # 4 vertices per wall segment: (p1_bot, p2_bot, p2_top, p1_top)
            b_positions.append((p1[0], 0.0, p1[1]))
            b_positions.append((p2[0], 0.0, p2[1]))
            b_positions.append((p2[0], height, p2[1]))
            b_positions.append((p1[0], height, p1[1]))

            for _ in range(4):
                b_normals.append((nx, 0.0, nz))

            b_indices.append(start_idx)
            b_indices.append(start_idx + 1)
            b_indices.append(start_idx + 2)
            b_indices.append(start_idx)
            b_indices.append(start_idx + 2)
            b_indices.append(start_idx + 3)

        # 2. Extrude Roof
        roof_tris = triangulate_polygon(poly)
        start_roof_idx = len(b_positions)
        for pt in poly:
            b_positions.append((pt[0], height, pt[1]))
            b_normals.append((0.0, 1.0, 0.0))

        for t0, t1, t2 in roof_tris:
            b_indices.append(start_roof_idx + t0)
            b_indices.append(start_roof_idx + t1)
            b_indices.append(start_roof_idx + t2)

    if b_positions:
        glb_builder.add_mesh_primitive("Desa_Kadurama_Buildings", b_positions, b_normals, b_indices, mat_building)
        print(f"Generated 3D Buildings mesh: {len(b_positions)} vertices, {len(b_indices)//3} triangles")

    # -------------------------------------------------------------------------
    # B. CONSTRUCT 3D ROADS
    # -------------------------------------------------------------------------
    r_positions = []
    r_normals = []
    r_indices = []

    for nodes, tags in handler.roads:
        if len(nodes) < 2:
            continue
        poly = [geo_to_xy(lat, lon) for lat, lon in nodes]
        # Road width based on type
        hw = tags.get('highway', '')
        if hw in ('primary', 'secondary', 'tertiary'):
            width = 6.0
        elif hw in ('residential', 'unclassified'):
            width = 4.2
        else:
            width = 3.0
        half_w = width / 2.0

        for i in range(len(poly) - 1):
            p1 = poly[i]
            p2 = poly[i + 1]
            dx = p2[0] - p1[0]
            dz = p2[1] - p1[1]
            seg_len = math.hypot(dx, dz)
            if seg_len < 0.001:
                continue
            # Perpendicular vector
            px = -dz / seg_len * half_w
            pz = dx / seg_len * half_w

            start_idx = len(r_positions)
            y = 0.15 # Slight elevation above ground to prevent z-fighting
            # 4 vertices for road quad
            r_positions.append((p1[0] + px, y, p1[1] + pz))
            r_positions.append((p2[0] + px, y, p2[1] + pz))
            r_positions.append((p2[0] - px, y, p2[1] - pz))
            r_positions.append((p1[0] - px, y, p1[1] - pz))

            for _ in range(4):
                r_normals.append((0.0, 1.0, 0.0))

            r_indices.append(start_idx)
            r_indices.append(start_idx + 1)
            r_indices.append(start_idx + 2)
            r_indices.append(start_idx)
            r_indices.append(start_idx + 2)
            r_indices.append(start_idx + 3)

    if r_positions:
        glb_builder.add_mesh_primitive("Desa_Kadurama_Roads", r_positions, r_normals, r_indices, mat_road)
        print(f"Generated 3D Roads mesh: {len(r_positions)} vertices, {len(r_indices)//3} triangles")

    # -------------------------------------------------------------------------
    # C. CONSTRUCT 3D WATERWAYS
    # -------------------------------------------------------------------------
    w_positions = []
    w_normals = []
    w_indices = []

    for nodes, tags in handler.waterways:
        if len(nodes) < 2:
            continue
        poly = [geo_to_xy(lat, lon) for lat, lon in nodes]
        half_w = 2.5

        for i in range(len(poly) - 1):
            p1 = poly[i]
            p2 = poly[i + 1]
            dx = p2[0] - p1[0]
            dz = p2[1] - p1[1]
            seg_len = math.hypot(dx, dz)
            if seg_len < 0.001:
                continue
            px = -dz / seg_len * half_w
            pz = dx / seg_len * half_w

            start_idx = len(w_positions)
            y = 0.08 # Between ground and roads
            w_positions.append((p1[0] + px, y, p1[1] + pz))
            w_positions.append((p2[0] + px, y, p2[1] + pz))
            w_positions.append((p2[0] - px, y, p2[1] - pz))
            w_positions.append((p1[0] - px, y, p1[1] - pz))

            for _ in range(4):
                w_normals.append((0.0, 1.0, 0.0))

            w_indices.append(start_idx)
            w_indices.append(start_idx + 1)
            w_indices.append(start_idx + 2)
            w_indices.append(start_idx)
            w_indices.append(start_idx + 2)
            w_indices.append(start_idx + 3)

    if w_positions:
        glb_builder.add_mesh_primitive("Desa_Kadurama_Waterways", w_positions, w_normals, w_indices, mat_water)
        print(f"Generated 3D Waterways mesh: {len(w_positions)} vertices, {len(w_indices)//3} triangles")

    # -------------------------------------------------------------------------
    # D. CONSTRUCT GROUND PEDESTAL
    # -------------------------------------------------------------------------
    # Base terrain size around 2400m x 2400m
    gx1, gz1 = geo_to_xy(MAX_LAT, MIN_LON)
    gx2, gz2 = geo_to_xy(MIN_LAT, MAX_LON)
    min_x, max_x = min(gx1, gx2), max(gx1, gx2)
    min_z, max_z = min(gz1, gz2), max(gz1, gz2)

    g_positions = [
        (min_x, 0.0, min_z),
        (max_x, 0.0, min_z),
        (max_x, 0.0, max_z),
        (min_x, 0.0, max_z),
        # Pedestal base bottom
        (min_x, -15.0, min_z),
        (max_x, -15.0, min_z),
        (max_x, -15.0, max_z),
        (min_x, -15.0, max_z),
    ]
    g_normals = [
        (0.0, 1.0, 0.0), (0.0, 1.0, 0.0), (0.0, 1.0, 0.0), (0.0, 1.0, 0.0),
        (0.0, -1.0, 0.0), (0.0, -1.0, 0.0), (0.0, -1.0, 0.0), (0.0, -1.0, 0.0),
    ]
    g_indices = [
        # Top face
        0, 1, 2, 0, 2, 3,
        # Skirt sides
        0, 4, 5, 0, 5, 1,
        1, 5, 6, 1, 6, 2,
        2, 6, 7, 2, 7, 3,
        3, 7, 4, 3, 4, 0,
        # Bottom face
        4, 6, 5, 4, 7, 6
    ]
    glb_builder.add_mesh_primitive("Desa_Kadurama_Terrain_Pedestal", g_positions, g_normals, g_indices, mat_ground)

    # -------------------------------------------------------------------------
    # E. EXPORT .GLB BINARY FILE
    # -------------------------------------------------------------------------
    print("Compiling glTF 2.0 Binary (.glb)...")
    glb_data = glb_builder.build_glb()

    os.makedirs(os.path.dirname(output_public), exist_ok=True)
    os.makedirs(os.path.dirname(output_mockup), exist_ok=True)

    with open(output_public, 'wb') as f:
        f.write(glb_data)
    with open(output_mockup, 'wb') as f:
        f.write(glb_data)

    file_size_mb = len(glb_data) / (1024 * 1024)
    print(f"SUCCESS! Output saved:")
    print(f"  -> {output_public} ({file_size_mb:.2f} MB)")
    print(f"  -> {output_mockup} ({file_size_mb:.2f} MB)")

if __name__ == '__main__':
    main()
