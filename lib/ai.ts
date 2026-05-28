import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const USE_MOCK = !client;

// ─── Types ─────────────────────────────────────────────────────────────────

export type OpportunityFactor = {
  label: string;
  weight: number;
  description: string;
};

export type ScoredOpportunity = {
  score: number;
  narrative: string;
  factors: OpportunityFactor[];
  recommendedAction: string;
  estimatedValue: number | null;
};

export type DealInsight = {
  summary: string;
  significance: string;
  suggestedActions: string[];
};

// ─── Helpers ───────────────────────────────────────────────────────────────

async function chat(system: string, user: string): Promise<string> {
  if (USE_MOCK) throw new Error("mock");
  const res = await client!.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
    max_tokens: 600,
  });
  return res.choices[0].message.content ?? "";
}

// ─── Opportunity Scoring ───────────────────────────────────────────────────

export async function scoreOpportunity(propertyData: {
  address: string;
  propertyType: string;
  ownerType: string;
  ownerName: string;
  lastSaleDate?: string;
  assessedValue?: number;
  squareFeet?: number;
  recentPermits: string[];
  recentTransactions: string[];
  entityChanges: string[];
}): Promise<ScoredOpportunity> {
  const system = `You are a CRE deal intelligence engine. Analyze properties and return JSON with:
{ score: 0-100, narrative: string, factors: [{label, weight, description}], recommendedAction: string, estimatedValue: number|null }
Score based on: owner distress signals, holding period, permit activity, entity changes, market timing.`;

  const user = JSON.stringify(propertyData);

  try {
    const raw = await chat(system, user);
    return JSON.parse(raw) as ScoredOpportunity;
  } catch {
    return mockScoreOpportunity(propertyData);
  }
}

function mockScoreOpportunity(data: { ownerType: string; recentPermits: string[]; recentTransactions: string[]; entityChanges: string[] }): ScoredOpportunity {
  const base = data.ownerType === "LLC" ? 60 : data.ownerType === "Individual" ? 75 : 50;
  const permitBoost = data.recentPermits.length * 5;
  const entityBoost = data.entityChanges.length * 8;
  const score = Math.min(98, base + permitBoost + entityBoost);

  return {
    score,
    narrative: `Analysis indicates ${score >= 80 ? "strong" : score >= 65 ? "moderate" : "low"} off-market potential based on ownership structure and recent activity patterns. Owner signals suggest potential disposition within 12–18 months.`,
    factors: [
      { label: "Ownership Structure", weight: 30, description: `${data.ownerType} ownership with typical holding characteristics` },
      { label: "Permit Activity", weight: 25, description: data.recentPermits.length ? `${data.recentPermits.length} recent permit(s) indicating capital investment` : "No recent permit activity" },
      { label: "Entity Changes", weight: 25, description: data.entityChanges.length ? `${data.entityChanges.length} entity filing(s) detected` : "Stable entity structure" },
      { label: "Market Timing", weight: 20, description: "Current market conditions favor acquisition outreach" },
    ],
    recommendedAction: score >= 80 ? "Immediate outreach recommended" : score >= 65 ? "Monitor and prepare outreach within 30 days" : "Add to watchlist for ongoing monitoring",
    estimatedValue: null,
  };
}

// ─── Executive Summary ─────────────────────────────────────────────────────

export async function generateExecutiveSummary(data: {
  date: string;
  county: string;
  transactionCount: number;
  permitCount: number;
  entityFilings: number;
  topOpportunities: string[];
  totalVolume: number;
}): Promise<string> {
  const system = `You are a CRE market intelligence analyst. Write a concise executive briefing paragraph (3–4 sentences) for a commercial real estate broker. Focus on actionable insights, market momentum, and specific opportunities. Tone: confident, data-driven, professional.`;

  const user = `Market data for ${data.county} on ${data.date}:
- ${data.transactionCount} transactions recorded, $${(data.totalVolume / 1000000).toFixed(1)}M total volume
- ${data.permitCount} new permits filed
- ${data.entityFilings} entity filings detected
- Top opportunities: ${data.topOpportunities.join(", ")}`;

  try {
    return await chat(system, user);
  } catch {
    return `${data.county} market activity remains elevated with ${data.transactionCount} transactions totaling $${(data.totalVolume / 1000000).toFixed(1)}M recorded in today's briefing window. ${data.permitCount} new permits signal active development interest, while ${data.entityFilings} entity filings warrant closer review for off-market acquisition signals. ${data.topOpportunities.length} high-score opportunities have been identified for immediate outreach — review opportunity alerts for prioritized action items.`;
  }
}

// ─── Deal Insight ──────────────────────────────────────────────────────────

export async function generateDealInsight(deal: {
  type: "transaction" | "permit" | "entity";
  address?: string;
  propertyType?: string;
  buyer?: string;
  seller?: string;
  price?: number;
  permitType?: string;
  entityName?: string;
  filingType?: string;
}): Promise<string> {
  const system = `You are a CRE deal analyst. Write a single insight sentence (max 200 chars) about the significance of this deal for a broker prospecting off-market opportunities. Be specific and actionable.`;

  const user = JSON.stringify(deal);

  try {
    return await chat(system, user);
  } catch {
    if (deal.type === "transaction") {
      return `${deal.buyer || "Buyer"} acquisition of ${deal.propertyType || "commercial"} asset at ${deal.address} signals active portfolio expansion — potential adjacent dispositions worth monitoring.`;
    }
    if (deal.type === "permit") {
      return `${deal.permitType?.replace("_", " ") || "Permit"} activity at ${deal.address} indicates owner capital commitment — watch for value-add exit within 24–36 months.`;
    }
    return `${deal.entityName} ${deal.filingType} filing detected — cross-reference against known property holdings for disposition signals.`;
  }
}

// ─── Outreach Draft ────────────────────────────────────────────────────────

export async function generateOutreachDraft(context: {
  brokerName: string;
  brokerFirm: string;
  ownerName: string;
  propertyAddress: string;
  propertyType: string;
  opportunityNarrative: string;
}): Promise<string> {
  const system = `You are a seasoned CRE broker helping write a cold outreach letter. Write a professional, concise letter (3 short paragraphs) to a property owner about acquisition interest. Avoid being pushy. Sound knowledgeable about the local market. Do not include [brackets] or placeholders.`;

  const user = `Broker: ${context.brokerName} at ${context.brokerFirm}
Owner: ${context.ownerName}
Property: ${context.propertyAddress} (${context.propertyType})
Context: ${context.opportunityNarrative}`;

  try {
    return await chat(system, user);
  } catch {
    return `Dear ${context.ownerName},

My name is ${context.brokerName} with ${context.brokerFirm}. I specialize in commercial real estate transactions throughout the Franklin County market and have been tracking activity near your property at ${context.propertyAddress}.

I have an active group of qualified buyers with interest in ${context.propertyType} assets in this corridor. If you have any interest in exploring a confidential conversation about the current market value of your property — with no obligation — I would welcome the opportunity to connect.

I will follow up briefly, but please feel free to reach me directly at your convenience. Thank you for your time.

Best regards,
${context.brokerName}
${context.brokerFirm}`;
  }
}
