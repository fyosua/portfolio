import React from 'react';
import { Button } from "@/components/ui/button";
import { HiOutlineCheck, HiOutlineX, HiOutlineUser, HiOutlineIdentification } from 'react-icons/hi';

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

interface FormData {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  dob: string;
  nationality: string;
}

interface ProfileFormProps {
  profile: CombinedProfile | null;
  formData: FormData;
  isSaving: boolean;
  onFormDataChange: (data: FormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileForm({ 
  profile, 
  formData, 
  isSaving, 
  onFormDataChange, 
  onSave, 
  onCancel 
}: ProfileFormProps) {
  const handleInputChange = (field: keyof FormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div className="flex items-center gap-3">
          <HiOutlineUser className="text-3xl text-blue-500" />
          <div>
            <h2 className="admin-subtitle mb-0">
              {profile ? 'Edit Profile' : 'Add New Profile'}
            </h2>
            <p className="text-gray-400 text-sm">
              {profile ? 'Update profile information' : 'Create a new profile with personal details'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HiOutlineUser className="text-blue-500" />
              Profile Information
            </h3>
            
            <div>
              <label className="admin-label">Full Name *</label>
              <input
                type="text"
                className="admin-input w-full"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="admin-label">Professional Title *</label>
              <input
                type="text"
                className="admin-input w-full"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior Developer, Product Manager"
                required
              />
            </div>

            <div>
              <label className="admin-label">Email Address *</label>
              <input
                type="email"
                className="admin-input w-full"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="admin-label">Phone Number</label>
              <input
                type="tel"
                className="admin-input w-full"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="admin-label">LinkedIn Profile</label>
              <input
                type="url"
                className="admin-input w-full"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HiOutlineIdentification className="text-green-500" />
              Personal Information
            </h3>
            
            <div>
              <label className="admin-label">Date of Birth</label>
              <input
                type="date"
                className="admin-input w-full"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Nationality</label>
              <input
                type="text"
                className="admin-input w-full"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="e.g., Indonesian, American"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button 
            onClick={onSave}
            disabled={isSaving || !formData.name.trim() || !formData.email.trim()}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCheck />
            {isSaving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
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
  selectedProfiles: CombinedProfile[];
  updateData: { title: string; nationality: string };
  isMassActionLoading: boolean;
  onUpdateDataChange: (data: { title: string; nationality: string }) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export function MassUpdateForm({ 
  selectedProfiles, 
  updateData, 
  isMassActionLoading, 
  onUpdateDataChange, 
  onUpdate, 
  onCancel 
}: MassUpdateFormProps) {
  const handleInputChange = (field: keyof typeof updateData, value: string) => {
    onUpdateDataChange({ ...updateData, [field]: value });
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-subtitle">
          Mass Update {selectedProfiles.length} Profile(s)
        </h2>
        <p className="text-gray-400 text-sm">
          Update common fields for selected profiles. Leave fields empty to keep current values.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Selected Profiles</label>
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-600 max-h-32 overflow-y-auto">
              {selectedProfiles.map(profile => (
                <div key={profile.id} className="text-white text-sm py-1">
                  <div className="font-medium">{profile.name}</div>
                  <div className="text-gray-400 text-xs">{profile.title}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="admin-label">New Professional Title</label>
              <input
                type="text"
                className="admin-input w-full"
                value={updateData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Leave empty to keep current titles"
              />
            </div>

            <div>
              <label className="admin-label">New Nationality</label>
              <input
                type="text"
                className="admin-input w-full"
                value={updateData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Leave empty to keep current nationalities"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4 border-t border-gray-700">
          <Button 
            onClick={onUpdate}
            disabled={isMassActionLoading || (!updateData.title && !updateData.nationality)}
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