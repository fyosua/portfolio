import React from 'react';
import { Timeline, TimelineItem } from './ui/timeline';

// Updated interface to match the ideal data structure
interface Responsibility {
  point: string;
  subPoints?: string[];
}

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  date: string;
  summary: string;
  responsibilities: Responsibility[]; // It's an array of objects
}

// Helper component to render the list
const ResponsibilitiesList = ({ items }: { items: Responsibility[] }) => {
  return (
    <ul className="list-disc list-outside space-y-2 pl-4 text-muted-foreground">
      {items.map((resp, i) => (
        <li key={i}>
          {resp.point}
          {/* If there are sub-points, render a nested ordered list */}
          {resp.subPoints && resp.subPoints.length > 0 && (
            <ol className="list-decimal list-inside mt-2 space-y-1 pl-4">
              {resp.subPoints.map((subPoint, j) => (
                <li key={j}>{subPoint}</li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ul>
  );
};

async function getExperiences(): Promise<Experience[]> {
  try {
    const fetchUrl = `${process.env.API_BASE_URL}/api/experiences`;
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
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

  const timelineItems: TimelineItem[] = experiences.map(exp => ({
    id: exp.id,
    title: exp.date,
    content: (
      <div className="bg-muted p-6 rounded-lg border border-primary/10 shadow-sm">
        <h4 className="text-xl font-semibold text-foreground">{exp.role}</h4>
        <p className="font-medium text-primary mt-1">{exp.company} - 📍 {exp.location}</p>
        <p className="italic my-4 text-muted-foreground">{exp.summary}</p>
        <div className="border-t border-muted-foreground/20 my-4"></div>
        <h5 className="font-semibold text-foreground mb-2">Key Responsibilities:</h5>
        {/* The component now receives an array of objects directly */}
        <ResponsibilitiesList items={exp.responsibilities} />
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