import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSlide {
  image: string;
  tagline: string;
  title: string;
  description: string;
  primaryAction: { label: string; view: string };
  secondaryAction: { label: string; view: string };
}

interface HeroSliderProps {
  onNavigate: (view: string) => void;
  slides?: HeroSlide[];
}

export default function HeroSlider({ onNavigate, slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const fallbackSlides: HeroSlide[] = [
    {
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600",
      tagline: "ZION PROJECTS CONSTRUCTION LTD",
      title: "Building Malawi's Future Through Engineering Excellence",
      description: "Zion Projects Construction Ltd delivers high-quality civil engineering, infrastructure development, building construction, and project management services across Malawi while serving regional and international clients with professionalism, innovation, and integrity.",
      primaryAction: { label: "Request a Quote", view: "quote-builder" },
      secondaryAction: { label: "View Our Projects", view: "projects" }
    },
    {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600",
      tagline: "VERTICAL ARCHITECTURE & TOWERS",
      title: "Pioneering Modern Commercial Landmarks",
      description: "From post-tension concrete skyscrapers to state-of-the-art office plazas. We shape the skylines of Lilongwe and Blantyre with zero-compromise engineering integrity.",
      primaryAction: { label: "Get Estimation", view: "quote-builder" },
      secondaryAction: { label: "Learn About Zion", view: "about" }
    },
    {
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1600",
      tagline: "BRIDGES & REINFORCED STRUCTURES",
      title: "Connecting Communities Safely Across Rivers",
      description: "Specialized in deep pile foundation drillings, monolithic abutment casting, and heavy pre-stressed concrete girder systems securing seasonal river flood crossings.",
      primaryAction: { label: "Request Quote", view: "quote-builder" },
      secondaryAction: { label: "Meet Our Engineers", view: "about" }
    }
  ];

  const heroSlides = slides && slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  const handleNav = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-[550px] md:h-[680px] bg-primary overflow-hidden hero-mask">
      
      {/* Slide Images & Backdrop overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0.2, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.2 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={heroSlides[current].image}
            alt={heroSlides[current].title}
            className="w-full h-full object-cover"
          />
          {/* Elegant Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/30" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Construction Mesh Design */}
      <div className="absolute inset-0 geometric-pattern opacity-10 pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content Layer */}
      <div className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-16 lg:px-24 pb-12">
        <div className="max-w-3xl text-white flex flex-col gap-4">
          
          <motion.div
            key={`tag-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="accent-line"></div>
            <span className="text-secondary text-xs font-semibold uppercase tracking-[0.4em]">
              {heroSlides[current].tagline}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-3xl"
          >
            {(() => {
              const parts = heroSlides[current].title.split(', ');
              if (parts.length > 1) {
                return (
                  <>
                    {parts[0]}, <br />
                    <span className="text-secondary italic">{parts.slice(1).join(', ')}</span>
                  </>
                );
              }
              const hyphenParts = heroSlides[current].title.split(' - ');
              if (hyphenParts.length > 1) {
                return (
                  <>
                    {hyphenParts[0]} <br />
                    <span className="text-secondary italic">{hyphenParts.slice(1).join(' - ')}</span>
                  </>
                );
              }
              return heroSlides[current].title;
            })()}
          </motion.h1>

          <motion.p
            key={`desc-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-sm md:text-base leading-relaxed font-light max-w-xl mt-2"
          >
            {heroSlides[current].description}
          </motion.p>

          <motion.div
            key={`actions-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mt-6"
          >
            <button
              onClick={() => handleNav(heroSlides[current].primaryAction.view)}
              className="bg-secondary text-primary px-10 py-4 font-bold uppercase tracking-widest text-xs hover:translate-y-[-2px] transition-all shadow-xl shadow-secondary/20 rounded-none border border-secondary cursor-pointer"
            >
              <span>{heroSlides[current].primaryAction.label}</span>
            </button>
            <button
              onClick={() => handleNav(heroSlides[current].secondaryAction.view)}
              className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all rounded-none cursor-pointer"
            >
              <span>{heroSlides[current].secondaryAction.label}</span>
            </button>
          </motion.div>

        </div>
      </div>

      {/* Manual Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-primary/40 hover:bg-secondary hover:text-primary border border-white/10 rounded-full text-white transition-all cursor-pointer hidden md:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary/40 hover:bg-secondary hover:text-primary border border-white/10 rounded-full text-white transition-all cursor-pointer hidden md:flex"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-1.5 rounded transition-all ${
              i === current ? 'bg-secondary w-6' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
