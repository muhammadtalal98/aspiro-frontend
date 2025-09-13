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
import { ChevronDown, Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { NeuroButton } from "@/components/ui/neuro-button"
import { LoadingSpinner } from "@/components/loading-spinner"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  isLoading?: boolean
  onRefresh?: () => void
  filterComponent?: React.ReactNode
  toolbar?: React.ReactNode
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  isLoading = false,
  onRefresh,
  filterComponent,
  toolbar,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      ...(pagination && {
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    },
    ...(pagination && {
      manualPagination: true,
      pageCount: pagination.pageCount,
    }),
  })

  const handleSearch = (value: string) => {
    setGlobalFilter(value)
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value)
    }
  }

  const getPageNumbers = () => {
    if (!pagination) return []
    
    const { pageIndex, pageCount } = pagination
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(0, pageIndex - delta); i <= Math.min(pageCount - 1, pageIndex + delta); i++) {
      range.push(i)
    }

    if (range[0] > 1) {
      rangeWithDots.push(0, '...')
    } else if (range[0] === 1) {
      rangeWithDots.push(0)
    }

    rangeWithDots.push(...range)

    if (range[range.length - 1] < pageCount - 2) {
      rangeWithDots.push('...', pageCount - 1)
    } else if (range[range.length - 1] === pageCount - 2) {
      rangeWithDots.push(pageCount - 1)
    }

    return rangeWithDots
  }

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:space-x-2">
          {/* Global Search */}
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => handleSearch(event.target.value)}
              className="pl-10 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 focus:border-cyan-400/60 text-white placeholder-cyan-300/50 text-sm"
            />
          </div>
          
          {/* Custom Filter Component */}
          {filterComponent}
          
          {/* Refresh Button */}
          {onRefresh && (
            <NeuroButton
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10"
            >
              <Filter className="h-4 w-4" />
            </NeuroButton>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <NeuroButton
                variant="outline"
                size="sm"
                className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </NeuroButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-white hover:bg-cyan-400/10"
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
          
          {/* Custom Toolbar */}
          {toolbar}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <Table className="min-w-[600px] sm:min-w-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-cyan-400/20 hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white font-medium text-sm">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <LoadingSpinner text="Loading..." />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white text-sm">
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
                  className="h-24 text-center text-cyan-300"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-2 text-sm text-cyan-300">
          {pagination ? (
            <p>
              Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} entries
            </p>
          ) : (
            <p>
              {table.getFilteredRowModel().rows.length} of{" "}
              {table.getCoreRowModel().rows.length} row(s) selected.
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Page Size Selector */}
          {pagination && (
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-cyan-300">Rows per page</p>
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                className="px-3 py-1 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm text-white focus:outline-none focus:border-cyan-400/60"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            {pagination ? (
              <>
                <NeuroButton
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(0)}
                  disabled={pagination.pageIndex === 0}
                  className="border-cyan-400/30 text-cyan-100 disabled:opacity-50"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </NeuroButton>
                <NeuroButton
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                  disabled={pagination.pageIndex === 0}
                  className="border-cyan-400/30 text-cyan-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </NeuroButton>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-2 py-1 text-cyan-300">...</span>
                      ) : (
                        <NeuroButton
                          variant={pagination.pageIndex === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => pagination.onPageChange(Number(page))}
                          className={
                            pagination.pageIndex === page
                              ? "bg-cyan-400/20 border-cyan-400/30 text-cyan-100"
                              : "border-cyan-400/30 text-cyan-100"
                          }
                        >
                          {Number(page) + 1}
                        </NeuroButton>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <NeuroButton
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                  disabled={pagination.pageIndex >= pagination.pageCount - 1}
                  className="border-cyan-400/30 text-cyan-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </NeuroButton>
                <NeuroButton
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.pageCount - 1)}
                  disabled={pagination.pageIndex >= pagination.pageCount - 1}
                  className="border-cyan-400/30 text-cyan-100 disabled:opacity-50"
                >
                  <ChevronsRight className="h-4 w-4" />
                </NeuroButton>
              </>
            ) : (
              <>
                <NeuroButton
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="border-cyan-400/30 text-cyan-100 disabled:opacity-50"
                >
                  Previous
                </NeuroButton>
                <NeuroButton
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="border-cyan-400/30 text-cyan-100 disabled:opacity-50"
                >
                  Next
                </NeuroButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
