export const statesAndUTs = [
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

export const localityStateHints = {
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

export const knowledgeBase = [
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
