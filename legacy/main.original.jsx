import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import siteMarkup from "./siteContent.html?raw";
import "./styles.css";

function App() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanup = [];

    const on = (element, event, handler) => {
      if (!element) return;
      element.addEventListener(event, handler);
      cleanup.push(() => element.removeEventListener(event, handler));
    };

    // Lightweight scroll reveals: no animation library needed.
    const revealTargets = root.querySelectorAll(
      "section .container > *, .section-head, .service-card, .journey-card, .team-card, .guide-card, .facility, .faq-item, .contact-info, .contact-form, .feature-band-item, .media-feature, .media-copy"
    );
    revealTargets.forEach((el, index) => {
      el.classList.add("reveal");
      if (!el.dataset.delay) el.dataset.delay = String(index % 4);
    });

    let revealObserver;
    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
      revealTargets.forEach((el) => revealObserver.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add("in-view"));
    }

    const menuBtn = root.querySelector("#menuBtn");
    const navlinks = root.querySelector("#navlinks");
    on(menuBtn, "click", () => navlinks?.classList.toggle("open"));
    navlinks?.querySelectorAll("a").forEach((a) =>
      on(a, "click", () => navlinks.classList.remove("open"))
    );

    root.querySelectorAll(".faq-question").forEach((btn) => {
      on(btn, "click", () => {
        const item = btn.closest(".faq-item");
        item?.classList.toggle("open");
        const indicator = btn.querySelector("span:last-child");
        if (indicator) indicator.textContent = item?.classList.contains("open") ? "−" : "＋";
      });
    });

    const year = root.querySelector("#year");
    if (year) year.textContent = new Date().getFullYear();

    const sampleVideo = root.querySelector(".media-feature video");
    const mediaPlay = root.querySelector(".media-play");
    if (sampleVideo && mediaPlay) {
      on(sampleVideo, "play", () => mediaPlay.style.opacity = "0");
      on(sampleVideo, "pause", () => mediaPlay.style.opacity = "1");
      on(sampleVideo, "ended", () => mediaPlay.style.opacity = "1");
    }

    let language = "en";
    const langToggle = root.querySelector("#langToggle");
    on(langToggle, "click", () => {
      language = language === "en" ? "ta" : "en";
      document.documentElement.lang = language;
      if (langToggle) langToggle.textContent = language === "en" ? "தமிழ்" : "English";
      root.querySelectorAll("[data-en][data-ta]").forEach((el) => {
        el.innerHTML = el.dataset[language];
      });
    });

    // Optional local-only counters. Opt-in is off by default; no identifiers or messages are collected.
    let analyticsEnabled = false;
    const metrics = { pageViews: 1, whatsappClicks: 0, formAttempts: 0 };
    const renderMetrics = () => {
      const labels = { pageViews: "#metricPageViews", whatsappClicks: "#metricWhatsApp", formAttempts: "#metricForm" };
      Object.entries(labels).forEach(([key, selector]) => { const el = root.querySelector(selector); if (el) el.textContent = analyticsEnabled ? String(metrics[key]) : "—"; });
    };
    const analyticsOptIn = root.querySelector("#analyticsOptIn");
    on(analyticsOptIn, "change", () => { analyticsEnabled = Boolean(analyticsOptIn.checked); renderMetrics(); });
    on(root.querySelector("#resetAnalytics"), "click", () => { metrics.pageViews = 1; metrics.whatsappClicks = 0; metrics.formAttempts = 0; renderMetrics(); });
    root.querySelectorAll('a[href*="wa.me/"]').forEach((link) => on(link, "click", () => { if (analyticsEnabled) { metrics.whatsappClicks += 1; renderMetrics(); } }));
    root.querySelectorAll(".smart-choice").forEach((button) => on(button, "click", () => {
      const message = button.dataset.waMessage || "Hello New Life Care, I have an enquiry.";
      const url = "https://wa.me/918838720889?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener,noreferrer");
    }));

    const knowledgeLanguage = root.querySelector("#knowledgeLanguage");
    const knowledgeSearch = root.querySelector("#knowledgeSearch");
    const refreshArticles = () => {
      const lang = knowledgeLanguage?.value || "en";
      root.querySelectorAll(".knowledge-card").forEach((card) => {
        const title = card.querySelector("h3");
        const para = card.querySelector("p");
        if (title) title.textContent = card.dataset[lang + "Title"] || card.dataset.enTitle;
        if (para) para.textContent = lang === "ta" ? "இந்த வழிகாட்டியைத் திறந்து தமிழில் படிக்கவும்." : "Open this guide for practical information.";
        const detail = card.querySelector(".article-detail");
        if (detail && !detail.hidden) detail.textContent = card.dataset[lang + "Body"] || card.dataset.enBody;
        const query = (knowledgeSearch?.value || "").toLowerCase();
        card.hidden = !(card.dataset.keywords + " " + card.dataset.enTitle + " " + card.dataset.taTitle).toLowerCase().includes(query);
      });
    };
    on(knowledgeLanguage, "change", refreshArticles);
    on(knowledgeSearch, "input", refreshArticles);
    root.querySelectorAll(".article-open").forEach((button) => on(button, "click", () => {
      const card = button.closest(".knowledge-card"); const detail = card?.querySelector(".article-detail"); if (!card || !detail) return;
      detail.hidden = !detail.hidden;
      detail.textContent = detail.hidden ? "" : (card.dataset[(knowledgeLanguage?.value || "en") + "Body"] || card.dataset.enBody);
      button.textContent = detail.hidden ? ((knowledgeLanguage?.value === "ta") ? "வழிகாட்டியைப் படிக்க ↗" : "Read guide ↗") : ((knowledgeLanguage?.value === "ta") ? "மூடு −" : "Close −");
    }));
    on(root.querySelector("#resetFamilyChecklist"), "click", () => root.querySelectorAll(".family-checklist input[type=checkbox]").forEach((input) => { input.checked = false; }));

    const form = root.querySelector("#enquiryForm");
    const success = root.querySelector("#formSuccess");
    on(form, "submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (analyticsEnabled) metrics.formAttempts += 1;
      renderMetrics();
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.consent = Boolean(root.querySelector("#consent")?.checked);
      if (success) { success.style.display = "block"; success.textContent = "Sending securely…"; }
      try {
        const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "The enquiry service is not available yet.");
        if (success) success.textContent = "Thank you. Your enquiry was received. The centre team will follow up using the contact details you provided.";
        form.reset();
      } catch (error) {
        if (success) success.textContent = "Your enquiry has not been sent. The secure enquiry service may not be configured yet. Please call +91 89256 20885 or use WhatsApp to contact the centre directly.";
      }
    });

    const chatLaunch = root.querySelector("#chatLaunch");
    const chatPanel = root.querySelector("#chatPanel");
    const chatClose = root.querySelector("#chatClose");
    const chatMessages = root.querySelector("#chatMessages");
    on(chatLaunch, "click", () => chatPanel?.classList.toggle("visible"));
    on(chatClose, "click", () => chatPanel?.classList.remove("visible"));

    const addBubble = (text, who = "bot") => {
      if (!chatMessages) return;
      const div = document.createElement("div");
      div.className = "bubble" + (who === "user" ? " user" : "");
      div.textContent = text;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    const replyTo = (question) => {
      const q = question.toLowerCase();
      if (["contact", "phone", "call", "whatsapp"].some((term) => q.includes(term)))
        return "Call +91 89256 20885, +91 89256 20886 or +91 89256 20887. WhatsApp: +91 88387 20889. Email: newlifecarecbe@gmail.com.";
      if (["fee", "price", "cost"].some((term) => q.includes(term)))
        return "Fees have not been added yet. Please contact the centre for current pricing and what is included.";
      if (["admission", "duration", "programme"].some((term) => q.includes(term)))
        return "Please contact the centre to confirm admission steps, programme availability and duration.";
      if (["treatment", "alcohol", "drug", "counselling", "tobacco"].some((term) => q.includes(term)))
        return "Listed support topics include alcohol, drug and tobacco concerns, counselling, family counselling, rehabilitation and aftercare. Please contact the centre to confirm current services.";
      if (["address", "location", "where"].some((term) => q.includes(term)))
        return "New Life Care, No. 3/3, Bajanai Kovil Street, Udayampalayam, Coimbatore – 641049, Tamil Nadu.";
      return "I can share general contact, listed service, admission and fee information. For specific or sensitive questions, please speak directly with the centre team.";
    };
    const chatForm = root.querySelector("#chatForm");
    const chatInput = root.querySelector("#chatText");
    on(chatForm, "submit", (event) => {
      event.preventDefault();
      const question = chatInput?.value.trim();
      if (!question) return;
      addBubble(question, "user");
      chatInput.value = "";
      addBubble("One moment…", "bot");
      const pending = chatMessages?.lastElementChild;
      fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: question, language: document.documentElement.lang === "ta" ? "ta" : "en" }) })
        .then(async (response) => { const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Chat service not configured"); return data; })
        .then((data) => { if (pending?.parentNode) pending.textContent = data.reply; else addBubble(data.reply); })
        .catch(() => { const answer = replyTo(question) + " (Automated AI chat is not connected yet; this is a prepared demo response.)"; if (pending?.parentNode) pending.textContent = answer; else addBubble(answer); });
    });
    root.querySelectorAll(".quick-questions button").forEach((button) => {
      on(button, "click", () => {
        addBubble(button.dataset.question, "user");
        addBubble(replyTo(button.dataset.question || ""));
      });
    });

    return () => {
      cleanup.forEach((fn) => fn());
      revealObserver?.disconnect();
    };
  }, []);

  return <div ref={rootRef} className="react-site-root" dangerouslySetInnerHTML={{ __html: siteMarkup }} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
