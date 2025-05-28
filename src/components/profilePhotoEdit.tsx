'use client';

import { updateProfileImage } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CropIcon, Edit, Trash2Icon, Loader } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Input } from './ui/input';

interface ProfilePhotoEditProps {
  imageUrl: string;
  displayName: string;
  sectionSlug: string;
}

interface FileWithPreview extends File {
  preview: string;
}

// Helper function to center the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function ProfilePhotoEdit({ imageUrl, displayName, sectionSlug }: ProfilePhotoEditProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const aspect = 1; // pfp aspect

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as FileWithPreview;
      setSelectedFile(fileWithPreview);
      setShowCropper(true);
    }
  }

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    // Start with high quality, but we'll compress if needed
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  function compressImageToLimit(dataUrl: string, maxSizeBytes: number = 800000): string {
    const base64Length = dataUrl.split(',')[1].length;
    const approximateBytes = (base64Length * 3) / 4;

    if (approximateBytes <= maxSizeBytes) {
      return dataUrl;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
    };

    img.src = dataUrl;

    for (let quality = 0.8; quality > 0.1; quality -= 0.1) {
      const compressed = canvas.toDataURL('image/jpeg', quality);
      const compressedBytes = (compressed.split(',')[1].length * 3) / 4;

      if (compressedBytes <= maxSizeBytes) {
        return compressed;
      }
    }

    const maxDimension = 400; // Max width/height for profile photos
    const ratio = Math.min(maxDimension / img.width, maxDimension / img.height);

    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7);
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedUrl = getCroppedImg(imgRef.current, crop);
      const compressedUrl = compressImageToLimit(croppedUrl);
      setCroppedImageUrl(compressedUrl);
    }
  }

  async function handleCrop() {
    setIsLoading(true);
    try {
      // Double-check size before sending
      const finalCompressed = compressImageToLimit(croppedImageUrl);
      setFinalImageUrl(finalCompressed);

      console.log(
        'Cropped image size (approx):',
        Math.round((finalCompressed.split(',')[1].length * 3) / 4 / 1024),
        'KB',
      );
      await updateProfileImage(sectionSlug, finalCompressed);

      setShowCropper(false);
      setDialogOpen(false);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error('Failed to update profile photo');
      console.error('Error updating profile image:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setSelectedFile(null);
    setShowCropper(false);
    setCroppedImageUrl('');
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="relative h-fit w-fit cursor-pointer">
        <Avatar className="border-background h-24 w-24 translate-y-12 border-6 shadow-sm">
          <AvatarImage src={finalImageUrl || imageUrl} alt={displayName} />
          <AvatarFallback className="text-2xl">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-11 rounded-full border p-1.5 shadow-sm">
          <Edit size={24} />
        </div>
      </DialogTrigger>
      <DialogContent className={showCropper ? 'max-w-2xl gap-0 p-0' : ''}>
        <DialogHeader>
          <DialogTitle className={showCropper ? 'hidden' : ''}>Edit Profile Photo</DialogTitle>
        </DialogHeader>
        {!showCropper ? (
          <div className="grid gap-4">
            <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
            <Button onClick={() => document.getElementById('picture')?.click()} variant="outline">
              Choose Image
            </Button>
            <p className="text-muted-foreground text-sm">Maximum file size: 5MB</p>
          </div>
        ) : (
          <>
            <div className="w-full p-6">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => onCropComplete(c)}
                aspect={aspect}
                className="w-full max-w-full"
              >
                <img
                  ref={imgRef}
                  className="h-auto max-w-full"
                  alt="Image Cropper"
                  src={selectedFile?.preview}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
            <DialogFooter className="justify-center p-6 pt-0">
              <Button
                size="sm"
                type="reset"
                className="w-fit"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <Trash2Icon className="mr-1.5 size-4" />
                Cancel
              </Button>
              <Button type="submit" size="sm" className="w-fit" onClick={handleCrop} disabled={isLoading}>
                {isLoading ? (
                  <Loader className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <CropIcon className="mr-1.5 size-4" />
                )}
                {isLoading ? 'Saving...' : 'Save Photo'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
