import { MOCK_MARKET_STATS } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ stats: MOCK_MARKET_STATS });
}
