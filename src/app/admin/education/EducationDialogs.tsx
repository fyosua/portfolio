"use client";

import React from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface MassDeleteButtonProps {
  selectedCount: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const MassDeleteButton: React.FC<MassDeleteButtonProps> = ({
  selectedCount,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 hover:scale-105 active:scale-95"
          disabled={isLoading}
        >
          <HiOutlineTrash className="h-4 w-4" />
          Delete Selected ({selectedCount})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800 border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Education Entries</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to delete {selectedCount} education entr{selectedCount === 1 ? 'y' : 'ies'}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : `Delete ${selectedCount} Entr${selectedCount === 1 ? 'y' : 'ies'}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};