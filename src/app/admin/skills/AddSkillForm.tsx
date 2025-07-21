'use client';

import React, { useState } from 'react';
import IconPicker from '@/app/components/IconPicker';
import DynamicIcon from '@/app/components/DynamicIcon';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface SkillCategory {
  id: number;
  title: string;
  icon: string;
}

interface AddSkillFormProps {
  categories: SkillCategory[];
  onSubmit: (data: { name: string; icon: string; categoryId: string }) => Promise<void>;
  onCancel: () => void;
}

const AddSkillForm: React.FC<AddSkillFormProps> = ({ categories, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id?.toString() || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSubmit({ name, icon, categoryId });
    setLoading(false);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block mb-1 text-sm font-medium">Skill Name</label>
        <input
          className="w-full bg-white/70 dark:bg-black/40 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-md transition-colors"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Skill Icon</label>
        <IconPicker value={icon} onSelect={setIcon} />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Preview:</span>
          <DynamicIcon name={icon} className="text-2xl" />
          <span className="text-xs">{icon}</span>
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Category</label>
        <select
          className="w-full bg-white/70 dark:bg-black/40 border border-border rounded-lg px-3 py-2 text-foreground"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddSkillForm;