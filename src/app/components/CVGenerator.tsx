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

    return {
      profile: profileData['hydra:member']?.[0],
      aboutContent: aboutData['hydra:member']?.[0]?.content,
      experiences: expData['hydra:member'],
      education: eduData['hydra:member']?.[0],
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