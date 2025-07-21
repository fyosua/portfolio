'use client';

import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { useRouter, useParams } from 'next/navigation';
import ExperienceForm from '../../ExperienceForm';
import Link from 'next/link';

const EditExperiencePage = () => {
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // 2. Wrap the data fetching logic in useCallback
  const fetchExperience = useCallback(async () => {
    if (!id) return; // Guard clause remains
    
    setIsLoading(true); // Ensure loading is true at the start of fetch
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch experience data.');
      const data = await res.json();
      setInitialData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]); // The function depends only on the stable 'id'

  // 3. The useEffect hook now calls the stable function
  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    
    const token = localStorage.getItem('authToken');
    const payload = {
      ...data,
      responsibilities: data.responsibilities, // <-- FIXED: send as array
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update experience.');
      }
      
      router.push('/admin/experience');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading experience data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => router.push('/admin/experience')} className="text-primary hover:underline">
          &larr; Back to Experiences
        </button>
        <h1 className="text-3xl font-bold text-foreground mt-2">Edit Experience</h1>
      </div>
      {initialData && (
        <ExperienceForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default EditExperiencePage;