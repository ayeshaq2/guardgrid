import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const ReportFireDialog = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [hasSmoke, setHasSmoke] = useState(false);
  const [hasFlames, setHasFlames] = useState(false);
  const [hasSmell, setHasSmell] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      let latitude: number;
      let longitude: number;

      // If address is provided, geocode it
      if (address.trim()) {
        // Try progressively simpler address queries
        const addressVariants = [
          address,
          address.replace(/^\d+\s+/, ''), // Remove street number
          address.split(',')[0], // Just the street name
        ];

        const queries = addressVariants.flatMap(variant => [
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(variant)}&limit=3`,
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(variant + ', Canada')}&limit=3&countrycodes=ca,us`,
        ]);

        let data: any[] = [];

        for (const url of queries) {
          const res = await fetch(url);
          const json = await res.json();
          console.log('Geocoding attempt:', url, json);
          if (Array.isArray(json) && json.length > 0) {
            data = json;
            break;
          }
        }

        if (!data || data.length === 0) {
          toast({
            title: 'Address not found',
            description: 'Could not locate this address. Try shortening it (street + city) or use your current location.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        latitude = parseFloat(data[0].lat);
        longitude = parseFloat(data[0].lon);
        console.log('Using coordinates:', { latitude, longitude, display_name: data[0].display_name });
      } else {
        // Use geolocation if no address provided
        if (!navigator.geolocation) {
          toast({
            title: 'Location not available',
            description: 'Your browser does not support geolocation. Please enter an address.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        // Get coordinates from geolocation
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }).catch((error) => {
          toast({
            title: 'Location required',
            description: 'Please enable location access or enter an address to report a fire.',
            variant: 'destructive',
          });
          throw error;
        });
        
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      let photoUrls: string[] | null = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('fire-reports')
          .upload(filePath, imageFile);

        if (uploadError) {
          toast({
            title: 'Error',
            description: 'Failed to upload image. Please try again.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('fire-reports')
          .getPublicUrl(filePath);

        photoUrls = [publicUrl];
      }
      
      const { data, error } = await supabase.from('fire_reports').insert({
        latitude,
        longitude,
        description,
        has_visible_smoke: hasSmoke,
        has_visible_flames: hasFlames,
        has_smell: hasSmell,
        photo_urls: photoUrls,
        report_status: 'pending',
      }).select();

      if (error) {
        console.error('Failed to submit fire report:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to submit report. Please try again.',
          variant: 'destructive',
        });
      } else {
        console.log('Fire report submitted successfully:', data);
        // Invalidate the fire reports query to show the new report immediately
        queryClient.invalidateQueries({ queryKey: ['fire-reports'] });
        
        toast({
          title: 'Report submitted',
          description: 'Thank you for reporting. Our team will verify this shortly.',
        });
        setOpen(false);
        setDescription('');
        setAddress('');
        setHasSmoke(false);
        setHasFlames(false);
        setHasSmell(false);
        setImageFile(null);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Flame className="h-5 w-5" />
          Report a Fire
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report a Fire</DialogTitle>
          <DialogDescription>
            Help us respond quickly by reporting what you see. Enter an address or we'll use your current location.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Address (optional)</Label>
            <Input
              id="address"
              placeholder="e.g., 123 Main St, Los Angeles, CA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to use your current location
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what you see..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="image">Photo (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-2"
            />
          </div>
          
          <div className="space-y-3">
            <Label>What are you observing?</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smoke"
                checked={hasSmoke}
                onCheckedChange={(checked) => setHasSmoke(checked as boolean)}
              />
              <Label htmlFor="smoke" className="font-normal cursor-pointer">
                Visible smoke
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="flames"
                checked={hasFlames}
                onCheckedChange={(checked) => setHasFlames(checked as boolean)}
              />
              <Label htmlFor="flames" className="font-normal cursor-pointer">
                Visible flames
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smell"
                checked={hasSmell}
                onCheckedChange={(checked) => setHasSmell(checked as boolean)}
              />
              <Label htmlFor="smell" className="font-normal cursor-pointer">
                Smell of smoke
              </Label>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
