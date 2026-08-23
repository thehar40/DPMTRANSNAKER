// Helper untuk mengambil koordinat (lat/lon) dari URL Google Maps.
// Mendukung: /@lat,lng, ?q=lat,lng, ?ll=lat,lng, pb !3d!4d, dan link pendek
// maps.app.goo.gl di-resolve lewat redirect server-side.

const COORDINATE_PATTERNS: RegExp[] = [
  /@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
  /[?&](?:q|ll|center)=(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
  /!3d(-?\d{1,3}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/,
  /[?&]3d=(-?\d{1,3}(?:\.\d+)?)[&!]?4d=(-?\d{1,3}(?:\.\d+)?)/,
];

export interface MapCoordinates {
  lat: number;
  lon: number;
}

function parseCoordinatePatterns(
  value: string
): MapCoordinates | null {
  for (const pattern of COORDINATE_PATTERNS) {
    const match = value.match(pattern);
    if (!match) continue;
    const lat = Number(match[1]);
    const lon = Number(match[2]);
    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      return { lat, lon };
    }
  }
  return null;
}

export async function getMapCoordinates(
  mapUrl: string | null | undefined
): Promise<MapCoordinates | null> {
  if (!mapUrl || !/^https?:\/\//i.test(mapUrl.trim())) return null;
  const url = mapUrl.trim();

  const direct = parseCoordinatePatterns(decodeURIComponent(url));
  if (direct) return direct;

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; dpmtransnaker-website/1.0)" },
    });
    const finalUrl = decodeURIComponent(response.url || "");
    return parseCoordinatePatterns(finalUrl);
  } catch {
    return null;
  }
}
