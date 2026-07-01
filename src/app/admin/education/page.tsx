'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlinePencil, HiPlus, HiOutlineTrash, HiOutlineCheck, HiOutlineAcademicCap, HiOutlineX } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { DataTable, SearchableField } from '@/components/ui/data-table';
import { createEducationColumns } from './EducationTableColumns';
import { MassDeleteButton } from './EducationDialogs';
import { EducationForm } from './EducationForms';
import { withCacheClearing } from '@/lib/cache-service';

// Types
interface Education {
  '@id': string;
  '@type': string;
  id: number;
  degree: string;
  university: string;
  period: string;
  details: string[];
}

interface EducationResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': Education[];
}

// API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/ld+json',
  };
};

const getAuthHeadersWithContent = () => ({
  ...getAuthHeaders(),
  'Content-Type': 'application/ld+json',
});

const getAuthHeadersWithMergePatch = () => ({
  ...getAuthHeaders(),
  'Content-Type': 'application/merge-patch+json',
});

const educationService = {
  async fetchEducation(): Promise<Education[]> {
    const response = await fetch(`${API_BASE_URL}/api/education`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EducationResponse = await response.json();
    return data['hydra:member'] || [];
  },

  async createEducation(educationData: Omit<Education, 'id' | '@id' | '@type'>): Promise<Education> {
    const response = await fetch(`${API_BASE_URL}/api/education`, {
      method: 'POST',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify(educationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create education');
    }

    return response.json();
  },

  async updateEducation(id: number, educationData: Partial<Education>): Promise<Education> {
    const response = await fetch(`${API_BASE_URL}/api/education/${id}`, {
      method: 'PATCH',
      headers: getAuthHeadersWithMergePatch(),
      body: JSON.stringify(educationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update education');
    }

    return response.json();
  },

  async deleteEducation(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/education/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete education');
    }
  },

  async massDeleteEducation(educationEntries: Education[]): Promise<void> {
    const deletePromises = educationEntries.map(education => this.deleteEducation(education.id));
    await Promise.all(deletePromises);
  }
};

export default function EducationAdminPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [educationData, setEducationData] = useState({
    degree: '',
    university: '',
    period: '',
    details: [''],
  });
  const [isSaving, setIsSaving] = useState(false);

  // Mass action states
  const [selectedRows, setSelectedRows] = useState<Education[]>([]);
  const [isMassActionLoading, setIsMassActionLoading] = useState(false);

  const router = useRouter();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('No authentication token found');
          router.push('/admin');
          setIsLoading(false);
          return;
        }

        const educationData = await educationService.fetchEducation();
        setEducation(educationData);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Handlers
  const handleCreateEducation = async () => {
    if (!educationData.degree.trim() || !educationData.university.trim() || !educationData.period.trim()) {
      setError('Please fill all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await withCacheClearing(async () => {
        const filteredDetails = educationData.details.filter(detail => detail.trim());
        const newEducationData = {
          degree: educationData.degree.trim(),
          university: educationData.university.trim(),
          period: educationData.period.trim(),
          details: filteredDetails,
        };

        const newEducation = await educationService.createEducation(newEducationData);
        setEducation(prev => [...prev, newEducation]);
        resetForm();
        setError(null);
        return newEducation;
      }, 'Education creation');
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error creating education:', error);
      setError(error instanceof Error ? error.message : 'Failed to create education');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEducation = async () => {
    if (!editingEducation || !educationData.degree.trim() || !educationData.university.trim() || !educationData.period.trim()) {
      setError('Please fill all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await withCacheClearing(async () => {
        const filteredDetails = educationData.details.filter(detail => detail.trim());
        const updatedEducationData = {
          degree: educationData.degree.trim(),
          university: educationData.university.trim(),
          period: educationData.period.trim(),
          details: filteredDetails,
        };

        const updatedEducation = await educationService.updateEducation(editingEducation.id, updatedEducationData);
        setEducation(prev => 
          prev.map(education => education.id === editingEducation.id ? updatedEducation : education)
        );
        resetForm();
        setError(null);
        return updatedEducation;
      }, 'Education update');
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error updating education:', error);
      setError(error instanceof Error ? error.message : 'Failed to update education');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (id: number) => {
    try {
      await withCacheClearing(async () => {
        await educationService.deleteEducation(id);
        setEducation(prev => prev.filter(education => education.id !== id));
        setError(null);
        return 'Education deleted';
      }, 'Education deletion');
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error deleting education:', error);
      setError('Failed to delete education');
    }
  };

  const handleMassDelete = async () => {
    if (selectedRows.length === 0) return;
    
    setIsMassActionLoading(true);
    try {
      await withCacheClearing(async () => {
        await educationService.massDeleteEducation(selectedRows);
        const deletedIds = selectedRows.map(education => education.id);
        setEducation(prev => prev.filter(education => !deletedIds.includes(education.id)));
        setSelectedRows([]);
        setError(null);
        return selectedRows;
      }, 'Mass education deletion');
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error deleting education entries:', error);
      setError('Failed to delete some education entries');
    } finally {
      setIsMassActionLoading(false);
    }
  };

  const startEdit = (education: Education) => {
    setEditingEducation(education);
    setEducationData({
      degree: education.degree,
      university: education.university,
      period: education.period,
      details: education.details.length > 0 ? education.details : [''],
    });
    setShowAddEducation(true);
    setError(null);
  };

  const resetForm = () => {
    setShowAddEducation(false);
    setEditingEducation(null);
    setEducationData({
      degree: '',
      university: '',
      period: '',
      details: [''],
    });
    setError(null);
  };

  const addDetail = () => {
    setEducationData(prev => ({
      ...prev,
      details: [...prev.details, '']
    }));
  };

  const updateDetail = (index: number, value: string) => {
    setEducationData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => i === index ? value : detail)
    }));
  };

  const removeDetail = (index: number) => {
    if (educationData.details.length > 1) {
      setEducationData(prev => ({
        ...prev,
        details: prev.details.filter((_, i) => i !== index)
      }));
    }
  };

  const searchableFields: SearchableField[] = [
    { key: "degree" },
    { key: "university" },
    { key: "period" },
  ];

  const educationColumns = createEducationColumns(startEdit, handleDeleteEducation);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading education...</p>
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
            <h1 className="admin-title mb-2">Education Management</h1>
            <p className="text-gray-400">Manage educational background and qualifications</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setShowAddEducation(true);
                setEditingEducation(null);
                setEducationData({ degree: '', university: '', period: '', details: [''] });
                setError(null);
              }} 
              className="btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform group"
            >
              <HiPlus className="transition-transform duration-300 group-hover:rotate-90" />
              Add Education
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4"></div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-4">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      )}

      {/* Mass Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="admin-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">
                {selectedRows.length} education entr{selectedRows.length === 1 ? 'y' : 'ies'} selected
              </span>
            </div>
            <div className="flex gap-2">
              <MassDeleteButton 
                selectedCount={selectedRows.length}
                onConfirm={handleMassDelete}
                isLoading={isMassActionLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="admin-card">
        <DataTable
          columns={educationColumns}
          data={education}
          searchableFields={searchableFields}
          onRowSelectionChange={setSelectedRows}
        />
      </div>

      {/* Education Form */}
      {showAddEducation && (
        <EducationForm
          data={educationData}
          onChange={setEducationData}
          onSave={editingEducation ? handleUpdateEducation : handleCreateEducation}
          onCancel={resetForm}
          isEditing={!!editingEducation}
          isSaving={isSaving}
          addDetail={addDetail}
          updateDetail={updateDetail}
          removeDetail={removeDetail}
        />
      )}
    </div>
  );
}