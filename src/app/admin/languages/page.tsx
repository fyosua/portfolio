'use client';

import React, { useEffect, useState } from 'react';
import { HiOutlinePencil, HiPlus, HiOutlineCheck, HiOutlineGlobeAlt, HiOutlineX } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { DataTable, SearchableField } from '@/components/ui/data-table';
import { createLanguageColumns } from './LanguageTableColumns';
import { MassDeleteButton } from './LanguageDialogs';
import { LanguageForm, MassUpdateForm } from './LanguageForms';

// Types (kept in main file)
interface Language {
  '@id': string;
  '@type': string;
  id: number;
  lang: string;
  level: string;
}

interface LanguagesResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': Language[];
}

// Define language proficiency levels
const proficiencyLevels = [
  'Native Speaker',
  'Fluent',
  'Very Good',
  'Good',
  'Intermediate',
  'Basic',
  'Beginner'
];

// API Service (kept in main file)
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

const languageService = {
  async fetchLanguages(): Promise<Language[]> {
    const response = await fetch(`${API_BASE_URL}/api/languages`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LanguagesResponse = await response.json();
    return data['hydra:member'] || [];
  },

  async createLanguage(lang: string, level: string): Promise<Language> {
    const response = await fetch(`${API_BASE_URL}/api/languages`, {
      method: 'POST',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify({ lang: lang.trim(), level }),
    });

    if (!response.ok) {
      throw new Error('Failed to create language');
    }

    return response.json();
  },

  async updateLanguage(id: number, lang: string, level: string): Promise<Language> {
    const response = await fetch(`${API_BASE_URL}/api/languages/${id}`, {
      method: 'PUT',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify({ lang: lang.trim(), level }),
    });

    if (!response.ok) {
      throw new Error('Failed to update language');
    }

    return response.json();
  },

  async deleteLanguage(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/languages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete language');
    }
  },

  async massDeleteLanguages(languages: Language[]): Promise<void> {
    const deletePromises = languages.map(language =>
      this.deleteLanguage(language.id)
    );

    await Promise.all(deletePromises);
  },

  async massUpdateLanguages(languages: Language[], newLevel: string): Promise<Language[]> {
    const updatePromises = languages.map(language =>
      this.updateLanguage(language.id, language.lang, newLevel)
    );

    return Promise.all(updatePromises);
  },
};

