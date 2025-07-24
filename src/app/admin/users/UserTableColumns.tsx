import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { HiOutlineKey, HiOutlineTrash, HiOutlineMail, HiUserGroup } from 'react-icons/hi';
import { ArrowUpDown } from 'lucide-react';
import { DeleteUserButton } from './UserDialogs';

interface User {
  '@id': string;
  '@type': string;
  id: number;
  email: string;
}

export const createUserColumns = (
  onChangePassword: (user: User) => void,
  onDelete: (id: number) => void,
  currentUserEmail: string
): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
        >
          Email Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = user.email === currentUserEmail;
      
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <HiOutlineMail className="text-white text-sm" />
          </div>
          <div>
            <div className="font-medium text-white flex items-center gap-2">
              {user.email}
              {isCurrentUser && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  You
                </span>
              )}
            </div>
            <div className="text-gray-400 text-sm">Admin User</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="font-semibold text-foreground">Role</div>,
    cell: () => (
      <div className="flex items-center gap-2">
        <HiUserGroup className="h-4 w-4 text-blue-400" />
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
          Administrator
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold text-foreground">Status</div>,
    cell: () => (
      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
        Active
      </span>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-right font-semibold text-foreground">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = user.email === currentUserEmail;
      
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangePassword(user)}
            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            title="Change Password"
          >
            <HiOutlineKey className="h-4 w-4" />
          </Button>
          <DeleteUserButton 
            id={user.id} 
            onDelete={onDelete} 
            isCurrentUser={isCurrentUser}
            userEmail={user.email}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];