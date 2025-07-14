import React from 'react';

// Fetch the data
async function getAboutContent(): Promise<string> {
  try {
    const fetchUrl = `${process.env.API_BASE_URL}/api/abouts`;
    const res = await fetch(fetchUrl);

    if (!res.ok) {
      throw new Error('Failed to fetch about content');
    }

    const data = await res.json();
    
    return data['hydra:member']?.[0]?.content || '';

  } catch (error) {
    console.error('--- Error in getAboutContent function ---', error);
    return ''; // Return an empty string on error
  }
}

// The component is async to allow for data fetching before rendering
const About = async () => {
  const aboutContent = await getAboutContent();

  return (
    <section id="about" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="section-title">About Me</h2>
        <div className="max-w-3xl mx-auto mt-8 text-center">
          {aboutContent ? (
            <p className="text-lg text-muted-foreground">
              {aboutContent}
            </p>
          ) : (
            <p className="text-lg text-muted-foreground">
              Could not load summary at this time.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;