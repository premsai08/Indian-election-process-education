# Bharat Election Guide

Challenge 2 submission for Virtual PromptWars.

## Chosen Vertical

Election Process Education, focused on the Indian election system.

## Approach

The project is a lightweight browser-based civic education guide for Indian elections. It helps citizens understand voter enrollment, constituency lookup, polling-day steps, Model Code of Conduct rules, candidate nomination, EVM/VVPAT basics, counting, and official verification through Election Commission portals.

## Key Features

- India-specific election process timeline.
- AI-style chatbot experience without requiring API keys.
- State and Union Territory selector covering all Indian States/UTs.
- Locality input for district, city, town, village, or panchayat guidance.
- Citizen roadmap for Form 6, Form 8, roll search, and polling station lookup.
- Candidate roadmap for nomination, Returning Officer, affidavits, scrutiny, withdrawal, and compliance.
- Model Code of Conduct explanation.
- Official links to ECI voter services, electoral search, candidate affidavits, and results.

## How It Works

1. Open `index.html` in a browser.
2. Select State/UT, enter locality, age, and your role.
3. Press `Generate Indian election roadmap`.
4. Ask the AI assistant about voter enrollment, constituencies, candidate nomination, MCC, polling timings, panchayat elections, or counting.
5. Use official ECI links to verify personal voter details and live election information.

## Assumptions

- ECI conducts Lok Sabha, Rajya Sabha, Presidential, Vice-Presidential, and State Assembly elections.
- Panchayat, municipality, and other local-body elections are generally handled by State Election Commissions, so the guide directs users to state-level SEC portals for ward/panchayat-specific details.
- Officer names and election dates can change, so the app encourages users to verify the latest information on official portals.
- The guide is neutral and does not recommend parties, candidates, or voting choices.

## Security

- No backend server is used.
- No API key is required.
- No personal data is uploaded or stored.
- The assistant avoids political persuasion and focuses on civic process education.

## Accessibility

- Semantic HTML sections and labels are used.
- The chat log uses `aria-live` for updates.
- The UI supports keyboard input and responsive mobile layouts.
- Dark mode is available.

## Repository Size

This project has no external dependencies or generated build output, so it stays well below the 10 MB repository limit.
