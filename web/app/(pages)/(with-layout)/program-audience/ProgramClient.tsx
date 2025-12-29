"use client";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Program } from "@/types/program_types";
import { useAuth } from "@/hooks/useAuth";
import { ColumnDef, Table } from "@tanstack/react-table";
import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";
import { ProgramTableActions } from "./_components/program-action-cell";
import { ProgramDialog } from "./_components/program-dialog";
import { programService } from "@/services/program.service";
import { formatDateTime } from "@/lib/formatters";

export default function ProgramClient() {
  const { authDepartmentId } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleCreate = () => {
    setSelectedProgram(null);
    setIsDialogOpen(true);
  };

  const {
    data: programs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["department-programs", authDepartmentId],
    queryFn: async () => {
      return await programService.getMany(authDepartmentId!);
    },
    enabled: !!authDepartmentId,
    staleTime: 0,
    refetchOnMount: true,
  });

  const handleRefetch = () => {
    toast.promise(refetch(), {
      loading: "Refreshing programs...",
      success: "Programs refreshed!",
      error: "Failed to refresh programs.",
    });
  };

  const columns = useMemo<ColumnDef<Program>[]>(
    () => [
      {
        accessorKey: "programName",
        header: "Program Name",
      },
      {
        accessorKey: "programCode",
        header: "Program Code",
      },
      {
        accessorKey: "programCreatedAt",
        header: "Created At",
        cell: ({ getValue }) => {
          const rawValue = getValue<string>();
          return formatDateTime(rawValue);
        },
      },
      {
        accessorKey: "programUpdatedAt",
        header: "Updated At",
        cell: ({ getValue }) => {
          const rawValue = getValue<string>();
          return formatDateTime(rawValue);
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <ProgramTableActions
            program={row.original}
            refresh={refetch}
            onEdit={(p) => {
              setSelectedProgram(p);
              setIsDialogOpen(true);
            }}
          />
        ),
      },
    ],
    []
  );

  const renderToolbar = useCallback(
    (table: Table<Program>) => (
      <DataTableToolbar
        table={table}
        searchKey="programName"
        searchLabel="Program name"
        rightActions={
          <>
            <Button size={"sm"} onClick={handleCreate}>
              Add New Program
            </Button>
          </>
        }
      />
    ),
    []
  );

  const renderPagination = useCallback(
    (table: Table<Program>) => (
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

  return (
    <section className="px-4">
      <ProgramDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        program={selectedProgram}
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
