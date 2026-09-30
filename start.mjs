const originalFetch = globalThis.fetch.bind(globalThis);

// The bundled application was built against Google endpoints. This adapter keeps
// its public API unchanged while using free OpenStreetMap services that require
// no API key: Photon for address search and OSRM for driving routes.
const places = new Map();
const MAX_PLACES = 1000;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function unique(values) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

function formatPhotonAddress(properties) {
  const street = clean(properties.street);
  const houseNumber = clean(properties.housenumber);
  const name = clean(properties.name);
  const streetLine = [street, houseNumber].filter(Boolean).join(" ");
  const locality = clean(properties.city || properties.town || properties.village || properties.locality);
  const postcode = clean(properties.postcode);
  const localityLine = [postcode, locality].filter(Boolean).join(" ");
  const firstLine = name && name !== street && name !== streetLine ? name : streetLine || name;
  return unique([firstLine, streetLine !== firstLine ? streetLine : "", localityLine, clean(properties.country)]).join(", ");
}

function secondaryPhotonAddress(properties) {
  const locality = clean(properties.city || properties.town || properties.village || properties.locality);
  return unique([clean(properties.postcode), locality, clean(properties.district), clean(properties.country)]).join(", ");
}

function rememberPlace(feature) {
  const [longitude, latitude] = feature.geometry?.coordinates || [];
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;

  const properties = feature.properties || {};
  const formatted = formatPhotonAddress(properties);
  if (!formatted) return null;

  const osmType = clean(properties.osm_type || "place");
  const osmId = String(properties.osm_id || `${longitude}:${latitude}`);
  const id = `osm-${osmType}-${osmId}-${longitude.toFixed(6)}-${latitude.toFixed(6)}`;
  places.set(id, { id, formatted, latitude, longitude });

  if (places.size > MAX_PLACES) {
    const firstKey = places.keys().next().value;
    places.delete(firstKey);
  }

  return {
    placeId: id,
    text: { text: formatted },
    structuredFormat: {
      mainText: { text: clean(properties.name) || clean(properties.street) || formatted },
      secondaryText: { text: secondaryPhotonAddress(properties) },
    },
  };
}

async function photonAutocomplete(init) {
  let body = {};
  try {
    body = JSON.parse(String(init?.body || "{}"));
  } catch {
    return jsonResponse({ suggestions: [] });
  }

  const query = clean(body.input);
  if (query.length < 3) return jsonResponse({ suggestions: [] });

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "10");
  url.searchParams.set("lat", "52.2297");
  url.searchParams.set("lon", "21.0122");
  url.searchParams.set("bbox", "14.07,49.00,24.15,54.84");

  const response = await originalFetch(url, {
    headers: { Accept: "application/json", "User-Agent": "PereizdyWarszawa/1.0" },
    signal: init?.signal,
  });
  if (!response.ok) return jsonResponse({ error: "Photon unavailable" }, 502);

  const payload = await response.json();
  const predictions = (payload.features || [])
    .filter((feature) => String(feature.properties?.countrycode || "").toUpperCase() === "PL")
    .map(rememberPlace)
    .filter(Boolean)
    .slice(0, 5);

  return jsonResponse({ suggestions: predictions.map((placePrediction) => ({ placePrediction })) });
}

function photonDetails(url) {
  const encodedId = url.pathname.split("/places/")[1] || "";
  const id = decodeURIComponent(encodedId);
  const place = places.get(id);
  if (!place) return jsonResponse({ error: "Place expired" }, 404);

  return jsonResponse({
    id,
    formattedAddress: place.formatted,
    displayName: { text: place.formatted },
    location: { latitude: place.latitude, longitude: place.longitude },
  });
}

async function osrmRoute(init) {
  let body;
  try {
    body = JSON.parse(String(init?.body || "{}"));
  } catch {
    return jsonResponse({ routes: [] });
  }

  const origin = body.origin?.location?.latLng;
  const destination = body.destination?.location?.latLng;
  const coordinates = [origin?.longitude, origin?.latitude, destination?.longitude, destination?.latitude];
  if (!coordinates.every(Number.isFinite)) return jsonResponse({ routes: [] }, 400);

  const path = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const endpoints = [
    `https://router.project-osrm.org/route/v1/driving/${path}`,
    `https://routing.openstreetmap.de/routed-car/route/v1/driving/${path}`,
  ];

  let lastStatus = 502;
  for (const endpoint of endpoints) {
    const url = new URL(endpoint);
    url.searchParams.set("overview", "full");
    url.searchParams.set("geometries", "polyline");
    url.searchParams.set("steps", "false");

    try {
      const response = await originalFetch(url, {
        headers: { Accept: "application/json", "User-Agent": "PereizdyWarszawa/1.0" },
        signal: init?.signal,
      });
      lastStatus = response.status;
      if (!response.ok) continue;
      const payload = await response.json();
      const route = payload.routes?.[0];
      if (!route?.geometry) continue;

      return jsonResponse({
        routes: [{
          distanceMeters: Math.round(route.distance),
          duration: `${Math.round(route.duration)}s`,
          polyline: { encodedPolyline: route.geometry },
        }],
      });
    } catch (error) {
      if (error?.name === "AbortError" || error?.name === "TimeoutError") throw error;
    }
  }

  return jsonResponse({ routes: [] }, lastStatus || 502);
}

globalThis.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url || String(input));

  if (url.href === "https://places.googleapis.com/v1/places:autocomplete") {
    return photonAutocomplete(init);
  }
  if (url.origin === "https://places.googleapis.com" && url.pathname.startsWith("/v1/places/")) {
    return photonDetails(url);
  }
  if (url.href === "https://routes.googleapis.com/directions/v2:computeRoutes") {
    return osrmRoute(init);
  }

  return originalFetch(input, init);
};

// A non-secret marker enables the already-built address and route handlers.
process.env.GOOGLE_MAPS_API_KEY = "free-openstreetmap-adapter";

if (process.env.NODE_ENV !== "test") {
  await import("./server.mjs");
}
