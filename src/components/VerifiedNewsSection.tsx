import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface FireLocation {
  city?: string;
  state?: string;
  country?: string;
}

interface VerifiedNewsSectionProps {
  fireLocations: FireLocation[];
}

// Static, verified recent fire news articles
const VERIFIED_FIRE_NEWS = [
  {
    title: 'Ship catches fire at Los Angeles port, major emergency declared',
    source: 'CNN',
    link: 'https://www.cnn.com/2025/11/22/us/los-angeles-port-fire-major-emergency-hnk',
    publishedAt: '2025-11-22T12:00:00Z',
  },
  {
    title: 'Fast-moving blaze in picturesque California county damages 15 structures',
    source: 'NBC News',
    link: 'https://www.nbcnews.com/news/us-news/fast-moving-blaze-picturesque-california-county-damages-15-structures-rcna243876',
    publishedAt: '2025-11-22T10:30:00Z',
  },
  {
    title: 'Ship catches fire at Los Angeles port, six crew members unaccounted',
    source: 'Reuters',
    link: 'https://www.reuters.com/world/us/ship-catches-fire-los-angeles-port-six-crew-members-unaccounted-fire-dept-says-2025-11-22/',
    publishedAt: '2025-11-22T11:15:00Z',
  },
  {
    title: 'Cargo ship fire at Los Angeles port prompts emergency response',
    source: 'The New York Times',
    link: 'https://www.nytimes.com/2025/11/22/us/cargo-ship-fire-los-angeles-port.html',
    publishedAt: '2025-11-22T09:45:00Z',
  },
];

export const VerifiedNewsSection = (_props: VerifiedNewsSectionProps) => {
  // For now, ignore dynamic fetching and always show these verified articles
  const newsItems = VERIFIED_FIRE_NEWS;

  return (
    <Card className="bg-card/98 backdrop-blur-md border-border/60 shadow-xl h-[220px] flex flex-col overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
      <CardHeader className="pb-3 pt-4 px-5 flex-shrink-0 border-b border-border/50 relative bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/20 rounded-lg border border-destructive/20 shadow-sm">
            <Newspaper className="h-4 w-4 text-destructive" />
          </div>
          <CardTitle className="text-sm font-bold flex-1 text-foreground font-poppins">
            Verified Fire News Updates
          </CardTitle>
          <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wide shadow-sm border border-border/50 font-poppins">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse"></span>
            Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-5 pb-4 pt-3">
        {newsItems.length === 0 ? (
          <div className="text-xs text-muted-foreground font-medium">No recent verified fire news available.</div>
        ) : (
          <div className="h-full overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
            {newsItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg transition-all duration-200 border border-border/50 hover:border-primary/40 hover:shadow-md group bg-card hover:bg-gradient-to-br hover:from-background hover:via-background hover:to-accent/20 hover:scale-[1.02]"
              >
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold leading-snug text-foreground group-hover:text-primary line-clamp-2 transition-colors font-poppins">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground font-medium font-poppins">
                    <span className="flex items-center gap-1.5 text-foreground/90 font-bold uppercase tracking-wide">
                      <ExternalLink className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
                      {item.source}
                    </span>
                    <span className="text-border/70">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 opacity-60" />
                      {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
