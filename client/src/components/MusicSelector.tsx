import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";

interface MusicOption {
  id: string;
  title: string;
  artist: string;
  moment: string;
}

interface MusicSelectorProps {
  musicOptions: MusicOption[];
  selectedMusic: string[];
  onToggleMusic: (musicId: string) => void;
}

export default function MusicSelector({
  musicOptions,
  selectedMusic,
  onToggleMusic,
}: MusicSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Ceremony Music</CardTitle>
        <CardDescription>Select music for different moments of your ceremony</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {musicOptions.map((music) => (
            <div
              key={music.id}
              className="flex items-start space-x-3 rounded-md border p-4 hover-elevate"
              data-testid={`row-music-${music.id}`}
            >
              <Checkbox
                id={music.id}
                checked={selectedMusic.includes(music.id)}
                onCheckedChange={() => onToggleMusic(music.id)}
                data-testid={`checkbox-music-${music.id}`}
              />
              <div className="flex-1">
                <Label htmlFor={music.id} className="text-base font-medium cursor-pointer flex items-center gap-2">
                  <Music className="h-4 w-4 text-primary" />
                  {music.title}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {music.artist} • {music.moment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
