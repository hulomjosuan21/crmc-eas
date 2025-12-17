"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const loadingMessages = [
  "Initializing Dashboard...",
  "Verifying Permissions...",
  "Fetching Real-time Event Analytics...",
  "Preparing Panel...",
];

export default function AdminLoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const stepValue = 100 / loadingMessages.length;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress + stepValue >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + stepValue;
      });

      setMessageIndex((prevIndex) => {
        if (prevIndex >= loadingMessages.length - 1) {
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        router.push("/dashboard");
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <Progress value={progress} className="h-2 w-full" />
        <div className="flex w-full justify-between text-xs text-muted-foreground">
          <span className="animate-pulse">{loadingMessages[messageIndex]}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
