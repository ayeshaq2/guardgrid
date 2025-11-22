import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FireIncident, FireSensor, FireReport } from '@/types/fire';

export const useFireIncidents = () => {
  return useQuery({
    queryKey: ['fire-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fire_incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FireIncident[];
    },
  });
};

export const useFireSensors = () => {
  return useQuery({
    queryKey: ['fire-sensors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fire_sensors')
        .select('*')
        .eq('is_active', true)
        .order('detection_time', { ascending: false });
      
      if (error) throw error;
      return data as FireSensor[];
    },
  });
};

export const useFireReports = () => {
  return useQuery({
    queryKey: ['fire-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fire_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FireReport[];
    },
  });
};
