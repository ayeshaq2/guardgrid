import { useState, useEffect, useMemo } from 'react';
import FireMap from '@/components/FireMap';
import FireSidebar from '@/components/FireSidebar';
import { FireLegend } from '@/components/FireLegend';
import { ReportFireDialog } from '@/components/ReportFireDialog';
import { VerifiedNewsSection } from '@/components/VerifiedNewsSection';
import { useFireIncidents, useFireSensors, useFireReports } from '@/hooks/useFireData';
import { useWildfireEvents } from '@/hooks/useWildfireEvents';
import { useFirmsWildfires } from '@/hooks/useFirmsWildfires';
import { FireIncident } from '@/types/fire';
import { useToast } from '@/hooks/use-toast';
import { extractFireLocations } from '@/utils/extractFireLocations';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [selectedIncident, setSelectedIncident] = useState<FireIncident | null>(null);
  const { data: incidents = [] } = useFireIncidents();
  const { data: sensors = [] } = useFireSensors();
  const { data: reports = [] } = useFireReports();
  const { data: wildfires = [], isLoading: isLoadingWildfires, error: wildfiresError } = useWildfireEvents();
  const { data: firmsDetections = [], isLoading: isLoadingFirms, error: firmsError } = useFirmsWildfires();
  const { toast } = useToast();

  // Extract fire locations for news filtering
  const fireLocations = useMemo(() => {
    return extractFireLocations(wildfires, firmsDetections);
  }, [wildfires, firmsDetections]);

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

  // Subscribe to realtime sensor detections
  useEffect(() => {
    const channel = supabase
      .channel('fire-sensors-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'fire_sensors'
        },
        (payload) => {
          console.log('New fire sensor detected:', payload);
          const sensor = payload.new;
          toast({
            title: "🔥 Fire Detected by Sensor",
            description: `Sensor detected fire at ${new Date(sensor.detection_time).toLocaleTimeString()}. Confidence: ${Math.round(sensor.confidence_level || 0)}%`,
            variant: "destructive",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      <FireSidebar
        incidents={incidents}
        firmsDetections={firmsDetections}
        selectedIncident={selectedIncident}
        onIncidentSelect={setSelectedIncident}
      />
      <div className="flex-1 flex flex-col p-4 gap-4 relative">
        <div className="flex justify-end items-start z-[1000]">
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
        <div className="w-full">
          <VerifiedNewsSection fireLocations={fireLocations} />
        </div>
      </div>
    </div>
  );
};

export default Index;
