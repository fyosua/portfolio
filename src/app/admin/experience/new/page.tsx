'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ExperienceForm from '../ExperienceForm';

const NewExperiencePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    
    const token = localStorage.getItem('authToken');
    
    // The payload is now just the raw data from the form.
    // We are no longer using JSON.stringify() on the responsibilities.
    const payload = data;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences`, {
        method: 'POST',
        headers: {
          // Use the correct Content-Type for API Platform
          'Content-Type': 'application/ld+json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        // Use the specific error from Hydra if available
        throw new Error(errorData['hydra:description'] || 'Failed to create experience.');
      }
      
      router.push('/admin/experience');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => router.push('/admin/experience')} className="text-primary hover:underline">
          &larr; Back to Experiences
        </button>
        <h1 className="text-3xl font-bold text-foreground mt-2">Add New Experience</h1>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ExperienceForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default NewExperiencePage;