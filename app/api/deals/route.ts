import { type NextRequest } from "next/server";
import {
  MOCK_TRANSACTIONS,
  MOCK_PERMITS,
  MOCK_ENTITY_FILINGS,
  MOCK_PROPERTIES,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const kind = searchParams.get("kind"); // transaction | permit | entity | all
  const q = searchParams.get("q")?.toLowerCase();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);

  const transactions = MOCK_TRANSACTIONS.map((t) => ({
    kind: "transaction" as const,
    data: t,
    property: MOCK_PROPERTIES.find((p) => p.id === t.propertyId),
    sortDate: new Date(t.recordedDate),
  }));

  const permits = MOCK_PERMITS.map((p) => ({
    kind: "permit" as const,
    data: p,
    property: MOCK_PROPERTIES.find((pr) => pr.id === p.propertyId),
    sortDate: new Date(p.filingDate),
  }));

  const entities = MOCK_ENTITY_FILINGS.map((e) => ({
    kind: "entity" as const,
    data: e,
    property: undefined,
    sortDate: new Date(e.filingDate),
  }));

  let combined = [...transactions, ...permits, ...entities].sort(
    (a, b) => b.sortDate.getTime() - a.sortDate.getTime()
  );

  if (kind && kind !== "all") {
    combined = combined.filter((item) => item.kind === kind);
  }

  if (q) {
    combined = combined.filter((item) => {
      if (item.kind === "transaction") {
        return (
          item.property?.address.toLowerCase().includes(q) ||
          item.data.buyer?.toLowerCase().includes(q) ||
          item.data.seller?.toLowerCase().includes(q)
        );
      }
      if (item.kind === "permit") {
        return (
          item.property?.address.toLowerCase().includes(q) ||
          item.data.applicant?.toLowerCase().includes(q)
        );
      }
      return item.data.entityName.toLowerCase().includes(q);
    });
  }

  const total = combined.length;
  const paginated = combined.slice((page - 1) * limit, page * limit);

  return Response.json({
    items: paginated,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