export default function LanguagesAdminPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [editLanguage, setEditLanguage] = useState<Language | null>(null);
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Mass action states
  const [selectedRows, setSelectedRows] = useState<Language[]>([]);
  const [showMassUpdate, setShowMassUpdate] = useState(false);
  const [massUpdateLevel, setMassUpdateLevel] = useState('');
  const [isMassActionLoading, setIsMassActionLoading] = useState(false);

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('No authentication token found');
          setIsLoading(false);
          return;
        }

        const data = await languageService.fetchLanguages();
        setLanguages(data);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch languages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Handlers
  const handleAddLanguage = async () => {
    if (!newLanguageName.trim() || !newLanguageLevel) return;

    setIsSaving(true);
    try {
      const newLanguage = await languageService.createLanguage(newLanguageName, newLanguageLevel);
      setLanguages(prev => [...prev, newLanguage]);
      resetForm();
    } catch (error) {
      console.error('Error adding language:', error);
      setError('Failed to add language');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditLanguage = async () => {
    if (!editLanguage || !newLanguageName.trim() || !newLanguageLevel) return;

    setIsSaving(true);
    try {
      const updatedLanguage = await languageService.updateLanguage(editLanguage.id, newLanguageName, newLanguageLevel);
      setLanguages(prev => prev.map(lang => 
        lang.id === editLanguage.id ? updatedLanguage : lang
      ));
      resetForm();
    } catch (error) {
      console.error('Error updating language:', error);
      setError('Failed to update language');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    try {
      await languageService.deleteLanguage(id);
      setLanguages(prev => prev.filter(lang => lang.id !== id));
    } catch (error) {
      console.error('Error deleting language:', error);
      setError('Failed to delete language');
    }
  };

  const handleMassDelete = async () => {
    if (selectedRows.length === 0) return;
    
    setIsMassActionLoading(true);
    try {
      await languageService.massDeleteLanguages(selectedRows);
      const deletedIds = selectedRows.map(lang => lang.id);
      setLanguages(prev => prev.filter(lang => !deletedIds.includes(lang.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting languages:', error);
      setError('Failed to delete some languages');
    } finally {
      setIsMassActionLoading(false);
    }
  };

  const handleMassUpdate = async () => {
    if (selectedRows.length === 0 || !massUpdateLevel) return;
    
    setIsMassActionLoading(true);
    try {
      const updatedLanguages = await languageService.massUpdateLanguages(selectedRows, massUpdateLevel);
      setLanguages(prev => 
        prev.map(lang => {
          const updated = updatedLanguages.find(updated => updated.id === lang.id);
          return updated || lang;
        })
      );
      
      setSelectedRows([]);
      setShowMassUpdate(false);
      setMassUpdateLevel('');
    } catch (error) {
      console.error('Error updating languages:', error);
      setError('Failed to update some languages');
    } finally {
      setIsMassActionLoading(false);
    }
  };

  const startEdit = (language: Language) => {
    setEditLanguage(language);
    setNewLanguageName(language.lang);
    setNewLanguageLevel(language.level);
    setShowAddLanguage(false);
  };

  const resetForm = () => {
    setEditLanguage(null);
    setShowAddLanguage(false);
    setNewLanguageName('');
    setNewLanguageLevel('');
    setError(null);
  };

  const searchableFields: SearchableField[] = [
    { key: "lang" },
    { key: "level" },
  ];

  const languageColumns = createLanguageColumns(startEdit, handleDeleteLanguage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading languages...</p>
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
            <h1 className="admin-title mb-2">Languages Management</h1>
            <p className="text-gray-400">Manage your language skills and proficiency levels</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setShowAddLanguage(true);
                setEditLanguage(null);
                setNewLanguageName('');
                setNewLanguageLevel('');
              }} 
              className="btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform group"
            >
              <HiPlus className="transition-transform duration-300 group-hover:rotate-90" />
              Add Language
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">
                {selectedRows.length} language(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowMassUpdate(true)}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isMassActionLoading}
                >
                  <HiOutlinePencil className="h-4 w-4" />
                  Update Level
                </Button>
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
      )}

      {/* Stats Cards */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Languages</p>
                <p className="text-2xl font-bold text-white">{languages.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HiOutlineGlobeAlt className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Native Languages</p>
                <p className="text-2xl font-bold text-white">
                  {languages.filter(lang => lang.level === 'Native Speaker').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <HiOutlineCheck className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Fluent Languages</p>
                <p className="text-2xl font-bold text-white">
                  {languages.filter(lang => ['Fluent', 'Very Good'].includes(lang.level)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <HiOutlineGlobeAlt className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Learning Languages</p>
                <p className="text-2xl font-bold text-white">
                  {languages.filter(lang => ['Intermediate', 'Basic', 'Beginner'].includes(lang.level)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <HiOutlinePencil className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Language Form */}
      {(showAddLanguage || editLanguage) && (
        <LanguageForm
          language={editLanguage}
          languageName={newLanguageName}
          languageLevel={newLanguageLevel}
          isSaving={isSaving}
          onLanguageNameChange={setNewLanguageName}
          onLanguageLevelChange={setNewLanguageLevel}
          onSave={editLanguage ? handleEditLanguage : handleAddLanguage}
          onCancel={resetForm}
        />
      )}

      {/* Mass Update Form */}
      {showMassUpdate && (
        <MassUpdateForm
          selectedLanguages={selectedRows}
          updateLevel={massUpdateLevel}
          isMassActionLoading={isMassActionLoading}
          onUpdateLevelChange={setMassUpdateLevel}
          onUpdate={handleMassUpdate}
          onCancel={() => {
            setShowMassUpdate(false);
            setMassUpdateLevel('');
          }}
        />
      )}

      {/* Languages Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-subtitle">Your Languages</h2>
          <p className="text-gray-400 text-sm">{languages.length} language(s) total</p>
        </div>
        
        <DataTable
          columns={languageColumns}
          data={languages}
          searchableFields={searchableFields}
          searchPlaceholder="Search by language or proficiency level..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSizeOptions={[3, 5, 10, 15, 20]}
          initialPageSize={3}
          onRowSelectionChange={setSelectedRows}
        />
      </div>

    </div>
  );
}