'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { HiOutlinePencil, HiPlus, HiOutlineTrash, HiOutlineCheck, HiOutlineCog } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SearchableField } from '@/components/ui/data-table';
import { ArrowUpDown } from 'lucide-react';
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
  category: string | SkillCategory;
}

interface SkillCategory {
  id: number;
  title: string;
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

  // State for editing and adding
  const [editCategory, setEditCategory] = useState<SkillCategory | null>(null);
  const [editCategoryTitle, setEditCategoryTitle] = useState('');
  const [editCategoryIcon, setEditCategoryIcon] = useState('');
  const [showEditCategory, setShowEditCategory] = useState(false);

  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [editSkillName, setEditSkillName] = useState('');
  const [editSkillIcon, setEditSkillIcon] = useState('');
  const [showEditSkill, setShowEditSkill] = useState(false);

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddSkillCategory, setShowAddSkillCategory] = useState(false);

  // Fetch data
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

  // Group skills by category
  const grouped: GroupedSkills = {};
  categories.forEach(cat => {
    grouped[cat.id] = { category: cat, skills: [] };
  });
  skills.forEach(skill => {
    let catId: string = '';
    if (typeof skill.category === 'string') {
      catId = skill.category.split('/').pop() || '';
    } else if (typeof skill.category === 'object' && skill.category.id) {
      catId = String(skill.category.id);
    }
    if (catId && grouped[catId]) {
      grouped[catId].skills.push(skill);
    }
  });

  // Create skill columns with sorting
  const createSkillColumns = useCallback((onEdit: (skill: Skill) => void, onDelete: (id: number) => void): ColumnDef<Skill>[] => [
    {
      accessorKey: "icon",
      header: () => <div className="text-center font-semibold text-foreground">Icon</div>,
      cell: ({ row }) => {
        const iconClass = row.getValue("icon") as string;
        return (
          <div className="flex items-center justify-center w-full">
            {iconClass ? (
              <DynamicIcon name={iconClass} className="text-2xl text-blue-500" />
            ) : (
              <span className="text-gray-400 text-sm">No icon</span>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
        >
          Skill Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-white">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right font-semibold text-foreground">Actions</div>,
      cell: ({ row }) => {
        const skill = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(skill)}
              className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
              <HiOutlinePencil className="h-4 w-4" />
            </Button>
            <DeleteSkillButton id={skill.id} onDelete={onDelete} />
          </div>
        );
      },
      enableHiding: false,
    },
  ], []);

  // Handler functions
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
    setCategories(cats => cats.map(c => (c.id === editCategory.id ? updated : c)));
    setShowEditCategory(false);
    setEditCategory(null);
  };

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
    setSkills(skills => skills.map(s => (s.id === editSkill.id ? updated : s)));
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
    }
  };

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
    }
  };

  const searchableFields: SearchableField[] = [
    { key: "name" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading skills...</p>
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
            <h1 className="admin-title mb-2">Skills Management</h1>
            <p className="text-gray-400">Organize and manage your skills by category</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowAddSkill(true)} 
              className="btn-primary flex items-center gap-2"
            >
              <HiPlus />
              Add Skill
            </Button>
            <Button 
              onClick={() => setShowAddSkillCategory(true)} 
              className="btn-primary flex items-center gap-2"
            >
              <HiPlus />
              Add Category
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4"></div>
      </div>

      {/* Stats Cards */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Categories</p>
                <p className="text-2xl font-bold text-white">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <HiOutlineCog className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Skills</p>
                <p className="text-2xl font-bold text-white">{skills.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <HiOutlineCheck className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Skills/Category</p>
                <p className="text-2xl font-bold text-white">
                  {categories.length > 0 ? Math.round(skills.length / categories.length) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <HiOutlineCog className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tables */}
      <div className="space-y-6">
        {Object.values(grouped).map(({ category, skills: categorySkills }) => {
          const skillColumns = createSkillColumns(handleEditSkill, handleDeleteSkill);

          return (
            <div key={category.id} className="admin-card">
              <div className="admin-card-header">
                <div className="flex items-center gap-3">
                  <DynamicIcon name={category.icon} className="text-3xl text-blue-500" />
                  <div>
                    <h2 className="admin-subtitle mb-0">{category.title}</h2>
                    <p className="text-gray-400 text-sm">{categorySkills.length} skills</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
                    className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <HiOutlinePencil className="h-4 w-4" />
                  </Button>
                  <DeleteCategoryButton id={category.id} onDelete={handleDeleteCategory} />
                </div>
              </div>
              
              <DataTable
                key={`table-${category.id}`}
                columns={skillColumns}
                data={categorySkills}
                searchableFields={searchableFields}
                searchPlaceholder={`Search ${category.title} skills...`}
                showColumnToggle={true}
                showPagination={true}
                showRowSelection={false}
                pageSizeOptions={[3, 5, 10, 15]}
                initialPageSize={5}
              />
            </div>
          );
        })}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Category Title</label>
              <input
                className="admin-input w-full"
                value={editCategoryTitle}
                onChange={e => setEditCategoryTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Category Icon</label>
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
              <label className="admin-label">Skill Name</label>
              <input
                className="admin-input w-full"
                value={editSkillName}
                onChange={e => setEditSkillName(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Skill Icon</label>
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

// Individual Delete Buttons (keeping these as they work fine)
function DeleteSkillButton({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HiOutlineTrash className="h-4 w-4 text-red-500" />
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onDelete(id); setOpen(false); }}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteCategoryButton({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HiOutlineTrash className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this category? All skills in this category may also be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onDelete(id); setOpen(false); }}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}