"use client";
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useDeleteCategory, useGetCategoryPagination } from "./server/category";
import { DialogCategory } from "./dialog/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
  Plus,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryData } from "@/types/category";
import { formatDate } from "@/utils/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader
} from "@/components/ui/dialog";

import { TableSkeleton } from "@/components/custom/tableSkeleton";
import { Pagination } from "@/components/custom/pagination";
import { useFilter } from "@/hooks/usefilter";

export default function Page() {
  // Gunakan custom hook dengan unit name untuk Categories
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
  } = useFilter('categories'); // unit name untuk categories

  // API call dengan filter dari store
  const { data, isLoading, error, refetch } = useGetCategoryPagination({
    limit,
    page: currentPage.toString(),
    search: search || undefined,
    status: status === "all" ? undefined : status,
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category?: CategoryData;
  }>({ open: false });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    category?: CategoryData;
  }>({ open: false });

  const handleSearch = (value: string) => {
    setSearch(value); // Otomatis reset ke page 1
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

  const handleEdit = (category: CategoryData) => {
    setEditDialog({ open: true, category });
  };

  const handleDelete = (category: CategoryData) => {
    setDeleteDialog({ open: true, category });
  };

  const confirmDelete = () => {
    if (deleteDialog.category?.id) {
      deleteCategory(deleteDialog.category.id);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading categories</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const categories = data?.data.data || [];

  return (
    <>
      <HeaderDashboard title="Categories" desc="Manage all categories">
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </HeaderDashboard>

      {/* Filters */}
      <section className="flex items-center justify-between gap-4 mx-5 mt-10 flex-wrap">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
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
      <div className="mt-6 p-3 border rounded-lg overflow-hidden mx-5">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">Image</TableHead>
              <TableHead className="min-w-[200px]">Name & Brand</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nickname Check</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton limit={limit} colSpan={8} />
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  {hasActiveFilters ? (
                    <div className="space-y-2">
                      <p>No categories found with current filters.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    "No categories found."
                  )}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: CategoryData) => (
                <TableRow key={category.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden border">
                      {category.thumbnail ? (
                        <img
                          src={category.thumbnail}
                          alt={category.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            const fallback = target.nextElementSibling as HTMLElement;
                            target.style.display = "none";
                            if (fallback) {
                              fallback.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}
                      <div className={`${category.thumbnail ? 'hidden' : ''} h-full w-full bg-muted flex items-center justify-center`}>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.brand}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <code className="px-2 py-1 bg-muted rounded-sm text-sm">
                      {category.code}
                    </code>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {category.type}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        category.status === "active" ? "default" : "secondary"
                      }
                      className={
                        category.status === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                    >
                      {category.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        category.isCheckNickname === "active"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        category.isCheckNickname === "active"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : ""
                      }
                    >
                      {category.isCheckNickname}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(category.createdAt)}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(category)}
                          className="text-destructive focus:text-destructive"
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
      </div>

      {/* Pagination */}
      {data?.data.meta && (
        <section className="mx-5 mt-4">
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
      <DialogCategory
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Edit Dialog */}
      <DialogCategory
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        category={editDialog.category}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{deleteDialog.category?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}