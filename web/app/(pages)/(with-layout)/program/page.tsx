import { Metadata } from "next";
import ProgramClient from "./ProgramClient";
export const metadata: Metadata = {
  title: "Program",
  description: "Developer: Josuan",
};
export default function Page() {
  return <ProgramClient />;
}
