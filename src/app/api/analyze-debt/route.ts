import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TECH_DEBT_SYSTEM_PROMPT } from "@/lib/tech-debt-prompts";
import {
  TECH_DEBT_MOCK_RESPONSES,
  DEFAULT_TECH_DEBT_MOCK,
} from "@/lib/tech-debt-mock-response";

export async function POST(request: NextRequest) {
  try {
    const { data, scenarioId } = await request.json();
    if (!data || typeof data !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'data' field" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockResponse =
        (scenarioId && TECH_DEBT_MOCK_RESPONSES[scenarioId]) ||
        DEFAULT_TECH_DEBT_MOCK;
      return NextResponse.json(mockResponse);
    }

    const { anonymize, deanonymizeJson } = await import("@/lib/anonymize");
    const { parseAIJson } = await import("@/lib/parse-ai-json");

    const { anonymizedText, mappings } = anonymize(data);
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: TECH_DEBT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Translate the following technical debt into business impact:\n\n${anonymizedText}`,
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
