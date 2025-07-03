// src/app/components/Skills.tsx

import React from 'react';
import {
  HiCode,
  HiServer,
  HiDesktopComputer,
  HiDatabase,
  HiAdjustments
} from 'react-icons/hi';
import { SiGoogleads, SiGoogleanalytics, SiGoogle, SiNextdotjs, SiLaravel, SiCpanel, SiLinux, SiGit, SiMysql, SiWordpress } from 'react-icons/si';

// Updated and categorized skills data from your CV
const skillCategories = [
  {
    title: 'Google Ecosystem',
    icon: <SiGoogle className="h-8 w-8 text-primary" />,
    skills: [
      { name: 'Google Ads', icon: <SiGoogleads /> },
      { name: 'Google Analytics', icon: <SiGoogleanalytics /> },
      { name: 'Google Tag Manager', icon: <HiAdjustments /> },
      { name: 'Google Merchant Center', icon: <HiDesktopComputer /> },
    ],
  },
  {
    title: 'Web & Frontend',
    icon: <HiCode className="h-8 w-8 text-primary" />,
    skills: [
      { name: 'Next.JS', icon: <SiNextdotjs /> },
      { name: 'Laravel', icon: <SiLaravel /> },
      { name: 'HTML & CSS', icon: <HiCode /> },
      { name: 'Wordpress', icon: <SiWordpress /> },
      { name: 'Rest API', icon: <HiCode /> },
    ],
  },
  {
    title: 'Server & Hosting',
    icon: <HiServer className="h-8 w-8 text-primary" />,
    skills: [
      { name: 'WHM & cPanel', icon: <SiCpanel /> },
      { name: 'Linux System Admin', icon: <SiLinux /> },
      { name: 'Network Infrastructure', icon: <HiServer /> },
      { name: 'System Monitoring', icon: <HiDesktopComputer /> },
      { name: 'Bash Scripting', icon: <HiCode /> },
    ],
  },
  {
    title: 'Tools & General Tech',
    icon: <HiDatabase className="h-8 w-8 text-primary" />,
    skills: [
      { name: 'Git', icon: <SiGit /> },
      { name: 'MySQL', icon: <SiMysql /> },
      { name: 'Technical Support', icon: <HiDesktopComputer /> },
      { name: 'Payment Platforms', icon: <HiDesktopComputer /> },
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-background"> {/* Before: bg-white dark:bg-gray-800 */}
      <div className="container mx-auto px-4">
        <h2 className="section-title">Skills & Expertise</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-muted p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" // Before: bg-gray-50 dark:bg-gray-700
            >
              <div className="flex items-center mb-4">
                {/* The icon itself uses text-primary, which is now theme-aware! */}
                {category.icon}
                <h3 className="text-xl font-bold ml-4 text-foreground">{category.title}</h3> {/* Before: text-gray-800 dark:text-white */}
              </div>
              <ul className="space-y-3">
                {category.skills.map((skill, i) => (
                  <li key={i} className="flex items-center text-muted-foreground"> {/* Before: text-gray-700 dark:text-gray-300 */}
                    <div className="text-primary mr-3 text-lg"> {/* The icon color */}
                      {skill.icon}
                    </div>
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;