import React from 'react';
import DynamicIcon from './DynamicIcon'; // Import our new dynamic component

// Define the shape of the data from the API
interface Skill {
  id: number;
  name: string;
  icon: string;
  category: string;
}

interface SkillCategory {
  '@id': string;
  id: number;
  title: string;
  icon: string;
  skills: Skill[];
}

// Fetch and group the data
async function getGroupedSkills(): Promise<SkillCategory[]> {
  try {
    const categoriesUrl = `${process.env.API_BASE_URL}/api/skill_categories`;
    const skillsUrl = `${process.env.API_BASE_URL}/api/skills`;

    const [categoriesRes, skillsRes] = await Promise.all([
      fetch(categoriesUrl, { next: { revalidate: 3600 } }),
      fetch(skillsUrl, { next: { revalidate: 3600 } }),
    ]);

    if (!categoriesRes.ok || !skillsRes.ok) {
      throw new Error('Failed to fetch skills or categories');
    }

    const categoriesData = await categoriesRes.json();
    const skillsData = await skillsRes.json();

    // console.log('--- Successful API Response (data) ---', JSON.stringify(categoriesData, null, 2));
    // console.log('--- Successful API Response (data) ---', JSON.stringify(skillsData, null, 2));

    const categories = categoriesData['hydra:member'] || [];
    const allSkills = skillsData['hydra:member'] || [];

    // Group the flat list of skills into their respective categories
    const groupedSkills = categories.map((category: any) => ({
      ...category,
      skills: allSkills.filter((skill: Skill) => skill.category === category['@id']),
    }));

    return groupedSkills;
  } catch (error) {
    console.error('--- Error in getGroupedSkills function ---', error);
    return []; 
  }
}

// The main async component that renders everything
const Skills = async () => {
  const skillCategories = await getGroupedSkills();

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Skills & Expertise</h2>

        {skillCategories.length === 0 ? (
          <p className="text-center mt-8 text-muted-foreground">Could not load skills at this time.</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category) => (
              <div 
                key={category.id}
                className="bg-muted p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <DynamicIcon name={category.icon} className="text-primary text-3xl" />
                  <h3 className="text-xl font-bold ml-3 text-foreground">{category.title}</h3>
                </div>
                
                <ul className="space-y-4">
                  {category.skills && category.skills.map((skill) => (
                    <li key={skill.id} className="flex items-center text-muted-foreground">
                      <DynamicIcon name={skill.icon} className="text-primary mr-3 text-xl" />
                      <span>{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;