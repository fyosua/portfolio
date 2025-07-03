import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './ThemeSwitch'

export default function Header() {
  return (
    <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/images/logo.png" 
            alt="Yosua Ferdian Logo"
            width={40}
            height={40}
            className="rounded-full object-cover h-10 w-10 border-2 border-primary dark:border-secondary"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Yosua Ferdian
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            {['Experience', 'Skills', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
