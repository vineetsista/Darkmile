"use client";

import { useState } from "react";
import { MapPin, AlertCircle, ArrowUpRight, FileText } from "lucide-react";
import { MOCK_PROPERTIES, MOCK_OPPORTUNITIES, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  Industrial: "#06B6D4",
  Office: "#8B5CF6",
  Retail: "#F59E0B",
  Multifamily: "#10B981",
  "Mixed-Use": "#EC4899",
};

function MapFallback() {
  // Simulate a map with SVG dots on a grid
  const bounds = { minLat: 39.83, maxLat: 40.15, minLng: -83.12, maxLng: -82.78 };
  const toX = (lng: number) => ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const toY = (lat: number) => ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;

  return (
    <div className="relative w-full h-full map-fallback" style={{ minHeight: "500px" }}>
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Radar animation */}
      <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "400px" }}>
        <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(139,92,246,0.1)" }} />
        <div className="absolute inset-8 rounded-full" style={{ border: "1px solid rgba(139,92,246,0.08)" }} />
        <div className="absolute inset-16 rounded-full" style={{ border: "1px solid rgba(139,92,246,0.06)" }} />
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="radar-sweep absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, transparent 0deg, rgba(139,92,246,0.2) 30deg, transparent 60deg)" }} />
        </div>
      </div>

      {/* Properties */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {MOCK_PROPERTIES.map((p) => {
          if (!p.latitude || !p.longitude) return null;
          const x = toX(p.longitude);
          const y = toY(p.latitude);
          const color = TYPE_COLORS[p.propertyType] || "#8B5CF6";
          const opp = MOCK_OPPORTUNITIES.find((o) => o.propertyId === p.id);
          return (
            <g key={p.id}>
              {opp && opp.score >= 80 && (
                <circle cx={x} cy={y} r="2.5" fill={color} opacity="0.15">
                  <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r="1.2" fill={color} opacity="0.9" />
            </g>
          );
        })}
      </svg>

      {/* Map label */}
      <div className="absolute top-4 left-4 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(6,4,10,0.8)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
        📍 Franklin County, Ohio
      </div>

      {/* No token notice */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-xs" style={{ background: "rgba(6,4,10,0.8)", border: "1px solid var(--border)", color: "var(--text-tertiary)" }}>
        Add MAPBOX_ACCESS_TOKEN for full interactive map · Showing {MOCK_PROPERTIES.length} properties
      </div>
    </div>
  );
}

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState("transactions");
  const [selectedProp, setSelectedProp] = useState<typeof MOCK_PROPERTIES[0] | null>(null);

  const layers = [
    { val: "transactions", label: "Transactions", icon: <ArrowUpRight size={13} />, color: "var(--violet)" },
    { val: "permits", label: "Permits", icon: <FileText size={13} />, color: "var(--cyan)" },
    { val: "opportunities", label: "Opportunities", icon: <AlertCircle size={13} />, color: "var(--amber)" },
  ];

  return (
    <div className="h-full flex flex-col gap-4" style={{ height: "calc(100vh - 120px)" }}>
      {/* Controls */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>Territory Map</h1>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Franklin County, OH · {MOCK_PROPERTIES.length} properties tracked</p>
        </div>
        <div className="flex items-center gap-2">
          {layers.map((l) => (
            <button key={l.val} onClick={() => setActiveLayer(l.val)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: activeLayer === l.val ? `${l.color}15` : "var(--surface)", border: `1px solid ${activeLayer === l.val ? `${l.color}40` : "var(--border)"}`, color: activeLayer === l.val ? l.color : "var(--text-tertiary)" }}>
              {l.icon}{l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 rounded-2xl overflow-hidden">
          <MapFallback />
        </div>

        {/* Side panel */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3 overflow-y-auto">
          {/* Legend */}
          <div className="glass-card p-4">
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>Legend</div>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{type}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 py-1 mt-1">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: "var(--amber)", boxShadow: "0 0 6px var(--amber)" }} />
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>High-score opportunity</span>
            </div>
          </div>

          {/* Top opportunities on map */}
          <div className="glass-card p-4">
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--amber)" }}>Top Opportunities</div>
            <div className="space-y-3">
              {MOCK_OPPORTUNITIES.slice(0, 5).map((opp) => {
                const prop = MOCK_PROPERTIES.find((p) => p.id === opp.propertyId);
                const color = opp.score >= 85 ? "var(--emerald)" : opp.score >= 70 ? "var(--amber)" : "var(--cyan)";
                return (
                  <button key={opp.id} onClick={() => setSelectedProp(prop || null)} className="w-full text-left p-3 rounded-xl transition-all"
                    style={{ background: selectedProp?.id === prop?.id ? "rgba(139,92,246,0.1)" : "var(--surface)", border: `1px solid ${selectedProp?.id === prop?.id ? "rgba(139,92,246,0.3)" : "var(--border)"}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{prop?.address}</span>
                      <span className="number-display text-xs font-bold flex-shrink-0 ml-2" style={{ color }}>{opp.score}</span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop?.propertyType} · {prop?.city}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected property detail */}
          {selectedProp && (
            <div className="glass-card p-4" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={13} style={{ color: "var(--violet)" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--violet)" }}>Selected Property</span>
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{selectedProp.address}</h4>
              <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>{selectedProp.city}, {selectedProp.state} {selectedProp.zip}</p>
              <div className="space-y-2">
                {[
                  { label: "Type", value: selectedProp.propertyType },
                  { label: "Size", value: selectedProp.squareFeet ? `${selectedProp.squareFeet.toLocaleString()} SF` : "—" },
                  { label: "Owner", value: selectedProp.ownerName || "—" },
                  { label: "Owner Type", value: selectedProp.ownerType || "—" },
                  { label: "Assessed Value", value: selectedProp.assessedValue ? formatCurrency(selectedProp.assessedValue, true) : "—" },
                  { label: "Last Sale", value: selectedProp.lastSalePrice ? formatCurrency(selectedProp.lastSalePrice, true) : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedProp(null)} className="mt-3 text-xs" style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>Deselect ×</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
