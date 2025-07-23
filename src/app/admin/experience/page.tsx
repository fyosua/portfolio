'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlinePencil, HiPlus, HiOutlineTrash } from 'react-icons/hi';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from "@tanstack/react-table";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTable, SearchableField } from "@/components/ui/data-table";

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  summary: string;
  responsibilities: Array<{
    point: string;
    subPoints?: string[];
  }>;
  startDate: string;
  endDate: string | null;
}

const ExperienceAdminPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Function to format date range
  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short' 
    };
    
    const startFormatted = start.toLocaleDateString('en-US', formatOptions);
    const endFormatted = end ? end.toLocaleDateString('en-US', formatOptions) : 'Present';
    
    return `${startFormatted} - ${endFormatted}`;
  };

  // Fetch experiences from API
  const fetchExperiences = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to fetch experiences.');
      
      const data = await res.json();
      setExperiences(data['hydra:member'] || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Real delete function
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete experience.');
      
      // Refresh the list after deleting
      fetchExperiences();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Define searchable fields for experience data
  const searchableFields: SearchableField[] = [
    { key: "role" },
    { key: "company" },
    { key: "location" },
    { key: "startDate", isDate: true },
    { key: "endDate", isDate: true },
  ];

  // Define columns for the DataTable
  const columns: ColumnDef<Experience>[] = [
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("role")}</div>,
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("company")}</div>,
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
          >
            Period
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const experience = row.original;
        return <div>{formatDateRange(experience.startDate, experience.endDate)}</div>;
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.startDate);
        const dateB = new Date(rowB.original.startDate);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right font-semibold text-foreground">Actions</div>,
      cell: ({ row }) => {
        const experience = row.original;
        
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/admin/experience/edit/${experience.id}`} className="text-blue-500 hover:text-blue-700 p-2">
              <HiOutlinePencil className="w-5 h-5" />
            </Link>
            <DeleteExperienceButton id={experience.id} onDelete={handleDelete} />
          </div>
        );
      },
    },
  ];

  if (isLoading) return <p className="text-center text-muted-foreground">Loading experiences...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Experience</h1>
        <Link href="/admin/experience/new" className="btn-primary flex items-center gap-2">
          <HiPlus />
          Create New
        </Link>
      </div>
      
      <DataTable 
        columns={columns} 
        data={experiences}
        searchableFields={searchableFields}
        searchPlaceholder="Search by role, company, location, or date..."
        showColumnToggle={true}
        showPagination={true}
        showRowSelection={true}
        pageSizeOptions={[5, 10, 20, 50]}
        initialPageSize={10}
      />
    </div>
  );
};

function DeleteExperienceButton({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <HiOutlineTrash className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete experience with ID: {id}? This action cannot be undone.
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

export default ExperienceAdminPage;