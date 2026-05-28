import { type NextRequest } from "next/server";
import { scoreOpportunity } from "@/lib/ai";
import { MOCK_PROPERTIES, MOCK_PERMITS, MOCK_TRANSACTIONS, MOCK_ENTITY_FILINGS } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const body = await request.json() as { propertyId: string };
  const { propertyId } = body;

  if (!propertyId) {
    return Response.json({ error: "propertyId required" }, { status: 400 });
  }

  const property = MOCK_PROPERTIES.find((p) => p.id === propertyId);
  if (!property) {
    return Response.json({ error: "Property not found" }, { status: 404 });
  }

  const recentPermits = MOCK_PERMITS
    .filter((p) => p.propertyId === propertyId)
    .map((p) => `${p.permitType}: ${p.description?.slice(0, 80)}`);

  const recentTransactions = MOCK_TRANSACTIONS
    .filter((t) => t.propertyId === propertyId)
    .map((t) => `Sale to ${t.buyer} for $${t.price}`);

  const entityChanges = MOCK_ENTITY_FILINGS
    .filter((e) => (e as { relatedPropertyId?: string }).relatedPropertyId === propertyId)
    .map((e) => `${e.filingType}: ${e.entityName}`);

  const result = await scoreOpportunity({
    address: property.address,
    propertyType: property.propertyType,
    ownerType: property.ownerType ?? "Unknown",
    ownerName: property.ownerName ?? "Unknown",
    lastSaleDate: property.lastSaleDate?.toString(),
    assessedValue: property.assessedValue ?? undefined,
    squareFeet: property.squareFeet ?? undefined,
    recentPermits,
    recentTransactions,
    entityChanges,
  });

  return Response.json({ propertyId, ...result });
}
