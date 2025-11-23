interface FireLocation {
  city?: string;
  state?: string;
  country?: string;
}

interface WildfireEvent {
  title?: string;
  location?: string;
}

interface FirmsDetection {
  lat: number;
  lon: number;
}

// Parse location from wildfire event title (e.g., "Fire in San Francisco, California")
const parseLocationFromTitle = (title: string): FireLocation | null => {
  if (!title) return null;
  
  // Common patterns: "City, State" or "City, State, Country"
  const locationMatch = title.match(/(?:in|near|at)\s+([^,]+)(?:,\s*([^,]+))?(?:,\s*([^,]+))?/i);
  
  if (locationMatch) {
    return {
      city: locationMatch[1]?.trim(),
      state: locationMatch[2]?.trim(),
      country: locationMatch[3]?.trim() || 'USA',
    };
  }
  
  // Try to extract just the last part after comma as state
  const parts = title.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    return {
      city: parts[parts.length - 2],
      state: parts[parts.length - 1],
      country: 'USA',
    };
  }
  
  return null;
};

// Reverse geocode coordinates to approximate location (simplified)
const approximateLocation = (lat: number, lon: number): FireLocation => {
  // North America region detection
  if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) {
    return { country: 'USA' };
  } else if (lat >= 42 && lat <= 83 && lon >= -141 && lon <= -52) {
    return { country: 'Canada' };
  } else if (lat >= 14 && lat <= 33 && lon >= -117 && lon <= -86) {
    return { country: 'Mexico' };
  }
  
  return { country: 'North America' };
};

export const extractFireLocations = (
  wildfires: WildfireEvent[] = [],
  firmsDetections: FirmsDetection[] = []
): FireLocation[] => {
  const locations: FireLocation[] = [];
  
  // Extract from wildfire events
  wildfires.forEach(wildfire => {
    if (wildfire.title) {
      const location = parseLocationFromTitle(wildfire.title);
      if (location) {
        locations.push(location);
      }
    } else if (wildfire.location) {
      const location = parseLocationFromTitle(wildfire.location);
      if (location) {
        locations.push(location);
      }
    }
  });
  
  // Sample some FIRMS detections to get regional coverage
  const sampledDetections = firmsDetections
    .filter((_, index) => index % Math.ceil(firmsDetections.length / 10) === 0)
    .slice(0, 10);
  
  sampledDetections.forEach(detection => {
    const location = approximateLocation(detection.lat, detection.lon);
    locations.push(location);
  });
  
  // Deduplicate locations
  const uniqueLocations = locations.filter((loc, index, self) => {
    return index === self.findIndex(l => 
      l.city === loc.city && 
      l.state === loc.state && 
      l.country === loc.country
    );
  });
  
  return uniqueLocations.slice(0, 10); // Return top 10 unique locations
};
