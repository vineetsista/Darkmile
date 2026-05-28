"use client";

import { useState } from "react";
import { Search, LayoutGrid, Table2, SlidersHorizontal } from "lucide-react";
import { MOCK_TRANSACTIONS, MOCK_PERMITS, MOCK_ENTITY_FILINGS, MOCK_PROPERTIES } from "@/lib/mock-data";
import { formatCurrency, formatRelativeDate, getPropertyTypeBadgeClass } from "@/lib/utils";

type FeedItem =
  | { kind: "transaction"; data: typeof MOCK_TRANSACTIONS[0]; prop: typeof MOCK_PROPERTIES[0] | undefined }
  | { kind: "permit"; data: typeof MOCK_PERMITS[0]; prop: typeof MOCK_PROPERTIES[0] | undefined }
  | { kind: "entity"; data: typeof MOCK_ENTITY_FILINGS[0] };

function TransactionCard({ item }: { item: Extract<FeedItem, { kind: "transaction" }> }) {
  const { data: txn, prop } = item;
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{prop?.address || "Unknown Property"}</h3>
          <div className="flex items-center gap-2">
            <span className={`badge ${getPropertyTypeBadgeClass(prop?.propertyType || "")}`}>{prop?.propertyType}</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop?.city}, {prop?.state}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="number-display font-bold text-base" style={{ color: "var(--violet)" }}>{txn.price ? formatCurrency(txn.price, true) : "—"}</div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>${txn.pricePerSF?.toFixed(0)}/SF</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div><span style={{ color: "var(--text-tertiary)" }}>Buyer: </span><span style={{ color: "var(--text-secondary)" }}>{txn.buyer}</span></div>
        <div><span style={{ color: "var(--text-tertiary)" }}>Seller: </span><span style={{ color: "var(--text-secondary)" }}>{txn.seller}</span></div>
        <div><span style={{ color: "var(--text-tertiary)" }}>SF: </span><span style={{ color: "var(--text-secondary)" }}>{prop?.squareFeet?.toLocaleString()}</span></div>
        <div><span style={{ color: "var(--text-tertiary)" }}>Recorded: </span><span style={{ color: "var(--text-secondary)" }}>{formatRelativeDate(txn.recordedDate)}</span></div>
      </div>
      {txn.aiInsight && (
        <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)", color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--violet)" }}>AI: </strong>{txn.aiInsight.slice(0, 160)}...
        </div>
      )}
    </div>
  );
}

function PermitCard({ item }: { item: Extract<FeedItem, { kind: "permit" }> }) {
  const { data: permit, prop } = item;
  const typeColors: Record<string, string> = { new_construction: "badge-emerald", renovation: "badge-cyan", demolition: "badge-rose", change_of_use: "badge-violet" };
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{prop?.address}</h3>
          <div className="flex items-center gap-2">
            <span className={`badge ${typeColors[permit.permitType] || "badge-cyan"}`}>{permit.permitType.replace("_", " ")}</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{permit.status}</span>
          </div>
        </div>
        <div className="number-display font-bold text-sm text-right" style={{ color: "var(--cyan)" }}>{permit.estimatedValue ? formatCurrency(permit.estimatedValue, true) : "—"}</div>
      </div>
      <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{permit.description?.slice(0, 120)}...</p>
      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{permit.applicant} · {formatRelativeDate(permit.filingDate)}</div>
    </div>
  );
}

function EntityCard({ item }: { item: Extract<FeedItem, { kind: "entity" }> }) {
  const ef = item.data;
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{ef.entityName}</h3>
          <div className="flex items-center gap-2">
            <span className={`badge ${ef.filingType === "formation" ? "badge-emerald" : ef.filingType === "dissolution" ? "badge-rose" : "badge-cyan"}`}>{ef.filingType}</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{ef.state}</span>
          </div>
        </div>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(ef.filingDate)}</span>
      </div>
      <div className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{ef.principalAddress}</div>
      {ef.aiInsight && <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", color: "var(--text-secondary)" }}><strong style={{ color: "var(--emerald)" }}>AI: </strong>{ef.aiInsight.slice(0, 140)}...</div>}
    </div>
  );
}

