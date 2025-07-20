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
async function getEducation(): Promise<EducationData | null> {
  try {
    const fetchUrl = `${process.env.API_BASE_URL}/api/education`;
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch education data');
    const data = await res.json();
    return data['hydra:member']?.[0] || null; // Get the first education entry
  } catch (error) {
    console.error('--- Error in getEducation function ---', error);
    return null;
  }
}

const Education = async () => {
  const educationData = await getEducation();

  return (
    <section id="education" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Education</h2>
        {educationData ? (
          <div className="max-w-3xl mx-auto mt-8 bg-background p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">{educationData.degree}</h3>
              <p className="text-sm text-muted-foreground mt-1 sm:mt-0">{educationData.period}</p>
            </div>
            <p className="text-primary font-semibold mb-4">{educationData.university}</p>
            <ul className="list-disc list-outside space-y-2 pl-5 text-muted-foreground">
              {educationData.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center mt-8 text-muted-foreground">Could not load education data.</p>
        )}
      </div>
    </section>
  );
};

export default Education;