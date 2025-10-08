'use client';

import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import CVTemplate from './CVTemplate';

// --- Data Fetching Functions ---
async function getAllData() {
  try {
    const endpoints = ['profiles', 'abouts', 'experiences', 'education', 'skills', 'skill_categories', 'languages', 'personal_infos'];
    const requests = endpoints.map(endpoint => fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${endpoint}`));
    const responses = await Promise.all(requests);

    // Check for any failed requests
    for (const res of responses) {
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.url} (${res.status})`);
      }
    }

    const data = await Promise.all(responses.map(res => res.json()));

    const [profileData, aboutData, expData, eduData, skillsData, categoriesData, langData, personalInfoData] = data;

    // Process the data
    const skillsMap = new Map(skillsData['hydra:member'].map((skill: any) => [skill['@id'], skill]));
    const skillsByCategory = categoriesData['hydra:member'].map((category: any) => ({
      ...category,
      skills: category.skills.map((skillId: string) => skillsMap.get(skillId)).filter(Boolean)
    }));

    // Sort experiences by startDate in descending order (most recent first)
    const sortedExperiences = (expData['hydra:member'] || []).sort((a: any, b: any) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Sort education by period (most recent first) - using simple string comparison for period
    const sortedEducation = (eduData['hydra:member'] || []).sort((a: any, b: any) => {
      // Extract end year from period string (e.g., "2015 - 2019" or "Sep 2015 - Jun 2019")
      const extractEndYear = (period: string) => {
        const parts = period.split(' - ');
        if (parts.length === 2) {
          const endPart = parts[1].trim();
          const year = endPart.match(/\d{4}/);
          return year ? parseInt(year[0]) : 0;
        }
        return 0;
      };
      
      const yearA = extractEndYear(a.period || '');
      const yearB = extractEndYear(b.period || '');
      return yearB - yearA; // Most recent first
    });

    return {
      profile: profileData['hydra:member']?.[0],
      aboutContent: aboutData['hydra:member']?.[0]?.content,
      experiences: sortedExperiences,
      education: sortedEducation, // Use sorted education
      skillsByCategory,
      languages: langData['hydra:member'],
      personalInfo: personalInfoData['hydra:member']?.[0],
    };
  } catch (error) {
    console.error("Failed to fetch data for CV", error);
    return null;
  }
}

const CVGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    const cvData = await getAllData();
    
    if (!cvData) {
      alert('Could not fetch data to generate CV.');
      setIsLoading(false);
      return;
    }

    try {
      const blob = await pdf(<CVTemplate {...cvData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      // --- THIS IS THE MODIFIED SECTION ---
      // 1. Get the current date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      // 2. Set the dynamic filename
      a.href = url;
      a.download = `Yosua-Ferdian-CV-${dateString}.pdf`;
      // --- END MODIFICATION ---

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleDownloadPdf} disabled={isLoading} className="btn-secondary">
      {isLoading ? 'Generating...' : 'Download CV'}
    </button>
  );
};

export default CVGenerator;