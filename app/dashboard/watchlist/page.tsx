"use client";

import { useState } from "react";
import { Bookmark, Plus, X, Bell, FileText, ArrowUpRight, Check } from "lucide-react";
import { MOCK_PROPERTIES, MOCK_OPPORTUNITIES, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { formatCurrency, formatRelativeDate, getPropertyTypeBadgeClass } from "@/lib/utils";

type WatchedItem = {
  id: string;
  propertyId: string;
  notes: string;
  triggers: string[];
  addedDate: Date;
};

const DEFAULT_WATCHED: WatchedItem[] = [
  { id: "w1", propertyId: "prop_009", notes: "Estate disposition play — approach trustee Q3", triggers: ["ownership_change", "permit", "comparable_sale"], addedDate: new Date("2025-05-10") },
  { id: "w2", propertyId: "prop_011", notes: "Pre-sale cap-ex signal — monitor listing activity", triggers: ["listing", "permit", "price_change"], addedDate: new Date("2025-05-08") },
  { id: "w3", propertyId: "prop_004", notes: "Easton adjacent — watch anchor redevelopment", triggers: ["permit", "ownership_change"], addedDate: new Date("2025-05-05") },
];

const TRIGGER_LABELS: Record<string, string> = {
  ownership_change: "Ownership Change",
  permit: "New Permit",
  comparable_sale: "Comparable Sale",
  listing: "Listing Activity",
  price_change: "Price Change",
  entity_change: "Entity Change",
};

function WatchlistCard({ item, onRemove }: { item: WatchedItem; onRemove: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(item.notes);
  const prop = MOCK_PROPERTIES.find((p) => p.id === item.propertyId);
  const opp = MOCK_OPPORTUNITIES.find((o) => o.propertyId === item.propertyId);
  const recentTxn = MOCK_TRANSACTIONS.find((t) => t.propertyId === item.propertyId);
  const hasAlert = opp && opp.score >= 70;

  return (
    <div className={`glass-card p-5 ${hasAlert ? "opportunity-card" : ""}`} style={hasAlert ? {} : {}}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {hasAlert && <span className="badge badge-amber">ALERT</span>}
            <span className={`badge ${getPropertyTypeBadgeClass(prop?.propertyType || "")}`}>{prop?.propertyType}</span>
          </div>
          <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{prop?.address}</h3>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop?.city}, {prop?.state} · {prop?.squareFeet?.toLocaleString()} SF</p>
        </div>
        <div className="flex items-center gap-2">
          {opp && (
            <div className="number-display text-lg font-bold" style={{ color: opp.score >= 85 ? "var(--emerald)" : opp.score >= 70 ? "var(--amber)" : "var(--cyan)" }}>{opp.score}</div>
          )}
          <button onClick={() => onRemove(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--elevated)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-tertiary)" }}><X size={13} /></button>
        </div>
      </div>

      {/* Last activity */}
      {recentTxn && (
        <div className="mb-3 p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><ArrowUpRight size={12} style={{ color: "var(--violet)" }} /><span className="text-xs font-semibold" style={{ color: "var(--violet)" }}>Recent Transaction</span></div>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(recentTxn.recordedDate)}</span>
          </div>
          <div className="number-display text-sm font-bold mt-1" style={{ color: "var(--violet)" }}>{recentTxn.price ? formatCurrency(recentTxn.price, true) : "—"}</div>
        </div>
      )}

      {/* Triggers */}
      <div className="mb-3">
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-tertiary)" }}>Alert triggers:</div>
        <div className="flex flex-wrap gap-1.5">
          {item.triggers.map((t) => (
            <span key={t} className="badge badge-violet" style={{ fontSize: "10px" }}>{TRIGGER_LABELS[t] || t}</span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>Notes</div>
          <button onClick={() => setEditing(!editing)} className="text-xs" style={{ color: "var(--violet)", background: "none", border: "none", cursor: "pointer" }}>{editing ? "Save" : "Edit"}</button>
        </div>
        {editing ? (
          <textarea className="dm-input text-xs" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        ) : (
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{notes || <em style={{ color: "var(--text-muted)" }}>No notes added</em>}</p>
        )}
      </div>

      <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>Added {formatRelativeDate(item.addedDate)}</div>
    </div>
  );
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchedItem[]>(DEFAULT_WATCHED);
  const [showAdd, setShowAdd] = useState(false);
  const [searchProp, setSearchProp] = useState("");

  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));

  const addProp = (propId: string) => {
    if (items.find((i) => i.propertyId === propId)) return;
    setItems([...items, { id: `w${Date.now()}`, propertyId: propId, notes: "", triggers: ["ownership_change", "permit"], addedDate: new Date() }]);
    setShowAdd(false);
    setSearchProp("");
  };

  const filteredProps = MOCK_PROPERTIES.filter((p) => {
    if (!searchProp) return true;
    return p.address.toLowerCase().includes(searchProp.toLowerCase()) || p.city.toLowerCase().includes(searchProp.toLowerCase());
  }).filter((p) => !items.find((i) => i.propertyId === p.id));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>Watchlist</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{items.length} properties tracked · Get alerted on ownership changes, permits, and more.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}><Plus size={14} /> Add Property</button>
      </div>

      {/* Add property search */}
      {showAdd && (
        <div className="glass-card p-5" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Add property to watchlist</h3>
          <input className="dm-input mb-3" placeholder="Search address or city..." value={searchProp} onChange={(e) => setSearchProp(e.target.value)} />
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredProps.slice(0, 8).map((p) => (
              <button key={p.id} onClick={() => addProp(p.id)} className="w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer" }}>
                <div>
                  <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{p.address}</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{p.city} · {p.propertyType}</div>
                </div>
                <Plus size={14} style={{ color: "var(--violet)", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Alert summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Properties Watched", value: items.length, color: "var(--violet)", icon: <Bookmark size={16} /> },
          { label: "Active Alerts", value: items.filter((i) => MOCK_OPPORTUNITIES.find((o) => o.propertyId === i.propertyId && o.score >= 70)).length, color: "var(--amber)", icon: <Bell size={16} /> },
          { label: "Recent Activity", value: items.filter((i) => MOCK_TRANSACTIONS.find((t) => t.propertyId === i.propertyId)).length, color: "var(--emerald)", icon: <Check size={16} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="metric-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
              <span style={{ color }}>{icon}</span>
            </div>
            <div className="number-display font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{value}</div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Watchlist grid */}
      {items.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => <WatchlistCard key={item.id} item={item} onRemove={remove} />)}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Bookmark size={32} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No properties watched yet</h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Add properties from any opportunity alert or deal card.</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}><Plus size={14} /> Add First Property</button>
        </div>
      )}
    </div>
  );
}
