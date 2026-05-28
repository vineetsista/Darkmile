import { type NextRequest } from "next/server";
import { MOCK_OPPORTUNITIES, MOCK_PROPERTIES } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const minScore = Number(searchParams.get("minScore") ?? 0);
  const sort = searchParams.get("sort") ?? "score"; // score | value | date
  const limit = Number(searchParams.get("limit") ?? 50);

  let opps = MOCK_OPPORTUNITIES.map((o) => ({
    ...o,
    property: MOCK_PROPERTIES.find((p) => p.id === o.propertyId),
  }));

  if (minScore) {
    opps = opps.filter((o) => o.score >= minScore);
  }

  opps.sort((a, b) => {
    if (sort === "value") return (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0);
    return b.score - a.score;
  });

  return Response.json({ opportunities: opps.slice(0, limit), total: opps.length });
}
