'use client';

import React, { useState, useEffect, useCallback } from 'react';
// import DateRangePicker from './DateRangePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon } from '@heroicons/react/24/outline'; // or your icon library

interface Responsibility {
  point: string;
  subPoints: string[];
}
interface FormData {
  role: string;
  company: string;
  location: string;
  startDate: string; // ISO string (YYYY-MM)
  endDate: string | null; // ISO string (YYYY-MM) or null for Present
  summary: string;
  responsibilities: Responsibility[];
  isPresent?: boolean; // for UI only
}
interface ExperienceFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
  isLoading: boolean;
}

const ExperienceForm = ({ onSubmit, initialData, isLoading }: ExperienceFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    role: '', company: '', location: '', startDate: '', endDate: '', summary: '',
    responsibilities: [{ point: '', subPoints: [] }],
    isPresent: false,
  });

  useEffect(() => {
    if (initialData) {
      const responsibilities = typeof initialData.responsibilities === 'string'
        ? JSON.parse(initialData.responsibilities)
        : initialData.responsibilities;

      setFormData({
        role: initialData.role || '',
        company: initialData.company || '',
        location: initialData.location || '',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 7) : '',
        endDate: initialData.endDate === null ? '' : (initialData.endDate ? initialData.endDate.slice(0, 7) : ''),
        summary: initialData.summary || '',
        responsibilities: responsibilities || [{ point: '', subPoints: [] }],
        isPresent: initialData.endDate === null,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, endDate: e.target.value }));
  };

  const handlePresentToggle = () => {
    setFormData(prev => ({
      ...prev,
      isPresent: !prev.isPresent,
      endDate: !prev.isPresent ? '' : prev.endDate,
    }));
  };

  const handleRespChange = (index: number, value: string) => {
    const newResps = [...formData.responsibilities];
    newResps[index].point = value;
    setFormData(prev => ({ ...prev, responsibilities: newResps }));
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, { point: '', subPoints: [] }],
    }));
  };

  const removeResponsibility = (index: number) => {
    const newResps = formData.responsibilities.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, responsibilities: newResps }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      endDate: formData.isPresent ? null : formData.endDate,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 shadow-2xl border border-border rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-md transition-colors">
      <CardHeader>
        <CardTitle>Edit Experience</CardTitle>
      </CardHeader>
      <CardContent className="bg-transparent p-6 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="role">Role</Label>
              <Input name="role" value={formData.role} onChange={handleChange} required className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-lg" />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input name="company" value={formData.company} onChange={handleChange} required className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-lg" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input name="location" value={formData.location} onChange={handleChange} className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Label>Date Range</Label>
              <div className="flex items-center gap-2 mt-2">
                {/* Start Date */}
                <Input
                  type="month"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleStartDateChange}
                  required
                  className="w-[175px] bg-white/70 dark:bg-black/40 border border-border rounded-lg"
                  style={{ paddingRight: '3.5rem' }}
                />
                <span>-</span>
                {/* End Date */}
                <Input
                  type="month"
                  name="endDate"
                  value={formData.isPresent ? '' : formData.endDate || ''}
                  onChange={handleEndDateChange}
                  disabled={formData.isPresent}
                  className="w-[175px] bg-white/70 dark:bg-black/40 border border-border rounded-lg"
                  style={{ paddingRight: '3.5rem' }}
                />
                <label className="flex items-center gap-1 text-sm whitespace-nowrap ml-4">
                  <input
                    type="checkbox"
                    checked={formData.isPresent}
                    onChange={handlePresentToggle}
                    className="accent-primary"
                    style={{ verticalAlign: 'middle' }}
                  />
                  Present
                </label>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea name="summary" value={formData.summary} onChange={handleChange} rows={3} className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-lg" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Key Responsibilities</h3>
            <div className="space-y-2">
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={resp.point}
                    onChange={(e) => handleRespChange(index, e.target.value)}
                    placeholder={`Responsibility #${index + 1}`}
                    className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeResponsibility(index)}
                    disabled={formData.responsibilities.length === 1}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={addResponsibility}
            >
              + Add Responsibility
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Experience'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;