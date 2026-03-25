/**
 * Data anonymization utility.
 * Replaces person names, team names, and company names with generic placeholders
 * before sending data to the AI API. Restores original names in the response.
 */

interface AnonymizationMap {
  original: string;
  placeholder: string;
}

interface AnonymizationResult {
  anonymizedText: string;
  mappings: AnonymizationMap[];
}

// Common non-name words to skip
const SKIP_WORDS = new Set([
  // English common words that appear capitalized at sentence start
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "this", "that", "these", "those",
  "it", "its", "we", "our", "they", "their", "he", "she", "his", "her",
  // Technical/agile terms that should not be anonymized
  "sprint", "scrum", "kanban", "agile", "safe", "jira", "linear",
  "confluence", "notion", "slack", "teams", "github", "gitlab",
  "bitbucket", "figma", "sketch", "jenkins", "vercel", "docker",
  "kubernetes", "postgresql", "mongodb", "mysql", "redis",
  "react", "angular", "vue", "next", "node", "python", "java",
  "typescript", "javascript", "graphql", "fastapi", "spring",
  "feature", "bug", "tech", "debt", "api", "ci", "cd", "pr",
  "po", "sm", "rte", "cto", "vp", "ceo", "pm", "dm",
  "pi", "art", "mvp", "kpi", "roi", "eur", "usd",
  "monday", "tuesday", "wednesday", "thursday", "friday",
  "saturday", "sunday", "january", "february", "march", "april",
  "may", "june", "july", "august", "september", "october",
  "november", "december", "q1", "q2", "q3", "q4",
  "high", "medium", "low", "critical", "none",
  "good", "partial", "poor", "best", "worst",
  "estimated", "actual", "planned", "completed",
  "act", "now", "next", "retro", "monitor",
  // Section headers
  "team", "sprint", "context", "metrics", "retrospective",
  "velocity", "backlog", "refinement", "planning", "review",
  "description", "affected", "components", "additional",
  "product", "roadmap", "integration", "migration",
  "discovery", "alignment", "optimization",
]);

const PERSON_PLACEHOLDERS = [
  "Person A", "Person B", "Person C", "Person D", "Person E",
  "Person F", "Person G", "Person H", "Person I", "Person J",
];

const TEAM_PLACEHOLDERS = [
  "Team Alpha", "Team Beta", "Team Gamma", "Team Delta", "Team Epsilon",
  "Team Zeta", "Team Eta", "Team Theta",
];

const COMPANY_PLACEHOLDERS = [
  "Company X", "Company Y", "Company Z",
];

function isLikelyName(word: string): boolean {
  if (word.length < 2) return false;
  if (SKIP_WORDS.has(word.toLowerCase())) return false;
  // Capitalized word (first letter upper, rest lower or mixed)
  if (/^[A-Z][a-z]+$/.test(word)) return true;
  return false;
}

/**
 * Detect and anonymize names, team names, and company names in text.
 * Uses pattern-based detection:
 * - Lines starting with "## Team:" → team name
 * - Lines with "**Name**" patterns → entity names
 * - Capitalized words after "Assignee:", "Developer:", etc. → person names
 * - Words after "Team", "Company", "by" that are capitalized → entity names
 */
export function anonymize(text: string): AnonymizationResult {
  const mappings: AnonymizationMap[] = [];
  const seen = new Map<string, string>(); // original → placeholder

  let personIndex = 0;
  let teamIndex = 0;
  let companyIndex = 0;

  function getPlaceholder(original: string, type: "person" | "team" | "company"): string {
    if (seen.has(original)) return seen.get(original)!;

    let placeholder: string;
    if (type === "person") {
      placeholder = PERSON_PLACEHOLDERS[personIndex % PERSON_PLACEHOLDERS.length];
      personIndex++;
    } else if (type === "team") {
      placeholder = TEAM_PLACEHOLDERS[teamIndex % TEAM_PLACEHOLDERS.length];
      teamIndex++;
    } else {
      placeholder = COMPANY_PLACEHOLDERS[companyIndex % COMPANY_PLACEHOLDERS.length];
      companyIndex++;
    }

    seen.set(original, placeholder);
    mappings.push({ original, placeholder });
    return placeholder;
  }

  let result = text;

  // Pattern 1: Team names after "## Team:" or "**TeamName**"
  result = result.replace(/## Team:\s*([A-Z][A-Za-z0-9\s\-]+?)(?:\s*\()/g, (match, name) => {
    const trimmed = name.trim();
    const ph = getPlaceholder(trimmed, "team");
    return match.replace(trimmed, ph);
  });

  // Pattern 2: Bold names like **Alpha Team** or **Person Name**
  result = result.replace(/\*\*([A-Z][A-Za-z\s\-]+?)\*\*/g, (match, name) => {
    const trimmed = name.trim();
    if (SKIP_WORDS.has(trimmed.toLowerCase())) return match;
    // Heuristic: if it contains "team", "squad", "platform", etc. → team name
    const lowerName = trimmed.toLowerCase();
    if (lowerName.includes("team") || lowerName.includes("squad") || lowerName.includes("platform") || lowerName.includes("services")) {
      const ph = getPlaceholder(trimmed, "team");
      return `**${ph}**`;
    }
    return match;
  });

  // Pattern 3: Person names after assignee-like fields
  result = result.replace(
    /(?:Assignee|Developer|Owner|Engineer|SM|PO|Lead|Manager|by)\s*[:=]?\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/g,
    (match, name) => {
      const trimmed = name.trim();
      if (SKIP_WORDS.has(trimmed.toLowerCase())) return match;
      const ph = getPlaceholder(trimmed, "person");
      return match.replace(trimmed, ph);
    }
  );

  // Pattern 4: Names in table cells (| Name | ... pattern)
  // Detect single capitalized names in table cells that look like person names
  result = result.replace(
    /\|\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*\|/g,
    (match, name) => {
      const trimmed = name.trim();
      if (SKIP_WORDS.has(trimmed.toLowerCase())) return match;
      if (trimmed.length < 3) return match;
      // Skip if it looks like a technical term or header
      if (/^(Sprint|Feature|Bug|Tech|Story|PI|None|Same|Good|Partial|Poor)$/i.test(trimmed)) return match;
      if (isLikelyName(trimmed)) {
        const ph = getPlaceholder(trimmed, "person");
        return match.replace(trimmed, ph);
      }
      return match;
    }
  );

  return { anonymizedText: result, mappings };
}

/**
 * Restore original names in AI response text.
 */
export function deanonymize(text: string, mappings: AnonymizationMap[]): string {
  let result = text;
  // Sort by placeholder length (longest first) to avoid partial replacements
  const sorted = [...mappings].sort((a, b) => b.placeholder.length - a.placeholder.length);
  for (const { original, placeholder } of sorted) {
    // Replace all occurrences of placeholder with original
    result = result.split(placeholder).join(original);
  }
  return result;
}

/**
 * Deanonymize a JSON object by replacing placeholders in all string values.
 */
export function deanonymizeJson<T>(obj: T, mappings: AnonymizationMap[]): T {
  if (mappings.length === 0) return obj;

  const json = JSON.stringify(obj);
  const restored = deanonymize(json, mappings);
  return JSON.parse(restored) as T;
}
