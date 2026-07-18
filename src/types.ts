export type UserRole = 'Super Administrator' | 'Administrator' | 'Editor' | 'HR Manager' | 'Project Manager' | 'Content Manager';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

export interface CompanyInfo {
  name: string;
  slogan: string;
  ceoName: string;
  ceoMessage: string;
  ceoImage: string;
  mission: string;
  vision: string;
  history: string;
  coreValues: { title: string; description: string }[];
  phone: string;
  phoneAlternative?: string;
  email: string;
  emailInquiries?: string;
  address: string;
  workingHours: string;
  workingHoursSat?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    currency: string;
    branch: string;
  };
  ourPromise?: string;
  logoBase64?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string; // Lucide icon name
  shortDescription: string;
  description: string;
  featured: boolean;
  image: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  location: string;
  region?: 'Northern Malawi' | 'Central Malawi' | 'Southern Malawi';
  district?: string;
  completionDate: string;
  client: string;
  budget: string;
  description: string;
  featured: boolean;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  progress: number; // 0 to 100
  images: ProjectImage[];
  documents?: { name: string; size: string; url: string }[];
  videoUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  albumId?: string;
  albumName?: string;
  projectId?: string;
}

export interface Album {
  id: string;
  name: string;
  description: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  tags: string[];
  featuredImage: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  views: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  comments?: {
    id: string;
    authorName: string;
    authorEmail: string;
    content: string;
    createdAt: string;
    approved: boolean;
  }[];
}

export interface Testimonial {
  id: string;
  authorName: string;
  position: string;
  company: string;
  rating: number;
  comment: string;
  authorImage?: string;
}

export interface ClientPartner {
  id: string;
  name: string;
  logo: string;
  type: 'client' | 'partner';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio?: string;
  image: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
  experience: string;
  deadline: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  active: boolean;
}

export interface Application {
  id: string;
  vacancyId: string;
  vacancyTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvFileName: string;
  cvUrl?: string;
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected';
  createdAt: string;
}

export interface Download {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'doc' | 'zip';
  fileSize: string;
  url: string;
  category: 'Company Profile' | 'Compliance' | 'Brochures' | 'Financial';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceTitle?: string;
  budget: string;
  location: string;
  description: string;
  attachmentName?: string;
  status: 'Pending' | 'Reviewing' | 'Estimated' | 'Contacted' | 'Declined';
  aiAnalysis?: string; // AI generated smart insights or cost breakdown
  createdAt: string;
}

export interface WebsiteSettings {
  siteName: string;
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  cookieConsentActive: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  newsletterEmail?: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  username?: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  context?: string;
  timestamp: string;
}

export interface RegistrationCertificate {
  id: string;
  title: string;
  category: string;
  number: string;
  authority: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Verified' | 'Compliant' | 'Grade-A Registered';
  description: string;
  complianceNotes: string;
}

