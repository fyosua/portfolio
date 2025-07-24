import React from 'react';
import { Button } from "@/components/ui/button";
import { HiOutlineCheck, HiOutlineX, HiOutlineUser, HiOutlineKey, HiOutlineMail, HiUserGroup } from 'react-icons/hi';

interface User {
  '@id': string;
  '@type': string;
  id: number;
  email: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordData {
  password: string;
  confirmPassword: string;
}

interface UserFormProps {
  registerData: RegisterData;
  isSaving: boolean;
  onRegisterDataChange: (data: RegisterData) => void;
  onRegister: () => void;
  onCancel: () => void;
}

export function UserForm({ 
  registerData, 
  isSaving, 
  onRegisterDataChange, 
  onRegister, 
  onCancel 
}: UserFormProps) {
  const handleInputChange = (field: keyof RegisterData, value: string) => {
    onRegisterDataChange({ ...registerData, [field]: value });
  };

  const isPasswordMatch = registerData.password === registerData.confirmPassword;
  const isFormValid = registerData.email.trim() && 
                     registerData.password && 
                     registerData.confirmPassword && 
                     isPasswordMatch;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div className="flex items-center gap-3">
          <HiOutlineUser className="text-3xl text-blue-500" />
          <div>
            <h2 className="admin-subtitle mb-0">Register New User</h2>
            <p className="text-gray-400 text-sm">Create a new admin user account</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HiOutlineMail className="text-blue-500" />
              Account Information
            </h3>
            
            <div>
              <label className="admin-label">Email Address *</label>
              <input
                type="email"
                className="admin-input w-full"
                value={registerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <HiUserGroup className="h-4 w-4" />
                <span className="font-medium">Default Role: Administrator</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                New users will have full admin access to all portfolio management features.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HiOutlineKey className="text-green-500" />
              Security
            </h3>
            
            <div>
              <label className="admin-label">Password *</label>
              <input
                type="password"
                className="admin-input w-full"
                value={registerData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter strong password"
                required
              />
            </div>

            <div>
              <label className="admin-label">Confirm Password *</label>
              <input
                type="password"
                className={`admin-input w-full ${
                  registerData.confirmPassword && !isPasswordMatch 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : ''
                }`}
                value={registerData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                required
              />
              {registerData.confirmPassword && !isPasswordMatch && (
                <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="text-xs text-gray-400">
              <p>Password Requirements:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>At least 8 characters long</li>
                <li>Mix of letters, numbers, and symbols</li>
                <li>Avoid common passwords</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button 
            onClick={onRegister}
            disabled={isSaving || !isFormValid}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCheck />
            {isSaving ? 'Creating Account...' : 'Create User'}
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

interface ChangePasswordFormProps {
  user: User;
  passwordData: PasswordData;
  isSaving: boolean;
  onPasswordDataChange: (data: PasswordData) => void;
  onChangePassword: () => void;
  onCancel: () => void;
}

export function ChangePasswordForm({ 
  user, 
  passwordData, 
  isSaving, 
  onPasswordDataChange, 
  onChangePassword, 
  onCancel 
}: ChangePasswordFormProps) {
  const handleInputChange = (field: keyof PasswordData, value: string) => {
    onPasswordDataChange({ ...passwordData, [field]: value });
  };

  const isPasswordMatch = passwordData.password === passwordData.confirmPassword;
  const isFormValid = passwordData.password && passwordData.confirmPassword && isPasswordMatch;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div className="flex items-center gap-3">
          <HiOutlineKey className="text-3xl text-yellow-500" />
          <div>
            <h2 className="admin-subtitle mb-0">Change Password</h2>
            <p className="text-gray-400 text-sm">Update password for {user.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="max-w-md space-y-4">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <HiOutlineUser className="h-4 w-4" />
              <span className="font-medium">Target User: {user.email}</span>
            </div>
          </div>

          <div>
            <label className="admin-label">New Password *</label>
            <input
              type="password"
              className="admin-input w-full"
              value={passwordData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="admin-label">Confirm New Password *</label>
            <input
              type="password"
              className={`admin-input w-full ${
                passwordData.confirmPassword && !isPasswordMatch 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : ''
              }`}
              value={passwordData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
              required
            />
            {passwordData.confirmPassword && !isPasswordMatch && (
              <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="text-xs text-gray-400">
            <p>⚠️ The user will need to use this new password on their next login.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button 
            onClick={onChangePassword}
            disabled={isSaving || !isFormValid}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCheck />
            {isSaving ? 'Updating Password...' : 'Update Password'}
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

interface MassChangePasswordFormProps {
  selectedUsers: User[];
  passwordData: PasswordData;
  isMassActionLoading: boolean;
  onPasswordDataChange: (data: PasswordData) => void;
  onChangePassword: () => void;
  onCancel: () => void;
}

export function MassChangePasswordForm({ 
  selectedUsers, 
  passwordData, 
  isMassActionLoading, 
  onPasswordDataChange, 
  onChangePassword, 
  onCancel 
}: MassChangePasswordFormProps) {
  const handleInputChange = (field: keyof PasswordData, value: string) => {
    onPasswordDataChange({ ...passwordData, [field]: value });
  };

  const isPasswordMatch = passwordData.password === passwordData.confirmPassword;
  const isFormValid = passwordData.password && passwordData.confirmPassword && isPasswordMatch;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div className="flex items-center gap-3">
          <HiOutlineKey className="text-3xl text-orange-500" />
          <div>
            <h2 className="admin-subtitle mb-0">Mass Change Password</h2>
            <p className="text-gray-400 text-sm">
              Update password for {selectedUsers.length} selected user(s)
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Selected Users</label>
            <div className="bg-gray-800 rounded-xl p-3 border border-gray-600 max-h-32 overflow-y-auto">
              {selectedUsers.map(user => (
                <div key={user.id} className="text-white text-sm py-1 flex items-center gap-2">
                  <HiOutlineMail className="h-3 w-3 text-gray-400" />
                  {user.email}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="admin-label">New Password *</label>
              <input
                type="password"
                className="admin-input w-full"
                value={passwordData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter new password for all users"
                required
              />
            </div>

            <div>
              <label className="admin-label">Confirm New Password *</label>
              <input
                type="password"
                className={`admin-input w-full ${
                  passwordData.confirmPassword && !isPasswordMatch 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : ''
                }`}
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                required
              />
              {passwordData.confirmPassword && !isPasswordMatch && (
                <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-orange-400 text-sm">
                ⚠️ All selected users will be assigned the same password and will need to use it on their next login.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button 
            onClick={onChangePassword}
            disabled={isMassActionLoading || !isFormValid}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCheck />
            {isMassActionLoading ? 'Updating Passwords...' : `Update ${selectedUsers.length} Password(s)`}
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