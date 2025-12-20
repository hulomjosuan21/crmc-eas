import { Metadata } from "next";
import EventCalendarClient from "./EventCalendarClient";

export const metadata: Metadata = {
  title: "Event Calendar",
  description: "Developer: Josuan",
};

export default function Page() {
  return <EventCalendarClient />;
}
