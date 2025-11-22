import { useQuery } from '@tanstack/react-query';
import { FirmsWildfirePoint } from '@/types/fire';

const MAP_KEY = import.meta.env.MAP_KEY; 

const US_CA_BOUNDS = {
  minLat: 24,   // Bottom of Florida
  maxLat: 83,   // Northernmost Canada/Arctic
  minLon: -168, // Alaska far west
  maxLon: -52,  // Newfoundland / Labrador east
};

const isInUSCanada = (lat: number, lon: number): boolean => {
  // Normalize longitude: some datasets use 0–360 instead of -180–180
  const normalizedLon = lon > 180 ? lon - 360 : lon;

  return (
    lat >= US_CA_BOUNDS.minLat &&
    lat <= US_CA_BOUNDS.maxLat &&
    normalizedLon >= US_CA_BOUNDS.minLon &&
    normalizedLon <= US_CA_BOUNDS.maxLon
  );
};

export const useFirmsWildfires = () => {
  return useQuery({
    queryKey: ['firms-wildfires'],
    queryFn: async () => {
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${MAP_KEY}/VIIRS_NOAA20_NRT/world/3`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch FIRMS wildfire data');
      }

      const csvText = await response.text();
      const lines = csvText.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        return [];
      }

      // Skip header row
      const dataLines = lines.slice(1);

      const detections: FirmsWildfirePoint[] = [];

      dataLines.forEach((line) => {
        const parts = line.split(',');
        if (parts.length < 2) return;

        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        const brightness = parseFloat(parts[2] || '0');
        const confidence = parts[9] ?? ''; // Column 9 is confidence (low/nominal/high)
        const frp = parseFloat(parts[11] || '0');
        const date = parts[5] ?? '';

        if (Number.isNaN(lat) || Number.isNaN(lon)) return;
        if (brightness <= 335.0) return; // Only show high-brightness detections

        if (isInUSCanada(lat, lon)) {
          const normalizedLon = lon > 180 ? lon - 360 : lon;

          detections.push({
            lat,
            lon: normalizedLon,
            brightness,
            confidence,
            frp,
            date,
          });
        }
      });

      // If US/CA filter yields nothing, fall back to returning all detections
      if (detections.length === 0) {
        console.warn('[FIRMS] No US/Canada detections found, falling back to all points');
        const allDetections: FirmsWildfirePoint[] = [];

        dataLines.forEach((line) => {
          const parts = line.split(',');
          if (parts.length < 2) return;

          const lat = parseFloat(parts[0]);
          const lon = parseFloat(parts[1]);
          const brightness = parseFloat(parts[2] || '0');
          const confidence = parts[9] ?? ''; // Column 9 is confidence (low/nominal/high)
          const frp = parseFloat(parts[11] || '0');
          const date = parts[5] ?? '';

          if (Number.isNaN(lat) || Number.isNaN(lon)) return;
          if (brightness <= 335.0) return; // Only show high-brightness detections

          const normalizedLon = lon > 180 ? lon - 360 : lon;

          allDetections.push({
            lat,
            lon: normalizedLon,
            brightness,
            confidence,
            frp,
            date,
          });
        });

        return allDetections;
      }

      return detections;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};

