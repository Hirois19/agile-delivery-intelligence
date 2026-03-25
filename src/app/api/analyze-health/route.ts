import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TEAM_HEALTH_SYSTEM_PROMPT } from "@/lib/prompts";
import { MOCK_RESPONSES, MOCK_HEALTH_ANALYSIS } from "@/lib/mock-response";

export async function POST(request: NextRequest) {
  try {
    const { data, scenarioId } = await request.json();
    if (!data || typeof data !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'data' field" },
        { status: 400 }
      );
    }

    // Use mock response when API key is not configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      // Simulate network delay for realistic demo
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockResponse =
        (scenarioId && MOCK_RESPONSES[scenarioId]) || MOCK_HEALTH_ANALYSIS;
      return NextResponse.json(mockResponse);
    }

    const { anonymize, deanonymizeJson } = await import("@/lib/anonymize");
    const { parseAIJson } = await import("@/lib/parse-ai-json");

    const { anonymizedText, mappings } = anonymize(data);
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: TEAM_HEALTH_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze the following team data and provide a comprehensive health diagnostic:\n\n${anonymizedText}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    const analysis = parseAIJson(textBlock.text);
    const restored = deanonymizeJson(analysis, mappings);
    return NextResponse.json(restored);
  } catch (error) {
    console.error("Analysis error:", error);
    const msg =
      error instanceof SyntaxError
        ? "Failed to parse AI response as JSON"
        : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
