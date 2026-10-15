
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Use POST for news search."
    });
  }

  const keyword = String(req.body?.keyword || "")
    .trim()
    .slice(0, 120);

  if (!keyword) {
    return res.status(400).json({
      error: "Enter a keyword or topic."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing from Vercel."
    });
  }

  const prompt = `Search the web for credible news about "${keyword}"
published within the last seven days. Use Google Search grounding.
Summarize the findings neutrally. Distinguish confirmed reporting
from allegations. Do not invent facts, dates, or sources.
Include original source links when available. Explain that an AI
summary is not a definitive fact-check.`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          model: "gemini-3.8-flash",
          input: prompt,
          tools: [{ type: "google_search" }],
          store: false
        })
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          data?.message ||
          "Gemini API request failed."
      });
    }

    const summary = String(data.output_text || "").trim();
    const articles = [];
    const seen = new Set();

    for (const step of data.steps || []) {
      if (step.type !== "model_output") continue;

      for (const block of step.content || []) {
        if (block.type !== "text") continue;

        for (const annotation of block.annotations || []) {
          const url = annotation.url || annotation.uri;

          if (
            !url ||
            !/^https?:\/\//i.test(url) ||
            seen.has(url)
          ) continue;

          seen.add(url);

          articles.push({
            id: url,
            title: annotation.title || `Source ${articles.length + 1}`,
            source: annotation.title || "Google Search source",
            url,
            snippet: "Open the original source to review the report.",
            publishedAt: null
          });

          if (articles.length >= 10) break;
        }

        if (articles.length >= 10) break;
      }

      if (articles.length >= 10) break;
    }

    return res.status(200).json({
      keyword,
      summary: summary ||
        "Gemini returned no summary. Try another keyword.",
      articles,
      searchedAt: new Date().toISOString(),
      windowDays: 7,
      grounded: true
    });
  } catch (error) {
    return res.status(502).json({
      error: "Could not reach Gemini. Check Vercel function logs."
    });
  }
}
