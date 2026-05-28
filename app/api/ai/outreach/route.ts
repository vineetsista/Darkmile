import { type NextRequest } from "next/server";
import { generateOutreachDraft } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    brokerName: string;
    brokerFirm: string;
    ownerName: string;
    propertyAddress: string;
    propertyType: string;
    opportunityNarrative: string;
  };

  const required = ["brokerName", "brokerFirm", "ownerName", "propertyAddress", "propertyType", "opportunityNarrative"] as const;
  for (const field of required) {
    if (!body[field]) {
      return Response.json({ error: `${field} required` }, { status: 400 });
    }
  }

  const draft = await generateOutreachDraft(body);
  return Response.json({ draft });
}
