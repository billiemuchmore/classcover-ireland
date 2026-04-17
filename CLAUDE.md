# ClassCover Ireland — Claude Code Instructions

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

## Geographic targeting — required on every page

This site serves **Ireland only**. Every new HTML page MUST include these three tags in `<head>`, after the `<meta name="description">` line and before any `<link rel="stylesheet">`:

```html
<meta property="og:locale" content="en_IE" />
<link rel="alternate" hreflang="en-IE" href="https://www.classcoverapp.com/PAGE-URL" />
<link rel="alternate" hreflang="x-default" href="https://www.classcoverapp.com" />
```

Rules:
- `<html lang="en-IE">` — always `en-IE`, never just `en`
- `og:locale` is always `en_IE` — never `en_US` or `en_AU`
- `hreflang="en-IE"` href must be the **canonical URL of that specific page** (with trailing slash for directories)
- `hreflang="x-default"` href is always `https://www.classcoverapp.com` (the homepage) — never changes
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
  "url": "https://www.classcoverapp.com",
  "logo": "https://www.classcoverapp.com/images/logo-dark.png",
  "areaServed": "IE",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IE"
  },
  "sameAs": ["https://www.classcover.com.au"]
}
```

## Deployment

Static HTML site. Push to `main` branch → Vercel auto-deploys to classcoverapp.com.

## Ireland terminology

- NEVER say "relief teacher" (Australian term)
- Always say "substitute teacher" or "sub"
- SNAs (Special Needs Assistants) are a distinct supply-side role — treat separately from substitute teachers
