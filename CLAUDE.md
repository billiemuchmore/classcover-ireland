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

## Deployment

Static HTML site. Push to `main` branch → Vercel auto-deploys to classcoverapp.com.

## Ireland terminology

- NEVER say "relief teacher" (Australian term)
- Always say "substitute teacher" or "sub"
- SNAs (Special Needs Assistants) are a distinct supply-side role — treat separately from substitute teachers
