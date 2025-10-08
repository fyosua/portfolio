"use client";

import React from 'react';
import { HiOutlineCheck, HiOutlineX, HiPlus, HiOutlineTrash } from 'react-icons/hi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EducationData {
  degree: string;
  university: string;
  period: string;
  details: string[];
}

interface EducationFormProps {
  data: EducationData;
  onChange: (data: EducationData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  isSaving: boolean;
  addDetail: () => void;
  updateDetail: (index: number, value: string) => void;
  removeDetail: (index: number) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  data,
  onChange,
  onSave,
  onCancel,
  isEditing,
  isSaving,
  addDetail,
  updateDetail,
  removeDetail,
}) => {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-title">
          {isEditing ? 'Edit Education' : 'Add New Education'}
        </h2>
      </div>
      
      <div className="space-y-6">
        {/* Degree */}
        <div>
          <Label htmlFor="degree" className="text-white mb-2 block">
            Degree <span className="text-red-400">*</span>
          </Label>
          <Input
            id="degree"
            type="text"
            placeholder="e.g., Bachelor of Science in Computer Science"
            value={data.degree}
            onChange={(e) => onChange({ ...data, degree: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            disabled={isSaving}
          />
        </div>

        {/* University */}
        <div>
          <Label htmlFor="university" className="text-white mb-2 block">
            University <span className="text-red-400">*</span>
          </Label>
          <Input
            id="university"
            type="text"
            placeholder="e.g., University of Technology"
            value={data.university}
            onChange={(e) => onChange({ ...data, university: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            disabled={isSaving}
          />
        </div>

        {/* Period */}
        <div>
          <Label htmlFor="period" className="text-white mb-2 block">
            Period <span className="text-red-400">*</span>
          </Label>
          <Input
            id="period"
            type="text"
            placeholder="e.g., 2015 - 2019"
            value={data.period}
            onChange={(e) => onChange({ ...data, period: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            disabled={isSaving}
          />
          <p className="text-gray-400 text-sm mt-1">
            Specify the time period of study (e.g., "2015 - 2019" or "Sep 2015 - Jun 2019")
          </p>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-white">Details</Label>
            <Button
              type="button"
              onClick={addDetail}
              className="btn-secondary text-sm flex items-center gap-1"
              disabled={isSaving}
            >
              <HiPlus className="h-3 w-3" />
              Add Detail
            </Button>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Add details about your studies, achievements, relevant coursework, etc.
          </p>
          
          <div className="space-y-3">
            {data.details.map((detail, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  placeholder={`Detail ${index + 1}...`}
                  value={detail}
                  onChange={(e) => updateDetail(index, e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
                  rows={2}
                  disabled={isSaving}
                />
                {data.details.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="btn-danger p-2 h-auto self-start mt-1"
                    disabled={isSaving}
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button
            onClick={onSave}
            disabled={isSaving || !data.degree.trim() || !data.university.trim() || !data.period.trim()}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCheck />
            {isSaving ? 'Saving...' : (isEditing ? 'Update Education' : 'Create Education')}
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            disabled={isSaving}
            className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <HiOutlineX />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};