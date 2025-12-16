import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/layout/MainContent";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <PageWrapper>
      <Header
        pageTitle={"Dashboard"}
        RightSlot={
          <>
            <ModeToggle />
          </>
        }
      />

      <MainContent>
        <Button>Click</Button>
      </MainContent>
    </PageWrapper>
  );
}
