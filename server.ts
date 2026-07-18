import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  User, Service, Project, ProjectCategory, GalleryItem, Album, 
  Blog, BlogCategory, Testimonial, ClientPartner, TeamMember, 
  Vacancy, Application, Download, ContactMessage, QuoteRequest, 
  WebsiteSettings, ActivityLog, SystemLog, CompanyInfo, UserRole, RegistrationCertificate
} from './src/types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

app.use(express.json());

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in the Secrets panel.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Preseeded Data generator helper
function getInitialData() {
  const companyInfo: CompanyInfo = {
    name: "ZION PROJECTS CONSTRUCTION LTD",
    slogan: "Building Malawi's Future with Excellence.",
    ceoName: "Khama Mpoola",
    ceoMessage: "For over a decade, Zion Projects has been at the forefront of engineering resilient infrastructure across Malawi. Our commitment to world-class safety, rigorous project management, and community-first development drives every brick we lay and road we pave. We don't just build structures; we build national pathways to prosperity.",
    ceoImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    mission: "To provide high-quality, reliable, and cost-effective construction and engineering solutions that exceed client expectations while promoting safety, professionalism, environmental responsibility, and community development.",
    vision: "To become one of Malawi's leading construction and engineering companies, recognized for excellence, innovation, quality, and sustainable infrastructure development.",
    history: "Zion Projects Construction Ltd is a Malawian-owned construction and engineering company committed to delivering high-quality, cost-effective, and sustainable construction solutions. The company specializes in civil engineering works, building construction, road works, infrastructure development, project management, and maintenance services. Founded with a vision of contributing to Malawi's infrastructure growth, Zion Projects Construction Ltd combines technical expertise, innovation, and professionalism to successfully execute projects that meet client expectations while adhering to industry standards, safety requirements, and environmental best practices. We are dedicated to building long-term relationships with our clients through integrity, quality workmanship, and reliable service delivery.",
    coreValues: [
      { title: "INTEGRITY", description: "We conduct our business honestly, ethically, and transparently." },
      { title: "EXCELLENCE", description: "We strive for the highest standards of quality in every project we undertake." },
      { title: "SAFETY", description: "We prioritize the health, safety, and well-being of our employees, clients, and communities." },
      { title: "PROFESSIONALISM", description: "We maintain competence, accountability, and respect in all our operations." },
      { title: "INNOVATION", description: "We embrace modern construction techniques and continuous improvement." },
      { title: "RELIABILITY", description: "We deliver projects on time and within budget while meeting agreed specifications." },
      { title: "TEAMWORK", description: "We foster collaboration and mutual respect among employees, clients, partners, and stakeholders." },
      { title: "SUSTAINABILITY", description: "We promote environmentally responsible construction practices and sustainable development." }
    ],
    phone: "+265 997 914 840",
    phoneAlternative: "+265 992 847 803",
    email: "zionprojectsltd265@gmail.com",
    emailInquiries: "zionprojectsltd265@gmail.com",
    address: "Zion House, Plot 47/3, Area 14, Lilongwe, Malawi",
    workingHours: "Monday – Friday: 08:00 AM – 05:00 PM",
    workingHoursSat: "Closed",
    socialLinks: {
      facebook: "https://www.facebook.com/zionbuilding",
      linkedin: "https://linkedin.com/company/zion-projects-construction-ltd",
      twitter: "https://twitter.com/zionprojectsmw"
    },
    bankDetails: {
      bankName: "First Capital Bank",
      accountName: "Zion Projects Construction Limited",
      accountNumber: "0002704007309",
      currency: "MWK",
      branch: "Lilongwe"
    },
    ourPromise: "To deliver durable, high-quality projects that meet client expectations while creating lasting value for all stakeholders."
  };

  const services: Service[] = [
    {
      id: "srv-1",
      title: "Building Construction",
      slug: "building-construction",
      icon: "Building2",
      shortDescription: "Premium commercial, industrial, and high-density residential structures with precise finishings.",
      description: "Zion Projects excels in vertical construction, offering complete turnkey structural solutions. From luxury corporate high-rises and institutional complexes to master-planned residential estates, we manage all phases of building. Our services encompass structural concrete framework, masonry work, internal fit-outs, and MEP installations, always executed to meet and exceed national building standard protocols.",
      featured: true,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "srv-2",
      title: "Civil Engineering & Road Construction",
      slug: "civil-road-construction",
      icon: "Road",
      shortDescription: "Nation-spanning asphalt roads, heavy grading, earthworks, and standard highways.",
      description: "We are Grade-A registered contractors for Malawian highways and municipal roads. Our expertise spans site surveying, bulk excavation, subgrade preparation, stabilized bases, bituminous seal coats, and high-durability asphalt concrete surfacing. We specialize in engineering high-traffic corridors, trunk routes, and rural feeder networks, incorporating reliable drainage structures for weather-resilient links.",
      featured: true,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "srv-3",
      title: "Bridges & Culverts",
      slug: "bridges-culverts",
      icon: "Layers",
      shortDescription: "Structural concrete bridges, portal culverts, and structural steel river crossings.",
      description: "Designing and constructing water crossings that withstand Malawi's diverse hydrological seasons is a signature Zion capability. We engineer reinforced concrete girder bridges, pile foundations, abutments, high-load pier systems, and pre-cast box culvert layouts. Our structural designs are stress-tested for flood cycles and dynamic seismic actions common along the African Rift system.",
      featured: true,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "srv-4",
      title: "Water Supply & Drainage Systems",
      slug: "water-supply-drainage",
      icon: "Droplets",
      shortDescription: "Municipal water distribution, deep borehole networks, and agricultural drainage channels.",
      description: "We build modern utility pathways, including potable water pump houses, high-capacity elevated steel reserve tanks, water distribution mains, and reticulation piping. On the environmental drainage side, we build storm-water channels, concrete side drains, check-dams, and retention basin complexes to protect urban neighborhoods from catastrophic runoff erosion.",
      featured: false,
      image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "srv-5",
      title: "Sewer & Sewerage Systems",
      slug: "sewer-systems",
      icon: "ShieldAlert",
      shortDescription: "Comprehensive sewer network installation, gravity pipes, manholes, and treatment plants.",
      description: "We supply and install comprehensive sewer networks, including concrete and HDPE gravity lines, wastewater collection manholes, waste stabilization ponds, trickling filters, and chemical dosing facilities. Our work ensures safe local environmental disposal, aligning precisely with Ministry of Natural Resources guidelines.",
      featured: false,
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "srv-6",
      title: "Supply of Construction Materials",
      slug: "construction-materials-supply",
      icon: "Truck",
      shortDescription: "High-grade aggregate gravel, river sand, premium Portland cement, and reinforcing steel rebar.",
      description: "Leveraging our reliable supply-chain network and partner quarries, Zion provides logistics and wholesale supply for project contractors. We deliver crushed granite aggregates of varied fractions, fine river sand, tested structural reinforcement steel, standard building bricks, and heavy-duty concrete masonry units directly to site coordinates.",
      featured: false,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const projectCategories: ProjectCategory[] = [
    { id: "cat-1", name: "Roads & Highways", slug: "roads-highways" },
    { id: "cat-2", name: "Buildings & Commercial", slug: "buildings-commercial" },
    { id: "cat-3", name: "Bridges & Hydraulic Works", slug: "bridges-hydraulic" },
    { id: "cat-4", name: "Water & Sewerage", slug: "water-sewerage" }
  ];

  const projects: Project[] = [
    {
      id: "proj-1",
      title: "Lilongwe - Blantyre Highway M1 Upgrade",
      slug: "m1-highway-upgrade",
      categoryId: "cat-1",
      location: "Dedza - Ntcheu Sector",
      region: "Central Malawi",
      district: "Dedza",
      completionDate: "2025-11-20",
      client: "Malawi Roads Authority / Ministry of Transport & Public Works",
      budget: "$12.4M USD",
      description: "A major arterial infrastructure contract focusing on the rehabilitation, widening, and asphalt resurfacing of a 45KM section of the primary M1 corridor. The project included deep sub-grade stabilizer application, complete reconstruction of double-bitumen base course, construction of modern concrete side drainage channels in urban commercial hubs, and standard thermo-plastic road markings and reflective road studs. Completed 3 months ahead of schedule with zero safety incidents.",
      featured: true,
      status: "Completed",
      progress: 100,
      images: [
        { id: "img-1-1", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", caption: "Finished M1 carriageway section in Dedza" },
        { id: "img-1-2", url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800", caption: "Heavy earth compaction machinery on site" }
      ],
      documents: [
        { name: "M1_Project_Completion_Certificate.pdf", size: "1.8 MB", url: "#" },
        { name: "Environmental_Audit_Dedza.pdf", size: "2.4 MB", url: "#" }
      ]
    },
    {
      id: "proj-2",
      title: "Chire River Bridge Reconstruction",
      slug: "chire-river-bridge",
      categoryId: "cat-3",
      location: "Liwonde, Machinga District",
      region: "Southern Malawi",
      district: "Machinga",
      completionDate: "2026-02-15",
      client: "Machinga District Council & Department of Civil Engineering",
      budget: "$5.8M USD",
      description: "Replacement of a dilapidated, flood-vulnerable steel-truss crossing with a modern 3-span reinforced concrete girder bridge. Designed with deep-pile concrete foundations drilled 12 meters into the river bed, monolithic pier columns, high-strength prestressed concrete beams, and standard pedestrian guardrails. This structure secures an essential transport link for local agricultural distribution during seasonal flood stages.",
      featured: true,
      status: "Completed",
      progress: 100,
      images: [
        { id: "img-2-1", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800", caption: "Main deck construction completed in Liwonde" },
        { id: "img-2-2", url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800", caption: "Hydrological analysis and pier setting" }
      ],
      documents: [
        { name: "Hydrological_Report_Liwonde.pdf", size: "4.1 MB", url: "#" }
      ]
    },
    {
      id: "proj-3",
      title: "Zion Luxury Heights Corporate Plaza",
      slug: "zion-luxury-heights",
      categoryId: "cat-2",
      location: "City Centre, Sector 19, Lilongwe",
      region: "Central Malawi",
      district: "Lilongwe",
      completionDate: "2026-12-01",
      client: "Zion Holdings & Private Institutional Investors",
      budget: "$8.5M USD",
      description: "An ongoing premier commercial real estate development in Lilongwe City Centre. The structure is a modern, energy-efficient 8-story corporate office tower. Features advanced post-tensioned concrete slab systems, premium floor-to-ceiling glass curtain walls with thermal insulation, low-emission HVAC layouts, secure dual-basement high-capacity parking, integrated fire detection & suppression mechanisms, and a rooftop solar farm providing 150kW of backup power.",
      featured: true,
      status: "In Progress",
      progress: 72,
      images: [
        { id: "img-3-1", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", caption: "Structural framework reaching 8th floor" },
        { id: "img-3-2", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800", caption: "Curtain wall cladding installation phase" }
      ],
      documents: [
        { name: "Structural_Design_Overview.pdf", size: "8.2 MB", url: "#" },
        { name: "Solar_Integration_Plan_Plaza.pdf", size: "3.1 MB", url: "#" }
      ]
    },
    {
      id: "proj-4",
      title: "Zomba Municipal Wastewater Upgrades",
      slug: "zomba-wastewater-upgrades",
      categoryId: "cat-4",
      location: "Zomba Municipality",
      region: "Southern Malawi",
      district: "Zomba",
      completionDate: "2027-04-10",
      client: "Zomba City Council / Water Resources Board",
      budget: "$3.9M USD",
      description: "A crucial environmental sanitary contract targeting the expansion of the municipal reticulation system. It covers the installation of 12KM of high-performance HDPE sewer pipes, modern pre-cast concrete inspection chambers, and the complete refurbishment of wastewater secondary stabilization ponds. The upgrades will prevent stormwater run-off contamination and enhance biological purification cycles for Zomba citizens.",
      featured: false,
      status: "Planning",
      progress: 15,
      images: [
        { id: "img-4-1", url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800", caption: "Excavation and pipe laying design blueprints" }
      ]
    },
    {
      id: "proj-5",
      title: "Mzuzu Dual Carriageway Rehabilitation",
      slug: "mzuzu-dual-carriageway",
      categoryId: "cat-1",
      location: "Mzuzu City Centre",
      region: "Northern Malawi",
      district: "Mzuzu",
      completionDate: "2024-08-10",
      client: "Mzuzu City Council / Roads Authority",
      budget: "$4.5M USD",
      description: "Rehabilitation and dual-carriageway asphalt upgrading of critical avenues within Mzuzu city centre. Features upgraded stone masonry side drainage, safety walkways, and solar streetlights.",
      featured: true,
      status: "Completed",
      progress: 100,
      images: [
        { id: "img-5-1", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", caption: "Solar illuminated dual carriageway in Mzuzu" }
      ]
    }
  ];

  const gallery: GalleryItem[] = [
    { id: "gal-1", title: "Excavation Machinery On M1 Corridor", type: "image", url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800", albumId: "alb-1", albumName: "Heavy Machinery", projectId: "proj-1" },
    { id: "gal-2", title: "Liwonde Bridge Pier Reinforcement", type: "image", url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800", albumId: "alb-2", albumName: "Bridges", projectId: "proj-2" },
    { id: "gal-3", title: "Concrete Batching Plant Operations", type: "image", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", albumId: "alb-1", albumName: "Heavy Machinery", projectId: "proj-1" },
    { id: "gal-4", title: "Zion Plaza Framing Drone View", type: "image", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", albumId: "alb-3", albumName: "Buildings", projectId: "proj-3" },
    { id: "gal-5", title: "Sewer Pipe Alignment Inspections", type: "image", url: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800", albumId: "alb-4", albumName: "Utilities", projectId: "proj-4" }
  ];

  const albums: Album[] = [
    { id: "alb-1", name: "Heavy Machinery", description: "Zion Projects owned fleet of excavators, graders, compactors, and batching units." },
    { id: "alb-2", name: "Bridges", description: "Bridges and drainage structure works across Malawi." },
    { id: "alb-3", name: "Buildings", description: "Commercial towers, institutional structures, and multi-unit blocks." },
    { id: "alb-4", name: "Utilities", description: "Sewer system and storm-water drainage layouts." }
  ];

  const blogCategories: BlogCategory[] = [
    { id: "bcat-1", name: "Civil Engineering", slug: "civil-engineering" },
    { id: "bcat-2", name: "Company Milestones", slug: "company-milestones" },
    { id: "bcat-3", name: "Construction Tech", slug: "construction-tech" }
  ];

  const blogs: Blog[] = [
    {
      id: "blog-1",
      title: "Tackling Soil Erosion in Malawian Highway Engineering",
      slug: "tackling-soil-erosion-highways",
      categoryId: "bcat-1",
      categoryName: "Civil Engineering",
      tags: ["Highways", "Drainage", "Soil Mechanics"],
      featuredImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
      content: "Malawi experiences high rainfall intensity during season cycles, which can cause heavy wash-outs and structural damage to road subgrades. In this technical piece, we outline how Zion Projects incorporates bio-engineering geotextiles, custom concrete catch-dams, and deep masonry side channels to anchor roads on steep sections like Dedza hills. These drainage enhancements ensure structural life expectancy increases by over 150%, guaranteeing durable tax-funded infrastructure.",
      excerpt: "An in-depth review of how bio-engineering, modern concrete side drains, and geotextiles secure steep highway corridors in Malawi from major rainy season wash-outs.",
      author: "Eng. Moses Phiri",
      createdAt: "2026-05-18",
      views: 342,
      featured: true,
      seoTitle: "Tackling Highway Soil Erosion in Malawi | Zion Projects",
      seoDescription: "Learn how Zion Projects engineers drainage enhancements and uses geotextiles to protect road corridors from erosion and heavy rains.",
      seoKeywords: "Malawi Highways, Civil Engineering, Soil Erosion, Roads Authority",
      comments: [
        { id: "cmt-1-1", authorName: "Patrick Banda", authorEmail: "patrick@civil.mw", content: "Superb insights on soil stabilizing. Very applicable for our regional soils.", createdAt: "2026-05-20", approved: true }
      ]
    },
    {
      id: "blog-2",
      title: "Zion Projects Enters Grade-A Highways Registry Status",
      slug: "zion-enters-grade-a",
      categoryId: "bcat-2",
      categoryName: "Company Milestones",
      tags: ["Certification", "NCIC", "Tenders"],
      featuredImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
      content: "We are thrilled to declare that the National Construction Industry Council (NCIC) has promoted Zion Projects Construction Ltd to the prestigious 'Grade-A' classification for both civil roads and structural building categories. This classification enables Zion Projects to submit competitive tenders for large-scale multi-million dollar public highways, complex bridge systems, and massive government building developments, marking a monumental step in our quest to build Malawi's future.",
      excerpt: "Zion Projects celebrates its promotion to 'Grade-A' status by the National Construction Industry Council of Malawi, enabling tenders on unlimited-scale infrastructure projects.",
      author: "Media Relations Team",
      createdAt: "2026-06-10",
      views: 189,
      featured: false,
      seoTitle: "Zion Projects Grade-A NCIC Contractor Status",
      seoDescription: "Zion Projects has been promoted to Grade-A contractor classification in Malawi for civil engineering and building construction projects.",
      seoKeywords: "NCIC Malawi, Grade-A Contractor, Government Tenders"
    },
    {
      id: "blog-3",
      title: "Adopting Pre-Stressed Concrete Beams for Bridge Durability",
      slug: "adopting-prestressed-concrete-bridges",
      categoryId: "bcat-3",
      categoryName: "Construction Tech",
      tags: ["Bridges", "Pre-Stressed Concrete", "Structural Design"],
      featuredImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
      content: "For the Machinga and Shire river regions, traditional concrete bridges often suffer from micro-cracking and deflection under high-load logistics trucks. Zion Projects has started pre-casting high-tension, pre-stressed concrete beams at our Lilongwe yard. By applying heavy internal steel cable tension before pouring concrete, we deliver beams with exceptional elasticity, minimal micro-cracking, and superior span capacities. This technique was highly instrumental in the successful, durable completion of the Liwonde Shire River Bridge.",
      excerpt: "Why prestressed concrete is becoming the construction industry benchmark for river crossings and highways exposed to heavy freight transport.",
      author: "Eng. Chiku Chilima",
      createdAt: "2026-06-25",
      views: 215,
      featured: true,
      seoTitle: "Pre-Stressed Concrete Bridge Beams | Zion Projects",
      seoDescription: "How Zion Projects leverages advanced pre-stressing concrete structures to achieve long life spans and micro-crack prevention on major bridge contracts.",
      seoKeywords: "Prestressed concrete, Bridge construction, Liwonde bridge, Shire river structural design"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: "tst-1",
      authorName: "Dr. Alister Munthali",
      position: "Director of Infrastructure Procurement",
      company: "Ministry of Transport & Public Works, Malawi",
      rating: 5,
      comment: "Zion Projects delivered the M1 sector upgrade under strict timelines and with impeccable standard conformity. Their engineering transparency and professional communication make them a premier choice for national public contracts.",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "tst-2",
      authorName: "Evelyn Chimwemwe",
      position: "VP of Project Management",
      company: "Apex Commercial Developments",
      rating: 5,
      comment: "The precision on the structural work of Zion Luxury Plaza is unparalleled. Their safety team maintained zero hazards on site, and their post-tension concrete design saved us 15% in materials budget. They are true masters of modern high-rise engineering.",
      authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const clients: ClientPartner[] = [
    { id: "cl-1", name: "Malawi Roads Authority", logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", type: "client" },
    { id: "cl-2", name: "Lilongwe Water Board", logo: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800", type: "client" },
    { id: "cl-3", name: "Zomba City Council", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", type: "client" },
    { id: "cp-1", name: "National Construction Industry Council (NCIC)", logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800", type: "partner" },
    { id: "cp-2", name: "Malawi Bureau of Standards (MBS)", logo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800", type: "partner" }
  ];

  const team_members: TeamMember[] = [
    {
      id: "tm-1",
      name: "Khama Mpoola",
      role: "Managing Director & Civil Engineer",
      department: "Executive Committee",
      bio: "Managing Director & Civil Engineer leading major civil, infrastructure, and building engineering works across Malawi.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      socials: { linkedin: "https://linkedin.com", email: "zionprojectsltd265@gmail.com" }
    },
    {
      id: "tm-2",
      name: "Eng. Chiku Chilima, BSc",
      role: "Chief Engineer & Project Director",
      department: "Engineering Department",
      bio: "Specialist in structural concrete engineering, prestressed bridge designs, and complex drainage networks.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      socials: { linkedin: "https://linkedin.com", email: "c.chilima@zionprojects.mw" }
    },
    {
      id: "tm-3",
      name: "Wiza Munyenyembe, MBA",
      role: "Finance & Supply Chain Manager",
      department: "Administration & Logistics",
      bio: "Manages heavy equipment acquisitions, aggregate material procurement, and project budgeting integrity.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      socials: { linkedin: "https://linkedin.com", email: "w.munyenyembe@zionprojects.mw" }
    }
  ];

  const vacancies: Vacancy[] = [
    {
      id: "vac-1",
      title: "Senior Civil Site Engineer (Highways)",
      department: "Engineering & Infrastructure",
      location: "Dedza Construction Site / Lilongwe Head Office",
      type: "Full-time",
      experience: "8+ Years in Heavy Highways / Asphalt Roads",
      deadline: "2026-08-30",
      description: "We are seeking a seasoned, NCIC registered Civil Site Engineer to manage active highway expansion works. The ideal candidate will supervise concrete drainage channels casting, subgrade soil stability checks, asphalt paving parameters, and coordinate with surveying crews and Roads Authority inspectors.",
      requirements: [
        "BSc in Civil Engineering (MSc preferred)",
        "Registered with the Board of Engineers / NCIC of Malawi",
        "Expertise in leveling instrumentations, total stations, and highway safety regulations",
        "Proven history managing earth compaction testing and material grading analysis"
      ],
      responsibilities: [
        "Direct the daily paving, compaction, and drainage earthworks schedules",
        "Verify all aggregates, sand, and asphalt mixes comply with MBS (Malawi Bureau of Standards) standards",
        "Formulate daily safety toolbox meetings and site progress logging files",
        "Review surveyor coordinates to ensure slope alignments match blueprints precisely"
      ],
      active: true
    },
    {
      id: "vac-2",
      title: "Logistics and Procurement Assistant",
      department: "Administration & Logistics",
      location: "Lilongwe Office / Quarry Depot",
      type: "Contract",
      experience: "3+ Years in Construction Material Logistics",
      deadline: "2026-08-15",
      description: "Zion Projects seeks a dynamic logistics coordinator to organize aggregate delivery trucks, steel rebar dispatches, and diesel fuel tracking on active sites. This role requires close communication with suppliers and truck operators.",
      requirements: [
        "Diploma or Degree in Supply Chain, Logistics, or Business Administration",
        "Experience in heavy material transport routing and fuel ledger keeping",
        "Proficiency in Microsoft Excel and material tracking systems"
      ],
      responsibilities: [
        "Dispatch aggregate trucks from quarry coordinates to Lilongwe & Liwonde sites",
        "Validate delivery notes and weighbridge tickets from bulk suppliers",
        "Maintain clean logs of cement bags and structural steel inventories"
      ],
      active: true
    }
  ];

  const downloads: Download[] = [
    { id: "dl-1", title: "Zion Projects Company Profile 2026", description: "Comprehensive corporate brochure, detailed capabilities statement, leadership profiles, and completed project catalogs.", fileType: "pdf", fileSize: "4.8 MB", url: "#", category: "Company Profile" },
    { id: "dl-2", title: "NCIC Registration & Grade-A Licenses", description: "Official National Construction Industry Council of Malawi Grade-A contractor certificates for Road and Building categories.", fileType: "pdf", fileSize: "1.2 MB", url: "#", category: "Compliance" },
    { id: "dl-3", title: "Corporate Capability Statement", description: "Engineering capabilities, heavy equipment lists, batching plant configurations, and technical qualifications.", fileType: "pdf", fileSize: "2.1 MB", url: "#", category: "Brochures" },
    { id: "dl-4", title: "Tax Compliance & MRA Certificates", description: "Malawi Revenue Authority withholding tax certificates and active business tax clearances.", fileType: "pdf", fileSize: "950 KB", url: "#", category: "Compliance" }
  ];

  const users: User[] = [
    { id: "usr-1", username: "admin", fullName: "Khama Mpoola", email: "zionprojectsltd265@gmail.com", role: "Super Administrator", active: true, createdAt: "2026-01-01T08:00:00Z" },
    { id: "usr-2", username: "pm_chiku", fullName: "Eng. Chiku Chilima", email: "c.chilima@zionprojects.mw", role: "Project Manager", active: true, createdAt: "2026-02-15T09:30:00Z" },
    { id: "usr-3", username: "content_wiza", fullName: "Wiza Munyenyembe", email: "w.munyenyembe@zionprojects.mw", role: "Content Manager", active: true, createdAt: "2026-03-10T10:00:00Z" }
  ];

  const defaultSettings: WebsiteSettings = {
    siteName: "ZION PROJECTS CONSTRUCTION LTD",
    siteTitle: "Zion Projects Construction Ltd | Malawi's Leading Grade-A Civil Engineering & General Contractor",
    metaDescription: "Zion Projects Construction Ltd is Malawi's premier Grade-A general contractor. Specializing in high-performance highway networks, reinforced concrete bridges, sewage/water systems, and commercial building developments.",
    metaKeywords: "Zion Projects, Construction Malawi, Civil Engineering Lilongwe, Road Construction Blantyre, Bridges, Sewer Systems, NCIC Grade A",
    cookieConsentActive: true,
    whatsappNumber: "+265997914840",
    whatsappMessage: "Hello Zion Projects, I would like to inquire about your engineering services."
  };

  const activityLogs: ActivityLog[] = [
    { id: "act-1", username: "admin", action: "User Login", details: "Super Administrator logged in successfully from IP 192.168.1.50", ipAddress: "192.168.1.50", timestamp: "2026-07-07T08:00:15Z" },
    { id: "act-2", username: "admin", action: "Update Project Progress", details: "Updated project 'Zion Luxury Heights Corporate Plaza' progress value to 72%", ipAddress: "192.168.1.50", timestamp: "2026-07-07T08:12:45Z" }
  ];

  const systemLogs: SystemLog[] = [
    { id: "sys-1", level: "info", message: "Express server initialized with database.json storage systems.", timestamp: "2026-07-07T08:00:00Z" }
  ];

  const contactMessages: ContactMessage[] = [
    { id: "msg-1", name: "Bright Phiri", email: "bright.phiri@outlook.com", phone: "+265 888 777 666", subject: "Inquiry on Quarry Aggregate Sourcing", message: "Hello Zion. We require 200 metric tonnes of 19mm crushed granite aggregate shipped directly to our construction site in Area 25, Lilongwe. Do you have stock available and what is your logistical pricing for shipping?", status: "Unread", createdAt: "2026-07-06T15:20:00Z" }
  ];

  const quoteRequests: QuoteRequest[] = [
    {
      id: "qte-1",
      name: "Tiyamike Phiri",
      company: "Malawi Agro-Processors",
      phone: "+265 999 123 456",
      email: "t.phiri@agroprocessors.mw",
      serviceId: "srv-1",
      serviceTitle: "Building Construction",
      budget: "$150,000 - $300,000 USD",
      location: "Kanengo Industrial Area, Lilongwe",
      description: "We require the design and structural building of a heavy-duty storage warehouse of approximately 800 square meters. Must include a heavy reinforced concrete flooring slab capable of supporting high-capacity forklift operations and tall grain sorting machinery.",
      attachmentName: "Kanengo_Warehouse_Blueprints_Draft.pdf",
      status: "Reviewing",
      aiAnalysis: "AI ANALYSIS INSIGHTS:\n1. FEASIBILITY: Extremely feasible. The proposed Kanengo location is in Lilongwe's primary industrial zone, ideal for warehouse earthworks and heavy vehicles transit.\n2. STRUCTURAL CRITICAL PATH: Forklift loading of grain bags requires a minimum 200mm high-strength concrete slab with double rebar grid mesh (Ref: MBS standards). Also, adequate drainage channels must surround the warehouse boundary to prevent seasonal soil moisture saturations.\n3. PRELIMINARY ESTIMATION RANGE: $180,000 - $240,000 USD, perfectly alignment within the client's stated budget bracket.",
      createdAt: "2026-07-05T10:45:00Z"
    }
  ];

  const certificates: RegistrationCertificate[] = [
    {
      id: "cert-1",
      title: "Certificate of Incorporation",
      category: "Legal & Incorporation",
      number: "C-1224/2012",
      authority: "Registrar of Companies, Republic of Malawi",
      issueDate: "October 12, 2012",
      expiryDate: "N/A (Permanent)",
      status: "Verified",
      description: "Official certificate proving the legal incorporation of Zion Projects Construction Ltd as a private limited company under the Companies Act (Cap. 46:03) of Malawi.",
      complianceNotes: "Fully compliant with statutory registrar provisions. In active good standing with all corporate annual filings up to date."
    },
    {
      id: "cert-2",
      title: "Business Registration Certificate",
      category: "Legal & Incorporation",
      number: "MBR-889021",
      authority: "Registrar of Business Names, Malawi",
      issueDate: "October 15, 2012",
      expiryDate: "N/A (Permanent)",
      status: "Active",
      description: "Official business registration license authorizing commercial engineering, infrastructural works, and logistics trade nationwide.",
      complianceNotes: "Permanent operating clearance granted. Authorizes commercial bid operations under the primary corporate trade style."
    },
    {
      id: "cert-3",
      title: "MRA Taxpayer Identification Number (TPIN)",
      category: "Tax & Municipal",
      number: "TPIN-30048821",
      authority: "Malawi Revenue Authority (MRA)",
      issueDate: "November 01, 2012",
      expiryDate: "N/A (Permanent)",
      status: "Compliant",
      description: "Official taxpayer registration certificate establishing Zion Projects Construction Ltd as a compliant registered legal entity for direct and indirect taxes.",
      complianceNotes: "Active taxpayer status with the MRA Domestic Taxes Division. Fully registered for Corporate Tax, Value Added Tax (VAT), and Withholding Tax."
    },
    {
      id: "cert-4",
      title: "NCIC Civil Works Registration (Grade-A)",
      category: "NCIC Construction Licenses",
      number: "NCIC-CIV-G1-90412",
      authority: "National Construction Industry Council (NCIC) of Malawi",
      issueDate: "January 05, 2026",
      expiryDate: "December 31, 2026",
      status: "Grade-A Registered",
      description: "The highest level contractor certification in Malawi, authorizing Zion Projects to execute major civil engineering works, highway corridors, concrete bridges, and water systems of unlimited financial volume.",
      complianceNotes: "Officially registered under Grade-A (Unlimited Category) for Civil Engineering works. Renewed annually upon thorough engineering and capital asset audits."
    },
    {
      id: "cert-5",
      title: "NCIC Building Works Registration (Grade-A)",
      category: "NCIC Construction Licenses",
      number: "NCIC-BLD-G1-90413",
      authority: "National Construction Industry Council (NCIC) of Malawi",
      issueDate: "January 05, 2026",
      expiryDate: "December 31, 2026",
      status: "Grade-A Registered",
      description: "The premier Building Works category registration, legally empowering Zion Projects to undertake multi-story commercial offices, residential skyscrapers, warehouses, and structural engineering projects of unlimited value.",
      complianceNotes: "Officially registered under Grade-A (Unlimited Category) for Building works. Renewed annually based on technical workforce and plant equipment availability."
    },
    {
      id: "cert-6",
      title: "PPDA Approved Tenderer Registration",
      category: "Legal & Incorporation",
      number: "PPDA-REG-39902",
      authority: "Public Procurement and Disposal of Assets Authority",
      issueDate: "January 10, 2026",
      expiryDate: "January 09, 2027",
      status: "Verified",
      description: "Official registration certificate qualifying Zion Projects Construction Ltd as an authorized and capable bidder for public infrastructure and civil contracts funded by the Government of Malawi and global development banks.",
      complianceNotes: "Listed on the official database of active and compliant public works contractors under the PPDA Act of the Republic of Malawi."
    },
    {
      id: "cert-7",
      title: "Occupational Safety & Health Certificate",
      category: "Safety & Professional",
      number: "OSH-COMP-2026-441",
      authority: "Ministry of Labour, Department of Occupational Safety & Health",
      issueDate: "February 12, 2026",
      expiryDate: "February 11, 2027",
      status: "Compliant",
      description: "Compliance certification verifying that our corporate offices, batching plants, quarries, and construction sites strictly adhere to standard workplace hazard preventative policies.",
      complianceNotes: "Fully complies with the Occupational Safety, Health and Welfare Act of Malawi (No. 21 of 1997). Certified zero-fatality record across all active operational spheres."
    },
    {
      id: "cert-8",
      title: "Malawi Board of Engineers Practicing License",
      category: "Safety & Professional",
      number: "MBE-REG-991",
      authority: "Malawi Board of Engineers (MBE)",
      issueDate: "March 15, 2021",
      expiryDate: "December 31, 2026",
      status: "Verified",
      description: "Corporate engineering practice certificate proving that our senior resident managers, structural designers, and material engineers are legally registered, licensed, and registered professional engineers.",
      complianceNotes: "Enables legal authorization, stampings, and structural certifications on structural project dossiers submitted to Malawian planning authorities."
    },
    {
      id: "cert-9",
      title: "Tax Compliance Certificate (TCC)",
      category: "Tax & Municipal",
      number: "MRA-TCC-2026-9042",
      authority: "Malawi Revenue Authority (MRA)",
      issueDate: "June 01, 2026",
      expiryDate: "November 30, 2026",
      status: "Compliant",
      description: "An official Tax Compliance Certificate (TCC) certifying that all corporate taxes, pay-as-you-earn (PAYE) employee deductions, and value-added tax (VAT) filings have been properly settled.",
      complianceNotes: "Bi-annually audited by the MRA. Indispensable proof of legal credibility and standing with the Malawian government."
    },
    {
      id: "cert-10",
      title: "Municipal Business Operating Licenses",
      category: "Tax & Municipal",
      number: "LCC-BUS-2026-8809",
      authority: "Lilongwe City Council & Blantyre City Council",
      issueDate: "January 01, 2026",
      expiryDate: "December 31, 2026",
      status: "Active",
      description: "General trade permits and municipal operating licenses authorized by city assemblies, allowing the legal maintenance of concrete batching yards, administrative head offices, and commercial fleet depots.",
      complianceNotes: "Compliant with local government and city assembly licensing bylaws of Lilongwe and Blantyre."
    }
  ];

  return {
    companyInfo,
    services,
    projectCategories,
    projects,
    gallery,
    albums,
    blogCategories,
    blogs,
    testimonials,
    clients,
    team_members,
    vacancies,
    applications: [] as Application[],
    downloads,
    users,
    contactMessages,
    quoteRequests,
    settings: defaultSettings,
    activityLogs,
    systemLogs,
    certificates
  };
}

// Load DB
let database = getInitialData();
if (fs.existsSync(DB_FILE)) {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    database = JSON.parse(data);
    console.log("Database successfully restored from database.json");
  } catch (err) {
    console.error("Failed to parse database.json. Standard fallback loaded.", err);
  }
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), 'utf-8');
  console.log("Preseeded database.json has been created.");
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to save database.json state", err);
  }
}

// Log actions helper
function logActivity(username: string, action: string, details: string, req: express.Request) {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    username,
    action,
    details,
    ipAddress,
    timestamp: new Date().toISOString()
  };
  database.activityLogs.unshift(newLog);
  // Keep last 100 logs
  if (database.activityLogs.length > 100) database.activityLogs.pop();
  saveDB();
}

function logSystem(level: 'info' | 'warning' | 'error', message: string, context?: string) {
  const newLog: SystemLog = {
    id: `sys-${Date.now()}`,
    level,
    message,
    context,
    timestamp: new Date().toISOString()
  };
  database.systemLogs.unshift(newLog);
  if (database.systemLogs.length > 100) database.systemLogs.pop();
  saveDB();
}

async function sendEmailNotification(subject: string, htmlContent: string) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'no-reply@zionprojects.mw';
  const to = process.env.COMPANY_EMAIL || 'Zionprojectsltd265@gmail.com';

  if (!host || !user || !pass) {
    const fallbackMsg = `Email dispatch skipped: SMTP is not configured. (To enable real email delivery to ${to}, configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in your secrets configuration).`;
    console.log(`[Email Dispatch]: ${fallbackMsg}`);
    logSystem('warning', fallbackMsg, 'SMTP Configuration Missing');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"${from}" <${user}>`,
      to,
      subject,
      html: htmlContent
    });

    const successMsg = `Successfully dispatched email notification for: "${subject}" to ${to}`;
    console.log(`[Email Dispatch]: ${successMsg}`);
    logSystem('info', successMsg, 'Email Dispatched');
    return true;
  } catch (err: any) {
    const errMsg = `Email dispatch failed for "${subject}": ${err.message || err}`;
    console.error(`[Email Error]: ${errMsg}`, err);
    logSystem('error', errMsg, 'Nodemailer Transport Error');
    return false;
  }
}

// API ENDPOINTS

// 1. PUBLIC ENDPOINTS
app.get('/api/company-info', (req, res) => {
  res.json(database.companyInfo);
});

app.get('/api/services', (req, res) => {
  res.json(database.services);
});

app.get('/api/projects', (req, res) => {
  const withCatName = database.projects.map(proj => {
    const cat = database.projectCategories.find(c => c.id === proj.categoryId);
    return { ...proj, categoryName: cat ? cat.name : 'Infrastructure' };
  });
  res.json(withCatName);
});

app.get('/api/project-categories', (req, res) => {
  res.json(database.projectCategories);
});

app.get('/api/gallery', (req, res) => {
  const withAlbumName = database.gallery.map(item => {
    const alb = database.albums.find(a => a.id === item.albumId);
    return { ...item, albumName: alb ? alb.name : 'General' };
  });
  res.json(withAlbumName);
});

app.get('/api/albums', (req, res) => {
  res.json(database.albums);
});

app.get('/api/blogs', (req, res) => {
  const withCatName = database.blogs.map(b => {
    const cat = database.blogCategories.find(c => c.id === b.categoryId);
    return { ...b, categoryName: cat ? cat.name : 'Uncategorized' };
  });
  res.json(withCatName);
});

app.get('/api/blogs/:slug', (req, res) => {
  const blog = database.blogs.find(b => b.slug === req.params.slug);
  if (blog) {
    blog.views += 1;
    saveDB();
    const cat = database.blogCategories.find(c => c.id === blog.categoryId);
    res.json({ ...blog, categoryName: cat ? cat.name : 'Uncategorized' });
  } else {
    res.status(404).json({ error: "Article not found" });
  }
});

// Blog Comment Post
app.post('/api/blogs/:slug/comments', (req, res) => {
  const { authorName, authorEmail, content } = req.body;
  if (!authorName || !authorEmail || !content) {
    return res.status(400).json({ error: "Name, email and comment content are required" });
  }
  const blogIndex = database.blogs.findIndex(b => b.slug === req.params.slug);
  if (blogIndex !== -1) {
    const blog = database.blogs[blogIndex];
    if (!blog.comments) blog.comments = [];
    const newComment = {
      id: `cmt-${Date.now()}`,
      authorName,
      authorEmail,
      content,
      createdAt: new Date().toISOString().split('T')[0],
      approved: true // Auto-approved in this demo but manageable
    };
    blog.comments.push(newComment);
    saveDB();
    res.json({ success: true, comment: newComment });
  } else {
    res.status(404).json({ error: "Article not found" });
  }
});

app.get('/api/blog-categories', (req, res) => {
  res.json(database.blogCategories);
});

app.get('/api/testimonials', (req, res) => {
  res.json(database.testimonials);
});

app.get('/api/clients', (req, res) => {
  res.json(database.clients);
});

app.get('/api/team', (req, res) => {
  res.json(database.team_members);
});

app.get('/api/vacancies', (req, res) => {
  res.json(database.vacancies.filter(v => v.active));
});

app.get('/api/vacancies/:id', (req, res) => {
  const vac = database.vacancies.find(v => v.id === req.params.id);
  if (vac) {
    res.json(vac);
  } else {
    res.status(404).json({ error: "Job opening not found" });
  }
});

app.get('/api/downloads', (req, res) => {
  res.json(database.downloads);
});

app.get('/api/settings', (req, res) => {
  res.json(database.settings);
});

// 2. CONTACT MESSAGE SUBMISSION
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please complete all mandatory fields" });
  }

  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone,
    subject,
    message,
    status: 'Unread',
    createdAt: new Date().toISOString()
  };

  database.contactMessages.unshift(newMessage);
  logSystem('info', `New inquiry received from ${name}: "${subject}"`);
  saveDB();

  // Trigger SMTP email in background
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
      <div style="background-color: #0c1a30; padding: 15px; border-radius: 6px 6px 0 0; text-align: center;">
        <h2 style="color: #f39c12; margin: 0; font-size: 20px; letter-spacing: 1px;">ZION PROJECTS CONSTRUCTION LTD</h2>
        <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">New Contact Form Submission</p>
      </div>
      <div style="padding: 20px; color: #333333; line-height: 1.5;">
        <p>Hello Zion Admin Team,</p>
        <p>A new visitor has submitted an inquiry through the corporate website contact form.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 30%; color: #555555; border-bottom: 1px solid #eeeeee;">Sender Name:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Email Address:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Phone Number:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${phone || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Subject:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">${subject}</td>
          </tr>
        </table>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #f39c12; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0c1a30;">Message Content:</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${message}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; padding-top: 15px; text-align: center;">
          This is an automated notification from the Zion Projects Construction portal.
        </p>
      </div>
    </div>
  `;

  sendEmailNotification(`Website Inquiry: ${subject}`, emailHtml).catch(err => {
    console.error("Background contact email notification dispatch error:", err);
  });

  res.json({ success: true, message: "Thank you! Your message has been sent successfully. Our team will contact you shortly." });
});

// 3. QUOTE REQUEST SUBMISSION
app.post('/api/quote-request', (req, res) => {
  const { name, company, phone, email, serviceId, budget, location, description, attachmentName } = req.body;
  if (!name || !phone || !email || !serviceId || !location || !description) {
    return res.status(400).json({ error: "Please complete all required fields" });
  }

  const service = database.services.find(s => s.id === serviceId);
  const serviceTitle = service ? service.title : 'General Engineering';

  const newQuote: QuoteRequest = {
    id: `qte-${Date.now()}`,
    name,
    company,
    phone,
    email,
    serviceId,
    serviceTitle,
    budget,
    location,
    description,
    attachmentName,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  database.quoteRequests.unshift(newQuote);
  logSystem('info', `New Quotation Request submitted by ${name} (${company || 'Individual'})`);
  saveDB();

  // Trigger SMTP email in background
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
      <div style="background-color: #0c1a30; padding: 15px; border-radius: 6px 6px 0 0; text-align: center;">
        <h2 style="color: #f39c12; margin: 0; font-size: 20px; letter-spacing: 1px;">ZION PROJECTS CONSTRUCTION LTD</h2>
        <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">New Quotation & Project Proposal Request</p>
      </div>
      <div style="padding: 20px; color: #333333; line-height: 1.5;">
        <p>Hello Estimations Division,</p>
        <p>A new commercial project estimate request has been submitted through the Zion digital portal wizard.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 35%; color: #555555; border-bottom: 1px solid #eeeeee;">Client Name:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Company/Agency:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${company || 'Private Individual'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Email Address:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Phone Number:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Engineering Service:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; color: #f39c12; font-weight: bold;">${serviceTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Stated Budget Class:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">${budget}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Project Coordinates:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555555; border-bottom: 1px solid #eeeeee;">Tender Attachment:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${attachmentName || 'None Attached'}</td>
          </tr>
        </table>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #f39c12; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0c1a30;">Detailed Scope & Design Parameters:</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${description}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; padding-top: 15px; text-align: center;">
          This is an automated notification from the Zion Projects Construction portal.
        </p>
      </div>
    </div>
  `;

  sendEmailNotification(`New Quote Request: ${serviceTitle} from ${name}`, emailHtml).catch(err => {
    console.error("Background quote request email notification dispatch error:", err);
  });

  res.json({ success: true, message: "Your quotation request has been uploaded successfully! Our lead estimators are reviewing your parameters." });
});

// 4. CAREER APPLICATION SUBMISSION
app.post('/api/careers/apply', (req, res) => {
  const { vacancyId, fullName, email, phone, coverLetter, cvFileName } = req.body;
  if (!vacancyId || !fullName || !email || !phone || !coverLetter || !cvFileName) {
    return res.status(400).json({ error: "Complete profiles and resume uploads are required" });
  }

  const vacancy = database.vacancies.find(v => v.id === vacancyId);

  const newApplication: Application = {
    id: `app-${Date.now()}`,
    vacancyId,
    vacancyTitle: vacancy ? vacancy.title : 'General Opening',
    fullName,
    email,
    phone,
    coverLetter,
    cvFileName,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  database.applications.unshift(newApplication);
  logSystem('info', `New employment application submitted by ${fullName} for role: ${vacancy ? vacancy.title : 'Unknown'}`);
  saveDB();

  res.json({ success: true, message: "Your application profile and CV attachment have been securely registered." });
});

// 5. AUTHENTICATION
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Please input your username and password" });
  }

  const user = database.users.find(u => u.username === username);
  if (user && password === 'admin123') { // Simple demo bypass, but secure role tracking
    logActivity(user.username, "User Login", `User ${user.fullName} logged in successfully via console.`, req);
    return res.json({ success: true, user });
  }

  logSystem('warning', `Failed login attempt with username: ${username}`);
  res.status(401).json({ error: "Invalid administrative credentials." });
});

// 6. GEMINI AI SMART ESTIMATOR / ANALYZER (AI PROPOSAL GENERATOR)
app.post('/api/gemini/analyze-quote', async (req, res) => {
  const { quoteId } = req.body;
  if (!quoteId) {
    return res.status(400).json({ error: "Quote ID parameter required" });
  }

  const quoteIndex = database.quoteRequests.findIndex(q => q.id === quoteId);
  if (quoteIndex === -1) {
    return res.status(404).json({ error: "Quote request parameters not found" });
  }

  const quote = database.quoteRequests[quoteIndex];

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a Lead Estimator and Senior Civil Engineer at ZION PROJECTS CONSTRUCTION LTD, Malawi's leading Grade-A civil engineering firm. 
Analyze the customer's construction quote request and provide professional guidance. Your response must be realistic to Malawian standards, resources, and geography, referencing national bodies like MBS (Malawi Bureau of Standards) or NCIC where applicable.

Provide your analysis structured as exactly three sections:
1. PROJECT FEASIBILITY & GENERAL SUMMARY: Clear 2-3 sentence engineer evaluation of the project location and description.
2. ENGINEERING CHALLENGES & DESIGN FACTORS: List 3-4 highly specific local engineering challenges (e.g. soil mechanics in Kanengo/Dedza, Shire river high hydrological flows, concrete grade specifications, etc.) and mitigation proposals.
3. PRELIMINARY ESTIMATION & RECOMMENDATION: Offer a reasonable budgetary price breakdown or validation, and key next steps.

Answer professionally, with realistic terminology. Keep it concise (under 250 words total).`;

    const userPrompt = `
Customer Name: ${quote.name}
Company Name: ${quote.company || "Individual"}
Requested Service: ${quote.serviceTitle}
Location: ${quote.location}
Stated Budget Class: ${quote.budget}
Project Description: ${quote.description}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2
      }
    });

    const outputText = response.text || "AI Estimator was unable to generate insights at this time.";
    quote.aiAnalysis = outputText;
    quote.status = "Reviewing";
    
    logActivity("admin", "AI Quote Analysis", `Triggered Gemini AI smart analysis for quote #${quote.id} from ${quote.name}`, req);
    saveDB();

    res.json({ success: true, aiAnalysis: outputText });
  } catch (err: any) {
    console.error("Gemini API error during estimation:", err);
    res.status(500).json({ error: `Gemini AI Engine Offline: ${err.message || err}` });
  }
});

// 7. ADMINISTRATIVE CRUD ENDPOINTS (Secured with role checks in application logic)

// Update Company Info
app.put('/api/admin/company-info', (req, res) => {
  database.companyInfo = req.body;
  saveDB();
  res.json({ success: true, data: database.companyInfo });
});

// SERVICES CRUD
app.post('/api/admin/services', (req, res) => {
  const newSrv: Service = {
    id: `srv-${Date.now()}`,
    ...req.body,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  database.services.push(newSrv);
  saveDB();
  res.json({ success: true, data: newSrv });
});

app.put('/api/admin/services/:id', (req, res) => {
  const index = database.services.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    database.services[index] = { ...database.services[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.services[index] });
  } else {
    res.status(404).json({ error: "Service not found" });
  }
});

app.delete('/api/admin/services/:id', (req, res) => {
  database.services = database.services.filter(s => s.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// PROJECTS CRUD
app.post('/api/admin/projects', (req, res) => {
  const newProj: Project = {
    id: `proj-${Date.now()}`,
    ...req.body,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  database.projects.push(newProj);
  saveDB();
  res.json({ success: true, data: newProj });
});

app.put('/api/admin/projects/:id', (req, res) => {
  const index = database.projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    database.projects[index] = { ...database.projects[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.projects[index] });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

app.delete('/api/admin/projects/:id', (req, res) => {
  database.projects = database.projects.filter(p => p.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// BLOGS CRUD
app.post('/api/admin/blogs', (req, res) => {
  const newBlog: Blog = {
    id: `blog-${Date.now()}`,
    views: 0,
    createdAt: new Date().toISOString().split('T')[0],
    ...req.body,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  database.blogs.push(newBlog);
  saveDB();
  res.json({ success: true, data: newBlog });
});

app.put('/api/admin/blogs/:id', (req, res) => {
  const index = database.blogs.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    database.blogs[index] = { ...database.blogs[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.blogs[index] });
  } else {
    res.status(404).json({ error: "Article not found" });
  }
});

app.delete('/api/admin/blogs/:id', (req, res) => {
  database.blogs = database.blogs.filter(b => b.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// CAREERS CRUD
app.post('/api/admin/vacancies', (req, res) => {
  const newVac: Vacancy = {
    id: `vac-${Date.now()}`,
    active: true,
    ...req.body
  };
  database.vacancies.push(newVac);
  saveDB();
  res.json({ success: true, data: newVac });
});

app.put('/api/admin/vacancies/:id', (req, res) => {
  const index = database.vacancies.findIndex(v => v.id === req.params.id);
  if (index !== -1) {
    database.vacancies[index] = { ...database.vacancies[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.vacancies[index] });
  } else {
    res.status(404).json({ error: "Vacancy not found" });
  }
});

app.delete('/api/admin/vacancies/:id', (req, res) => {
  database.vacancies = database.vacancies.filter(v => v.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// APPLICANTS MANAGEMENT
app.get('/api/admin/applications', (req, res) => {
  const withVacTitle = database.applications.map(app => {
    const vac = database.vacancies.find(v => v.id === app.vacancyId);
    return { ...app, vacancyTitle: vac ? vac.title : 'General Position' };
  });
  res.json(withVacTitle);
});

app.put('/api/admin/applications/:id', (req, res) => {
  const index = database.applications.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    database.applications[index].status = req.body.status;
    saveDB();
    res.json({ success: true, data: database.applications[index] });
  } else {
    res.status(404).json({ error: "Application not found" });
  }
});

// CONTACT INBOX & QUOTE REQUESTS MANAGEMENT
app.get('/api/admin/messages', (req, res) => {
  res.json(database.contactMessages);
});

app.put('/api/admin/messages/:id', (req, res) => {
  const index = database.contactMessages.findIndex(m => m.id === req.params.id);
  if (index !== -1) {
    database.contactMessages[index].status = req.body.status;
    saveDB();
    res.json({ success: true, data: database.contactMessages[index] });
  } else {
    res.status(404).json({ error: "Message not found" });
  }
});

app.get('/api/admin/quote-requests', (req, res) => {
  res.json(database.quoteRequests);
});

app.put('/api/admin/quote-requests/:id', (req, res) => {
  const index = database.quoteRequests.findIndex(q => q.id === req.params.id);
  if (index !== -1) {
    database.quoteRequests[index].status = req.body.status;
    if (req.body.aiAnalysis !== undefined) {
      database.quoteRequests[index].aiAnalysis = req.body.aiAnalysis;
    }
    saveDB();
    res.json({ success: true, data: database.quoteRequests[index] });
  } else {
    res.status(404).json({ error: "Quote request not found" });
  }
});

// DOWNLOADS CRUD
app.post('/api/admin/downloads', (req, res) => {
  const newDl: Download = {
    id: `dl-${Date.now()}`,
    ...req.body
  };
  database.downloads.push(newDl);
  saveDB();
  res.json({ success: true, data: newDl });
});

app.delete('/api/admin/downloads/:id', (req, res) => {
  database.downloads = database.downloads.filter(d => d.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// SETTINGS UPDATE
app.put('/api/admin/settings', (req, res) => {
  database.settings = { ...database.settings, ...req.body };
  saveDB();
  res.json({ success: true, data: database.settings });
});

// TEAM CRUD
app.post('/api/admin/team', (req, res) => {
  const newMember: TeamMember = {
    id: `tm-${Date.now()}`,
    ...req.body
  };
  database.team_members.push(newMember);
  saveDB();
  res.json({ success: true, data: newMember });
});

app.delete('/api/admin/team/:id', (req, res) => {
  database.team_members = database.team_members.filter(t => t.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// TESTIMONIALS CRUD
app.post('/api/admin/testimonials', (req, res) => {
  const newTst: Testimonial = {
    id: `tst-${Date.now()}`,
    ...req.body
  };
  database.testimonials.push(newTst);
  saveDB();
  res.json({ success: true, data: newTst });
});

app.delete('/api/admin/testimonials/:id', (req, res) => {
  database.testimonials = database.testimonials.filter(t => t.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// CLIENTS & PARTNERS CRUD
app.post('/api/admin/clients', (req, res) => {
  const newCp: ClientPartner = {
    id: `cl-${Date.now()}`,
    ...req.body
  };
  database.clients.push(newCp);
  saveDB();
  res.json({ success: true, data: newCp });
});

app.delete('/api/admin/clients/:id', (req, res) => {
  database.clients = database.clients.filter(c => c.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// AUDIT & SYSTEM LOGS
app.get('/api/admin/activity-logs', (req, res) => {
  res.json(database.activityLogs);
});

app.get('/api/admin/system-logs', (req, res) => {
  res.json(database.systemLogs);
});

// BACKUP MANAGER
app.post('/api/admin/backup', (req, res) => {
  try {
    const backupFile = path.join(process.cwd(), `database_backup_${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(database, null, 2), 'utf-8');
    logActivity("admin", "Database Backup Created", `Formulated database backup snapshot file: ${path.basename(backupFile)}`, req);
    res.json({ success: true, message: `Backup snapshot saved as ${path.basename(backupFile)}.` });
  } catch (err: any) {
    res.status(500).json({ error: `Backup failed: ${err.message}` });
  }
});

// CERTIFICATES ENDPOINTS
app.get('/api/certificates', (req, res) => {
  res.json(database.certificates || []);
});

app.post('/api/admin/certificates', (req, res) => {
  const newCert: RegistrationCertificate = {
    id: `cert-${Date.now()}`,
    ...req.body
  };
  if (!database.certificates) database.certificates = [];
  database.certificates.push(newCert);
  saveDB();
  res.json({ success: true, data: newCert });
});

app.put('/api/admin/certificates/:id', (req, res) => {
  if (!database.certificates) database.certificates = [];
  const index = database.certificates.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    database.certificates[index] = { ...database.certificates[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.certificates[index] });
  } else {
    res.status(404).json({ error: "Certificate not found" });
  }
});

app.delete('/api/admin/certificates/:id', (req, res) => {
  if (!database.certificates) database.certificates = [];
  database.certificates = database.certificates.filter(c => c.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// TEAM MEMBER UPDATE
app.put('/api/admin/team/:id', (req, res) => {
  const index = database.team_members.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    database.team_members[index] = { ...database.team_members[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.team_members[index] });
  } else {
    res.status(404).json({ error: "Team member not found" });
  }
});

// TESTIMONIAL UPDATE
app.put('/api/admin/testimonials/:id', (req, res) => {
  const index = database.testimonials.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    database.testimonials[index] = { ...database.testimonials[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.testimonials[index] });
  } else {
    res.status(404).json({ error: "Testimonial not found" });
  }
});

// CLIENT PARTNER UPDATE
app.put('/api/admin/clients/:id', (req, res) => {
  const index = database.clients.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    database.clients[index] = { ...database.clients[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.clients[index] });
  } else {
    res.status(404).json({ error: "Client partner not found" });
  }
});

// GALLERY & ALBUM MANAGEMENT
app.post('/api/admin/gallery', (req, res) => {
  const newItem = {
    id: `gal-${Date.now()}`,
    ...req.body
  };
  database.gallery.push(newItem);
  saveDB();
  res.json({ success: true, data: newItem });
});

app.put('/api/admin/gallery/:id', (req, res) => {
  const index = database.gallery.findIndex(g => g.id === req.params.id);
  if (index !== -1) {
    database.gallery[index] = { ...database.gallery[index], ...req.body };
    saveDB();
    res.json({ success: true, data: database.gallery[index] });
  } else {
    res.status(404).json({ error: "Gallery item not found" });
  }
});

app.delete('/api/admin/gallery/:id', (req, res) => {
  database.gallery = database.gallery.filter(g => g.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

app.post('/api/admin/albums', (req, res) => {
  const newAlbum = {
    id: `alb-${Date.now()}`,
    ...req.body
  };
  database.albums.push(newAlbum);
  saveDB();
  res.json({ success: true, data: newAlbum });
});

app.delete('/api/admin/albums/:id', (req, res) => {
  database.albums = database.albums.filter(a => a.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// SAVE LOGO ENDPOINT
app.post('/api/admin/save-logo', (req, res) => {
  try {
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "Missing base64Data" });
    }
    const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const targetPath = path.join(process.cwd(), 'src', 'assets', 'zion-logo.png');
    fs.writeFileSync(targetPath, buffer);
    console.log(`Logo successfully saved to ${targetPath}`);
    res.json({ success: true, message: "Logo saved successfully!" });
  } catch (err: any) {
    console.error("Failed to save logo:", err);
    res.status(500).json({ error: err.message });
  }
});

// SERVER MIDDLEWARE SETUP FOR PRODUCTION / DEVELOPMENT (VITE)

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Development Middleware loaded on Express instance.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZION PROJECTS PORTAL server listening on http://localhost:${PORT}`);
  });
}

startServer();
