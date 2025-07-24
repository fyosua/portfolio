import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HiOutlineTrash } from 'react-icons/hi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface User {
  '@id': string;
  '@type': string;
  id: number;
  email: string;
}

interface DeleteUserButtonProps {
  id: number;
  onDelete: (id: number) => void;
  isCurrentUser: boolean;
  userEmail: string;
}

export function DeleteUserButton({ id, onDelete, isCurrentUser, userEmail }: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);

  if (isCurrentUser) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-gray-400 cursor-not-allowed opacity-50"
        disabled
        title="You cannot delete your own account"
      >
        <HiOutlineTrash className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
          <HiOutlineTrash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the user account for <strong>{userEmail}</strong>? 
            This action cannot be undone and will permanently remove all access for this user.
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
              Delete User
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
  currentUserEmail: string;
  selectedUsers: User[];
}

export function MassDeleteButton({ selectedCount, onDelete, isLoading, currentUserEmail, selectedUsers }: MassDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  
  const containsCurrentUser = selectedUsers.some(user => user.email === currentUserEmail);

  if (containsCurrentUser) {
    return (
      <Button 
        variant="destructive" 
        className="flex items-center gap-2 opacity-50 cursor-not-allowed"
        disabled
        title="Selection contains your own account"
      >
        <HiOutlineTrash className="h-4 w-4" />
        Cannot Delete
      </Button>
    );
  }

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
          <AlertDialogTitle>Delete {selectedCount} User Account(s)?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedCount} selected user account(s)? 
            This action cannot be undone and will permanently remove all access for these users.
            <div className="mt-2 p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">
              {selectedUsers.map(user => (
                <div key={user.id} className="text-sm text-gray-700">{user.email}</div>
              ))}
            </div>
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
              {isLoading ? 'Deleting...' : `Delete ${selectedCount} User(s)`}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}