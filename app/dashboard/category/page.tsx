"use client";
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useDeleteCategory, useGetCategoryPagination } from "./server/category";
import { DialogCategory } from "./dialog/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Image as ImageIcon,
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
import { useRouter } from "next/navigation";

export default function Page() {
  const { data, isLoading, error, refetch } = useGetCategoryPagination({
    limit: "10",
    page: "1",
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


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <Button onClick={() => setOpen(true)}>Create Category</Button>
      </HeaderDashboard>

      <div className="mt-10 p-3">
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
            {categories.map((category: CategoryData) => (
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
            ))}
          </TableBody>
        </Table>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        )}
      </div>

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