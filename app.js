const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const userInput = document.querySelector("#userInput");
const stateInput = document.querySelector("#stateInput");
const localityInput = document.querySelector("#localityInput");
const ageInput = document.querySelector("#ageInput");
const stageInput = document.querySelector("#stageInput");
const modeStatus = document.querySelector("#modeStatus");

const statesAndUTs = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const localityStateHints = {
  tirupati: "Andhra Pradesh",
  hyderabad: "Telangana",
  vijayawada: "Andhra Pradesh",
  visakhapatnam: "Andhra Pradesh",
  chennai: "Tamil Nadu",
  bengaluru: "Karnataka",
  bangalore: "Karnataka",
  mumbai: "Maharashtra",
  delhi: "Delhi",
  kolkata: "West Bengal"
};

const knowledge = [
  {
    keys: ["enroll", "register", "registration", "form 6", "voter id", "new voter"],
    answer:
      "For voter enrollment in India: if you are an Indian citizen and 18 or above on the qualifying date, use Form 6 on the ECI Voter Services portal or submit it through your ERO/BLO. Keep age proof, address proof, and a mobile number ready. After submission, track the reference number, wait for BLO/ERO verification, then confirm your name in the electoral roll. A voter card helps, but the most important requirement is that your name is in the electoral roll."
  },
  {
    keys: ["constituency", "booth", "polling station", "ward", "panchayat", "city", "village", "district"],
    answer:
      "To find your constituency in India, search your name on electoralsearch.eci.gov.in or the Voter Helpline app. It can show your Assembly Constituency, Parliamentary Constituency, part number, serial number, and polling station. For panchayat, municipality, and local-body wards, also check the State Election Commission website of your state because local-body elections are handled by State Election Commissions."
  },
  {
    keys: ["candidate", "nomination", "contest", "mla", "mp", "sarpanch", "corporator"],
    answer:
      "For candidate nomination, wait for the election notification and file nomination papers before the Returning Officer for that constituency. A candidate usually needs the correct nomination form, affidavit including assets/liabilities and criminal cases, security deposit, proposer signatures as required, photos, party authorization if contesting from a party, and bank/expenditure compliance. The RO scrutinizes nominations, then candidates can withdraw before the final list is published. Panchayat and municipal candidate rules are usually published by the State Election Commission."
  },
  {
    keys: ["model code", "mcc", "election code", "rules", "campaign"],
    answer:
      "The Model Code of Conduct starts as soon as the Election Commission announces the election schedule and remains in force until the election process is completed. During MCC, parties and candidates must avoid hate appeals, bribery or inducements, misuse of government machinery, public-funded campaign advertisements, and unauthorized booth entry. Only voters, candidates, polling agents, and persons authorized by ECI can enter polling booths."
  },
  {
    keys: ["polling", "vote", "timing", "time", "extended", "queue", "evm", "vvpat"],
    answer:
      "Polling hours are announced in the official election notification and can vary by election and area. A common schedule is morning to evening, often 7 AM to 6 PM, but always verify your constituency notification. If you are already in the queue before closing time, polling officials normally allow you to vote. Any extension or special timing is announced by ECI/CEO/RO. At the booth, identity is checked, your finger is inked, you vote on the EVM, and VVPAT briefly shows the selected candidate slip."
  },
  {
    keys: ["officer", "cec", "election commission", "ero", "blo", "ro", "deo", "ceo"],
    answer:
      "India's election machinery has multiple levels: ECI conducts national and state assembly elections; each state/UT has a Chief Electoral Officer; districts have District Election Officers; constituencies have Returning Officers for elections and Electoral Registration Officers for rolls; Booth Level Officers help citizens locally. As checked from ECI press material on 29 Apr 2026, the CEC is Gyanesh Kumar and Election Commissioners are Sukhbir Singh Sandhu and Vivek Joshi. Always verify current officers on eci.gov.in."
  },
  {
    keys: ["counting", "result", "strong room", "evm security"],
    answer:
      "After polling, EVMs and VVPATs are sealed, transported under security, and stored in strong rooms. Candidates or their representatives can observe sealing and strong-room arrangements under ECI procedure. Counting happens on the notified counting day. Official results are published on results.eci.gov.in and should be treated as the authoritative source."
  }
];

function populateStates() {
  statesAndUTs.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    stateInput.appendChild(option);
  });
  stateInput.value = "Andhra Pradesh";
  localityInput.value = "Tirupati";
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

function getContext() {
  const age = Number(ageInput.value || 0);
  const stage = stageInput.options[stageInput.selectedIndex].text;
  const ageText = age >= 18 ? "eligible age for general voter enrollment" : "not yet 18, learn now and enroll when eligible";
  return `State/UT: ${stateInput.value}, locality: ${localityInput.value || "not entered"}, profile: ${stage}, age: ${age || "not provided"} (${ageText}).`;
}

