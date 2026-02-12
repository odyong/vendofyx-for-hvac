
import { User, Company, JobTemplate, ChecklistItem, Job, JobChecklistStatus, AuditLog, JobType, Vendor, Part } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Foreman',
  email: 'alex@vendofyx.com',
  company_id: 'c1',
  role: 'admin',
};

export const INITIAL_COMPANY: Company = {
  id: 'c1',
  name: 'Elite HVAC Solutions',
  subscription_status: 'active',
};

export const INITIAL_TEMPLATES: JobTemplate[] = [
  { id: 't1', company_id: 'c1', name: 'Standard AC Repair', type: 'repair' },
  { id: 't2', company_id: 'c1', name: 'New Furnace Installation', type: 'install' },
];

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'ci1', job_template_id: 't1', description: 'Visual inspection of condenser', required: true },
  { id: 'ci2', job_template_id: 't1', description: 'Check refrigerant levels', required: true },
  { id: 'ci3', job_template_id: 't1', description: 'Clean debris from unit', required: false },
  { id: 'ci4', job_template_id: 't2', description: 'Level concrete pad', required: true },
  { id: 'ci5', job_template_id: 't2', description: 'Connect gas lines', required: true },
  { id: 'ci6', job_template_id: 't2', description: 'Test safety valves', required: true },
  { id: 'ci7', job_template_id: 't2', description: 'Customer walkthrough', required: true },
];

export const INITIAL_JOBS: Job[] = [
  { 
    id: 'j1', 
    job_template_id: 't1', 
    assigned_tech_id: 'u2', 
    status: 'open', 
    created_at: new Date(Date.now() - 86400000).toISOString(),
    customer_name: 'John Smith',
    location: '123 Maple St, Springfield'
  },
  { 
    id: 'j2', 
    job_template_id: 't2', 
    assigned_tech_id: 'u1', 
    status: 'closed', 
    created_at: new Date(Date.now() - 172800000).toISOString(),
    customer_name: 'Sarah Connor',
    location: '742 Terrace Dr, Oak Ridge'
  },
];

export const INITIAL_CHECKLIST_STATUSES: JobChecklistStatus[] = [
  { id: 's1', job_id: 'j1', checklist_item_id: 'ci1', completed: true, updated_at: new Date().toISOString() },
  { id: 's2', job_id: 'j1', checklist_item_id: 'ci2', completed: false, updated_at: new Date().toISOString() },
  { id: 's3', job_id: 'j2', checklist_item_id: 'ci4', completed: true, updated_at: new Date().toISOString() },
  { id: 's4', job_id: 'j2', checklist_item_id: 'ci5', completed: true, updated_at: new Date().toISOString() },
  { id: 's5', job_id: 'j2', checklist_item_id: 'ci6', completed: true, updated_at: new Date().toISOString() },
  { id: 's6', job_id: 'j2', checklist_item_id: 'ci7', completed: true, updated_at: new Date().toISOString() },
];

export const INITIAL_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Carrier Global', contact: 'support@carrier.com | 1-800-CARRIER' },
  { id: 'v2', name: 'Honeywell Home', contact: 'sales@honeywell.com | 1-800-HONEYWELL' },
];

export const INITIAL_PARTS: Part[] = [
  { id: 'p1', name: 'Capacitor 45/5 MFD 370V', quantity: 24, vendor_id: 'v1' },
  { id: 'p2', name: 'Smart Thermostat T6 Pro', quantity: 12, vendor_id: 'v2' },
  { id: 'p3', name: 'Draft Inducer Motor', quantity: 5, vendor_id: 'v1' },
];
