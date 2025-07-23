"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchableField {
  /** The key to access the value from row.getValue() */
  key: string
  /** Whether to format as date (will apply date formatting) */
  isDate?: boolean
  /** Custom formatter function for the field value */
  formatter?: (value: any) => string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Fields to search through - if not provided, will search all column accessors */
  searchableFields?: SearchableField[]
  /** Custom placeholder text for search input */
  searchPlaceholder?: string
  /** Custom global filter function - overrides default search */
  customGlobalFilter?: (row: any, columnId: string, value: string) => boolean
  /** Show/hide column visibility toggle */
  showColumnToggle?: boolean
  /** Show/hide pagination */
  showPagination?: boolean
  /** Show/hide row selection info */
  showRowSelection?: boolean
  /** Page size options for pagination */
  pageSizeOptions?: number[]
  /** Initial page size */
  initialPageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableFields,
  searchPlaceholder = "Search...",
  customGlobalFilter,
  showColumnToggle = true,
  showPagination = true,
  showRowSelection = true,
  pageSizeOptions = [3, 5, 10, 20, 30, 50, 100],
  initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  // Default search fields - extract from columns if not provided
  const defaultSearchFields = React.useMemo(() => {
    if (searchableFields) return searchableFields

    return columns
      .map(col => {
        const accessor = (col as any).accessorKey
        return accessor ? { key: accessor } : null
      })
      .filter(Boolean) as SearchableField[]
  }, [columns, searchableFields])

  // Default global filter function
  const defaultGlobalFilter = React.useCallback((row: any, columnId: string, value: string) => {
    const searchValue = String(value).toLowerCase().trim()
    if (!searchValue) return true

    return defaultSearchFields.some(field => {
      let fieldValue = ""

      try {
        if (field.isDate) {
          // Handle date fields
          const originalRow = row.original as any
          const dateValue = originalRow[field.key]

          if (dateValue) {
            // Raw date string search
            fieldValue += String(dateValue).toLowerCase() + " "

            // Formatted date search
            const date = new Date(dateValue)
            const formatted = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              month: 'short'
            }).toLowerCase()
            fieldValue += formatted
          }
        } else if (field.formatter) {
          // Custom formatter
          const rawValue = row.getValue(field.key) || (row.original as any)[field.key]
          fieldValue = field.formatter(rawValue).toLowerCase()
        } else {
          // Regular field
          fieldValue = String(row.getValue(field.key) || "").toLowerCase()
        }
      } catch (error) {
        // Fallback to original row data if row.getValue fails
        const originalRow = row.original as any
        fieldValue = String(originalRow[field.key] || "").toLowerCase()
      }

      return fieldValue.includes(searchValue)
    })
  }, [defaultSearchFields])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    globalFilterFn: customGlobalFilter || defaultGlobalFilter,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {showColumnToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize bg-background hover:bg-muted focus:bg-muted"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-xl shadow-2xl transition-colors overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/60">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-4 font-semibold text-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {(showPagination || showRowSelection) && (
        <div className="flex items-center justify-between space-x-2 py-4">
          {showRowSelection && (
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}

          {showPagination && (
            <div className="flex items-center space-x-6 lg:space-x-8">
              {/* Page size selector */}
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="bottom" className="bg-background border border-border shadow-lg">
                    {pageSizeOptions.map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`} className="bg-background hover:bg-muted">
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page info */}
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <div className="h-4 w-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                      />
                    </svg>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <div className="h-4 w-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <div className="h-4 w-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <div className="h-4 w-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Export types for reuse
export type { SearchableField, DataTableProps }