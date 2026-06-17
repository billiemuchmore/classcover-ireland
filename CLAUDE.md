# ClassCover Ireland — Claude Code Instructions

## Brand identity (read before writing any copy for this site)
Brand voice, positioning, audience, competitors, keyword plan, and visual rules live in the classcover-ai workspace and are the source of truth for every ClassCover team:

- `~/classcover-ai/teams/shared/brands/classcover-ireland/brand/` — voice-profile.md, positioning.md, audience.md, competitors.md, keyword-plan.md, assets.md
- `~/classcover-ai/teams/shared/brands/classcover-ireland/visual/` — logo.md, colour-palette.md, typography.md, design-system.md

Read the relevant file before producing or editing copy or creative for this site. Copy drafted for the live site (blog posts, landing pages, reviews) is normally authored inside classcover-ai first (specifically `~/classcover-ai/teams/marketing/brands/classcover-ireland/`), then handed to this folder for publishing.

The rules below in this file govern site-specific technical requirements (GTM, consent/CookieYes, Meta Pixel, geo targeting, schema, Ireland terminology) — they stack on top of the brand rules, not replace them.

> **Canonical `<head>` order for any new page** (this is a static site — there is NO shared template, so every page's `<head>` must carry these itself):
> 1. CookieYes consent script (first, so it gates everything)
> 2. Google Tag Manager snippet
> 3. `<meta charset>` / `<meta viewport>` → geo meta tags
> 4. title / description → og:locale + hreflang
> 5. GA4 gtag snippet
> 6. Meta `facebook-domain-verification` tag
> 7. stylesheet
>
> Conversion tracking (Meta Pixel, Typeform popups, GA4 `conversion` event) is NOT per-page — it lives in `main.js` and applies everywhere automatically. Never paste pixel/event code into a page.

## Google Tag Manager

GTM container ID: **GTM-N4NPQXVQ**

Every new HTML page MUST include both snippets:

**1. Immediately after `<head>`:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N4NPQXVQ');</script>
<!-- End Google Tag Manager -->
```

**2. Immediately after `<body>`:**
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N4NPQXVQ"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

`main.js` also auto-injects GTM as a fallback for any page that includes it, but the HTML snippets above are still required for best performance.

## Consent — CookieYes (required on every page)

This is an EU (Ireland) site, so non-essential tracking (GTM, GA4, Meta Pixel) MUST be consent-gated. Consent is handled by **CookieYes** + Google Consent Mode v2 (default denied).

Every new HTML page MUST include the CookieYes script as the **first element inside `<head>`** — before the GTM snippet — so it gates GTM/GA from first paint:

```html
<!-- Start cookieyes banner -->
<script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/10929c6c8f533925aae98aa2a8da772b/script.js"></script>
<!-- End cookieyes banner -->
```

`main.js` also auto-injects CookieYes as a fallback for any page that includes it, but it loads late (end of `<body>`), so the hardcoded head snippet above is still required for proper consent gating.

## Meta Pixel & domain verification

- **Conversion tracking lives entirely in `main.js`** — Meta Pixel base code, the `CompleteRegistration` event, the GA4 `conversion` event, and the Typeform-popup wiring. It auto-applies to every page. **Never add Meta Pixel or conversion-event code to individual pages.**
- Pixel ID **2735393030169285**, consent-gated behind the CookieYes `advertisement` category. Fires `CompleteRegistration` (+ GA4 `conversion`) on genuine EOI popup submit, with `signup_type`, UTMs, and a shared `event_id`.
- Every new HTML page MUST include the Meta domain-verification tag in `<head>` (Meta's crawler reads raw HTML, so this can't be JS-injected):

```html
<meta name="facebook-domain-verification" content="v8a7px9he8pv0dts1qvvg1dwryitva" />
```

## Geographic targeting — required on every page

This site serves **Ireland only**. Every new HTML page MUST include these three tags in `<head>`, after the `<meta name="description">` line and before any `<link rel="stylesheet">`:

```html
<meta property="og:locale" content="en_IE" />
<link rel="alternate" hreflang="en-IE" href="https://www.classcoverapp.ie/PAGE-URL" />
<link rel="alternate" hreflang="x-default" href="https://www.classcoverapp.ie" />
```

Rules:
- `<html lang="en-IE">` — always `en-IE`, never just `en`
- `og:locale` is always `en_IE` — never `en_US` or `en_AU`
- `hreflang="en-IE"` href must be the **canonical URL of that specific page** (with trailing slash for directories)
- `hreflang="x-default"` href is always `https://www.classcoverapp.ie` (the homepage) — never changes
- Pages with `<meta name="robots" content="noindex">` (e.g. thank-you.html) can omit hreflang — Google ignores it on noindex pages

## Geo meta tags — required on every page

Add immediately after `<meta name="viewport" ...>`:

```html
<meta name="geo.region" content="IE" />
<meta name="geo.country" content="Ireland" />
<meta name="ICBM" content="53.3498,-6.2603" />
```

## Organization schema — required fields

Every Organization JSON-LD block must include `areaServed` and `address`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ClassCover Ireland",
  "url": "https://www.classcoverapp.ie",
  "logo": "https://www.classcoverapp.ie/images/logo-dark.png",
  "areaServed": "IE",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IE"
  },
  "sameAs": ["https://www.classcover.com.au"]
}
```

## Deployment

Static HTML site. Push to `main` branch → Vercel auto-deploys to classcoverapp.ie.

## Ireland terminology

- NEVER say "relief teacher" (Australian term)
- Always say "substitute teacher" or "sub"
- SNAs (Special Needs Assistants) are a distinct supply-side role — treat separately from substitute teachers
