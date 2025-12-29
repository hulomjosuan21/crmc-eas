import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Program } from "@/types/program_types";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { programService } from "@/services/program.service";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/response";
import { getError } from "@/lib/error";
import { Spinner } from "@/components/ui/spinner";

export function ProgramTableActions({
  program,
  onEdit,
  refresh,
}: {
  program: Program;
  onEdit: (p: Program) => void;
  refresh: () => Promise<any>;
}) {
  const deleteMutation = useMutation({
    mutationFn: (programId: string) => programService.deleteOne(programId),
    onSuccess: async (response: ApiResponse) => {
      await refresh();
      toast.success(response.code, { description: response.detail });
    },
    onError: (err) => {
      const { title, description } = getError(err);
      toast.error(title, { description });
    },
  });

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={"icon"}
            className="h-8 w-8 p-0"
            disabled={deleteMutation.isPending}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => onEdit(program)}
            disabled={deleteMutation.isPending}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            disabled={deleteMutation.isPending}
            onSelect={(e) => {
              e.preventDefault();
              deleteMutation.mutate(program.programId);
            }}
          >
            {deleteMutation.isPending ? (
              <>
                <Spinner />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
