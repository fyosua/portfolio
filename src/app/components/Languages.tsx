import React from 'react';

// Define the shape of the data from the API
interface Language {
  id: number;
  lang: string;
  level: string;
}

// Fetches the data from your API
async function getLanguages(): Promise<Language[]> {
  try {
    const fetchUrl = `${process.env.API_BASE_URL}/api/languages`;
    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error('Failed to fetch languages');
    const data = await res.json();
    return data['hydra:member'] || [];
  } catch (error) {
    console.error('--- Error in getLanguages function ---', error);
    return [];
  }
}

const Languages = async () => {
  const languagesData = await getLanguages();

  return (
    <section id="languages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Languages</h2>
        {languagesData.length > 0 ? (
          <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {languagesData.map((lang) => (
              <div key={lang.id} className="bg-muted p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-primary">{lang.lang}</h3>
                <p className="text-muted-foreground">{lang.level}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-8 text-muted-foreground">Could not load language data.</p>
        )}
      </div>
    </section>
  );
};

export default Languages;