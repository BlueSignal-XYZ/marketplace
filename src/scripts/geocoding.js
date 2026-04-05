/**
 * Function to get coordinates of an address using Google Geocoding API
 * @param {string} address - The address to be geocoded
 * @param {string} apiKey - Your Google Maps API key
 * @return {Promise} - Returns a promise that resolves to coordinates object { lat, lng }
 */
export default async function getCoordinates(address, apiKey) {
  // Construct the URL with the address and API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  // Fetch the data from Google's API
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'OK' && data.results?.length > 0) {
        // Extract latitude and longitude
        const coordinates = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
        return coordinates;
      } else {
        // Handle error
        throw new Error('Unable to retrieve coordinates');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
