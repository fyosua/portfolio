'use client';

import React, { useEffect, useState } from 'react';
import { HiOutlinePencil, HiPlus, HiOutlineTrash, HiOutlineCheck, HiOutlineUser, HiOutlineKey, HiUserGroup, HiOutlineX, HiOutlineMail } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { DataTable, SearchableField } from '@/components/ui/data-table';
import { createUserColumns } from './UserTableColumns';
import { MassDeleteButton } from './UserDialogs';
import { UserForm, ChangePasswordForm, MassChangePasswordForm } from './UserForms';

// Types
interface User {
  '@id': string;
  '@type': string;
  id: number;
  email: string;
}

interface UsersResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': User[];
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

const userService = {
  async fetchUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UsersResponse = await response.json();
    return data['hydra:member'] || [];
  },

  async registerUser(userData: { email: string; password: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to register user');
    }

    return response.json();
  },

  async changePassword(id: number, password: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeadersWithContent(),
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to change password');
    }
  },

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },

  async massDeleteUsers(users: User[]): Promise<void> {
    const deletePromises = users.map(user => this.deleteUser(user.id));
    await Promise.all(deletePromises);
  },

  async massChangePassword(users: User[], password: string): Promise<void> {
    const changePromises = users.map(user => this.changePassword(user.id, password));
    await Promise.all(changePromises);
  }
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showAddUser, setShowAddUser] = useState(false);
  const [changePasswordUser, setChangePasswordUser] = useState<User | null>(null);
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Mass action states
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [showMassChangePassword, setShowMassChangePassword] = useState(false);
  const [massPasswordData, setMassPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isMassActionLoading, setIsMassActionLoading] = useState(false);

  // Get current user info to prevent self-deletion
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

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

        // Get current user email from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserEmail(payload.email || '');
        } catch (e) {
          console.error('Error parsing token:', e);
        }

        const usersData = await userService.fetchUsers();
        setUsers(usersData);
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
  const handleRegisterUser = async () => {
    if (!registerData.email.trim() || !registerData.password || registerData.password !== registerData.confirmPassword) {
      setError('Please fill all fields correctly and ensure passwords match');
      return;
    }

    setIsSaving(true);
    try {
      const userData = {
        email: registerData.email.trim(),
        password: registerData.password,
      };

      const newUser = await userService.registerUser(userData);
      setUsers(prev => [...prev, newUser]);
      resetRegisterForm();
      setError(null);
    } catch (error) {
      console.error('Error registering user:', error);
      setError(error instanceof Error ? error.message : 'Failed to register user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!changePasswordUser || !passwordData.password || passwordData.password !== passwordData.confirmPassword) {
      setError('Please fill password fields correctly and ensure passwords match');
      return;
    }

    setIsSaving(true);
    try {
      await userService.changePassword(changePasswordUser.id, passwordData.password);
      resetPasswordForm();
      setError(null);
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.email === currentUserEmail) {
      setError('You cannot delete your own account');
      return;
    }

    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleMassDelete = async () => {
    if (selectedRows.length === 0) return;
    
    // Check if trying to delete current user
    const containsCurrentUser = selectedRows.some(user => user.email === currentUserEmail);
    if (containsCurrentUser) {
      setError('You cannot delete your own account');
      return;
    }
    
    setIsMassActionLoading(true);
    try {
      await userService.massDeleteUsers(selectedRows);
      const deletedIds = selectedRows.map(user => user.id);
      setUsers(prev => prev.filter(user => !deletedIds.includes(user.id)));
      setSelectedRows([]);
      setError(null);
    } catch (error) {
      console.error('Error deleting users:', error);
      setError('Failed to delete some users');
    } finally {
      setIsMassActionLoading(false);
    }
  };

  const handleMassChangePassword = async () => {
    if (selectedRows.length === 0 || !massPasswordData.password || massPasswordData.password !== massPasswordData.confirmPassword) {
      setError('Please fill password fields correctly and ensure passwords match');
      return;
    }
    
    setIsMassActionLoading(true);
    try {
      await userService.massChangePassword(selectedRows, massPasswordData.password);
      setSelectedRows([]);
      setShowMassChangePassword(false);
      setMassPasswordData({ password: '', confirmPassword: '' });
      setError(null);
    } catch (error) {
      console.error('Error changing passwords:', error);
      setError('Failed to change some passwords');
    } finally {
      setIsMassActionLoading(false);
    }
  };

  const startChangePassword = (user: User) => {
    setChangePasswordUser(user);
    setPasswordData({ password: '', confirmPassword: '' });
    setShowAddUser(false);
    setError(null);
  };

  const resetRegisterForm = () => {
    setShowAddUser(false);
    setRegisterData({ email: '', password: '', confirmPassword: '' });
    setError(null);
  };

  const resetPasswordForm = () => {
    setChangePasswordUser(null);
    setPasswordData({ password: '', confirmPassword: '' });
    setError(null);
  };

  const searchableFields: SearchableField[] = [
    { key: "email" },
  ];

  const userColumns = createUserColumns(startChangePassword, handleDeleteUser, currentUserEmail);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading users...</p>
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
            <h1 className="admin-title mb-2">User Management</h1>
            <p className="text-gray-400">Manage admin users, passwords, and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setShowAddUser(true);
                setChangePasswordUser(null);
                setRegisterData({ email: '', password: '', confirmPassword: '' }); // Reset form data directly
                setError(null); // Clear any existing errors
              }} 
              className="btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform group"
            >
              <HiPlus className="transition-transform duration-300 group-hover:rotate-90" />
              Register User
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
                {selectedRows.length} user(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowMassChangePassword(true)}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isMassActionLoading}
                >
                  <HiOutlineKey className="h-4 w-4" />
                  Change Passwords
                </Button>
                <MassDeleteButton 
                  selectedCount={selectedRows.length}
                  onDelete={handleMassDelete}
                  isLoading={isMassActionLoading}
                  currentUserEmail={currentUserEmail}
                  selectedUsers={selectedRows}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HiOutlineUser className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Admin Accounts</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <HiUserGroup className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current User</p>
                <p className="text-lg font-bold text-white truncate">{currentUserEmail}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <HiOutlineCheck className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register User Form */}
      {showAddUser && (
        <UserForm
          registerData={registerData}
          isSaving={isSaving}
          onRegisterDataChange={setRegisterData}
          onRegister={handleRegisterUser}
          onCancel={resetRegisterForm}
        />
      )}

      {/* Change Password Form */}
      {changePasswordUser && (
        <ChangePasswordForm
          user={changePasswordUser}
          passwordData={passwordData}
          isSaving={isSaving}
          onPasswordDataChange={setPasswordData}
          onChangePassword={handleChangePassword}
          onCancel={resetPasswordForm}
        />
      )}

      {/* Mass Change Password Form */}
      {showMassChangePassword && (
        <MassChangePasswordForm
          selectedUsers={selectedRows}
          passwordData={massPasswordData}
          isMassActionLoading={isMassActionLoading}
          onPasswordDataChange={setMassPasswordData}
          onChangePassword={handleMassChangePassword}
          onCancel={() => {
            setShowMassChangePassword(false);
            setMassPasswordData({ password: '', confirmPassword: '' });
          }}
        />
      )}

      {/* Users Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-subtitle">System Users</h2>
          <p className="text-gray-400 text-sm">{users.length} user(s) total</p>
        </div>
        
        <DataTable
          columns={userColumns}
          data={users}
          searchableFields={searchableFields}
          searchPlaceholder="Search by email address..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSizeOptions={[5, 10, 20, 50]}
          initialPageSize={10}
          onRowSelectionChange={setSelectedRows}
        />
      </div>
    </div>
  );
}