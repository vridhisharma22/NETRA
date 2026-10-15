# NETRA Guardian

## Run locally
1. Open `NETRA_Guardian_Frontend` in VS Code.
2. For the front-end, use Live Server or `python3 -m http.server 5500`.

## Deploy on Vercel
1. Import this folder/repository into Vercel.
2. Keep the project root set to the directory containing `index.html` and `script.js`.

## Saved profile and workspace
The first visit opens a profile setup form for display name, email, mobile number, and social usernames/URLs. Workspace settings, keywords, alert review choices, and case progress are saved in the browser's `localStorage`, so they persist when the same browser is used again. This is not secure authentication and does not sync across devices or browsers. Do not enter passwords, OTPs, full identity numbers, or payment credentials. For real multi-user production, use a proper authentication provider and encrypted server-side database with consent and access controls.

## Case Tracker
Cases show an initial found state plus three user-confirmed checkboxes: reported, in process, and action taken. When all three are checked, the case leaves the active list and appears under Completed cases. Counts and progress bars are calculated from current case state. Users should only check stages that have actually happened.

## Important limitations
- No external social accounts are scanned; the sample alert data is illustrative.
- Evidence selected in the complaint form is not uploaded, and NETRA does not submit complaints to the government portal automatically.
- Browser local storage is not encrypted storage and should not be used for sensitive identity documents or passwords.

## Chatbot
The floating NETRA chatbot uses the Landbot URL `https://landbot.online/v3/H-3531977-HRP86R0UMR0EZ9VO/index.html`.

The News Search tab, its UI, client-side search/voting code, styles, and `/api/news` route have been removed from this build.
