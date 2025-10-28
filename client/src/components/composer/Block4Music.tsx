import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Music, Info } from "lucide-react";

interface Block4MusicProps {
  processionalSong: string;
  recessionalSong: string;
  receptionEntranceSong: string;
  cakeCuttingSong: string;
  fatherDaughterDanceSong: string;
  lastDanceSong: string;
  playlistUrl: string;
  onChange: (field: string, value: string) => void;
}

export default function Block4Music({
  processionalSong,
  recessionalSong,
  receptionEntranceSong,
  cakeCuttingSong,
  fatherDaughterDanceSong,
  lastDanceSong,
  playlistUrl,
  onChange
}: Block4MusicProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Music Selection</h2>
        <p className="text-muted-foreground">
          Music sets the emotional heartbeat of your day — from the moment you walk down the aisle to the very last dance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            <CardTitle>Ceremony Songs</CardTitle>
          </div>
          <CardDescription>Choose the music that sets the tone for the most meaningful part of your day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="processional-song">Processional</Label>
            <Input
              id="processional-song"
              data-testid="input-processional-song"
              placeholder="The song for your walk down the aisle"
              value={processionalSong}
              onChange={(e) => onChange('processionalSong', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Enter song name and artist, or paste a Spotify link</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recessional-song">Recessional</Label>
            <Input
              id="recessional-song"
              data-testid="input-recessional-song"
              placeholder="The joyful exit as newlyweds"
              value={recessionalSong}
              onChange={(e) => onChange('recessionalSong', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Enter song name and artist, or paste a Spotify link</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            <CardTitle>Reception Highlights</CardTitle>
          </div>
          <CardDescription>Select the soundtrack to your most memorable reception moments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reception-entrance-song">Reception Entrance</Label>
            <Input
              id="reception-entrance-song"
              data-testid="input-reception-entrance-song"
              placeholder="Your grand entrance as a married couple"
              value={receptionEntranceSong}
              onChange={(e) => onChange('receptionEntranceSong', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cake-cutting-song">Cake Cutting</Label>
            <Input
              id="cake-cutting-song"
              data-testid="input-cake-cutting-song"
              placeholder="A sweet soundtrack to match the moment"
              value={cakeCuttingSong}
              onChange={(e) => onChange('cakeCuttingSong', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="father-daughter-dance-song">Father-Daughter Dance</Label>
            <Input
              id="father-daughter-dance-song"
              data-testid="input-father-daughter-dance-song"
              placeholder="A song that reflects your bond"
              value={fatherDaughterDanceSong}
              onChange={(e) => onChange('fatherDaughterDanceSong', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last-dance-song">Private Last Dance</Label>
            <Input
              id="last-dance-song"
              data-testid="input-last-dance-song"
              placeholder="The final song of the night, just for you two"
              value={lastDanceSong}
              onChange={(e) => onChange('lastDanceSong', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Full Playlist (Optional)</CardTitle>
          <CardDescription>Want to go beyond the highlights? Upload or build a full 2.5-hour playlist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-url">Spotify Playlist Link</Label>
            <Input
              id="playlist-url"
              data-testid="input-playlist-url"
              placeholder="Paste your Spotify playlist URL here"
              value={playlistUrl}
              onChange={(e) => onChange('playlistUrl', e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-start bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Our software automatically times and cues every song and your host will speak when needed, so there's no need to worry about transitions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
