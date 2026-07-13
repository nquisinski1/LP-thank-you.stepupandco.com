(function () {
  "use strict";

  const config = window.STEPUP_THANK_YOU_CONFIG || {};
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  const consentKey = "stepup_campaign_consent";
  const sessionKey = "stepup_campaign_session_id";
  const allowedMetaPixelId = "2249459879220653";
  let volatileSessionId = "";

  function nowIso() {
    return new Date().toISOString();
  }

  function uuid() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return "evt_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2);
  }

  function getSessionId() {
    let value = "";
    try {
      value = sessionStorage.getItem(sessionKey) || "";
    } catch {
      value = volatileSessionId;
    }

    if (!value) {
      value = uuid();
      volatileSessionId = value;
      try {
        sessionStorage.setItem(sessionKey, value);
      } catch {
        // Some local previews block storage. The in-memory ID keeps tracking stable for this view.
      }
    }
    return value;
  }

  function sanitizeUrl() {
    const url = new URL(window.location.href);
    let changed = false;

    [...url.searchParams.keys()].forEach((key) => {
      if (key !== "event_id") {
        url.searchParams.delete(key);
        changed = true;
      }
    });

    const eventId = url.searchParams.get("event_id") || "";
    if (eventId && !/^[A-Za-z0-9_-]{1,128}$/.test(eventId)) {
      url.searchParams.delete("event_id");
      changed = true;
    }

    if (changed) {
      try {
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
      } catch {
        // The URL is still excluded from analytics below if file previews reject replaceState.
      }
    }
  }

  function getRegistrationEventId() {
    const value = new URLSearchParams(window.location.search).get("event_id") || "";
    return /^[A-Za-z0-9_-]{1,128}$/.test(value) ? value : "";
  }

  function pushEvent(name, params) {
    dataLayer.push({
      event: name,
      event_time: nowIso(),
      page_location: window.location.origin === "null" ? window.location.pathname : window.location.origin + window.location.pathname,
      page_title: document.title,
      session_id: getSessionId(),
      ...(params || {})
    });
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  function safeHttpUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function configureExternalLink(selector, value, hideWhenMissing) {
    const link = document.querySelector(selector);
    if (!link) return;
    const url = safeHttpUrl(value);
    if (!url) {
      if (hideWhenMissing) link.hidden = true;
      return;
    }
    link.href = url;
    link.hidden = false;
  }

  function configurePage() {
    setText("[data-session-title]", config.session?.title);
    setText("[data-session-date]", config.session?.dateLabel);
    setText("[data-session-access]", config.session?.accessLabel);
    setText("[data-closing-note]", config.session?.closingNote);
    setText("[data-vsl-duration]", config.vsl?.durationLabel);
    setText("[data-current-year]", new Date().getFullYear());

    const privacyUrl = safeHttpUrl(config.links?.privacyUrl);
    document.querySelectorAll("[data-privacy-link], [data-consent-privacy-link]").forEach((link) => {
      if (!privacyUrl) return;
      link.href = privacyUrl;
      link.removeAttribute("aria-disabled");
    });

    const companyUrl = safeHttpUrl(config.links?.companyUrl);
    document.querySelectorAll("[data-company-link]").forEach((link) => {
      if (companyUrl) link.href = companyUrl;
    });

    configureExternalLink("[data-report-link]", config.links?.reportUrl, false);
    configureExternalLink('[data-social-link="linkedin"]', config.links?.linkedinUrl, false);
    configureExternalLink('[data-social-link="instagram"]', config.links?.instagramUrl, false);
    configureExternalLink('[data-social-link="youtube"]', config.links?.youtubeUrl, true);

    document.querySelectorAll("[data-authority-link]").forEach((link) => {
      link.addEventListener("click", () => {
        pushEvent("authority_content_clicked", { source: link.dataset.authorityLink || "unknown" });
      });
    });

    const p2Cta = document.querySelector("[data-p2-cta]");
    const qualifierUrl = safeHttpUrl(config.p2?.qualifierUrl);
    if (p2Cta && qualifierUrl) {
      p2Cta.href = qualifierUrl;
      p2Cta.textContent = config.p2?.label || "Completar diagnóstico inicial";
      p2Cta.hidden = false;
      p2Cta.addEventListener("click", () => {
        pushEvent("qualifier_cta_clicked", { location: "thank_you" });
      });
    }
  }

  function setupVsl() {
    const trigger = document.querySelector("[data-vsl-trigger]");
    const message = document.querySelector("[data-vsl-message]");
    const youtubeId = String(config.vsl?.youtubeId || "").trim();

    trigger?.addEventListener("click", () => {
      if (!/^[A-Za-z0-9_-]{11}$/.test(youtubeId)) {
        if (message) {
          message.textContent = "El video será conectado antes del lanzamiento.";
          message.hidden = false;
        }
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.className = "vsl-frame";
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = "Mensaje de Harold Mesa antes de la masterclass";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      trigger.replaceWith(iframe);
      if (message) message.hidden = true;
      pushEvent("vsl_started", { location: "thank_you" });
    });
  }

  async function copyInviteUrl(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function setupSharing() {
    const module = document.querySelector("[data-invite-module]");
    const registrationUrl = safeHttpUrl(config.share?.registrationUrl);
    if (!module || !registrationUrl) {
      if (module) module.hidden = true;
      return;
    }

    const shareUrl = registrationUrl.endsWith("/") ? registrationUrl.slice(0, -1) : registrationUrl;
    const share = module.querySelector("[data-registration-share]");
    const status = module.querySelector("[data-share-status]");

    share?.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Masterclass ejecutiva · StepUp & Company",
            text: "Te invito a registrarte en esta masterclass ejecutiva con Harold Mesa.",
            url: shareUrl
          });
          if (status) status.textContent = "Enlace compartido.";
          pushEvent("invite_shared", { channel: "native_share" });
          return;
        } catch (error) {
          if (error?.name === "AbortError") {
            if (status) status.textContent = "Compartir cancelado.";
            return;
          }
        }
      }

      try {
        await copyInviteUrl(shareUrl);
        if (status) status.textContent = "Enlace copiado. Ya puedes enviarlo.";
        pushEvent("invite_shared", { channel: "copy" });
      } catch {
        if (status) status.textContent = "No fue posible copiar. Abre la página de registro y copia su dirección.";
      }
    });
  }

  function readConsent() {
    try {
      return JSON.parse(localStorage.getItem(consentKey) || "null");
    } catch {
      return null;
    }
  }

  function saveConsent(status) {
    const value = {
      status,
      version: config.tracking?.consentVersion || "unversioned",
      timestamp: nowIso()
    };
    try {
      localStorage.setItem(consentKey, JSON.stringify(value));
    } catch {
      // Consent still applies to the current view when persistent storage is unavailable.
    }
    return value;
  }

  function loadScript(src) {
    if ([...document.scripts].some((script) => script.src === src)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function initMeta() {
    const pixelId = String(config.tracking?.metaPixelId || "");
    if (pixelId !== allowedMetaPixelId) return;
    if (config.tracking?.blockedPixelIds?.includes(pixelId)) return;
    if (window.fbq) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  function initGtmAndGa4() {
    const gtmId = String(config.tracking?.gtmContainerId || "");
    const ga4Id = String(config.tracking?.ga4MeasurementId || "");

    if (/^GTM-[A-Z0-9]+$/.test(gtmId)) {
      dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
    }

    if (/^G-[A-Z0-9]+$/.test(ga4Id)) {
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`);
      window.gtag = function () {
        dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", ga4Id, { send_page_view: false });
    }
  }

  function activateMeasurement() {
    if (!safeHttpUrl(config.links?.privacyUrl)) return;
    initMeta();
    initGtmAndGa4();
  }

  function setupConsent() {
    const banner = document.querySelector("[data-consent-banner]");
    const accept = document.querySelector("[data-consent-accept]");
    const decline = document.querySelector("[data-consent-decline]");
    const stored = readConsent();
    const privacyUrl = safeHttpUrl(config.links?.privacyUrl);
    const consentVersion = config.tracking?.consentVersion || "unversioned";
    const consentIsCurrent = stored?.version === consentVersion;
    const hasMeasurement = Boolean(
      config.tracking?.metaPixelId ||
      config.tracking?.gtmContainerId ||
      config.tracking?.ga4MeasurementId
    );

    if (!privacyUrl || !hasMeasurement) return;

    if (consentIsCurrent && stored?.status === "accepted") {
      activateMeasurement();
      return;
    }

    if (consentIsCurrent && stored?.status === "declined") return;
    banner.hidden = false;

    accept?.addEventListener("click", () => {
      saveConsent("accepted");
      banner.hidden = true;
      activateMeasurement();
    });

    decline?.addEventListener("click", () => {
      saveConsent("declined");
      banner.hidden = true;
    });
  }

  sanitizeUrl();
  configurePage();
  setupVsl();
  setupSharing();
  pushEvent("thank_you_viewed", { registration_event_id: getRegistrationEventId() });
  setupConsent();
})();
