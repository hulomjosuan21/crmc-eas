"use client";

import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/kibo-ui/image-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCroppedFile } from "@/lib/compress-image"; // Adjust path if needed
import Image from "next/image";
import { type ChangeEvent, useState, ComponentProps } from "react";

// Extend standard input props to allow passing id, className, etc.
type Props = {
  quality: 1.0 | 0.75 | 0.5 | 0.25;
  ratio?: number;
  onCropComplete: (file: File) => void;
  maxFileSize?: number;
} & Omit<ComponentProps<"input">, "type" | "onChange" | "value" | "accept">;
// We omit specific input props that we control internally

export const ImageCropper = ({
  quality,
  ratio,
  onCropComplete,
  maxFileSize = 1024 * 1024,
  className,
  ...inputProps // Captures id, placeholder, required, etc.
}: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCroppedImage(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
    setIsProcessing(false);
  };

  const handleCrop = async (dataUrl: string) => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setCroppedImage(dataUrl);

    try {
      const file = await generateCroppedFile(
        dataUrl,
        selectedFile.name,
        quality
      );
      onCropComplete(file);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // State 1: No file selected (Input View)
  if (!selectedFile) {
    return (
      <Input
        {...inputProps} // Pass id, placeholder, etc. here
        accept="image/*"
        type="file"
        onChange={handleFileChange}
        className={className || "w-fit max-w-full"}
      />
    );
  }

  // State 2: Crop Finished (Preview View)
  if (croppedImage) {
    return (
      <div className="space-y-4">
        <div className="relative border rounded-md overflow-hidden h-[150px] w-fit min-w-[150px]">
          <Image
            alt="Cropped Result"
            src={croppedImage}
            height={150}
            width={266} // approx 16:9 ratio for display
            className="object-contain h-full w-auto"
            unoptimized
          />
        </div>
        <Button
          onClick={handleReset}
          size="sm"
          type="button" // FIX: Prevents form submission
          variant="outline"
        >
          Change Image
        </Button>
      </div>
    );
  }

  // State 3: Cropping Interface
  return (
    <div className="space-y-4 border rounded-md p-4 bg-muted/20">
      <ImageCrop
        aspect={ratio}
        file={selectedFile}
        maxImageSize={maxFileSize}
        onCrop={handleCrop}
      >
        <ImageCropContent className="max-w-md bg-background rounded-md border" />

        <div className="flex items-center gap-2 mt-4">
          <ImageCropApply asChild>
            <Button
              size="sm"
              variant="default"
              disabled={isProcessing}
              type="button" // FIX: Prevents form submission
            >
              {isProcessing ? "Compressing..." : "Apply Crop"}
            </Button>
          </ImageCropApply>

          <ImageCropReset asChild>
            <Button
              size="sm"
              variant="secondary"
              type="button" // FIX: Prevents form submission
            >
              Reset
            </Button>
          </ImageCropReset>

          <Button
            onClick={handleReset}
            size="sm"
            type="button" // FIX: Prevents form submission
            variant="ghost"
          >
            Cancel
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
};
