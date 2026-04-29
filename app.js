const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const userInput = document.querySelector("#userInput");
const countryInput = document.querySelector("#countryInput");
const ageInput = document.querySelector("#ageInput");
const stageInput = document.querySelector("#stageInput");
const dateInput = document.querySelector("#dateInput");
const apiKeyInput = document.querySelector("#apiKeyInput");
const modeStatus = document.querySelector("#modeStatus");
const calendarLink = document.querySelector("#calendarLink");
const mapsLink = document.querySelector("#mapsLink");
const readinessScore = document.querySelector("#readinessScore");

const knowledge = [
  {
    keys: ["register", "registration", "new voter", "enroll"],
    answer:
      "To register as a voter, first confirm you meet the minimum voting age and citizenship rules for your country or region. Then collect proof of age, address, and identity, fill the official voter registration form, submit it through the official election portal or local election office, and later check whether your name appears on the voter list."
  },
  {
    keys: ["timeline", "date", "schedule", "deadline"],
    answer:
      "A practical election timeline has five phases: learn the election type, register or update details early, verify your name on the voter list before the deadline, prepare documents before polling day, and track official results after voting closes."
  },
  {
    keys: ["vote", "polling", "booth", "day"],
    answer:
      "On voting day, check your assigned polling place, carry an accepted identity document, follow queue and verification instructions, cast your vote privately, and avoid sharing misinformation or photos where local rules prohibit them."
  },
  {
    keys: ["misinformation", "fake", "rumor", "safety"],
    answer:
      "Treat election messages carefully. Check the original source, compare with the official election authority website, avoid forwarding emotional claims without proof, and look for dates, location, and context before trusting a post."
  },
  {
    keys: ["candidate", "nomination", "contest"],
    answer:
      "Candidates usually need to confirm eligibility, prepare nomination documents, follow campaign finance rules, submit forms before the deadline, and comply with the election code of conduct. Exact rules vary by country, state, and election type."
  }
];

function setDefaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  dateInput.value = date.toISOString().slice(0, 10);
}

function addMessage(sender, text, type = "") {
  const template = document.querySelector("#messageTemplate");
  const node = template.content.firstElementChild.cloneNode(true);
  if (type) {
    node.classList.add(type);
  }
  node.querySelector("strong").textContent = sender;
  node.querySelector("p").textContent = text;
  chatLog.appendChild(node);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function offlineAnswer(question) {
  const normalized = question.toLowerCase();
  const matched = knowledge.find((item) => item.keys.some((key) => normalized.includes(key)));
  const context = getContext();

  if (matched) {
    return `${matched.answer}\n\nFor your context: ${context}`;
  }

  return `Here is a simple way to proceed: identify the election type, check eligibility, register or update voter details, verify your name on the voter list, prepare accepted ID, and follow official instructions on polling day.\n\nFor your context: ${context}`;
}

function getContext() {
  const age = Number(ageInput.value || 0);
  const ageText = age >= 18 ? "you appear to meet the common 18+ voting age rule" : "you may need to wait until you meet the minimum voting age";
  return `region: ${countryInput.value || "your region"}, stage: ${stageInput.options[stageInput.selectedIndex].text}, age: ${age || "not provided"} (${ageText}). Always verify final rules on the official election authority website.`;
}

function buildRoadmap() {
  const electionDate = dateInput.value ? new Date(`${dateInput.value}T09:00:00`) : null;
  const stage = stageInput.value;
  const steps = [];

  if (stage === "new") {
    steps.push("1. Confirm eligibility and collect identity, age, and address documents.");
    steps.push("2. Submit voter registration through the official election portal or local office.");
  } else if (stage === "registered") {
    steps.push("1. Search the official voter list and confirm your name, address, and polling area.");
  } else if (stage === "moved") {
    steps.push("1. Apply for address correction or constituency transfer before the official deadline.");
  } else {
    steps.push("1. Read the official candidate or volunteer rules for your election type.");
  }

  steps.push("3. Save important deadlines and check only official election authority updates.");
  steps.push("4. Before polling day, prepare accepted ID and locate your polling station.");
  steps.push("5. After voting, follow official result channels and avoid spreading unverified claims.");

  if (electionDate && !Number.isNaN(electionDate.getTime())) {
    const daysLeft = Math.ceil((electionDate - new Date()) / 86400000);
    steps.unshift(`Election date selected: ${electionDate.toLocaleDateString()}. You have about ${daysLeft} day(s) to prepare.`);
  }

  addMessage("Assistant", steps.join("\n"));
  updateReadiness();
  updateGoogleLinks();
}

async function askGemini(question) {
  const key = localStorage.getItem("geminiApiKey");
  if (!key) return null;

  const prompt = `You are an election education assistant. Give concise, neutral, step-by-step guidance. Do not persuade the user who to vote for. User context: ${getContext()}. Question: ${question}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`,
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

async function handleQuestion(question) {
  addMessage("You", question, "user");
  userInput.value = "";

  try {
    const geminiAnswer = await askGemini(question);
    addMessage("Assistant", geminiAnswer || offlineAnswer(question));
  } catch {
    addMessage("Assistant", `${offlineAnswer(question)}\n\nGemini could not be reached, so I used offline knowledge mode.`);
  }
}

function updateGoogleLinks() {
  const region = encodeURIComponent(countryInput.value || "election office");
  const start = dateInput.value ? new Date(`${dateInput.value}T09:00:00`) : new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const format = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const text = encodeURIComponent("Check election registration and polling details");
  const details = encodeURIComponent("Reminder created by Election Guide Assistant. Verify details with the official election authority.");

  calendarLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${format(start)}/${format(end)}&details=${details}`;
  mapsLink.href = `https://www.google.com/maps/search/${region}%20election%20office`;
}

function updateReadiness() {
  const age = Number(ageInput.value || 0);
  const hasRegion = countryInput.value.trim().length > 1;
  const hasDate = Boolean(dateInput.value);
  const stageBonus = stageInput.value === "registered" ? 16 : stageInput.value === "moved" ? 10 : 8;
  const score = Math.min(96, 42 + (age >= 18 ? 22 : 5) + (hasRegion ? 10 : 0) + (hasDate ? 12 : 0) + stageBonus);

  if (readinessScore) {
    readinessScore.textContent = `${score}%`;
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleQuestion(userInput.value.trim());
});

document.querySelector("#buildPlan").addEventListener("click", buildRoadmap);
document.querySelector("#heroRoadmap").addEventListener("click", buildRoadmap);

document.querySelector("#saveKey").addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    localStorage.setItem("geminiApiKey", key);
    modeStatus.textContent = "Gemini enabled";
    addMessage("Assistant", "Gemini key saved in this browser. Future answers will try Gemini first, then fall back to offline mode.");
  }
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.querySelectorAll(".topic-button").forEach((button) => {
  button.addEventListener("click", () => handleQuestion(button.dataset.topic));
});

[countryInput, ageInput, stageInput, dateInput].forEach((field) => {
  field.addEventListener("change", () => {
    updateReadiness();
    updateGoogleLinks();
  });
});

setDefaultDate();
updateReadiness();
updateGoogleLinks();
addMessage(
  "Assistant",
  "Hi, I can explain election registration, timelines, polling-day steps, misinformation safety, and candidate basics. Tell me your situation or press Build my roadmap."
);
