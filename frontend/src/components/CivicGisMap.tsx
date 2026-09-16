"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { Map as LeafletMap, LayerGroup, TileLayer, Polygon } from "leaflet";
import {
  KADURAMA_OFFICIAL_BOUNDARY,
  BALAI_DESA_LOCATION,
} from "@/data/kaduramaBoundary";

export interface CivicPoint {
  id: string | number;
  name: string;
  category: "gov" | "dusun";
  categoryLabel: string;
  dusun: "all" | "manis" | "pahing" | "wage";
  lat: number;
  lng: number;
  elev?: string;
  description: string;
}

// Backward-compatibility alias
export type POIItem = CivicPoint;

// 100% Official Verified Point (Kantor Balai Desa Kadurama)
export const OFFICIAL_POINTS: CivicPoint[] = [
  {
    id: "balai-desa",
    name: BALAI_DESA_LOCATION.name,
    category: "gov",
    categoryLabel: "Pusat Pemerintahan Desa",
    dusun: "all",
    lat: BALAI_DESA_LOCATION.lat,
    lng: BALAI_DESA_LOCATION.lng,
    elev: "305 mdpl",
    description: `${BALAI_DESA_LOCATION.address} (Kemendagri Ref: 32.08.10.2002).`,
  },
];

export const POI_POINTS = OFFICIAL_POINTS;

export const DUSUN_CENTERS: Record<"all" | "manis" | "pahing" | "wage", [number, number]> = {
  all: [BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng],
  manis: [BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng],
  pahing: [BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng],
  wage: [BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng],
};

interface CivicGisMapProps {
  selectedDusun?: "all" | "manis" | "pahing" | "wage";
  selectedPoiId?: number | string | null;
  onSelectDusun?: (dusun: "all" | "manis" | "pahing" | "wage") => void;
  onSelectPoi?: (poi: CivicPoint) => void;
  basemapMode?: "satellite" | "streets";
  onToggleBasemap?: (mode: "satellite" | "streets") => void;
  showOuterBoundary?: boolean;
  onToggleOuterBoundary?: (show: boolean) => void;
  showDusunBoundaries?: boolean;
  showWaterways?: boolean;
}

