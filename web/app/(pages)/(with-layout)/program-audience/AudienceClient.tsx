"use client";
import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useProgramSelect } from "@/hooks/useProgramSelect";
import { audienceService } from "@/services/audience.service";
import { Audience } from "@/types/audienceTypes";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Table } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AudienceDialog } from "./_components/audience-action";
import { formatDateTime } from "@/lib/formatters";
import { AudienceTableActions } from "./_components/audience.action-cell";

export default function AudienceClient() {
  const { authDepartmentId } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null
  );
  const handleCreate = () => {
    setSelectedAudience(null);
    setIsDialogOpen(true);
  };

  const {
    data: programs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["department-programs-audience", authDepartmentId],
    queryFn: async () => {
      return await audienceService.getMany(authDepartmentId!);
    },
    enabled: !!authDepartmentId,
    staleTime: 0,
    refetchOnMount: true,
  });

  const columns = useMemo<ColumnDef<Audience>[]>(
    () => [
      {
        accessorKey: "audienceName",
        header: "Audience Name",
      },
      {
        accessorKey: "program",
        header: "Program",
        cell: ({ row }) => {
          const name = row.original.programName;
          const code = row.original.programCode;

          return (
            <span>
              {name} ({code})
            </span>
          );
        },
      },
      {
        accessorKey: "audienceCreatedAt",
        header: "Created At",
        cell: ({ getValue }) => {
          const rawValue = getValue<string>();
          return formatDateTime(rawValue);
        },
      },
      {
        accessorKey: "audienceUpdatedAt",
        header: "Updated At",
        cell: ({ getValue }) => {
          const rawValue = getValue<string>();
          return formatDateTime(rawValue);
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <AudienceTableActions
            audience={row.original}
            refresh={refetch}
            onEdit={(p) => {
              setSelectedAudience(p);
              setIsDialogOpen(true);
            }}
          />
        ),
      },
    ],
    []
  );

  const renderToolbar = useCallback(
    (table: Table<Audience>) => (
      <DataTableToolbar
        table={table}
        searchKey="audienceName"
        searchLabel="Audience name"
        rightActions={
          <>
            <Button size={"sm"} onClick={handleCreate}>
              Add New Audience
            </Button>
          </>
        }
      />
    ),
    []
  );

  const renderPagination = useCallback(
    (table: Table<Audience>) => (
      <DataTablePagination
        table={table}
        rightActions={
          <>
            <Button size={"sm"} onClick={handleRefetch} variant={"secondary"}>
              Refresh
            </Button>
          </>
        }
      />
    ),
    []
  );

  const handleRefetch = () => {
    toast.promise(refetch(), {
      loading: "Refreshing audiences...",
      success: "Audiences refreshed!",
      error: "Failed to refresh audiences.",
    });
  };
  return (
    <section className="px-4">
      <AudienceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        audience={selectedAudience}
        departmentId={authDepartmentId!}
        refresh={refetch}
      />
      <div className="overflow-auto">
        <DataTable
          columns={columns}
          data={programs ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          toolbar={renderToolbar}
          pagination={renderPagination}
        />
      </div>
    </section>
  );
}
