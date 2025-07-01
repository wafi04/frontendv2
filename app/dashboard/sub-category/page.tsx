"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, MoreHorizontal, Edit, Trash2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import DialogSubCategory from "./dialog";
import { useDeleteSubCategory, useGetSubCategoryPagination } from "./server";
import { getStatusBadge } from "@/components/custom/statusbadge";
import { TableSkeleton } from "@/components/custom/tableSkeleton";
import { SubCategory } from "@/types/subCategory";
import { DialogDelete } from "@/components/custom/dialogDelete";
import { useFilter } from "@/hooks/filterPagination";
import { Pagination } from "@/components/custom/paginationComponents";

export default function Page() {
  // Gunakan custom hook dengan unit name untuk Sub Categories
  const {
    search,
    status,
    currentPage,
    limit,
    setSearch,
    setStatus,
    setCurrentPage,
    setLimit,
    resetFilter,
    getAllFilters
  } = useFilter('subcategories'); // unit name untuk membedakan dengan halaman lain

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<{
    open: boolean;
    data: SubCategory | undefined;
  }>({
    open: false,
    data: undefined,
  });
  
  const [deletes, setDeleted] = useState<{
    open: boolean,
    id: number | undefined
  }>({
    open: false,
    id: undefined
  });

  const { mutate: deleted } = useDeleteSubCategory();

  // Gunakan filter dari store
  const { data, isLoading, error } = useGetSubCategoryPagination({
    limit,
    page: currentPage.toString(),
    status: status === "all" ? undefined : status,
    search: search || undefined,
  });

  console.log(data?.data.meta);

  const handleSearch = (value: string) => {
    setSearch(value); // Otomatis reset ke page 1
  };
  
  const handleDelete = () => {
    if (deletes.id) { 
      deleted(deletes.id);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value); // Otomatis reset ke page 1
  };

  const handleLimitChange = (value: string) => {
    setLimit(value); // Otomatis reset ke page 1
  };

  // Function untuk clear semua filter
  const handleClearFilters = () => {
    resetFilter();
  };

  // Check apakah ada filter aktif
  const hasActiveFilters = search !== "" || status !== "all";

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-1">
          <p className="text-red-500 font-medium">Error loading data</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderDashboard title="Sub Categories" desc="Manage All Sub Categories">
        <Button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </HeaderDashboard>

      {/* Filters */}
      <section className="flex items-center justify-between gap-4 mx-5 mt-10 flex-wrap">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sub categories..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <Select value={limit} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>
      </section>

      {/* Table */}
      <section className="border rounded-lg overflow-hidden m-5 p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton limit={limit} />
            ) : data?.data.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground"
                >
                  {hasActiveFilters ? (
                    <div className="space-y-2">
                      <p>No sub categories found with current filters.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    "No sub categories found."
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data?.data.data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.categoryId}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.isActive)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            setOpenEdit({ open: true, data: item })
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleted({
                            id: item.id,
                            open: true
                          })} 
                          className="cursor-pointer text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      {/* Pagination */}
      {data?.data.meta && (
        <section className="mx-5">
          <Pagination
            currentPage={data.data.meta.currentPage}
            totalPages={data.data.meta.totalPages}
            hasNextPage={data.data.meta.hasNextPage}
            hasPrevPage={data.data.meta.hasPrevPage}
            totalItems={data.data.meta.totalItems}
            itemsPerPage={data.data.meta.itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </section>
      )}

      {/* Create Dialog */}
      {openCreate && (
        <DialogSubCategory
          open={openCreate}
          setOpen={() => setOpenCreate(false)}
        />
      )}

      {/* Edit Dialog */}
      {openEdit.open && (
        <DialogSubCategory
          open={openEdit.open}
          setOpen={() => setOpenEdit({ open: false, data: undefined })}
          data={openEdit.data}
        />
      )}

      {/* Delete Dialog */}
      {deletes.open && (
        <DialogDelete
          open={deletes.open}
          onClose={() => setDeleted({ open: false, id: deletes.id })}
          title="Delete Sub Category"
          desc="Are you sure you want to delete this sub category? This action cannot be undone."
          onAction={handleDelete}
        />
      )}
    </>
  );
}