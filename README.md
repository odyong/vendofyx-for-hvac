# Vendofyx MVP 🛠️

**Compliance-First HVAC Job Management**

Vendofyx is a specialized SaaS platform designed for HVAC companies that demand high standards of quality and accountability. Unlike generic task managers, Vendofyx uses a **Rule-Based Compliance Engine** to ensure every job meets safety and quality standards before it can be finalized.

## 🎯 Core Philosophy
In the HVAC industry, a missed step—like failing to test a safety valve or check refrigerant levels—can lead to catastrophic equipment failure or safety hazards. Vendofyx makes "skipping steps" impossible through technical enforcement.

## 🚀 Key Features

### 1. Rule-Based Compliance
*   **Mandatory Steps**: Admins can tag checklist items as "Required".
*   **Compliance Lock**: The system programmatically prevents a technician from closing a job if any mandatory steps are unchecked.
*   **Visual Indicators**: Clear "REQUIRED" badges and locking icons guide technicians through the workflow.

### 2. Smart Operations Dashboard
*   **Job Distribution**: Real-time visualization of Active, Completed, and Blocked jobs.
*   **Compliance Alerts**: Automatic flagging of "Blocked" jobs (open > 48 hours) to prevent service delays.
*   **Dispatcher View**: Powerful filtering by technician, status, and date range.

### 3. Enterprise Audit Trail
*   **Immutable Logs**: Every check, uncheck, and job closure is recorded with a high-precision timestamp.
*   **Accountability**: Logs capture the specific User ID associated with every action, creating a transparent history for quality control.

## 🛠️ Technology Stack
*   **Frontend**: React 18.2 with TypeScript
*   **Styling**: Tailwind CSS (Professional Slate/Blue theme)
*   **Icons**: Lucide React
*   **Charts**: Recharts (High-performance SVG charts)
*   **State Management**: Service-based singleton pattern with LocalStorage persistence (prepared for Supabase migration).

---
*Built for the field. Trusted by the office.*