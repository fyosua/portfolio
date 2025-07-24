// Create: src/components/admin/languages/LanguageForms.tsx
import React from 'react';
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

interface Language {
  '@id': string;
  '@type': string;
  id: number;
  lang: string;
  level: string;
}

const proficiencyLevels = [
  'Native Speaker',
  'Fluent',
  'Very Good',
  'Good',
  'Intermediate',
  'Basic',
  'Beginner'
];

interface LanguageFormProps {
  language?: Language | null;
  languageName: string;
  languageLevel: string;
  isSaving: boolean;
  onLanguageNameChange: (name: string) => void;
  onLanguageLevelChange: (level: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function LanguageForm({
  language,
  languageName,
  languageLevel,
  isSaving,
  onLanguageNameChange,
  onLanguageLevelChange,
  onSave,
  onCancel
}: LanguageFormProps) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-subtitle">
          {language ? 'Edit Language' : 'Add New Language'}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language Name
            </label>
            <input
              type="text"
              value={languageName}
              onChange={(e) => onLanguageNameChange(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g., English, Spanish, French"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proficiency Level
            </label>
            <select
              value={languageLevel}
              onChange={(e) => onLanguageLevelChange(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="">Select proficiency level</option>
              {proficiencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onSave}
            disabled={isSaving || !languageName.trim() || !languageLevel}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCheck />
            {isSaving ? 'Saving...' : (language ? 'Update' : 'Add')} Language
          </Button>
          <Button 
            onClick={onCancel}
            className="btn-secondary flex items-center gap-2"
            disabled={isSaving}
          >
            <HiOutlineX />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MassUpdateFormProps {
  selectedLanguages: Language[];
  updateLevel: string;
  isMassActionLoading: boolean;
  onUpdateLevelChange: (level: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export function MassUpdateForm({
  selectedLanguages,
  updateLevel,
  isMassActionLoading,
  onUpdateLevelChange,
  onUpdate,
  onCancel
}: MassUpdateFormProps) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-subtitle">
          Update Proficiency Level for {selectedLanguages.length} Language(s)
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selected Languages
            </label>
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-600 max-h-32 overflow-y-auto">
              {selectedLanguages.map(lang => (
                <div key={lang.id} className="text-white text-sm py-1">
                  {lang.lang} ({lang.level})
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Proficiency Level
            </label>
            <select
              value={updateLevel}
              onChange={(e) => onUpdateLevelChange(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="">Select new proficiency level</option>
              {proficiencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onUpdate}
            disabled={isMassActionLoading || !updateLevel}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCheck />
            {isMassActionLoading ? 'Updating...' : 'Update All'}
          </Button>
          <Button 
            onClick={onCancel}
            className="btn-secondary flex items-center gap-2"
            disabled={isMassActionLoading}
          >
            <HiOutlineX />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}