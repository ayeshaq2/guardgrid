import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  title: string;
  source: string;
  publishedAt: string;
  link: string;
}

interface FireLocation {
  city?: string;
  state?: string;
  country?: string;
}

export const useLocalNews = (locations: FireLocation[] = []) => {
  return useQuery({
    queryKey: ['local-news', locations],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-local-news', {
        body: { locations }
      });
      
      if (error) throw error;
      
      return data as { success: boolean; news: NewsItem[]; count: number };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 3 * 60 * 1000, // Consider data stale after 3 minutes
    enabled: true,
  });
};
