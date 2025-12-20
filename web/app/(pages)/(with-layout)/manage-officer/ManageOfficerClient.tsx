"use client";

import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";
import { OfficerManagementTableRow } from "@/types/officerTypes";
import { ColumnDef, Table } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import AddOfficerSheet from "./_components/AddOfficerSheet";

export default function ManageOfficerClient() {
  const columns = useMemo<ColumnDef<OfficerManagementTableRow>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Full name",
      },
      {
        accessorKey: "roleLabel",
        header: "Role",
      },
    ],
    []
  );

  const renderToolbar = useCallback(
    (table: Table<OfficerManagementTableRow>) => (
      <DataTableToolbar
        table={table}
        searchKey="fullName"
        searchLabel="Full name"
        rightActions={
          <>
            <AddOfficerSheet />
          </>
        }
      />
    ),
    []
  );

  const renderPagination = useCallback(
    (table: Table<OfficerManagementTableRow>) => (
      <DataTablePagination table={table} />
    ),
    []
  );

  return (
    <section className="p-4">
      <DataTable
        data={[]}
        columns={columns}
        toolbar={renderToolbar}
        pagination={renderPagination}
      />
    </section>
  );
}
