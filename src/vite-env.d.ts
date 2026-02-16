/// <reference types="vite/client" />

declare module 'firebase/auth';

declare namespace GeoJSON {
  interface Polygon {
    type: 'Polygon';
    coordinates: number[][][];
  }
  type Geometry = Polygon;
}
