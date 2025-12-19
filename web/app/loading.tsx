import { Progress } from "@/components/ui/progress";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <Progress value={undefined} className="h-2 w-full animate-pulse" />

        <div className="flex w-full justify-between text-xs text-muted-foreground">
          <span className="animate-pulse">Fetching Dashboard Data...</span>
        </div>
      </div>
    </div>
  );
}
