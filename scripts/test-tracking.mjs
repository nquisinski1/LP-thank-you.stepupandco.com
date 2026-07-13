import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configSource = fs.readFileSync(path.join(projectRoot, "src/config.js"), "utf8");
const scriptSource = fs.readFileSync(path.join(projectRoot, "src/script.js"), "utf8");

function createButton() {
  const handlers = new Map();
  return {
    addEventListener(type, handler) {
      handlers.set(type, handler);
    },
    click() {
      return handlers.get("click")?.();
    },
  };
}

function runPage({ url, cookie = "" }) {
  let currentUrl = new URL(url);
  const dataLayer = [];
  const appendedScripts = [];
  const storage = new Map();
  const legacyStorage = new Map();
  const cookies = new Map();

  cookie
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const separator = part.indexOf("=");
      if (separator !== -1) cookies.set(part.slice(0, separator), part.slice(separator + 1));
    });

  const banner = { hidden: true };
  const accept = createButton();
  const decline = createButton();
  const selectorMap = new Map([
    ["[data-consent-banner]", banner],
    ["[data-consent-accept]", accept],
    ["[data-consent-decline]", decline],
  ]);

  const document = {
    title: "StepUp thank-you test",
    scripts: appendedScripts,
    head: {
      appendChild(element) {
        appendedScripts.push(element);
      },
    },
    body: {
      appendChild() {},
    },
    get cookie() {
      return [...cookies.entries()].map(([key, value]) => `${key}=${value}`).join("; ");
    },
    set cookie(value) {
      const pair = String(value).split(";", 1)[0];
      const separator = pair.indexOf("=");
      if (separator !== -1) cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
    },
    querySelector(selector) {
      return selectorMap.get(selector) || null;
    },
    querySelectorAll() {
      return [];
    },
    createElement() {
      return {
        style: {},
        setAttribute() {},
        select() {},
        remove() {},
      };
    },
    execCommand() {
      return true;
    },
  };

  const location = {
    get href() {
      return currentUrl.href;
    },
    get origin() {
      return currentUrl.origin;
    },
    get pathname() {
      return currentUrl.pathname;
    },
    get search() {
      return currentUrl.search;
    },
    get hostname() {
      return currentUrl.hostname;
    },
    get protocol() {
      return currentUrl.protocol;
    },
  };

  const history = {
    replaceState(_state, _title, nextUrl) {
      currentUrl = new URL(nextUrl, currentUrl.origin);
    },
  };

  const sessionStorage = {
    getItem(key) {
      return storage.get(key) || null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
  };
  const localStorage = {
    getItem(key) {
      return legacyStorage.get(key) || null;
    },
  };
  const navigator = {};
  const window = {
    dataLayer,
    document,
    history,
    location,
    navigator,
    sessionStorage,
    localStorage,
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000001" },
  };
  window.window = window;

  const context = vm.createContext({
    URL,
    URLSearchParams,
    console,
    dataLayer,
    decodeURIComponent,
    document,
    encodeURIComponent,
    history,
    localStorage,
    location,
    navigator,
    sessionStorage,
    window,
  });

  vm.runInContext(configSource, context, { filename: "config.js" });
  vm.runInContext(scriptSource, context, { filename: "script.js" });

  return {
    accept,
    appendedScripts,
    banner,
    cookies,
    dataLayer,
    decline,
    get url() {
      return currentUrl;
    },
  };
}

function findEvent(run, name) {
  return run.dataLayer.find((entry) => entry?.event === name);
}

function findConsentCommand(run, command) {
  return run.dataLayer.find(
    (entry) => entry?.[0] === "consent" && entry?.[1] === command,
  );
}

const journey = runPage({
  url: "https://thank-you.stepupandco.com/?cid=ghl_123&event_id=evt_456&name=Nina&email=nina%40example.com&phone=5551234&revenue=1000000",
});

assert.equal(journey.url.searchParams.get("cid"), "ghl_123");
assert.equal(journey.url.searchParams.get("event_id"), "evt_456");
for (const forbidden of ["name", "email", "phone", "revenue"]) {
  assert.equal(journey.url.searchParams.has(forbidden), false);
}

const thankYouViewed = findEvent(journey, "thank_you_viewed");
const registrationCompleted = findEvent(journey, "registration_completed");
assert.equal(thankYouViewed.contact_id, "ghl_123");
assert.equal(thankYouViewed.event_id, "evt_456");
assert.equal(registrationCompleted.contact_id, "ghl_123");
assert.equal(registrationCompleted.event_id, "evt_456");
assert.equal(thankYouViewed.page_location, "https://thank-you.stepupandco.com/");
assert.equal(journey.banner.hidden, false);

const gtmIndex = journey.dataLayer.findIndex((entry) => entry?.event === "gtm.js");
const thankYouIndex = journey.dataLayer.findIndex((entry) => entry?.event === "thank_you_viewed");
assert(gtmIndex !== -1 && gtmIndex < thankYouIndex);
assert(journey.appendedScripts.some((script) => script.src?.includes("googletagmanager.com/gtm.js")));

const serializedJourney = JSON.stringify(journey.dataLayer);
for (const forbiddenValue of ["Nina", "nina@example.com", "5551234", "1000000"]) {
  assert.equal(serializedJourney.includes(forbiddenValue), false);
}

journey.decline.click();
const declineChoice = [...journey.dataLayer]
  .reverse()
  .find((entry) => entry?.event === "consent_choice");
const declineUpdate = [...journey.dataLayer]
  .reverse()
  .find((entry) => entry?.[0] === "consent" && entry?.[1] === "update");
assert.equal(declineChoice.choice, "necessary_only");
assert.equal(declineChoice.consent_state, "necessary_only");
assert.equal(declineUpdate[2].analytics_storage, "denied");
assert.equal(declineUpdate[2].ad_storage, "denied");

const savedConsent = JSON.parse(
  decodeURIComponent(journey.cookies.get("stepup_consent_state")),
);
assert.equal(savedConsent.status, "necessary_only");

const returningOptOut = runPage({
  url: "https://thank-you.stepupandco.com/?cid=returning_1",
  cookie: `stepup_consent_state=${encodeURIComponent(
    JSON.stringify({
      status: "necessary_only",
      version: "mx-lfpdppp-v1-2026-07-13",
      timestamp: "2026-07-13T00:00:00.000Z",
    }),
  )}`,
});
assert.equal(returningOptOut.banner.hidden, true);
assert.equal(findConsentCommand(returningOptOut, "default")[2].analytics_storage, "denied");

const identifierCases = [
  { name: "one character", value: "a", expected: "a" },
  { name: "128 characters", value: "a".repeat(128), expected: "a".repeat(128) },
  { name: "129 characters", value: "a".repeat(129), expected: null },
  { name: "forbidden character", value: "bad$value", expected: null },
];

for (const testCase of identifierCases) {
  const run = runPage({
    url: `https://thank-you.stepupandco.com/?cid=${encodeURIComponent(testCase.value)}`,
  });
  assert.equal(run.url.searchParams.get("cid"), testCase.expected, testCase.name);
}

console.log("Tracking journey tests passed: identity, sanitization, initial measurement and opt-out state.");
