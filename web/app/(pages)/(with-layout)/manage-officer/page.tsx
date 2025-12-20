import { Metadata } from "next";
import ManageOfficerClient from "./ManageOfficerClient";

export const metadata: Metadata = {
  title: "Manage Officers",
  description: "Developer: Josuan",
};

export default function Page() {
  return <ManageOfficerClient />;
}
