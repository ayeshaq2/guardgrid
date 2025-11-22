import { useState, useEffect } from 'react';
import FireMap from '@/components/FireMap';
import FireSidebar from '@/components/FireSidebar';
import { FireLegend } from '@/components/FireLegend';
import { ReportFireDialog } from '@/components/ReportFireDialog';
import { useFireIncidents, useFireSensors, useFireReports } from '@/hooks/useFireData';
import { useWildfireEvents } from '@/hooks/useWildfireEvents';
import { useFirmsWildfires } from '@/hooks/useFirmsWildfires';
import { FireIncident } from '@/types/fire';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedIncident, setSelectedIncident] = useState<FireIncident | null>(null);
  const { data: incidents = [] } = useFireIncidents();
  const { data: sensors = [] } = useFireSensors();
  const { data: reports = [] } = useFireReports();
  const { data: wildfires = [], isLoading: isLoadingWildfires, error: wildfiresError } = useWildfireEvents();
  const { data: firmsDetections = [], isLoading: isLoadingFirms, error: firmsError } = useFirmsWildfires();
  const { toast } = useToast();

  // Show error toast if wildfire fetch fails
  useEffect(() => {
    if (wildfiresError) {
      toast({
        title: "Wildfire Data Unavailable",
        description: "Unable to load NASA wildfire data. Map will continue with local data.",
        variant: "destructive",
      });
    }
  }, [wildfiresError, toast]);

  // Show error toast if FIRMS fetch fails
  useEffect(() => {
    if (firmsError) {
      toast({
        title: "FIRMS Data Unavailable",
        description: "Unable to load NASA FIRMS wildfire detections.",
        variant: "destructive",
      });
    }
  }, [firmsError, toast]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      <FireSidebar
        incidents={incidents}
        firmsDetections={firmsDetections}
        selectedIncident={selectedIncident}
        onIncidentSelect={setSelectedIncident}
      />
      <div className="flex-1 flex flex-col p-4 gap-4 relative">
        <div className="flex justify-end z-[1000]">
          <ReportFireDialog />
        </div>
        <div className="flex-1 relative rounded-xl overflow-hidden shadow-2xl border-2 border-border">
          <FireMap
            incidents={incidents}
            sensors={sensors}
            reports={reports}
            wildfires={wildfires}
            firmsDetections={firmsDetections}
            onIncidentSelect={setSelectedIncident}
            selectedIncident={selectedIncident}
            isLoadingWildfires={isLoadingWildfires}
            isLoadingFirms={isLoadingFirms}
          />
          <FireLegend />
        </div>
      </div>
    </div>
  );
};

export default Index;
