import { useState, useCallback } from "react";

export function useImageCropper() {
  const [file, setFile] = useState<File | null>(null);

  const onCropComplete = useCallback((croppedFile: File) => {
    setFile(croppedFile);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
  }, []);

  return {
    file,
    onCropComplete, // Pass this directly to the ImageCropper component
    reset, // Call this if you need to manually clear the file
    isReady: !!file, // Boolean helper to check if file exists
  };
}
