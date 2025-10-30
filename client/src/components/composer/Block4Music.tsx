import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Info, Music2, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Block4MusicProps {
  processionalSong: string;
  recessionalSong: string;
  receptionEntranceSong: string;
  cakeCuttingSong: string;
  fatherDaughterDanceSong: string;
  lastDanceSong: string;
  playlistUrl: string;
  musicCompletionStatus: string;
  onChange: (field: string, value: string) => void;
  readOnly?: boolean;
}

const processionalOptions = [
  { label: "Canon in D (Johann Pachelbel)", value: "canon-in-d", spotifyUrl: "https://open.spotify.com/track/54pg91e33yzM0KAcVHR7pQ?si=711700e581c04043" },
  { label: "At Last (Etta James / Instrumental)", value: "at-last", spotifyUrl: "https://open.spotify.com/track/5oRC4XXAViNiQNuqN11Wbi?si=84707e3b854a4213" },
  { label: "Can't Help Falling in Love (Elvis Presley / Instrumental)", value: "cant-help-falling", spotifyUrl: "https://open.spotify.com/track/5uoRpWr8tTlKQB54cg2lfU?si=eac5ab59998344a0" },
  { label: "All of Me (John Legend / Instrumental)", value: "all-of-me", spotifyUrl: "https://open.spotify.com/track/2PoWRtXm8B53jpqO8mdIF9?si=8d013c8dab9f4fbc" },
  { label: "Custom (Enter Spotify link below)", value: "custom", spotifyUrl: "" },
];

const recessionalOptions = [
  { label: "Toccata Symphony No. 5 (Charles-Marie Widor)", value: "toccata", spotifyUrl: "https://open.spotify.com/track/6SiwfTLDgaTi7O6fXvOu2X?si=ae4a54d247854c92" },
  { label: "The Four Seasons - Spring (Antonio Vivaldi)", value: "four-seasons", spotifyUrl: "https://open.spotify.com/track/6cMvfWeDBdeE2UI3J6R019?si=0918eab73ba64ed0" },
  { label: "Wedding March (Felix Mendelssohn)", value: "wedding-march", spotifyUrl: "https://open.spotify.com/track/6CyhZwhS6eG1UVeNv6N7VS?si=1c8ad1abac8f4847" },
  { label: "Signed, Sealed, Delivered (Stevie Wonder)", value: "signed-sealed", spotifyUrl: "https://open.spotify.com/track/2C5SI38AMmqckQGnD1H2FO?si=e7a7010886964e4a" },
  { label: "Custom (Enter Spotify link below)", value: "custom", spotifyUrl: "" },
];

const receptionEntranceOptions = [
  { label: "Crazy in Love (Beyoncé featuring JAY-Z)", value: "crazy-in-love", spotifyUrl: "https://open.spotify.com/track/5IVuqXILoxVWvWEPm82Jxr?si=12db5468ed0d4653" },
  { label: "You Make My Dreams Come True (Hall & Oates)", value: "you-make-my-dreams", spotifyUrl: "https://open.spotify.com/track/4o6BgsqLIBViaGVbx5rbRk?si=533deed2d9c942cb" },
  { label: "24K Magic (Bruno Mars)", value: "24k-magic", spotifyUrl: "https://open.spotify.com/track/6b8Be6ljOzmkOmFslEb23P?si=93a7dbc4100745fd" },
  { label: "Come Fly With Me (Frank Sinatra)", value: "come-fly-with-me", spotifyUrl: "https://open.spotify.com/track/1GcPhT7osBb4LEJnQ0tmfj?si=931dc4e319764a69" },
  { label: "Custom (Enter Spotify link below)", value: "custom", spotifyUrl: "" },
];

const cakeCuttingOptions = [
  { label: "I Can't Help Myself / Sugar Pie, Honey Bunch (The Four Tops)", value: "sugar-pie", spotifyUrl: "https://open.spotify.com/track/6b6IMqP565TbtFFZg9iFf3?si=a1f5eeb26e774a51" },
  { label: "How Sweet It Is (James Taylor)", value: "how-sweet-it-is", spotifyUrl: "https://open.spotify.com/track/4BiqtG2bW4JrNRd2T2mr0j?si=557a20af11164795" },
  { label: "Cake By The Ocean (DNCE)", value: "cake-by-ocean", spotifyUrl: "https://open.spotify.com/track/76hfruVvmfQbw0eYn1nmeC?si=8d9fd2f250bf4fd6" },
  { label: "Honey Bee (Blake Shelton)", value: "honey-bee", spotifyUrl: "https://open.spotify.com/track/0gY2iq0xJPRoIB1PScKSw4?si=ce1b632233e94cc2" },
  { label: "Custom (Enter Spotify link below)", value: "custom", spotifyUrl: "" },
];

