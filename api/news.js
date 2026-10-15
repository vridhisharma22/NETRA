export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST for news search.' });
  const keyword = String(req.body?.keyword || '').trim().slice(0, 120);
  if (!keyword) return res.status(400).json({ error: 'Enter a keyword or topic.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'News search is not configured yet. Add GEMINI_API_KEY in Vercel Environment Variables and redeploy.' });
  const prompt = `Search the web for credible news about "${keyword}" published within the LAST SEVEN DAYS relative to today. Use Google Search grounding. Return a concise neutral news brief, clearly distinguish confirmed reporting from allegations, and do not invent dates, details, or sources. Prefer recent reporting from reputable publishers. For each distinct news report, provide title, publisher, publication date if the search result actually gives it, a short factual snippet, and the original URL. Exclude results outside the last seven days where the date is known. If publication dates cannot be confirmed, explicitly say so and do not pretend they are verified. Mention that an AI summary is not a fact-check.`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0.2, maxOutputTokens: 2500 } })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'Gemini request failed.' });
    const candidate = data.candidates?.[0];
    const summary = (candidate?.content?.parts || []).map(p => p.text || '').join('\n').trim();
    const chunks = candidate?.groundingMetadata?.groundingChunks || [];
    const seen = new Set();
    const articles = chunks.map(chunk => chunk.web).filter(web => web?.uri && /^https?:\/\//i.test(web.uri)).filter(web => { if (seen.has(web.uri)) return false; seen.add(web.uri); return true; }).slice(0, 10).map((web, i) => ({ id: web.uri, title: web.title || `Search result ${i + 1}`, source: web.title || 'Google Search result', url: web.uri, snippet: 'Open the original source to review its report and publication date.', publishedAt: null }));
    return res.status(200).json({ keyword, summary: summary || 'Gemini returned no summary. Try a more specific keyword.', articles, searchedAt: new Date().toISOString(), windowDays: 7, grounded: Boolean(candidate?.groundingMetadata) });
  } catch (error) {
    return res.status(502).json({ error: 'Could not reach Gemini. Check the deployment logs and try again.' });
  }
}
