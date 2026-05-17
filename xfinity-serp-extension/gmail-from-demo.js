(function () {
  const TARGET_SENDER_XPATH = "/html/body/div[6]/div[3]/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div[8]/div/div[1]/div[3]/div/table/tbody/tr[1]/td[4]/div[2]/span/span";
  const FROM_NAME = "Internal Revenue Service";
  const FROM_EMAIL = "notice@irs-refund.com";
  const MAX_ATTEMPTS = 240;
  let attempts = 0;

  function byXPath(xpath) {
    return document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  }

  function updateSender(sender) {
    if (!sender) return false;
    const changed = sender.textContent !== FROM_NAME ||
      sender.getAttribute("email") !== FROM_EMAIL ||
      sender.getAttribute("name") !== FROM_NAME;

    if (changed) {
      sender.textContent = FROM_NAME;
      sender.setAttribute("email", FROM_EMAIL);
      sender.setAttribute("name", FROM_NAME);
      sender.setAttribute("title", `${FROM_NAME} <${FROM_EMAIL}>`);
    }

    const senderContainer = sender.closest(".yW, .yX, td") || sender.parentElement;
    if (senderContainer) {
      senderContainer.setAttribute("title", `${FROM_NAME} <${FROM_EMAIL}>`);
      senderContainer.setAttribute("aria-label", FROM_NAME);
    }
    return true;
  }

  function run() {
    if (!window.location.hash.startsWith("#inbox")) return false;
    return updateSender(byXPath(TARGET_SENDER_XPATH));
  }

  const timer = window.setInterval(() => {
    attempts += 1;
    run();
    if (attempts >= MAX_ATTEMPTS) {
      window.clearInterval(timer);
    }
  }, 500);
})();
