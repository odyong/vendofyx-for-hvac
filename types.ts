
export type Role = 'admin' | 'tech';

export interface User {
  id: string;
  name: string;
  email: string;
  company_id: string;
  role: Role;
}

export interface Company {
  id: string;
  name: string;
  subscription_status: 'active' | 'inactive';
}

export type JobType = 'install' | 'repair' | 'maintenance';

export interface JobTemplate {
  id: string;
  company_id: string;
  name: string;
  type: JobType;
}

export interface ChecklistItem {
  id: string;
  job_template_id: string;
  description: string;
  required: boolean;
}

export type JobStatus = 'open' | 'closed';

export interface Job {
  id: string;
  job_template_id: string;
  assigned_tech_id: string;
  status: JobStatus;
  created_at: string;
  customer_name: string;
  location: string;
}

export interface JobChecklistStatus {
  id: string;
  job_id: string;
  checklist_item_id: string;
  completed: boolean;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  job_id: string;
  user_id: string;
  action: string;
  timestamp: string;
}

export interface Part {
  id: string;
  name: string;
  quantity: number;
  vendor_id: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
}
