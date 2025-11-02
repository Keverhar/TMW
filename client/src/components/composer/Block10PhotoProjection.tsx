import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Images, Info } from "lucide-react";

interface Block10PhotoProjectionProps {
  photoProjectionPreferences: string;
  onChange: (field: string, value: string) => void;
}

export default function Block10PhotoProjection({
  photoProjectionPreferences,
  onChange
}: Block10PhotoProjectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Photo Projection Options</h2>
        <p className="text-muted-foreground">
          Personalize the visual storytelling during your celebration with a beautiful photo memory wall.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            <CardTitle>Photo Memory Wall Preferences</CardTitle>
          </div>
          <CardDescription>Customize how your photos will be displayed during the reception</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-projection-preferences">Memory Wall Details & Preferences</Label>
            <Textarea
              id="photo-projection-preferences"
              data-testid="input-photo-projection-preferences"
              placeholder="Describe your vision for the photo projection: Which photos to include? Childhood photos? Engagement photos? How to organize them? Preferred music? Special captions or messages?"
              value={photoProjectionPreferences}
              onChange={(e) => onChange('photoProjectionPreferences', e.target.value)}
              rows={6}
            />
          </div>

          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Ideas to consider:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Childhood photos of both of you</li>
              <li>• Your love story timeline</li>
              <li>• Engagement photos</li>
              <li>• Photos with family and friends</li>
              <li>• Special moments and milestones</li>
              <li>• Music or captions to accompany the memory wall</li>
            </ul>
          </div>

          <div className="flex gap-2 items-start bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              After finalizing your booking, we'll provide instructions on how to upload your photos for the memory wall.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