const fatherDaughterDanceOptions = [
  { label: "The Way You Look Tonight (Frank Sinatra)", value: "way-you-look-tonight", spotifyUrl: "https://open.spotify.com/track/0shGCs5AkhwJIgUb0SSz2B?si=6c9d87df6fa24b42" },
  { label: "Isn't She Lovely (Stevie Wonder)", value: "isnt-she-lovely", spotifyUrl: "https://open.spotify.com/track/6RANU8AS5ICU5PEHh8BYtH?si=7cd5af17da5a4f17" },
  { label: "Daughters (John Mayer)", value: "daughters", spotifyUrl: "https://open.spotify.com/track/5FPnjikbwlDMULCCCa6ZCJ?si=1beceb0f7ce14205" },
  { label: "I Loved Her First (Heartland)", value: "i-loved-her-first", spotifyUrl: "https://open.spotify.com/track/7KeVXnlNls1D3BMa0oxgUW?si=050ea6a8de064bdd" },
  { label: "Custom (Enter Spotify link below)", value: "custom", spotifyUrl: "" },
];

const lastDanceOptions = [
  { label: "Stand by Me (Ben E. King)", value: "stand-by-me", spotifyUrl: "https://open.spotify.com/track/6OzAkuRDmEpd52RF1g1WvU?si=d882ff9dd77f4278" },
  { label: "Thinking Out Loud (Ed Sheeran)", value: "thinking-out-loud", spotifyUrl: "https://open.spotify.com/track/34gCuhDGsG4bRPIf9bb02f?si=8b3bc11090ff41f2" },
  { label: "Your Song (Elton John)", value: "your-song", spotifyUrl: "https://open.spotify.com/track/38zsOOcu31XbbYj9BIPUF1?si=efe23b02a55c44ae" },
  { label: "Die a Happy Man (Thomas Rhett)", value: "die-happy-man", spotifyUrl: "https://open.spotify.com/track/5kNe7PE09d6Kvw5pAsx23n?si=38e007f7f3794036" },
  { label: "Custom (Enter Spotify link below)", value: "custom", spotifyUrl: "" },
];

