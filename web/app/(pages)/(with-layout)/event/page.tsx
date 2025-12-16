import { Metadata } from "next";
import EventClient from "./EventClient";

export const metadata: Metadata = {
  title: "Events",
  description: "Manage users, reports, and analytics",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page() {
  return <EventClient />;
}
