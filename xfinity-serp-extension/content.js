(function () {
  const DEMO_URL = "http://xfinitysupport.com/fake-xfinity-support.html";
  const QUERY_RE = /\bxfinity\b.*\bsupport\b|\bsupport\b.*\bxfinity\b/i;
  const CARD_ID = "scamalert-xfinity-serp-demo";

  function currentQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  function shouldInject() {
    return QUERY_RE.test(currentQuery()) && !document.getElementById(CARD_ID);
  }

  function findInsertionPoint() {
    return document.querySelector("#search") ||
      document.querySelector('[role="main"]') ||
      document.querySelector("#rso") ||
      document.body;
  }

  function isDarkMode() {
    const bodyColor = window.getComputedStyle(document.body).backgroundColor;
    const darkPreference = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return darkPreference || bodyColor === "rgb(32, 33, 36)" || bodyColor === "rgb(31, 31, 31)";
  }

  function buildResult() {
    const dark = isDarkMode();
    const text = dark ? "#bdc1c6" : "#4d5156";
    const title = dark ? "#8ab4f8" : "#1a0dab";
    const label = dark ? "#e8eaed" : "#202124";
    const url = dark ? "#bdc1c6" : "#5f6368";

    const wrapper = document.createElement("div");
    wrapper.id = CARD_ID;
    wrapper.style.cssText = [
      "background:transparent",
      "border-radius:0",
      "margin:0 0 28px 0",
      "padding:0",
      "font-family:Arial,sans-serif",
      "max-width:652px",
      "font-weight:400"
    ].join(";");

    wrapper.innerHTML = `
      <div style="font-size:14px;line-height:1.4;color:${label};margin-bottom:2px;">
        <span style="font-weight:700;">Sponsored</span>
        <span style="color:${url};"> - xfinitysupport.com</span>
      </div>
      <a href="${DEMO_URL}" style="text-decoration:none;">
        <div style="font-size:20px;line-height:1.3;color:${title};margin-bottom:4px;font-weight:400;">
          Xfinity Support - Call Us for Internet, Billing, and Account Help
        </div>
      </a>
      <div style="font-size:14px;line-height:1.58;color:${text};font-weight:400;">
        Get help with Xfinity service interruptions, billing alerts, account verification, and equipment setup.
        Call support now for your home internet account.
      </div>
      <div style="display:flex;gap:18px;margin-top:10px;font-size:14px;">
        <a href="${DEMO_URL}" style="color:${title};text-decoration:none;">Contact support</a>
        <a href="${DEMO_URL}" style="color:${title};text-decoration:none;">Billing help</a>
        <a href="${DEMO_URL}" style="color:${title};text-decoration:none;">Reset equipment</a>
      </div>
    `;

    return wrapper;
  }

  function inject() {
    if (!shouldInject()) return;
    const target = findInsertionPoint();
    if (!target) return;

    const result = buildResult();
    if (target.id === "search") {
      target.insertBefore(result, target.firstChild);
      return;
    }
    target.prepend(result);
  }

  inject();

  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      window.setTimeout(inject, 250);
    } else if (shouldInject()) {
      inject();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
