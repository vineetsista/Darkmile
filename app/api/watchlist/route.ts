import { type NextRequest } from "next/server";

// In-memory watchlist for demo. Replace with db.watchlist in production.
const watchlist: Array<{
  id: string;
  propertyId: string;
  notes: string;
  triggers: string[];
  addedDate: string;
}> = [];

export async function GET() {
  return Response.json({ watchlist });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { propertyId: string; notes?: string; triggers?: string[] };
  const { propertyId, notes = "", triggers = ["ownership_change", "permit"] } = body;

  if (!propertyId) {
    return Response.json({ error: "propertyId required" }, { status: 400 });
  }

  if (watchlist.find((w) => w.propertyId === propertyId)) {
    return Response.json({ error: "Already watching this property" }, { status: 409 });
  }

  const item = {
    id: `w_${Date.now()}`,
    propertyId,
    notes,
    triggers,
    addedDate: new Date().toISOString(),
  };
  watchlist.push(item);

  return Response.json({ item }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  const idx = watchlist.findIndex((w) => w.id === id);
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });

  watchlist.splice(idx, 1);
  return Response.json({ success: true });
}
