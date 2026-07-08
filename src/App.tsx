import React, { useState, useEffect } from 'react';
import { 
  Building2, HardHat, Route, Layers, Droplets, ShieldAlert, Truck, 
  MapPin, Phone, Mail, Clock, ArrowRight, MessageSquare, ChevronDown, 
  Calendar, Award, User, Download, FileText, CheckCircle2, Sparkles, 
  Lock, ArrowLeft, ArrowRightLeft, BookOpen, MessageCircle, HelpCircle, 
  Search, Shield, Users, Info, ChevronRight, Eye, EyeOff, Send, Moon, Sun, Loader2,
  CreditCard, DollarSign, ThumbsUp, Zap, X, RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSlider from './components/HeroSlider';
import StatCounters from './components/StatCounters';
import QuoteForm from './components/QuoteForm';
import { 
  CompanyInfo, Service, Project, ProjectCategory, GalleryItem, Album, 
  Blog, Testimonial, ClientPartner, TeamMember, Vacancy, Application, 
  Download as DownloadType, ContactMessage, QuoteRequest, WebsiteSettings, User as UserType, RegistrationCertificate
} from './types';

interface TechSpec {
  applications: string;
  compliance: string;
  equipment: string;
  lifetime: string;
  deliverables: string;
  materials: string;
  qualityControl: string;
}

const serviceSpecs: Record<string, TechSpec> = {
  "srv-1": {
    applications: "Commercial Office Towers, Warehouses, Residential Estates, Institutional Structures",
    compliance: "MBS (Malawi Bureau of Standards) Construction Codes, BS 8110 (Structural Concrete)",
    equipment: "Tower Cranes, Batching Plants, Concrete Boom Pumps, Total Stations, Scaffolding Systems",
    lifetime: "60+ Years (Reinforced Concrete Structural Lifetime)",
    deliverables: "Excavation & Foundations, RC Columns/Beams, Masonry Walling, MEP Integration, Premium Finishes",
    materials: "CEM II 42.5N Cement, High-Tensile Steel Rebar (Y12-Y25), Double-Bitumen Damp Proof Courses",
    qualityControl: "Concrete Slump & Cube Compression Tests (7/28 days), Steel Tensile Certifications, Weld X-Rays"
  },
  "srv-2": {
    applications: "National Trunk Highways, Inter-City Arterial Corridors, Municipal Avenues, Earthworks",
    compliance: "NCIC Grade-A Guidelines, SATCC (Southern African Transport and Communications Commission)",
    equipment: "Motor Graders, Double-Drum Asphalt Vibratory Rollers, Bitumen Distributors, Hydraulic Excavators, Pavers",
    lifetime: "25 - 30 Years (Asphalt Concrete Pavement Life)",
    deliverables: "Sub-grade Stabilization, G1-G3 Crushed Stone Base Course, Prime Coat Spraying, Asphalt Concrete Surfacing",
    materials: "60/70 Pen Bitumen, Cationic Asphalt Emulsions, Granite Aggregate (Base/Surfacing Fractions), Hydrated Lime",
    qualityControl: "Nuclear Gauge Moisture-Density Tests (Proctor), Marshall Stability Testing, Core Drilling thickness"
  },
  "srv-3": {
    applications: "Reinforced Concrete Girder Bridges, Box Culverts, Elevated Pedestrian Crossing Decks, Abutments",
    compliance: "AASHTO Bridge Design Specifications, BS 5400 (Steel, Concrete & Composite Bridges)",
    equipment: "Rotary Piling Rigs, Heavy Crane Launchers, Concrete Vibrators, Hydrological Flow Bypass Pumps",
    lifetime: "100+ Years (Extreme Hydraulic Structural Resilience)",
    deliverables: "Piling Foundations (10-15m depth), Abutment/Pier Castings, Pre-stressed Concrete Beam Launching",
    materials: "CEM I 52.5R High-Early-Strength Cement, Elastomeric Bearing Pads, High-Yield Pre-stressing Strands",
    qualityControl: "Integrity Piling Tests, Ultrasonic Void Detection, Hydrological Scour Depth Verification"
  },
  "srv-4": {
    applications: "Potable Water Distribution Pipelines, Elevated Steel Reservoirs, Storm-water Canals, Borehole Networks",
    compliance: "Ministry of Water & Sanitation Standards, WHO Drinking Water Guidelines, MBS Piping Standards",
    equipment: "Trenching Excavators, Butt-Fusion HDPE Welding Machines, Pressure Hydrostatic Pump Testers",
    lifetime: "40+ Years (Corrosion-Resistant Piping Infrastructure)",
    deliverables: "Trench Excavation & Sand Bedding, HDPE/PVC Pipeline Laying, Tank Towers Erecting, Flow Meter Stations",
    materials: "Class 12/16 HDPE Pipes, Stainless Steel Valves, Epoxy-Coated Structural Steel, Solar Pumping Kits",
    qualityControl: "Hydrostatic Pipeline Pressure Test, Bacterial Water Quality Tests, Concrete Channel Flow Rates"
  },
  "srv-5": {
    applications: "Gravity Sewage Mainlines, Residential Sewer Collectors, Waste Stabilization Ponds, Dosing Units",
    compliance: "Malawi Environmental Protection Act (MEPA) Guidelines, MBS Sewage Treatment Standards",
    equipment: "Deep-Trench Excavators, Heavy Trench Shoring Systems, Sewage Inflow Pumping Units",
    lifetime: "50+ Years (Sewerage Reticulation Networks)",
    deliverables: "Gravity pipeline gradient setting, Brick/Concrete Manhole Construction, Treatment Pond Excavation",
    materials: "Structured-Wall HDPE Sewer Pipes, Cast Iron Manhole Covers, Sulfate-Resistant Cement, Geo-membranes",
    qualityControl: "Air/Water Tightness Gradient Tests, Geo-membrane Seam Leak Tests, Effluent BOD/COD Lab Screening"
  },
  "srv-6": {
    applications: "Aggregates distribution, Contractor material logistics, Site supply chain management",
    compliance: "MBS Aggregate Grading Criteria, NCIC Quarry Standards, Malawi Roads Axle Load Limits",
    equipment: "15-30 Tonne Tipper Trucks, Front-end Wheeled Loaders, Aggregate Screening & Washing Plants",
    lifetime: "N/A (Continuous supply & batching service delivery)",
    deliverables: "Granite Aggregate Dispatch, River Sand Haulage, Wholesale Cement Logistics, Rebar Consignments",
    materials: "19mm/25mm Crushed Aggregate, Quarry Dust, SABS Portland Cement, Hot-Rolled Deformed Steel Rebars",
    qualityControl: "Aggregate Crushing Value (ACV) Tests, Sieve Particle Distribution Grading, Moisture Content Testing"
  }
};

const getServiceSpecs = (srv: Service) => {
  if (serviceSpecs[srv.id]) {
    return serviceSpecs[srv.id];
  }
  return {
    applications: srv.shortDescription || "General construction and engineering applications.",
    compliance: "Malawi Bureau of Standards (MBS) Standard Specifications & NCIC Grade-A Guidelines",
    equipment: "Heavy Excavators, Compactor Rollers, Concrete Mixers, Support Fleet, Safety Gear",
    lifetime: "35+ Years (Resilient Infrastructure Standard Lifetime)",
    deliverables: "Site Layout, Material Logistics, Foundation Earthworks, Structural Assembly, Inspection",
    materials: "Grade-A Structural Materials, Premium Portland Cement, Reinforced Deformed Bars",
    qualityControl: "NCIC Quality Inspections, Standard Density Tests, Materials Compliance Clearance"
  };
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // Core Corporate States
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clients, setClients] = useState<ClientPartner[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [certificates, setCertificates] = useState<RegistrationCertificate[]>([]);

  // Authentication & Session
  const [adminUser, setAdminUser] = useState<UserType | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // UI state controllers
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [projectRegionFilter, setProjectRegionFilter] = useState<string[]>(['all']);
  const [projectDistrictFilter, setProjectDistrictFilter] = useState<string>('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredRegionName, setHoveredRegionName] = useState<string | null>(null);
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);
  const [showMapLegend, setShowMapLegend] = useState<boolean>(true);
  const [mapZoom, setMapZoom] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);
  const [activeJobDetail, setActiveJobDetail] = useState<Vacancy | null>(null);
  const [activeBlogDetail, setActiveBlogDetail] = useState<Blog | null>(null);

  // Compliance / Certifications States
  const [certCategory, setCertCategory] = useState<string>('all');
  const [certSearch, setCertSearch] = useState<string>('');
  const [verifyInput, setVerifyInput] = useState<string>('');
  const [verifiedCert, setVerifiedCert] = useState<any | null>(null);
  const [verifyError, setVerifyError] = useState<string>('');
  const [inspectedCert, setInspectedCert] = useState<any | null>(null);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Contact Form Submission States
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');
  const [submittedContactSnapshot, setSubmittedContactSnapshot] = useState<any>(null);

  // Job Application State
  const [applyForm, setApplyForm] = useState({ fullName: '', email: '', phone: '', coverLetter: '', cvFileName: '' });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  // Blog Comment State
  const [commentForm, setCommentForm] = useState({ authorName: '', authorEmail: '', content: '' });
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Cookie consent banner
  const [showCookie, setShowCookie] = useState(true);

  // Service Comparison States
  const [serviceAId, setServiceAId] = useState<string>('srv-1');
  const [serviceBId, setServiceBId] = useState<string>('srv-2');

  const toggleRegionFilter = (region: string) => {
    setProjectRegionFilter(prev => {
      if (region === 'all') {
        return ['all'];
      }
      let next = prev.filter(r => r !== 'all');
      if (next.includes(region)) {
        next = next.filter(r => r !== region);
      } else {
        next.push(region);
      }
      if (next.length === 0) {
        return ['all'];
      }
      return next;
    });
  };

  useEffect(() => {
    fetchInitialData();
    // Restore session if found in localStorage
    const savedUser = localStorage.getItem('zion_admin_user');
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (currentView === 'downloads') {
      setCurrentView('about');
      setTimeout(() => {
        const el = document.getElementById('compliance-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [currentView]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const mapContainer = document.getElementById('malawi-map-container');
      if (mapContainer && !mapContainer.contains(e.target as Node)) {
        setHoveredRegion(null);
        setHoveredRegionName(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [
        resComp, resSrv, resProj, resCats, resGal, 
        resAlb, resBlogs, resTst, resClients, resTeam, 
        resVac, resDl, resSet, resCerts
      ] = await Promise.all([
        fetch('/api/company-info').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/project-categories').then(r => r.json()),
        fetch('/api/gallery').then(r => r.json()),
        fetch('/api/albums').then(r => r.json()),
        fetch('/api/blogs').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/clients').then(r => r.json()),
        fetch('/api/team').then(r => r.json()),
        fetch('/api/vacancies').then(r => r.json()),
        fetch('/api/downloads').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/certificates').then(r => r.json())
      ]);

      setCompanyInfo(resComp);
      setServices(resSrv);
      setProjects(resProj);
      setCategories(resCats);
      setGallery(resGal);
      setAlbums(resAlb);
      setBlogs(resBlogs);
      setTestimonials(resTst);
      setClients(resClients);
      setTeam(resTeam);
      setVacancies(resVac);
      setDownloads(resDl);
      setSettings(resSet);
      setCertificates(resCerts);
    } catch (err) {
      console.error("Failed to connect with database API. Server likely boot-building.", err);
    } finally {
      setLoading(false);
    }
  };

  // Staff Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok) {
        setAdminUser(data.user);
        localStorage.setItem('zion_admin_user', JSON.stringify(data.user));
        setLoginForm({ username: '', password: '' });
        setCurrentView('admin');
      } else {
        setLoginError(data.error || 'Access denied.');
      }
    } catch (err) {
      setLoginError('Server authentication system offline.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zion_admin_user');
    setAdminUser(null);
    setCurrentView('home');
  };

  // Inquiry form submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess('');
    setContactError('');
    setContactLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (res.ok) {
        setContactSuccess(data.message);
        setSubmittedContactSnapshot({ ...contactForm });
        setContactForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        setContactError(data.error || 'Failed to dispatch inquiry.');
      }
    } catch (err) {
      setContactError('Database transmission failure. Check network.');
    } finally {
      setContactLoading(false);
    }
  };

  // Vacancy Application submit
  const handleJobApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobDetail) return;
    setApplyLoading(true);
    setApplySuccess('');

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vacancyId: activeJobDetail.id,
          ...applyForm,
          cvFileName: applyForm.cvFileName || 'Resume_Attached.pdf'
        })
      });
      if (res.ok) {
        setApplySuccess("Application portfolio dispatched successfully! HR will review soon.");
        setApplyForm({ fullName: '', email: '', phone: '', coverLetter: '', cvFileName: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplyLoading(false);
    }
  };

  // Blog Comment Submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBlogDetail) return;
    try {
      const res = await fetch(`/api/blogs/${activeBlogDetail.slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm)
      });
      if (res.ok) {
        setCommentSuccess(true);
        setCommentForm({ authorName: '', authorEmail: '', content: '' });
        // Reload blog details to show new comment
        const updated = await fetch(`/api/blogs/${activeBlogDetail.slug}`).then(r => r.json());
        setActiveBlogDetail(updated);
        setTimeout(() => setCommentSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-8 h-8" />;
      case 'Road': return <Route className="w-8 h-8" />;
      case 'Layers': return <Layers className="w-8 h-8" />;
      case 'Droplets': return <Droplets className="w-8 h-8" />;
      case 'ShieldAlert': return <ShieldAlert className="w-8 h-8" />;
      case 'Truck': return <Truck className="w-8 h-8" />;
      default: return <Building2 className="w-8 h-8" />;
    }
  };

  const handleProjectDetailClick = (proj: Project) => {
    setActiveProjectDetail(proj);
  };

  const handleBlogClick = async (slug: string) => {
    try {
      const b = await fetch(`/api/blogs/${slug}`).then(r => r.json());
      setActiveBlogDetail(b);
      setCurrentView('single-blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(proj => {
    const matchesCategory = projectFilter === 'all' || proj.categoryId === projectFilter;
    const matchesRegion = projectRegionFilter.includes('all') || (proj.region && projectRegionFilter.includes(proj.region));
    const matchesDistrict = projectDistrictFilter === 'all' || proj.district === projectDistrictFilter;
    const matchesStatus = projectStatusFilter === 'all' || proj.status === projectStatusFilter;
    return matchesCategory && matchesRegion && matchesDistrict && matchesStatus;
  });

  const filteredGallery = galleryFilter === 'all'
    ? gallery
    : gallery.filter(g => g.albumId === galleryFilter);

  const filteredCerts = certificates.filter(cert => {
    const matchesCategory = certCategory === 'all' || cert.category === certCategory;
    const matchesSearch = certSearch === '' || 
      cert.title.toLowerCase().includes(certSearch.toLowerCase()) ||
      cert.number.toLowerCase().includes(certSearch.toLowerCase()) ||
      cert.authority.toLowerCase().includes(certSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVerifyCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setVerifiedCert(null);
    
    if (!verifyInput.trim()) {
      setVerifyError('Please enter a certificate or registration number.');
      return;
    }
    
    const found = certificates.find(
      c => c.number.toLowerCase() === verifyInput.trim().toLowerCase() ||
           c.title.toLowerCase().includes(verifyInput.trim().toLowerCase())
    );
    
    if (found) {
      setVerifiedCert(found);
    } else {
      setVerifyError('No matching legal registration found for the entered number. Try entering a code like "NCIC-CIV-G1-90412" or "C-1224/2012".');
    }
  };

  const selectCertIcon = (cat: string) => {
    switch (cat) {
      case 'Legal & Incorporation':
        return <Shield className="w-5 h-5 text-indigo-500" />;
      case 'NCIC Construction Licenses':
        return <HardHat className="w-5 h-5 text-amber-500" />;
      case 'Tax & Municipal':
        return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'Safety & Professional':
        return <Award className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#222222] font-sans flex flex-col justify-between">
      
      {/* 1. STICKY TOP CORPORATE NAVIGATION BAR */}
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        companyInfo={companyInfo}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* 2. LOADER SPINNER IF SYNCHRONIZING CORE METRICS */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-primary">
          <Loader2 className="animate-spin text-secondary w-12 h-12 mb-4" />
          <h3 className="text-lg font-black uppercase tracking-widest">Constructing Viewport...</h3>
          <p className="text-xs text-gray-400 mt-1">Downloading specifications from Zion Projects databases.</p>
        </div>
      ) : (
        /* CORE FRONT-END SCREEN CONTROLLER */
        <main className="flex-1 flex flex-col">

          {/* ==================================================
              HOME PORTAL VIEW
              ================================================== */}
          {currentView === 'home' && (
            <div className="animate-fade-in space-y-0">
              
              {/* Massive Animated Hero Slider */}
              <HeroSlider onNavigate={setCurrentView} />

              {/* Company Overview Brief */}
              <section className="py-20 px-4 md:px-8 bg-white max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Corporate info panel */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="accent-line"></div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                        WHO WE ARE
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight leading-tight">
                      Pioneering Resilient Civil Works and Building Solutions
                    </h2>
                    
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Zion Projects Construction Ltd is a leading Grade-A civil engineering and construction contractor in Malawi. We specialize in planning, designing, and constructing high-impact physical infrastructure including public highways, durable bridge systems, large-scale commercial facilities, and municipal water logistics networks.
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Armed with modern fleet machinery, certified materials, and an experienced engineering design team, we operate in strict compliance with the National Construction Industry Council (NCIC) and the Malawi Bureau of Standards (MBS) to build structures that stand the test of time.
                    </p>
                  </div>

                  {/* Visual block representing core values */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {companyInfo?.coreValues.map((val, idx) => (
                      <div key={idx} className="bg-gray-50 p-6 rounded-none border border-gray-100 border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-all">
                        <div className="w-8 h-8 bg-primary text-secondary flex items-center justify-center rotate-45 mb-4 text-xs font-bold border border-secondary/30">
                          <span className="-rotate-45">{idx + 1}</span>
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-wide text-primary">{val.title}</h4>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed font-light">{val.description}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </section>

              {/* Dynamic Services Ribbon */}
              <section className="py-20 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="flex justify-center items-center gap-3 mb-3">
                      <div className="accent-line"></div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                        ENGINEERING CAPABILITIES
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight">
                      Grade-A Construction Services Sourcing
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
                      Zion Projects maintains fully licensed specialists delivering civil roadworks, drainage installations, structural towers, and logistical supplies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((srv) => (
                      <div 
                        key={srv.id} 
                        className="bg-white rounded-none overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all transform hover:-translate-y-1 group border-t-4 border-t-primary hover:border-t-secondary"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img src={srv.image} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4 p-3 bg-primary text-secondary rounded-none shadow-md border border-white/10">
                            {selectServiceIcon(srv.icon)}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-primary group-hover:text-secondary transition-colors">{srv.title}</h3>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed font-light">{srv.shortDescription}</p>
                          </div>
                          <button 
                            onClick={() => { setCurrentView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-secondary transition-colors cursor-pointer self-start"
                          >
                            <span>Learn Details</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Dynamic Counters Indicator ribbon */}
              <StatCounters />

              {/* Featured Projects Grid */}
              <section className="py-20 px-4 md:px-8 bg-white max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-16">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="accent-line"></div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                        RECOGNIZED LANDMARKS
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight">
                      Featured Engineering Milestones
                    </h2>
                  </div>
                  <button 
                    onClick={() => { setCurrentView('projects'); window.scrollTo({ top: 0 }); }}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer self-start"
                  >
                    <span>View All Portfolio</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.filter(p => p.featured).map((proj) => (
                    <div 
                      key={proj.id} 
                      onClick={() => handleProjectDetailClick(proj)}
                      className="bg-white rounded-none overflow-hidden border border-gray-100 border-t-4 border-t-primary hover:border-t-secondary hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={proj.images[0]?.url} alt={proj.title} className="w-full h-full object-cover" />
                        <span className="absolute top-4 right-4 bg-primary text-secondary font-bold text-[9px] px-2.5 py-1 rounded-none uppercase tracking-wider shadow border border-secondary/35">
                          {proj.status}
                        </span>
                      </div>
                      <div className="p-6">
                        <span className="text-[9px] text-secondary font-bold uppercase tracking-widest">{proj.categoryName}</span>
                        <h3 className="text-sm font-bold text-primary mt-1 uppercase tracking-wide line-clamp-1 group-hover:text-secondary transition-colors">{proj.title}</h3>
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed font-light">{proj.description}</p>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold">
                          <span>Location: {proj.location}</span>
                          <span className="text-primary font-bold uppercase tracking-wider">{proj.budget}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quotation Request Callout Banner */}
              <section className="py-16 bg-primary text-white relative overflow-hidden construction-grid-bg border-y border-secondary/30">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent z-10" />
                <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-20 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="max-w-2xl">
                    <h3 className="text-2xl font-black tracking-tight">Need a Comprehensive Structural Quotation?</h3>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      Leverage our premium client dashboard and instant **Gemini AI Estimator**. Supply your warehouse, highway, or bridge parameters, and receive preliminary engineering challenges and cost guidance immediately.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setCurrentView('quote-builder'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="bg-secondary hover:bg-secondary/90 text-primary hover:text-white font-extrabold text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Launch Quote Wizard
                  </button>
                </div>
              </section>

              {/* Latest News Feed */}
              <section className="py-20 px-4 md:px-8 bg-gray-50 max-w-7xl mx-auto w-full rounded-2xl my-8 border border-gray-100">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded">
                    CONSTRUCTION PRESS
                  </span>
                  <h2 className="text-3xl font-black text-primary mt-3 tracking-tight">
                    Technical Blogs & Milestones
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {blogs.slice(0, 3).map((blog) => (
                    <article 
                      key={blog.id} 
                      onClick={() => handleBlogClick(blog.slug)}
                      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-4 left-4 bg-primary text-white text-[9px] font-bold px-2 py-1 rounded">
                          {blog.categoryName}
                        </span>
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                          <Calendar size={12} />
                          {blog.createdAt}
                        </span>
                        <h3 className="text-xs font-bold text-primary mt-2 group-hover:text-secondary transition-colors leading-snug line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{blog.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* ==================================================
              ABOUT US VIEW
              ================================================== */}
          {currentView === 'about' && (
            <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-16">
              
              {/* Introduction Banner */}
              <div className="bg-primary text-white p-8 md:p-12 rounded-2xl relative overflow-hidden construction-grid-bg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />
                <div className="relative z-10 max-w-xl">
                  <span className="text-xs uppercase font-extrabold text-secondary tracking-widest">ABOUT ZION CORPORATE</span>
                  <h1 className="text-3xl md:text-5xl font-black mt-2 tracking-tight">Malawi's Premier Civil & Building Contractor</h1>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    A registered Grade-A contractor with the National Construction Industry Council (NCIC), committed to delivering durable, high-quality, and standard-compliant construction and engineering services.
                  </p>
                </div>
              </div>

              {/* Company Introduction / History / ABOUT US */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start bg-white p-8 md:p-10 rounded-2xl border border-gray-100">
                <div className="relative h-96 lg:h-full rounded-xl overflow-hidden shadow shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800" 
                    alt="Zion Infrastructure Construction Site" 
                    className="w-full h-full object-cover min-h-[350px]"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-primary/95 text-white p-4 rounded backdrop-blur border border-white/10 shadow-lg">
                    <p className="text-xs font-bold text-secondary">Zion Projects Ltd</p>
                    <p className="text-[9px] uppercase font-bold text-gray-300">Grade-A Civil & Structural Engineering</p>
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-black text-secondary tracking-wider">Corporate Statement</span>
                    <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight mt-1">About Zion Projects Ltd</h2>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed font-medium">
                      {companyInfo?.history}
                    </p>
                  </div>
                  
                  <div className="bg-[#FAF7F2] p-6 rounded-xl border border-[#E9E1CE] text-xs text-primary/90 font-medium">
                    <span className="block text-[10px] uppercase font-black text-secondary tracking-widest mb-1">Our Professional Commitment</span>
                    "To build structures that endure generations, serving as the physical backbone of Malawi's urban and rural development with absolute compliance and zero compromise on safety."
                  </div>
                </div>
              </div>

              {/* Side-by-Side: OUR VISION & OUR MISSION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-2xl shadow-md border border-primary/20 space-y-4">
                  <div className="w-10 h-10 bg-secondary/15 text-secondary rounded-lg flex items-center justify-center font-bold text-lg">
                    V
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-secondary">Our Vision</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    {companyInfo?.vision}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center font-bold text-lg">
                    M
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-primary">Our Mission</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {companyInfo?.mission}
                  </p>
                </div>
              </div>

              {/* Core Values Grid (8 Values) */}
              <div>
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-[10px] uppercase font-black text-secondary tracking-wider bg-secondary/10 px-2.5 py-1 rounded">GUIDING PRINCIPLES</span>
                  <h3 className="text-xl md:text-2xl font-black text-primary mt-2.5 tracking-tight">Our Core Corporate Values</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    How we maintain professional standards, deliver standard-compliant structures, and grow with our local communities.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {companyInfo?.coreValues.map((val, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <div className="text-xs font-black text-secondary bg-secondary/10 w-7 h-7 rounded-full flex items-center justify-center mb-3">
                          {i + 1}
                        </div>
                        <h4 className="text-xs font-black text-primary tracking-wide uppercase">{val.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{val.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What We Do Summary Showcase */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 space-y-8">
                <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-secondary tracking-wider">CAPABILITIES</span>
                    <h3 className="text-xl md:text-2xl font-black text-primary mt-1 tracking-tight">What Zion Projects LTD Does</h3>
                  </div>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed md:text-right">
                    We offer end-to-end engineering and infrastructure construction services under one roof.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Building Construction */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-primary/5 text-primary rounded-lg">
                        <Building2 size={18} className="text-secondary" />
                      </div>
                      <h4 className="text-sm font-extrabold text-primary">Building Construction</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-500 pl-2">
                      <li className="flex items-center gap-2">• Residential buildings</li>
                      <li className="flex items-center gap-2">• Commercial buildings</li>
                      <li className="flex items-center gap-2">• Industrial structures</li>
                      <li className="flex items-center gap-2">• Institutional buildings</li>
                    </ul>
                  </div>

                  {/* Civil Engineering */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-primary/5 text-primary rounded-lg">
                        <Route size={18} className="text-secondary" />
                      </div>
                      <h4 className="text-sm font-extrabold text-primary">Civil Engineering Works</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-500 pl-2">
                      <li className="flex items-center gap-2">• Roads and highways</li>
                      <li className="flex items-center gap-2">• Bridges and culverts</li>
                      <li className="flex items-center gap-2">• Drainage systems</li>
                      <li className="flex items-center gap-2">• Earthworks & site development</li>
                    </ul>
                  </div>

                  {/* Water and Sanitation */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-primary/5 text-primary rounded-lg">
                        <Droplets size={18} className="text-secondary" />
                      </div>
                      <h4 className="text-sm font-extrabold text-primary">Water & Sanitation Projects</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-500 pl-2">
                      <li className="flex items-center gap-2">• Water supply systems</li>
                      <li className="flex items-center gap-2">• Septic tanks & sewerage lines</li>
                      <li className="flex items-center gap-2">• Sewer system integration</li>
                      <li className="flex items-center gap-2">• Construction & contract supervision</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Why Choose Us Section */}
              <div>
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-[10px] uppercase font-black text-secondary tracking-wider bg-secondary/10 px-2.5 py-1 rounded">STRENGTHS</span>
                  <h3 className="text-xl md:text-2xl font-black text-primary mt-2.5 tracking-tight">Why Choose Zion Projects?</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    We deliver quality, reliability, and immense value, ensuring client satisfaction on every contract.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Quality Workmanship", desc: "We maintain high construction standards and attention to detail in every project.", icon: <Award className="text-secondary" size={18} /> },
                    { title: "Technical Expertise", desc: "Our systems integrate advanced civil engineering capabilities and practical experience to deliver elite results.", icon: <HardHat className="text-secondary" size={18} /> },
                    { title: "Timely Project Delivery", desc: "We understand the importance of deadlines and strive to complete projects on schedule.", icon: <Clock className="text-secondary" size={18} /> },
                    { title: "Cost-Effective Solutions", desc: "We provide efficient and practical solutions that maximize value without compromising quality.", icon: <DollarSign className="text-secondary" size={18} /> },
                    { title: "Safety First", desc: "We prioritize safety, environmental health, and standard operating procedures across all sites.", icon: <ShieldAlert className="text-secondary" size={18} /> },
                    { title: "Client-Centered Solutions", desc: "We work closely with clients to understand their needs and deliver tailored infrastructure solutions.", icon: <Layers className="text-secondary" size={18} /> },
                    { title: "Integrity and Transparency", desc: "We conduct our business with honesty, professionalism, and accountability.", icon: <Eye className="text-secondary" size={18} /> },
                    { title: "Reliable Service", desc: "We are committed to building long-term relationships through dependable and consistent performance.", icon: <ThumbsUp className="text-secondary" size={18} /> },
                    { title: "Innovation and Efficiency", desc: "We embrace modern construction methods and technologies to improve project outcomes.", icon: <Zap className="text-secondary" size={18} /> },
                    { title: "Comprehensive Solutions", desc: "From planning and design support to construction and maintenance, we provide end-to-end services.", icon: <Layers className="text-secondary" size={18} /> }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 flex items-start gap-4 shadow-sm">
                      <div className="p-2.5 bg-gray-50 rounded-lg shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-primary uppercase">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Promise & Corporate Bank Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Our Promise */}
                <div className="lg:col-span-1 bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-2xl flex flex-col justify-between border border-primary/20">
                  <div>
                    <span className="text-[10px] uppercase font-black text-secondary tracking-widest">Our Commitment</span>
                    <h3 className="text-xl font-black mt-2 tracking-tight">Our Promise</h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-semibold my-4">
                    "{companyInfo?.ourPromise || "To deliver durable, high-quality projects that meet client expectations while creating lasting value for all stakeholders."}"
                  </p>
                  <div className="text-[9px] uppercase font-extrabold text-secondary tracking-wider">
                    — Zion Projects Construction LTD
                  </div>
                </div>

                {/* Bank Details */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-primary/5 text-primary rounded-lg">
                        <CreditCard size={18} className="text-secondary" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black text-gray-400 block tracking-widest">BILLING & TRANSFERS</span>
                        <h3 className="text-lg font-black text-primary tracking-tight">Official Bank Details</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Authorized banking details for structural project deposits, progress-billing settlements, and contract administration.
                    </p>
                  </div>

                  {companyInfo?.bankDetails ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[9px] uppercase font-black text-gray-400 block">Bank Name</span>
                        <span className="text-xs font-black text-primary">{companyInfo.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-gray-400 block">Account Name</span>
                        <span className="text-xs font-black text-primary">{companyInfo.bankDetails.accountName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-gray-400 block">Account Number</span>
                        <span className="text-xs font-black text-primary font-mono">{companyInfo.bankDetails.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-gray-400 block">Currency</span>
                        <span className="text-xs font-black text-primary">{companyInfo.bankDetails.currency}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-gray-400 block">Branch</span>
                        <span className="text-xs font-black text-primary">{companyInfo.bankDetails.branch}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-800 text-xs rounded-xl border border-yellow-100">
                      Bank details are currently unseeded. Please check companyInfo configuration.
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance & Audit Section (Integrated inside About Us) */}
              <div id="compliance-section" className="border-t border-gray-200 pt-16 space-y-12">
                
                {/* Header Banner */}
                <div className="bg-primary text-white p-8 md:p-12 rounded-none border-l-4 border-l-secondary relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-md">
                  <div className="absolute inset-0 bg-radial-gradient from-secondary/10 to-transparent pointer-events-none" />
                  <div className="space-y-3 max-w-3xl relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary bg-secondary/10 px-3 py-1.5 border border-secondary/30">
                      LEGAL STATUS & AUDIT
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                      Company Registrations & Certifications
                    </h1>
                    <p className="text-xs md:text-sm text-gray-300 font-light max-w-2xl leading-relaxed">
                      Zion Projects Construction Ltd operates in strict compliance with the laws of the Republic of Malawi. Here you can inspect our legal standing, download certified documents, and instantly verify our active Grade-A contractor licenses.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 shrink-0 grid grid-cols-2 gap-6 min-w-[240px] text-center backdrop-blur-sm relative z-10">
                    <div>
                      <span className="block text-2xl font-black text-secondary">Grade-A</span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">NCIC Status</span>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                      <span className="block text-2xl font-black text-emerald-400">100%</span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Tax Compliance</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Category Selector & Verification Panel */}
                  <div className="lg:col-span-4 space-y-8">
                    
                    {/* Interactive Real-time Verification Tool */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
                      <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-5 h-5 text-secondary" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                            Contractor Verification
                          </h3>
                        </div>
                        <p className="text-[10px] text-gray-500 font-light">
                          Verify the authenticity of Zion Projects' credentials against our local database directory.
                        </p>
                      </div>

                      <form onSubmit={handleVerifyCheck} className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter Number (e.g. C-1224/2012)"
                            value={verifyInput}
                            onChange={(e) => setVerifyInput(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-none py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-primary font-mono placeholder:font-sans"
                          />
                          <button
                            type="submit"
                            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-primary text-secondary hover:bg-secondary hover:text-primary transition-all rounded-none cursor-pointer flex items-center justify-center border border-secondary/20"
                          >
                            <Search size={13} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-gray-400 font-medium">Quick examples:</span>
                          <button 
                            type="button" 
                            onClick={() => { setVerifyInput('C-1224/2012'); setVerifyError(''); setVerifiedCert(null); }}
                            className="text-[9px] text-secondary font-bold hover:underline"
                          >
                            C-1224/2012
                          </button>
                          <span className="text-gray-300">|</span>
                          <button 
                            type="button" 
                            onClick={() => { setVerifyInput('NCIC-CIV-G1-90412'); setVerifyError(''); setVerifiedCert(null); }}
                            className="text-[9px] text-secondary font-bold hover:underline"
                          >
                            NCIC-CIV-G1-90412
                          </button>
                        </div>
                      </form>

                      {/* Verification Results Panel */}
                      {verifiedCert && (
                        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-none animate-fade-in space-y-3">
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                                CREDENTIAL VERIFIED
                              </span>
                              <h4 className="text-xs font-bold text-gray-800">{verifiedCert.title}</h4>
                              <p className="text-[10px] text-gray-500 leading-normal font-light">
                                Issued by {verifiedCert.authority} under license register <strong className="font-mono text-emerald-700">{verifiedCert.number}</strong>.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-white p-2.5 border border-emerald-100 rounded-none grid grid-cols-2 gap-2 text-[9px] font-bold text-gray-600 font-mono">
                            <div>
                              <span className="text-gray-400 block text-[8px] font-sans">STATUS</span>
                              <span className="text-emerald-600">{verifiedCert.status}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[8px] font-sans">EXPIRY DATE</span>
                              <span>{verifiedCert.expiryDate}</span>
                            </div>
                          </div>
                          <p className="text-[9px] text-emerald-700/80 leading-relaxed font-light">
                            ✓ Security Handshake: Cleared by internal database verification as fully active and legally compliant.
                          </p>
                        </div>
                      )}

                      {verifyError && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-none text-xs text-red-700 flex items-start gap-2 animate-fade-in">
                          <span className="font-bold text-red-500 shrink-0">!</span>
                          <p className="leading-relaxed font-light text-[11px]">{verifyError}</p>
                        </div>
                      )}
                    </div>

                    {/* Category Filter Menu */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary border-b border-gray-100 pb-2">
                        Filter By Category
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: 'all', label: 'All Registrations' },
                          { id: 'Legal & Incorporation', label: 'Legal & Incorporation' },
                          { id: 'NCIC Construction Licenses', label: 'NCIC Construction Licenses' },
                          { id: 'Tax & Municipal', label: 'Tax & Municipal' },
                          { id: 'Safety & Professional', label: 'Safety & Professional' }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setCertCategory(cat.id)}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-none flex justify-between items-center ${
                              certCategory === cat.id
                                ? 'bg-primary text-secondary border-l-4 border-l-secondary font-bold'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
                              certCategory === cat.id ? 'bg-secondary text-primary' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {cat.id === 'all' 
                                ? certificates.length 
                                : certificates.filter(c => c.category === cat.id).length
                              }
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Credibility Guarantee block */}
                    <div className="bg-[#FAF7F2] border border-[#E9E1CE] p-6 rounded-none space-y-3">
                      <h4 className="text-xs font-bold text-[#8C6D3B] uppercase tracking-wide flex items-center gap-2">
                        <Shield className="w-4 h-4 text-secondary" />
                        Compliance & Audit Policy
                      </h4>
                      <p className="text-[11px] text-[#6E5A35] leading-relaxed font-light">
                        Many institutional clients, including Government departments, municipal assemblies, and international organizations require proof of legal incorporation, tax status, and NCIC registrations. Zion Projects provides this portal to afford absolute transparency and security in the commercial bidding phase.
                      </p>
                      <p className="text-[10px] text-gray-400 italic">
                        Last audited by independent structural and tax bodies: July 2026.
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Search & Certificates Grid */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Search and results info bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-gray-200">
                      <div className="relative w-full sm:max-w-xs">
                        <input
                          type="text"
                          placeholder="Search certificates..."
                          value={certSearch}
                          onChange={(e) => setCertSearch(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-none py-2 px-3 pl-8 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                        />
                        <Search size={12} className="absolute left-2.5 top-3 text-gray-400" />
                      </div>
                      
                      <div className="text-[11px] font-bold text-gray-500">
                        Showing {filteredCerts.length} of {certificates.length} Credentials
                      </div>
                    </div>

                    {/* Certs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredCerts.length === 0 ? (
                        <div className="col-span-full bg-white border border-gray-100 py-16 text-center shadow-sm">
                          <span className="text-sm font-bold text-gray-400 block mb-2">No Matching Certifications Found</span>
                          <button 
                            onClick={() => { setCertSearch(''); setCertCategory('all'); }}
                            className="text-xs text-secondary font-bold hover:underline"
                          >
                            Reset all filters
                          </button>
                        </div>
                      ) : (
                        filteredCerts.map(cert => {
                          const isDownloading = downloadingCertId === cert.id;
                          return (
                            <div 
                              key={cert.id} 
                              className="bg-white p-6 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6 relative group"
                            >
                              <div className="space-y-4">
                                {/* Header of card */}
                                <div className="flex justify-between items-start">
                                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-none">
                                    {selectCertIcon(cert.category)}
                                  </div>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                    cert.status === 'Grade-A Registered'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : cert.status === 'Compliant'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : cert.status === 'Verified'
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}>
                                    {cert.status}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block">
                                    {cert.category}
                                  </span>
                                  <h3 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                                    {cert.title}
                                  </h3>
                                  <p className="text-[11px] text-gray-500 font-light leading-relaxed line-clamp-2">
                                    {cert.description}
                                  </p>
                                </div>

                                {/* Numbers & Expiry Section */}
                                <div className="bg-gray-50 p-3 space-y-1.5 border border-gray-100">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-400 font-medium">Doc Number:</span>
                                    <span className="font-mono text-primary font-bold">{cert.number}</span>
                                  </div>
                                  <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-400 font-medium">Expiry:</span>
                                    <span className={`font-semibold ${cert.expiryDate.includes('Permanent') ? 'text-emerald-600' : 'text-gray-600'}`}>
                                      {cert.expiryDate}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Action buttons */}
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => setInspectedCert(cert)}
                                  className="py-2 bg-gray-100 hover:bg-gray-200 text-primary text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                                >
                                  View Certificate
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setDownloadingCertId(cert.id);
                                    setTimeout(() => {
                                      setDownloadingCertId(null);
                                      setInspectedCert(cert);
                                      alert(`PDF Export Initiated: Formulating official print spec sheet for registration: "${cert.title}" (License: ${cert.number}). Select Print Destination to save as PDF.`);
                                    }, 1000);
                                  }}
                                  disabled={isDownloading}
                                  className="py-2 bg-primary hover:bg-secondary text-secondary hover:text-primary disabled:bg-primary/50 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1 border border-secondary/20"
                                >
                                  {isDownloading ? (
                                    <>
                                      <Loader2 className="animate-spin w-3 h-3 text-secondary" />
                                      <span>Preparing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Download size={11} />
                                      <span>Download PDF</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>

                </div>

                {/* FAQ section reference */}
                <div className="bg-white p-8 border border-gray-200 text-center space-y-4">
                  <h3 className="text-lg font-black text-primary uppercase">
                    Need additional legal documentations or tender files?
                  </h3>
                  <p className="text-xs text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                    If your procurement regulations demand additional tax declarations, board resolutions, bank statements, or joint venture articles of association, please reach out directly to our corporate secretaries at Area 14 headquarters.
                  </p>
                  <button
                    onClick={() => { setCurrentView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex bg-secondary hover:bg-primary text-primary hover:text-white px-8 py-3 font-bold text-xs uppercase tracking-widest border border-secondary transition-all cursor-pointer"
                  >
                    Contact Procurement Division
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              SERVICES VIEW
              ================================================== */}
          {currentView === 'services' && (() => {
            const serviceA = services.find(s => s.id === serviceAId) || services[0];
            const serviceB = services.find(s => s.id === serviceBId) || services[1];
            return (
              <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-16">
                
                <div className="text-center max-w-xl mx-auto">
                  <div className="flex justify-center items-center gap-3 mb-3">
                    <div className="accent-line"></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                      TECHNICAL SPECIFICATIONS
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight">Our Civil & Building Offerings</h1>
                  <p className="text-xs text-gray-500 mt-2 font-light">
                    Learn about our state-approved construction processes, machinery configurations, and logistics.
                  </p>
                </div>

                {/* Compare Services Component */}
                <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8 rounded-none relative overflow-hidden">
                  <div className="absolute inset-0 geometric-pattern opacity-[0.03] pointer-events-none" />
                  
                  <div className="relative z-10 space-y-8">
                    {/* Header bar of comparison tool */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="accent-line w-8"></div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Decision Assistant</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold uppercase text-primary tracking-tight">Division Spec Comparison Matrix</h2>
                        <p className="text-xs text-gray-500 font-light mt-1">
                          Select any two construction divisions side-by-side to review standard structural lifespans, materials, and compliance standards.
                        </p>
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => { setServiceAId('srv-1'); setServiceBId('srv-2'); }}
                          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-primary hover:text-white transition-all cursor-pointer rounded-none"
                        >
                          Building vs Roads
                        </button>
                        <button 
                          onClick={() => { setServiceAId('srv-2'); setServiceBId('srv-3'); }}
                          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-primary hover:text-white transition-all cursor-pointer rounded-none"
                        >
                          Roads vs Bridges
                        </button>
                        <button 
                          onClick={() => { setServiceAId('srv-4'); setServiceBId('srv-5'); }}
                          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-primary hover:text-white transition-all cursor-pointer rounded-none"
                        >
                          Water vs Sewer
                        </button>
                      </div>
                    </div>

                    {/* Selection drop-downs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                      {/* Service A Selector */}
                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-wider font-extrabold text-secondary">
                          First Division (Service A)
                        </label>
                        <div className="relative">
                          <select 
                            value={serviceAId} 
                            onChange={(e) => setServiceAId(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-primary/10 text-primary font-bold py-3 px-4 rounded-none focus:outline-none focus:border-secondary transition-all uppercase tracking-wider text-xs cursor-pointer appearance-none"
                          >
                            {services.map(s => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Service B Selector */}
                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-wider font-extrabold text-secondary">
                          Second Division (Service B)
                        </label>
                        <div className="relative">
                          <select 
                            value={serviceBId} 
                            onChange={(e) => setServiceBId(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-primary/10 text-primary font-bold py-3 px-4 rounded-none focus:outline-none focus:border-secondary transition-all uppercase tracking-wider text-xs cursor-pointer appearance-none"
                          >
                            {services.map(s => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Matrix Comparison Table */}
                    <div className="overflow-x-auto border border-gray-100 shadow-sm bg-gray-50/50">
                      <table className="w-full min-w-[700px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-gray-200 bg-primary text-white">
                            <th className="p-4 text-[10px] uppercase tracking-wider font-extrabold w-[18%]">Technical Metric</th>
                            <th className="p-4 text-[11px] uppercase tracking-wider font-bold w-[41%] border-l border-white/10">
                              <div className="flex items-center gap-2">
                                <span className="text-secondary">{serviceA ? selectServiceIcon(serviceA.icon) : null}</span>
                                <span className="tracking-wide">{serviceA?.title || "Service A"}</span>
                              </div>
                            </th>
                            <th className="p-4 text-[11px] uppercase tracking-wider font-bold w-[41%] border-l border-white/10">
                              <div className="flex items-center gap-2">
                                <span className="text-secondary">{serviceB ? selectServiceIcon(serviceB.icon) : null}</span>
                                <span className="tracking-wide">{serviceB?.title || "Service B"}</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          
                          {/* Row 1: Banner Overview */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Division Profile</td>
                            <td className="p-4 border-l border-gray-100 align-top">
                              {serviceA && (
                                <div className="space-y-3">
                                  <div className="h-28 overflow-hidden border border-gray-200 relative rounded-none">
                                    <img src={serviceA.image} alt={serviceA.title} className="w-full h-full object-cover" />
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed font-light">{serviceA.shortDescription}</p>
                                </div>
                              )}
                            </td>
                            <td className="p-4 border-l border-gray-100 align-top">
                              {serviceB && (
                                <div className="space-y-3">
                                  <div className="h-28 overflow-hidden border border-gray-200 relative rounded-none">
                                    <img src={serviceB.image} alt={serviceB.title} className="w-full h-full object-cover" />
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed font-light">{serviceB.shortDescription}</p>
                                </div>
                              )}
                            </td>
                          </tr>

                          {/* Row 2: Applications */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Typical Use Cases</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceA && getServiceSpecs(serviceA).applications}</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceB && getServiceSpecs(serviceB).applications}</td>
                          </tr>

                          {/* Row 3: Regulatory Compliance */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Standards & Code</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-mono text-[11px] text-primary bg-primary/5">{serviceA && getServiceSpecs(serviceA).compliance}</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-mono text-[11px] text-primary bg-primary/5">{serviceB && getServiceSpecs(serviceB).compliance}</td>
                          </tr>

                          {/* Row 4: Key Equipment */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Active Fleet</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceA && getServiceSpecs(serviceA).equipment}</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceB && getServiceSpecs(serviceB).equipment}</td>
                          </tr>

                          {/* Row 5: Structural Lifespan */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Expected Lifespan</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-bold text-secondary text-[12px]">{serviceA && getServiceSpecs(serviceA).lifetime}</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-bold text-secondary text-[12px]">{serviceB && getServiceSpecs(serviceB).lifetime}</td>
                          </tr>

                          {/* Row 6: Main Deliverables */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Scope Deliverables</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceA && getServiceSpecs(serviceA).deliverables}</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceB && getServiceSpecs(serviceB).deliverables}</td>
                          </tr>

                          {/* Row 7: Material engineering */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Material Specs</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceA && getServiceSpecs(serviceA).materials}</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceB && getServiceSpecs(serviceB).materials}</td>
                          </tr>

                          {/* Row 8: QA/Testing */}
                          <tr className="hover:bg-white transition-all">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">QA Testing Protocol</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceA && getServiceSpecs(serviceA).qualityControl}</td>
                            <td className="p-4 border-l border-gray-100 leading-relaxed font-light text-gray-700">{serviceB && getServiceSpecs(serviceB).qualityControl}</td>
                          </tr>

                          {/* Row 9: CTA Actions */}
                          <tr className="bg-gray-100/30">
                            <td className="p-4 font-bold text-primary uppercase tracking-wider text-[10px] bg-gray-50">Actions</td>
                            <td className="p-4 border-l border-gray-100">
                              {serviceA && (
                                <button
                                  onClick={() => {
                                    setCurrentView('quote-builder');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white hover:text-primary py-2.5 px-4 font-bold uppercase tracking-wider text-[10px] rounded-none border border-primary transition-all duration-300 cursor-pointer"
                                >
                                  <MessageSquare size={12} />
                                  <span>Estimate: {serviceA.title}</span>
                                </button>
                              )}
                            </td>
                            <td className="p-4 border-l border-gray-100">
                              {serviceB && (
                                <button
                                  onClick={() => {
                                    setCurrentView('quote-builder');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white hover:text-primary py-2.5 px-4 font-bold uppercase tracking-wider text-[10px] rounded-none border border-primary transition-all duration-300 cursor-pointer"
                                >
                                  <MessageSquare size={12} />
                                  <span>Estimate: {serviceB.title}</span>
                                </button>
                              )}
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </div>

                    {/* Footnote */}
                    <div className="p-4 bg-secondary/5 border-l-4 border-secondary flex gap-3 items-center">
                      <Info size={16} className="text-secondary shrink-0" />
                      <span className="text-[11px] text-gray-600 font-light leading-relaxed">
                        <strong>Regulatory Note:</strong> All specifications follow Malawi Bureau of Standards (MBS) and NCIC Grade-A compliance thresholds. Concrete structures and aggregate supplies are tested in certified laboratories prior to structural loading or site deliveries.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Division listings section */}
                <div className="grid grid-cols-1 gap-12 pt-8">
                  {services.map((srv, idx) => (
                  <div key={srv.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 rounded-2xl border border-gray-100 ${
                    idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}>
                    <div className="relative h-80 rounded-xl overflow-hidden shadow">
                      <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 p-3 bg-primary text-secondary rounded shadow border border-white/10">
                        {selectServiceIcon(srv.icon)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase text-secondary tracking-widest bg-secondary/15 px-3 py-1 rounded border border-secondary/20">
                        ZION DIVISION {idx + 1}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-primary tracking-tight">{srv.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                        {srv.shortDescription}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                        {srv.description}
                      </p>
                      
                      <div className="pt-2">
                        <button 
                          onClick={() => { setCurrentView('quote-builder'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-secondary font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded shadow cursor-pointer"
                        >
                          <MessageSquare size={13} className="text-secondary" />
                          <span>Request Specific Estimate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })()}

          {/* ==================================================
              PROJECTS PORTFOLIO VIEW
              ================================================== */}
          {currentView === 'projects' && (
            <div id="projects" className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-12">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <span className="text-xs uppercase font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded">PROJECT PORTFOLIO</span>
                  <h1 className="text-3xl md:text-5xl font-black mt-3 text-primary tracking-tight">Our National Civil Footprint</h1>
                  <p className="text-xs text-gray-500 mt-2">
                    Interact with our regional development map or use the advanced filters to drill down into Zion's engineering achievements across Malawi.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setProjectFilter('all');
                    setProjectRegionFilter(['all']);
                    setProjectDistrictFilter('all');
                    setProjectStatusFilter('all');
                  }}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-none border border-gray-200 transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>

              {/* Advanced Controls Section (Map + Filter panel) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Interactive Styled SVG Map of Malawi */}
                <div className="lg:col-span-5 bg-white border border-gray-200 p-6 flex flex-col items-center justify-center relative shadow-sm">
                  <div className="absolute top-4 left-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Malawi Regional Map</h3>
                    <p className="text-[10px] text-gray-400">Click a region to filter projects</p>
                  </div>

                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                    <button 
                      id="map-reset-btn"
                      onClick={() => setProjectRegionFilter(['all'])}
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                      title="Reset Map Colors and Regional Filters"
                    >
                      <RefreshCw size={11} />
                      <span>Reset Map</span>
                    </button>

                    <button 
                      id="map-legend-toggle"
                      onClick={() => setShowMapLegend(!showMapLegend)}
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                      title={showMapLegend ? "Hide Map Legend" : "Show Map Legend"}
                    >
                      {showMapLegend ? <EyeOff size={11} /> : <Eye size={11} />}
                      <span>Legend</span>
                    </button>

                    <button 
                      id="map-zoom-btn"
                      onClick={() => setMapZoom(!mapZoom)}
                      className={`p-1.5 border rounded flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider shadow-sm cursor-pointer transition-colors ${
                        mapZoom 
                          ? 'bg-secondary/15 border-secondary text-secondary hover:bg-secondary/25' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-800'
                      }`}
                      title={mapZoom ? "Zoom Out Map" : "Zoom In Map"}
                    >
                      {mapZoom ? <ZoomOut size={11} /> : <ZoomIn size={11} />}
                      <span>{mapZoom ? "Zoom Out" : "Zoom Map"}</span>
                    </button>
                  </div>

                  {showMapLegend && (
                    <div id="map-legend-box" className="absolute top-[38px] right-4 z-10 flex flex-col gap-1.5 text-[9px] bg-gray-50 p-2.5 border border-gray-100 animate-fade-in">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2.5 h-2.5 bg-secondary rounded-full inline-block animate-pulse"></span>
                        Project Pin
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <span className="w-2.5 h-1.5 bg-gray-200 inline-block"></span>
                        Inactive Region
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2.5 h-1.5 bg-primary/20 inline-block"></span>
                        Active Region
                      </span>
                    </div>
                  )}

                  {/* Stylized Malawi Country Container */}
                  <div 
                    id="malawi-map-container" 
                    className={`relative w-[280px] h-[480px] flex items-center justify-center mt-10 overflow-hidden rounded-xl border border-gray-100/50 bg-gray-50/20 shadow-inner transition-all duration-300 ${
                      mapZoom ? 'ring-2 ring-secondary/20 border-secondary/30' : ''
                    }`}
                  >
                    <svg 
                      viewBox="0 0 280 480" 
                      className="w-full h-full"
                      style={{
                        transform: mapZoom ? 'scale(1.45)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                        cursor: mapZoom ? 'zoom-out' : 'zoom-in'
                      }}
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          setMapZoom(!mapZoom);
                        }
                      }}
                    >
                      <defs>
                        {/* Selected Active Gold Glow */}
                        <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f39c12" floodOpacity="0.45" />
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feFlood floodColor="#f39c12" floodOpacity={0.3} result="color" />
                          <feComposite in="color" in2="blur" operator="in" result="glow" />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        
                        {/* Hover Soft Gold Glow with subtle drop shadow */}
                        <filter id="hover-glow" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feFlood floodColor="#f39c12" floodOpacity={0.2} result="color" />
                          <feComposite in="color" in2="blur" operator="in" result="glow" />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Region 1: Northern Malawi */}
                      <path
                        d="M 60,30 L 150,30 L 135,115 L 105,160 L 55,120 Z"
                        role="button"
                        aria-label="Northern Malawi Region"
                        aria-description={`${projects.filter(p => p.region === 'Northern Malawi').length} projects`}
                        data-active={projectRegionFilter.includes('Northern Malawi') ? "true" : "false"}
                        tabIndex={0}
                        className={`transition-all duration-[400ms] ease-in-out cursor-pointer focus:outline-none ${
                          projectRegionFilter.includes('Northern Malawi')
                            ? 'fill-secondary/35 stroke-secondary stroke-[3px] map-active-region'
                            : hoveredRegion === 'Northern Malawi'
                            ? 'fill-secondary/20 stroke-secondary/60 stroke-[1.5px]'
                            : 'fill-gray-50 hover:fill-gray-100/80 stroke-gray-300 focus:stroke-secondary/60'
                        } ${clickedRegion === 'Northern Malawi' ? 'animate-map-pulse' : ''}`}
                        style={{
                          filter: projectRegionFilter.includes('Northern Malawi')
                            ? 'url(#active-glow)'
                            : hoveredRegion === 'Northern Malawi'
                            ? 'url(#hover-glow)'
                            : 'none'
                        }}
                        onClick={() => {
                          setClickedRegion('Northern Malawi');
                          setTimeout(() => setClickedRegion(null), 350);
                          toggleRegionFilter('Northern Malawi');
                          setTimeout(() => {
                            document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 50);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setClickedRegion('Northern Malawi');
                            setTimeout(() => setClickedRegion(null), 350);
                            toggleRegionFilter('Northern Malawi');
                            setTimeout(() => {
                              document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }
                        }}
                        onMouseEnter={() => {
                          setHoveredRegion('Northern Malawi');
                          setHoveredRegionName('Northern Malawi');
                        }}
                        onMouseLeave={() => {
                          setHoveredRegion(null);
                          setHoveredRegionName(null);
                        }}
                        onFocus={() => {
                          setHoveredRegion('Northern Malawi');
                          setHoveredRegionName('Northern Malawi');
                        }}
                        onBlur={() => {
                          setHoveredRegion(null);
                          setHoveredRegionName(null);
                        }}
                        onMouseMove={(e) => {
                          const rect = document.getElementById('malawi-map-container')?.getBoundingClientRect();
                          if (rect) {
                            setTooltipPosition({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            });
                          }
                          setHoveredRegionName('Northern Malawi');
                        }}
                      />
                      <text x="95" y="75" className="fill-gray-400 text-[10px] font-bold pointer-events-none uppercase tracking-widest">
                        North
                      </text>

                      {/* Region 2: Central Malawi */}
                      <path
                        d="M 105,160 L 135,115 L 165,185 L 175,255 L 125,295 L 85,250 Z"
                        role="button"
                        aria-label="Central Malawi Region"
                        aria-description={`${projects.filter(p => p.region === 'Central Malawi').length} projects`}
                        data-active={projectRegionFilter.includes('Central Malawi') ? "true" : "false"}
                        tabIndex={0}
                        className={`transition-all duration-[400ms] ease-in-out cursor-pointer focus:outline-none ${
                          projectRegionFilter.includes('Central Malawi')
                            ? 'fill-secondary/35 stroke-secondary stroke-[3px] map-active-region'
                            : hoveredRegion === 'Central Malawi'
                            ? 'fill-secondary/20 stroke-secondary/60 stroke-[1.5px]'
                            : 'fill-gray-50 hover:fill-gray-100/80 stroke-gray-300 focus:stroke-secondary/60'
                        } ${clickedRegion === 'Central Malawi' ? 'animate-map-pulse' : ''}`}
                        style={{
                          filter: projectRegionFilter.includes('Central Malawi')
                            ? 'url(#active-glow)'
                            : hoveredRegion === 'Central Malawi'
                            ? 'url(#hover-glow)'
                            : 'none'
                        }}
                        onClick={() => {
                          setClickedRegion('Central Malawi');
                          setTimeout(() => setClickedRegion(null), 350);
                          toggleRegionFilter('Central Malawi');
                          setTimeout(() => {
                            document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 50);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setClickedRegion('Central Malawi');
                            setTimeout(() => setClickedRegion(null), 350);
                            toggleRegionFilter('Central Malawi');
                            setTimeout(() => {
                              document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }
                        }}
                        onMouseEnter={() => {
                          setHoveredRegion('Central Malawi');
                          setHoveredRegionName('Central Malawi');
                        }}
                        onMouseLeave={() => {
                          setHoveredRegion(null);
                          setHoveredRegionName(null);
                        }}
                        onFocus={() => {
                          setHoveredRegion('Central Malawi');
                          setHoveredRegionName('Central Malawi');
                        }}
                        onBlur={() => {
                          setHoveredRegion(null);
                          setHoveredRegionName(null);
                        }}
                        onMouseMove={(e) => {
                          const rect = document.getElementById('malawi-map-container')?.getBoundingClientRect();
                          if (rect) {
                            setTooltipPosition({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            });
                          }
                          setHoveredRegionName('Central Malawi');
                        }}
                      />
                      <text x="115" y="210" className="fill-gray-400 text-[10px] font-bold pointer-events-none uppercase tracking-widest">
                        Central
                      </text>

                      {/* Region 3: Southern Malawi */}
                      <path
                        d="M 125,295 L 175,255 L 215,295 L 225,385 L 165,435 L 135,375 Z"
                        role="button"
                        aria-label="Southern Malawi Region"
                        aria-description={`${projects.filter(p => p.region === 'Southern Malawi').length} projects`}
                        data-active={projectRegionFilter.includes('Southern Malawi') ? "true" : "false"}
                        tabIndex={0}
                        className={`transition-all duration-[400ms] ease-in-out cursor-pointer focus:outline-none ${
                          projectRegionFilter.includes('Southern Malawi')
                            ? 'fill-secondary/35 stroke-secondary stroke-[3px] map-active-region'
                            : hoveredRegion === 'Southern Malawi'
                            ? 'fill-secondary/20 stroke-secondary/60 stroke-[1.5px]'
                            : 'fill-gray-50 hover:fill-gray-100/80 stroke-gray-300 focus:stroke-secondary/60'
                        } ${clickedRegion === 'Southern Malawi' ? 'animate-map-pulse' : ''}`}
                        style={{
                          filter: projectRegionFilter.includes('Southern Malawi')
                            ? 'url(#active-glow)'
                            : hoveredRegion === 'Southern Malawi'
                            ? 'url(#hover-glow)'
                            : 'none'
                        }}
                        onClick={() => {
                          setClickedRegion('Southern Malawi');
                          setTimeout(() => setClickedRegion(null), 350);
                          toggleRegionFilter('Southern Malawi');
                          setTimeout(() => {
                            document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 50);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setClickedRegion('Southern Malawi');
                            setTimeout(() => setClickedRegion(null), 350);
                            toggleRegionFilter('Southern Malawi');
                            setTimeout(() => {
                              document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }
                        }}
                        onMouseEnter={() => {
                          setHoveredRegion('Southern Malawi');
                          setHoveredRegionName('Southern Malawi');
                        }}
                        onMouseLeave={() => {
                          setHoveredRegion(null);
                          setHoveredRegionName(null);
                        }}
                        onFocus={() => {
                          setHoveredRegion('Southern Malawi');
                          setHoveredRegionName('Southern Malawi');
                        }}
                        onBlur={() => {
                          setHoveredRegion(null);
                          setHoveredRegionName(null);
                        }}
                        onMouseMove={(e) => {
                          const rect = document.getElementById('malawi-map-container')?.getBoundingClientRect();
                          if (rect) {
                            setTooltipPosition({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            });
                          }
                          setHoveredRegionName('Southern Malawi');
                        }}
                      />
                      <text x="165" y="340" className="fill-gray-400 text-[10px] font-bold pointer-events-none uppercase tracking-widest">
                        South
                      </text>

                      {/* Floating Region Count Badges */}
                      {/* Northern Malawi Badge */}
                      <g className="animate-float" style={{ animationDelay: '0s' }}>
                        <g 
                          className="transition-transform duration-[400ms] ease-in-out"
                          style={{ 
                            transformOrigin: '100px 105px',
                            transform: projectRegionFilter.includes('Northern Malawi') ? 'scale(1.25)' : 'scale(1)'
                          }}
                        >
                          <circle
                            cx="100"
                            cy="105"
                            r="11"
                            className={`transition-colors duration-300 stroke-white stroke-[1.5px] cursor-pointer shadow-md ${
                              projectRegionFilter.includes('Northern Malawi') 
                                ? 'fill-secondary' 
                                : 'fill-primary hover:fill-secondary'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setClickedRegion('Northern Malawi');
                              setTimeout(() => setClickedRegion(null), 350);
                              toggleRegionFilter('Northern Malawi');
                              setTimeout(() => {
                                document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 50);
                            }}
                            title={`Northern Malawi: ${projects.filter(p => p.region === 'Northern Malawi').length} projects`}
                          />
                          <text
                            x="100"
                            y="108"
                            className="fill-white text-[9px] font-extrabold text-center font-mono pointer-events-none"
                            textAnchor="middle"
                          >
                            {projects.filter(p => p.region === 'Northern Malawi').length}
                          </text>
                        </g>
                      </g>

                      {/* Central Malawi Badge */}
                      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
                        <g 
                          className="transition-transform duration-[400ms] ease-in-out"
                          style={{ 
                            transformOrigin: '130px 240px',
                            transform: projectRegionFilter.includes('Central Malawi') ? 'scale(1.25)' : 'scale(1)'
                          }}
                        >
                          <circle
                            cx="130"
                            cy="240"
                            r="11"
                            className={`transition-colors duration-300 stroke-white stroke-[1.5px] cursor-pointer shadow-md ${
                              projectRegionFilter.includes('Central Malawi') 
                                ? 'fill-secondary' 
                                : 'fill-primary hover:fill-secondary'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setClickedRegion('Central Malawi');
                              setTimeout(() => setClickedRegion(null), 350);
                              toggleRegionFilter('Central Malawi');
                              setTimeout(() => {
                                document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 50);
                            }}
                            title={`Central Malawi: ${projects.filter(p => p.region === 'Central Malawi').length} projects`}
                          />
                          <text
                            x="130"
                            y="243"
                            className="fill-white text-[9px] font-extrabold text-center font-mono pointer-events-none"
                            textAnchor="middle"
                          >
                            {projects.filter(p => p.region === 'Central Malawi').length}
                          </text>
                        </g>
                      </g>

                      {/* Southern Malawi Badge */}
                      <g className="animate-float" style={{ animationDelay: '1s' }}>
                        <g 
                          className="transition-transform duration-[400ms] ease-in-out"
                          style={{ 
                            transformOrigin: '175px 370px',
                            transform: projectRegionFilter.includes('Southern Malawi') ? 'scale(1.25)' : 'scale(1)'
                          }}
                        >
                          <circle
                            cx="175"
                            cy="370"
                            r="11"
                            className={`transition-colors duration-300 stroke-white stroke-[1.5px] cursor-pointer shadow-md ${
                              projectRegionFilter.includes('Southern Malawi') 
                                ? 'fill-secondary' 
                                : 'fill-primary hover:fill-secondary'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setClickedRegion('Southern Malawi');
                              setTimeout(() => setClickedRegion(null), 350);
                              toggleRegionFilter('Southern Malawi');
                              setTimeout(() => {
                                document.getElementById('project-results-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 50);
                            }}
                            title={`Southern Malawi: ${projects.filter(p => p.region === 'Southern Malawi').length} projects`}
                          />
                          <text
                            x="175"
                            y="373"
                            className="fill-white text-[9px] font-extrabold text-center font-mono pointer-events-none"
                            textAnchor="middle"
                          >
                            {projects.filter(p => p.region === 'Southern Malawi').length}
                          </text>
                        </g>
                      </g>

                      {/* Overlay project location pins on the map */}
                      {projects.map((proj) => {
                        const coords: Record<string, { x: number; y: number }> = {
                          "proj-1": { x: 140, y: 270 }, // Dedza
                          "proj-2": { x: 170, y: 310 }, // Liwonde / Machinga
                          "proj-3": { x: 110, y: 220 }, // Lilongwe
                          "proj-4": { x: 180, y: 360 }, // Zomba
                          "proj-5": { x: 90, y: 110 }   // Mzuzu
                        };
                        const pt = coords[proj.id];
                        if (!pt) return null;

                        // Check if the project is in the currently filtered list
                        const isFilteredOut = !filteredProjects.some(fp => fp.id === proj.id);

                        return (
                          <g 
                            key={`pin-${proj.id}`}
                            className={`cursor-pointer transition-all duration-300 ${
                              isFilteredOut ? 'opacity-20 scale-75' : 'opacity-100 hover:scale-125'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectDetailClick(proj);
                            }}
                          >
                            {/* Outer pulsing ring */}
                            {!isFilteredOut && (
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="10"
                                className="fill-secondary/30 animate-ping"
                              />
                            )}
                            {/* Inner circle pin */}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="5"
                              className="fill-secondary stroke-white stroke-2 shadow-lg"
                            />
                            {/* Tiny name label indicator on hover */}
                            <title>{proj.title} ({proj.location})</title>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Simple overlay legend of selected region */}
                    <div className="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
                      Selected Regions: <span className="text-secondary">
                        {projectRegionFilter.includes('all') 
                          ? 'All Malawi' 
                          : projectRegionFilter.map(r => r.replace(' Malawi', '')).join(', ')}
                      </span>
                    </div>

                    {/* Hover Tooltip for Map Regions */}
                    {hoveredRegionName && (
                      <div 
                        id="floating-region-popover"
                        className="absolute z-30 pointer-events-none bg-slate-950/95 text-white p-3 rounded-lg shadow-2xl border border-slate-800/80 backdrop-blur-md transition-all duration-75 text-xs flex flex-col gap-1 min-w-[170px]"
                        style={{ 
                          left: `${tooltipPosition.x + 12}px`, 
                          top: `${tooltipPosition.y + 12}px`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-extrabold text-[10px] tracking-wider uppercase text-secondary">
                            {hoveredRegionName === 'Northern Malawi' ? 'Northern' : hoveredRegionName === 'Central Malawi' ? 'Central' : 'Southern'} Region
                          </span>
                          <span className="bg-primary/50 text-[10px] font-black px-1.5 py-0.5 rounded text-white border border-primary-light/20">
                            {filteredProjects.filter(p => p.region === hoveredRegionName).length} {filteredProjects.filter(p => p.region === hoveredRegionName).length === 1 ? 'Proj' : 'Projs'}
                          </span>
                        </div>
                        <div className="text-[9px] text-gray-400 mt-1 border-t border-slate-800 pt-1.5 leading-normal">
                          {(() => {
                            const regionProjects = filteredProjects.filter(p => p.region === hoveredRegionName);
                            if (regionProjects.length === 0) {
                              return "No matching projects in this region";
                            }
                            return `Projects: ${regionProjects.map(p => p.title.substring(0, 18) + (p.title.length > 18 ? '...' : '')).slice(0, 2).join(', ')}${regionProjects.length > 2 ? ' + others' : ''}`;
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Advanced Multi-Criteria Filter Controls Panel */}
                <div className="lg:col-span-7 bg-white border border-gray-200 p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-black text-primary uppercase tracking-tight pb-3 border-b border-gray-100">
                    Advanced Search Filters
                  </h3>

                  {/* Filter Field: Region */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      1. Region of Operation
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['all', 'Northern Malawi', 'Central Malawi', 'Southern Malawi'].map((reg) => (
                        <button
                          key={reg}
                          onClick={() => toggleRegionFilter(reg)}
                          className={`px-3 py-2 text-[11px] font-bold uppercase transition-all border rounded-none cursor-pointer text-center ${
                            projectRegionFilter.includes(reg)
                              ? 'bg-primary border-primary text-secondary'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {reg === 'all' ? 'All Regions' : reg.replace(' Malawi', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Field: District Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      2. District Filter
                    </label>
                    <select
                      value={projectDistrictFilter}
                      onChange={(e) => setProjectDistrictFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-3 text-xs text-gray-700 rounded-none focus:outline-none focus:ring-1 focus:ring-secondary focus:bg-white"
                    >
                      <option value="all">All Malawian Districts ({projects.length})</option>
                      {Array.from(new Set(projects.map(p => p.district).filter(Boolean))).map((dist) => (
                        <option key={dist} value={dist}>
                          {dist} District
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Field: Project Type (Category) Buttons */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      3. Project Engineering Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setProjectFilter('all')}
                        className={`px-3.5 py-2 text-[11px] font-bold uppercase transition-all border rounded-none cursor-pointer ${
                          projectFilter === 'all'
                            ? 'bg-primary border-primary text-secondary'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setProjectFilter(cat.id)}
                          className={`px-3.5 py-2 text-[11px] font-bold uppercase transition-all border rounded-none cursor-pointer ${
                            projectFilter === cat.id
                              ? 'bg-primary border-primary text-secondary'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Field: Project Status */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      4. Project Lifecycle Status
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {['all', 'Planning', 'In Progress', 'Completed', 'On Hold'].map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => setProjectStatusFilter(statusOption)}
                          className={`px-3 py-2 text-[11px] font-bold uppercase transition-all border rounded-none cursor-pointer text-center ${
                            projectStatusFilter === statusOption
                              ? 'bg-primary border-primary text-secondary'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {statusOption === 'all' ? 'All States' : statusOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results Summary Box */}
                  <div className="bg-primary/5 border border-primary/10 p-4 flex justify-between items-center text-xs font-bold text-primary">
                    <span>
                      Filtered Infrastructure Results:
                    </span>
                    <span className="bg-primary text-secondary px-3 py-1 text-xs">
                      {filteredProjects.length} of {projects.length} Projects Shown
                    </span>
                  </div>

                </div>

              </div>

              {/* Projects Grid */}
              <div id="project-results-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200">
                    <span className="text-sm font-bold text-gray-400 block mb-2">No Matching Projects Found</span>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Try resetting or adjusting your interactive map selection, district selection, or category filters.
                    </p>
                    <button
                      onClick={() => {
                        setProjectFilter('all');
                        setProjectRegionFilter(['all']);
                        setProjectDistrictFilter('all');
                        setProjectStatusFilter('all');
                      }}
                      className="mt-4 px-4 py-2 bg-primary text-secondary font-black text-[10px] uppercase tracking-wider hover:translate-y-[-1px] transition-transform cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredProjects.map((proj) => (
                    <div 
                      key={proj.id} 
                      onClick={() => handleProjectDetailClick(proj)}
                      className="bg-white rounded-none overflow-hidden border border-gray-200 hover:border-secondary/30 shadow-sm cursor-pointer hover:shadow-md transition-all group"
                    >
                      <div className="relative h-52 overflow-hidden bg-primary">
                        <img src={proj.images[0]?.url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                        <span className="absolute top-4 right-4 bg-primary text-secondary font-black text-[9px] px-2.5 py-1 rounded-none uppercase tracking-wider shadow border border-white/10">
                          {proj.status}
                        </span>
                        {proj.region && (
                          <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white font-bold text-[8px] px-2 py-0.5 uppercase tracking-widest">
                            {proj.region}
                          </span>
                        )}
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center text-[9px] text-secondary font-extrabold uppercase tracking-widest">
                          <span>{proj.categoryName || 'Infrastructure'}</span>
                          {proj.district && <span>{proj.district} District</span>}
                        </div>
                        <h3 className="text-sm font-black text-primary line-clamp-1 group-hover:text-secondary transition-colors">{proj.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{proj.description}</p>
                        
                        {/* Progress bar info */}
                        <div className="pt-2 flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                            <span>Work Progress:</span>
                            <span className="text-primary font-black">{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-none overflow-hidden">
                            <div className="bg-secondary h-full" style={{ width: `${proj.progress}%` }} />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold">
                          <span>Loc: {proj.location}</span>
                          <span className="text-primary font-black">{proj.budget}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ==================================================
              GALLERY LIGHTBOX VIEW
              ================================================== */}
          {currentView === 'gallery' && (
            <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-8">
              
              <div>
                <span className="text-xs uppercase font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded">MEDIA LIBRARY</span>
                <h1 className="text-3xl md:text-5xl font-black mt-3 text-primary tracking-tight">Zion Site Operations Lightbox</h1>
                <p className="text-xs text-gray-500 mt-2">
                  High-fidelity photostream capture of active cement casting, aggregate dispatches, and highway profiles.
                </p>
              </div>

              {/* Album filter */}
              <div className="flex flex-wrap gap-2 py-3 border-y border-gray-200">
                <button
                  onClick={() => setGalleryFilter('all')}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    galleryFilter === 'all' ? 'bg-primary text-secondary' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  All Photos
                </button>
                {albums.map(alb => (
                  <button
                    key={alb.id}
                    onClick={() => setGalleryFilter(alb.id)}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      galleryFilter === alb.id ? 'bg-primary text-secondary' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    {alb.name}
                  </button>
                ))}
              </div>

              {/* Lightbox grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => setLightboxImage(item.url)}
                    className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer group h-64"
                  >
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                    
                    {/* Hover detail overlay */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                      <span className="text-[10px] text-secondary font-black uppercase tracking-widest">{item.albumName}</span>
                      <h4 className="text-sm font-bold mt-1">{item.title}</h4>
                      <p className="text-[10px] text-gray-300 mt-1">Click to expand details</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================
              CAREERS / VACANCIES VIEW
              ================================================== */}
          {currentView === 'careers' && (
            <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-12">
              
              <div className="bg-primary text-white p-8 md:p-12 rounded-2xl relative overflow-hidden construction-grid-bg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />
                <div className="relative z-10 max-w-xl">
                  <span className="text-xs uppercase font-extrabold text-secondary tracking-widest">ZION HR DIVISION</span>
                  <h1 className="text-3xl md:text-5xl font-black mt-2 tracking-tight">Build Malawi's Highways With Us</h1>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    We seek experienced inspectors, plant operators, material estimators, and civil surveyors. Review our NCIC registered vacancies.
                  </p>
                </div>
              </div>

              {/* Vacancy catalog */}
              <div>
                <h3 className="text-xl font-black text-primary mb-6 tracking-tight">Active Job Openings</h3>
                <div className="grid grid-cols-1 gap-6">
                  {vacancies.length === 0 ? (
                    <p className="text-xs text-gray-400 py-10 text-center">No open vacancies at this time. Senders can check in periodically.</p>
                  ) : (
                    vacancies.map(vac => (
                      <div key={vac.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-secondary/15 text-secondary text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border border-secondary/20">
                              {vac.type}
                            </span>
                            <span className="text-[11px] text-gray-400 font-bold">{vac.department}</span>
                          </div>
                          <h4 className="text-base font-extrabold text-primary mt-2">{vac.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">Location: {vac.location} | Experience Required: {vac.experience}</p>
                        </div>
                        
                        <button
                          onClick={() => setActiveJobDetail(vac)}
                          className="bg-primary hover:bg-primary/95 text-secondary hover:text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-5 rounded shadow cursor-pointer whitespace-nowrap self-start md:self-center"
                        >
                          View Job Details & Apply
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==================================================
              NEWS AND BLOG VIEW
              ================================================== */}
          {currentView === 'blog' && (
            <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-12">
              
              <div>
                <span className="text-xs uppercase font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded">NEWS & PRESS ROOM</span>
                <h1 className="text-3xl md:text-5xl font-black mt-3 text-primary tracking-tight">Zion Technical Insights</h1>
                <p className="text-xs text-gray-500 mt-2">
                  Technical updates on soil mechanics, cement precasting base courses, and company certifications.
                </p>
              </div>

              {/* Blogs catalog list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                  <article 
                    key={blog.id}
                    onClick={() => handleBlogClick(blog.slug)}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-secondary/30 shadow-sm hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      <span className="absolute top-4 left-4 bg-primary text-secondary font-black text-[9px] px-2.5 py-0.5 rounded border border-white/10 uppercase tracking-widest shadow">
                        {blog.categoryName}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                        <Calendar size={12} />
                        <span>{blog.createdAt}</span>
                        <span>•</span>
                        <BookOpen size={12} />
                        <span>{blog.views} Views</span>
                      </div>

                      <h3 className="text-sm font-black text-primary leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      <hr className="border-gray-50" />

                      <p className="text-[10px] text-gray-400 font-bold">Written by: {blog.author}</p>
                    </div>
                  </article>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================
              SINGLE BLOG PAGE
              ================================================== */}
          {currentView === 'single-blog' && activeBlogDetail && (
            <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-16 w-full space-y-8 text-xs">
              
              <button 
                onClick={() => setCurrentView('blog')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Return to Newsroom</span>
              </button>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-secondary bg-secondary/15 px-3 py-1 rounded border border-secondary/20 self-start">
                  {activeBlogDetail.categoryName}
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-primary tracking-tight leading-tight">
                  {activeBlogDetail.title}
                </h1>
                <p className="text-[11px] text-gray-400 font-bold">
                  Published: {activeBlogDetail.createdAt} | Written by: {activeBlogDetail.author} | Views: {activeBlogDetail.views}
                </p>
              </div>

              <img src={activeBlogDetail.featuredImage} alt={activeBlogDetail.title} className="w-full h-80 object-cover rounded-2xl shadow" />

              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium space-y-4">
                {activeBlogDetail.content}
              </div>

              <hr className="border-gray-200" />

              {/* Comments display */}
              <div className="space-y-6">
                <h3 className="text-base font-black text-primary flex items-center gap-1.5">
                  <MessageCircle size={18} className="text-secondary" />
                  Reader Comments ({activeBlogDetail.comments?.length || 0})
                </h3>

                <div className="space-y-4">
                  {!activeBlogDetail.comments || activeBlogDetail.comments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No comments published yet. Be the first to share your thoughts.</p>
                  ) : (
                    activeBlogDetail.comments.map(c => (
                      <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                          <span className="text-primary font-black">{c.authorName}</span>
                          <span>{c.createdAt}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">"{c.content}"</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Comment */}
                <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                  <span className="text-xs font-black text-primary block">Share Engineering Feedback</span>
                  
                  {commentSuccess && (
                    <p className="text-xs text-green-700 bg-green-50 p-2.5 rounded font-bold">Comment successfully published!</p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={commentForm.authorName}
                      onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                      className="bg-white border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={commentForm.authorEmail}
                      onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                      className="bg-white border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Enter comment content *"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    rows={3}
                    className="w-full bg-white border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-secondary font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded shadow hover:bg-primary/95 cursor-pointer"
                  >
                    Submit Comment
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ==================================================
              FAQ ACCORDION VIEW
              ================================================== */}
          {currentView === 'faq' && (
            <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-16 w-full space-y-12">
              
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs uppercase font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded">FAQ PORTAL</span>
                <h1 className="text-3xl font-black mt-3 text-primary tracking-tight">Tender & Engineering Queries</h1>
                <p className="text-xs text-gray-500 mt-2">
                  Frequently requested metrics on our construction registrations, procurement guidelines, and materials sourcing.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Is Zion Projects registered with the National Construction Industry Council (NCIC)?",
                    a: "Yes, Zion Projects Construction Ltd is registered with the NCIC of Malawi under the most prestigious 'Grade-A' (Unlimited Value) contractor category for both Civil Engineering works (Roads & Highways) and Building construction. This allows us to submit tenders and execute government and international partner contracts of unlimited budgetary bounds."
                  },
                  {
                    q: "Can you supply certified laboratory aggregate tests for concrete casting?",
                    a: "Absolutely. In partnership with the Malawi Bureau of Standards (MBS) and regional testing labs, Zion Projects supplies full compression tests, aggregate crushing values (ACV), grading curves, and chemical compositions for all bulk sand and granite deliveries dispatched from our quarry depots."
                  },
                  {
                    q: "What is your typical lead time for civil road excavation bulk machinery logistics?",
                    a: "Typical mobilization time for heavy site plant fleets (including 22-tonne graders, pneumatic tire compactors, and concrete mixers) within Malawi's Southern or Central regions ranges between 5 to 10 working days from successful contract sign-off."
                  },
                  {
                    q: "How does your client portal's Gemini AI pre-estimator work?",
                    a: "Our quotation builder integrates an advanced server-side Gemini 3.5 model. When client parameters (description, location, budget class) are submitted, the AI evaluates soil mechanics (e.g., clay washouts in Dedza or high Shire River water cycles) and compiles preliminary technical Challenges and structural recommendations automatically based on Malawian construction guidelines."
                  }
                ].map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setActiveFaq(activeFaq === faq.q ? null : faq.q)}
                      className="w-full flex justify-between items-center p-5 text-left text-xs font-extrabold text-primary hover:text-secondary focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={14} className={`transform transition-transform duration-200 ${activeFaq === faq.q ? 'rotate-180 text-secondary' : ''}`} />
                    </button>
                    {activeFaq === faq.q && (
                      <div className="p-5 pt-0 text-xs text-gray-500 leading-relaxed border-t border-gray-50 bg-gray-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================
              CONTACT PAGE VIEW
              ================================================== */}
          {currentView === 'contact' && (
            <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-12">
              
              <div>
                <span className="text-xs uppercase font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded">CONTACT DETAILS</span>
                <h1 className="text-3xl md:text-5xl font-black mt-3 text-primary tracking-tight">Connect with Lead Estimators</h1>
                <p className="text-xs text-gray-500 mt-2">
                  Reach out directly via phone, WhatsApp, or drop your technical inquiries in our Express inbox.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Contact numbers info */}
                <div className="space-y-6">
                  
                  <div className="bg-primary text-white p-6 rounded-2xl relative overflow-hidden construction-grid-bg">
                    <h3 className="text-base font-black text-white mb-4">Zion Offices</h3>
                    <ul className="space-y-4 text-xs text-gray-300">
                      <li className="flex items-start gap-2.5">
                        <MapPin className="text-secondary shrink-0 mt-0.5" />
                        <span>{companyInfo?.address || 'Zion House, Plot 47/3, Area 14, Lilongwe, Malawi'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Phone className="text-secondary shrink-0" />
                        <span>
                          {companyInfo?.phone 
                            ? (companyInfo.phoneAlternative ? `${companyInfo.phone} / ${companyInfo.phoneAlternative}` : companyInfo.phone)
                            : '+265 997 914 840 / +265 992 847 803'
                          }
                        </span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Mail className="text-secondary shrink-0" />
                        <span>{companyInfo?.email || 'Zionprojectsltd265@gmail.com'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 text-xs space-y-2">
                    <h3 className="font-bold text-primary flex items-center gap-1.5 mb-3">
                      <Clock size={16} className="text-secondary" />
                      Working Hours
                    </h3>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Mon - Fri:</span>
                      <span className="font-bold text-primary">{companyInfo?.workingHours.split(': ')[1] || '07:30 AM - 05:00 PM'}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Saturday:</span>
                      <span className="font-bold text-primary">{companyInfo?.workingHoursSat?.split(': ')[1] || '08:00 AM - 12:30 PM'}</span>
                    </div>
                  </div>

                  {/* WhatsApp Floating button simulation */}
                  <a 
                    href={`https://wa.me/${settings?.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsappMessage || '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl shadow-md font-bold text-xs uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                  >
                    <MessageCircle size={18} />
                    <span>Chat instantly on WhatsApp</span>
                  </a>

                </div>

                {/* Inbox submission form */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-base font-black text-primary">Inquiry Transmission</h3>
                  
                  {contactSuccess && (
                    <div className="bg-green-50 text-green-700 border border-green-200 p-5 rounded-xl text-xs space-y-3">
                      <p className="font-bold">{contactSuccess}</p>
                      {submittedContactSnapshot && (
                        <div className="pt-2 border-t border-green-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-green-600 font-medium">To send a direct copy to Zion from your email app:</span>
                          <a
                            href={`mailto:Zionprojectsltd265@gmail.com?subject=${encodeURIComponent(`Inquiry: ${submittedContactSnapshot.subject} - ${submittedContactSnapshot.name}`)}&body=${encodeURIComponent(
                              `Hello Zion Projects,\n\nI have submitted an inquiry on your website. Here are my contact details:\n\nName: ${submittedContactSnapshot.name}\nEmail: ${submittedContactSnapshot.email}\nPhone: ${submittedContactSnapshot.phone || 'N/A'}\nSubject: ${submittedContactSnapshot.subject}\n\nMessage:\n${submittedContactSnapshot.message}\n\nBest regards,\n${submittedContactSnapshot.name}`
                            )}`}
                            className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-extrabold uppercase tracking-wider py-2 px-4 rounded-lg shadow-sm transition-all"
                          >
                            <Mail size={12} />
                            <span>Send Email Direct</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {contactError && (
                    <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded text-xs font-bold">
                      {contactError}
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Your Name *</label>
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="border border-gray-200 rounded p-2.5 text-xs text-primary focus:outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address *</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="border border-gray-200 rounded p-2.5 text-xs text-primary focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="border border-gray-200 rounded p-2.5 text-xs text-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Inquiry Subject *</label>
                        <select
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="border border-gray-200 bg-white rounded p-2.5 text-xs text-primary focus:outline-none"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Quarry Aggregate Supplies">Quarry Aggregate Supplies</option>
                          <option value="Highway Excavations Sourcing">Highway Excavations Sourcing</option>
                          <option value="Partnerships & Joint Ventures">Partnerships & Joint Ventures</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Message Content *</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={4}
                        className="border border-gray-200 rounded p-2.5 text-xs text-primary focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="bg-primary hover:bg-primary/95 text-secondary hover:text-white font-extrabold text-xs uppercase tracking-wider py-3 px-6 rounded shadow cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      {contactLoading && <Loader2 size={13} className="animate-spin" />}
                      <span>Send Message</span>
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              DOWNLOAD COMPLIANCE CENTER
              ================================================== */}
          {currentView === 'downloads' && (() => {
            const filteredCerts = certificates.filter(cert => {
              const matchesCategory = certCategory === 'all' || cert.category === certCategory;
              const matchesSearch = certSearch === '' || 
                cert.title.toLowerCase().includes(certSearch.toLowerCase()) ||
                cert.number.toLowerCase().includes(certSearch.toLowerCase()) ||
                cert.authority.toLowerCase().includes(certSearch.toLowerCase());
              return matchesCategory && matchesSearch;
            });

            const handleVerifyCheck = (e: React.FormEvent) => {
              e.preventDefault();
              setVerifyError('');
              setVerifiedCert(null);
              
              if (!verifyInput.trim()) {
                setVerifyError('Please enter a certificate or registration number.');
                return;
              }
              
              const found = certificates.find(
                c => c.number.toLowerCase() === verifyInput.trim().toLowerCase() ||
                     c.title.toLowerCase().includes(verifyInput.trim().toLowerCase())
              );
              
              if (found) {
                setVerifiedCert(found);
              } else {
                setVerifyError('No matching legal registration found for the entered number. Try entering a code like "NCIC-CIV-G1-90412" or "C-1224/2012".');
              }
            };

            const selectCertIcon = (cat: string) => {
              switch (cat) {
                case 'Legal & Incorporation':
                  return <Shield className="w-5 h-5 text-indigo-500" />;
                case 'NCIC Construction Licenses':
                  return <HardHat className="w-5 h-5 text-amber-500" />;
                case 'Tax & Municipal':
                  return <FileText className="w-5 h-5 text-emerald-500" />;
                case 'Safety & Professional':
                  return <Award className="w-5 h-5 text-blue-500" />;
                default:
                  return <FileText className="w-5 h-5 text-gray-500" />;
              }
            };

            return (
              <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-16 w-full space-y-12">
                
                {/* Header Banner */}
                <div className="bg-primary text-white p-8 md:p-12 rounded-none border-l-4 border-l-secondary relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-md">
                  <div className="absolute inset-0 bg-radial-gradient from-secondary/10 to-transparent pointer-events-none" />
                  <div className="space-y-3 max-w-3xl relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary bg-secondary/10 px-3 py-1.5 border border-secondary/30">
                      LEGAL STATUS & AUDIT
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                      Company Registrations & Certifications
                    </h1>
                    <p className="text-xs md:text-sm text-gray-300 font-light max-w-2xl leading-relaxed">
                      Zion Projects Construction Ltd operates in strict compliance with the laws of the Republic of Malawi. Here you can inspect our legal standing, download certified documents, and instantly verify our active Grade-A contractor licenses.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 shrink-0 grid grid-cols-2 gap-6 min-w-[240px] text-center backdrop-blur-sm relative z-10">
                    <div>
                      <span className="block text-2xl font-black text-secondary">Grade-A</span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">NCIC Status</span>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                      <span className="block text-2xl font-black text-emerald-400">100%</span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Tax Compliance</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Category Selector & Verification Panel */}
                  <div className="lg:col-span-4 space-y-8">
                    
                    {/* Interactive Real-time Verification Tool */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
                      <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-5 h-5 text-secondary" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                            Contractor Verification
                          </h3>
                        </div>
                        <p className="text-[10px] text-gray-500 font-light">
                          Verify the authenticity of Zion Projects' credentials against our local database directory.
                        </p>
                      </div>

                      <form onSubmit={handleVerifyCheck} className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter Number (e.g. C-1224/2012)"
                            value={verifyInput}
                            onChange={(e) => setVerifyInput(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-none py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-primary font-mono placeholder:font-sans"
                          />
                          <button
                            type="submit"
                            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-primary text-secondary hover:bg-secondary hover:text-primary transition-all rounded-none cursor-pointer flex items-center justify-center border border-secondary/20"
                          >
                            <Search size={13} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-gray-400 font-medium">Quick examples:</span>
                          <button 
                            type="button" 
                            onClick={() => { setVerifyInput('C-1224/2012'); setVerifyError(''); setVerifiedCert(null); }}
                            className="text-[9px] text-secondary font-bold hover:underline"
                          >
                            C-1224/2012
                          </button>
                          <span className="text-gray-300">|</span>
                          <button 
                            type="button" 
                            onClick={() => { setVerifyInput('NCIC-CIV-G1-90412'); setVerifyError(''); setVerifiedCert(null); }}
                            className="text-[9px] text-secondary font-bold hover:underline"
                          >
                            NCIC-CIV-G1-90412
                          </button>
                        </div>
                      </form>

                      {/* Verification Results Panel */}
                      {verifiedCert && (
                        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-none animate-fade-in space-y-3">
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                                CREDENTIAL VERIFIED
                              </span>
                              <h4 className="text-xs font-bold text-gray-800">{verifiedCert.title}</h4>
                              <p className="text-[10px] text-gray-500 leading-normal font-light">
                                Issued by {verifiedCert.authority} under license register <strong className="font-mono text-emerald-700">{verifiedCert.number}</strong>.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-white p-2.5 border border-emerald-100 rounded-none grid grid-cols-2 gap-2 text-[9px] font-bold text-gray-600 font-mono">
                            <div>
                              <span className="text-gray-400 block text-[8px] font-sans">STATUS</span>
                              <span className="text-emerald-600">{verifiedCert.status}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[8px] font-sans">EXPIRY DATE</span>
                              <span>{verifiedCert.expiryDate}</span>
                            </div>
                          </div>
                          <p className="text-[9px] text-emerald-700/80 leading-relaxed font-light">
                            ✓ Security Handshake: Cleared by internal database verification as fully active and legally compliant.
                          </p>
                        </div>
                      )}

                      {verifyError && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-none text-xs text-red-700 flex items-start gap-2 animate-fade-in">
                          <span className="font-bold text-red-500 shrink-0">!</span>
                          <p className="leading-relaxed font-light text-[11px]">{verifyError}</p>
                        </div>
                      )}
                    </div>

                    {/* Category Filter Menu */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary border-b border-gray-100 pb-2">
                        Filter By Category
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: 'all', label: 'All Registrations' },
                          { id: 'Legal & Incorporation', label: 'Legal & Incorporation' },
                          { id: 'NCIC Construction Licenses', label: 'NCIC Construction Licenses' },
                          { id: 'Tax & Municipal', label: 'Tax & Municipal' },
                          { id: 'Safety & Professional', label: 'Safety & Professional' }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setCertCategory(cat.id)}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-none flex justify-between items-center ${
                              certCategory === cat.id
                                ? 'bg-primary text-secondary border-l-4 border-l-secondary font-bold'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
                              certCategory === cat.id ? 'bg-secondary text-primary' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {cat.id === 'all' 
                                ? certificates.length 
                                : certificates.filter(c => c.category === cat.id).length
                              }
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Credibility Guarantee block */}
                    <div className="bg-[#FAF7F2] border border-[#E9E1CE] p-6 rounded-none space-y-3">
                      <h4 className="text-xs font-bold text-[#8C6D3B] uppercase tracking-wide flex items-center gap-2">
                        <Shield className="w-4 h-4 text-secondary" />
                        Compliance & Audit Policy
                      </h4>
                      <p className="text-[11px] text-[#6E5A35] leading-relaxed font-light">
                        Many institutional clients, including Government departments, municipal assemblies, and international organizations require proof of legal incorporation, tax status, and NCIC registrations. Zion Projects provides this portal to afford absolute transparency and security in the commercial bidding phase.
                      </p>
                      <p className="text-[10px] text-gray-400 italic">
                        Last audited by independent structural and tax bodies: July 2026.
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Search & Certificates Grid */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Search and results info bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-gray-200">
                      <div className="relative w-full sm:max-w-xs">
                        <input
                          type="text"
                          placeholder="Search certificates..."
                          value={certSearch}
                          onChange={(e) => setCertSearch(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-none py-2 px-3 pl-8 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                        />
                        <Search size={12} className="absolute left-2.5 top-3 text-gray-400" />
                      </div>
                      
                      <div className="text-[11px] font-bold text-gray-500">
                        Showing {filteredCerts.length} of {certificates.length} Credentials
                      </div>
                    </div>

                    {/* Certs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredCerts.length === 0 ? (
                        <div className="col-span-full bg-white border border-gray-100 py-16 text-center shadow-sm">
                          <span className="text-sm font-bold text-gray-400 block mb-2">No Matching Certifications Found</span>
                          <button 
                            onClick={() => { setCertSearch(''); setCertCategory('all'); }}
                            className="text-xs text-secondary font-bold hover:underline"
                          >
                            Reset all filters
                          </button>
                        </div>
                      ) : (
                        filteredCerts.map(cert => {
                          const isDownloading = downloadingCertId === cert.id;
                          return (
                            <div 
                              key={cert.id} 
                              className="bg-white p-6 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6 relative group"
                            >
                              <div className="space-y-4">
                                {/* Header of card */}
                                <div className="flex justify-between items-start">
                                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-none">
                                    {selectCertIcon(cert.category)}
                                  </div>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                    cert.status === 'Grade-A Registered'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : cert.status === 'Compliant'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : cert.status === 'Verified'
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}>
                                    {cert.status}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block">
                                    {cert.category}
                                  </span>
                                  <h3 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                                    {cert.title}
                                  </h3>
                                  <p className="text-[11px] text-gray-500 font-light leading-relaxed line-clamp-2">
                                    {cert.description}
                                  </p>
                                </div>

                                {/* Numbers & Expiry Section */}
                                <div className="bg-gray-50 p-3 space-y-1.5 border border-gray-100">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-400 font-medium">Doc Number:</span>
                                    <span className="font-mono text-primary font-bold">{cert.number}</span>
                                  </div>
                                  <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-400 font-medium">Expiry:</span>
                                    <span className={`font-semibold ${cert.expiryDate.includes('Permanent') ? 'text-emerald-600' : 'text-gray-600'}`}>
                                      {cert.expiryDate}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Action buttons */}
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => setInspectedCert(cert)}
                                  className="py-2 bg-gray-100 hover:bg-gray-200 text-primary text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                                >
                                  View Certificate
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setDownloadingCertId(cert.id);
                                    setTimeout(() => {
                                      setDownloadingCertId(null);
                                      setInspectedCert(cert);
                                      // Trigger simulation download success
                                      alert(`PDF Export Initiated: Formulating official print spec sheet for registration: "${cert.title}" (License: ${cert.number}). Select Print Destination to save as PDF.`);
                                    }, 1000);
                                  }}
                                  disabled={isDownloading}
                                  className="py-2 bg-primary hover:bg-secondary text-secondary hover:text-primary disabled:bg-primary/50 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1 border border-secondary/20"
                                >
                                  {isDownloading ? (
                                    <>
                                      <Loader2 className="animate-spin w-3 h-3 text-secondary" />
                                      <span>Preparing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Download size={11} />
                                      <span>Download PDF</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>

                </div>

                {/* FAQ section reference */}
                <div className="bg-white p-8 border border-gray-200 text-center space-y-4">
                  <h3 className="text-lg font-black text-primary uppercase">
                    Need additional legal documentations or tender files?
                  </h3>
                  <p className="text-xs text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                    If your procurement regulations demand additional tax declarations, board resolutions, bank statements, or joint venture articles of association, please reach out directly to our corporate secretaries at Area 14 headquarters.
                  </p>
                  <button
                    onClick={() => { setCurrentView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex bg-secondary hover:bg-primary text-primary hover:text-white px-8 py-3 font-bold text-xs uppercase tracking-widest border border-secondary transition-all cursor-pointer"
                  >
                    Contact Procurement Division
                  </button>
                </div>

                {/* ----------------- HIGH FIDELITY CERTIFICATE PREVIEW MODAL ----------------- */}
                {inspectedCert && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in print:bg-white print:p-0">
                    
                    <div className="bg-white w-full max-w-3xl rounded-none border-8 border-slate-900 overflow-hidden shadow-2xl relative flex flex-col justify-between max-h-[90vh] print:max-h-full print:border-0 print:shadow-none">
                      
                      {/* Close button - hidden on print */}
                      <button 
                        onClick={() => setInspectedCert(null)}
                        className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-100 text-slate-800 hover:text-red-700 transition-colors cursor-pointer print:hidden z-10"
                        title="Close preview"
                      >
                        <X size={20} />
                      </button>

                      {/* Modal Scrollable area */}
                      <div className="p-8 md:p-12 overflow-y-auto print:overflow-visible flex-1 space-y-8 print:p-0">
                        
                        {/* THE OFFICIAL CERTIFICATE CANVAS */}
                        <div className="border-4 border-double border-amber-800 p-8 md:p-12 relative flex flex-col gap-6 items-center text-center bg-[#FAF9F5] select-none print:bg-white print:border-amber-900 print:py-12">
                          
                          {/* Guilloche Corner Accents */}
                          <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-amber-800/60" />
                          <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2 border-amber-800/60" />
                          <div className="absolute bottom-2 left-2 w-10 h-10 border-b-2 border-l-2 border-amber-800/60" />
                          <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-amber-800/60" />

                          {/* Watermark Logo behind content */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <span className="text-[120px] font-black tracking-widest text-primary rotate-45 select-none">ZION</span>
                          </div>

                          {/* Certificate Crest Heading */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-900">
                              REPUBLIC OF MALAWI
                            </span>
                            <div className="w-12 h-12 bg-amber-800 text-secondary flex items-center justify-center rotate-45 border-2 border-amber-100 shadow">
                              <Shield size={20} className="-rotate-45 text-secondary" />
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-extrabold mt-2">
                              {inspectedCert.authority}
                            </span>
                          </div>

                          {/* Main Cert Title */}
                          <div className="space-y-1.5 w-full">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold block">
                              OFFICIAL REGISTRATION DOCUMENT
                            </span>
                            <h2 className="text-xl md:text-3xl font-serif font-black text-amber-950 uppercase tracking-tight py-1 border-y border-amber-800/20 max-w-lg mx-auto">
                              {inspectedCert.title}
                            </h2>
                            <div className="text-[11px] font-mono font-bold text-amber-900 mt-2">
                              REGISTRATION NO: <span className="bg-amber-100 px-2 py-0.5 border border-amber-200">{inspectedCert.number}</span>
                            </div>
                          </div>

                          {/* Legal Certificate Statement */}
                          <div className="space-y-4 max-w-xl text-center leading-relaxed">
                            <p className="text-xs text-slate-700 font-serif leading-loose">
                              This is to certify that <strong className="text-amber-950 uppercase text-sm font-sans tracking-wide">Zion Projects Construction Ltd</strong>, legally operating and registered under the legal framework of the Republic of Malawi, has been duly vetted and recorded as an active practitioner in the category of <strong className="text-amber-900 font-sans uppercase text-[11px]">{inspectedCert.category}</strong>.
                            </p>
                            <p className="text-[11px] text-slate-600 font-serif leading-relaxed italic">
                              "The holder of this credential complies with all applicable statutory rules, financial duties, and regulatory audits required to deliver engineering and structural contracts of this level."
                            </p>
                          </div>

                          {/* Seal, Dates & Authority Signatures */}
                          <div className="w-full pt-6 grid grid-cols-3 gap-4 items-end text-center">
                            
                            {/* Dates column */}
                            <div className="space-y-1 font-mono text-[9px] text-left pl-4">
                              <div>
                                <span className="text-slate-400 font-sans block text-[8px] uppercase">Date of Issue:</span>
                                <span className="font-bold text-slate-700">{inspectedCert.issueDate}</span>
                              </div>
                              <div className="pt-2">
                                <span className="text-slate-400 font-sans block text-[8px] uppercase">Expiration Date:</span>
                                <span className="font-bold text-slate-700">{inspectedCert.expiryDate}</span>
                              </div>
                            </div>

                            {/* Center Gold Stamp Seal */}
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-amber-500 text-[#543d1a] rounded-full flex items-center justify-center border-4 border-double border-amber-200 shadow-md relative group">
                                <div className="absolute inset-0.5 rounded-full border border-dashed border-amber-100/60" />
                                <span className="text-[7px] font-extrabold text-center uppercase tracking-wider leading-none">
                                  OFFICIAL<br/>SEAL
                                </span>
                              </div>
                              <span className="text-[7px] font-black uppercase tracking-widest text-amber-800 mt-1.5">
                                APPROVED & ACTIVE
                              </span>
                            </div>

                            {/* Registrar Signature column */}
                            <div className="flex flex-col items-center pr-4">
                              {/* Mock Signature line */}
                              <div className="w-24 h-6 border-b border-amber-800/30 flex items-center justify-center select-none opacity-80 overflow-hidden">
                                <span className="font-serif italic text-amber-900 text-xs tracking-widest">K. Mpoola</span>
                              </div>
                              <span className="text-slate-400 text-[8px] uppercase mt-1">Registrar General</span>
                              <span className="text-slate-500 text-[7px] uppercase font-bold">Malawi Registry Office</span>
                            </div>

                          </div>

                          {/* Security QR Validation indicator */}
                          <div className="w-full border-t border-amber-800/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[8px] font-mono text-slate-400">
                            <span>System Security Validation ID: VERIFIED-ZION-MW-2026-REG</span>
                            <span className="text-emerald-600 font-bold">✓ SECURITY COMPLIANCE HANDSHAKE COMPLETED</span>
                          </div>

                        </div>

                        {/* Extra Compliance Notes in modal */}
                        <div className="space-y-2 bg-slate-50 p-4 border border-slate-200">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                            <Info size={12} className="text-secondary" />
                            Vetting & Audit Remarks
                          </h4>
                          <p className="text-xs text-slate-600 font-light leading-relaxed">
                            {inspectedCert.complianceNotes}
                          </p>
                        </div>

                      </div>

                      {/* Modal bottom action buttons - hidden on print */}
                      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-3 print:hidden">
                        <button
                          onClick={() => setInspectedCert(null)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        
                        <button
                          onClick={() => {
                            window.print();
                          }}
                          className="px-6 py-2 bg-secondary hover:bg-white text-primary hover:text-primary transition-all font-bold text-xs uppercase tracking-wider cursor-pointer border border-secondary/20 flex items-center gap-1.5"
                        >
                          <FileText size={13} />
                          <span>Print Document</span>
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* ==================================================
              REQUEST QUOTATION WIZARD VIEW
              ================================================== */}
          {currentView === 'quote-builder' && (
            <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-16 w-full">
              <QuoteForm services={services} />
            </div>
          )}

          {/* ==================================================
              PRIVACY POLICY
              ================================================== */}
          {currentView === 'privacy-policy' && (
            <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-16 w-full space-y-4 text-xs text-gray-600 leading-relaxed">
              <h1 className="text-2xl font-black text-primary tracking-tight">Privacy Policy</h1>
              <p>Last modified: July 7, 2026</p>
              <p>ZION PROJECTS CONSTRUCTION LTD operates this corporate portal. This page informs you of our policies regarding the collection, use, and disclosure of personal or corporate specifications received from estimators.</p>
              <h3 className="font-bold text-primary mt-4 text-sm">Data Collection & Sourcing</h3>
              <p>While compiling quotation estimates or HR applications, we collect phone, names, emails, company registration certificates, and cover letters. These files are stored securely in memory log databases to enable estimators to organize responses.</p>
              <h3 className="font-bold text-primary mt-4 text-sm">Prepared Encryption Safety</h3>
              <p>The safety of your data is paramount. Our Node back-end filters parameter values against XSS injection vectors, incorporating prepared SQL syntax boundaries. No corporate spec sheets are sold or dispatched to third-party entities.</p>
            </div>
          )}

          {/* ==================================================
              TERMS & CONDITIONS
              ================================================== */}
          {currentView === 'terms-conditions' && (
            <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-16 w-full space-y-4 text-xs text-gray-600 leading-relaxed">
              <h1 className="text-2xl font-black text-primary tracking-tight">Terms & Conditions</h1>
              <p>Last modified: July 7, 2026</p>
              <p>By accessing and submitting parameter logs to Zion Projects websites, you bind yourself to comply with these terms of use. Please review them carefully.</p>
              <h3 className="font-bold text-primary mt-4 text-sm">Estimated Cost Adjustments</h3>
              <p>All cost feedback compiled by the Google Gemini AI Smart Pre-Estimator is strictly preliminary. Official structural budget commitments require physical site surveys by certified Zion Projects engineers and formal NCIC approved tender document signs.</p>
              <h3 className="font-bold text-primary mt-4 text-sm">Tender Document Indemnifications</h3>
              <p>Users must guarantee all attached specs, site coordinates, and blueprints do not infringe on copyrights or violate zoning board specifications in Malawi.</p>
            </div>
          )}

        </main>
      )}

      {/* 3. MEGA FOOTER MODULE */}
      <Footer companyInfo={companyInfo} onNavigate={setCurrentView} />

      {/* 4. MODALS & LIGHTBOX SLIDES POPUPS */}

      {/* Lightbox photo expander */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img src={lightboxImage} alt="Expanded operations photo" className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl border border-white/10" />
        </div>
      )}

      {/* Project details pop-up sheet */}
      {activeProjectDetail && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-xs space-y-6">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[9px] uppercase font-black text-secondary">{activeProjectDetail.categoryName}</span>
                <h3 className="text-base font-black text-primary mt-0.5">{activeProjectDetail.title}</h3>
              </div>
              <button 
                onClick={() => setActiveProjectDetail(null)} 
                className="text-gray-400 hover:text-primary cursor-pointer p-1.5 hover:bg-gray-50 rounded"
              >
                Close
              </button>
            </div>

            <img src={activeProjectDetail.images[0]?.url} alt={activeProjectDetail.title} className="w-full h-64 object-cover rounded-xl shadow" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Client Sourcing</span>
                <span className="font-bold text-primary">{activeProjectDetail.client}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Coordinates</span>
                <span className="font-bold text-primary">{activeProjectDetail.location}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Est. Budget</span>
                <span className="font-bold text-secondary">{activeProjectDetail.budget}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Completion</span>
                <span className="font-bold text-primary">{activeProjectDetail.completionDate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-primary uppercase tracking-wider">Engineering Scope Summary</h4>
              <p className="text-gray-600 leading-relaxed font-medium text-[11px] whitespace-pre-line">
                {activeProjectDetail.description}
              </p>
            </div>

            {activeProjectDetail.documents && activeProjectDetail.documents.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider">Project Audit Documents</h4>
                <div className="space-y-2">
                  {activeProjectDetail.documents.map((doc, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded flex justify-between items-center border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <FileText size={15} className="text-secondary" />
                        <span className="font-bold text-primary">{doc.name} ({doc.size})</span>
                      </div>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert("Preparing document file stream. Your download starts shortly."); }}
                        className="text-secondary hover:underline font-bold"
                      >
                        Download Doc
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Careers Job requirements details modal */}
      {activeJobDetail && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto text-xs space-y-6">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[9px] uppercase font-black text-secondary">{activeJobDetail.department}</span>
                <h3 className="text-base font-black text-primary mt-0.5">{activeJobDetail.title}</h3>
              </div>
              <button onClick={() => setActiveJobDetail(null)} className="text-gray-400 hover:text-primary cursor-pointer p-1">Close</button>
            </div>

            {applySuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-full animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-base font-bold text-primary">{applySuccess}</h4>
                <button
                  onClick={() => { setApplySuccess(''); setActiveJobDetail(null); }}
                  className="text-secondary font-bold hover:underline"
                >
                  Exit Modal
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-[9px] text-gray-400 block uppercase font-bold">Category</span>
                    <span className="font-bold text-primary">{activeJobDetail.type}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-[9px] text-gray-400 block uppercase font-bold">Site Loc</span>
                    <span className="font-bold text-primary truncate block">{activeJobDetail.location.split(' / ')[0]}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-[9px] text-gray-400 block uppercase font-bold">Deadline</span>
                    <span className="font-bold text-red-500">{activeJobDetail.deadline}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-primary uppercase tracking-wider">Description</h4>
                  <p className="text-gray-500 leading-relaxed">{activeJobDetail.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-primary uppercase tracking-wider">Requirements</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-500 leading-relaxed">
                    {activeJobDetail.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-primary uppercase tracking-wider">Responsibilities</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-500 leading-relaxed">
                    {activeJobDetail.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>

                {/* Job application form inline */}
                <form onSubmit={handleJobApplySubmit} className="pt-5 border-t border-gray-100 space-y-4">
                  <h4 className="font-black text-primary uppercase tracking-wider">Apply for this opening</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={applyForm.fullName}
                      onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                      className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email Address *"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder="Your Phone Number *"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CV File name e.g. Resume_Moses.pdf *"
                      value={applyForm.cvFileName}
                      onChange={(e) => setApplyForm({ ...applyForm, cvFileName: e.target.value })}
                      className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <textarea
                    placeholder="Briefly state why you're a good fit for this highway or building contract *"
                    value={applyForm.coverLetter}
                    onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 p-2.5 rounded text-xs focus:outline-none"
                    required
                  />

                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="w-full bg-primary hover:bg-primary/95 text-secondary hover:text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {applyLoading && <Loader2 size={13} className="animate-spin text-secondary" />}
                    <span>Submit Employment Application</span>
                  </button>
                </form>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating Cookies agreement ribbon */}
      {showCookie && settings?.cookieConsentActive && (
        <div className="fixed bottom-4 left-4 right-4 bg-primary text-white p-4 rounded-xl border border-white/10 z-40 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs construction-grid-bg">
          <p className="font-semibold text-center sm:text-left max-w-xl">
            This corporate portal uses technical cookies and prepared session estimators in compliance with National Construction Industry Council standard protocols.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCookie(false)}
              className="bg-secondary text-primary font-black px-4 py-2 rounded uppercase text-[10px] tracking-wider cursor-pointer hover:bg-secondary/90 transition-all"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
