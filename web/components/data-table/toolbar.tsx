"use client";

import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey: string;
  searchLabel: string;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchLabel,
  leftActions,
  rightActions,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4 gap-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder={`Filter by ${searchLabel}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {leftActions}
      </div>

      <div className="flex items-center gap-2">
        {rightActions}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
