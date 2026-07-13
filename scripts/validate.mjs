import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(projectRoot, "src");
const html = fs.readFileSync(path.join(srcRoot, "index.html"), "utf8");
const css = fs.readFileSync(path.join(srcRoot, "styles.css"), "utf8");
const script = fs.readFileSync(path.join(srcRoot, "script.js"), "utf8");
const config = fs.readFileSync(path.join(srcRoot, "config.js"), "utf8");
const appPath = path.join(projectRoot, "app.js");
const packagePath = path.join(projectRoot, "package.json");
const app = fs.existsSync(appPath) ? fs.readFileSync(appPath, "utf8") : "";
let packageJson = {};
try {
  packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
} catch {
  packageJson = {};
}
const errors = [];
const warnings = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(packageJson.scripts?.start === "node app.js", "Hostinger requires a valid npm start command.");
assert(packageJson.main === "app.js", "Hostinger Node entry file must be app.js.");
assert(app.includes("process.env.PORT"), "The Hostinger server must listen on the assigned PORT.");
assert(app.includes('path.join(__dirname, "src")'), "The Hostinger server must serve the approved src directory.");

const h1Count = (html.match(/<h1\b/g) || []).length;
assert(h1Count === 1, `Expected one h1, found ${h1Count}.`);
assert(/<html\s+lang="es"/.test(html), "The public page language must remain Spanish.");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
assert(duplicateIds.length === 0, `Duplicate HTML IDs found: ${[...new Set(duplicateIds)].join(", ")}.`);

assert(
  html.includes('data-page-model="harold-editorial-v5"'),
  "Missing the Harold Editorial Access page model marker."
);

assert(
  html.includes("data-thank-you-note") && /Gracias por registrarte/i.test(html),
  "The page must open with an explicit thank-you note."
);

const heroStart = html.indexOf('<section class="hero"');
const heroEnd = html.indexOf("</section>", heroStart);
const vslTrigger = html.indexOf("data-vsl-trigger");
assert(heroStart !== -1, "Missing the confirmation hero.");
assert(
  vslTrigger > heroStart && vslTrigger < heroEnd,
  "The VSL must remain inside the first confirmation block."
);

const activationStepCount = (html.match(/class="[^"]*\bactivation-step\b[^"]*"/g) || []).length;
assert(
  activationStepCount === 3,
  `Expected three activation steps, found ${activationStepCount}.`
);

assert(
  html.includes("data-confirmation-summary"),
  "Missing the accessible registration confirmation summary."
);

assert(
  html.includes("data-authority-profile"),
  "Missing Harold's authority profile."
);

const credentialCount = (html.match(/data-credential/g) || []).length;
assert(
  credentialCount >= 4,
  `Expected at least four verified credentials, found ${credentialCount}.`
);

const valuePillarCount = (html.match(/data-value-pillar/g) || []).length;
assert(
  valuePillarCount === 3,
  `Expected three value pillars, found ${valuePillarCount}.`
);
assert(
  /Las cinco fuerzas/i.test(html) && /Los siete pilares/i.test(html) && /Cómo priorizar/i.test(html),
  "The public three-part masterclass agenda is incomplete."
);

assert(
  html.includes("data-authority-proof"),
  "Missing the verified authority section."
);
assert(
  html.includes("data-editorial-feature") &&
    html.includes("./assets/harold-investor-report.jpg") &&
    html.includes("https://investor.com.pa/business/nadie-construye-los-cimientos/"),
  "Missing the verified Investor Lifestyle editorial feature."
);

assert(html.includes("data-social-hub"), "Missing Harold's content and social hub.");
const socialLinkCount = (html.match(/data-social-link=/g) || []).length;
assert(socialLinkCount === 3, `Expected LinkedIn, Instagram and prepared YouTube links, found ${socialLinkCount}.`);

assert(html.includes("data-invite-module"), "Missing the invitation module.");
const shareChannelCount = (html.match(/data-share-channel=/g) || []).length;
assert(shareChannelCount === 1, `Expected one invitation action, found ${shareChannelCount}.`);
assert(
  html.includes("data-registration-share") && !html.includes("data-share-url"),
  "The invitation area must contain only the registration-share action."
);

const editorialPhotoCount = (html.match(/data-proof-photo/g) || []).length;
assert(
  editorialPhotoCount >= 5,
  `Expected at least five real Harold photographs, found ${editorialPhotoCount}.`
);
assert(/(?:25\+|más de 25) años/i.test(html), "Missing Harold's verified 25+ year trajectory.");
assert(/Fortune\s*500/i.test(html), "Missing Harold's public Fortune 500 experience.");
assert(/40\+ países/i.test(html), "Missing Harold's public international experience.");
assert(/MBA\s+Duke/i.test(html), "Missing Harold's public Duke MBA credential.");
assert(/Stanford University/i.test(html), "Missing Harold's Stanford executive education.");
assert(/tres papers técnicos/i.test(html) && /SPE y AAPG/i.test(html), "Missing Harold's technical publications.");
assert(/segunda posición\s+mundial/i.test(html), "Missing the historical global sector ranking without naming the former employer.");
assert(!/Halliburton/i.test(html), "The former employer name must not appear in public copy.");
assert(
  !/(?:\d[\d.,+]*\s+(?:personas\s+)?(?:inscritas|registradas)|ya somos|cientos de inscritos|miles de inscritos|cupos? limitados)/i.test(html),
  "The page must not fabricate registration volume or scarcity."
);

