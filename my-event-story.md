# My Events Dashboard: Solution Design

This document outlines the detailed design for the "My Events" dashboard feature, focusing on component architecture, data flow, and strategies for ensuring data freshness.

---

## 1. Component Design

**Chosen Approach:** The design leverages Next.js App Router's capabilities by utilizing an `async` Server Component as the main page wrapper, which fetches all necessary data. This data is then passed down as props to various Client Components responsible for rendering interactive UI elements.

**Benefits of this Design:**
*   **Performance (Initial Load):** Data fetching occurs on the server, close to the database, resulting in faster Time To First Byte (TTFB) and improved Largest Contentful Paint (LCP).
*   **SEO:** Server-rendered content is fully available to search engine crawlers.
*   **Security:** Sensitive data fetching logic remains on the server, never exposed client-side.
*   **Simplicity of Data Fetching:** `async/await` directly in Server Components simplifies data retrieval.
*   **Reduced Client-Side JavaScript:** Only necessary JavaScript for interactivity is sent to the browser, leading to smaller bundles.

**Example Structure:**
```
src/app/(events)/my-events/
├───page.tsx                 // Main Server Component, fetches data
├───loading.tsx              // Loading state for the page
├───components/
│   ├───EventDashboard.tsx   // Client Component, orchestrates dashboard UI, receives data as props
│   ├───EventStatsCard.tsx   // Client Component, displays individual statistics
│   ├───EventManagementTable.tsx // Client Component, interactive table for events
│   ├───RealtimeListener.tsx // Client Component, listens for Supabase Realtime changes
```

---

## 2. Data Flow

**Initial Page Load (Server-Side Rendering):**
1.  `src/app/(events)/my-events/page.tsx` (Server Component) makes a call to a client-side service (`src/services/app/client/user-event.service.ts`).
2.  This client-side service then makes a `POST` request to a new API route (`src/app/api/user-events/route.ts`).
3.  The API route, running on the server, delegates to a backend service (`src/services/api/user-event.service.ts`).
4.  The backend service performs multiple Supabase queries to gather all user-specific event data, statistics, and reports.
5.  The aggregated data is returned through the API route to the `page.tsx` Server Component.
6.  `page.tsx` renders the initial HTML with this data and passes it to child Client Components for hydration.

**Interactive Actions (Client-Side):**
1.  Client Components (e.g., `EventManagementTable`, `EventActionsDropdown`) handle user interactions (filtering, sorting, managing events).
2.  These components make further API calls (e.g., to `/api/user-events` or existing `/api/events` routes) to perform specific actions or fetch updated data.
3.  The API routes and backend services process these requests, and the Client Components update their UI based on the responses.

---

## 3. Data Freshness Solutions

To ensure the "My Events" dashboard data is as up-to-date as possible, a multi-pronged approach combining Next.js's revalidation features with Supabase Realtime is proposed.

### a. On-Demand Revalidation (Primary for User Actions)

*   **Purpose:** To immediately update the dashboard data after a user performs an action that modifies their events (e.g., creating, updating, deleting an event; accepting/declining an invitation).
*   **Mechanism:** Utilize `revalidatePath('/my-events')` within the relevant API routes or Server Actions. After a successful database write operation, this function invalidates the cache for the `/my-events` page. The next request to this path will trigger a fresh server-side render.
*   **Implementation:**
    *   Identify all API endpoints or Server Actions that modify event or invitation data relevant to the dashboard.
    *   Add `revalidatePath('/my-events')` after the successful database operation in these handlers.

### b. Supabase Realtime (for Near Real-time External Changes)

*   **Purpose:** To provide near real-time updates to the dashboard when data changes due to external factors (e.g., another user accepts an invitation to an event the current user created).
*   **Mechanism:** A dedicated Client Component (`RealtimeListener.tsx`) subscribes to Supabase Realtime changes on relevant tables (`events`, `event_participants`, `event_invitations`). When a change event is received, this Client Component triggers a Server Action.
*   **Implementation:**
    *   Create a `RealtimeListener.tsx` Client Component that establishes a Supabase Realtime subscription.
    *   Define a Server Action (e.g., `revalidateMyEventsDashboard`) that simply calls `revalidatePath('/my-events')`.
    *   In the `RealtimeListener.tsx`'s `useEffect` hook, call the Server Action when a relevant Realtime event is received.
    *   Include the `RealtimeListener.tsx` component within the `my-events/page.tsx` Server Component (wrapped in `Suspense` if needed).

### c. Time-Based Revalidation (for Less Critical Data)

*   **Purpose:** As a fallback or for data that doesn't require immediate, granular freshness (e.g., general statistics that are acceptable to be slightly stale).
*   **Mechanism:** Use `export const revalidate = N` directly in `src/app/(events)/my-events/page.tsx`. This tells Next.js to re-generate the page content every `N` seconds in the background.
*   **Implementation:** Add `export const revalidate = 3600;` (for hourly revalidation) to `src/app/(events)/my-events/page.tsx`.

---

## 4. Final Solution Design (Hybrid Approach)

The recommended approach for data freshness is a **hybrid model**:

*   **User-Initiated Changes:** Primarily handled by **On-Demand Revalidation**. This ensures that when a user directly interacts with their events (e.g., creates a new one), the dashboard reflects the change almost immediately upon their next navigation or refresh.
*   **External/Passive Changes:** Covered by **Supabase Realtime** triggering **On-Demand Revalidation**. This provides a near real-time experience for changes happening outside the current user's direct interaction on the dashboard.
*   **Baseline Freshness:** **Time-Based Revalidation** acts as a safety net, ensuring that even if other mechanisms fail or are missed, the dashboard data will eventually refresh at a set interval.

This combined strategy provides a robust, performant, and user-friendly experience for the "My Events" dashboard, balancing immediate data freshness with efficient resource utilization.