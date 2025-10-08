import React from 'react';

// Define the shape of the data from the API
interface EducationData {
  id: number;
  degree: string;
  university: string;
  period: string;
  details: string[];
}

// Fetches the data from your API
async function getEducation(): Promise<EducationData[]> {
  try {
    const fetchUrl = `${process.env.API_BASE_URL}/api/education`;
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } }); // 1 hour
    if (!res.ok) throw new Error('Failed to fetch education data');
    const data = await res.json();
    
    const educationData = data['hydra:member'] || [];
    
    // Sort education by period (most recent first)
    const sortedEducation = educationData.sort((a: EducationData, b: EducationData) => {
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
    
    return sortedEducation;
  } catch (error) {
    console.error('--- Error in getEducation function ---', error);
    return [];
  }
}

const Education = async () => {
  const educationData = await getEducation();

  return (
    <section id="education" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Education</h2>
        {educationData && educationData.length > 0 ? (
          <div className="max-w-3xl mx-auto mt-8 space-y-6">
            {educationData.map((education) => (
              <div key={education.id} className="bg-background p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                  <h3 className="text-xl font-bold text-foreground">{education.degree}</h3>
                  <p className="text-sm text-muted-foreground mt-1 sm:mt-0">{education.period}</p>
                </div>
                <p className="text-primary font-semibold mb-4">{education.university}</p>
                {education.details && education.details.length > 0 && (
                  <ul className="list-disc list-outside space-y-2 pl-5 text-muted-foreground">
                    {education.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-8 text-muted-foreground">Could not load education data.</p>
        )}
      </div>
    </section>
  );
};

export default Education;