const localReferences = [...html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)].map((match) => match[1]);
localReferences.forEach((reference) => {
  const target = path.resolve(srcRoot, reference);
  assert(fs.existsSync(target), `Missing local reference: ${reference}`);
});

assert(/aspect-ratio:\s*16\s*\/\s*9/.test(css), "The VSL must keep a stable 16:9 ratio.");
assert(/@media\s*\(max-width:\s*800px\)/.test(css), "Missing mobile breakpoint at 800px.");
assert(/@media\s*\(max-width:\s*420px\)/.test(css), "Missing narrow-mobile breakpoint at 420px.");
assert(!/font-size:[^;]*(?:vw|clamp)/.test(css), "Viewport-scaled font size is not allowed.");
assert(!/letter-spacing:\s*-/.test(css), "Negative letter spacing is not allowed.");
const companyLinkCount = (html.match(/data-company-link/g) || []).length;
assert(companyLinkCount === 2, `Expected branded header and footer links, found ${companyLinkCount}.`);
const sloganCount = (html.match(/We architect companies for the future\./g) || []).length;
assert(sloganCount === 2, "The official StepUp slogan must appear only in the footer lockup.");
assert(
  /\.brand-mark\s*\{[^}]*overflow:\s*hidden/s.test(css) &&
    /\.brand-mark img\s*\{[^}]*position:\s*absolute/s.test(css),
  "The square source logo must be optically cropped in both brand lockups."
);

const forbiddenTracking = /(?:fbq|pushEvent)\([^\n]*(?:Lead|QualifiedApplication|ViewContent|BookedCall|ClosedWon)/;
assert(!forbiddenTracking.test(script), "A forbidden conversion event is present in the thank-you page.");
assert(script.includes('new Set(["cid", "event_id"])'), "Only cid and event_id may remain in the URL.");
assert(script.includes("function getContactId()"), "Missing the sanitized GHL contact ID reader.");
assert(script.includes("function getRegistrationEventId()"), "Missing the technical deduplication ID reader.");
assert(script.includes('pushEvent("thank_you_viewed"'), "Missing thank_you_viewed event.");
assert(script.includes('pushEvent("registration_completed"'), "Missing registration_completed journey event.");
assert(script.includes("contact_id: contactId"), "The pseudonymous contact_id is missing from journey events.");
assert(script.includes('pushEvent("vsl_started"'), "Missing vsl_started event.");
assert(script.includes('pushEvent("invite_shared"'), "Missing privacy-safe invite_shared event.");
assert(script.includes("navigator.share"), "Missing native registration-link sharing behavior.");
assert(script.includes("youtube-nocookie.com"), "The VSL must use youtube-nocookie.com.");
assert(script.includes("navigator.clipboard"), "Missing copy-link behavior for invitations.");

assert(config.includes('metaPixelId: "2249459879220653"'), "Approved Meta pixel is missing.");
assert(config.includes('"978621541831814"'), "First blocked Meta pixel is missing.");
assert(config.includes('"2014625735818543"'), "Second blocked Meta pixel is missing.");
assert(config.includes('linkedinUrl: "https://www.linkedin.com/in/haroldhmesa/"'), "Verified Harold LinkedIn URL is missing.");
assert(config.includes('instagramUrl: "https://www.instagram.com/imharoldmesa/"'), "Verified Harold Instagram URL is missing.");
assert(config.includes('reportUrl: "https://investor.com.pa/business/nadie-construye-los-cimientos/"'), "Verified Investor Lifestyle report URL is missing.");
assert(config.includes('registrationUrl: "https://ceo.stepupandco.com"'), "Registration-page invite URL is missing.");
assert(config.includes('pageId: "ceo_masterclass_thank_you"'), "Stable thank-you page metadata is missing.");
assert(config.includes('funnelStage: "thank_you"'), "The page must remain identified as the thank-you stage.");
assert(config.includes('gtmContainerId: "GTM-K3DFK7M7"'), "The supplied GTM container ID is missing.");
const initialMeasurementIndex = script.lastIndexOf("initGtmAndGa4();");
const consentBannerIndex = script.lastIndexOf("setupConsentBanner();");
assert(
  initialMeasurementIndex !== -1 &&
    consentBannerIndex !== -1 &&
    initialMeasurementIndex < consentBannerIndex,
  "Initial measurement must load before the opt-out banner is presented."
);
assert(script.includes('applyGoogleConsent("default", consentState)'), "Missing initial Google Consent Mode state.");
assert(script.includes('applyGoogleConsent("update", "necessary_only")'), "Declining must update Google Consent Mode.");
assert(script.includes('consentCookieName = "stepup_consent_state"'), "Missing shared consent cookie.");
assert(
  !/(?:^|[,{"]\s*)(?:contact_)?(?:name|email|phone|telephone|whatsapp|revenue|income)\s*:/im.test(script),
  "A direct personal or form field appears in the tracking payload."
);

if (/youtubeId:\s*""/.test(config)) warnings.push("VSL YouTube ID is not configured.");
if (/privacyUrl:\s*""/.test(config)) warnings.push("Privacy URL is not configured; initial measurement is active but traffic remains privacy-compliance blocked.");
if (/qualifierUrl:\s*""/.test(config)) warnings.push("P2 qualifier URL is not configured; CTA remains hidden.");

if (errors.length) {
  console.error("Validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`Validation passed: ${localReferences.length} local references, one h1, responsive VSL, event contract intact.`);
warnings.forEach((warning) => console.warn(`BLOCKED: ${warning}`));
