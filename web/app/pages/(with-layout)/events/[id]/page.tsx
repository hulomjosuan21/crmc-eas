import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/layout/MainContent";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <PageWrapper>
      <Header
        pageTitle={`Event id: #${id}`}
        RightSlot={
          <>
            <ModeToggle />
          </>
        }
      />

      <MainContent>
        <Button>Click me!</Button>
      </MainContent>
    </PageWrapper>
  );
}
