import React from 'react';
import { Timeline, TimelineItem } from './ui/timeline';

interface Responsibility {
  point: string;
  subPoints?: string[];
}

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  summary: string;
  responsibilities: Responsibility[];
  startDate: string; // ISO string
  endDate: string | null; // ISO string or null for "Present"
}

// Helper to format date range
function formatDateRange(startDate: string, endDate: string | null) {
  const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const end = endDate
    ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Present';
  return `${start} - ${end}`;
}

const ResponsibilitiesList = ({ items }: { items: Responsibility[] }) => (
  <ul className="list-disc list-outside space-y-2 pl-4 text-muted-foreground">
    {items.map((resp, i) => (
      <li key={i}>
        {resp.point}
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
    title: formatDateRange(exp.startDate, exp.endDate),
    content: (
      <div className="bg-muted p-6 rounded-lg border border-primary/10 shadow-sm">
        <h4 className="text-xl font-semibold text-foreground">{exp.role}</h4>
        <p className="font-medium text-primary mt-1">{exp.company} - 📍 {exp.location}</p>
        <p className="italic my-4 text-muted-foreground">{exp.summary}</p>
        <div className="border-t border-muted-foreground/20 my-4"></div>
        <h5 className="font-semibold text-foreground mb-2">Key Responsibilities:</h5>
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