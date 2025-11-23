import { Card } from '@/components/ui/card';

export const FireLegend = () => {
  return (
    <Card className="absolute bottom-6 left-6 z-[1000] bg-background/95 backdrop-blur-sm border-2 p-4 shadow-lg">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        <span className="text-primary">🗺️</span>
        Map Legend
      </h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-destructive/60 border-2 border-destructive/40 shadow-sm"></div>
          <span className="font-medium">NASA Wildfire (Canada)</span>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '12px solid #3b82f6' }}></div>
          <span className="font-medium">Sensor Detection</span>
        </div>
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 16 16" className="flex-shrink-0">
            <circle cx="8" cy="4" r="3" fill="#10b981" stroke="white" strokeWidth="1.5"/>
            <path d="M8 8 C5 8, 3 9, 3 12 L3 15 L13 15 L13 12 C13 9, 11 8, 8 8 Z" fill="#10b981" stroke="white" strokeWidth="1.5"/>
          </svg>
          <span className="font-medium">User Report (Verified)</span>
        </div>
        <div className="flex items-center gap-3 relative">
          <svg width="20" height="20" viewBox="0 0 16 16" className="flex-shrink-0">
            <circle cx="8" cy="4" r="3" fill="#fbbf24" stroke="white" strokeWidth="1.5"/>
            <path d="M8 8 C5 8, 3 9, 3 12 L3 15 L13 15 L13 12 C13 9, 11 8, 8 8 Z" fill="#fbbf24" stroke="white" strokeWidth="1.5"/>
          </svg>
          <div className="absolute left-3 -top-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <span className="font-medium">User Report (Pending)</span>
        </div>
      </div>
    </Card>
  );
};
