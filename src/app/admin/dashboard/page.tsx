'use client';

import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import CVTemplate from '@/app/components/CVTemplate';

async function getAllCVData() {
  try {
    const endpoints = ['profiles', 'abouts', 'experiences', 'education', 'skills', 'skill_categories', 'languages', 'personal_infos'];
    const requests = endpoints.map(endpoint => fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${endpoint}`));
    const responses = await Promise.all(requests);

    for (const res of responses) {
      if (!res.ok) throw new Error(`Failed to fetch: ${res.url} (${res.status})`);
    }

    const data = await Promise.all(responses.map(res => res.json()));
    const [profileData, aboutData, expData, eduData, skillsData, categoriesData, langData, personalInfoData] = data;

    const skillsMap = new Map(skillsData['hydra:member'].map((skill: any) => [skill['@id'], skill]));
    const skillsByCategory = categoriesData['hydra:member'].map((category: any) => ({
      ...category,
      skills: category.skills.map((skillId: string) => skillsMap.get(skillId)).filter(Boolean)
    }));

    // Sort education by period (most recent first)
    const sortedEducation = (eduData['hydra:member'] || []).sort((a: any, b: any) => {
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
      experiences: expData['hydra:member'],
      education: sortedEducation, // Use sorted education
      skillsByCategory,
      languages: langData['hydra:member'],
      personalInfo: personalInfoData['hydra:member']?.[0],
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error("Failed to fetch data for CV", error);
    return null;
  }
}

const DashboardPage = () => {
  const [cvData, setCvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCVData().then(data => {
      setCvData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-4">Dashboard Overview</h1>
      <p className="text-muted-foreground">
        Welcome to your portfolio's admin panel. From here, you can manage all the content on your live website.
      </p>
      <div className="mt-8 p-6 bg-background rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Next Steps</h2>
        <p className="mt-2 text-muted-foreground">
          Use the sidebar to navigate to begin managing your data.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-primary mb-4">CV Preview</h2>
        {loading ? (
          <div className="text-muted-foreground">Loading CV preview...</div>
        ) : cvData ? (
          <div className="rounded border border-border overflow-hidden" style={{ height: 800 }}>
            <PDFViewer width="100%" height="800">
              <CVTemplate {...cvData} />
            </PDFViewer>
          </div>
        ) : (
          <div className="text-red-500">Failed to load CV data.</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;