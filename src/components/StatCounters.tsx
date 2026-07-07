import React, { useState, useEffect } from 'react';
import { Truck, Users, Award, Landmark, Route, HardHat, Calendar, Map, CheckCircle, Clock } from 'lucide-react';

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  description: string;
}

export default function StatCounters() {
  const [counts, setCounts] = useState<Record<string, number>>({
    projects_completed: 0,
    ongoing_projects: 0,
    professional_engineers: 0,
    years_experience: 0,
    satisfied_clients: 0,
    districts_served: 0
  });

  const stats: Stat[] = [
    {
      id: "projects_completed",
      label: "Projects Completed",
      value: 85,
      suffix: "+ Projects",
      icon: <CheckCircle className="text-secondary w-8 h-8" />,
      description: "Successfully delivered infrastructure, commercial complexes, and public roads."
    },
    {
      id: "ongoing_projects",
      label: "Ongoing Projects",
      value: 14,
      suffix: " Active",
      icon: <HardHat className="text-secondary w-8 h-8" />,
      description: "Active high-priority civil works and structural installations currently under execution."
    },
    {
      id: "professional_engineers",
      label: "Professional Engineers",
      value: 24,
      suffix: " Registered",
      icon: <Users className="text-secondary w-8 h-8" />,
      description: "Highly qualified NCIC and Board of Engineers registered specialists."
    },
    {
      id: "years_experience",
      label: "Years of Experience",
      value: 14,
      suffix: "+ Years",
      icon: <Clock className="text-secondary w-8 h-8" />,
      description: "Fourteen years of engineering excellence and structural integrity in Malawi."
    },
    {
      id: "satisfied_clients",
      label: "Satisfied Clients",
      value: 120,
      suffix: "+ Clients",
      icon: <Award className="text-secondary w-8 h-8" />,
      description: "Government ministries, councils, NGOs, and corporate entities trusting our quality."
    },
    {
      id: "districts_served",
      label: "Districts Served",
      value: 28,
      suffix: " / 28",
      icon: <Map className="text-secondary w-8 h-8" />,
      description: "Active footprint spanning across all 28 administrative districts of Malawi."
    }
  ];

  useEffect(() => {
    const duration = 2000; // ms
    const steps = 50;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      
      setCounts(() => {
        const nextCounts: Record<string, number> = {};
        stats.forEach((stat) => {
          const target = stat.value;
          const current = Math.round((target / steps) * currentStep);
          nextCounts[stat.id] = current > target ? target : current;
        });
        return nextCounts;
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary to-primary/95" />
      <div className="absolute inset-0 geometric-pattern opacity-5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Headings */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-3 mb-3">
            <div className="accent-line"></div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
              Zion Corporate Metrics
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Our Solid Track Record in Infrastructure Delivery
          </h2>
          <p className="text-white/60 text-xs font-light mt-3 leading-relaxed">
            Since our foundation, Zion Projects has maintained an unyielding dedication to standard compliance, physical safety, and successful nation-building.
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="bg-white/[0.03] border border-white/10 border-l-4 border-l-secondary rounded-none p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {/* Icon casing */}
              <div className="p-4 bg-white/5 group-hover:bg-secondary/10 border border-white/10 rounded-none mb-5 transition-colors">
                {stat.icon}
              </div>

              {/* Incremental counter numbers */}
              <div className="text-4xl font-bold text-white tracking-tight flex items-baseline justify-center font-sans">
                <span>{counts[stat.id] || 0}</span>
                <span className="text-secondary font-bold ml-1">{stat.suffix.replace(/[0-9]/g, '')}</span>
              </div>

              {/* Detail definitions */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mt-3">
                {stat.label}
              </h3>
              
              <p className="text-xs text-white/50 mt-2 leading-relaxed font-light">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
