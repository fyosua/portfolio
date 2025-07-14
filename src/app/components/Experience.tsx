import React from 'react';

// Defines the shape of your experience data from the API
interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  date: string;
  summary: string;
  responsibilities: string[];
}

// Fetches the data from your API
async function getExperiences(): Promise<Experience[]> {
  try {
    const fetchUrl = `${process.env.API_BASE_URL}/api/experiences`;
    const res = await fetch(fetchUrl);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(errorText);
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    // console.log('--- Successful API Response (data) ---', JSON.stringify(data, null, 2));
    
    // THIS IS THE CORRECTED LINE
    return data['hydra:member'] || [];

  } catch (error) {
    console.error('--- Error in getExperiences function ---', error);
    return []; 
  }
}

// The component is async to allow for data fetching before rendering
const Experience = async () => {
  const experiences = await getExperiences();

  if (experiences.length === 0) {
    return (
      <section id="experience" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Work Experience</h2>
          <p className="text-center mt-8 text-muted-foreground">Could not load work experience at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Work Experience</h2>
        <div className="mt-12">
          <div className="relative border-l-4 border-primary ml-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-10 ml-8">
                <div className="absolute w-6 h-6 bg-primary rounded-full -left-3.5 border-4 border-background"></div>
                <p className="text-sm font-semibold text-primary">{exp.date}</p>
                <h3 className="text-2xl font-bold text-foreground">{exp.role}</h3>
                <h4 className="text-lg font-semibold text-muted-foreground">
                  {exp.company} - 📍 {exp.location}
                </h4>
                <p className="mt-2 text-foreground italic">{exp.summary}</p>
                <ul className="mt-4 list-disc list-inside space-y-2 text-muted-foreground">
                  {exp.responsibilities.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;