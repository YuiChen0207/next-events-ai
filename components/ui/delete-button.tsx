"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: string;
  itemName: string;
  itemType: string;
  onDelete: (id: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
}

export function DeleteButton({
  id,
  itemName,
  itemType,
  onDelete,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await onDelete(id);

      if (result.success) {
        toast.success(result.message || `${itemType} deleted successfully!`);
        router.refresh();
      } else {
        toast.error(result.message || `Failed to delete ${itemType}`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="cursor-pointer"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
