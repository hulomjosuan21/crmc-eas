"use client";

import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <section className="h-[calc(100vh-53px)] grid place-content-center">
      <Spinner />
    </section>
  );
}
