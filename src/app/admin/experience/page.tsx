'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlinePencil, HiPlus, HiOutlineTrash, HiOutlineCheck, HiOutlineBriefcase, HiOutlineGlobeAlt, HiOutlineX } from 'react-icons/hi';
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

interface ExperiencesResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': Experience[];
}

const ExperienceAdminPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Experience[]>([]);
  const [isMassActionLoading, setIsMassActionLoading] = useState(false);
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

  // Calculate duration in months
  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      if (remainingMonths === 0) {
        return `${years} year${years !== 1 ? 's' : ''}`;
      } else {
        return `${years}y ${remainingMonths}m`;
      }
    }
  };

  // API Service
  const experienceService = {
    async fetchExperiences(): Promise<Experience[]> {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/admin');
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/ld+json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExperiencesResponse = await response.json();
      return data['hydra:member'] || [];
    },

    async deleteExperience(id: number): Promise<void> {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }
    },

    async massDeleteExperiences(experiences: Experience[]): Promise<void> {
      const deletePromises = experiences.map(exp => this.deleteExperience(exp.id));
      await Promise.all(deletePromises);
    }
  };

  // Fetch experiences from API
  const fetchExperiences = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await experienceService.fetchExperiences();
      setExperiences(data);
    } catch (err: any) {
      console.error('Error fetching experiences:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Handle individual delete
  const handleDelete = async (id: number) => {
    try {
      await experienceService.deleteExperience(id);
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    } catch (err: any) {
      console.error('Error deleting experience:', err);
      setError('Failed to delete experience');
    }
  };

  // Handle mass delete
  const handleMassDelete = async () => {
    if (selectedRows.length === 0) return;
    
    setIsMassActionLoading(true);
    try {
      await experienceService.massDeleteExperiences(selectedRows);
      const deletedIds = selectedRows.map(exp => exp.id);
      setExperiences(prev => prev.filter(exp => !deletedIds.includes(exp.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting experiences:', error);
      setError('Failed to delete some experiences');
    } finally {
      setIsMassActionLoading(false);
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
      cell: ({ row }) => (
        <div className="font-medium text-white">
          {row.getValue("role")}
        </div>
      ),
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
      cell: ({ row }) => (
        <div className="text-white">
          {row.getValue("company")}
        </div>
      ),
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
      cell: ({ row }) => (
        <div className="text-white">
          {row.getValue("location")}
        </div>
      ),
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
        return (
          <div className="text-white">
            <div>{formatDateRange(experience.startDate, experience.endDate)}</div>
            <div className="text-xs text-gray-400">
              {calculateDuration(experience.startDate, experience.endDate)}
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.startDate);
        const dateB = new Date(rowB.original.startDate);
        return dateB.getTime() - dateA.getTime(); // Latest first
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right font-semibold text-foreground">Actions</div>,
      cell: ({ row }) => {
        const experience = row.original;
        
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/admin/experience/edit/${experience.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              >
                <HiOutlinePencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteExperienceButton id={experience.id} onDelete={handleDelete} />
          </div>
        );
      },
      enableHiding: false,
    },
  ];

  // Calculate stats
  const currentExperiences = experiences.filter(exp => !exp.endDate);
  const pastExperiences = experiences.filter(exp => exp.endDate);
  const totalMonths = experiences.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + months;
  }, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-title mb-2">Experience Management</h1>
            <p className="text-gray-400">Manage your professional experience and career history</p>
          </div>
          <Link href="/admin/experience/new">
            <Button className="btn-primary flex items-center gap-2">
              <HiPlus />
              Add Experience
            </Button>
          </Link>
        </div>
        <div className="border-t border-gray-700 mt-4"></div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-4">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Experience</p>
                <p className="text-2xl font-bold text-white">{experiences.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <HiOutlineBriefcase className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Roles</p>
                <p className="text-2xl font-bold text-white">{currentExperiences.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <HiOutlineCheck className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Past Roles</p>
                <p className="text-2xl font-bold text-white">{pastExperiences.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <HiOutlineGlobeAlt className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Experience</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(totalMonths / 12)}y
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <HiOutlineBriefcase className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mass Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="admin-card">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">
                  {selectedRows.length} experience(s) selected
                </span>
                <div className="flex gap-2">
                  <MassDeleteButton 
                    selectedCount={selectedRows.length}
                    onDelete={handleMassDelete}
                    isLoading={isMassActionLoading}
                  />
                </div>
              </div>
              <Button
                onClick={() => setSelectedRows([])}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <HiOutlineX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-subtitle mb-0">Your Experience</h2>
            <p className="text-gray-400 text-sm">{experiences.length} experience(s) total</p>
          </div>
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
          onRowSelectionChange={setSelectedRows}
        />
      </div>
    </div>
  );
};

// Mass Delete Component
function MassDeleteButton({ selectedCount, onDelete, isLoading }: { 
  selectedCount: number; 
  onDelete: () => void; 
  isLoading: boolean; 
}) {
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
          <AlertDialogTitle>Delete {selectedCount} Experience(s)?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedCount} selected experience(s)? This action cannot be undone.
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
              {isLoading ? 'Deleting...' : `Delete ${selectedCount} Experience(s)`}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteExperienceButton({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
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
          <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this experience? This action cannot be undone.
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