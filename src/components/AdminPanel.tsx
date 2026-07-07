import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Building2, HardHat, FileText, Briefcase, 
  Download, MessageSquare, ShieldAlert, Settings, Activity, 
  Trash2, Edit, Plus, Save, CheckCircle2, RefreshCw, X, Loader2,
  Sparkles, Globe, UserCheck, ShieldCheck, Database, FileSpreadsheet, Lock
} from 'lucide-react';
import { 
  User, Service, Project, ProjectCategory, Blog, Testimonial, 
  ClientPartner, TeamMember, Vacancy, Application, Download as DownloadType,
  ContactMessage, QuoteRequest, WebsiteSettings, ActivityLog, SystemLog, CompanyInfo, UserRole,
  RegistrationCertificate, GalleryItem, Album
} from '../types';

interface AdminPanelProps {
  adminUser: User;
  onLogout: () => void;
}

export default function AdminPanel({ adminUser, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'projects' | 'careers' | 'quotes' | 'messages' | 'logs' | 'settings' | 'content'>('dashboard');
  
  // Database States
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  // Content Manager States
  const [certificates, setCertificates] = useState<RegistrationCertificate[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<ClientPartner[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [contentSubTab, setContentSubTab] = useState<'certificates' | 'blogs' | 'testimonials' | 'team' | 'clients' | 'gallery'>('certificates');

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Edit Modals
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'service' | 'project' | 'vacancy' | 'company' | 'settings' | 'certificate' | 'blog' | 'testimonial' | 'team' | 'client' | 'gallery' | 'album' | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        resSrv, resProj, resCats, resVac, resApps, resQts, 
        resMsgs, resAct, resSys, resComp, resSet,
        resCerts, resBlogs, resTst, resTeam, resClients, resGal, resAlb
      ] = await Promise.all([
        fetch('/api/services').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/project-categories').then(r => r.json()),
        fetch('/api/vacancies').then(r => r.json()),
        fetch('/api/admin/applications').then(r => r.json()),
        fetch('/api/admin/quote-requests').then(r => r.json()),
        fetch('/api/admin/messages').then(r => r.json()),
        fetch('/api/admin/activity-logs').then(r => r.json()),
        fetch('/api/admin/system-logs').then(r => r.json()),
        fetch('/api/company-info').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/certificates').then(r => r.json()),
        fetch('/api/blogs').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/team').then(r => r.json()),
        fetch('/api/clients').then(r => r.json()),
        fetch('/api/gallery').then(r => r.json()),
        fetch('/api/albums').then(r => r.json())
      ]);

      setServices(resSrv);
      setProjects(resProj);
      setCategories(resCats);
      setVacancies(resVac);
      setApplications(resApps);
      setQuotes(resQts);
      setMessages(resMsgs);
      setActivityLogs(resAct);
      setSystemLogs(resSys);
      setCompanyInfo(resComp);
      setSettings(resSet);
      setCertificates(resCerts);
      setBlogs(resBlogs);
      setTestimonials(resTst);
      setTeamMembers(resTeam);
      setClients(resClients);
      setGalleryItems(resGal);
      setAlbums(resAlb);
    } catch (err) {
      showFeedback("Failed to sync database coordinates. Ensure Express server is live.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Gemini Estimator Analysis on server
  const runAiAnalysis = async (quoteId: string) => {
    setActionLoading(`ai-${quoteId}`);
    try {
      const res = await fetch('/api/gemini/analyze-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("Gemini AI successfully completed estimating parameter checks!");
        fetchData(); // Refresh list to get analysis and updated status
      } else {
        showFeedback(data.error || "Gemini analysis error.", "error");
      }
    } catch (err) {
      showFeedback("Unable to establish tunnel connection to Google GenAI server.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Applications status update
  const updateApplicationStatus = async (appId: string, status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected') => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showFeedback(`Applicant profile updated to status: ${status}`);
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to update applicant state.", "error");
    }
  };

  // Quotes status update
  const updateQuoteStatus = async (quoteId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/quote-requests/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showFeedback(`Quote request updated to status: ${status}`);
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to update quote status.", "error");
    }
  };

  // Messages status update
  const updateMessageStatus = async (msgId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${msgId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showFeedback(`Inquiry set to: ${status}`);
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to update inquiry state.", "error");
    }
  };

  // Trigger Database Backup File
  const triggerDatabaseBackup = async () => {
    setActionLoading('backup');
    try {
      const res = await fetch('/api/admin/backup', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showFeedback(data.message || "Database snapshot created successfully!");
        fetchData();
      } else {
        showFeedback("Failed to execute database backup operations.", "error");
      }
    } catch (err) {
      showFeedback("Backup server currently unavailable.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Project Crud helper
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-project');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingItem,
          images: editingItem.images || [{ id: `img-${Date.now()}`, url: editingItem.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800' }]
        })
      });
      if (res.ok) {
        showFeedback(`Project successfully ${isNew ? 'registered' : 'modified'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save project specs.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving project details.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Confirm deletion of this project record from Zion database?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Project record permanently purged.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete project.", "error");
    }
  };

  // Save certificate
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-certificate');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/certificates' : `/api/admin/certificates/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        showFeedback(`Certificate successfully ${isNew ? 'registered' : 'modified'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save certificate.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving certificate.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm("Confirm deletion of this certificate?")) return;
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Certificate permanently deleted.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete certificate.", "error");
    }
  };

  // Save Blog
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-blog');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/blogs' : `/api/admin/blogs/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        showFeedback(`Blog successfully ${isNew ? 'published' : 'updated'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save blog post.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving blog post.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm("Confirm deletion of this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Blog post deleted.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete blog post.", "error");
    }
  };

  // Save Testimonial
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-testimonial');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        showFeedback(`Testimonial successfully ${isNew ? 'registered' : 'updated'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save testimonial.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving testimonial.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm("Confirm deletion of this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Testimonial deleted.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete testimonial.", "error");
    }
  };

  // Save Team Member
  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-team');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/team' : `/api/admin/team/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        showFeedback(`Team member successfully ${isNew ? 'registered' : 'updated'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save team member.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving team member.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!window.confirm("Confirm deletion of this team member?")) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Team member deleted.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete team member.", "error");
    }
  };

  // Save Client Partner
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-client');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/clients' : `/api/admin/clients/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        showFeedback(`Client/Partner successfully ${isNew ? 'registered' : 'updated'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save client/partner.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving client/partner.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm("Confirm deletion of this client/partner record?")) return;
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Client/partner record deleted.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete client/partner record.", "error");
    }
  };

  // Save Gallery Item
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-gallery');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/gallery' : `/api/admin/gallery/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        showFeedback(`Gallery item successfully ${isNew ? 'registered' : 'updated'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save gallery item.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving gallery item.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm("Confirm deletion of this gallery item?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Gallery item permanently deleted.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete gallery item.", "error");
    }
  };

  // Save Album
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-album');
    const isNew = !editingItem.id;
    const url = isNew ? '/api/admin/albums' : `/api/admin/albums/${editingItem.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        showFeedback(`Album successfully ${isNew ? 'registered' : 'updated'}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showFeedback("Failed to save album.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving album.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm("Confirm deletion of this album? All gallery items in this album will remain without an album.")) return;
    try {
      const res = await fetch(`/api/admin/albums/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback("Album record permanently deleted.");
        fetchData();
      }
    } catch (err) {
      showFeedback("Failed to delete album.", "error");
    }
  };

  // Save Company Information (About us, Mission, Vision, Promise, Bank details)
  const handleSaveCompanyInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyInfo) return;
    setActionLoading('save-company');
    try {
      const res = await fetch('/api/admin/company-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyInfo)
      });
      if (res.ok) {
        showFeedback("Company Information, Bank details & Promise updated successfully!");
        fetchData();
      } else {
        showFeedback("Failed to save updated company details on server.", "error");
      }
    } catch (err) {
      showFeedback("Network error saving company information.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Open Add/Edit project modal
  const openProjectModal = (proj: Project | null) => {
    setEditingItem(proj || {
      title: '',
      categoryId: categories[0]?.id || 'cat-1',
      location: '',
      completionDate: new Date().toISOString().split('T')[0],
      client: '',
      budget: '$50,000 USD',
      description: '',
      featured: false,
      status: 'Planning',
      progress: 0,
      imageUrl: ''
    });
    setModalType('project');
    setIsModalOpen(true);
  };

  const openCertificateModal = (cert: any | null) => {
    setEditingItem(cert || {
      title: '',
      category: 'Legal & Incorporation',
      number: '',
      authority: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
      description: '',
      complianceNotes: ''
    });
    setModalType('certificate');
    setIsModalOpen(true);
  };

  const openBlogModal = (blog: any | null) => {
    setEditingItem(blog || {
      title: '',
      slug: '',
      categoryId: categories[0]?.id || 'cat-1',
      featuredImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
      excerpt: '',
      content: '',
      author: adminUser?.fullName || 'Managing Director',
      createdAt: new Date().toISOString().split('T')[0],
      featured: false,
      comments: []
    });
    setModalType('blog');
    setIsModalOpen(true);
  };

  const openTestimonialModal = (tst: any | null) => {
    setEditingItem(tst || {
      authorName: '',
      position: '',
      company: '',
      rating: 5,
      comment: '',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    });
    setModalType('testimonial');
    setIsModalOpen(true);
  };

  const openTeamModal = (tm: any | null) => {
    setEditingItem(tm || {
      name: '',
      role: '',
      department: 'Engineering',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      bio: '',
      socials: { linkedin: '', twitter: '', email: '' }
    });
    setModalType('team');
    setIsModalOpen(true);
  };

  const openClientModal = (cl: any | null) => {
    setEditingItem(cl || {
      name: '',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      type: 'client'
    });
    setModalType('client');
    setIsModalOpen(true);
  };

  const openGalleryModal = (item: any | null) => {
    setEditingItem(item || {
      title: '',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
      albumId: albums[0]?.id || ''
    });
    setModalType('gallery');
    setIsModalOpen(true);
  };

  const openAlbumModal = () => {
    setEditingItem({
      name: '',
      description: ''
    });
    setModalType('album');
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Controls Panel */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-5 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Logo Heading */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary text-primary rounded-lg font-bold flex items-center justify-center">
              <HardHat size={18} />
            </div>
            <div>
              <span className="block text-sm font-extrabold text-white uppercase tracking-wider">Zion Admin</span>
              <span className="block text-[10px] text-gray-500 font-medium">Enterprise Control Hub</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2 mb-2">Staff Identity</p>
            <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/80">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-secondary border border-secondary/30">
                MD
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">{adminUser.fullName}</p>
                <p className="text-[9px] text-secondary font-semibold">{adminUser.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links Group */}
          <nav className="space-y-1.5 pt-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2 mb-2">Management</p>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
              { id: 'services', label: 'Services Manager', icon: <Building2 size={14} /> },
              { id: 'projects', label: 'Projects Registry', icon: <FileSpreadsheet size={14} /> },
              { id: 'content', label: 'Web Content Manager', icon: <Globe size={14} /> },
              { id: 'careers', label: 'HR & Applicants', icon: <Briefcase size={14} /> },
              { id: 'quotes', label: 'Quote Requests', icon: <Sparkles size={14} /> },
              { id: 'messages', label: 'Contact Messages', icon: <MessageSquare size={14} /> },
              { id: 'logs', label: 'System Audit Logs', icon: <Activity size={14} /> },
              { id: 'settings', label: 'Company Settings', icon: <Settings size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                  activeTab === tab.id 
                    ? 'bg-secondary text-primary font-black shadow-md' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'quotes' && quotes.filter(q => q.status === 'Pending').length > 0 && (
                  <span className="ml-auto w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {quotes.filter(q => q.status === 'Pending').length}
                  </span>
                )}
                {tab.id === 'messages' && messages.filter(m => m.status === 'Unread').length > 0 && (
                  <span className="ml-auto w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {messages.filter(m => m.status === 'Unread').length}
                  </span>
                )}
              </button>
            ))}
          </nav>

        </div>

        {/* Bottom controls */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <button
            onClick={triggerDatabaseBackup}
            disabled={actionLoading === 'backup'}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 py-2 px-3 rounded text-xs font-bold border border-slate-800 cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'backup' ? (
              <Loader2 size={13} className="animate-spin text-secondary" />
            ) : (
              <Database size={13} className="text-secondary" />
            )}
            <span>Backup Snapshot</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 py-2 px-3 rounded text-xs font-bold border border-red-900/30 cursor-pointer"
          >
            <span>Exit Admin Panel</span>
          </button>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 bg-slate-900 p-6 md:p-8 overflow-y-auto">
        
        {/* Banner Feedback */}
        {feedback && (
          <div className={`p-4 rounded mb-6 text-xs font-bold flex items-center gap-2 border ${
            feedback.type === 'success' 
              ? 'bg-green-950/80 border-green-800 text-green-200' 
              : 'bg-red-950/80 border-red-800 text-red-200'
          }`}>
            <CheckCircle2 size={14} />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 1. DASHBOARD OVERVIEW PANEL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <LayoutDashboard className="text-secondary" />
                  Zion Enterprise Metrics
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Comprehensive performance dashboard mapping lead quotes, site vacancies, and system audit trails.
                </p>
              </div>
              <button 
                onClick={fetchData} 
                className="flex items-center gap-1.5 self-start bg-slate-800 hover:bg-slate-700 py-2 px-4 rounded text-xs font-bold border border-slate-700 cursor-pointer text-slate-300"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>Synchronize Data</span>
              </button>
            </div>

            {/* Top Cards Metric Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Quotations', val: quotes.length, desc: 'Logged parameters', color: 'border-amber-500/30' },
                { label: 'Total Inquiries', val: messages.length, desc: 'Contact mail inbox', color: 'border-blue-500/30' },
                { label: 'Registered Projects', val: projects.length, desc: 'On and offline status', color: 'border-green-500/30' },
                { label: 'Active Jobs', val: vacancies.length, desc: 'HR listings', color: 'border-purple-500/30' }
              ].map((c, i) => (
                <div key={i} className={`bg-slate-950 p-5 rounded-xl border ${c.color} shadow-lg flex flex-col`}>
                  <span className="text-slate-400 text-xs font-bold tracking-wider">{c.label}</span>
                  <span className="text-3xl font-black text-white mt-1">{c.val}</span>
                  <span className="text-[10px] text-slate-500 mt-1 font-semibold uppercase">{c.desc}</span>
                </div>
              ))}
            </div>

            {/* Custom SVG Graphical Chart and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Graphical Statistics Box */}
              <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col">
                <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Database size={13} className="text-secondary" />
                  Monthly Operations Metrics (2026)
                </span>

                {/* SVG Chart */}
                <div className="w-full h-48 bg-slate-900/60 rounded border border-slate-800 p-2 flex items-end justify-between gap-1 relative overflow-hidden">
                  <div className="absolute top-2 left-2 text-[10px] text-slate-500 font-bold">Inquiries & Quotes Volume</div>
                  
                  {/* Mock Chart bars */}
                  {[
                    { m: 'Jan', val: 30, q: 10 },
                    { m: 'Feb', val: 45, q: 22 },
                    { m: 'Mar', val: 65, q: 35 },
                    { m: 'Apr', val: 50, q: 28 },
                    { m: 'May', val: 80, q: 45 },
                    { m: 'Jun', val: 95, q: 58 },
                    { m: 'Jul', val: 120, q: 72 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                      {/* Tooltip */}
                      <span className="absolute -top-6 bg-secondary text-primary font-black text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {bar.val} Inquiries | {bar.q} Quotes
                      </span>
                      
                      {/* Combined Double Bar stack */}
                      <div className="w-4 bg-slate-800 rounded-t flex flex-col justify-end h-[80%]">
                        <div className="w-full bg-secondary rounded-t" style={{ height: `${bar.q}%` }} />
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${bar.val - bar.q}%` }} />
                      </div>
                      
                      <span className="text-[10px] text-slate-500 font-bold mt-1.5">{bar.m}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-3 text-[10px] font-bold text-slate-400">
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full" /> General Inquiries</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-secondary rounded-full" /> Cost Estimates</div>
                </div>
              </div>

              {/* Quick Security Status Box */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col gap-4">
                <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-green-400" />
                  Security Audit Status
                </span>

                <ul className="space-y-3 text-xs">
                  <li className="flex justify-between items-center bg-slate-900 p-2 rounded">
                    <span className="text-slate-400">PDO Prepared Statements:</span>
                    <span className="bg-green-950/60 border border-green-800 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">Enabled</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-900 p-2 rounded">
                    <span className="text-slate-400">XSS Protection Filter:</span>
                    <span className="bg-green-950/60 border border-green-800 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">Enabled</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-900 p-2 rounded">
                    <span className="text-slate-400">Role Permissions:</span>
                    <span className="text-secondary font-bold">Super Admin</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-900 p-2 rounded">
                    <span className="text-slate-400">IP Filtering Matrix:</span>
                    <span className="text-slate-300">192.168.1.*</span>
                  </li>
                </ul>

                <div className="mt-2 bg-slate-900 p-3 rounded border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <strong>Access Log Info:</strong> Multi-role security parameters are synchronized with local storage logs. Any unauthorized deletion attempts are immediately logged in system files.
                </div>
              </div>

            </div>

            {/* Recent Quotes and Inquiries Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Quotes */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest">Recent Quotes Queue</span>
                  <button onClick={() => setActiveTab('quotes')} className="text-[10px] text-secondary hover:underline font-bold">View All</button>
                </div>
                <div className="space-y-3">
                  {quotes.slice(0, 3).map(q => (
                    <div key={q.id} className="bg-slate-900 p-3 rounded border border-slate-800/80 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-white">{q.name}</p>
                        <p className="text-[10px] text-slate-400">{q.serviceTitle} • {q.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        q.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-green-500/20 text-green-300'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest">Recent Messages</span>
                  <button onClick={() => setActiveTab('messages')} className="text-[10px] text-secondary hover:underline font-bold">View All</button>
                </div>
                <div className="space-y-3">
                  {messages.slice(0, 3).map(m => (
                    <div key={m.id} className="bg-slate-900 p-3 rounded border border-slate-800/80 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-white">{m.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{m.subject}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        m.status === 'Unread' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. SERVICES CRUD TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-white">Services Specifications</h1>
                <p className="text-xs text-slate-400 mt-1">Manage corporate capability offerings displayed on public pages.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(srv => (
                <div key={srv.id} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between p-5">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                        {srv.icon}
                      </span>
                      {srv.featured && (
                        <span className="text-[9px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30 font-bold">FEATURED</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{srv.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{srv.shortDescription}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end gap-2 text-xs">
                    <span className="text-slate-500 mr-auto text-[10px] font-semibold self-center">ID: {srv.id}</span>
                    <button className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 px-2.5 rounded border border-slate-800 cursor-not-allowed" disabled>
                      <Edit size={12} />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center gap-1 bg-red-950/30 border border-red-900/30 text-red-300 hover:bg-red-900/40 py-1.5 px-2.5 rounded cursor-not-allowed" disabled>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PROJECTS REGISTRY CRUD TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-white">Project Portfolio Registry</h1>
                <p className="text-xs text-slate-400 mt-1">Add, update, or remove construction project sheets.</p>
              </div>
              <button
                onClick={() => openProjectModal(null)}
                className="flex items-center gap-1.5 bg-secondary text-primary font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded shadow hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Table layout for projects */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 uppercase font-extrabold tracking-wider border-b border-slate-800">
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {projects.map(proj => (
                    <tr key={proj.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{proj.title}</p>
                        <p className="text-[10px] text-slate-500">Client: {proj.client}</p>
                      </td>
                      <td className="p-4">{proj.location}</td>
                      <td className="p-4 text-secondary font-bold">{proj.budget}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-bold">{proj.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          proj.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                          proj.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button 
                          onClick={() => openProjectModal(proj)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 cursor-pointer"
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/30 rounded text-red-300 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. CAREERS AND HR MANAGER */}
        {activeTab === 'careers' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-white">HR Recruitment and Applicants</h1>
              <p className="text-xs text-slate-400 mt-1">Review vacancies and retrieve submitted applicant credentials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Applications List */}
              <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-6">
                <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest mb-4 block">Applications Inbox</span>
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">No job application profiles submitted yet.</p>
                  ) : (
                    applications.map(app => (
                      <div key={app.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-white">{app.fullName}</h4>
                            <p className="text-[11px] text-secondary font-semibold mt-0.5">Role: {app.vacancyTitle}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Email: {app.email} | Phone: {app.phone}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            app.status === 'Pending' ? 'bg-amber-500/25 text-amber-300' :
                            app.status === 'Shortlisted' ? 'bg-green-500/25 text-green-300' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        
                        <div className="bg-slate-950 p-3 rounded text-[11px] text-slate-400 italic">
                          "{app.coverLetter}"
                        </div>

                        <div className="flex justify-between items-center pt-2 text-xs border-t border-slate-950">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                            <Download size={12} className="text-secondary" />
                            <span>Attached CV: {app.cvFileName}</span>
                          </div>
                          
                          <div className="space-x-1.5">
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                              className="bg-green-950/60 hover:bg-green-900/60 text-green-300 px-2 py-1 rounded text-[10px] font-bold border border-green-900/30 cursor-pointer"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                              className="bg-red-950/60 hover:bg-red-900/60 text-red-300 px-2 py-1 rounded text-[10px] font-bold border border-red-900/30 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Vacancies Summary */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest mb-4 block">Active Openings</span>
                  <div className="space-y-3">
                    {vacancies.map(v => (
                      <div key={v.id} className="bg-slate-900 p-3 rounded border border-slate-800/80">
                        <p className="text-xs font-bold text-white">{v.title}</p>
                        <p className="text-[10px] text-slate-400">{v.department} • {v.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-900 mt-6 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">Vacancies and details are controlled dynamically from local HR files.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. QUOTE REQUESTS MODULE (GEMINI ENGINE CONTROLLERS) */}
        {activeTab === 'quotes' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-white">Dynamic Quotation Estimates Portal</h1>
              <p className="text-xs text-slate-400 mt-1">
                Evaluate prospective projects and launch **Server-Side Gemini AI** models to estimate costs and challenges.
              </p>
            </div>

            <div className="space-y-6">
              {quotes.length === 0 ? (
                <div className="bg-slate-950 text-slate-400 rounded-xl border border-slate-800 p-12 text-center text-xs font-semibold">
                  No quotation requests logged on server yet.
                </div>
              ) : (
                quotes.map(q => (
                  <div key={q.id} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                    
                    {/* Header bar of quote box */}
                    <div className="bg-slate-900/80 p-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] font-black text-slate-500">REQUEST ID: {q.id}</span>
                        <h3 className="text-sm font-black text-white mt-0.5">{q.name} ({q.company || 'Private Client'})</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-green-500/20 text-green-300'
                        }`}>
                          {q.status}
                        </span>
                        
                        <select
                          value={q.status}
                          onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-300 rounded text-[10px] p-1 focus:outline-none"
                        >
                          <option value="Pending">Set Pending</option>
                          <option value="Reviewing">Set Reviewing</option>
                          <option value="Estimated">Set Estimated</option>
                          <option value="Contacted">Set Contacted</option>
                        </select>
                      </div>
                    </div>

                    {/* Content split columns */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      
                      {/* Left: Client params */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800/85">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Service</span>
                            <span className="font-bold text-slate-200">{q.serviceTitle}</span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800/85">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Coordinates</span>
                            <span className="font-bold text-slate-200">{q.location}</span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800/85">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Budget Class</span>
                            <span className="font-bold text-slate-200">{q.budget}</span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800/85">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Logged Date</span>
                            <span className="font-bold text-slate-200">{q.createdAt.split('T')[0]}</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Description</span>
                          <p className="text-slate-300 leading-relaxed">{q.description}</p>
                        </div>

                        {q.attachmentName && (
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold bg-slate-900/40 p-2 rounded">
                            <Download size={13} className="text-secondary" />
                            <span>Tender Spec File: {q.attachmentName}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Server-Side Gemini Smart Output */}
                      <div className="bg-slate-900/60 rounded-lg p-5 border border-secondary/20 relative flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[9px] uppercase font-black tracking-widest text-secondary bg-secondary/15 px-2 py-0.5 rounded border border-secondary/20 flex items-center gap-1">
                              <Sparkles size={9} />
                              Gemini Estimator
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">Real-time model: gemini-3.5-flash</span>
                          </div>

                          {q.aiAnalysis ? (
                            <div className="text-slate-300 font-medium space-y-2 leading-relaxed whitespace-pre-line text-[11px]">
                              {q.aiAnalysis}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center py-6">
                              <p className="text-slate-500 text-[11px] max-w-xs leading-relaxed mb-4">
                                No Smart Analysis formulated yet. Launch Google Gemini to draft preliminary engineering challenges and cost checklists for this site.
                              </p>
                              
                              <button
                                onClick={() => runAiAnalysis(q.id)}
                                disabled={actionLoading === `ai-${q.id}`}
                                className="flex items-center gap-1.5 bg-secondary text-primary font-black py-2.5 px-4 rounded text-[10px] uppercase tracking-widest shadow cursor-pointer hover:bg-secondary/90 disabled:opacity-50"
                              >
                                {actionLoading === `ai-${q.id}` ? (
                                  <>
                                    <Loader2 size={12} className="animate-spin text-primary" />
                                    <span>Engineering GenAI...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={12} className="text-primary" />
                                    <span>Trigger Gemini Analysis</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {q.aiAnalysis && (
                          <div className="pt-3 border-t border-slate-800 mt-3 text-right">
                            <button
                              onClick={() => runAiAnalysis(q.id)}
                              disabled={actionLoading === `ai-${q.id}`}
                              className="text-[10px] text-secondary font-bold hover:underline cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <RefreshCw size={10} className={actionLoading === `ai-${q.id}` ? 'animate-spin' : ''} />
                              <span>Re-run AI analysis</span>
                            </button>
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 6. CONTACT MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-white">General Inquiries Inbox</h1>
              <p className="text-xs text-slate-400 mt-1">Review inquiries received from public Contact portals.</p>
            </div>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="bg-slate-950 text-slate-400 rounded-xl border border-slate-800 p-12 text-center text-xs font-semibold">
                  No contact messages received.
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-3">
                    <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                      <div>
                        <h3 className="text-sm font-bold text-white">{m.name}</h3>
                        <p className="text-slate-400 mt-0.5">Email: {m.email} | Phone: {m.phone || 'N/A'}</p>
                        <p className="text-secondary font-semibold mt-1">Subject: {m.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'Unread' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {m.status}
                        </span>
                        
                        <select
                          value={m.status}
                          onChange={(e) => updateMessageStatus(m.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-300 rounded text-[10px] p-1 focus:outline-none"
                        >
                          <option value="Unread">Unread</option>
                          <option value="Read">Read</option>
                          <option value="Replied">Replied</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      "{m.message}"
                    </div>

                    <p className="text-[9px] text-slate-500 text-right">Received on: {new Date(m.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 7. SYSTEM AUDIT & ACTIVITY LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            
            {/* Activity Logs */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
              <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest mb-4 block">Activity Audit Logs</span>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {activityLogs.map(log => (
                  <div key={log.id} className="bg-slate-900 p-3 rounded text-xs border border-slate-800">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                      <span className="text-secondary">Action: {log.action}</span>
                      <span>{log.timestamp.split('T')[1].substring(0, 8)}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-semibold">User: {log.username} | IP Address: {log.ipAddress}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
              <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest mb-4 block">System Diagnostics</span>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {systemLogs.map(log => (
                  <div key={log.id} className="bg-slate-900 p-3 rounded text-xs border border-slate-800">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                      <span className={`uppercase font-black ${
                        log.level === 'error' ? 'text-red-400' : 'text-blue-400'
                      }`}>{log.level}</span>
                      <span>{log.timestamp.split('T')[1].substring(0, 8)}</span>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px]">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 8. COMPANY CORPORATE SETTINGS TAB */}
        {activeTab === 'settings' && companyInfo && (
          <div className="space-y-6 animate-fade-in text-xs max-w-4xl">
            <div>
              <h1 className="text-2xl font-black text-white">Company Corporate Settings</h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage Zion's central text registries, bank account details, vision/mission statements, and contact metrics dynamically.
              </p>
            </div>

            <form onSubmit={handleSaveCompanyInfo} className="space-y-6">
              
              {/* Core Text Section */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
                <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest block border-b border-slate-900 pb-2">Core Company Statements</span>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">About Us (History / Overview)</label>
                  <textarea
                    value={companyInfo.history}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, history: e.target.value })}
                    rows={4}
                    className="bg-slate-900 border border-slate-800 rounded p-3 text-slate-100 focus:outline-none focus:border-secondary font-medium leading-relaxed text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Our Mission</label>
                    <textarea
                      value={companyInfo.mission}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, mission: e.target.value })}
                      rows={3}
                      className="bg-slate-900 border border-slate-800 rounded p-3 text-slate-100 focus:outline-none focus:border-secondary font-medium leading-relaxed text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Our Vision</label>
                    <textarea
                      value={companyInfo.vision}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, vision: e.target.value })}
                      rows={3}
                      className="bg-slate-900 border border-slate-800 rounded p-3 text-slate-100 focus:outline-none focus:border-secondary font-medium leading-relaxed text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Our Promise</label>
                  <textarea
                    value={companyInfo.ourPromise || ''}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, ourPromise: e.target.value })}
                    rows={2}
                    className="bg-slate-900 border border-slate-800 rounded p-3 text-slate-100 focus:outline-none focus:border-secondary font-medium leading-relaxed text-xs"
                    placeholder="We promise to deliver..."
                    required
                  />
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
                <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest block border-b border-slate-900 pb-2">Corporate Banking Details</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Bank Name</label>
                    <input
                      type="text"
                      value={companyInfo.bankDetails?.bankName || ''}
                      onChange={(e) => setCompanyInfo({
                        ...companyInfo,
                        bankDetails: {
                          ...(companyInfo.bankDetails || { accountName: '', accountNumber: '', currency: 'MWK', branch: '' }),
                          bankName: e.target.value
                        }
                      })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Account Name</label>
                    <input
                      type="text"
                      value={companyInfo.bankDetails?.accountName || ''}
                      onChange={(e) => setCompanyInfo({
                        ...companyInfo,
                        bankDetails: {
                          ...(companyInfo.bankDetails || { bankName: '', accountNumber: '', currency: 'MWK', branch: '' }),
                          accountName: e.target.value
                        }
                      })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Account Number</label>
                    <input
                      type="text"
                      value={companyInfo.bankDetails?.accountNumber || ''}
                      onChange={(e) => setCompanyInfo({
                        ...companyInfo,
                        bankDetails: {
                          ...(companyInfo.bankDetails || { bankName: '', accountName: '', currency: 'MWK', branch: '' }),
                          accountNumber: e.target.value
                        }
                      })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary font-mono text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Currency</label>
                    <input
                      type="text"
                      value={companyInfo.bankDetails?.currency || ''}
                      onChange={(e) => setCompanyInfo({
                        ...companyInfo,
                        bankDetails: {
                          ...(companyInfo.bankDetails || { bankName: '', accountName: '', accountNumber: '', branch: '' }),
                          currency: e.target.value
                        }
                      })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Branch Name</label>
                    <input
                      type="text"
                      value={companyInfo.bankDetails?.branch || ''}
                      onChange={(e) => setCompanyInfo({
                        ...companyInfo,
                        bankDetails: {
                          ...(companyInfo.bankDetails || { bankName: '', accountName: '', accountNumber: '', currency: 'MWK' }),
                          branch: e.target.value
                        }
                      })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
                <span className="text-slate-300 text-xs font-extrabold uppercase tracking-widest block border-b border-slate-900 pb-2">Corporate Contacts & Location</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Phone Number</label>
                    <input
                      type="text"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Alternative Phone Number</label>
                    <input
                      type="text"
                      value={companyInfo.phoneAlternative || ''}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phoneAlternative: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Email Address</label>
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Head Office Address</label>
                    <input
                      type="text"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading === 'save-company'}
                  className="bg-secondary text-primary font-black px-6 py-3 rounded shadow-md hover:bg-secondary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider"
                >
                  {actionLoading === 'save-company' ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span>Saving Parameters...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} className="text-primary" />
                      <span>Save Company Settings</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 9. WEB CONTENT MANAGER TAB */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Globe className="text-secondary" />
                  Web Content Manager
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage dynamically all your compliance certificates, blogs, testimonials, team members, partner logos, and media gallery items.
                </p>
              </div>
              <button 
                onClick={fetchData} 
                className="flex items-center gap-1.5 self-start bg-slate-800 hover:bg-slate-700 py-2 px-4 rounded text-xs font-bold border border-slate-700 cursor-pointer text-slate-300"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>Synchronize Content</span>
              </button>
            </div>

            {/* Sub navigation bar */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'certificates', label: 'Compliance Certificates' },
                { id: 'blogs', label: 'Blogs & News' },
                { id: 'testimonials', label: 'Testimonials' },
                { id: 'team', label: 'Our Team' },
                { id: 'clients', label: 'Partners & Clients' },
                { id: 'gallery', label: 'Media Gallery' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setContentSubTab(sub.id as any)}
                  className={`px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    contentSubTab === sub.id 
                      ? 'bg-secondary text-primary font-black shadow' 
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: CERTIFICATES */}
            {contentSubTab === 'certificates' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-slate-200 font-extrabold text-sm block">Compliance Certificates Registry</span>
                    <span className="text-slate-500 text-[10px] mt-0.5 block">Registers, licenses, and permits shown in downloads & verification portal.</span>
                  </div>
                  <button 
                    onClick={() => openCertificateModal(null)}
                    className="flex items-center gap-1 bg-secondary text-primary py-2 px-3 rounded font-black hover:bg-secondary/90 cursor-pointer transition-all uppercase text-[10px] tracking-wider"
                  >
                    <Plus size={12} />
                    <span>Add Certificate</span>
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-4 font-bold">Title</th>
                        <th className="p-4 font-bold">Category</th>
                        <th className="p-4 font-bold">License / TPIN No.</th>
                        <th className="p-4 font-bold">Authority</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {certificates.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500">No certificates registered.</td>
                        </tr>
                      ) : (
                        certificates.map(cert => (
                          <tr key={cert.id} className="hover:bg-slate-900/30">
                            <td className="p-4 font-bold text-white text-xs">{cert.title}</td>
                            <td className="p-4 text-slate-400">{cert.category}</td>
                            <td className="p-4 font-mono text-secondary">{cert.number}</td>
                            <td className="p-4 text-slate-400">{cert.authority}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">{cert.status}</span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => openCertificateModal(cert)} className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"><Edit size={12} /></button>
                                <button onClick={() => handleDeleteCertificate(cert.id)} className="p-1 bg-red-950/40 hover:bg-red-900/50 border border-red-900/20 rounded text-red-300 hover:text-red-100 cursor-pointer"><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 2: BLOGS */}
            {contentSubTab === 'blogs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-slate-200 font-extrabold text-sm block">Blog Posts Registry</span>
                    <span className="text-slate-500 text-[10px] mt-0.5 block">Corporate news, industry articles, and media updates.</span>
                  </div>
                  <button 
                    onClick={() => openBlogModal(null)}
                    className="flex items-center gap-1 bg-secondary text-primary py-2 px-3 rounded font-black hover:bg-secondary/90 cursor-pointer transition-all uppercase text-[10px] tracking-wider"
                  >
                    <Plus size={12} />
                    <span>Create Blog Post</span>
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-4 font-bold">Image</th>
                        <th className="p-4 font-bold">Title</th>
                        <th className="p-4 font-bold">Author</th>
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Featured</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {blogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500">No blog posts found.</td>
                        </tr>
                      ) : (
                        blogs.map(blog => (
                          <tr key={blog.id} className="hover:bg-slate-900/30">
                            <td className="p-4">
                              <img src={blog.featuredImage} alt="" className="w-10 h-7 object-cover border border-slate-800 rounded" referrerPolicy="no-referrer" />
                            </td>
                            <td className="p-4 font-bold text-white text-xs max-w-xs truncate">{blog.title}</td>
                            <td className="p-4 text-slate-400">{blog.author}</td>
                            <td className="p-4 text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${blog.featured ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                                {blog.featured ? 'Featured' : 'Standard'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => openBlogModal(blog)} className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"><Edit size={12} /></button>
                                <button onClick={() => handleDeleteBlog(blog.id)} className="p-1 bg-red-950/40 hover:bg-red-900/50 border border-red-900/20 rounded text-red-300 hover:text-red-100 cursor-pointer"><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 3: TESTIMONIALS */}
            {contentSubTab === 'testimonials' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-slate-200 font-extrabold text-sm block">Client Testimonials</span>
                    <span className="text-slate-500 text-[10px] mt-0.5 block">Client review blocks presented on the homepage slider.</span>
                  </div>
                  <button 
                    onClick={() => openTestimonialModal(null)}
                    className="flex items-center gap-1 bg-secondary text-primary py-2 px-3 rounded font-black hover:bg-secondary/90 cursor-pointer transition-all uppercase text-[10px] tracking-wider"
                  >
                    <Plus size={12} />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.length === 0 ? (
                    <div className="col-span-full bg-slate-950 p-12 text-center text-slate-500 border border-slate-800 rounded-xl">No testimonials available.</div>
                  ) : (
                    testimonials.map(t => (
                      <div key={t.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-start gap-4 justify-between relative">
                        <div className="flex gap-4">
                          <img src={t.authorImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                          <div className="space-y-1">
                            <h4 className="text-white font-bold text-xs">{t.authorName}</h4>
                            <p className="text-slate-400 text-[10px]">{t.position} at <span className="text-secondary">{t.company}</span></p>
                            <p className="text-amber-400 font-bold text-[10px]">{'★'.repeat(t.rating)}</p>
                            <p className="text-slate-300 text-[11px] leading-relaxed italic pt-1">"{t.comment}"</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => openTestimonialModal(t)} className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"><Edit size={12} /></button>
                          <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1 bg-red-950/40 hover:bg-red-900/50 border border-red-900/20 rounded text-red-300 hover:text-red-100 cursor-pointer"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 4: OUR TEAM */}
            {contentSubTab === 'team' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-slate-200 font-extrabold text-sm block">Our Executive Team</span>
                    <span className="text-slate-500 text-[10px] mt-0.5 block">Core executive team profiles displayed in the About Us section.</span>
                  </div>
                  <button 
                    onClick={() => openTeamModal(null)}
                    className="flex items-center gap-1 bg-secondary text-primary py-2 px-3 rounded font-black hover:bg-secondary/90 cursor-pointer transition-all uppercase text-[10px] tracking-wider"
                  >
                    <Plus size={12} />
                    <span>Add Team Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.length === 0 ? (
                    <div className="col-span-full bg-slate-950 p-12 text-center text-slate-500 border border-slate-800 rounded-xl">No team members registered.</div>
                  ) : (
                    teamMembers.map(tm => (
                      <div key={tm.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={tm.image} alt="" className="w-12 h-12 rounded object-cover border border-slate-800" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="text-white font-black text-xs">{tm.name}</h4>
                            <p className="text-secondary font-bold text-[10px]">{tm.role}</p>
                            <p className="text-slate-400 text-[9px] uppercase tracking-wider">{tm.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openTeamModal(tm)} className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"><Edit size={12} /></button>
                          <button onClick={() => handleDeleteTeam(tm.id)} className="p-1 bg-red-950/40 hover:bg-red-900/50 border border-red-900/20 rounded text-red-300 hover:text-red-100 cursor-pointer"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 5: PARTNERS & CLIENTS */}
            {contentSubTab === 'clients' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-slate-200 font-extrabold text-sm block">Client & Partner Logos</span>
                    <span className="text-slate-500 text-[10px] mt-0.5 block">Client / Partner network logos.</span>
                  </div>
                  <button 
                    onClick={() => openClientModal(null)}
                    className="flex items-center gap-1 bg-secondary text-primary py-2 px-3 rounded font-black hover:bg-secondary/90 cursor-pointer transition-all uppercase text-[10px] tracking-wider"
                  >
                    <Plus size={12} />
                    <span>Add Partner Logo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {clients.length === 0 ? (
                    <div className="col-span-full bg-slate-950 p-12 text-center text-slate-500 border border-slate-800 rounded-xl">No partner logos registered.</div>
                  ) : (
                    clients.map(cl => (
                      <div key={cl.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-3 relative text-center">
                        <div className="w-full h-16 bg-white rounded flex items-center justify-center p-2 border border-slate-800 overflow-hidden">
                          <img src={cl.logo} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-[10px] truncate w-24">{cl.name}</p>
                          <span className="text-[8px] uppercase font-black text-slate-400 bg-slate-900 py-0.5 px-1.5 rounded">{cl.type}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 w-full pt-1 border-t border-slate-900">
                          <button onClick={() => openClientModal(cl)} className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"><Edit size={12} /></button>
                          <button onClick={() => handleDeleteClient(cl.id)} className="p-1 bg-red-950/40 hover:bg-red-900/50 border border-red-900/20 rounded text-red-300 hover:text-red-100 cursor-pointer"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 6: MEDIA GALLERY */}
            {contentSubTab === 'gallery' && (
              <div className="space-y-4">
                
                {/* Header operations bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 p-4 border border-slate-800 rounded-xl gap-4">
                  <div>
                    <span className="text-slate-200 font-extrabold text-sm block">Gallery & Media Albums</span>
                    <span className="text-slate-500 text-[10px] mt-0.5 block">Manage image assets, videos, and custom albums.</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={openAlbumModal}
                      className="flex items-center gap-1 bg-slate-800 text-slate-200 py-2 px-3 rounded font-bold hover:bg-slate-700 cursor-pointer border border-slate-700 transition-all uppercase text-[10px] tracking-wider"
                    >
                      <Plus size={12} />
                      <span>Create Album</span>
                    </button>
                    <button 
                      onClick={() => openGalleryModal(null)}
                      className="flex items-center gap-1 bg-secondary text-primary py-2 px-3 rounded font-black hover:bg-secondary/90 cursor-pointer transition-all uppercase text-[10px] tracking-wider"
                    >
                      <Plus size={12} />
                      <span>Upload Item</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Album registry lists */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                    <span className="text-slate-300 font-extrabold uppercase tracking-widest text-[10px] block">Albums List</span>
                    <div className="space-y-2.5">
                      {albums.length === 0 ? (
                        <p className="text-slate-500 italic text-center text-[11px] py-4">No albums created.</p>
                      ) : (
                        albums.map(alb => (
                          <div key={alb.id} className="bg-slate-900 p-3 rounded border border-slate-800 flex justify-between items-start gap-3">
                            <div className="space-y-0.5">
                              <p className="text-white font-bold text-xs">{alb.name}</p>
                              <p className="text-slate-400 text-[10px] line-clamp-1">{alb.description}</p>
                            </div>
                            <button 
                              onClick={() => handleDeleteAlbum(alb.id)}
                              className="p-1 bg-red-950/40 hover:bg-red-900/50 rounded border border-red-900/20 text-red-300 hover:text-red-100 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Gallery Items list */}
                  <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                    <span className="text-slate-300 font-extrabold uppercase tracking-widest text-[10px] block">Gallery Assets ({galleryItems.length})</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {galleryItems.length === 0 ? (
                        <p className="text-slate-500 text-center text-[11px] py-12 col-span-full">No media files uploaded.</p>
                      ) : (
                        galleryItems.map(item => (
                          <div key={item.id} className="bg-slate-900 rounded border border-slate-800/80 overflow-hidden flex flex-col group">
                            <div className="w-full h-24 bg-slate-950 relative overflow-hidden">
                              {item.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center text-secondary font-black bg-slate-950 text-[10px]">VIDEO ASSET</div>
                              ) : (
                                <img src={item.url} alt="" className="w-full h-full object-cover transition-all group-hover:scale-105" referrerPolicy="no-referrer" />
                              )}
                              <div className="absolute top-1 right-1 flex gap-1">
                                <button onClick={() => openGalleryModal(item)} className="p-1 bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 rounded text-slate-300 hover:text-white cursor-pointer shadow"><Edit size={10} /></button>
                                <button onClick={() => handleDeleteGallery(item.id)} className="p-1 bg-red-950/80 hover:bg-red-900 border border-red-900/30 rounded text-red-300 hover:text-red-100 cursor-pointer shadow"><Trash2 size={10} /></button>
                              </div>
                            </div>
                            <div className="p-2">
                              <p className="text-white font-bold text-[10px] truncate">{item.title}</p>
                              <p className="text-slate-500 text-[8px] truncate mt-0.5 uppercase tracking-wide">
                                {albums.find(a => a.id === item.albumId)?.name || 'General'}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* 8. INTERACTIVE ADD/EDIT PROJECT SHEET MODAL */}
      {isModalOpen && modalType === 'project' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto text-xs space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem.id ? 'Modify Project Specifications' : 'Register New Project Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Project Name</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                  <select
                    value={editingItem.categoryId}
                    onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Client</label>
                  <input
                    type="text"
                    value={editingItem.client}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Budget Range</label>
                  <input
                    type="text"
                    value={editingItem.budget}
                    onChange={(e) => setEditingItem({ ...editingItem, budget: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Coordinates / Location</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                  <input
                    type="date"
                    value={editingItem.completionDate}
                    onChange={(e) => setEditingItem({ ...editingItem, completionDate: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Featured Sheet</label>
                  <select
                    value={editingItem.featured ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.value === 'true' })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (Show on homepage)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Progress Slider ({editingItem.progress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingItem.progress}
                    onChange={(e) => setEditingItem({ ...editingItem, progress: parseInt(e.target.value) })}
                    className="mt-3.5"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Visual Image URL</label>
                <input
                  type="text"
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Detailed Project description scope</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={4}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-project'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-project' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Save Record</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* COMPLIANCE CERTIFICATE MODAL */}
      {isModalOpen && modalType === 'certificate' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto text-xs space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem.id ? 'Modify Compliance Certificate' : 'Register New Certificate'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Certificate Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-secondary"
                    placeholder="e.g. NCIC Unlimited Certificate"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Legal & Incorporation">Legal & Incorporation</option>
                    <option value="NCIC Compliance">NCIC Compliance</option>
                    <option value="Taxation & MRA">Taxation & MRA</option>
                    <option value="Industry Standard">Industry Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">License / TPIN No.</label>
                  <input
                    type="text"
                    value={editingItem.number}
                    onChange={(e) => setEditingItem({ ...editingItem, number: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="e.g. REG-789-90"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Issuing Authority</label>
                  <input
                    type="text"
                    value={editingItem.authority}
                    onChange={(e) => setEditingItem({ ...editingItem, authority: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="e.g. National Construction Industry Council"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Issue Date</label>
                  <input
                    type="date"
                    value={editingItem.issueDate}
                    onChange={(e) => setEditingItem({ ...editingItem, issueDate: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Expiry Date</label>
                  <input
                    type="date"
                    value={editingItem.expiryDate}
                    onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Active">Active</option>
                    <option value="Pending Renewal">Pending Renewal</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Scope & Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="Compliance and authorization boundaries..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Compliance Notes</label>
                <textarea
                  value={editingItem.complianceNotes}
                  onChange={(e) => setEditingItem({ ...editingItem, complianceNotes: e.target.value })}
                  rows={2}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="Additional validation parameters..."
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-certificate'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-certificate' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG POST MODAL */}
      {isModalOpen && modalType === 'blog' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-xs space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem.id ? 'Edit Blog Post' : 'Write New Blog Post'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Post Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingItem({ ...editingItem, title, slug });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="Enter sensational title..."
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Slug Identifier</label>
                  <input
                    type="text"
                    value={editingItem.slug}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-400 focus:outline-none"
                    placeholder="url-path-of-blog"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Author Name</label>
                  <input
                    type="text"
                    value={editingItem.author}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Publish Date</label>
                  <input
                    type="date"
                    value={editingItem.createdAt}
                    onChange={(e) => setEditingItem({ ...editingItem, createdAt: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Featured Slider</label>
                  <select
                    value={editingItem.featured ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.value === 'true' })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="false">Standard Post</option>
                    <option value="true">Featured Carousel</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Featured Unsplash Image URL</label>
                <input
                  type="text"
                  value={editingItem.featuredImage}
                  onChange={(e) => setEditingItem({ ...editingItem, featuredImage: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Brief Excerpt / Sub-heading</label>
                <input
                  type="text"
                  value={editingItem.excerpt}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="Provide a quick summary for article previews..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Article Body Content (HTML or plain text)</label>
                <textarea
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  rows={8}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none font-mono"
                  placeholder="Write the full body of the post here..."
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-blog'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-blog' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT TESTIMONIAL MODAL */}
      {isModalOpen && modalType === 'testimonial' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto text-xs space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem.id ? 'Modify Testimonial' : 'Add New Client Review'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Reviewer Name</label>
                  <input
                    type="text"
                    value={editingItem.authorName}
                    onChange={(e) => setEditingItem({ ...editingItem, authorName: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="e.g. John Banda"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Star Rating</label>
                  <select
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Job Title / Designation</label>
                  <input
                    type="text"
                    value={editingItem.position}
                    onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="e.g. Project Manager"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Company Name</label>
                  <input
                    type="text"
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="e.g. Ministry of Water & Sanitation"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Reviewer Image URL</label>
                <input
                  type="text"
                  value={editingItem.authorImage}
                  onChange={(e) => setEditingItem({ ...editingItem, authorImage: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Client Review Comment</label>
                <textarea
                  value={editingItem.comment}
                  onChange={(e) => setEditingItem({ ...editingItem, comment: e.target.value })}
                  rows={4}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="We are deeply satisfied with Zion Projects..."
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-testimonial'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-testimonial' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {isModalOpen && modalType === 'team' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto text-xs space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem.id ? 'Modify Staff Record' : 'Register Executive Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="e.g. Khama Mpoola"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Designation Role</label>
                  <input
                    type="text"
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="e.g. Managing Director"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
                  <select
                    value={editingItem.department}
                    onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Executive">Executive Office</option>
                    <option value="Engineering">Engineering & Design</option>
                    <option value="Operations">Project Operations</option>
                    <option value="HR & Finance">Human Resources & Finance</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Staff Picture URL</label>
                  <input
                    type="text"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={editingItem.socials?.linkedin || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      socials: { ...(editingItem.socials || {}), linkedin: e.target.value }
                    })}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Twitter Handle</label>
                  <input
                    type="text"
                    value={editingItem.socials?.twitter || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      socials: { ...(editingItem.socials || {}), twitter: e.target.value }
                    })}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={editingItem.socials?.email || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      socials: { ...(editingItem.socials || {}), email: e.target.value }
                    })}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none"
                    placeholder="email@zion.mw"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Short Profile Bio</label>
                <textarea
                  value={editingItem.bio}
                  onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                  rows={3}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="Over 15 years overseeing civil structures..."
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-team'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-team' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT LOGO MODAL */}
      {isModalOpen && modalType === 'client' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto text-xs space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem.id ? 'Modify Client specs' : 'Add Corporate Client / Partner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Client/Partner Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="e.g. Roads Authority Malawi"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Logo Type Classification</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="client">Zion Client</option>
                  <option value="partner">Joint-Venture / Engineering Partner</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Logo URL (vector/high-res png)</label>
                <input
                  type="text"
                  value={editingItem.logo}
                  onChange={(e) => setEditingItem({ ...editingItem, logo: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-client'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-client' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Save Logo specs</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY ITEM MODAL */}
      {isModalOpen && modalType === 'gallery' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto text-xs space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem.id ? 'Modify Gallery Asset' : 'Upload Gallery Media'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Asset Caption Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="e.g. Foundation Pouring Lilongwe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Media Type</label>
                  <select
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="image">Standard Photograph</option>
                    <option value="video">Promotional / Site Video link</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Target Album</label>
                  <select
                    value={editingItem.albumId}
                    onChange={(e) => setEditingItem({ ...editingItem, albumId: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                    required
                  >
                    <option value="">General Gallery</option>
                    {albums.map(alb => (
                      <option key={alb.id} value={alb.id}>{alb.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Source Image/Video URL</label>
                <input
                  type="text"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-gallery'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-gallery' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Save Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALBUM CREATION MODAL */}
      {isModalOpen && modalType === 'album' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto text-xs space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Create Media Album Container</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Album Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="e.g. Roads & Bridges"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Album Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none"
                  placeholder="Detailed description of works in this album category..."
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-album'}
                  className="bg-secondary text-primary font-black px-5 py-2 rounded shadow hover:bg-secondary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'save-album' && <Loader2 size={12} className="animate-spin text-primary" />}
                  <span>Create Album</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
