'use client';

import React, { useEffect, useState } from 'react';
import { HiOutlinePencil, HiPlus, HiOutlineCheck, HiOutlineUser, HiOutlineIdentification, HiOutlineX, HiOutlineMail, HiOutlinePhone, HiOutlineGlobeAlt } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { DataTable, SearchableField } from '@/components/ui/data-table';
import { createProfileColumns } from './ProfileTableColumns';
import { MassDeleteButton } from './ProfileDialogs';
import { ProfileForm, MassUpdateForm } from './ProfileForms';

// Types
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

interface ProfilesResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': Profile[];
}

interface PersonalInfoResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': PersonalInfo[];
}

// Combined interface for display
interface CombinedProfile extends Profile {
  personalInfo?: PersonalInfo;
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

const profileService = {
  async fetchProfiles(): Promise<Profile[]> {
    const response = await fetch(`${API_BASE_URL}/api/profiles`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProfilesResponse = await response.json();
    return data['hydra:member'] || [];
  },

  async fetchPersonalInfos(): Promise<PersonalInfo[]> {
    const response = await fetch(`${API_BASE_URL}/api/personal_infos`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PersonalInfoResponse = await response.json();
    return data['hydra:member'] || [];
  },

  async createProfile(profileData: Omit<Profile, '@id' | '@type' | 'id'>): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/api/profiles`, {
      method: 'POST',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to create profile');
    }

    return response.json();
  },

  async createPersonalInfo(personalInfoData: Omit<PersonalInfo, '@id' | '@type' | 'id'>): Promise<PersonalInfo> {
    const response = await fetch(`${API_BASE_URL}/api/personal_infos`, {
      method: 'POST',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify(personalInfoData),
    });

    if (!response.ok) {
      throw new Error('Failed to create personal info');
    }

    return response.json();
  },

  async updateProfile(id: number, profileData: Omit<Profile, '@id' | '@type' | 'id'>): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/api/profiles/${id}`, {
      method: 'PUT',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },

  async updatePersonalInfo(id: number, personalInfoData: Omit<PersonalInfo, '@id' | '@type' | 'id'>): Promise<PersonalInfo> {
    const response = await fetch(`${API_BASE_URL}/api/personal_infos/${id}`, {
      method: 'PUT',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify(personalInfoData),
    });

    if (!response.ok) {
      throw new Error('Failed to update personal info');
    }

    return response.json();
  },

  async deleteProfile(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/profiles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }
  },

  async deletePersonalInfo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/personal_infos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete personal info');
    }
  },

  async massDeleteProfiles(profiles: CombinedProfile[]): Promise<void> {
    const deletePromises = profiles.map(profile => {
      const promises = [this.deleteProfile(profile.id)];
      if (profile.personalInfo) {
        promises.push(this.deletePersonalInfo(profile.personalInfo.id));
      }
      return Promise.all(promises);
    });

    await Promise.all(deletePromises);
  },
};

