Vezemo v12 — fixed build (2026-10-05)

Key changes:
- Removed the Advertising section from the admin panel and removed its admin API endpoints.
- Meta Pixel ID 2201396533755976 is hard-coded once in public/index.html.
- PageView is sent by the base Pixel snippet. Lead is intentionally configured manually in Meta Event Setup Tool.
- Automatic browser Lead and server-side CAPI Lead are disabled to avoid duplicate/manual-event conflicts.
- UTM, fbclid, _fbp and _fbc source data are still stored with orders for attribution/source analysis.
- Address autocomplete remains API-key-free via Photon/OpenStreetMap through start.mjs.
- Route calculation remains API-key-free via OSRM through start.mjs.
- Calculator now rejects unsupported serviceHours and empty/unknown cargo IDs instead of silently undercalculating.
- Final order price is recalculated on the server.

See README-FIXES.txt for a concise technical summary.