export default function CivicGisMap({
  selectedDusun = "all",
  selectedPoiId = null,
  onSelectDusun,
  onSelectPoi,
  basemapMode: externalBasemapMode,
  onToggleBasemap,
  showOuterBoundary = true,
}: CivicGisMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<TileLayer | null>(null);
  const poiGroupRef = useRef<LayerGroup | null>(null);
  const boundaryLayerRef = useRef<Polygon | null>(null);

  // Stable callback refs to prevent map re-initialization on parent re-renders
  const onSelectDusunRef = useRef(onSelectDusun);
  onSelectDusunRef.current = onSelectDusun;
  const onSelectPoiRef = useRef(onSelectPoi);
  onSelectPoiRef.current = onSelectPoi;
  const onToggleBasemapRef = useRef(onToggleBasemap);
  onToggleBasemapRef.current = onToggleBasemap;

  const [internalBasemap, setInternalBasemap] = useState<"satellite" | "streets">("satellite");
  const activeBasemap = externalBasemapMode || internalBasemap;

  const [cursorCoords, setCursorCoords] = useState<string>(
    `${BALAI_DESA_LOCATION.lat.toFixed(5)}, ${BALAI_DESA_LOCATION.lng.toFixed(5)}`
  );

  const handleBasemapChange = (mode: "satellite" | "streets") => {
    setInternalBasemap(mode);
    if (onToggleBasemapRef.current) {
      onToggleBasemapRef.current(mode);
    }
  };

  const handleFitVillageBounds = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.stop();
    if (boundaryLayerRef.current) {
      try {
        mapRef.current.fitBounds(boundaryLayerRef.current.getBounds(), {
          padding: [32, 32],
          animate: true,
          duration: 0.6,
        });
      } catch {
        mapRef.current.setView([BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng], 15);
      }
    } else {
      mapRef.current.setView([BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng], 15);
    }
    if (onSelectDusunRef.current) onSelectDusunRef.current("all");
  }, []);

  // --------------------------------------------------------------------------
  // INITIALIZE MAP ONCE ON MOUNT (Zero Re-initialization / Zero Flickering)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let isMounted = true;

    // Clean up any stale leaflet ID to prevent container reuse error
    if ((containerRef.current as unknown as { _leaflet_id?: number })._leaflet_id) {
      delete (containerRef.current as unknown as { _leaflet_id?: number })._leaflet_id;
    }

    import("leaflet").then((L) => {
      if (!isMounted || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng],
        zoom: 15,
        minZoom: 13,
        maxZoom: 19,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      // Zoom Control (Bottom Right)
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Initial Basemap (Satellite)
      const initialLayerUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

      const tileLayer = L.tileLayer(initialLayerUrl, {
        maxZoom: 19,
        attribution: "© OpenStreetMap / Esri ArcGIS",
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // 100% Official Kemendagri Boundary Polygon (125 points)
      const boundary = L.polygon(KADURAMA_OFFICIAL_BOUNDARY, {
        color: "#009388",
        weight: 2.5,
        opacity: 0.95,
        fillColor: "#009388",
        fillOpacity: 0.12,
        dashArray: "6, 6",
      });

      boundary.bindTooltip(
        `<div class="p-1 text-center font-sans">
          <div class="font-bold text-xs text-slate-900">Batas Wilayah Desa Kadurama</div>
          <div class="text-[10px] text-[#009388] font-medium">GIS Dukcapil Kemendagri • Ref: 32.08.10.2002</div>
          <div class="text-[9px] text-slate-500 mt-0.5">125 Titik Koordinat Presisi</div>
        </div>`,
        { sticky: true }
      );

      boundary.on("mouseover", () => {
        boundary.setStyle({
          weight: 3.5,
          fillOpacity: 0.22,
          color: "#00bba7",
        });
      });
      boundary.on("mouseout", () => {
        boundary.setStyle({
          weight: 2.5,
          fillOpacity: 0.12,
          color: "#009388",
        });
      });

      boundary.addTo(map);
      boundaryLayerRef.current = boundary;

      // Fit bounds strictly without animation to avoid initial race
      try {
        map.fitBounds(boundary.getBounds(), {
          padding: [28, 28],
          animate: false,
        });
      } catch (err) {
        console.warn("fitBounds initial:", err);
      }

      // Group for Official Verified Marker (Kantor Balai Desa)
      const poiGroup = L.layerGroup().addTo(map);
      poiGroupRef.current = poiGroup;

      OFFICIAL_POINTS.forEach((poi) => {
        const pinHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute w-9 h-9 rounded-full bg-[#eda50c]/40 animate-ping"></div>
            <div class="relative w-8 h-8 rounded-full bg-[#eda50c] border-2 border-white shadow-xl flex items-center justify-center transition-transform transform group-hover:scale-110">
              <svg class="w-4 h-4 text-[#005851]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: pinHtml,
          className: "custom-verified-marker",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([poi.lat, poi.lng], {
          icon,
          title: poi.name,
          alt: poi.name,
        });

        marker.on("click", () => {
          if (onSelectPoiRef.current) onSelectPoiRef.current(poi);
        });

        marker.bindTooltip(
          `<div class="p-1.5 text-center font-sans">
            <div class="font-bold text-xs text-slate-900">${poi.name}</div>
            <div class="text-[10px] text-[#009388] font-medium">${poi.categoryLabel}</div>
            <div class="text-[9px] text-slate-500 font-mono mt-0.5">Ref: 32.08.10.2002</div>
          </div>`,
          { direction: "top", offset: [0, -12] }
        );

        poiGroup.addLayer(marker);
      });

      // Throttled real-time coordinates tracking
      let lastMoveTime = 0;
      map.on("mousemove", (e) => {
        const now = Date.now();
        if (now - lastMoveTime < 120) return;
        lastMoveTime = now;
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        setCursorCoords(`${lat}, ${lng}`);
      });

      mapRef.current = map;
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        try {
          mapRef.current.stop();
          mapRef.current.off();
          mapRef.current.remove();
        } catch (e) {
          console.warn("Leaflet cleanup notice:", e);
        }
        mapRef.current = null;
      }
    };
  }, []); // Run ONLY once on mount! Never destroy/recreate on parent re-renders!

  // Update Basemap Layer when mode changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current || !tileLayerRef.current) return;

      mapRef.current.removeLayer(tileLayerRef.current);

      const newUrl =
        activeBasemap === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

      const newLayer = L.tileLayer(newUrl, {
        maxZoom: 19,
        attribution: "© OpenStreetMap / Esri ArcGIS",
      }).addTo(mapRef.current);

      tileLayerRef.current = newLayer;
    });
  }, [activeBasemap]);

  // Keep track of previous selection to prevent accidental reset zooms
  const prevSelectionRef = useRef<{ dusun: string; poiId: string | number | null }>({
    dusun: selectedDusun,
    poiId: selectedPoiId,
  });

  // Pan / Fit Bounds ONLY when selectedDusun or selectedPoiId genuinely change
  useEffect(() => {
    if (!mapRef.current) return;

    const prev = prevSelectionRef.current;
    if (prev.dusun === selectedDusun && prev.poiId === selectedPoiId) {
      return; // No change in selection, do not trigger fitBounds or zoom jump!
    }
    prevSelectionRef.current = { dusun: selectedDusun, poiId: selectedPoiId };

    mapRef.current.stop();

    if (selectedDusun === "all" && !selectedPoiId && boundaryLayerRef.current) {
      try {
        mapRef.current.fitBounds(boundaryLayerRef.current.getBounds(), {
          padding: [28, 28],
          animate: true,
          duration: 0.6,
        });
      } catch {
        mapRef.current.setView(
          [BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng],
          15
        );
      }
    } else if (selectedPoiId === "balai-desa") {
      mapRef.current.flyTo(
        [BALAI_DESA_LOCATION.lat, BALAI_DESA_LOCATION.lng],
        17,
        { animate: true, duration: 0.6 }
      );
    }
  }, [selectedDusun, selectedPoiId]);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-900 select-none">
      <div ref={containerRef} className="w-full h-full min-h-[460px] z-10" />

      {/* Modern Floating Header Bar (Top-Right): Fit Wilayah + Basemap Switcher */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-wrap items-center justify-end gap-1.5 pointer-events-auto">
        {/* Fit Bounds Button */}
        <button
          type="button"
          onClick={handleFitVillageBounds}
          className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-md border border-slate-200/80 backdrop-blur-md transition flex items-center gap-1.5"
          title="Tampilkan Seluruh Wilayah Desa Kadurama"
        >
          <svg className="w-3.5 h-3.5 text-[#009388]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span>Fit Wilayah</span>
        </button>

        {/* Basemap Switcher */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-md flex items-center text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => handleBasemapChange("satellite")}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeBasemap === "satellite"
                ? "bg-[#009388] text-white font-bold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Satelit
          </button>
          <button
            type="button"
            onClick={() => handleBasemapChange("streets")}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeBasemap === "streets"
                ? "bg-[#009388] text-white font-bold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Peta Jalan
          </button>
        </div>
      </div>

      {/* Floating Info Badge Top-Left */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none hidden sm:flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 text-[11px] font-semibold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-[#009388] animate-pulse"></span>
          <span>Desa Kadurama • GIS Dukcapil Kemendagri</span>
        </div>
      </div>

      {/* Floating Coordinates Status Bar Bottom */}
      <div className="absolute bottom-3 left-3 right-14 z-[1000] flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-950/85 text-white text-[11px] pointer-events-none backdrop-blur-md border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Koordinat:{" "}
            <span className="font-mono text-emerald-400 font-semibold">{cursorCoords}</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Datum: <span className="font-mono text-amber-300 font-semibold">WGS 84</span>
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">Ref: 32.08.10.2002</span>
      </div>
    </div>
  );
}
