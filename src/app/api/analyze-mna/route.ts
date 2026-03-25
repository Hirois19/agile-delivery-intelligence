import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MNA_INTEGRATION_SYSTEM_PROMPT } from "@/lib/mna-prompts";
import { MNA_MOCK_RESPONSES, DEFAULT_MNA_MOCK } from "@/lib/mna-mock-response";

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
        (scenarioId && MNA_MOCK_RESPONSES[scenarioId]) || DEFAULT_MNA_MOCK;
      return NextResponse.json(mockResponse);
    }

    const { anonymize, deanonymizeJson } = await import("@/lib/anonymize");
    const { parseAIJson } = await import("@/lib/parse-ai-json");

    const { anonymizedText, mappings } = anonymize(data);
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: MNA_INTEGRATION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate an M&A integration playbook for the following scenario:\n\n${anonymizedText}`,
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
