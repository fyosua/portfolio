// src/app/components/Experience.tsx

import React from 'react';

// Paste the updated 'experiences' array from Step 1 here
const experiences = [
  {
    role: 'Technical Specialist - Google Technical Solutions (Rehired)',
    company: 'TDCX',
    location: 'Kuala Lumpur',
    date: 'Sep 2024 - Present',
    summary: 'Rehired to resume responsibilities as a Technical Specialist, highlighting my proven expertise and performance in Google Tracking solutions.',
    responsibilities: [
      'Continue specializing in implementing and managing Google Tracking tools, including Google Ads, Google Analytics, Google Tag Manager, and Google Merchant Center.',
      'Maintain exceptional performance in consulting, technical support, and communication, reinforcing client trust and satisfaction.',
    ],
  },
  {
    role: 'Technical Hosting Support Engineer',
    company: 'PT. World Host Group',
    location: 'Bali',
    date: 'Feb 2024 - Aug 2024',
    summary: 'I excel at promptly resolving diverse client inquiries across hosting services, ensuring uninterrupted operations for our valued clients.',
    responsibilities: [
      'Offered proficient technical support for domains, hosting (shared/VPS), control panels (cPanel, WHM, Plesk, SolidCP), website errors, mail servers, and DNS clusters.',
      'Utilized advanced ticketing systems to manage and prioritize client inquiries efficiently, ensuring prompt resolution.',
      'Engaged with the global English-speaking market through diverse communication channels, including ticketing, calls, and live chat support.',
    ],
  },
  {
    role: 'Technical Specialist - Google Technical Solutions',
    company: 'TDCX',
    location: 'Kuala Lumpur',
    date: 'Sep 2022 - Nov 2023',
    summary: 'Dedicated myself to specializing in Google Tracking products.',
    responsibilities: [
      'Proficiently implemented Google Tracking Tools, including Google Ads, Google Analytics, Google Tag Manager, and Google Merchant Center.',
      'Excelled in providing consulting services with strong business communication and product pitching abilities.',
    ],
  },
  {
    role: 'Back End Developer',
    company: 'PT. Uniktif Media (Unictive)',
    location: 'Jakarta',
    date: 'Feb 2021 - Feb 2022',
    summary: 'Designed and enhanced server-side applications, with proficiency in PHP, JavaScript, and frameworks like Laravel and React.',
    responsibilities: [
      'Prioritized seamless API integration between the website\'s back-end and front-end to optimize user experience.',
      'Skilled in deploying websites via Nginx, configuring SSL, and occasionally using PM2 for deployment management.',
      'Successfully implemented mail server setups for CMS systems, facilitating user management, invitations, and order notifications.',
      'Expertise in data infrastructure enables swift and accurate analysis of technical documents.',
    ],
  },
  {
    role: 'IT Support',
    company: 'PT Dewaweb',
    location: 'Jakarta',
    date: 'Feb 2018 - Feb 2019',
    summary: 'Committed to providing high-quality IT support, delivering technical assistance via phone and email within a CRM system.',
    responsibilities: [
      'Troubleshot and resolved issues within server products including cPanel, WHMPanel, CloudFlare, and SSL, primarily for WordPress websites.',
      'Skilled in utilizing CRM systems like WHMCS in hosting support environments.',
      'Possess knowledge in domain management, DNS record systems, and various payment platforms.',
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Work Experience</h2>
        <div className="mt-12">
          <div className="relative border-l-4 border-primary ml-4">
            {experiences.map((exp, index) => (
              <div key={index} className="mb-10 ml-8">
                <div className="absolute w-6 h-6 bg-primary rounded-full -left-3.5 border-4 border-background"></div>
                <p className="text-sm font-semibold text-primary">{exp.date}</p>
                <h3 className="text-2xl font-bold text-foreground">{exp.role}</h3>
                {/* MODIFICATION IS ON THE LINE BELOW */}
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