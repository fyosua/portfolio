'use client';

import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useRouter } from 'next/navigation';
import { HiOutlinePencil, HiPlus, HiOutlineTrash } from 'react-icons/hi';
import Link from 'next/link';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Experience {
  id: number;
  role: string;
  company: string;
  date: string;
}

const ExperienceAdminPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Wrap the fetch function in useCallback so it's stable
  const fetchExperiences = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    try {
      setIsLoading(true); // Set loading true at the start of the fetch
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
  }, [router]); // Add router as a dependency

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]); // Now the dependency is the stable fetchExperiences function

  const handleDelete = async (id: number) => {
    if (window.confirm(`Are you sure you want to delete experience with ID: ${id}?`)) {
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
    }
  };

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
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-xl shadow-2xl transition-colors overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/60">
            <tr>
              <th className="p-4 font-semibold text-foreground">Role</th>
              <th className="p-4 font-semibold text-foreground">Company</th>
              <th className="p-4 font-semibold text-foreground">Date</th>
              <th className="p-4 font-semibold text-right text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map(exp => (
              <tr
                key={exp.id}
                className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
              >
                <td className="p-4">{exp.role}</td>
                <td className="p-4">{exp.company}</td>
                <td className="p-4">{exp.date}</td>
                <td className="p-4 flex justify-end gap-2">
                  <Link href={`/admin/experience/edit/${exp.id}`} className="text-blue-500 hover:text-blue-700 p-2">
                    <HiOutlinePencil className="w-5 h-5" />
                  </Link>
                  <DeleteExperienceButton id={exp.id} onDelete={handleDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function DeleteExperienceButton({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
          <HiOutlineTrash className="w-5 h-5 text-red-500" />
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