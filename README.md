Vezemo v12 — fixed build (2026-10-05)

Key changes:
- Removed the Advertising section from the admin panel and removed its admin API endpoints.
- Meta Pixel ID 2201396533755976 is hard-coded once in public/index.html.
- PageView is sent by the base Pixel snippet; successful order creation sends Lead.
- Browser Lead eventID is preserved through multipart payload parsing so optional CAPI deduplication works.
- Optional Meta Conversions API now uses Graph API v26.0 and Render environment variables META_ACCESS_TOKEN / META_TEST_EVENT_CODE.
- Address autocomplete remains API-key-free via Photon/OpenStreetMap through start.mjs.
- Route calculation remains API-key-free via OSRM through start.mjs.
- Calculator now rejects unsupported serviceHours and empty/unknown cargo IDs instead of silently undercalculating.
- Final order price is recalculated on the server.

See README-FIXES.txt for a concise technical summary.
