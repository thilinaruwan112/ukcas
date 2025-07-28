import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import FeaturedInstitutes from '@/components/home/FeaturedInstitutes';
import Cta from '@/components/home/Cta';
import Counters from '@/components/home/Counters';
import WhyChooseUs from '@/components/home/WhyChooseUs';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Counters />
      <WhyChooseUs />
      <FeaturedInstitutes />
      <Cta />
    </div>
  );
}
