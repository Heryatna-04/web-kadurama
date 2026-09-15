"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, Polygon, Polyline } from "leaflet";

export interface POIItem {
  id: number;
  name: string;
  dusun: "Manis" | "Pahing" | "Wage";
  cat: string;
  lat: number;
  lng: number;
  elev: string;
}

interface CivicGisMapProps {
  selectedDusun: "all" | "manis" | "pahing" | "wage";
  selectedPoiId: number | null;
  onSelectDusun: (dusun: "all" | "manis" | "pahing" | "wage") => void;
  onSelectPoi: (poi: POIItem) => void;
  showOuterBoundary: boolean;
  showDusunBoundaries: boolean;
  showWaterways: boolean;
}

// -----------------------------------------------------------------------------
// GEOMETRY & COORDINATES DATA (DESA KADURAMA, CIAWIGEBANG, KUNINGAN)
// -----------------------------------------------------------------------------
const KADURAMA_OUTER: [number, number][] = [
  [-6.9710, 108.5940],
  [-6.9715, 108.6048],
  [-6.9848, 108.6058],
  [-6.9862, 108.5932],
  [-6.9785, 108.5940],
  [-6.9710, 108.5940]
];

const DUSUN_POLYS: Record<"manis" | "pahing" | "wage", [number, number][]> = {
  manis: [
    [-6.9712, 108.5942],
    [-6.9715, 108.6020],
    [-6.9775, 108.6025],
    [-6.9790, 108.5980],
    [-6.9785, 108.5942],
    [-6.9712, 108.5942]
  ],
  pahing: [
    [-6.9715, 108.6020],
    [-6.9718, 108.6048],
    [-6.9848, 108.6058],
    [-6.9855, 108.5985],
    [-6.9790, 108.5980],
    [-6.9775, 108.6025],
    [-6.9715, 108.6020]
  ],
  wage: [
    [-6.9785, 108.5942],
    [-6.9790, 108.5980],
    [-6.9855, 108.5985],
    [-6.9862, 108.5932],
    [-6.9785, 108.5942]
  ]
};

const WATER_LINES: [number, number][][] = [
  [[-6.9715, 108.5960], [-6.9750, 108.5975], [-6.9810, 108.5985], [-6.9860, 108.5990]],
  [[-6.9815, 108.5945], [-6.9810, 108.5985], [-6.9820, 108.6040]]
];

export const POI_POINTS: POIItem[] = [
  { id: 1, name: "Balai Desa Kadurama", dusun: "Manis", cat: "gov", lat: -6.9765, lng: 108.5975, elev: "312 mdpl" },
  { id: 2, name: "SDN Kadurama & Pustu", dusun: "Manis", cat: "edu", lat: -6.9740, lng: 108.5968, elev: "314 mdpl" },
  { id: 3, name: "Masjid Jami Al-Huda", dusun: "Manis", cat: "rel", lat: -6.9772, lng: 108.5985, elev: "310 mdpl" },
  { id: 4, name: "Lumbung Padi Organik 64 Ha", dusun: "Pahing", cat: "agr", lat: -6.9790, lng: 108.6025, elev: "295 mdpl" },
  { id: 5, name: "Gelora Kadurama (Stadion Mini)", dusun: "Pahing", cat: "sport", lat: -6.9825, lng: 108.6030, elev: "298 mdpl" },
  { id: 6, name: "Mata Air Purba Cikaduran 45 L/s", dusun: "Wage", cat: "water", lat: -6.9818, lng: 108.5950, elev: "338 mdpl" },
  { id: 7, name: "Sentra Sapi Perah & Biogas", dusun: "Wage", cat: "farm", lat: -6.9845, lng: 108.5960, elev: "340 mdpl" }
];

export const DUSUN_CENTERS: Record<"all" | "manis" | "pahing" | "wage", [number, number]> = {
  all: [-6.9782, 108.5982],
  manis: [-6.9755, 108.5980],
  pahing: [-6.9785, 108.6020],
  wage: [-6.9825, 108.5955]
};

