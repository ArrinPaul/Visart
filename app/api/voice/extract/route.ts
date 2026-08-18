import { NextResponse } from "next/server";
import { ai } from "@/lib/ai/visart";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
    }

    const prompt = `
You are an expert data extraction assistant for an artisan marketplace.
The artisan spoke the following text to describe their craft.
Extract the relevant details and populate a JSON object with the following fields:
- material: The primary material used (e.g., Bamboo, Clay, Silk). Leave empty if not mentioned.
- productionCost: The cost to make the item. Leave empty if not mentioned.
- timeRequired: The time it takes to make the item. Leave empty if not mentioned.
- location: The location or region where it is made. Leave empty if not mentioned.
- story: Any other interesting facts, cultural significance, or story details. Leave empty if not mentioned.

Return ONLY a valid JSON object. Do not wrap in markdown or backticks.

Artisan's transcript:
"${transcript}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[Voice Extraction API] Error:", error);
    return NextResponse.json(
      { error: "Failed to extract data from voice transcript." },
      { status: 500 }
    );
  }
}
