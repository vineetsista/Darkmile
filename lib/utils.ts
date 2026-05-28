import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatSF(sqft: number): string {
  return `${formatNumber(sqft)} SF`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "var(--emerald)";
  if (score >= 70) return "var(--amber)";
  if (score >= 50) return "var(--cyan)";
  return "var(--text-tertiary)";
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Exceptional";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Moderate";
  return "Low";
}

export function getScoreBadgeClass(score: number): string {
  if (score >= 85) return "badge-emerald";
  if (score >= 70) return "badge-amber";
  if (score >= 50) return "badge-cyan";
  return "";
}

export function getPropertyTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Industrial: "var(--cyan)",
    Office: "var(--violet)",
    Retail: "var(--amber)",
    Multifamily: "var(--emerald)",
    "Mixed-Use": "#EC4899",
    Land: "#84CC16",
    Hospitality: "#F97316",
    Healthcare: "#14B8A6",
    "Self-Storage": "#A78BFA",
    "Data Center": "#06B6D4",
  };
  return colors[type] || "var(--text-secondary)";
}

export function getPropertyTypeBadgeClass(type: string): string {
  const classes: Record<string, string> = {
    Industrial: "badge-cyan",
    Office: "badge-violet",
    Retail: "badge-amber",
    Multifamily: "badge-emerald",
    "Mixed-Use": "badge-violet",
  };
  return classes[type] || "badge-violet";
}

export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    sale: "Sale",
    lease: "Lease",
    foreclosure: "Foreclosure",
    refinance: "Refinance",
  };
  return labels[type] || type;
}

export function getPermitTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    new_construction: "New Construction",
    renovation: "Renovation",
    demolition: "Demolition",
    change_of_use: "Change of Use",
  };
  return labels[type] || type;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
