export type FireSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FireStatus = 'active' | 'contained' | 'controlled' | 'monitored';
export type SensorType = 'satellite' | 'ground' | 'aerial' | 'weather_station';
export type ReportStatus = 'pending' | 'verified' | 'false_positive' | 'duplicate';

export interface FireIncident {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: FireSeverity;
  status: FireStatus;
  size_acres?: number;
  containment_percent?: number;
  personnel_count?: number;
  start_date: string;
  last_updated: string;
  description?: string;
}

export interface FireSensor {
  id: string;
  sensor_type: SensorType;
  name: string;
  latitude: number;
  longitude: number;
  detection_time: string;
  confidence_level?: number;
  temperature_celsius?: number;
  smoke_density?: number;
  is_active: boolean;
}

export interface FireReport {
  id: string;
  user_id?: string;
  latitude: number;
  longitude: number;
  description?: string;
  has_visible_smoke: boolean;
  has_visible_flames: boolean;
  has_smell: boolean;
  photo_urls?: string[];
  video_urls?: string[];
  report_status: ReportStatus;
  created_at: string;
}

export interface WildfirePoint {
  id: string;
  title: string;
  date: string;
  lat: number;
  lon: number;
}

export interface FirmsWildfirePoint {
  lat: number;
  lon: number;
  brightness: number;
  confidence: string;
  frp: number;
  date: string;
}
