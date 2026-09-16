"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, TileLayer } from "leaflet";

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

// Verified Real Entities (0 Fake Names, 0 Mock Waterways)
export const OFFICIAL_POINTS: CivicPoint[] = [
  {
    id: "balai-desa",
    name: "Kantor Balai Desa Kadurama",
    category: "gov",
    categoryLabel: "Pusat Pemerintahan Desa",
    dusun: "manis",
    lat: -6.978256,
    lng: 108.598226,
    elev: "312 mdpl",
    description: "Jl. Desa Kadurama No. 01, Kec. Ciawigebang, Kab. Kuningan 45591 (Kemendagri Ref: 32.08.10.2002).",
  },
  {
    id: "dusun-manis",
    name: "Wilayah Dusun Manis (Dusun III)",
    category: "dusun",
    categoryLabel: "Sentra Pemerintahan & Pelayanan Publik",
    dusun: "manis",
    lat: -6.9765,
    lng: 108.5975,
    elev: "285 mdpl",
    description: "Sentra administrasi publik menaungi Kantor Balai Desa, KUA, SDN Kadurama, mushola, dan Posyandu (3 RT / 1 RW). Kepala Dusun: Bpk. Jamaludin.",
  },
  {
    id: "dusun-pahing",
    name: "Wilayah Dusun Pahing (Dusun I)",
    category: "dusun",
    categoryLabel: "Lumbung Pertanian & Pangan Desa",
    dusun: "pahing",
    lat: -6.9785,
    lng: 108.6025,
    elev: "310 mdpl",
    description: "Hamparan sawah produktif dan pemukiman warga Dusun I (3 RT / 1 RW). Kepala Dusun: Bpk. Trida Sentosa.",
  },
  {
    id: "dusun-wage",
    name: "Wilayah Dusun Wage (Dusun II)",
    category: "dusun",
    categoryLabel: "Wilayah Kontur Sejuk Lereng",
    dusun: "wage",
    lat: -6.9825,
    lng: 108.5955,
    elev: "340 mdpl",
    description: "Kontur sejuk kaki Gunung Ciremai menaungi sarana ibadah, pendidikan, dan pemukiman Dusun II (2 RT / 1 RW). Kepala Dusun: Bpk. Andri Rukmana.",
  },
];

// Alias for backwards compatibility
export const POI_POINTS = OFFICIAL_POINTS;

export const DUSUN_CENTERS: Record<"all" | "manis" | "pahing" | "wage", [number, number]> = {
  all: [-6.978256, 108.598226],
  manis: [-6.9765, 108.5975],
  pahing: [-6.9785, 108.6025],
  wage: [-6.9825, 108.5955],
};

interface CivicGisMapProps {
  selectedDusun: "all" | "manis" | "pahing" | "wage";
  selectedPoiId?: number | string | null;
  onSelectDusun: (dusun: "all" | "manis" | "pahing" | "wage") => void;
  onSelectPoi: (poi: CivicPoint) => void;
  // Basemap switcher support
  basemapMode?: "satellite" | "streets";
  onToggleBasemap?: (mode: "satellite" | "streets") => void;
  // Legacy props (safely ignored, 0 fake layers rendered)
  showOuterBoundary?: boolean;
  showDusunBoundaries?: boolean;
  showWaterways?: boolean;
}

