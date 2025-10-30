import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Info, Lock } from "lucide-react";

interface Block9PhotographyProps {
  mustHaveShots: string;
  mustHaveShotsNA: boolean;
  vipList: string;
  vipListNA: boolean;
  groupPhotosRequested: string;
  groupPhotosRequestedNA: boolean;
  photographySpecialRequests: string;
  photographySpecialRequestsNA: boolean;
  photographyCompletionStatus: string;
  onChange: (field: string, value: string | boolean) => void;
  readOnly?: boolean;
}

export default function Block9Photography({
  mustHaveShots,
  mustHaveShotsNA,
  vipList,
  vipListNA,
  groupPhotosRequested,
  groupPhotosRequestedNA,
  photographySpecialRequests,
  photographySpecialRequestsNA,
  photographyCompletionStatus,
  onChange,
  readOnly = false
}: Block9PhotographyProps) {
  const isMustHaveShotsFilled = mustHaveShotsNA || mustHaveShots;
  const isVipListFilled = vipListNA || vipList;
  const isGroupPhotosFilled = groupPhotosRequestedNA || groupPhotosRequested;
  const isSpecialRequestsFilled = photographySpecialRequestsNA || photographySpecialRequests;

  const allRequiredFieldsFilled = isMustHaveShotsFilled && isVipListFilled && 
    isGroupPhotosFilled && isSpecialRequestsFilled;

  const someFieldsEmpty = !isMustHaveShotsFilled || !isVipListFilled || 
    !isGroupPhotosFilled || !isSpecialRequestsFilled;

  const handleCompletionStatusChange = (status: string) => {
    if (photographyCompletionStatus === status) {
      onChange('photographyCompletionStatus', '');
    } else {
      onChange('photographyCompletionStatus', status);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Photography Preferences</h2>
        <p className="text-muted-foreground">
          Help us capture your day exactly how you envision it — from must-have moments to specific people and groups.
        </p>
      </div>

      {readOnly && (
        <div className="flex gap-3 items-start bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">Available with Full Wedding Package</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              The Elopement and Vow Renewal packages include a standard photography set but you are welcome to review these options that are available with the Modest Wedding packages.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <CardTitle>Must-Have Shots</CardTitle>
          </div>
          <CardDescription>What moments or photos are absolutely essential to capture?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="must-have-shots">Essential Moments & Photos</Label>
            <Textarea
              id="must-have-shots"
              data-testid="input-must-have-shots"
              placeholder="Examples: first look, ceremony kiss, cake cutting, first dance, family portraits, detail shots of rings, etc."
              value={mustHaveShots}
              onChange={(e) => onChange('mustHaveShots', e.target.value)}
              rows={4}
              disabled={mustHaveShotsNA || readOnly}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="must-have-shots-na"
              data-testid="checkbox-must-have-shots-na"
              checked={mustHaveShotsNA}
              onCheckedChange={(checked) => {
                onChange('mustHaveShotsNA', checked as boolean);
                if (checked) {
                  onChange('mustHaveShots', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="must-have-shots-na" className="cursor-pointer text-sm">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>VIP List</CardTitle>
          <CardDescription>Who are the key people that should be featured in photos?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vip-list">VIP Guests for Photography</Label>
            <Textarea
              id="vip-list"
              data-testid="input-vip-list"
              placeholder="List names and relationships (parents, grandparents, bridal party, special guests, etc.)"
              value={vipList}
              onChange={(e) => onChange('vipList', e.target.value)}
              rows={4}
              disabled={vipListNA || readOnly}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="vip-list-na"
              data-testid="checkbox-vip-list-na"
              checked={vipListNA}
              onCheckedChange={(checked) => {
                onChange('vipListNA', checked as boolean);
                if (checked) {
                  onChange('vipList', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="vip-list-na" className="cursor-pointer text-sm">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Photos Requested</CardTitle>
          <CardDescription>Specific group combinations you'd like photographed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-photos-requested">Group Photo Combinations</Label>
            <Textarea
              id="group-photos-requested"
              data-testid="input-group-photos-requested"
              placeholder="Examples: entire bridal party, family on each side, college friends, cousins, etc."
              value={groupPhotosRequested}
              onChange={(e) => onChange('groupPhotosRequested', e.target.value)}
              rows={4}
              disabled={groupPhotosRequestedNA || readOnly}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="group-photos-requested-na"
              data-testid="checkbox-group-photos-requested-na"
              checked={groupPhotosRequestedNA}
              onCheckedChange={(checked) => {
                onChange('groupPhotosRequestedNA', checked as boolean);
                if (checked) {
                  onChange('groupPhotosRequested', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="group-photos-requested-na" className="cursor-pointer text-sm">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photography Special Requests</CardTitle>
          <CardDescription>Any other photography details or preferences?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            data-testid="input-photography-special-requests"
            placeholder="Share any additional photography preferences, poses to avoid, timing concerns, or special requests..."
            value={photographySpecialRequests}
            onChange={(e) => onChange('photographySpecialRequests', e.target.value)}
            rows={3}
            disabled={photographySpecialRequestsNA || readOnly}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="photography-special-requests-na"
              data-testid="checkbox-photography-special-requests-na"
              checked={photographySpecialRequestsNA}
              onCheckedChange={(checked) => {
                onChange('photographySpecialRequestsNA', checked as boolean);
                if (checked) {
                  onChange('photographySpecialRequests', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="photography-special-requests-na" className="cursor-pointer text-sm">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photography Planning Status</CardTitle>
          <CardDescription>Let us know if you're ready to move forward or need more time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="photography-all-done"
              data-testid="checkbox-photography-all-done"
              checked={photographyCompletionStatus === 'all-done'}
              onCheckedChange={() => handleCompletionStatusChange('all-done')}
              disabled={readOnly || !allRequiredFieldsFilled}
            />
            <Label htmlFor="photography-all-done" className={`cursor-pointer font-medium ${!allRequiredFieldsFilled ? 'opacity-50' : ''}`}>
              All done (for now)
            </Label>
          </div>
          
          {!allRequiredFieldsFilled && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="photography-finish-later"
                data-testid="checkbox-photography-finish-later"
                checked={photographyCompletionStatus === 'finish-later'}
                onCheckedChange={() => handleCompletionStatusChange('finish-later')}
                disabled={readOnly}
              />
              <Label htmlFor="photography-finish-later" className="cursor-pointer font-medium">
                We'll finish this later
              </Label>
            </div>
          )}

          {!photographyCompletionStatus && (
            <div className="flex gap-2 items-start bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Required for payment:</strong> Please check one of the completion status boxes above before proceeding.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
