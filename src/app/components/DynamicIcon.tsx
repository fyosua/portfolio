'use client';

import React from 'react';
import * as HeroIcons from 'react-icons/hi';
import * as SimpleIcons from 'react-icons/si';

// Map prefixes to the icon libraries
const iconLibraries = {
  Hi: HeroIcons,
  Si: SimpleIcons,
};

interface DynamicIconProps {
  name?: string; // Make name optional to prevent errors
  className?: string;
}

const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  // Safety check: If no name is provided, return a default icon
  if (!name) {
    return <HeroIcons.HiCode className={className} />;
  }

  const prefix = name.substring(0, 2) as keyof typeof iconLibraries;
  const library = iconLibraries[prefix];

  if (!library) {
    return <HeroIcons.HiCode className={className} />; // Fallback for unknown library
  }

  const IconComponent = (library as any)[name];

  if (!IconComponent) {
    return <HeroIcons.HiCode className={className} />; // Fallback for unknown icon
  }

  return <IconComponent className={className} />;
};

export default DynamicIcon;