/**
 * Extract and parse JSON from Claude API response text.
 * Handles cases where Claude wraps JSON in markdown code fences
 * or includes extra text before/after the JSON.
 */
export function parseAIJson<T>(text: string): T {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try extracting from markdown code fence
    const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (fenceMatch) {
      return JSON.parse(fenceMatch[1].trim());
    }

    // Try finding the first { ... } block
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    }

    throw new SyntaxError("Could not extract JSON from AI response");
  }
}