export default function CivicGisMap({
  selectedDusun,
  selectedPoiId,
  onSelectDusun,
  onSelectPoi,
  basemapMode: externalBasemapMode,
  onToggleBasemap,
}: CivicGisMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<TileLayer | null>(null);
  const poiGroupRef = useRef<LayerGroup | null>(null);

  const [internalBasemap, setInternalBasemap] = useState<"satellite" | "streets">("satellite");
  const activeBasemap = externalBasemapMode || internalBasemap;

  const [cursorCoords, setCursorCoords] = useState<string>("-6.9782, 108.5982");

  const handleBasemapChange = (mode: "satellite" | "streets") => {
    setInternalBasemap(mode);
    if (onToggleBasemap) {
      onToggleBasemap(mode);
    }
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet for SSR safety in Next.js
    import("leaflet").then((L) => {
      if (!isMounted || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [-6.978256, 108.598226],
        zoom: 15,
        minZoom: 14,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      // Default Basemap: High-Res Satellite
      const initialLayerUrl =
        activeBasemap === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

      const tileLayer = L.tileLayer(initialLayerUrl, {
        maxZoom: 19,
        attribution: "© OpenStreetMap / Esri ArcGIS",
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Group for Official Verified Markers
      const poiGroup = L.layerGroup().addTo(map);
      poiGroupRef.current = poiGroup;

      // Render Verified Markers Only
      OFFICIAL_POINTS.forEach((poi) => {
        const isBalaiDesa = poi.id === "balai-desa";
        const pinHtml = isBalaiDesa
          ? `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="absolute w-8 h-8 rounded-full bg-[#eda50c]/40 animate-ping"></div>
              <div class="relative w-7 h-7 rounded-full bg-[#009388] border-2 border-white shadow-lg flex items-center justify-center text-white">
                <svg class="w-4 h-4 text-[#eda50c]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 9l2 1v10h6v-6h4v6h6V10l2-1-10-7zm0 3.2L18 9v9h-2v-6H8v6H6V9l6-3.8z"/>
                </svg>
              </div>
            </div>
          `
          : `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-6 h-6 rounded-full bg-white border-2 border-[#009388] shadow-md flex items-center justify-center">
                <span class="w-2.5 h-2.5 rounded-full bg-[#009388]"></span>
              </div>
            </div>
          `;

        const icon = L.divIcon({
          html: pinHtml,
          className: "custom-verified-marker",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([poi.lat, poi.lng], {
          icon,
          title: poi.name,
          alt: poi.name,
        });

        marker.on("click", () => {
          onSelectPoi(poi);
        });

        marker.bindTooltip(
          `<div class="p-1 text-center">
            <div class="font-bold text-xs text-slate-900">${poi.name}</div>
            <div class="text-[10px] text-[#009388] font-medium">${poi.categoryLabel}</div>
          </div>`,
          { direction: "top", offset: [0, -10] }
        );

        poiGroup.addLayer(marker);
      });

      // Throttled real-time coordinates tracking (~8 FPS)
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
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onSelectDusun, onSelectPoi]);

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

  // Pan to selected Dusun or All
  useEffect(() => {
    if (!mapRef.current) return;
    const center = DUSUN_CENTERS[selectedDusun] || DUSUN_CENTERS.all;
    const zoom = selectedDusun === "all" ? 15 : 16;
    mapRef.current.flyTo(center, zoom, { animate: true, duration: 0.8 });
  }, [selectedDusun]);

  // Pan to selected POI
  useEffect(() => {
    if (!mapRef.current || !selectedPoiId) return;
    const poi = OFFICIAL_POINTS.find((p) => p.id === selectedPoiId);
    if (poi) {
      mapRef.current.flyTo([poi.lat, poi.lng], 17, { animate: true, duration: 0.8 });
    }
  }, [selectedPoiId]);

  return (
    <div className="relative w-full h-full min-h-[460px]">
      <div ref={containerRef} className="w-full h-full min-h-[460px] z-10" />

      {/* Floating Status & Basemap Switcher Top-Right */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-md flex items-center text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => handleBasemapChange("satellite")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeBasemap === "satellite"
                ? "bg-[#009388] text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Citra Satelit
          </button>
          <button
            type="button"
            onClick={() => handleBasemapChange("streets")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeBasemap === "streets"
                ? "bg-[#009388] text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Peta Jalan (OSM)
          </button>
        </div>
      </div>

      {/* Floating Info Badge Top-Left */}
      <div className="absolute top-3 left-12 z-[1000] pointer-events-none hidden sm:flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-2 text-[11px] font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#009388]"></span>
          <span>Desa Kadurama • Titik Resmi Kemendagri</span>
        </div>
      </div>

      {/* Floating Coordinates Status Bar Bottom */}
      <div className="absolute bottom-3 inset-x-3 z-[1000] flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/85 text-white text-[11px] pointer-events-none backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Koordinat Kursor: <span className="font-mono text-emerald-400 font-semibold">{cursorCoords}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Basis Koordinat: <span className="font-mono text-amber-300 font-semibold">WGS 84</span>
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">Ref: 32.08.10.2002</span>
      </div>
    </div>
  );
}
