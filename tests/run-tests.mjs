import assert from "node:assert/strict";

import {
  createEnrollmentAnswer,
  createGoogleHelperLinks,
  createOfflineAnswer,
  createRoadmap,
  inferContextFromQuestion
} from "../src/logic.js";

const baseContext = {
  state: "Telangana",
  locality: "Hyderabad",
  age: 18,
  stage: "registered",
  stageLabel: "Already registered"
};

const tests = [
  {
    name: "inferContextFromQuestion updates locality, state, age, and stage",
    run() {
      const next = inferContextFromQuestion("mine is tirupati my age is 19 i want to enroll to voter card how", baseContext);
      assert.equal(next.state, "Andhra Pradesh");
      assert.equal(next.locality, "Tirupati");
      assert.equal(next.age, 19);
      assert.equal(next.stage, "new");
    }
  },
  {
    name: "createEnrollmentAnswer includes Form 6 flow",
    run() {
      const answer = createEnrollmentAnswer({
        state: "Andhra Pradesh",
        locality: "Tirupati",
        age: 19,
        stage: "new",
        stageLabel: "New voter"
      });
      assert.match(answer, /Form 6/);
      assert.match(answer, /Tirupati/);
      assert.match(answer, /electoral roll/);
    }
  },
  {
    name: "createOfflineAnswer falls back to knowledge base",
    run() {
      const answer = createOfflineAnswer("Explain Model Code of Conduct rules", {
        state: "Andhra Pradesh",
        locality: "Tirupati",
        age: 19,
        stage: "new",
        stageLabel: "New voter"
      });
      assert.match(answer, /Model Code of Conduct/);
    }
  },
  {
    name: "createRoadmap builds a new voter roadmap",
    run() {
      const roadmap = createRoadmap({
        state: "Andhra Pradesh",
        locality: "Tirupati",
        age: 19,
        stage: "new",
        stageLabel: "New voter"
      });
      assert.match(roadmap, /Form 6/);
      assert.match(roadmap, /Tirupati/);
    }
  },
  {
    name: "createGoogleHelperLinks returns Google URLs",
    run() {
      const links = createGoogleHelperLinks({
        state: "Andhra Pradesh",
        locality: "Tirupati",
        age: 19,
        stage: "new",
        stageLabel: "New voter"
      }, new Date("2026-04-29T00:00:00Z"));
      assert.match(links.maps, /google\.com\/maps/);
      assert.match(links.calendar, /calendar\.google\.com/);
    }
  }
];

let passed = 0;

for (const test of tests) {
  try {
    test.run();
    console.log(`PASS ${test.name}`);
    passed += 1;
  } catch (error) {
    console.error(`FAIL ${test.name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

console.log(`${passed}/${tests.length} tests passed`);
