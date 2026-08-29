/**
 * Daily Briefing Content Structure
 * 
 * Placeholder data for "What's Happening Today?" product.
 * Future integration points:
 * - AI summarization service for headline reduction to 1-2 sentences
 * - News API or RSS feed source for real-time updates
 * - Timestamp tracking per category
 */

export const briefingCategories = [
  {
    id: "india",
    name: "India",
    emoji: "🇮🇳",
    color: "var(--color-category-india)",
  },
  {
    id: "markets",
    name: "Markets",
    emoji: "📈",
    color: "var(--color-category-markets)",
  },
  {
    id: "global",
    name: "Global",
    emoji: "🌍",
    color: "var(--color-category-global)",
  },
  {
    id: "tech-ai",
    name: "Technology & AI",
    emoji: "⚡",
    color: "var(--color-category-tech)",
  },
  {
    id: "business",
    name: "Business",
    emoji: "💼",
    color: "var(--color-category-business)",
  },
];

/**
 * Sample briefing items structure
 * Each item contains:
 * - id: unique identifier
 * - category: which category this belongs to (india, markets, global, tech-ai, business)
 * - headline: concise topic (1-2 words)
 * - summary: 1-2 sentence summary (~60 seconds read time)
 * - timestamp: when this was last updated
 * - source: where this came from (for attribution)
 * - link: optional external link for more details
 */
export const todayBriefing = [
  {
    id: "india-1",
    category: "india",
    headline: "GST Collections",
    summary:
      "India's GST collections remain stable, reflecting steady economic activity. October collections showed year-on-year growth driven by improved compliance and e-commerce.",
    timestamp: null, // Will be populated dynamically
    source: null, // To be populated when news source is connected
    link: null,
  },
  {
    id: "markets-1",
    category: "markets",
    headline: "Nifty Momentum",
    summary:
      "The Nifty 50 continues consolidation near 24,000 levels with selective buying in IT and pharma stocks. Volatility remains moderate as market awaits global cues.",
    timestamp: null,
    source: null,
    link: null,
  },
  {
    id: "global-1",
    category: "global",
    headline: "US Fed Policy",
    summary:
      "US Federal Reserve signals possible rate cuts in upcoming meetings amid moderating inflation. Global markets respond positively to softer monetary policy outlook.",
    timestamp: null,
    source: null,
    link: null,
  },
  {
    id: "tech-1",
    category: "tech-ai",
    headline: "AI Advances",
    summary:
      "New AI models demonstrate improved reasoning capabilities with reduced computational overhead. Industry sees faster adoption cycles in enterprise applications.",
    timestamp: null,
    source: null,
    link: null,
  },
  {
    id: "business-1",
    category: "business",
    headline: "Corporate Earnings",
    summary:
      "Q3 earnings season shows mixed results with IT services and financial stocks leading growth. Consumer discretionary sector faces margin pressures.",
    timestamp: null,
    source: null,
    link: null,
  },
];

/**
 * Get briefing items for a specific category
 * @param {string} categoryId - Category identifier
 * @returns {Array} Array of briefing items
 */
export function getBriefingByCategory(categoryId) {
  return todayBriefing.filter((item) => item.category === categoryId);
}

/**
 * Get all briefing items with category metadata
 * @returns {Array} Array of objects with category and items
 */
export function getBriefingGrouped() {
  return briefingCategories.map((category) => ({
    ...category,
    items: getBriefingByCategory(category.id),
  }));
}

/**
 * Placeholder for AI summarization integration
 * Once integrated, this will reduce summaries to consistent 1-2 sentence format
 * @param {string} text - Raw text to summarize
 * @param {number} maxSentences - Maximum number of sentences (default: 2)
 * @returns {Promise<string>} Summarized text
 */
export async function summarizeWithAI(text, maxSentences = 2) {
  // Placeholder - will integrate with AI service
  // For now, return the text as-is
  return text;
}

/**
 * Placeholder for news source integration
 * Once integrated, this will fetch live briefing data
 * @returns {Promise<Array>} Array of briefing items
 */
export async function fetchLiveBriefing() {
  // Placeholder - will integrate with news API or RSS feed
  // For now, return the static data
  return todayBriefing;
}
