# Quickstart Guide ⚡

Follow these steps to explore the Vendofyx MVP in under 10 minutes.

## 1. Authentication
The MVP features a simplified login screen to demonstrate role-based access control (RBAC):
*   **Login as Administrator**: Full access to Templates, Audit Logs, and Global Settings.
*   **Login as Technician**: Access to assigned Jobs and Checklist completion.

## 2. Setting Up a Workflow (Admin)
1.  Navigate to **Checklist Templates**.
2.  Create a new template (e.g., "Standard Maintenance").
3.  Add steps like "Clean Filters" and "Check Voltage". 
4.  Ensure critical steps have the **Required** toggle enabled.

## 3. Dispatching a Job
1.  Go to the **Jobs** tab.
2.  Click **+ New Assignment**.
3.  Fill in customer details and select your newly created template.
4.  Assign it to a technician.

## 4. Completing the Work (Tech)
1.  Select the job from the list.
2.  Complete the steps as you perform the work.
3.  Try to click **Complete Job** before checking the mandatory items. Observe the **Compliance Lock** error message.
4.  Complete all required steps and finalize the job.

## 5. Reviewing the Audit Log
1.  Navigate to **Audit Logs**.
2.  Review the timestamps and actions. Note how every checklist toggle was recorded.

---
**Tip:** Data is persisted in your browser's LocalStorage. Clearing your browser cache will reset the demo data.