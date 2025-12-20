"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "Notification";
  const detail = searchParams.get("detail") || "Operation complete.";

  return (
    <Card className="w-full max-w-md text-center shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl capitalize">{status}</CardTitle>
        <CardDescription className="text-lg mt-2">{detail}</CardDescription>
      </CardHeader>

      <CardContent></CardContent>

      <CardFooter className="flex justify-center">
        <Button asChild size="lg" className="w-full">
          <Link href="/auth/signin">Go to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
