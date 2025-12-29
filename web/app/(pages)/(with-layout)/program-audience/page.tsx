import { Metadata } from "next";
import ProgramClient from "./ProgramClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudienceClient from "./AudienceClient";

export const metadata: Metadata = {
  title: "Program & Audience",
  description: "Developer: Josuan",
};
export default function Page() {
  return (
    <Tabs defaultValue="program" className="text-sm text-muted-foreground">
      <TabsList variant="line" className="px-4">
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="audience">Audience</TabsTrigger>
      </TabsList>
      <TabsContent value="program">
        <ProgramClient />
      </TabsContent>
      <TabsContent value="audience">
        <AudienceClient />
      </TabsContent>
    </Tabs>
  );
}
