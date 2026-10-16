# NETRA Guardian — Local Edition

## Run the app

Requirements: Node.js 18 or newer.

1. Open this folder in Terminal or VS Code.
2. Run `npm start`.
3. Open http://127.0.0.1:5500 in your browser.
4. Keep the terminal open while using NETRA. Press Control+C to stop it.

No API key or `.env` file is needed. The NEWS tab and its Gemini service have been removed.

## Current feature notes

- Social profiles can be added, edited, and removed as local references; this does not connect to or scan social platforms.
- Workspace preferences persist in the current browser. Case progress and recent case timeline entries are saved locally.
- The URL checker only flags common warning signs and never opens or reputation-scans a link.
- Evidence selection accepts common image/document formats, with a 10 MB per-file and 25 MB combined selection limit. Evidence files themselves are not uploaded or stored by NETRA.

## Real or Rendered? workspace

The prototype includes an interactive media-authenticity review with four prepared scenarios, optional local image preview, a simulated uncertainty/confidence indicator, possible signals, unverified questions, and recommended next steps. Review notes can be copied for a presentation or discussion. The review can also be saved as a case: the Case Tracker carries over the scenario summary, evidence gaps, recommended next steps, and a field for recording the user’s next action. The case and its note are saved in this browser. The “Explore sample alerts” action opens the alert review area; alerts remain illustrative records and are not automatically linked to or corroborated by a media scenario.

This is deliberately a **simulated front-end workflow**. It does not run an AI detector, analyze the selected image, read image metadata, perform reverse-image search, or verify external sources. The selected image is previewed locally in the browser and is not uploaded.

## Evidence requirement

At least one evidence file must be selected before the complaint report can be prepared, copied, or downloaded. This prototype records the selected filenames; it does not upload or securely store the actual evidence files.

## Important notes

- Sample alerts and media-authenticity assessments are illustrative. NETRA does not automatically scan social accounts or detect AI-generated content.
- Workspace settings are saved in this browser using local storage. They are not encrypted or synced across devices.
- NETRA does not submit complaints to the government portal automatically.
- The latest workflow received source-level checks for JavaScript syntax, button-handler references, required element IDs, sample CSV priorities, and local server responses. Full automated browser click-through could not be completed in the test environment; test the buttons in your own browser before presenting.
