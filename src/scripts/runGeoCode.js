import getCoordinates from './geocoding.js';
import { GoogleMaps_API_KEY } from '../contracts/ref.js';
import jsonData from '../data/localization.json' with { type: 'json' };
import fs from 'fs/promises';

async function convertAddressesToCoordinates() {
  // Iterate through each object in the Database array
  const updatedData = await Promise.all(
    jsonData.Database.map(async (company) => {
      try {
        // Create the address string by concatenating the required fields
        const address = `${company.Address}, ${company.City}, ${company.States}, ${company['Zip Code']}`;

        // Call the getCoordinates function to fetch the coordinates
        const { lat, lng } = await getCoordinates(address, GoogleMaps_API_KEY);

        // Add the geometry object to the company object
        company.geometry = {
          coordinates: [lng, lat],
          type: 'Point',
        };
      } catch (error) {
        // Log the error but don't stop processing other items
        console.error(`Error processing ${company.CompanyName}: ${error}`);
      }
      return company;
    })
  );

  return { Database: updatedData };
}

convertAddressesToCoordinates()
  .then((result) => {
    // Convert the result to a JSON string with proper formatting
    const jsonStr = JSON.stringify(result, null, 2);

    // Define the file path where the new JSON file will be created
    const filePath = './coordinatesDatabase.json';

    // Write the JSON string to the file
    return fs.writeFile(filePath, jsonStr, 'utf-8');
  })
  .then(() => {})
  .catch((error) => {
    console.error(`Failed to create new JSON file: ${error}`);
  });
