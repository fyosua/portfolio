'use client';

import React, { useState, useMemo } from 'react';
import * as HeroIcons from 'react-icons/hi';
import * as SimpleIcons from 'react-icons/si';
import DynamicIcon from './DynamicIcon';

const heroIconNames = Object.keys(HeroIcons).filter(name => name.startsWith('Hi'));
const simpleIconNames = Object.keys(SimpleIcons).filter(name => name.startsWith('Si'));
const allIconNames = [...heroIconNames, ...simpleIconNames];

interface IconPickerProps {
  value?: string;
  onSelect: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(
    () =>
      allIconNames.filter(iconName =>
        iconName.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-3 w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground"
      />
      <div className="max-h-64 overflow-y-auto grid grid-cols-8 gap-3 p-2 bg-background rounded-lg border border-border">
        {filteredIcons.map(iconName => (
          <button
            key={iconName}
            type="button"
            className={`flex flex-col items-center justify-center rounded p-1 border transition-colors
              ${value === iconName ? 'bg-primary/20 border-primary' : 'hover:bg-muted/40 border-transparent'}`}
            onClick={() => onSelect(iconName)}
            title={iconName}
          >
            <DynamicIcon name={iconName} className="text-2xl" />
            <span className="text-xs mt-1 break-all text-muted-foreground">{iconName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;