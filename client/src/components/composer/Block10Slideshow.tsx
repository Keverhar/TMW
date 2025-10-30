import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Images, Upload, X, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { useState, useRef } from "react";

interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

interface Block10SlideshowProps {
  slideshowPhotos: string;
  slideshowPhotosNA: boolean;
  engagementPhotos: string;
  engagementPhotosNA: boolean;
  slideshowCompletionStatus: string;
  onChange: (field: string, value: string | boolean) => void;
  readOnly?: boolean;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp', '.gif'];
const MAX_SLIDESHOW_PHOTOS = 30;
const MAX_SLIDESHOW_TOTAL_SIZE = 1024 * 1024 * 1024; // 1GB
const MAX_ENGAGEMENT_PHOTOS = 5;
const MAX_ENGAGEMENT_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

export default function Block10Slideshow({
  slideshowPhotos,
  slideshowPhotosNA,
  engagementPhotos,
  engagementPhotosNA,
  slideshowCompletionStatus,
  onChange,
  readOnly = false
}: Block10SlideshowProps) {
  const slideshowInputRef = useRef<HTMLInputElement>(null);
  const engagementInputRef = useRef<HTMLInputElement>(null);

  // Parse photo metadata from JSON strings
  const slideshowPhotosList: FileMetadata[] = slideshowPhotos ? JSON.parse(slideshowPhotos) : [];
  const engagementPhotosList: FileMetadata[] = engagementPhotos ? JSON.parse(engagementPhotos) : [];

  // Calculate total size for slideshow photos
  const totalSlideshowSize = slideshowPhotosList.reduce((sum, file) => sum + file.size, 0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFileType = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return ALLOWED_FILE_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(fileExtension);
  };

  const handleSlideshowPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = [...slideshowPhotosList];
    
    let invalidFiles: string[] = [];
    let sizeExceeded = false;
    let runningTotalSize = totalSlideshowSize;

    for (const file of files) {
      // Check if we've reached max photos
      if (currentPhotos.length >= MAX_SLIDESHOW_PHOTOS) {
        break;
      }

      // Validate file type
      if (!validateFileType(file)) {
        invalidFiles.push(file.name);
        continue;
      }

      // Check total size with running total
      const newTotalSize = runningTotalSize + file.size;
      if (newTotalSize > MAX_SLIDESHOW_TOTAL_SIZE) {
        sizeExceeded = true;
        break;
      }

      currentPhotos.push({
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Increment running total for next iteration
      runningTotalSize += file.size;
    }

    if (invalidFiles.length > 0) {
      alert(`The following files have invalid types and were not added:\n${invalidFiles.join('\n')}\n\nAllowed types: JPEG, JPG, PNG, TIFF, BMP, GIF`);
    }

    if (sizeExceeded) {
      alert('Total size limit (1GB) reached. Some files were not added.');
    }

    onChange('slideshowPhotos', JSON.stringify(currentPhotos));
    if (e.target) e.target.value = '';
  };

  const handleEngagementPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = [...engagementPhotosList];
    
    let invalidFiles: string[] = [];
    let oversizedFiles: string[] = [];

    for (const file of files) {
      // Check if we've reached max photos
      if (currentPhotos.length >= MAX_ENGAGEMENT_PHOTOS) {
        break;
      }

      // Validate file type
      if (!validateFileType(file)) {
        invalidFiles.push(file.name);
        continue;
      }

      // Check individual file size
      if (file.size > MAX_ENGAGEMENT_PHOTO_SIZE) {
        oversizedFiles.push(file.name);
        continue;
      }

      currentPhotos.push({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }

    if (invalidFiles.length > 0) {
      alert(`The following files have invalid types and were not added:\n${invalidFiles.join('\n')}\n\nAllowed types: JPEG, JPG, PNG, TIFF, BMP, GIF`);
    }

    if (oversizedFiles.length > 0) {
      alert(`The following files exceed the 5MB size limit:\n${oversizedFiles.join('\n')}`);
    }

    onChange('engagementPhotos', JSON.stringify(currentPhotos));
    if (e.target) e.target.value = '';
  };

  const removeSlideshowPhoto = (index: number) => {
    const updated = slideshowPhotosList.filter((_, i) => i !== index);
    onChange('slideshowPhotos', JSON.stringify(updated));
  };

  const removeEngagementPhoto = (index: number) => {
    const updated = engagementPhotosList.filter((_, i) => i !== index);
    onChange('engagementPhotos', JSON.stringify(updated));
  };

  // Check if fields are filled
  const isSlideshowFilled = slideshowPhotosNA || slideshowPhotosList.length > 0;
  const isEngagementFilled = engagementPhotosNA || engagementPhotosList.length > 0;
  const allRequiredFieldsFilled = isSlideshowFilled && isEngagementFilled;
  const someFieldsEmpty = !allRequiredFieldsFilled;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Slideshow Options</h2>
        <p className="text-muted-foreground">
          Upload photos for your celebration slideshow and engagement photo display.
        </p>
      </div>

      {readOnly && (
        <div className="flex gap-3 items-start bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">Available with Full Wedding Package</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              This section is included in our Saturday, Friday/Sunday wedding packages. You can view all options but selections are not available for elopement and vow renewal packages.
            </p>
          </div>
        </div>
      )}

      {/* Slideshow Photos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            <CardTitle>Slideshow Photos</CardTitle>
          </div>
          <CardDescription>
            Upload photos for the slideshow during your reception (up to 30 photos, 1GB total)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="slideshow-photos">Select Photos</Label>
              <div className="text-sm text-muted-foreground">
                {slideshowPhotosList.length}/{MAX_SLIDESHOW_PHOTOS} photos • {formatFileSize(totalSlideshowSize)}/1GB
              </div>
            </div>
            
            <input
              ref={slideshowInputRef}
              type="file"
              id="slideshow-photos"
              data-testid="input-slideshow-photos"
              accept={ALLOWED_EXTENSIONS.join(',')}
              multiple
              onChange={handleSlideshowPhotosChange}
              disabled={slideshowPhotosNA}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => slideshowInputRef.current?.click()}
              disabled={readOnly || slideshowPhotosNA || slideshowPhotosList.length >= MAX_SLIDESHOW_PHOTOS}
              data-testid="button-upload-slideshow-photos"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {slideshowPhotosList.length >= MAX_SLIDESHOW_PHOTOS ? 'Maximum photos reached' : 'Upload Photos'}
            </Button>

            {slideshowPhotosList.length > 0 && !slideshowPhotosNA && (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {slideshowPhotosList.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                    <div className="flex-1 truncate">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-muted-foreground ml-2">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSlideshowPhoto(index)}
                      disabled={readOnly}
                      data-testid={`button-remove-slideshow-photo-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Allowed file types:</p>
              <p className="text-sm text-muted-foreground">JPEG/JPG, PNG, TIFF, BMP, GIF</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="slideshow-photos-na"
              data-testid="checkbox-slideshow-photos-na"
              checked={slideshowPhotosNA}
              disabled={readOnly}
              onCheckedChange={(checked) => {
                onChange('slideshowPhotosNA', checked as boolean);
                if (checked) {
                  onChange('slideshowPhotos', '[]');
                }
              }}
            />
            <Label htmlFor="slideshow-photos-na" className="text-sm font-normal cursor-pointer">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Photos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            <CardTitle>Engagement Photos</CardTitle>
          </div>
          <CardDescription>
            Upload engagement photos for display (up to 5 photos, 5MB each maximum)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="engagement-photos">Select Photos</Label>
              <div className="text-sm text-muted-foreground">
                {engagementPhotosList.length}/{MAX_ENGAGEMENT_PHOTOS} photos
              </div>
            </div>
            
            <input
              ref={engagementInputRef}
              type="file"
              id="engagement-photos"
              data-testid="input-engagement-photos"
              accept={ALLOWED_EXTENSIONS.join(',')}
              multiple
              onChange={handleEngagementPhotosChange}
              disabled={engagementPhotosNA}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => engagementInputRef.current?.click()}
              disabled={readOnly || engagementPhotosNA || engagementPhotosList.length >= MAX_ENGAGEMENT_PHOTOS}
              data-testid="button-upload-engagement-photos"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {engagementPhotosList.length >= MAX_ENGAGEMENT_PHOTOS ? 'Maximum photos reached' : 'Upload Photos'}
            </Button>

            {engagementPhotosList.length > 0 && !engagementPhotosNA && (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {engagementPhotosList.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                    <div className="flex-1 truncate">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-muted-foreground ml-2">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEngagementPhoto(index)}
                      disabled={readOnly}
                      data-testid={`button-remove-engagement-photo-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Allowed file types:</p>
              <p className="text-sm text-muted-foreground">JPEG/JPG, PNG, TIFF, BMP, GIF (5MB max each)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="engagement-photos-na"
              data-testid="checkbox-engagement-photos-na"
              checked={engagementPhotosNA}
              disabled={readOnly}
              onCheckedChange={(checked) => {
                onChange('engagementPhotosNA', checked as boolean);
                if (checked) {
                  onChange('engagementPhotos', '[]');
                }
              }}
            />
            <Label htmlFor="engagement-photos-na" className="text-sm font-normal cursor-pointer">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      {allRequiredFieldsFilled && (
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Great! Your slideshow planning is complete.</p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Please confirm your status to continue.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="slideshow-complete-done"
                      data-testid="checkbox-slideshow-complete-done"
                      checked={slideshowCompletionStatus === 'done'}
                      disabled={readOnly}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onChange('slideshowCompletionStatus', 'done');
                        } else {
                          onChange('slideshowCompletionStatus', '');
                        }
                      }}
                    />
                    <Label htmlFor="slideshow-complete-done" className="text-sm font-normal cursor-pointer">
                      All done (for now)
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="slideshow-complete-later"
                      data-testid="checkbox-slideshow-complete-later"
                      checked={slideshowCompletionStatus === 'later'}
                      disabled={readOnly}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onChange('slideshowCompletionStatus', 'later');
                        } else {
                          onChange('slideshowCompletionStatus', '');
                        }
                      }}
                    />
                    <Label htmlFor="slideshow-complete-later" className="text-sm font-normal cursor-pointer">
                      We'll finish this later
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {someFieldsEmpty && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">You're making progress!</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Some slideshow fields still need attention. Please confirm your status.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="slideshow-incomplete-later"
                    data-testid="checkbox-slideshow-incomplete-later"
                    checked={slideshowCompletionStatus === 'later'}
                    disabled={readOnly}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange('slideshowCompletionStatus', 'later');
                      } else {
                        onChange('slideshowCompletionStatus', '');
                      }
                    }}
                  />
                  <Label htmlFor="slideshow-incomplete-later" className="text-sm font-normal cursor-pointer">
                    We'll finish this later
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
