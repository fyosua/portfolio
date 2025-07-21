'use client';

import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-4">Dashboard Overview</h1>
      <p className="text-muted-foreground">
        Welcome to your portfolio's admin panel. From here, you can manage all the content on your live website.
      </p>
      <div className="mt-8 p-6 bg-background rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Next Steps</h2>
        <p className="mt-2 text-muted-foreground">
          Use the sidebar to navigate to the "Experience" or "Skills" sections to begin managing your data.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;