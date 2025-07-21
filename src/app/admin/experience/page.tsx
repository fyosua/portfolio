'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlinePencil, HiOutlineTrash, HiPlus } from 'react-icons/hi';

// Define the shape of your experience data
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

  useEffect(() => {
    const fetchExperiences = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/admin');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch experiences.');
        }

        const data = await res.json();
        setExperiences(data['hydra:member'] || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [router]);

  const handleEdit = (id: number) => {
    // We will implement this in the next step
    alert(`Edit experience with ID: ${id}`);
  };

  const handleDelete = async (id: number) => {
    // We will implement this in the next step
    if (confirm(`Are you sure you want to delete experience with ID: ${id}?`)) {
      alert(`Deleting experience with ID: ${id}`);
    }
  };
  
  const handleCreate = () => {
    // We will implement this in the next step
    alert('Navigate to create new experience form');
  };

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading experiences...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Experience</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <HiPlus />
          Create New
        </button>
      </div>
      
      <div className="bg-background rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Company</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map(exp => (
              <tr key={exp.id} className="border-b border-muted">
                <td className="p-4">{exp.role}</td>
                <td className="p-4">{exp.company}</td>
                <td className="p-4">{exp.date}</td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(exp.id)} className="text-blue-500 hover:text-blue-700 p-2">
                    <HiOutlinePencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700 p-2">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExperienceAdminPage;