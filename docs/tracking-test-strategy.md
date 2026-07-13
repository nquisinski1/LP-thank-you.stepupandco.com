# Tracking test strategy

```yaml
test_strategy:
  artifact: "src/script.js journey tracking"
  rationale: "The page carries a pseudonymous GHL contact identifier across URL, dataLayer, GTM and consent-state boundaries; regressions can break attribution or expose direct personal data."
  criticality: "HIGH"

  selected_types:
    - rationale: "URL parsing, identifier validation and consent transitions contain branches with stable invariants."
      type: "unit"
      size: "small"
      framework: "node:assert + node:vm"
      dependencies:
        - "in-memory browser API stubs"
      gate: "Gate 1"
    - rationale: "The behavior crosses URL, cookies, browser storage, DOM events and dataLayer in one journey."
      type: "integration"
      size: "small"
      framework: "node:assert + node:vm"
      dependencies:
        - "real production config.js and script.js"
      gate: "Gate 2"
    - rationale: "GHL supplies cid/event_id while GTM consumes the emitted event schema on an independent configuration cadence."
      type: "contract"
      size: "small"
      framework: "project validator + node:assert"
      dependencies:
        - "documented GHL redirect and dataLayer contracts"
      gate: "Gate 4"
    - rationale: "The page is deployable and exposes root plus health-check routes."
      type: "smoke"
      size: "medium"
      framework: "HTTP probe"
      dependencies:
        - "local Node server or deployed Hostinger URL"
      gate: "Gate 5"

  rejected_types:
    - reason: "No visual behavior changed and the deterministic browser-state harness covers the requested tracking behavior without a full browser."
      type: "component"
    - reason: "A deployed end-to-end GHL redirect requires account state and is retained as launch QA rather than CI."
      type: "e2e"
    - reason: "The identifier grammar has finite boundaries at empty, 1, 128 and 129 characters; table-driven boundary cases are sufficient."
      type: "property-based"

  deliberately_skipped:
    - why: "The GTM container is external account state and cannot be proven by repository tests."
      what: "GTM Preview verification of actual GA4 and Meta tags"
    - why: "The public privacy notice URL has not been supplied."
      what: "Legal approval of tacit-consent and opt-out disclosure"
```

## Test Cases to Cover

### AC-1: The redirect preserves only approved journey identifiers

- [unit] valid `cid` and `event_id` remain while direct form fields are removed.
- [unit] a 128-character `cid` remains.
- [unit] a 129-character `cid` is removed.
- [unit] an identifier containing a forbidden character is removed.

### AC-2: Initial journey events carry the correct identifiers

- [integration] `thank_you_viewed` receives `contact_id` and the technical `event_id`.
- [integration] `registration_completed` receives the same identifiers.
- [integration] `page_location` excludes the query string.
- [contract] GTM loads before the initial journey events are consumed.

### AC-3: Opt-out changes subsequent measurement state

- [integration] a first-time visitor starts with `granted_default` and sees the banner.
- [integration] selecting essential-only stores `necessary_only` and updates Google Consent Mode to denied.
- [integration] a returning essential-only visitor starts with denied storage and does not see the banner.

### AC-4: Direct personal and form values never enter the dataLayer

- [contract] name, email, phone and revenue query values are removed before any event is emitted.
