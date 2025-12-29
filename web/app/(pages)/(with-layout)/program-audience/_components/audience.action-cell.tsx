import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Audience } from "@/types/audienceTypes";
import { useMutation } from "@tanstack/react-query";
import { audienceService } from "@/services/audience.service";
import { ApiResponse } from "@/lib/response";
import { toast } from "sonner";
import { getError } from "@/lib/error";
import { Spinner } from "@/components/ui/spinner";

export function AudienceTableActions({
  audience,
  onEdit,
  refresh,
}: {
  audience: Audience;
  onEdit: (a: Audience) => void;
  refresh: () => Promise<any>;
}) {
  const deleteMutation = useMutation({
    mutationFn: (programId: string) => audienceService.deleteOne(programId),
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
          <Button variant="ghost" size={"icon"} className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(audience)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            disabled={deleteMutation.isPending}
            onSelect={(e) => {
              e.preventDefault();
              deleteMutation.mutate(audience.audienceId);
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
