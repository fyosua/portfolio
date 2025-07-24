// Create: src/components/admin/languages/LanguageTableColumns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { HiOutlinePencil } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { DeleteLanguageButton } from './LanguageDialogs';

interface Language {
  '@id': string;
  '@type': string;
  id: number;
  lang: string;
  level: string;
}

export const getLevelColor = (level: string) => {
  switch (level) {
    case 'Native Speaker': return 'bg-gradient-to-r from-green-500 to-emerald-600';
    case 'Fluent': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    case 'Very Good': return 'bg-gradient-to-r from-purple-500 to-indigo-600';
    case 'Good': return 'bg-gradient-to-r from-yellow-500 to-orange-600';
    case 'Intermediate': return 'bg-gradient-to-r from-orange-500 to-red-600';
    case 'Basic': return 'bg-gradient-to-r from-red-500 to-pink-600';
    case 'Beginner': return 'bg-gradient-to-r from-gray-500 to-slate-600';
    default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
  }
};

export const getLevelPriority = (level: string) => {
  const priorities = {
    'Native Speaker': 7,
    'Fluent': 6,
    'Very Good': 5,
    'Good': 4,
    'Intermediate': 3,
    'Basic': 2,
    'Beginner': 1
  };
  return priorities[level as keyof typeof priorities] || 0;
};

export const createLanguageColumns = (
  onEdit: (language: Language) => void,
  onDelete: (id: number) => void
): ColumnDef<Language>[] => [
  {
    accessorKey: "lang",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
      >
        Language
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-white">
        {row.getValue("lang")}
      </div>
    ),
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-semibold text-foreground hover:bg-transparent"
      >
        Proficiency Level
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const level = row.getValue("level") as string;
      return (
        <div className="flex justify-start">
          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getLevelColor(level)}`}>
            {level}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const levelA = getLevelPriority(rowA.original.level);
      const levelB = getLevelPriority(rowB.original.level);
      return levelB - levelA;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right font-semibold text-foreground">Actions</div>,
    cell: ({ row }) => {
      const language = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(language)}
            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
          >
            <HiOutlinePencil className="h-4 w-4" />
          </Button>
          <DeleteLanguageButton id={language.id} onDelete={onDelete} />
        </div>
      );
    },
    enableHiding: false,
  },
];