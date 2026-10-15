# NETRA Guardian

A light-theme digital-safety workspace with alert review, URL warning checks, a guided cybercrime complaint draft, official cyber contacts, Gemini-grounded news search, community voting, and a case tracker.

## Run locally
1. Open `NETRA_Guardian_Frontend` in VS Code.
2. For the front-end only, use Live Server or `python3 -m http.server 5500`.
3. **Gemini News Search requires the included Vercel serverless API route** (`api/news.js`). For a full local test, install Vercel CLI and run `vercel dev` from this folder after setting `GEMINI_API_KEY` in your local environment.

## Deploy on Vercel
1. Import this folder/repository into Vercel.
2. In Vercel Project Settings → Environment Variables, add `GEMINI_API_KEY` with a key from Google AI Studio.
3. Redeploy. The browser calls `/api/news`; the key remains server-side and is never embedded in `script.js`.
4. The news route uses Gemini 2.5 Flash with Google Search grounding. It asks for reporting from the last seven days and returns grounded source links. Search grounding may not supply a publication date for every source, so the UI labels dates as unavailable rather than inventing them.

## Saved profile and workspace
The first visit opens a profile setup form for display name, email, mobile number, and social usernames/URLs. Workspace settings, keywords, alert review choices, case progress, and news votes are saved in the browser's `localStorage`, so they persist when the same browser is used again. This is not secure authentication and does not sync across devices or browsers. Do not enter passwords, OTPs, full identity numbers, or payment credentials. For real multi-user production, use a proper authentication provider and encrypted server-side database with consent and access controls.

## Case Tracker
Cases show an initial found state plus three user-confirmed checkboxes: reported, in process, and action taken. When all three are checked, the case leaves the active list and appears under Completed cases. Counts and progress bars are calculated from current case state. Users should only check stages that have actually happened.

## News voting
Users can vote “May be true” or “May be false” on grounded search results. A displayed label is based on the count of votes recorded in that browser, not a verified fact-check. Votes are currently local to the user's browser and are not aggregated across users. A backend database and user authentication would be required for public community-wide voting.

## Important limitations
- Gemini summaries and search results may be incomplete or inaccurate. Open the linked sources and check dates before relying on a claim.
- No external social accounts are scanned; the sample alert data is illustrative.
- Evidence selected in the complaint form is not uploaded, and NETRA does not submit complaints to the government portal automatically.
- Browser local storage is not encrypted storage and should not be used for sensitive identity documents or passwords.
