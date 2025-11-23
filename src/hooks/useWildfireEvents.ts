import { useQuery } from '@tanstack/react-query';
import { WildfirePoint } from '@/types/fire';

interface EONETGeometry {
  date: string;
  coordinates: [number, number]; // [lon, lat]
}

interface EONETEvent {
  id: string;
  title: string;
  geometry: EONETGeometry[];
}

interface EONETResponse {
  events: EONETEvent[];
}

const US_CA_BOUNDS = {
  minLat: 24,
  maxLat: 83,
  minLon: -168,
  maxLon: -52,
};

const isInUSCanada = (lat: number, lon: number): boolean => {
  return (
    lat >= US_CA_BOUNDS.minLat &&
    lat <= US_CA_BOUNDS.maxLat &&
    lon >= US_CA_BOUNDS.minLon &&
    lon <= US_CA_BOUNDS.maxLon
  );
};

export const useWildfireEvents = () => {
  return useQuery({
    queryKey: ['wildfire-events'],
    queryFn: async () => {
      const response = await fetch(
        'https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open&limit=100'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch wildfire data');
      }
      
      const data: EONETResponse = await response.json();
      
      const wildfires: WildfirePoint[] = [];
      
      data.events.forEach((event) => {
        event.geometry.forEach((geometry) => {
          const [lon, lat] = geometry.coordinates;
          
          if (isInUSCanada(lat, lon)) {
            wildfires.push({
              id: `${event.id}-${geometry.date}`,
              title: event.title,
              date: geometry.date,
              lat,
              lon,
            });
          }
        });
      });
      
      return wildfires;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};
