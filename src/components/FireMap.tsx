import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FireIncident, FireSensor, FireReport, WildfirePoint, FirmsWildfirePoint } from '@/types/fire';

interface FireMapProps {
  incidents: FireIncident[];
  sensors: FireSensor[];
  reports: FireReport[];
  wildfires: WildfirePoint[];
  firmsDetections: FirmsWildfirePoint[];
  onIncidentSelect: (incident: FireIncident) => void;
  selectedIncident: FireIncident | null;
  isLoadingWildfires?: boolean;
  isLoadingFirms?: boolean;
}

const FireMap = ({ incidents, sensors, reports, wildfires, firmsDetections, onIncidentSelect, selectedIncident, isLoadingWildfires, isLoadingFirms }: FireMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.CircleMarker[]>([]);
  const [hasSetWildfireBounds, setHasSetWildfireBounds] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ff5722';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#fbbf24';
      default:
        return '#ff5722';
    }
  };

  const getSeverityRadius = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 15;
      case 'high':
        return 12;
      case 'medium':
        return 10;
      case 'low':
        return 8;
      default:
        return 12;
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      zoomControl: true,
    }).setView([40, -120], 5);

    // Add dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add incident markers (large pulsing circles - official/sensor data)
    incidents.forEach((incident) => {
      const color = getSeverityColor(incident.severity);
      const radius = getSeverityRadius(incident.severity);
      const isSelected = selectedIncident?.id === incident.id;

      const marker = L.circleMarker([incident.latitude, incident.longitude], {
        radius: isSelected ? radius * 1.5 : radius,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'fire-pulse',
      });

      marker.addTo(map.current!);

      marker.bindPopup(`
        <div style="color: #000; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%;"></div>
            <strong style="font-size: 14px;">${incident.name}</strong>
          </div>
          <div style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="font-weight: 600;">📍 Location:</span> ${incident.location}
            </div>
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="font-weight: 600;">📏 Size:</span> ${incident.size_acres?.toLocaleString() || 'N/A'} acres
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-weight: 600;">🚒 Containment:</span> ${incident.containment_percent || 0}%
            </div>
          </div>
          <div style="margin-top: 6px; padding: 4px 8px; background: #3b82f6; color: white; border-radius: 4px; text-align: center; font-size: 11px; font-weight: 600;">
            🛰️ SATELLITE VERIFIED
          </div>
        </div>
      `, { maxWidth: 300 });

      marker.on('click', () => {
        onIncidentSelect(incident);
      });

      marker.on('mouseover', function() {
        this.setStyle({
          radius: radius * 1.3,
          fillOpacity: 1,
        });
      });

      marker.on('mouseout', function() {
        if (selectedIncident?.id !== incident.id) {
          this.setStyle({
            radius: radius,
            fillOpacity: 0.8,
          });
        }
      });

      markers.current.push(marker);
    });

    // Add sensor markers (blue triangles with glow)
    sensors.forEach((sensor) => {
      const icon = L.divIcon({
        html: `
          <div style="position: relative; filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.8));">
            <div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 16px solid #3b82f6;"></div>
          </div>
        `,
        className: '',
        iconSize: [20, 16],
      });

      const marker = L.marker([sensor.latitude, sensor.longitude], { icon });
      marker.addTo(map.current!);

      marker.bindPopup(`
        <div style="color: #000; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 10px solid #3b82f6;"></div>
            <strong style="font-size: 14px;">Sensor: ${sensor.name}</strong>
          </div>
          <div style="background: #eff6ff; padding: 8px; border-radius: 4px; font-size: 12px;">
            <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Type:</span> ${sensor.sensor_type.toUpperCase()}</div>
            <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Confidence:</span> ${sensor.confidence_level?.toFixed(1) || 'N/A'}%</div>
            <div><span style="font-weight: 600;">Temperature:</span> ${sensor.temperature_celsius?.toFixed(0) || 'N/A'}°C</div>
          </div>
        </div>
      `);
    });

    // Add report markers with verification status
    reports.forEach((report) => {
      const isVerified = report.report_status === 'verified';
      const isPending = report.report_status === 'pending';
      const isFalsePositive = report.report_status === 'false_positive';
      
      let markerColor = '#fbbf24'; // pending yellow
      let statusBadge = '⏳ PENDING VERIFICATION';
      let statusBg = '#fef3c7';
      
      if (isVerified) {
        markerColor = '#10b981'; // verified green
        statusBadge = '✅ VERIFIED';
        statusBg = '#d1fae5';
      } else if (isFalsePositive) {
        markerColor = '#ef4444'; // false positive red
        statusBadge = '❌ FALSE POSITIVE';
        statusBg = '#fee2e2';
      }

      const icon = L.divIcon({
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 16 16" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); ${isPending ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;' : ''}">
              <circle cx="8" cy="4" r="3" fill="${markerColor}" stroke="white" stroke-width="1.5"/>
              <path d="M8 8 C5 8, 3 9, 3 12 L3 15 L13 15 L13 12 C13 9, 11 8, 8 8 Z" fill="${markerColor}" stroke="white" stroke-width="1.5"/>
            </svg>
            ${isPending ? `
              <div style="
                position: absolute;
                top: -6px;
                right: -6px;
                width: 10px;
                height: 10px;
                background: #ef4444;
                border: 2px solid white;
                border-radius: 50%;
                animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ''}
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .7; }
            }
            @keyframes ping {
              75%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
          </style>
        `,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 16],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon });
      marker.addTo(map.current!);

      marker.bindPopup(`
        <div style="color: #000; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: ${markerColor}; border-radius: 50%;"></div>
            <strong style="font-size: 14px;">User Report</strong>
          </div>
          <div style="background: ${statusBg}; padding: 6px 10px; border-radius: 4px; text-align: center; font-size: 11px; font-weight: 700; margin-bottom: 8px;">
            ${statusBadge}
          </div>
          ${report.description ? `<div style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px;">${report.description}</div>` : ''}
          <div style="font-size: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${report.has_visible_smoke ? '<span style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">🔥 Smoke</span>' : ''}
            ${report.has_visible_flames ? '<span style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">🔥 Flames</span>' : ''}
            ${report.has_smell ? '<span style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">💨 Smell</span>' : ''}
          </div>
          <div style="margin-top: 8px; font-size: 11px; color: #6b7280;">
            📅 ${new Date(report.created_at).toLocaleString()}
          </div>
        </div>
      `, { maxWidth: 300 });
    });

    // Add NASA EONET wildfire markers (always on top, bright red/orange)
    wildfires.forEach((wildfire) => {
      const marker = L.circleMarker([wildfire.lat, wildfire.lon], {
        radius: 6,
        fillColor: '#d94e3d',
        color: '#e88a70',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.7,
        className: 'wildfire-marker',
      });

      marker.addTo(map.current!);

      marker.bindPopup(`
        <div style="color: #000; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: #ff4500; border-radius: 50%; box-shadow: 0 0 8px rgba(255, 69, 0, 0.6);"></div>
            <strong style="font-size: 14px;">${wildfire.title}</strong>
          </div>
          <div style="background: #fff5f5; padding: 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px;">
            <div style="margin-bottom: 4px;"><span style="font-weight: 600;">📅 Date:</span> ${new Date(wildfire.date).toLocaleString()}</div>
            <div style="margin-bottom: 4px;"><span style="font-weight: 600;">📍 Lat/Lon:</span> ${wildfire.lat.toFixed(2)}, ${wildfire.lon.toFixed(2)}</div>
          </div>
          <div style="font-size: 10px; color: #6b7280; text-align: center; padding: 4px;">
            Source: NASA EONET
          </div>
        </div>
      `, { maxWidth: 300 });

      marker.on('mouseover', function() {
        this.setStyle({
          radius: 8,
          fillOpacity: 1,
        });
      });

      marker.on('mouseout', function() {
        this.setStyle({
          radius: 6,
          fillOpacity: 0.9,
        });
      });
    });

    // Add NASA FIRMS wildfire detection markers (real-time heat anomalies)
    firmsDetections.forEach((detection) => {
      const marker = L.circleMarker([detection.lat, detection.lon], {
        radius: 6,
        fillColor: '#d94e3d',
        color: '#e88a70',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.7,
        className: 'wildfire-marker',
      });

      marker.addTo(map.current!);

      marker.bindPopup(`
        <div style="color: #000; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: #ff4500; border-radius: 50%; box-shadow: 0 0 8px rgba(255, 69, 0, 0.6);"></div>
            <strong style="font-size: 14px;">🔥 Fire Detection</strong>
          </div>
          <div style="background: #fff5f0; padding: 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px;">
            <div style="margin-bottom: 4px;"><span style="font-weight: 600;">🌡️ Brightness:</span> ${detection.brightness.toFixed(1)}K</div>
            <div style="margin-bottom: 4px;"><span style="font-weight: 600;">✅ Confidence:</span> ${detection.confidence}</div>
            <div style="margin-bottom: 4px;"><span style="font-weight: 600;">🔥 FRP:</span> ${detection.frp.toFixed(1)} MW</div>
            <div><span style="font-weight: 600;">📅 Detected:</span> ${detection.date}</div>
          </div>
          <div style="font-size: 10px; color: #6b7280; text-align: center; padding: 4px;">
            Source: NASA FIRMS VIIRS NRT
          </div>
        </div>
      `, { maxWidth: 300 });

      marker.on('mouseover', function() {
        this.setStyle({
          radius: 8,
          fillOpacity: 1,
        });
      });

      marker.on('mouseout', function() {
        this.setStyle({
          radius: 6,
          fillOpacity: 0.9,
        });
      });
    });
  }, [incidents, sensors, reports, wildfires, firmsDetections, selectedIncident, onIncidentSelect]);

  // Fit bounds to US/Canada wildfires on first load
  useEffect(() => {
    if (!map.current || hasSetWildfireBounds || wildfires.length === 0 || isLoadingWildfires) return;

    const bounds = L.latLngBounds(wildfires.map(w => [w.lat, w.lon]));
    map.current.fitBounds(bounds, { padding: [50, 50] });
    setHasSetWildfireBounds(true);
  }, [wildfires, hasSetWildfireBounds, isLoadingWildfires]);

  useEffect(() => {
    if (selectedIncident && map.current) {
      map.current.flyTo(
        [selectedIncident.latitude, selectedIncident.longitude],
        9,
        {
          duration: 1.5,
        }
      );
    }
  }, [selectedIncident]);

  useEffect(() => {
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {(isLoadingWildfires || isLoadingFirms) && (
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-lg z-[1000]">
          <div className="flex flex-col gap-2">
            {isLoadingWildfires && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading wildfires...</span>
              </div>
            )}
            {isLoadingFirms && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading wildfire data...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FireMap;
