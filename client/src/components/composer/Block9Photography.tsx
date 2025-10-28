import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

interface Block9PhotographyProps {
  photographyStyle: string;
  mustHaveShots: string;
  vipList: string;
  groupPhotosRequested: string;
  photographySpecialRequests: string;
  onChange: (field: string, value: string) => void;
}

export default function Block9Photography({
  photographyStyle,
  mustHaveShots,
  vipList,
  groupPhotosRequested,
  photographySpecialRequests,
  onChange
}: Block9PhotographyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Photography Preferences</h2>
        <p className="text-muted-foreground">
          Help us capture your day exactly how you envision it — from the overall vibe to specific must-have moments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <CardTitle>Photography Style</CardTitle>
          </div>
          <CardDescription>Describe the overall vibe and aesthetic you're going for</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photography-style">Preferred Photography Style</Label>
            <Textarea
              id="photography-style"
              data-testid="input-photography-style"
              placeholder="Examples: candid and natural, classic and posed, editorial and artistic, documentary style, romantic and dreamy..."
              value={photographyStyle}
              onChange={(e) => onChange('photographyStyle', e.target.value)}
              rows={3}
            />
          </div>

          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Style Examples:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Candid and natural — capturing authentic moments as they happen</li>
              <li>• Classic and posed — timeless, formal portraits</li>
              <li>• Editorial and artistic — creative, magazine-style compositions</li>
              <li>• Documentary style — photojournalistic, storytelling approach</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Must-Have Shots</CardTitle>
          <CardDescription>What moments or photos are absolutely essential to capture?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="must-have-shots">Essential Moments & Photos</Label>
            <Textarea
              id="must-have-shots"
              data-testid="input-must-have-shots"
              placeholder="Examples: first look, ceremony kiss, cake cutting, first dance, family portraits, detail shots of rings, etc."
              value={mustHaveShots}
              onChange={(e) => onChange('mustHaveShots', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>VIP List</CardTitle>
          <CardDescription>Who are the key people that should be featured in photos?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="vip-list">VIP Guests for Photography</Label>
            <Textarea
              id="vip-list"
              data-testid="input-vip-list"
              placeholder="List names and relationships (parents, grandparents, bridal party, special guests, etc.)"
              value={vipList}
              onChange={(e) => onChange('vipList', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Photos Requested</CardTitle>
          <CardDescription>Specific group combinations you'd like photographed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="group-photos-requested">Group Photo Combinations</Label>
            <Textarea
              id="group-photos-requested"
              data-testid="input-group-photos-requested"
              placeholder="Examples: entire bridal party, family on each side, college friends, cousins, etc."
              value={groupPhotosRequested}
              onChange={(e) => onChange('groupPhotosRequested', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photography Special Requests</CardTitle>
          <CardDescription>Any other photography details or preferences?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            data-testid="input-photography-special-requests"
            placeholder="Share any additional photography preferences, poses to avoid, timing concerns, or special requests..."
            value={photographySpecialRequests}
            onChange={(e) => onChange('photographySpecialRequests', e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
