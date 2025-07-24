import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineMail, HiOutlinePhone, HiOutlineGlobeAlt } from 'react-icons/hi';
import { ArrowUpDown } from 'lucide-react';
import { DeleteProfileButton } from './ProfileDialogs';

interface Profile {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
}

interface PersonalInfo {
  '@id': string;
  '@type': string;
  id: number;
  dob: string;
  nationality: string;
}

interface CombinedProfile extends Profile {
  personalInfo?: PersonalInfo;
}

export const createProfileColumns = (
  onEdit: (profile: CombinedProfile) => void,
  onDelete: (id: number) => void
): ColumnDef<CombinedProfile>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium text-white">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-white max-w-xs truncate">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
        >
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white">
            <HiOutlineMail className="h-3 w-3 text-gray-400" />
            <span className="text-sm">{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="flex items-center gap-2 text-white">
              <HiOutlinePhone className="h-3 w-3 text-gray-400" />
              <span className="text-sm">{profile.phone}</span>
            </div>
          )}
          {profile.linkedin && (
            <div className="flex items-center gap-2 text-white">
              <HiOutlineGlobeAlt className="h-3 w-3 text-gray-400" />
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                LinkedIn
              </a>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "personalInfo",
    header: () => <div className="font-semibold text-foreground">Personal Info</div>,
    cell: ({ row }) => {
      const profile = row.original;
      const personalInfo = profile.personalInfo;
      
      if (!personalInfo) {
        return <div className="text-gray-400 text-sm">No personal info</div>;
      }

      return (
        <div className="space-y-1">
          {personalInfo.dob && (
            <div className="text-white text-sm">
              <span className="text-gray-400">DOB:</span> {personalInfo.dob}
            </div>
          )}
          {personalInfo.nationality && (
            <div className="text-white text-sm">
              <span className="text-gray-400">Nationality:</span> {personalInfo.nationality}
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-right font-semibold text-foreground">Actions</div>,
    cell: ({ row }) => {
      const profile = row.original;
      
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(profile)}
            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
          >
            <HiOutlinePencil className="h-4 w-4" />
          </Button>
          <DeleteProfileButton id={profile.id} onDelete={onDelete} />
        </div>
      );
    },
    enableHiding: false,
  },
];