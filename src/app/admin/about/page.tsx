// Create: src/app/admin/about/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

interface About {
  '@id': string;
  '@type': string;
  id: number;
  content: string;
}

interface AboutResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': About[];
}

export default function AboutAdminPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch about data from your API
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('No authentication token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/abouts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/ld+json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AboutResponse = await response.json();
        
        // Get the first about entry from hydra:member array
        const aboutData = data['hydra:member']?.[0];
        
        if (aboutData) {
          setAbout(aboutData);
          setEditContent(aboutData.content || '');
        } else {
          setError('No about content found');
        }
      } catch (error) {
        console.error('Error fetching about:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch about data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Handle save with proper API structure
  const handleSave = async () => {
    if (!about) return;

    setIsSaving(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/abouts/${about.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/ld+json',
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.status} ${response.statusText}`);
      }

      const updatedAbout: About = await response.json();
      setAbout(updatedAbout);
      setIsEditing(false);
      console.log('About updated successfully');
    } catch (error) {
      console.error('Error updating about:', error);
      setError(error instanceof Error ? error.message : 'Failed to update about');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditContent(about?.content || '');
    setIsEditing(false);
    setError(null);
  };

  // Calculate word count properly
  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading about content...</p>
        </div>
      </div>
    );
  }

  if (error && !about) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </Button>
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
            <h1 className="admin-title mb-2">About Management</h1>
            <p className="text-gray-400">Manage your about section content</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform group"
                disabled={!about}
              >
                <HiOutlinePencil className="transition-transform duration-300 group-hover:rotate-12" />
                Edit Content
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || editContent.trim() === ''}
                  className="btn-primary flex items-center gap-2"
                >
                  <HiOutlineCheck />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  className="btn-secondary flex items-center gap-2"
                  disabled={isSaving}
                >
                  <HiOutlineX />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Separator Line */}
        <div className="border-t border-gray-700 mt-4"></div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-4">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      )}

      {/* Stats Card */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Content Length</p>
                <p className="text-2xl font-bold text-white">
                  {(isEditing ? editContent : about?.content)?.length || 0} chars
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HiOutlinePencil className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Word Count</p>
                <p className="text-2xl font-bold text-white">
                  {getWordCount(isEditing ? editContent : about?.content || '')} words
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <HiOutlineCheck className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-2xl font-bold text-white">
                  {isEditing ? 'Editing' : 'Published'}
                </p>
              </div>
              <div className={`w-12 h-12 ${isEditing ? 'bg-gradient-to-r from-orange-500 to-yellow-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'} rounded-xl flex items-center justify-center`}>
                {isEditing ? (
                  <HiOutlinePencil className="text-white text-xl" />
                ) : (
                  <HiOutlineCheck className="text-white text-xl" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-subtitle">About Content</h2>
        </div>
        
        <div className="space-y-4">
          {!isEditing ? (
            <div className="bg-gray-800 rounded-xl p-6 min-h-[200px] border border-gray-700">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {about?.content || 'No content available'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 bg-gray-800 text-white rounded-xl p-4 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-colors"
                placeholder="Enter your about content here..."
              />
              <div className="text-sm text-gray-400 flex justify-between">
                <span>Characters: {editContent.length} | Words: {getWordCount(editContent)}</span>
                <span className={editContent.trim() === '' ? 'text-red-400' : 'text-green-400'}>
                  {editContent.trim() === '' ? 'Content cannot be empty' : 'Ready to save'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}