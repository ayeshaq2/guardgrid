import { FireIncident, FirmsWildfirePoint } from '@/types/fire';
import FireIncidentCard from './FireIncidentCard';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Flame, MapPin } from 'lucide-react';
import { approximateLocation } from '@/utils/approximateLocation';

interface FireSidebarProps {
  incidents: FireIncident[];
  firmsDetections: FirmsWildfirePoint[];
  selectedIncident: FireIncident | null;
  onIncidentSelect: (incident: FireIncident) => void;
}

const FireSidebar = ({ incidents, firmsDetections, selectedIncident, onIncidentSelect }: FireSidebarProps) => {
  const containedIncidents = incidents.filter(i => i.status !== 'active');

  const getSeverity = () => {
    const levels = [
      { level: 'critical', colorClass: 'bg-fire-critical' },
      { level: 'high', colorClass: 'bg-fire-high' },
      { level: 'medium', colorClass: 'bg-fire-medium' },
      { level: 'low', colorClass: 'bg-fire-low' },
    ];
    const randomIndex = Math.floor(Math.random() * levels.length);
    return levels[randomIndex];
  };

  return (
    <div className="w-96 border-r border-border bg-background/98 backdrop-blur-md flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-border bg-gradient-to-br from-fire-critical/5 via-fire-high/5 to-fire-medium/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-fire-critical/5 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3 mb-5 relative">
          <div className="p-2.5 bg-gradient-to-br from-fire-critical/20 to-fire-high/20 rounded-xl shadow-lg border border-fire-critical/30">
            <Flame className="h-6 w-6 text-fire-critical drop-shadow-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-fire-critical via-fire-high to-fire-medium bg-clip-text text-transparent">
              GuardGrid
            </h1>
            <p className="text-xs text-muted-foreground font-medium">Real-time Wildfire Monitoring</p>
          </div>
        </div>
        <div className="flex gap-3 relative">
          <Badge variant="destructive" className="flex-1 justify-center gap-2 py-2.5 animate-pulse shadow-md hover:shadow-lg transition-shadow">
            <span className="w-2 h-2 bg-white rounded-full shadow-glow"></span>
            <span className="font-bold">{firmsDetections.length}</span>
            <span className="font-normal opacity-90">Active</span>
          </Badge>
          <Badge variant="secondary" className="flex-1 justify-center gap-2 py-2.5 shadow-sm hover:shadow-md transition-shadow">
            <span className="font-bold">{containedIncidents.length}</span>
            <span className="font-normal opacity-90">Contained</span>
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {firmsDetections.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-3 mt-1">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-fire-critical/40 to-transparent"></div>
                <h2 className="text-xs font-bold text-fire-critical uppercase tracking-widest flex items-center gap-2">
                  <Flame className="h-3 w-3 animate-pulse" />
                  Active Detections
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-fire-critical/40 to-transparent"></div>
              </div>
              {firmsDetections.slice(0, 50).map((detection, index) => {
                const severity = getSeverity();
                
                return (
                <Card 
                  key={index} 
                  className="p-4 hover:bg-accent/70 hover:shadow-md hover:border-fire-critical/40 transition-all duration-200 cursor-pointer border border-fire-critical/20 bg-gradient-to-br from-background to-fire-critical/5 group relative"
                >
                  <Badge className={`${severity.colorClass} text-white capitalize text-[10px] font-bold uppercase px-2 absolute top-3 right-3`}>
                    {severity.level}
                  </Badge>
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 bg-fire-critical rounded-full mt-1.5 animate-pulse shadow-glow"></div>
                      <div className="absolute inset-0 w-2.5 h-2.5 bg-fire-critical rounded-full animate-ping opacity-40"></div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2 pr-16">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-fire-critical group-hover:text-fire-critical/90 transition-colors">
                          Fire Detection
                        </span>
                        <Badge variant="outline" className="text-[10px] border-fire-critical/30 text-fire-critical font-semibold uppercase">
                          {detection.confidence}
                        </Badge>
                      </div>
                      <div className="text-xs space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="font-semibold text-foreground leading-tight">
                            {approximateLocation(detection.lat, detection.lon)}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono pl-5">
                          {detection.lat.toFixed(4)}°, {detection.lon.toFixed(4)}°
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-border/30">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-medium block">Brightness</span>
                            <span className="font-bold text-fire-high">{detection.brightness.toFixed(1)}K</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground font-medium block">FRP</span>
                            <span className="font-bold text-foreground">{detection.frp.toFixed(1)} MW</span>
                          </div>
                        </div>
                        <div className="text-[10px] opacity-60 pt-1">{detection.date}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
              })}
              {firmsDetections.length > 50 && (
                <div className="text-xs text-center text-muted-foreground py-3 font-medium bg-accent/30 rounded-md">
                  Showing 50 of {firmsDetections.length} detections
                </div>
              )}
            </>
          )}
          
          {containedIncidents.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-3 mt-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contained Fires</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
              </div>
              {containedIncidents.map((incident) => (
                <FireIncidentCard
                  key={incident.id}
                  incident={incident}
                  onClick={() => onIncidentSelect(incident)}
                  isSelected={selectedIncident?.id === incident.id}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FireSidebar;