export default function Block4Music({
  processionalSong,
  recessionalSong,
  receptionEntranceSong,
  cakeCuttingSong,
  fatherDaughterDanceSong,
  lastDanceSong,
  playlistUrl,
  musicCompletionStatus,
  onChange,
  readOnly = false
}: Block4MusicProps) {
  const { toast } = useToast();
  
  const [processionalSelection, setProcessionalSelection] = useState(
    processionalOptions.find(opt => processionalSong === opt.label)?.value || (processionalSong && processionalSong.startsWith('http') ? 'custom' : '')
  );
  const [recessionalSelection, setRecessionalSelection] = useState(
    recessionalOptions.find(opt => recessionalSong === opt.label)?.value || (recessionalSong && recessionalSong.startsWith('http') ? 'custom' : '')
  );
  const [receptionEntranceSelection, setReceptionEntranceSelection] = useState(
    receptionEntranceOptions.find(opt => receptionEntranceSong === opt.label)?.value || (receptionEntranceSong && receptionEntranceSong.startsWith('http') ? 'custom' : '')
  );
  const [cakeCuttingSelection, setCakeCuttingSelection] = useState(
    cakeCuttingOptions.find(opt => cakeCuttingSong === opt.label)?.value || (cakeCuttingSong && cakeCuttingSong.startsWith('http') ? 'custom' : '')
  );
  const [fatherDaughterDanceSelection, setFatherDaughterDanceSelection] = useState(
    fatherDaughterDanceOptions.find(opt => fatherDaughterDanceSong === opt.label)?.value || (fatherDaughterDanceSong && fatherDaughterDanceSong.startsWith('http') ? 'custom' : '')
  );
  const [lastDanceSelection, setLastDanceSelection] = useState(
    lastDanceOptions.find(opt => lastDanceSong === opt.label)?.value || (lastDanceSong && lastDanceSong.startsWith('http') ? 'custom' : '')
  );

  const openSpotifyPreview = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleProcessionalChange = (value: string) => {
    setProcessionalSelection(value);
    const selected = processionalOptions.find(opt => opt.value === value);
    if (selected && value !== 'custom') {
      onChange('processionalSong', selected.label);
    } else if (value === 'custom') {
      onChange('processionalSong', '');
    }
  };

  const handleRecessionalChange = (value: string) => {
    setRecessionalSelection(value);
    const selected = recessionalOptions.find(opt => opt.value === value);
    if (selected && value !== 'custom') {
      onChange('recessionalSong', selected.label);
    } else if (value === 'custom') {
      onChange('recessionalSong', '');
    }
  };

  const handleReceptionEntranceChange = (value: string) => {
    setReceptionEntranceSelection(value);
    const selected = receptionEntranceOptions.find(opt => opt.value === value);
    if (selected && value !== 'custom') {
      onChange('receptionEntranceSong', selected.label);
    } else if (value === 'custom') {
      onChange('receptionEntranceSong', '');
    }
  };

  const handleCakeCuttingChange = (value: string) => {
    setCakeCuttingSelection(value);
    const selected = cakeCuttingOptions.find(opt => opt.value === value);
    if (selected && value !== 'custom') {
      onChange('cakeCuttingSong', selected.label);
    } else if (value === 'custom') {
      onChange('cakeCuttingSong', '');
    }
  };

  const handleFatherDaughterDanceChange = (value: string) => {
    setFatherDaughterDanceSelection(value);
    const selected = fatherDaughterDanceOptions.find(opt => opt.value === value);
    if (selected && value !== 'custom') {
      onChange('fatherDaughterDanceSong', selected.label);
    } else if (value === 'custom') {
      onChange('fatherDaughterDanceSong', '');
    }
  };

  const handleLastDanceChange = (value: string) => {
    setLastDanceSelection(value);
    const selected = lastDanceOptions.find(opt => opt.value === value);
    if (selected && value !== 'custom') {
      onChange('lastDanceSong', selected.label);
    } else if (value === 'custom') {
      onChange('lastDanceSong', '');
    }
  };

  const allRequiredFieldsFilled = processionalSong && recessionalSong && receptionEntranceSong && cakeCuttingSong && lastDanceSong;
  const someFieldsEmpty = !processionalSong || !recessionalSong || !receptionEntranceSong || !cakeCuttingSong || !lastDanceSong;

  const handleCompletionStatusChange = (status: string) => {
    if (musicCompletionStatus === status) {
      onChange('musicCompletionStatus', '');
    } else {
      onChange('musicCompletionStatus', status);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Music Selection</h2>
        <p className="text-muted-foreground">
          Music sets the emotional heartbeat of your day — from the moment you walk down the aisle to the very last dance.
        </p>
      </div>

      {readOnly && (
        <div className="flex gap-3 items-start bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">Available with Full Wedding Package</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              This section is included in our Saturday, Friday/Sunday wedding packages. You can view all options but selections are not available for Elopement and Vow Renewal packages.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            <CardTitle>Ceremony Songs</CardTitle>
          </div>
          <CardDescription>Choose the music that sets the tone for the most meaningful part of your day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="processional-song">Processional</Label>
            <div className="flex gap-2">
              <Select value={processionalSelection} onValueChange={handleProcessionalChange} disabled={readOnly}>
                <SelectTrigger id="processional-song" data-testid="select-processional-song" className="flex-1">
                  <SelectValue placeholder="Select a song or custom option" />
                </SelectTrigger>
                <SelectContent>
                  {processionalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {processionalSelection && processionalSelection !== 'custom' && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  data-testid="button-preview-processional"
                  onClick={() => {
                    const selected = processionalOptions.find(opt => opt.value === processionalSelection);
                    if (selected?.spotifyUrl) {
                      openSpotifyPreview(selected.spotifyUrl);
                    }
                  }}
                >
                  <Music2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {processionalSelection === 'custom' && (
              <div className="flex gap-2">
                <Input
                  data-testid="input-processional-custom"
                  placeholder="Paste Spotify link here"
                  value={processionalSong}
                  onChange={(e) => onChange('processionalSong', e.target.value)}
                  className="flex-1"
                  disabled={readOnly}
                />
                {processionalSong && processionalSong.includes('spotify.com') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="button-preview-processional-custom"
                    onClick={() => openSpotifyPreview(processionalSong)}
                  >
                    <Music2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="recessional-song">Recessional</Label>
            <div className="flex gap-2">
              <Select value={recessionalSelection} onValueChange={handleRecessionalChange} disabled={readOnly}>
                <SelectTrigger id="recessional-song" data-testid="select-recessional-song" className="flex-1">
                  <SelectValue placeholder="Select a song or custom option" />
                </SelectTrigger>
                <SelectContent>
                  {recessionalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {recessionalSelection && recessionalSelection !== 'custom' && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  data-testid="button-preview-recessional"
                  onClick={() => {
                    const selected = recessionalOptions.find(opt => opt.value === recessionalSelection);
                    if (selected?.spotifyUrl) {
                      openSpotifyPreview(selected.spotifyUrl);
                    }
                  }}
                >
                  <Music2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {recessionalSelection === 'custom' && (
              <div className="flex gap-2">
                <Input
                  data-testid="input-recessional-custom"
                  placeholder="Paste Spotify link here"
                  value={recessionalSong}
                  onChange={(e) => onChange('recessionalSong', e.target.value)}
                  className="flex-1"
                  disabled={readOnly}
                />
                {recessionalSong && recessionalSong.includes('spotify.com') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="button-preview-recessional-custom"
                    onClick={() => openSpotifyPreview(recessionalSong)}
                  >
                    <Music2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
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
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="reception-entrance-song">Reception Entrance</Label>
            <div className="flex gap-2">
              <Select value={receptionEntranceSelection} onValueChange={handleReceptionEntranceChange} disabled={readOnly}>
                <SelectTrigger id="reception-entrance-song" data-testid="select-reception-entrance-song" className="flex-1">
                  <SelectValue placeholder="Select a song or custom option" />
                </SelectTrigger>
                <SelectContent>
                  {receptionEntranceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {receptionEntranceSelection && receptionEntranceSelection !== 'custom' && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  data-testid="button-preview-reception-entrance"
                  onClick={() => {
                    const selected = receptionEntranceOptions.find(opt => opt.value === receptionEntranceSelection);
                    if (selected?.spotifyUrl) {
                      openSpotifyPreview(selected.spotifyUrl);
                    }
                  }}
                >
                  <Music2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {receptionEntranceSelection === 'custom' && (
              <div className="flex gap-2">
                <Input
                  data-testid="input-reception-entrance-custom"
                  placeholder="Paste Spotify link here"
                  value={receptionEntranceSong}
                  onChange={(e) => onChange('receptionEntranceSong', e.target.value)}
                  className="flex-1"
                  disabled={readOnly}
                />
                {receptionEntranceSong && receptionEntranceSong.includes('spotify.com') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="button-preview-reception-entrance-custom"
                    onClick={() => openSpotifyPreview(receptionEntranceSong)}
                  >
                    <Music2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="cake-cutting-song">Cake Cutting</Label>
            <div className="flex gap-2">
              <Select value={cakeCuttingSelection} onValueChange={handleCakeCuttingChange} disabled={readOnly}>
                <SelectTrigger id="cake-cutting-song" data-testid="select-cake-cutting-song" className="flex-1">
                  <SelectValue placeholder="Select a song or custom option" />
                </SelectTrigger>
                <SelectContent>
                  {cakeCuttingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cakeCuttingSelection && cakeCuttingSelection !== 'custom' && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  data-testid="button-preview-cake-cutting"
                  onClick={() => {
                    const selected = cakeCuttingOptions.find(opt => opt.value === cakeCuttingSelection);
                    if (selected?.spotifyUrl) {
                      openSpotifyPreview(selected.spotifyUrl);
                    }
                  }}
                >
                  <Music2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {cakeCuttingSelection === 'custom' && (
              <div className="flex gap-2">
                <Input
                  data-testid="input-cake-cutting-custom"
                  placeholder="Paste Spotify link here"
                  value={cakeCuttingSong}
                  onChange={(e) => onChange('cakeCuttingSong', e.target.value)}
                  className="flex-1"
                  disabled={readOnly}
                />
                {cakeCuttingSong && cakeCuttingSong.includes('spotify.com') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="button-preview-cake-cutting-custom"
                    onClick={() => openSpotifyPreview(cakeCuttingSong)}
                  >
                    <Music2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="father-daughter-dance-song">Father-Daughter Dance (Optional)</Label>
            <div className="flex gap-2">
              <Select value={fatherDaughterDanceSelection} onValueChange={handleFatherDaughterDanceChange} disabled={readOnly}>
                <SelectTrigger id="father-daughter-dance-song" data-testid="select-father-daughter-dance-song" className="flex-1">
                  <SelectValue placeholder="Select a song or custom option" />
                </SelectTrigger>
                <SelectContent>
                  {fatherDaughterDanceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fatherDaughterDanceSelection && fatherDaughterDanceSelection !== 'custom' && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  data-testid="button-preview-father-daughter-dance"
                  onClick={() => {
                    const selected = fatherDaughterDanceOptions.find(opt => opt.value === fatherDaughterDanceSelection);
                    if (selected?.spotifyUrl) {
                      openSpotifyPreview(selected.spotifyUrl);
                    }
                  }}
                >
                  <Music2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {fatherDaughterDanceSelection === 'custom' && (
              <div className="flex gap-2">
                <Input
                  data-testid="input-father-daughter-dance-custom"
                  placeholder="Paste Spotify link here"
                  value={fatherDaughterDanceSong}
                  onChange={(e) => onChange('fatherDaughterDanceSong', e.target.value)}
                  className="flex-1"
                  disabled={readOnly}
                />
                {fatherDaughterDanceSong && fatherDaughterDanceSong.includes('spotify.com') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="button-preview-father-daughter-dance-custom"
                    onClick={() => openSpotifyPreview(fatherDaughterDanceSong)}
                  >
                    <Music2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="last-dance-song">Private Last Dance</Label>
            <div className="flex gap-2">
              <Select value={lastDanceSelection} onValueChange={handleLastDanceChange} disabled={readOnly}>
                <SelectTrigger id="last-dance-song" data-testid="select-last-dance-song" className="flex-1">
                  <SelectValue placeholder="Select a song or custom option" />
                </SelectTrigger>
                <SelectContent>
                  {lastDanceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {lastDanceSelection && lastDanceSelection !== 'custom' && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  data-testid="button-preview-last-dance"
                  onClick={() => {
                    const selected = lastDanceOptions.find(opt => opt.value === lastDanceSelection);
                    if (selected?.spotifyUrl) {
                      openSpotifyPreview(selected.spotifyUrl);
                    }
                  }}
                >
                  <Music2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {lastDanceSelection === 'custom' && (
              <div className="flex gap-2">
                <Input
                  data-testid="input-last-dance-custom"
                  placeholder="Paste Spotify link here"
                  value={lastDanceSong}
                  onChange={(e) => onChange('lastDanceSong', e.target.value)}
                  className="flex-1"
                  disabled={readOnly}
                />
                {lastDanceSong && lastDanceSong.includes('spotify.com') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="button-preview-last-dance-custom"
                    onClick={() => openSpotifyPreview(lastDanceSong)}
                  >
                    <Music2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
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
              disabled={readOnly}
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

      <Card>
        <CardHeader>
          <CardTitle>Music Selection Status</CardTitle>
          <CardDescription>Let us know if you're ready to move forward or need more time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="music-all-done"
              data-testid="checkbox-music-all-done"
              checked={musicCompletionStatus === 'all-done'}
              onCheckedChange={() => handleCompletionStatusChange('all-done')}
              disabled={readOnly || !allRequiredFieldsFilled}
            />
            <Label htmlFor="music-all-done" className={`cursor-pointer font-medium ${!allRequiredFieldsFilled ? 'opacity-50' : ''}`}>
              All done (for now)
            </Label>
          </div>
          
          {!allRequiredFieldsFilled && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="music-finish-later"
                data-testid="checkbox-music-finish-later"
                checked={musicCompletionStatus === 'finish-later'}
                onCheckedChange={() => handleCompletionStatusChange('finish-later')}
                disabled={readOnly}
              />
              <Label htmlFor="music-finish-later" className="cursor-pointer font-medium">
                We'll finish this later
              </Label>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
