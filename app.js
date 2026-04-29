import { statesAndUTs } from "./src/data.js";
import {
  createGoogleHelperLinks,
  createOfflineAnswer,
  createRoadmap,
  inferContextFromQuestion,
  requestGeminiAnswer
} from "./src/logic.js";

const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const userInput = document.querySelector("#userInput");
const stateInput = document.querySelector("#stateInput");
const localityInput = document.querySelector("#localityInput");
const ageInput = document.querySelector("#ageInput");
const stageInput = document.querySelector("#stageInput");
const modeStatus = document.querySelector("#modeStatus");
const googleMapsLink = document.querySelector("#googleMapsLink");
const googleCalendarLink = document.querySelector("#googleCalendarLink");
const geminiKeyInput = document.querySelector("#geminiKeyInput");
const saveGeminiKeyButton = document.querySelector("#saveGeminiKey");
const geminiStatusText = document.querySelector("#geminiStatusText");

function getStageLabel(stageValue) {
  return stageInput.querySelector(`option[value="${stageValue}"]`)?.textContent || "New voter";
}

function getContext() {
  const stage = stageInput.value;
  return {
    state: stateInput.value,
    locality: localityInput.value || "not entered",
    age: Number(ageInput.value || 0),
    stage,
    stageLabel: getStageLabel(stage)
  };
}

function setContext(context) {
  stateInput.value = context.state;
  localityInput.value = context.locality;
  ageInput.value = String(context.age || "");
  stageInput.value = context.stage;
}

function populateStates() {
  statesAndUTs.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    stateInput.appendChild(option);
  });

  setContext({
    state: "Andhra Pradesh",
    locality: "Tirupati",
    age: 19,
    stage: "new"
  });
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

function updateGoogleHelpers() {
  const links = createGoogleHelperLinks(getContext());
  googleMapsLink.href = links.maps;
  googleCalendarLink.href = links.calendar;
}

function updateGeminiStatus(label) {
  modeStatus.textContent = label;
  if (geminiStatusText) {
    geminiStatusText.textContent = `Current mode: ${label.toLowerCase()}`;
  }
}

function buildRoadmap() {
  addMessage("Guide", createRoadmap(getContext()));
  updateGoogleHelpers();
}

async function answerQuestion(question) {
  const nextContext = inferContextFromQuestion(question, getContext());
  setContext(nextContext);
  updateGoogleHelpers();

  const apiKey = localStorage.getItem("geminiApiKey");
  if (!apiKey) {
    updateGeminiStatus("Offline guide mode");
    return createOfflineAnswer(question, getContext());
  }

  try {
    const answer = await requestGeminiAnswer(question, getContext(), apiKey);
    updateGeminiStatus("Gemini live mode");
    return answer || createOfflineAnswer(question, getContext());
  } catch {
    updateGeminiStatus("Offline fallback mode");
    return `${createOfflineAnswer(question, getContext())}\n\nGemini could not be reached, so the app used the offline election guide.`;
  }
}

async function handleQuestion(question) {
  if (!question.trim()) {
    return;
  }

  addMessage("You", question, "user");
  userInput.value = "";
  addMessage("Guide Assistant", await answerQuestion(question));
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleQuestion(userInput.value.trim());
});

document.querySelector("#buildPlan").addEventListener("click", buildRoadmap);
document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.querySelectorAll(".topic-button").forEach((button) => {
  button.addEventListener("click", () => handleQuestion(button.dataset.topic));
});

[stateInput, localityInput, ageInput, stageInput].forEach((field) => {
  field.addEventListener("change", updateGoogleHelpers);
});

saveGeminiKeyButton?.addEventListener("click", () => {
  const key = geminiKeyInput.value.trim();
  if (!key) {
    return;
  }
  localStorage.setItem("geminiApiKey", key);
  updateGeminiStatus("Gemini ready");
  addMessage("Guide Assistant", "Google Gemini is now connected for richer answers. The app still keeps the offline election guide as a fallback.");
});

populateStates();
updateGoogleHelpers();
updateGeminiStatus(localStorage.getItem("geminiApiKey") ? "Gemini ready" : "Offline guide mode");
addMessage(
  "Guide Assistant",
  "Namaste. Tell me your city or village, age, and what you want to do. Example: I am from Tirupati, age 19, I want to enroll for voter card."
);