export default function CivicGisMap({
  selectedDusun,
  selectedPoiId,
  onSelectDusun,
  onSelectPoi,
  showOuterBoundary = false,
  showDusunBoundaries = false,
  showWaterways = true
}: CivicGisMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const outerLayerRef = useRef<Polygon | null>(null);
  const dusunsGroupRef = useRef<LayerGroup | null>(null);
  const waterGroupRef = useRef<LayerGroup | null>(null);
  const poiGroupRef = useRef<LayerGroup | null>(null);

  const [cursorCoords, setCursorCoords] = useState<string>("-6.9782, 108.5982");
  const [cursorElev, setCursorElev] = useState<string>("312 mdpl");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet to ensure SSR safety in Next.js
    import("leaflet").then((L) => {
      if (!isMounted || !containerRef.current || mapRef.current) return;

      // Initialize Leaflet Map with locked zoom (Scale 1:5.000) to prevent scroll-hijacking
      const map = L.map(containerRef.current, {
        center: [-6.9782, 108.5982],
        zoom: 15,
        minZoom: 15,
        maxZoom: 15,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false
      });

      // Pure Satellite Basemap (ArcGIS World Imagery High-Res)
      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 }
      );
      satelliteLayer.addTo(map);

      // Layer Groups
      const dusunsGroup = L.layerGroup();
      if (showDusunBoundaries) dusunsGroup.addTo(map);

      const waterGroup = L.layerGroup();
      if (showWaterways) waterGroup.addTo(map);

      const poiGroup = L.layerGroup().addTo(map);

      dusunsGroupRef.current = dusunsGroup;
      waterGroupRef.current = waterGroup;
      poiGroupRef.current = poiGroup;

      // 1. Outer Village Boundary (Gold Kuningan #eda50c) - Optional / Hidden by default
      const outerPoly = L.polygon(KADURAMA_OUTER, {
        color: "#eda50c",
        weight: 3.5,
        dashArray: "8, 6",
        fillOpacity: 0.04,
        fillColor: "#eda50c"
      });
      if (showOuterBoundary) outerPoly.addTo(map);
      outerLayerRef.current = outerPoly;

      // 2. Dusun Boundaries (Manis, Pahing, Wage)
      const colors: Record<"manis" | "pahing" | "wage", string> = {
        manis: "#009388",
        pahing: "#10b981",
        wage: "#0284c7"
      };

      (["manis", "pahing", "wage"] as const).forEach((key) => {
        const poly = L.polygon(DUSUN_POLYS[key], {
          color: colors[key],
          weight: 2.5,
          fillColor: colors[key],
          fillOpacity: 0.22,
          dashArray: "4, 4"
        });

        poly.on("mouseover", function () {
          poly.setStyle({ fillOpacity: 0.42, weight: 3.5 });
        });
        poly.on("mouseout", function () {
          poly.setStyle({ fillOpacity: 0.22, weight: 2.5 });
        });
        poly.on("click", () => {
          onSelectDusun(key);
        });
        poly.bindTooltip(`<b>DUSUN ${key.toUpperCase()}</b>`, { sticky: true });

        dusunsGroup.addLayer(poly);
      });

      // 3. Waterways & Irrigation Lines
      WATER_LINES.forEach((line) => {
        const pl = L.polyline(line, {
          color: "#0284c7",
          weight: 3.0,
          opacity: 0.85
        });
        waterGroup.addLayer(pl);
      });

      // 4. Civic Facility POI Pins
      POI_POINTS.forEach((poi) => {
        const pinHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="absolute w-6 h-6 rounded-full bg-[#009388]/40 civic-pulse"></div>
            <div class="w-5 h-5 rounded-full bg-white border-2 border-[#009388] shadow-sm flex items-center justify-center">
              <span class="w-1.5 h-1.5 rounded-full bg-[#009388]"></span>
            </div>
          </div>
        `;
        const icon = L.divIcon({
          html: pinHtml,
          className: "custom-poi-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([poi.lat, poi.lng], { icon });
        marker.on("click", () => {
          onSelectPoi(poi);
        });
        marker.bindTooltip(
          `<b>${poi.name}</b><br><span style="color:#64748b; font-size:10px;">${poi.elev}</span>`,
          { direction: "top", offset: [0, -8] }
        );

        poiGroup.addLayer(marker);
      });

      // Real-time coordinates & elevation tracking on mousemove
      map.on("mousemove", (e) => {
        const lat = e.latlng.lat.toFixed(4);
        const lng = e.latlng.lng.toFixed(4);
        setCursorCoords(`${lat}, ${lng}`);
        const elev = Math.round(290 + (e.latlng.lng - 108.593) * -120 + (-6.970 - e.latlng.lat) * 180);
        setCursorElev(`${Math.max(285, Math.min(345, elev))} mdpl`);
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

  // Pan to selected Dusun
  useEffect(() => {
    if (!mapRef.current) return;
    const center = DUSUN_CENTERS[selectedDusun] || DUSUN_CENTERS.all;
    mapRef.current.panTo(center, { animate: true, duration: 0.8 });
  }, [selectedDusun]);

  // Pan to selected POI
  useEffect(() => {
    if (!mapRef.current || selectedPoiId === null) return;
    const poi = POI_POINTS.find((p) => p.id === selectedPoiId);
    if (poi) {
      mapRef.current.panTo([poi.lat, poi.lng], { animate: true, duration: 0.8 });
    }
  }, [selectedPoiId]);

  // Toggle Outer Boundary
  useEffect(() => {
    if (!mapRef.current || !outerLayerRef.current) return;
    if (showOuterBoundary) {
      mapRef.current.addLayer(outerLayerRef.current);
    } else {
      mapRef.current.removeLayer(outerLayerRef.current);
    }
  }, [showOuterBoundary]);

  // Toggle Dusuns
  useEffect(() => {
    if (!mapRef.current || !dusunsGroupRef.current) return;
    if (showDusunBoundaries) {
      mapRef.current.addLayer(dusunsGroupRef.current);
    } else {
      mapRef.current.removeLayer(dusunsGroupRef.current);
    }
  }, [showDusunBoundaries]);

  // Toggle Waterways
  useEffect(() => {
    if (!mapRef.current || !waterGroupRef.current) return;
    if (showWaterways) {
      mapRef.current.addLayer(waterGroupRef.current);
    } else {
      mapRef.current.removeLayer(waterGroupRef.current);
    }
  }, [showWaterways]);

  return (
    <div className="relative w-full h-full min-h-[460px]">
      <div ref={containerRef} className="w-full h-full min-h-[460px] z-10" />

      {/* Floating Status Badge Top-Left */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-2 text-[11px] font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#009388]"></span>
          <span>Citra Satelit Resolusi Tinggi</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-normal">Skala Tetap 1:5.000</span>
        </div>
      </div>

      {/* Floating Coordinates Status Bar Bottom */}
      <div className="absolute bottom-3 inset-x-3 z-[1000] flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/80 text-white text-[11px] pointer-events-none backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Posisi Kursor: <span className="font-mono text-emerald-400 font-semibold">{cursorCoords}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Elevasi: <span className="font-mono text-amber-300 font-semibold">{cursorElev}</span>
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">WGS 84 / UTM 49S</span>
      </div>
    </div>
  );
}