export default function DealsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState("all");

  const allItems: FeedItem[] = [
    ...MOCK_TRANSACTIONS.map((t) => ({ kind: "transaction" as const, data: t, prop: MOCK_PROPERTIES.find((p) => p.id === t.propertyId) })),
    ...MOCK_PERMITS.map((p) => ({ kind: "permit" as const, data: p, prop: MOCK_PROPERTIES.find((pr) => pr.id === p.propertyId) })),
    ...MOCK_ENTITY_FILINGS.map((e) => ({ kind: "entity" as const, data: e })),
  ];

  const filtered = allItems.filter((item) => {
    if (filter !== "all" && item.kind !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (item.kind === "transaction") return (item.prop?.address || "").toLowerCase().includes(q) || (item.data.buyer || "").toLowerCase().includes(q);
      if (item.kind === "permit") return (item.prop?.address || "").toLowerCase().includes(q) || (item.data.applicant || "").toLowerCase().includes(q);
      if (item.kind === "entity") return item.data.entityName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>Deal Flow</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>All territory activity — transactions, permits, and entity filings.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input className="dm-input pl-9" placeholder="Search addresses, buyers, entities..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          {[{ val: "all", label: "All" }, { val: "transaction", label: "Sales" }, { val: "permit", label: "Permits" }, { val: "entity", label: "Entities" }].map((f) => (
            <button key={f.val} onClick={() => setFilter(f.val)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: filter === f.val ? "rgba(139,92,246,0.15)" : "var(--surface)", border: `1px solid ${filter === f.val ? "rgba(139,92,246,0.4)" : "var(--border)"}`, color: filter === f.val ? "var(--violet-bright)" : "var(--text-secondary)" }}>
              {f.label}
            </button>
          ))}
          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <button onClick={() => setViewMode("grid")} className="p-2.5 transition-colors" style={{ background: viewMode === "grid" ? "var(--elevated)" : "var(--surface)", color: viewMode === "grid" ? "var(--violet)" : "var(--text-tertiary)", cursor: "pointer", border: "none" }}><LayoutGrid size={15} /></button>
            <button onClick={() => setViewMode("table")} className="p-2.5 transition-colors" style={{ background: viewMode === "table" ? "var(--elevated)" : "var(--surface)", color: viewMode === "table" ? "var(--violet)" : "var(--text-tertiary)", cursor: "pointer", border: "none" }}><Table2 size={15} /></button>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{filtered.length} results</div>

      {filtered.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
            <Search size={20} style={{ color: "var(--violet)" }} />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No results found</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Try a different search term or clear the filter.</p>
          <button onClick={() => { setSearch(""); setFilter("all"); }} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
            <SlidersHorizontal size={13} /> Clear filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div key={i}>
              {item.kind === "transaction" && <TransactionCard item={item} />}
              {item.kind === "permit" && <PermitCard item={item} />}
              {item.kind === "entity" && <EntityCard item={item} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dm-table">
              <thead>
                <tr><th>Type</th><th>Name / Address</th><th>Details</th><th>Value</th><th>Date</th></tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  if (item.kind === "transaction") {
                    return (
                      <tr key={i}>
                        <td><span className="badge badge-violet">Sale</span></td>
                        <td><div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.prop?.address}</div><div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.data.buyer}</div></td>
                        <td><div className="text-xs">{item.prop?.propertyType} · {item.prop?.squareFeet?.toLocaleString()} SF</div></td>
                        <td><div className="number-display text-xs font-bold" style={{ color: "var(--violet)" }}>{item.data.price ? formatCurrency(item.data.price, true) : "—"}</div></td>
                        <td><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(item.data.recordedDate)}</div></td>
                      </tr>
                    );
                  }
                  if (item.kind === "permit") {
                    return (
                      <tr key={i}>
                        <td><span className="badge badge-cyan">Permit</span></td>
                        <td><div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.prop?.address}</div><div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.data.applicant}</div></td>
                        <td><div className="text-xs">{item.data.permitType.replace("_", " ")}</div></td>
                        <td><div className="number-display text-xs font-bold" style={{ color: "var(--cyan)" }}>{item.data.estimatedValue ? formatCurrency(item.data.estimatedValue, true) : "—"}</div></td>
                        <td><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(item.data.filingDate)}</div></td>
                      </tr>
                    );
                  }
                  if (item.kind === "entity") {
                    return (
                      <tr key={i}>
                        <td><span className="badge badge-emerald">Entity</span></td>
                        <td><div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.data.entityName}</div><div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.data.principalAddress}</div></td>
                        <td><div className="text-xs">{item.data.filingType}</div></td>
                        <td><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>—</div></td>
                        <td><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(item.data.filingDate)}</div></td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
