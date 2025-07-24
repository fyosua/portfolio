// Create: src/components/admin/languages/LanguageDialogs.tsx
import React, { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface DeleteLanguageButtonProps {
  id: number;
  onDelete: (id: number) => void;
}

export function DeleteLanguageButton({ id, onDelete }: DeleteLanguageButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
          <HiOutlineTrash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Language?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this language? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(id);
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface MassDeleteButtonProps {
  selectedCount: number;
  onDelete: () => void;
  isLoading: boolean;
}

export function MassDeleteButton({ selectedCount, onDelete, isLoading }: MassDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <HiOutlineTrash className="h-4 w-4" />
          Delete Selected
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedCount} Language(s)?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedCount} selected language(s)? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : `Delete ${selectedCount} Language(s)`}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}