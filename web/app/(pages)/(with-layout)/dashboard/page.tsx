"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <section>
      <Button onClick={() => router.push("/add-event")}>Add Event</Button>
    </section>
  );
}
