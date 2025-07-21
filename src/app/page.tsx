import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Education from './components/Education';
import Languages from './components/Languages';
import CVGenerator from './components/CVGenerator';
import ScrollToTopButton from './components/ScrollToTopButton';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content - Mobile responsiveness adjustments */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Hi, I'm <span className="text-primary">Yosua Ferdian</span>
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-muted-foreground">
                Google Technical Solutions & Web FullStack Developer
              </h2>
              <p className="text-base md:text-lg mb-8 text-muted-foreground">
                Expert in Google Tracking solutions and web development.
              </p>
              {/* Buttons Container - Mobile responsiveness adjustments */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-center md:justify-start">
                <a href="#contact" className="btn-primary">
                  Contact Me
                </a>
                <a href="#experience" className="btn-secondary">
                  My Experience
                </a>
                <CVGenerator />
              </div>
            </div>
            {/* Image Container - Mobile responsiveness adjustments */}
            <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
              <Image
                src="/images/photo_profile.jpg"
                alt="Yosua Ferdian"
                width={400}
                height={400}
                className="rounded-full border-4 border-primary object-cover aspect-square"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <About />
      <Experience />
      <Skills />
      <Education />
      <Languages />
      <Contact />
      <ScrollToTopButton />
    </main>
  );
}
