// ============================================================
// Meta Conversions API (server-side) — /api/capi
// ------------------------------------------------------------
// Receives a completed EOI conversion from the /thank-you page and
// forwards it to Meta with the SAME event_id as the browser Pixel, so
// Meta deduplicates the browser + server pair into one conversion.
//
// Collects NO PII. Match keys are the _fbp/_fbc cookies (from the client)
// plus the IP address and User-Agent the server observes. Email is never
// sent to Meta — it stays with the site's own records / Mailchimp.
//
// Config via Vercel Environment Variables (never hard-code the token):
//   META_DATASET_ID      = 2735393030169285   (the ClassCover Ireland pixel/dataset)
//   META_CAPI_TOKEN      = <Conversions API access token from Events Manager>
//   META_TEST_EVENT_CODE = <optional; set ONLY while testing, then remove>
// ============================================================

const API_VERSION = 'v21.0';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const DATASET_ID = process.env.META_DATASET_ID;
  const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;
  const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

  if (!DATASET_ID || !ACCESS_TOKEN) {
    res.status(500).json({ error: 'capi_not_configured' });
    return;
  }

  // Body may arrive parsed (fetch) or as a raw string (sendBeacon Blob).
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  if (!body || !body.event_id || !body.event_name) {
    res.status(400).json({ error: 'bad_request' });
    return;
  }

  // Server-observed match signals (no PII).
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ua = req.headers['user-agent'] || '';

  const userData = {};
  if (ip) userData.client_ip_address = ip;
  if (ua) userData.client_user_agent = ua;
  if (body.fbp) userData.fbp = body.fbp;
  if (body.fbc) userData.fbc = body.fbc;

  const customData = {};
  if (body.signup_type) customData.signup_type = body.signup_type;
  if (body.utms && typeof body.utms === 'object') Object.assign(customData, body.utms);

  const payload = {
    data: [{
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,          // shared with the Pixel → dedupe
      action_source: 'website',
      event_source_url: body.event_source_url || '',
      user_data: userData,
      custom_data: customData
    }],
    access_token: ACCESS_TOKEN
  };
  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  try {
    const resp = await fetch(
      'https://graph.facebook.com/' + API_VERSION + '/' + DATASET_ID + '/events',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    const result = await resp.json();
    // Never echo the token or full request back to the browser.
    res.status(resp.ok ? 200 : 502).json({
      ok: resp.ok,
      events_received: result && result.events_received,
      fbtrace_id: result && result.fbtrace_id,
      error: result && result.error ? result.error.message : undefined
    });
  } catch (e) {
    res.status(502).json({ error: 'capi_forward_failed' });
  }
};
