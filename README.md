# scamalert

Local scam-awareness demo assets.

## Talk browser extension

Load `xfinity-serp-extension` once in Chrome. It currently powers:

- Google `xfinity support` fake sponsored result
- Natasha's Kitchen recipe-page infection pop-up
- Gmail sender-name rewrite for the IRS email demo

After changing extension files, reload the extension at `chrome://extensions`.

## Xfinity support search demo

This demo uses an unpacked Chrome extension to add a local training result above
Google search results when you search for `xfinity support`.

### One-time talk setup

Install local host-name overrides so fake talk domains resolve to your laptop:

```sh
sudo scripts/talk.sh install-hosts
```

Start the local talk server:

```sh
sudo scripts/talk.sh start
```

Check everything:

```sh
scripts/talk.sh status
scripts/talk.sh urls
```

### Chrome extension setup

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select `xfinity-serp-extension`.
5. Go to Google and search `xfinity support`.
6. Click the injected result to open:

   ```text
   http://xfinitysupport.com/
   ```

The fake support page is static. It is designed to look plausible and put a
large "call us" phone number in front of the audience; it does not collect
credentials or submit forms.

To stop the local server after the talk:

```sh
sudo scripts/talk.sh stop
```

## Recipe pop-up demo

With the extension loaded, open:

```text
https://natashaskitchen.com/quick-creme-brulee-recipe/
```

After 5 seconds, a fake infection warning appears and tells the viewer to call:

```text
770-757-9405
```

## SafeBank demo

The local talk server maps `safebank.com` to the sample bank page:

```text
http://safebank.com/
```

The IRS refund page is available at:

```text
http://irs-refund.com/
```

The same page is also available directly:

```text
http://safebank.com/bank-demo.html
```

Console helpers for the bank demo:

```js
rM()
aM()
```

`rM()` shows the "hackers stole money" moment. `aM()` shows the fake refund
mistake where the amount becomes too large.

## IRS email demo

Use the standalone email body as the source for a real demo email:

```text
http://xfinitysupport.com/email.html
```

Open that page in Chrome, select the rendered email body, copy it, and paste it
into a Gmail compose window. Use this subject:

```text
Action Required: Tax Refund Verification Needed
```

The email button opens:

```text
http://irs-refund.com/
```
