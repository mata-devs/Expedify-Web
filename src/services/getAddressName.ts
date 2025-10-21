export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

/**
 * Fetch address name from Mapbox given latitude & longitude.
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns A formatted address string (or a fallback message)
 */
export async function getAddressName(lat: number, lon: number): Promise<string> {
  try {
    if (!lat || !lon) return "Unknown location";

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`
    );

    if (!response.ok) throw new Error("Failed to fetch address");

    const data = await response.json();

    const placeName = data.features?.[0]?.place_name || "Address not found";
    return placeName;
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Address unavailable";
  }
}
