import { Metadata } from "next";
import AddEventClient from "./AddEventClient";
export const metadata: Metadata = {
  title: "Add Event",
  description: "Developer: Josuan",
};
export default function Page() {
  return <AddEventClient />;
}
