'use client';

import React, { useEffect, useState } from 'react';
import { HiOutlinePencil, HiPlus, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import DynamicIcon from '@/app/components/DynamicIcon';
import IconPicker from '@/app/components/IconPicker';
import AddSkillForm from './AddSkillForm';
import AddSkillCategoryForm from './AddSkillCategoryForm';

// Types for Skill and SkillCategory
interface Skill {
  id: number;
  name: string;
  icon: string;
  category: string | SkillCategory; // can be IRI or object
}
interface SkillCategory {
  id: number;
  title: string; // <-- use title, not name
  icon: string;
}

type GroupedSkills = {
  [categoryId: string]: {
    category: SkillCategory;
    skills: Skill[];
  };
};

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For editing category
  const [editCategory, setEditCategory] = useState<SkillCategory | null>(null);
  const [editCategoryTitle, setEditCategoryTitle] = useState('');
  const [editCategoryIcon, setEditCategoryIcon] = useState('');
  const [showEditCategory, setShowEditCategory] = useState(false);

  // For editing skill
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [editSkillName, setEditSkillName] = useState('');
  const [editSkillIcon, setEditSkillIcon] = useState('');
  const [showEditSkill, setShowEditSkill] = useState(false);

  // For adding skill
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillIcon, setNewSkillIcon] = useState('');
  const [newSkillCategoryId, setNewSkillCategoryId] = useState<string>('');

  // For adding skill category
  const [showAddSkillCategory, setShowAddSkillCategory] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skills`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skill_categories`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),
    ])
      .then(([skillsData, categoriesData]) => {
        setSkills(skillsData['hydra:member'] || []);
        setCategories(categoriesData['hydra:member'] || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Group skills by category id
  const grouped: GroupedSkills = {};
  categories.forEach(cat => {
    grouped[cat.id] = { category: cat, skills: [] };
  });
  skills.forEach(skill => {
    // skill.category can be IRI or object
    let catId: string = '';
    if (typeof skill.category === 'string') {
      // e.g. "/api/skill_categories/1"
      catId = skill.category.split('/').pop() || '';
    } else if (typeof skill.category === 'object' && skill.category.id) {
      catId = String(skill.category.id);
    }
    if (catId && grouped[catId]) {
      grouped[catId].skills.push(skill);
    }
  });

  // Edit Category handlers
  const handleEditCategory = (cat: SkillCategory) => {
    setEditCategory(cat);
    setEditCategoryTitle(cat.title);
    setEditCategoryIcon(cat.icon);
    setShowEditCategory(true);
  };
  const handleEditCategorySave = async () => {
    if (!editCategory) return;
    const token = localStorage.getItem('authToken');
    const updated = { ...editCategory, title: editCategoryTitle, icon: editCategoryIcon };
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skill_categories/${editCategory.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/ld+json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    setCategories(cats =>
      cats.map(c => (c.id === editCategory.id ? updated : c))
    );
    setShowEditCategory(false);
    setEditCategory(null);
  };

  // Edit Skill handlers
  const handleEditSkill = (skill: Skill) => {
    setEditSkill(skill);
    setEditSkillName(skill.name);
    setEditSkillIcon(skill.icon);
    setShowEditSkill(true);
  };
  const handleEditSkillSave = async () => {
    if (!editSkill) return;
    const token = localStorage.getItem('authToken');
    const updated = { ...editSkill, name: editSkillName, icon: editSkillIcon };
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skills/${editSkill.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/ld+json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    setSkills(skills =>
      skills.map(s => (s.id === editSkill.id ? updated : s))
    );
    setShowEditSkill(false);
    setEditSkill(null);
  };

  const handleDeleteSkill = async (id: number) => {
    const token = localStorage.getItem('authToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skills/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setSkills(skills => skills.filter(skill => skill.id !== id));
  };

  const handleDeleteCategory = async (id: number) => {
    const token = localStorage.getItem('authToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skill_categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setCategories(cats => cats.filter(cat => cat.id !== id));
  };

  // Open dialog handler
  const handleOpenAddSkill = () => {
    setNewSkillName('');
    setNewSkillIcon('');
    setNewSkillCategoryId(categories[0]?.id?.toString() || '');
    setShowAddSkill(true);
  };

  // Handler for adding skill category
  const handleAddSkillCategorySave = async ({ title, icon }: { title: string; icon: string }) => {
    const token = localStorage.getItem('authToken');
    const newCategory = { title, icon };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skill_categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newCategory),
    });
    if (res.ok) {
      const created = await res.json();
      setCategories(cats => [...cats, created]);
      setShowAddSkillCategory(false);
    } else {
      alert('Failed to add category');
    }
  };

  // Save handler
  const handleAddSkillSave = async ({ name, icon, categoryId }: { name: string; icon: string; categoryId: string }) => {
    const token = localStorage.getItem('authToken');
    const newSkill = {
      name,
      icon,
      category: `/api/skill_categories/${categoryId}`,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newSkill),
    });
    if (res.ok) {
      const created = await res.json();
      setSkills(skills => [...skills, created]);
      setShowAddSkill(false);
    } else {
      alert('Failed to add skill');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Skills</h1>
        <div>
          <Button onClick={() => setShowAddSkill(true)} className="bg-violet-500 text-white hover:bg-violet-600 mr-2">
            <HiPlus className="mr-2" />
            Add Skill
          </Button>
          <Button onClick={() => setShowAddSkillCategory(true)} className="bg-violet-500 text-white hover:bg-violet-600">
            <HiPlus className="mr-2" />
            Add Category
          </Button>
        </div>
      </div>
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-xl shadow-2xl transition-colors overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/60">
            <tr>
              <th className="p-4 font-semibold text-foreground">Category</th>
              <th className="p-4 font-semibold text-foreground">Skills</th>
              <th className="p-4 font-semibold text-right text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(grouped).map(({ category, skills }) => (
              <tr key={category.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors align-top">
                <td className="p-4 font-semibold text-lg text-primary">
                  <span className="inline-flex items-center gap-2">
                    <i className={`${category.icon} text-2xl`} />
                    {category.title}
                  </span>
                  <Button variant="ghost" size="icon" className="ml-2" onClick={() => handleEditCategory(category)}>
                    <HiOutlinePencil className="w-5 h-5 text-blue-500" />
                  </Button>
                  <DeleteCategoryButton id={category.id} onDelete={handleDeleteCategory} />
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-3">
                    {skills.map(skill => (
                      <span key={skill.id} className="inline-flex items-center gap-2 bg-muted/40 px-2 py-1 rounded-lg">
                        <i className={`${skill.icon} text-xl`} />
                        <span>{skill.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleEditSkill(skill)}>
                          <HiOutlinePencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <DeleteSkillButton id={skill.id} onDelete={handleDeleteSkill} />
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Category Title</label>
              <input
                className="w-full bg-white/70 dark:bg-black/40 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-md transition-colors"
                value={editCategoryTitle}
                onChange={e => setEditCategoryTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Category Icon</label>
              <IconPicker value={editCategoryIcon} onSelect={setEditCategoryIcon} />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Preview:</span>
                <DynamicIcon name={editCategoryIcon} className="text-2xl" />
                <span className="text-xs">{editCategoryIcon}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategorySave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={showEditSkill} onOpenChange={setShowEditSkill}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Skill Name</label>
              <input
                className="w-full bg-white/70 dark:bg-black/40 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-md transition-colors"
                value={editSkillName}
                onChange={e => setEditSkillName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Skill Icon</label>
              <IconPicker value={editSkillIcon} onSelect={setEditSkillIcon} />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Preview:</span>
                <DynamicIcon name={editSkillIcon} className="text-2xl" />
                <span className="text-xs">{editSkillIcon}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditSkill(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSkillSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={showAddSkill} onOpenChange={setShowAddSkill}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <AddSkillForm
            categories={categories}
            onSubmit={handleAddSkillSave}
            onCancel={() => setShowAddSkill(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Skill Category Dialog */}
      <Dialog open={showAddSkillCategory} onOpenChange={setShowAddSkillCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill Category</DialogTitle>
          </DialogHeader>
          <AddSkillCategoryForm
            onSubmit={handleAddSkillCategorySave}
            onCancel={() => setShowAddSkillCategory(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// DeleteSkillButton remains the same as before
function DeleteSkillButton({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
          <HiOutlineTrash className="w-5 h-5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Skill?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this skill? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(id);
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// New DeleteCategoryButton component
function DeleteCategoryButton({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
          <HiOutlineTrash className="w-5 h-5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this category? All skills in this category may also be affected. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(id);
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}