import { describe, it, expect } from 'vitest';
import { getCredits, getCreditById } from './creditsApi';

// =============================================================================
// getCredits
// =============================================================================

describe('getCredits', () => {
  it('returns an array of credits', async () => {
    const credits = await getCredits();
    expect(Array.isArray(credits)).toBe(true);
    expect(credits.length).toBeGreaterThan(0);
  });

  it('returns a new array each call (defensive copy)', async () => {
    const a = await getCredits();
    const b = await getCredits();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('every credit has the required fields', async () => {
    const credits = await getCredits();
    const requiredKeys = [
      'id',
      'name',
      'watershed',
      'creditType',
      'pollutant',
      'quantityAvailable',
      'unit',
      'pricePerUnit',
      'totalValueUsd',
      'location',
      'sellerName',
      'sellerType',
      'verificationStatus',
      'vintageYear',
      'tags',
      'description',
      'methodology',
      'lat',
      'lng',
      'acreage',
      'boundary',
    ];

    for (const credit of credits) {
      for (const key of requiredKeys) {
        expect(credit).toHaveProperty(key);
      }
    }
  });

  it('every credit has a unique id', async () => {
    const credits = await getCredits();
    const ids = credits.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('numeric fields are valid numbers', async () => {
    const credits = await getCredits();
    for (const credit of credits) {
      expect(typeof credit.quantityAvailable).toBe('number');
      expect(credit.quantityAvailable).toBeGreaterThan(0);
      expect(typeof credit.pricePerUnit).toBe('number');
      expect(credit.pricePerUnit).toBeGreaterThan(0);
      expect(typeof credit.totalValueUsd).toBe('number');
      expect(credit.totalValueUsd).toBeGreaterThan(0);
      expect(typeof credit.vintageYear).toBe('number');
    }
  });

  it('tags is a non-empty array of strings', async () => {
    const credits = await getCredits();
    for (const credit of credits) {
      expect(Array.isArray(credit.tags)).toBe(true);
      expect(credit.tags.length).toBeGreaterThan(0);
      for (const tag of credit.tags) {
        expect(typeof tag).toBe('string');
      }
    }
  });
});

// =============================================================================
// getCreditById
// =============================================================================

describe('getCreditById', () => {
  it('returns the correct credit for a valid id', async () => {
    const credits = await getCredits();
    for (const credit of credits) {
      const result = await getCreditById(credit.id);
      expect(result).not.toBeNull();
      expect(result.id).toBe(credit.id);
      expect(result.name).toBe(credit.name);
    }
  });

  it('returns null for a non-existent id', async () => {
    const result = await getCreditById('does-not-exist');
    expect(result).toBeNull();
  });

  it('returns null for undefined', async () => {
    const result = await getCreditById(undefined);
    expect(result).toBeNull();
  });

  it('returns null for null', async () => {
    const result = await getCreditById(null);
    expect(result).toBeNull();
  });

  it('returns null for an empty string', async () => {
    const result = await getCreditById('');
    expect(result).toBeNull();
  });
});

// =============================================================================
// generateBoundaryFromAcreage (tested indirectly through credit data)
// =============================================================================

describe('boundary polygon generation', () => {
  it('every credit has a Polygon boundary with coordinates', async () => {
    const credits = await getCredits();
    for (const credit of credits) {
      expect(credit.boundary).toBeDefined();
      expect(credit.boundary.type).toBe('Polygon');
      expect(Array.isArray(credit.boundary.coordinates)).toBe(true);
      expect(credit.boundary.coordinates.length).toBe(1); // single ring
    }
  });

  it('each polygon ring has 5 points and is closed', async () => {
    const credits = await getCredits();
    for (const credit of credits) {
      const ring = credit.boundary.coordinates[0];
      expect(ring.length).toBe(5);
      // GeoJSON polygons must be closed: first point === last point
      expect(ring[0][0]).toBe(ring[ring.length - 1][0]); // same lng
      expect(ring[0][1]).toBe(ring[ring.length - 1][1]); // same lat
    }
  });

  it('polygon coordinates are near the credit lat/lng', async () => {
    const credits = await getCredits();
    for (const credit of credits) {
      const ring = credit.boundary.coordinates[0];
      for (const [lng, lat] of ring) {
        // Boundary points should be within ~0.1 degrees of center
        expect(Math.abs(lat - credit.lat)).toBeLessThan(0.1);
        expect(Math.abs(lng - credit.lng)).toBeLessThan(0.1);
      }
    }
  });

  it('larger acreage produces a larger bounding box', async () => {
    const credits = await getCredits();
    // Sort by acreage to compare a small vs large parcel
    const sorted = [...credits].sort((a, b) => a.acreage - b.acreage);
    const smallest = sorted[0];
    const largest = sorted[sorted.length - 1];

    const bbox = (credit) => {
      const ring = credit.boundary.coordinates[0];
      const lngs = ring.map(([lng]) => lng);
      const lats = ring.map(([, lat]) => lat);
      return {
        lngSpan: Math.max(...lngs) - Math.min(...lngs),
        latSpan: Math.max(...lats) - Math.min(...lats),
      };
    };

    const smallBbox = bbox(smallest);
    const largeBbox = bbox(largest);

    expect(largeBbox.lngSpan).toBeGreaterThan(smallBbox.lngSpan);
    expect(largeBbox.latSpan).toBeGreaterThan(smallBbox.latSpan);
  });

  it('all coordinate pairs are [lng, lat] arrays of length 2', async () => {
    const credits = await getCredits();
    for (const credit of credits) {
      const ring = credit.boundary.coordinates[0];
      for (const coord of ring) {
        expect(Array.isArray(coord)).toBe(true);
        expect(coord.length).toBe(2);
        expect(typeof coord[0]).toBe('number'); // lng
        expect(typeof coord[1]).toBe('number'); // lat
        expect(Number.isFinite(coord[0])).toBe(true);
        expect(Number.isFinite(coord[1])).toBe(true);
      }
    }
  });
});
