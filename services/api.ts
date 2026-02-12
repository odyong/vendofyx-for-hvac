
import { 
  User, Job, JobTemplate, ChecklistItem, 
  JobChecklistStatus, AuditLog, Role, JobType, Vendor, Part 
} from '../types';
import * as mock from '../mockData';

class VendofyxService {
  private users: User[] = [mock.INITIAL_USER, { id: 'u2', name: 'John Tech', email: 'tech@vendofyx.com', company_id: 'c1', role: 'tech' }];
  private jobs: Job[] = [...mock.INITIAL_JOBS];
  private templates: JobTemplate[] = [...mock.INITIAL_TEMPLATES];
  private checklistItems: ChecklistItem[] = [...mock.INITIAL_CHECKLIST_ITEMS];
  private checklistStatuses: JobChecklistStatus[] = [...mock.INITIAL_CHECKLIST_STATUSES];
  private vendors: Vendor[] = [...mock.INITIAL_VENDORS];
  private parts: Part[] = [...mock.INITIAL_PARTS];
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem('vendofyx_db');
    if (data) {
      const parsed = JSON.parse(data);
      this.jobs = parsed.jobs || this.jobs;
      this.templates = parsed.templates || this.templates;
      this.checklistItems = parsed.checklistItems || this.checklistItems;
      this.checklistStatuses = parsed.checklistStatuses || this.checklistStatuses;
      this.vendors = parsed.vendors || this.vendors;
      this.parts = parsed.parts || this.parts;
      this.auditLogs = parsed.auditLogs || this.auditLogs;
    }
  }

  private persist() {
    localStorage.setItem('vendofyx_db', JSON.stringify({
      jobs: this.jobs,
      templates: this.templates,
      checklistItems: this.checklistItems,
      checklistStatuses: this.checklistStatuses,
      vendors: this.vendors,
      parts: this.parts,
      auditLogs: this.auditLogs
    }));
  }

  // --- Auth ---
  async getCurrentUser(): Promise<User | null> {
    const id = localStorage.getItem('vendofyx_user_id') || 'u1';
    return this.users.find(u => u.id === id) || null;
  }

  async login(role: Role): Promise<User> {
    const user = this.users.find(u => u.role === role)!;
    localStorage.setItem('vendofyx_user_id', user.id);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return [...this.users];
  }

  // --- Templates ---
  async getTemplates(): Promise<JobTemplate[]> {
    return [...this.templates];
  }

  async addTemplate(name: string, type: JobType): Promise<JobTemplate> {
    const newT: JobTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      company_id: 'c1',
      name,
      type
    };
    this.templates.push(newT);
    this.persist();
    return newT;
  }

  async getChecklistItems(templateId: string): Promise<ChecklistItem[]> {
    return this.checklistItems.filter(ci => ci.job_template_id === templateId);
  }

  async addChecklistItem(templateId: string, description: string, required: boolean): Promise<ChecklistItem> {
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substr(2, 9),
      job_template_id: templateId,
      description,
      required
    };
    this.checklistItems.push(newItem);
    this.persist();
    return newItem;
  }

  // --- Inventory ---
  async getVendors(): Promise<Vendor[]> {
    return [...this.vendors];
  }

  async addVendor(name: string, contact: string): Promise<Vendor> {
    const newVendor: Vendor = {
      id: 'v' + Math.random().toString(36).substr(2, 9),
      name,
      contact
    };
    this.vendors.push(newVendor);
    this.persist();
    return newVendor;
  }

  async getParts(): Promise<Part[]> {
    return [...this.parts];
  }

  async addPart(name: string, quantity: number, vendorId: string): Promise<Part> {
    const newPart: Part = {
      id: 'p' + Math.random().toString(36).substr(2, 9),
      name,
      quantity,
      vendor_id: vendorId
    };
    this.parts.push(newPart);
    this.persist();
    return newPart;
  }

  async updatePartQuantity(partId: string, quantity: number): Promise<void> {
    const part = this.parts.find(p => p.id === partId);
    if (part) {
      part.quantity = quantity;
      this.persist();
    }
  }

  // --- Jobs ---
  async getJobs(): Promise<Job[]> {
    return [...this.jobs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createJob(templateId: string, customerName: string, location: string, techId: string): Promise<Job> {
    const newJob: Job = {
      id: 'j' + Math.random().toString(36).substr(2, 9),
      job_template_id: templateId,
      assigned_tech_id: techId,
      status: 'open',
      created_at: new Date().toISOString(),
      customer_name: customerName,
      location
    };
    this.jobs.push(newJob);
    
    // Initialize checklist status
    const items = this.checklistItems.filter(ci => ci.job_template_id === templateId);
    items.forEach(item => {
      this.checklistStatuses.push({
        id: Math.random().toString(36).substr(2, 9),
        job_id: newJob.id,
        checklist_item_id: item.id,
        completed: false,
        updated_at: new Date().toISOString()
      });
    });

    this.persist();
    return newJob;
  }

  async getJobChecklist(jobId: string): Promise<(ChecklistItem & { completed: boolean })[]> {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return [];
    
    const items = this.checklistItems.filter(ci => ci.job_template_id === job.job_template_id);
    return items.map(item => {
      const status = this.checklistStatuses.find(s => s.job_id === jobId && s.checklist_item_id === item.id);
      return { ...item, completed: status ? status.completed : false };
    });
  }

  async toggleChecklistItem(jobId: string, itemId: string, completed: boolean, userId: string): Promise<void> {
    const status = this.checklistStatuses.find(s => s.job_id === jobId && s.checklist_item_id === itemId);
    if (status) {
      status.completed = completed;
      status.updated_at = new Date().toISOString();
      
      this.auditLogs.push({
        id: Math.random().toString(36).substr(2, 9),
        job_id: jobId,
        user_id: userId,
        action: `${completed ? 'Completed' : 'Unchecked'} checklist item ${itemId}`,
        timestamp: new Date().toISOString()
      });

      this.persist();
    }
  }

  async closeJob(jobId: string, userId: string): Promise<{ success: boolean; message?: string }> {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    // Compliance Check
    const items = this.checklistItems.filter(ci => ci.job_template_id === job.job_template_id);
    const statuses = this.checklistStatuses.filter(s => s.job_id === jobId);
    
    const missingRequired = items.filter(item => {
      if (!item.required) return false;
      const status = statuses.find(s => s.checklist_item_id === item.id);
      return !status || !status.completed;
    });

    if (missingRequired.length > 0) {
      return { 
        success: false, 
        message: `Compliance Lock: ${missingRequired.length} required steps are missing.` 
      };
    }

    job.status = 'closed';
    this.auditLogs.push({
      id: Math.random().toString(36).substr(2, 9),
      job_id: jobId,
      user_id: userId,
      action: 'Closed job successfully',
      timestamp: new Date().toISOString()
    });
    this.persist();
    return { success: true };
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getDashboardStats() {
    const totalJobs = this.jobs.length;
    const completedJobs = this.jobs.filter(j => j.status === 'closed').length;
    const activeJobs = this.jobs.filter(j => j.status === 'open').length;
    
    // Logic for "Blocked" jobs: Open jobs where creation date > 48h ago but checklist incomplete
    const blockedJobs = this.jobs.filter(j => {
      if (j.status !== 'open') return false;
      const created = new Date(j.created_at).getTime();
      const ageHours = (Date.now() - created) / (1000 * 60 * 60);
      return ageHours > 48;
    }).length;

    return { totalJobs, completedJobs, activeJobs, blockedJobs };
  }
}

export const api = new VendofyxService();
