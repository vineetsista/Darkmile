import { type NextRequest } from "next/server";
import { MOCK_PROPERTIES, MOCK_OPPORTUNITIES } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.toLowerCase();
  const type = searchParams.get("type");
  const minScore = Number(searchParams.get("minScore") ?? 0);

  let properties = MOCK_PROPERTIES;

  if (q) {
    properties = properties.filter(
      (p) =>
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.ownerName?.toLowerCase().includes(q)
    );
  }

  if (type) {
    properties = properties.filter((p) => p.propertyType === type);
  }

  const withScores = properties.map((p) => ({
    ...p,
    opportunityScore:
      MOCK_OPPORTUNITIES.find((o) => o.propertyId === p.id)?.score ?? null,
  }));

  const filtered = minScore
    ? withScores.filter((p) => (p.opportunityScore ?? 0) >= minScore)
    : withScores;

  return Response.json({ properties: filtered, total: filtered.length });
}
