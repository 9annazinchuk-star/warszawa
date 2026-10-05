Vezemo v12 — final fixes (2026-10-05)

1. Meta Pixel
- Pixel ID 2201396533755976 is hard-coded once in public/index.html using the standard Meta Pixel loader.
- PageView is sent from the base snippet; successful requests send browser Lead with a unique eventID.
- Pixel no longer depends on the admin panel or database settings.
- The Advertising section and /api/admin/advertising endpoints were removed.
- Optional server-side Conversions API uses META_ACCESS_TOKEN / META_TEST_EVENT_CODE only and Graph API v26.0.
- Browser Lead and server Lead use the same event_id for deduplication when CAPI is enabled.

2. Address search and routes without an API key
- No Google API key is required.
- Address autocomplete uses Photon / OpenStreetMap data.
- Driving routes use public OSRM routing with a second OSRM fallback.
- Public providers still require Internet access and have no commercial SLA.

3. Calculator hardening
- serviceHours accepts only 0, 1, 2, or 3 (0 means “More / agreed individually”).
- Quote API rejects empty/unknown cargo IDs instead of silently returning an incomplete price.
- Order creation re-checks cargo IDs and route on the server before saving the final quote.

Admin cleanup update:
- Added a red × delete button to every order card in the admin panel.
- Order deletion requires explicit browser confirmation and uses an authenticated DELETE API endpoint.
- Deleting an order also removes its uploaded photo files when present.
- Added statistics-history cleanup by custom From/To dates with explicit confirmation.
- Statistics cleanup removes analytics data for the selected period but preserves orders in the admin panel; existing orders from that period are excluded from historical statistics.
- Invalid date ranges are rejected by the server.
