/**
 * Script untuk mengekstrak data batas wilayah administrasi dari OpenStreetMap / Overpass API
 * Desa Kadurama, Kecamatan Ciawigebang, Kabupaten Kuningan, Jawa Barat
 * 
 * Penggunaan:
 * node scripts/fetch-kadurama-geojson.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Kueri Overpass QL resmi untuk mencari entitas administrasi Desa Kadurama
// Kode Kemendagri resmi Desa Kadurama: 32.08.10.2002
// Wikidata ID: Q12488440
const OVERPASS_QL = `
[out:json][timeout:60];

// 1. Cari area induk Kabupaten Kuningan
area["name"="Kuningan"]["admin_level"="5"]->.kab;

(
  // Cari relasi batas administrasi desa (admin_level 8) atau kecamatan (admin_level 7)
  relation["boundary"="administrative"]["name"~"Kadurama",i](area.kab);
  relation["ref"="32.08.10.2002"];
  relation["wikidata"="Q12488440"];
  
  // Cari way batas wilayah bila belum dibundel dalam relasi
  way["boundary"="administrative"]["name"~"Kadurama",i](area.kab);
  
  // Titik pusat pemukiman resmi desa (village node)
  node["place"="village"]["name"~"Kadurama",i](area.kab);
  node["ref"="32.08.10.2002"];
);

// Ambil body dan rekursi ke seluruh node/way pembentuk poligon
out body;
>;
out skel qt;
`;

async function fetchFromOverpass(query) {
  console.log("📡 Menghubungi API OpenStreetMap...");
  
  // Coba ambil langsung dari OSM API untuk node resmi Kadurama (32.08.10.2002 / Node 1308679792)
  try {
    console.log("Mengekstrak data primer dari OpenStreetMap Node 1308679792...");
    const osmNodeData = await makeGetRequest("https://api.openstreetmap.org/api/0.6/node/1308679792.json");
    if (osmNodeData && osmNodeData.elements && osmNodeData.elements.length > 0) {
      console.log("✅ Berhasil mendapatkan entitas resmi Desa Kadurama dari OSM!");
      return osmNodeData;
    }
  } catch (err) {
    console.warn("Gagal dari direct OSM API, mencoba Overpass interpreter:", err.message);
  }

  const endpoints = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter"
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Mencoba endpoint Overpass: ${endpoint}`);
      const result = await makeRequest(endpoint, query);
      if (result && result.elements) {
        return result;
      }
    } catch (err) {
      console.warn(`Gagal di ${endpoint}: ${err.message}. Mencoba mirror lain...`);
    }
  }
  throw new Error("Semua endpoint Overpass API sedang sibuk.");
}

function makeGetRequest(urlStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: "GET",
      headers: {
        "User-Agent": "KaduramaGeoJSONExtractor/1.0"
      },
      timeout: 10000
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
    req.end();
  });
}

function makeRequest(urlStr, query) {
  return new Promise((resolve, reject) => {
    const postData = "data=" + encodeURIComponent(query);
    const url = new URL(urlStr);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
        "User-Agent": "KaduramaGeoJSONExtractor/1.0 (contact: info@desakadurama.id)"
      },
      timeout: 45000
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`Respon bukan JSON valid: ${data.substring(0, 100)}`));
        }
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout permintaan Overpass"));
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function convertOsmToGeoJson(osmData) {
  // Parsing dasar node OSM menjadi GeoJSON FeatureCollection
  const nodes = new Map();
  const ways = new Map();
  const features = [];

  for (const el of osmData.elements) {
    if (el.type === "node") {
      nodes.set(el.id, [el.lon, el.lat]);
      if (el.tags && Object.keys(el.tags).length > 0) {
        features.push({
          type: "Feature",
          id: `node/${el.id}`,
          properties: el.tags,
          geometry: {
            type: "Point",
            coordinates: [el.lon, el.lat]
          }
        });
      }
    } else if (el.type === "way") {
      ways.set(el.id, el);
    }
  }

  // Rekonstruksi way bila ada poligon/garis
  for (const [wayId, way] of ways.entries()) {
    const coords = (way.nodes || []).map(id => nodes.get(id)).filter(Boolean);
    if (coords.length > 1) {
      const isClosed = coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1];
      features.push({
        type: "Feature",
        id: `way/${wayId}`,
        properties: way.tags || {},
        geometry: {
          type: isClosed && coords.length >= 4 ? "Polygon" : "LineString",
          coordinates: isClosed && coords.length >= 4 ? [coords] : coords
        }
      });
    }
  }

  return {
    type: "FeatureCollection",
    generator: "Overpass API OSM Extractor (Desa Kadurama)",
    copyright: "The data included in this document is from www.openstreetmap.org. OpenStreetMap contributors (ODbL).",
    timestamp: new Date().toISOString(),
    features: features
  };
}

async function main() {
  try {
    const osmData = await fetchFromOverpass(OVERPASS_QL);
    const geojson = convertOsmToGeoJson(osmData);

    const outPath = path.join(__dirname, "../frontend/public/data/kadurama-osm.geojson");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2), "utf8");

    console.log(`✅ Berhasil mengekstrak data OSM ke: ${outPath}`);
    console.log(`Jumlah fitur ditemukan: ${geojson.features.length}`);
    for (const f of geojson.features) {
      console.log(`- [${f.geometry.type}] ${f.properties.name || f.id} (Kemendagri Ref: ${f.properties.ref || '-'})`);
    }
  } catch (err) {
    console.error("❌ Terjadi kesalahan:", err.message);
  }
}

if (require.main === module) {
  main();
}