function updateContextFromQuestion(question) {
  const normalized = question.toLowerCase();
  const ageMatch = normalized.match(/\b(?:age\s*(?:is)?\s*)?([1-9][0-9])\b/);
  const locality = Object.keys(localityStateHints).find((name) => normalized.includes(name));

  if (ageMatch) {
    ageInput.value = ageMatch[1];
  }

  if (locality) {
    localityInput.value = locality.charAt(0).toUpperCase() + locality.slice(1);
    stateInput.value = localityStateHints[locality];
  }

  if (["enroll", "register", "voter card", "voter id", "form 6"].some((word) => normalized.includes(word))) {
    stageInput.value = "new";
  }
}

function enrollmentAnswer() {
  const locality = localityInput.value || "your locality";
  const state = stateInput.value;
  const age = Number(ageInput.value || 0);

  if (age && age < 18) {
    return `For ${locality}, ${state}: you need to be 18 or above on the qualifying date to enroll as a voter. Until then, learn the process and keep age/address documents ready.`;
  }

  return `For you: ${locality}, ${state}, age ${age || "not provided"}.

You can enroll for a voter card like this:

1. Go to voters.eci.gov.in.
2. Choose New Registration for General Elector, Form 6.
3. Create or log in to your account with mobile/email OTP.
4. Select State: ${state}.
5. Enter your address in ${locality}. The portal/ERO uses this to map your Assembly Constituency, Parliamentary Constituency, polling part, and booth.
6. Upload documents:
   - Age proof: birth certificate, 10th certificate, PAN, passport, or other accepted proof.
   - Address proof: Aadhaar, passport, bank passbook, utility bill, rent agreement, or other accepted proof.
7. Submit Form 6 and save the reference number.
8. A BLO/ERO may verify your details.
9. Track status on voters.eci.gov.in.
10. After approval, search your name on electoralsearch.eci.gov.in. If your name is in the electoral roll, you can vote. You can download e-EPIC if available.

Important: voter card is useful, but the main requirement on polling day is your name in the electoral roll plus an accepted ID.`;
}

function offlineAnswer(question) {
  const normalized = question.toLowerCase();
  if (["enroll", "register", "voter card", "voter id", "form 6"].some((word) => normalized.includes(word))) {
    return enrollmentAnswer();
  }

  const matched = knowledge.find((item) => item.keys.some((key) => normalized.includes(key)));
  const base = matched
    ? matched.answer
    : "Indian elections follow a structured process: electoral roll preparation, schedule announcement, Model Code of Conduct, nomination, scrutiny, withdrawal, campaign, silence period, polling, secure EVM storage, counting, and result declaration. Use ECI portals for national/state assembly elections and State Election Commission portals for panchayat or municipal elections.";

  return `${base}\n\nYour context: ${getContext()}\n\nOfficial next step: verify personal details on voters.eci.gov.in or electoralsearch.eci.gov.in.`;
}

function buildRoadmap() {
  const stage = stageInput.value;
  const locality = localityInput.value || "your locality";
  const state = stateInput.value;
  const steps = [`Roadmap for ${locality}, ${state}:`];

  if (stage === "new") {
    steps.push("1. You are 18+, so start with Form 6 for new voter enrollment.");
    steps.push(`2. Select ${state} and enter your full address in ${locality}.`);
    steps.push("3. Upload age proof and address proof, then submit Form 6.");
    steps.push("4. Save the reference number and track the application status.");
    steps.push("5. After approval, search your name in the electoral roll before polling day.");
  } else if (stage === "registered") {
    steps.push("1. Search your name on electoralsearch.eci.gov.in.");
    steps.push("2. Note Assembly Constituency, Parliamentary Constituency, polling station, part number, and serial number.");
    steps.push("3. Download or save your voter information before polling day.");
  } else if (stage === "moved") {
    steps.push("1. Use Form 8 for shifting residence or correcting details in the electoral roll.");
    steps.push("2. Search again after approval to confirm the new polling station and constituency.");
  } else {
    steps.push("1. Identify the exact election type: Lok Sabha, Assembly, municipal, or panchayat.");
    steps.push("2. For Lok Sabha/Assembly, collect nomination forms and file before the Returning Officer after notification.");
    steps.push("3. For municipal/panchayat elections, check your State Election Commission rules and local RO office.");
  }

  steps.push("Next: use voters.eci.gov.in for ECI voter services and electoralsearch.eci.gov.in to confirm your name after approval.");
  steps.push("Note: panchayat/municipal ward details are checked through the State Election Commission of your state.");

  addMessage("Guide", steps.join("\n"));
}

function handleQuestion(question) {
  updateContextFromQuestion(question);
  addMessage("You", question, "user");
  userInput.value = "";
  addMessage("Guide Assistant", offlineAnswer(question));
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleQuestion(userInput.value.trim());
});

document.querySelector("#buildPlan").addEventListener("click", buildRoadmap);

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.querySelectorAll(".topic-button").forEach((button) => {
  button.addEventListener("click", () => handleQuestion(button.dataset.topic));
});

populateStates();
modeStatus.textContent = "India process guide";
addMessage(
  "Guide Assistant",
  "Namaste. Tell me your city or village, age, and what you want to do. Example: I am from Tirupati, age 19, I want to enroll for voter card."
);
