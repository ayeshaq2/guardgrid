import { FireIncident } from '@/types/fire';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Users, Calendar } from 'lucide-react';

interface FireIncidentCardProps {
  incident: FireIncident;
  onClick: () => void;
  isSelected: boolean;
}

const FireIncidentCard = ({ incident, onClick, isSelected }: FireIncidentCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-fire-critical';
      case 'high':
        return 'bg-fire-high';
      case 'medium':
        return 'bg-fire-medium';
      case 'low':
        return 'bg-fire-low';
      default:
        return 'bg-fire-high';
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 group ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg shadow-primary/20 border-primary bg-gradient-to-br from-primary/5 to-primary/10' 
          : 'border-border hover:border-primary/50 hover:bg-accent/30'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
            <div className={`p-1.5 rounded-lg ${getSeverityColor(incident.severity)}/20 border border-${getSeverityColor(incident.severity).replace('bg-', '')}/30 shadow-sm`}>
              <Flame className={`h-4 w-4 ${getSeverityColor(incident.severity).replace('bg-', 'text-')} group-hover:scale-110 transition-transform`} />
            </div>
            {incident.name}
          </CardTitle>
          <Badge className={`${getSeverityColor(incident.severity)} text-white capitalize shadow-md font-bold uppercase text-[10px] px-2.5`}>
            {incident.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground font-medium">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
          <span className="truncate">{incident.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-medium">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
          <span>{new Date(incident.start_date).toLocaleDateString()}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
          <div className="text-center p-2.5 rounded-lg bg-gradient-to-br from-accent/50 to-accent/30 border border-border/30 hover:shadow-sm transition-shadow">
            <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase tracking-wide">Size</p>
            <p className="font-bold text-sm text-foreground">{incident.size_acres?.toLocaleString() || 'N/A'}</p>
            <p className="text-[10px] text-muted-foreground font-medium">acres</p>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-gradient-to-br from-accent/50 to-accent/30 border border-border/30 hover:shadow-sm transition-shadow">
            <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase tracking-wide">Contained</p>
            <p className="font-bold text-sm text-foreground">{incident.containment_percent || 0}%</p>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-gradient-to-br from-accent/50 to-accent/30 border border-border/30 hover:shadow-sm transition-shadow">
            <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase tracking-wide">Crew</p>
            <p className="font-bold text-sm flex items-center justify-center gap-1 text-foreground">
              <Users className="h-3 w-3" />
              {incident.personnel_count || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FireIncidentCard;
