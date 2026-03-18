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
} from '@tanstack/react-table'
import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings2, Search } from 'lucide-react'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string          // which column to search by
    searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder = 'Search...',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        initialState: { pagination: { pageSize: 10 } },
    })

    return (
        <div className="flex flex-col gap-4">

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between gap-3">
                {searchKey && (
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                            onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                )}

                {/* Column visibility toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto gap-2">
                            <Settings2 className="size-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        {table
                            .getAllColumns()
                            .filter((col) => col.getCanHide())
                            .map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    className="capitalize"
                                    checked={col.getIsVisible()}
                                    onCheckedChange={(val) => col.toggleVisibility(!!val)}
                                >
                                    {col.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ── Table ── */}
            <div className="rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="bg-muted/50 hover:bg-muted/50">
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-xs uppercase tracking-wide">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="hover:bg-muted/30 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <span>{table.getFilteredSelectedRowModel().rows.length} of{' '}</span>
                    )}
                    {table.getFilteredRowModel().rows.length} row(s)
                </p>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline" size="icon"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="size-8"
                    >
                        <ChevronsLeft className="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="size-8"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    <span className="text-sm px-2">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>

                    <Button
                        variant="outline" size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="size-8"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="size-8"
                    >
                        <ChevronsRight className="size-4" />
                    </Button>
                </div>
            </div>

        </div>
    )
}