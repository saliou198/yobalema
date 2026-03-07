const GEOAPIFY_BASE = 'https://api.geoapify.com/v1/geocode/autocomplete';

const geocodePlace = async (text) => {
  if (!text) return null;

  const url = new URL(GEOAPIFY_BASE);
  url.searchParams.set('text', text);
  url.searchParams.set('apiKey', process.env.GEOAPIFY_API_KEY);
  url.searchParams.set('limit', '1');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Geoapify request failed');
  }

  const data = await response.json();
  const feature = data?.features?.[0];

  if (!feature) return null;

  return {
    formatted: feature.properties.formatted,
    lat: feature.properties.lat,
    lng: feature.properties.lon,
  };
};

module.exports = { geocodePlace };
