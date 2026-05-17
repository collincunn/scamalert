(function () {
  const TARGET_MESSAGE_ID = "FMfcgzQgLrwMHHzvBSqFJqDTNvxZZZdF";
  const OVERLAY_ID = "scamalert-gmail-irs-message";
  const PHISH_URL = "http://irs-refund.com/";

  function shouldShowDemo() {
    return window.location.hash.includes(TARGET_MESSAGE_ID);
  }

  function removeDemo() {
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) existing.remove();
  }

  function showDemo() {
    if (!shouldShowDemo()) {
      removeDemo();
      return;
    }
    if (document.getElementById(OVERLAY_ID)) return;

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.style.cssText = [
      "position:fixed",
      "left:220px",
      "right:28px",
      "top:86px",
      "bottom:26px",
      "z-index:2147483646",
      "background:#fff",
      "color:#202124",
      "box-shadow:0 8px 28px rgba(60,64,67,0.24)",
      "border:1px solid #dadce0",
      "border-radius:8px",
      "font-family:Arial,Helvetica,sans-serif",
      "overflow:auto"
    ].join(";");

    overlay.innerHTML = `
      <div style="
        height:48px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        border-bottom:1px solid #e0e0e0;
        padding:0 18px;
        background:#f8fafd;
        border-radius:8px 8px 0 0;
      ">
        <div style="display:flex;align-items:center;gap:14px;color:#5f6368;font-size:14px;">
          <span style="font-size:20px;color:#5f6368;">&larr;</span>
          <span>Archive</span>
          <span>Report spam</span>
          <span>Delete</span>
        </div>
        <button id="scamalert-gmail-close" type="button" style="
          border:none;
          background:transparent;
          color:#5f6368;
          font-size:22px;
          line-height:1;
          cursor:pointer;
          padding:6px 8px;
        " aria-label="Close demo overlay">x</button>
      </div>

      <div style="padding:24px 34px 40px;">
        <h1 style="
          font-size:22px;
          font-weight:400;
          color:#202124;
          margin:0 0 18px;
        ">Action Required: Tax Refund Verification Needed</h1>

        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:24px;">
          <div style="
            width:40px;
            height:40px;
            border-radius:50%;
            background:#1a73e8;
            color:#fff;
            display:grid;
            place-items:center;
            font-size:18px;
            font-weight:700;
            flex:0 0 auto;
          ">I</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;gap:16px;">
              <div>
                <div style="font-size:14px;color:#202124;">
                  <strong>Internal Revenue Service</strong>
                  <span style="color:#5f6368;"> &lt;notice@irs-refund.com&gt;</span>
                </div>
                <div style="font-size:12px;color:#5f6368;margin-top:3px;">to me</div>
              </div>
              <div style="font-size:12px;color:#5f6368;white-space:nowrap;">Today, 8:14 AM</div>
            </div>

            <div style="
              margin-top:28px;
              max-width:760px;
              border:1px solid #d7dce2;
              border-radius:4px;
              overflow:hidden;
              color:#1f2937;
              font-size:15px;
              line-height:1.55;
            ">
              <div style="
                background:#f1f5f9;
                border-bottom:4px solid #1f4e79;
                padding:18px 22px;
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:18px;
              ">
                <div>
                  <div style="font-size:22px;font-weight:700;color:#1f2937;">IRS</div>
                  <div style="font-size:12px;color:#4b5563;">Internal Revenue Service</div>
                </div>
                <div style="font-size:13px;color:#4b5563;text-align:right;">Refund Verification Department</div>
              </div>

              <div style="padding:24px 26px 28px;background:#fff;">
                <p style="margin:0 0 16px;">Dear Taxpayer,</p>
                <p style="margin:0 0 16px;">
                  Our records indicate that your 2025 tax refund is currently on hold pending identity verification.
                  You must verify your refund destination before funds can be released.
                </p>
                <p style="margin:0 0 18px;">
                  Failure to complete verification may delay your refund or result in the return being flagged for review.
                </p>

                <div style="
                  background:#fef3c7;
                  border:1px solid #f59e0b;
                  color:#7c2d12;
                  padding:13px 15px;
                  border-radius:4px;
                  margin:0 0 22px;
                ">
                  Final notice: verification must be completed today.
                </div>

                <a href="${PHISH_URL}" style="
                  display:inline-block;
                  background:#1f4e79;
                  color:#fff;
                  text-decoration:none;
                  border-radius:3px;
                  padding:12px 20px;
                  font-size:15px;
                  font-weight:700;
                ">Verify Refund</a>

                <p style="margin:24px 0 0;color:#4b5563;font-size:13px;">
                  Reference ID: IRS-RFD-48291-26<br>
                  This automated message was sent by the Refund Verification Department.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.documentElement.appendChild(overlay);
    document.getElementById("scamalert-gmail-close").addEventListener("click", removeDemo);
  }

  function scheduleDemo() {
    window.setTimeout(showDemo, 350);
  }

  scheduleDemo();
  window.addEventListener("hashchange", scheduleDemo);
  new MutationObserver(scheduleDemo).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
