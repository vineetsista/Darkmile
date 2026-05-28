import { MOCK_BRIEFING_SUMMARY, MOCK_OPPORTUNITIES, MOCK_TRANSACTIONS, MOCK_PERMITS } from "@/lib/mock-data";
import { generateExecutiveSummary } from "@/lib/ai";

export async function GET() {
  const totalVolume = MOCK_TRANSACTIONS.reduce((sum, t) => sum + (t.price ?? 0), 0);

  const summary = await generateExecutiveSummary({
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    county: "Franklin County, OH",
    transactionCount: MOCK_TRANSACTIONS.length,
    permitCount: MOCK_PERMITS.length,
    entityFilings: 6,
    topOpportunities: MOCK_OPPORTUNITIES.slice(0, 3).map((o) => `Score ${o.score}`),
    totalVolume,
  });

  return Response.json({
    briefing: {
      executiveSummary: summary,
      defaultSummary: MOCK_BRIEFING_SUMMARY,
      generatedAt: new Date().toISOString(),
      transactions: MOCK_TRANSACTIONS,
      permits: MOCK_PERMITS,
      opportunities: MOCK_OPPORTUNITIES.filter((o) => o.score >= 70),
    },
  });
}
