import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

interface MusicOption {
  id: string;
  title: string;
  artist: string;
  moment: string;
  previewUrl: string;
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
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const handlePlayPause = (musicId: string, previewUrl: string) => {
    const currentAudio = audioRefs.current[musicId];
    
    // Stop any currently playing audio
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== musicId && audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play();
        setPlayingId(musicId);
      } else {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setPlayingId(null);
      }
    } else {
      const audio = new Audio(previewUrl);
      audioRefs.current[musicId] = audio;
      audio.addEventListener('ended', () => setPlayingId(null));
      audio.play();
      setPlayingId(musicId);
    }
  };

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
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handlePlayPause(music.id, music.previewUrl)}
                data-testid={`button-preview-${music.id}`}
              >
                {playingId === music.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
