import { knowledgeBase, localityStateHints } from "./data.js";

const ENROLLMENT_KEYWORDS = ["enroll", "register", "voter card", "voter id", "form 6"];

export function capitalizeWord(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function inferContextFromQuestion(question, currentContext) {
  const normalized = question.toLowerCase();
  const next = { ...currentContext };
  const ageMatch = normalized.match(/\b(?:age\s*(?:is)?\s*)?([1-9][0-9])\b/);
  const locality = Object.keys(localityStateHints).find((name) => normalized.includes(name));

  if (ageMatch) {
    next.age = Number(ageMatch[1]);
  }

  if (locality) {
    next.locality = capitalizeWord(locality);
    next.state = localityStateHints[locality];
  }

  if (ENROLLMENT_KEYWORDS.some((word) => normalized.includes(word))) {
    next.stage = "new";
  }

  return next;
}

export function formatContext(context) {
  const ageText = context.age >= 18
    ? "eligible age for general voter enrollment"
    : "not yet 18, learn now and enroll when eligible";
  return `State/UT: ${context.state}, locality: ${context.locality || "not entered"}, profile: ${context.stageLabel}, age: ${context.age || "not provided"} (${ageText}).`;
}

export function createEnrollmentAnswer(context) {
  if (context.age && context.age < 18) {
    return `For ${context.locality}, ${context.state}: you need to be 18 or above on the qualifying date to enroll as a voter. Until then, learn the process and keep age and address documents ready.`;
  }

  return `For you: ${context.locality}, ${context.state}, age ${context.age || "not provided"}.

You can enroll for a voter card like this:

1. Go to voters.eci.gov.in.
2. Choose New Registration for General Elector, Form 6.
3. Create or log in with your mobile number or email OTP.
4. Select State: ${context.state}.
5. Enter your full address in ${context.locality}. The portal maps your Assembly Constituency, Parliamentary Constituency, polling part, and booth.
6. Upload documents:
   - Age proof: birth certificate, 10th certificate, PAN, passport, or another accepted proof.
   - Address proof: Aadhaar, passport, bank passbook, utility bill, rent agreement, or another accepted proof.
7. Submit Form 6 and save the reference number.
8. A BLO or ERO may verify your details.
9. Track status on voters.eci.gov.in.
10. After approval, search your name on electoralsearch.eci.gov.in. If your name is in the electoral roll, you can vote.

Important: the voter card helps, but the main polling-day requirement is that your name appears in the electoral roll and you carry an accepted ID.`;
}

export function createOfflineAnswer(question, context) {
  const normalized = question.toLowerCase();
  if (ENROLLMENT_KEYWORDS.some((word) => normalized.includes(word))) {
    return createEnrollmentAnswer(context);
  }

  const matched = knowledgeBase.find((item) => item.keys.some((key) => normalized.includes(key)));
  const base = matched
    ? matched.answer
    : "Indian elections follow a structured process: electoral roll preparation, schedule announcement, Model Code of Conduct, nomination, scrutiny, withdrawal, campaign, silence period, polling, secure EVM storage, counting, and result declaration. Use ECI portals for national and state assembly elections and State Election Commission portals for panchayat or municipal elections.";

  return `${base}\n\nYour context: ${formatContext(context)}\n\nOfficial next step: verify personal details on voters.eci.gov.in or electoralsearch.eci.gov.in.`;
}

export function createRoadmap(context) {
  const steps = [`Roadmap for ${context.locality || "your locality"}, ${context.state}:`];

  if (context.stage === "new") {
    steps.push("1. You are 18+, so start with Form 6 for new voter enrollment.");
    steps.push(`2. Select ${context.state} and enter your full address in ${context.locality}.`);
    steps.push("3. Upload age proof and address proof, then submit Form 6.");
    steps.push("4. Save the reference number and track the application status.");
    steps.push("5. After approval, search your name in the electoral roll before polling day.");
  } else if (context.stage === "registered") {
    steps.push("1. Search your name on electoralsearch.eci.gov.in.");
    steps.push("2. Note Assembly Constituency, Parliamentary Constituency, polling station, part number, and serial number.");
    steps.push("3. Download or save your voter information before polling day.");
  } else if (context.stage === "moved") {
    steps.push("1. Use Form 8 for shifting residence or correcting details in the electoral roll.");
    steps.push("2. Search again after approval to confirm the new polling station and constituency.");
  } else {
    steps.push("1. Identify the exact election type: Lok Sabha, Assembly, municipal, or panchayat.");
    steps.push("2. For Lok Sabha or Assembly, collect nomination forms and file before the Returning Officer after notification.");
    steps.push("3. For municipal or panchayat elections, check your State Election Commission rules and local RO office.");
  }

  steps.push("Next: use voters.eci.gov.in for ECI voter services and electoralsearch.eci.gov.in to confirm your name after approval.");
  steps.push("Note: panchayat and municipal ward details are checked through the State Election Commission of your state.");
  return steps.join("\n");
}

export function createGoogleHelperLinks(context, now = new Date()) {
  const placeQuery = encodeURIComponent(`${context.locality || "election office"} ${context.state} election office ERO BLO voter registration`);
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const format = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const title = encodeURIComponent("Complete Form 6 voter enrollment");
  const details = encodeURIComponent(`Use voters.eci.gov.in for Form 6. Context: ${context.locality}, ${context.state}. Verify final details with ECI/CEO/ERO/BLO.`);

  return {
    maps: `https://www.google.com/maps/search/${placeQuery}`,
    calendar: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${format(start)}/${format(end)}&details=${details}`
  };
}

export async function requestGeminiAnswer(question, context, apiKey) {
  if (!apiKey) {
    return null;
  }

  const prompt = `You are Bharat Election Guide, an Indian election education assistant. Give concise, structured, neutral guidance. Do not recommend any political party or candidate. Context: ${formatContext(context)}. Question: ${question}`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!response.ok) {
    throw new Error("Gemini request failed");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}
