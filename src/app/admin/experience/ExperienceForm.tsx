'use client';

import React, { useState, useEffect, useCallback } from 'react';
// import DateRangePicker from './DateRangePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator'; // Add this if you want a divider

interface Responsibility {
  point: string;
  subPoints: string[];
}
interface FormData {
  role: string;
  company: string;
  location: string;
  date: string;
  summary: string;
  responsibilities: Responsibility[];
}
interface ExperienceFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
  isLoading: boolean;
}

const ExperienceForm = ({ onSubmit, initialData, isLoading }: ExperienceFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    role: '', company: '', location: '', date: '', summary: '',
    responsibilities: [{ point: '', subPoints: [] }],
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
        date: initialData.date || '',
        summary: initialData.summary || '',
        responsibilities: responsibilities || [{ point: '', subPoints: [] }],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = useCallback((dateString: string) => {
    setFormData(prev => ({ ...prev, date: dateString }));
  }, []);

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
    onSubmit(formData);
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
            <div>
              <Label htmlFor="date">Date</Label>
              {/* <DateRangePicker
                initialDateString={formData.date}
                onDateChange={handleDateChange}
              /> */}
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