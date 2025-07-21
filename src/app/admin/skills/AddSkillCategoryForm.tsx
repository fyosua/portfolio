'use client';

import React, { useState } from 'react';
import IconPicker from '@/app/components/IconPicker';
import DynamicIcon from '@/app/components/DynamicIcon';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface AddSkillCategoryFormProps {
  onSubmit: (data: { title: string; icon: string }) => Promise<void>;
  onCancel: () => void;
}

const AddSkillCategoryForm: React.FC<AddSkillCategoryFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSubmit({ title, icon });
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
        <label className="block mb-1 text-sm font-medium">Category Title</label>
        <input
          className="w-full bg-white/70 dark:bg-black/40 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-md transition-colors"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Category Icon</label>
        <IconPicker value={icon} onSelect={setIcon} />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Preview:</span>
          <DynamicIcon name={icon} className="text-2xl" />
          <span className="text-xs">{icon}</span>
        </div>
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

export default AddSkillCategoryForm;