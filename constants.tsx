import React from 'react';
import { 
  ClipboardCheck, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Tool, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Clock,
  History,
  Package
} from 'lucide-react';

export const COLORS = {
  primary: '#2563eb', // Blue-600
  secondary: '#64748b', // Slate-500
  success: '#10b981', // Emerald-500
  danger: '#ef4444', // Red-500
  warning: '#f59e0b', // Amber-500
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'tech'] },
  { id: 'jobs', label: 'Jobs', icon: ClipboardCheck, roles: ['admin', 'tech'] },
  { id: 'templates', label: 'Checklist Templates', icon: FileText, roles: ['admin'] },
  { id: 'inventory', label: 'Parts & Vendors', icon: Package, roles: ['admin'] },
  { id: 'audit', label: 'Audit Logs', icon: History, roles: ['admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export const STATUS_MAP = {
  open: { label: 'In Progress', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Clock },
  closed: { label: 'Completed', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
  blocked: { label: 'Blocked', color: 'text-red-600 bg-red-50 border-red-100', icon: AlertCircle },
};
