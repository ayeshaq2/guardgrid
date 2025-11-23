// Approximate location based on lat/lon coordinates
export const approximateLocation = (lat: number, lon: number): string => {
  // California regions
  if (lat >= 32.5 && lat <= 42 && lon >= -124.5 && lon <= -114) {
    if (lat >= 37.7 && lat <= 38.9 && lon >= -123 && lon <= -121.5) return "San Francisco Bay Area, CA";
    if (lat >= 34 && lat <= 34.3 && lon >= -118.7 && lon <= -118) return "Los Angeles, CA";
    if (lat >= 32.5 && lat <= 33.5 && lon >= -117.5 && lon <= -116.8) return "San Diego, CA";
    if (lat >= 38 && lat <= 40 && lon >= -122 && lon <= -120) return "Northern California";
    if (lat >= 36 && lat <= 38 && lon >= -122 && lon <= -119) return "Central California";
    return "Southern California";
  }
  
  // Pacific Northwest
  if (lat >= 42 && lat <= 49 && lon >= -124.5 && lon <= -116.5) {
    if (lat >= 45.4 && lat <= 45.7 && lon >= -122.8 && lon <= -122.5) return "Portland, OR";
    if (lat >= 47.4 && lat <= 47.8 && lon >= -122.5 && lon <= -122) return "Seattle, WA";
    if (lat >= 45.5 && lat <= 49 && lon >= -124 && lon <= -121) return "Washington";
    return "Oregon";
  }
  
  // Southwest
  if (lat >= 31 && lat <= 37 && lon >= -114.5 && lon <= -103) {
    if (lat >= 35 && lat <= 36 && lon >= -106.7 && lon <= -106.5) return "Albuquerque, NM";
    if (lat >= 33.3 && lat <= 33.6 && lon >= -112.2 && lon <= -111.8) return "Phoenix, AZ";
    if (lat >= 31 && lat <= 37 && lon >= -114 && lon <= -109) return "Arizona";
    return "New Mexico";
  }
  
  // Mountain West
  if (lat >= 37 && lat <= 49 && lon >= -116.5 && lon <= -104) {
    if (lat >= 39.5 && lat <= 40 && lon >= -105.5 && lon <= -104.5) return "Denver, CO";
    if (lat >= 40 && lat <= 41.5 && lon >= -112.2 && lon <= -111.5) return "Salt Lake City, UT";
    if (lat >= 41 && lat <= 49 && lon >= -116.5 && lon <= -104) return "Montana/Idaho";
    if (lat >= 40.5 && lat <= 45 && lon >= -111 && lon <= -104.5) return "Wyoming";
    if (lat >= 37 && lat <= 41 && lon >= -114 && lon <=-109) return "Utah";
    return "Colorado";
  }
  
  // Texas
  if (lat >= 25.8 && lat <= 36.5 && lon >= -106.5 && lon <= -93.5) {
    if (lat >= 29.5 && lat <= 30 && lon >= -98 && lon <= -97) return "Austin, TX";
    if (lat >= 32.6 && lat <= 33 && lon >= -97 && lon <= -96.5) return "Dallas, TX";
    if (lat >= 29.6 && lat <= 30 && lon >= -95.7 && lon <= -95) return "Houston, TX";
    return "Texas";
  }
  
  // Canada
  if (lat >= 49 && lat <= 83 && lon >= -141 && lon <= -52) {
    if (lon >= -123 && lon <= -114) return "British Columbia";
    if (lon >= -120 && lon <= -110) return "Alberta";
    if (lon >= -110 && lon <= -101) return "Saskatchewan";
    if (lon >= -102 && lon <= -95) return "Manitoba";
    if (lon >= -95 && lon <= -74) return "Ontario";
    if (lon >= -79 && lon <= -57) return "Quebec";
    return "Canada";
  }
  
  // Mexico
  if (lat >= 14 && lat <= 32.5 && lon >= -117 && lon <= -86) {
    return "Mexico";
  }
  
  // Great Plains
  if (lat >= 36.5 && lat <= 49 && lon >= -104 && lon <= -94) {
    if (lat >= 41 && lat <= 43 && lon >= -104.5 && lon <= -96) return "Nebraska";
    if (lat >= 37 && lat <= 40 && lon >=-102 && lon <= -94.5) return "Kansas";
    return "Great Plains";
  }
  
  // Midwest/East
  if (lat >= 37 && lat <= 49 && lon >= -94 && lon <= -66) {
    if (lat >= 40.5 && lat <= 42 && lon >= -88 && lon <= -87.5) return "Chicago, IL";
    if (lat >= 42.2 && lat <= 42.5 && lon >=-83.3 && lon <= -82.9) return "Detroit, MI";
    if (lat >= 40.5 && lat <= 41 && lon >= -74.3 && lon <= -73.7) return "New York, NY";
    if (lat >= 39.7 && lat <= 40 && lon >= -75.3 && lon <= -74.9) return "Philadelphia, PA";
    if (lat >= 38.8 && lat <= 39 && lon >= -77.1 && lon <= -76.9) return "Washington, DC";
    return "Eastern US";
  }
  
  // Southeast
  if (lat >= 24 && lat <= 37 && lon >= -94 && lon <= -75) {
    if (lat >= 33.6 && lat <= 34 && lon >= -84.5 && lon <= -84.2) return "Atlanta, GA";
    if (lat >= 25.7 && lat <= 26 && lon >= -80.3 && lon <=-80) return "Miami, FL";
    if (lat >= 27 && lat <= 31 && lon >= -87 && lon <= -80) return "Florida";
    return "Southeastern US";
  }
  
  // Default fallback
  return `${lat >= 0 ? 'N' : 'S'}${Math.abs(lat).toFixed(1)}° ${lon >= 0 ? 'E' : 'W'}${Math.abs(lon).toFixed(1)}°`;
};