export default function PersonalProfilesAdminPage() {
  const [profiles, setProfiles] = useState<CombinedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [editProfile, setEditProfile] = useState<CombinedProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    dob: '',
    nationality: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Mass action states
  const [selectedRows, setSelectedRows] = useState<CombinedProfile[]>([]);
  const [showMassUpdate, setShowMassUpdate] = useState(false);
  const [massUpdateData, setMassUpdateData] = useState({
    title: '',
    nationality: '',
  });
  const [isMassActionLoading, setIsMassActionLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('No authentication token found');
          setIsLoading(false);
          return;
        }

        const [profilesData, personalInfosData] = await Promise.all([
          profileService.fetchProfiles(),
          profileService.fetchPersonalInfos()
        ]);

        // Combine profiles with personal info
        const combinedProfiles: CombinedProfile[] = profilesData.map(profile => ({
          ...profile,
          personalInfo: personalInfosData.find(info => info.id === profile.id)
        }));

        setProfiles(combinedProfiles);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleAddProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsSaving(true);
    try {
      const profileData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        linkedin: formData.linkedin.trim(),
      };

      const newProfile = await profileService.createProfile(profileData);

      let newPersonalInfo = undefined;
      if (formData.dob || formData.nationality) {
        const personalInfoData = {
          dob: formData.dob,
          nationality: formData.nationality.trim(),
        };
        newPersonalInfo = await profileService.createPersonalInfo(personalInfoData);
      }

      const combinedProfile: CombinedProfile = {
        ...newProfile,
        personalInfo: newPersonalInfo
      };

      setProfiles(prev => [...prev, combinedProfile]);
      resetForm();
    } catch (error) {
      console.error('Error adding profile:', error);
      setError('Failed to add profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProfile = async () => {
    if (!editProfile || !formData.name.trim() || !formData.email.trim()) return;

    setIsSaving(true);
    try {
      const profileData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        linkedin: formData.linkedin.trim(),
      };

      const updatedProfile = await profileService.updateProfile(editProfile.id, profileData);

      let updatedPersonalInfo = editProfile.personalInfo;
      if (formData.dob || formData.nationality) {
        const personalInfoData = {
          dob: formData.dob,
          nationality: formData.nationality.trim(),
        };

        if (editProfile.personalInfo) {
          updatedPersonalInfo = await profileService.updatePersonalInfo(editProfile.personalInfo.id, personalInfoData);
        } else {
          updatedPersonalInfo = await profileService.createPersonalInfo(personalInfoData);
        }
      }

      const combinedProfile: CombinedProfile = {
        ...updatedProfile,
        personalInfo: updatedPersonalInfo
      };

      setProfiles(prev => prev.map(profile => 
        profile.id === editProfile.id ? combinedProfile : profile
      ));
      resetForm();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async (id: number) => {
    try {
      const profile = profiles.find(p => p.id === id);
      if (profile) {
        await profileService.deleteProfile(id);
        if (profile.personalInfo) {
          await profileService.deletePersonalInfo(profile.personalInfo.id);
        }
        setProfiles(prev => prev.filter(profile => profile.id !== id));
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Failed to delete profile');
    }
  };

  const handleMassDelete = async () => {
    if (selectedRows.length === 0) return;
    
    setIsMassActionLoading(true);
    try {
      await profileService.massDeleteProfiles(selectedRows);
      const deletedIds = selectedRows.map(profile => profile.id);
      setProfiles(prev => prev.filter(profile => !deletedIds.includes(profile.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting profiles:', error);
      setError('Failed to delete some profiles');
    } finally {
      setIsMassActionLoading(false);
    }
  };

  const handleMassUpdate = async () => {
    if (selectedRows.length === 0) return;
    
    setIsMassActionLoading(true);
    try {
      const updatePromises = selectedRows.map(async (profile) => {
        const profileData = {
          ...profile,
          title: massUpdateData.title || profile.title,
        };
        
        const updatedProfile = await profileService.updateProfile(profile.id, profileData);
        
        let updatedPersonalInfo = profile.personalInfo;
        if (profile.personalInfo && massUpdateData.nationality) {
          const personalInfoData = {
            ...profile.personalInfo,
            nationality: massUpdateData.nationality,
          };
          updatedPersonalInfo = await profileService.updatePersonalInfo(profile.personalInfo.id, personalInfoData);
        }

        return {
          ...updatedProfile,
          personalInfo: updatedPersonalInfo
        };
      });

      const updatedProfiles = await Promise.all(updatePromises);
      
      setProfiles(prev => 
        prev.map(profile => {
          const updated = updatedProfiles.find(updated => updated.id === profile.id);
          return updated || profile;
        })
      );
      
      setSelectedRows([]);
      setShowMassUpdate(false);
      setMassUpdateData({ title: '', nationality: '' });
    } catch (error) {
      console.error('Error updating profiles:', error);
      setError('Failed to update some profiles');
    } finally {
      setIsMassActionLoading(false);
    }
  };

  const startEdit = (profile: CombinedProfile) => {
    setEditProfile(profile);
    setFormData({
      name: profile.name,
      title: profile.title,
      email: profile.email,
      phone: profile.phone,
      linkedin: profile.linkedin,
      dob: profile.personalInfo?.dob || '',
      nationality: profile.personalInfo?.nationality || '',
    });
    setShowAddProfile(false);
  };

  const resetForm = () => {
    setEditProfile(null);
    setShowAddProfile(false);
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      linkedin: '',
      dob: '',
      nationality: '',
    });
    setError(null);
  };

  const searchableFields: SearchableField[] = [
    { key: "name" },
    { key: "title" },
    { key: "email" },
    { key: "phone" },
  ];

  const profileColumns = createProfileColumns(startEdit, handleDeleteProfile);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading profiles...</p>
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
            <h1 className="admin-title mb-2">Personal Profiles Management</h1>
            <p className="text-gray-400">Manage your personal profiles and information</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setShowAddProfile(true);
                setEditProfile(null);
                resetForm();
              }} 
              className="btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform group"
            >
              <HiPlus className="transition-transform duration-300 group-hover:rotate-90" />
              Add Profile
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
                {selectedRows.length} profile(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowMassUpdate(true)}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isMassActionLoading}
                >
                  <HiOutlinePencil className="h-4 w-4" />
                  Update Fields
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
                <p className="text-gray-400 text-sm">Total Profiles</p>
                <p className="text-2xl font-bold text-white">{profiles.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HiOutlineUser className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Complete Profiles</p>
                <p className="text-2xl font-bold text-white">
                  {profiles.filter(profile => profile.personalInfo).length}
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
                <p className="text-gray-400 text-sm">With Personal Info</p>
                <p className="text-2xl font-bold text-white">
                  {profiles.filter(profile => profile.personalInfo?.dob && profile.personalInfo?.nationality).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <HiOutlineIdentification className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">With LinkedIn</p>
                <p className="text-2xl font-bold text-white">
                  {profiles.filter(profile => profile.linkedin && profile.linkedin.trim()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <HiOutlineGlobeAlt className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Profile Form */}
      {(showAddProfile || editProfile) && (
        <ProfileForm
          profile={editProfile}
          formData={formData}
          isSaving={isSaving}
          onFormDataChange={setFormData}
          onSave={editProfile ? handleEditProfile : handleAddProfile}
          onCancel={resetForm}
        />
      )}

      {/* Mass Update Form */}
      {showMassUpdate && (
        <MassUpdateForm
          selectedProfiles={selectedRows}
          updateData={massUpdateData}
          isMassActionLoading={isMassActionLoading}
          onUpdateDataChange={setMassUpdateData}
          onUpdate={handleMassUpdate}
          onCancel={() => {
            setShowMassUpdate(false);
            setMassUpdateData({ title: '', nationality: '' });
          }}
        />
      )}

      {/* Profiles Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-subtitle">Your Profiles</h2>
          <p className="text-gray-400 text-sm">{profiles.length} profile(s) total</p>
        </div>
        
        <DataTable
          columns={profileColumns}
          data={profiles}
          searchableFields={searchableFields}
          searchPlaceholder="Search by name, title, email, or phone..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSizeOptions={[3, 5, 10, 15, 20]}
          initialPageSize={5}
          onRowSelectionChange={setSelectedRows}
        />
      </div>
    </div>
  );
}