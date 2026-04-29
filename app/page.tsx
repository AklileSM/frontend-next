import { ContactForm } from '@/components/landing/ContactForm';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LandingNav } from '@/components/landing/LandingNav';

export default function LandingPage() {
  return (
    <div className="grain relative min-h-screen overflow-hidden bg-base-950">
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
