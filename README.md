# Election Guide Assistant

Challenge 2 submission for Virtual PromptWars.

## Chosen Vertical

Election process education assistant.

## Approach

The project is a lightweight browser-based assistant that helps users understand election registration, timelines, voting-day preparation, and misinformation safety. It uses a context form to personalize responses based on region, age, stage, and election date.

## Google Services Used

- Gemini API: optional AI-powered answers when the user enters a Gemini API key. The key is stored only in the browser's local storage and is not committed to the repository.
- Google Calendar: creates a reminder for checking registration or polling details.
- Google Maps: opens a search for nearby election offices in the selected region.

The app still works without an API key through a built-in offline knowledge mode.

## How It Works

1. Open `index.html` in a browser.
2. Fill in your region, age, election stage, and election date.
3. Ask a question or click one of the topic cards.
4. Press `Build my roadmap` to generate a step-by-step election preparation plan.
5. Optionally add a Gemini API key to enable dynamic AI responses.

## Assumptions

- Election rules vary by country, state, and election type, so the assistant encourages users to verify final details with official election authorities.
- The app is neutral and does not recommend parties, candidates, or voting choices.
- The Gemini key is optional so evaluators can test the app without setup.

## Security

- No backend server is used.
- No API key is hard-coded.
- The Gemini API key stays in the user's browser local storage.
- The assistant avoids political persuasion and focuses on civic process education.

## Accessibility

- Semantic HTML sections and labels are used.
- The chat log uses `aria-live` for updates.
- The UI supports keyboard input and responsive mobile layouts.
- Dark mode is available.

## Repository Size

This project has no external dependencies or generated build output, so it stays well below the 10 MB repository limit.
