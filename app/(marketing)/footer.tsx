import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Footer() {
  const languages: { src: string; alt: string; label: string }[] = [
    { src: './hr.svg', alt: 'hr', label: 'Croatian' },
    { src: './es.svg', alt: 'es', label: 'Spanish' },
    { src: './fr.svg', alt: 'fr', label: 'French' },
    { src: './it.svg', alt: 'it', label: 'Italian' },
    { src: './jp.svg', alt: 'jp', label: 'Japanese' }
  ];
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        {languages.map(language => (
          <Button size="lg" variant="ghost" className="w-full">
             <Image
              src={language.src}
              alt={language.alt}
              height={32}
              width={40}
              className="mr-4"
            />
            {language.label}
          </Button>
        ))}
      </div>
    </footer>
  );
}
