import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { programService } from "@/services/program.service";

export function useProgramSelect(departmentId: string | null) {
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>();

  const query = useQuery({
    queryKey: ["program-select-options", departmentId],
    queryFn: async () => {
      return await programService.getSelectOptions(departmentId!);
    },
    enabled: !!departmentId && departmentId !== "null",
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    programs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    selectedProgram,
    setSelectedProgram,
  };
}
