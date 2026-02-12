# Architecture Deep Dive 🏗️

## 1. Data Layer (`services/api.ts`)
The `VendofyxService` acts as a Singleton Data Access Object (DAO).
*   **Persistence**: Currently implements a `localStorage` persistence layer with an automated `persist()` method called after every mutation.
*   **Scalability**: The service methods are `async`, making the transition to a real API (Supabase/Postgres) a drop-in replacement with zero changes to the UI components.

## 2. Rule-Based Compliance Engine
The core logic resides in `closeJob(jobId, userId)`:
```typescript
const missingRequired = items.filter(item => {
  if (!item.required) return false;
  const status = statuses.find(s => s.checklist_item_id === item.id);
  return !status || !status.completed;
});

if (missingRequired.length > 0) {
  return { success: false, message: "Compliance Lock..." };
}
```
This logic ensures that business rules are enforced **before** state changes occur.

## 3. Component Hierarchy
*   **App.tsx**: State orchestrator (Auth, Tab Navigation).
*   **Layout.tsx**: Structural wrapper (Sidebar, Responsive Mobile Menu).
*   **JobsList.tsx**: The most complex component. It handles:
    *   **Filtering**: Using `useMemo` for high-performance client-side filtering.
    *   **Inspector Pattern**: A split-pane view (List on left, Details on right) common in professional SaaS tools.
*   **Dashboard.tsx**: Data visualization layer using `recharts`.

## 4. Design System
*   **Colors**: A professional "Slate & Blue" palette representing reliability and cleanliness.
*   **Typography**: Inter (Variable font) for maximum readability in technical environments.
*   **Feedback**: High-contrast alerts and toast-style messages for error states (e.g., Compliance Locks).

---
**Next Evolution:** Migration of `VendofyxService` to `@supabase/supabase-js`.