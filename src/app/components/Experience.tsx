import React from 'react';
import { Timeline, TimelineItem } from './ui/timeline';

// Interface for API data
interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  date: string;
  summary: string;
  responsibilities: string[];
}

// Fetches the data from your API (this function remains the same)
async function getExperiences(): Promise<Experience[]> {
  try {
    const fetchUrl = `${process.env.API_BASE_URL}/api/experiences`;
    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error('Failed to fetch experiences');
    const data = await res.json();
    return data['hydra:member'] || [];
  } catch (error) {
    console.error('--- Error in getExperiences function ---', error);
    return [];
  }
}

const Experience = async () => {
  const experiences = await getExperiences();

  // Format the API data into the rich structure the Timeline component needs
  const timelineItems: TimelineItem[] = experiences.map(exp => ({
    id: exp.id,
    title: exp.date, // The date will be the sticky title on the side
    content: (
      <div className="bg-muted p-6 rounded-lg border border-primary/10 shadow-sm">
        <h4 className="text-xl font-semibold text-foreground">{exp.role}</h4>
        <p className="font-medium text-primary mt-1">{exp.company} - 📍 {exp.location}</p>
        <p className="italic my-4 text-muted-foreground">{exp.summary}</p>
        <div className="border-t border-muted-foreground/20 my-4"></div>
        <h5 className="font-semibold text-foreground mb-2">Key Responsibilities:</h5>
        <ul className="list-disc list-outside space-y-2 pl-4 text-muted-foreground">
          {exp.responsibilities.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Work Experience</h2>
        <div className="mt-8">
          {timelineItems.length > 0 ? (
            <Timeline items={timelineItems} />
          ) : (
            <p className="text-center text-muted-foreground">Could not load work experience at this time.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;