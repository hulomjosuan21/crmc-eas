# DataTable Optimized Usage Guide

To prevent performance issues (like infinite re-render loops or sluggish sorting), you must follow these rules when implementing the `DataTable`.

## 1. The Golden Rules

- **Memoize Columns:** Never define `columns = [...]` directly inside the component body without `useMemo`. This creates a new array reference on every render, forcing the table to reset.
- **Stable Injectables:** If your component renders frequently, use `useCallback` for the `toolbar` and `pagination` functions.
- **Controlled State:** When you need to read the state (e.g., for URL sync or server-side pagination), pass the state down from the parent.

## 2. Implementation Example

```tsx
import { useMemo, useCallback, useState } from "react";
import { DataTable } from "@/components/data-table"; // Adjust path
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { DataTablePagination } from "@/components/data-table/pagination";
import { ColumnDef, Table } from "@tanstack/react-table"; // Import Table type
import { User } from "@/types"; // Your type definition

export default function UserPage() {
  // Assume data comes from a hook
  const { data, isLoading } = useGetUsers();

  // ✅ RULE #1: Memoize Columns
  // If this array is created fresh every render, the table will flicker/reset.
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
    ],
    [] // Dependencies (empty = created once)
  );

  // ✅ RULE #2: Stable Injectables
  // Prevents the table from receiving a "new" toolbar function every render.
  const renderToolbar = useCallback(
    (table: Table<User>) => (
      <DataTableToolbar table={table} searchKey="email" />
    ),
    []
  );

  const renderPagination = useCallback(
    (table: Table<User>) => <DataTablePagination table={table} />,
    []
  );

  return (
    <div className="container py-10">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        // Inject the memoized components
        toolbar={renderToolbar}
        pagination={renderPagination}
      />
    </div>
  );
}
```
