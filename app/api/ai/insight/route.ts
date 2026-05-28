import { type NextRequest } from "next/server";
import { generateDealInsight } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    type: "transaction" | "permit" | "entity";
    address?: string;
    propertyType?: string;
    buyer?: string;
    seller?: string;
    price?: number;
    permitType?: string;
    entityName?: string;
    filingType?: string;
  };

  if (!body.type) {
    return Response.json({ error: "type required" }, { status: 400 });
  }

  const insight = await generateDealInsight(body);
  return Response.json({ insight });
}
