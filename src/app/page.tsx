import Header from './components/Header'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground"> {/* Use theme text color */}
                Hi, I'm <span className="text-primary">Yosua Ferdian</span> {/* Use theme primary color */}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-muted-foreground"> {/* Use theme muted text color */}
                Google Technical Solutions & Web FullStack Developer
              </h2>
              <p className="text-lg mb-8 text-muted-foreground"> {/* Use theme muted text color */}
                Expert in Google Tracking solutions and web development.
              </p>
              <div className="flex gap-4">
                <a href="#contact" className="btn-primary">
                  Contact Me
                </a>
                <a href="#experience" className="btn-secondary">
                  My Experience
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/photo_profile.jpg"
                alt="Yosua Ferdian"
                width={400}
                height={400}
                className="rounded-full border-4 border-primary object-cover aspect-square" /* Use theme primary color for border */
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <Experience />
      <Skills />
      <Contact />
    </main>
  )
}