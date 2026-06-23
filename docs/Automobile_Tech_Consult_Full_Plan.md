# 📋 PROJECT SPECIFICATION & DEVELOPMENT BLAUPUNKT
**Project Name:** Automobile Tech Consult Platform  
**Target Platform:** Cross-Platform Mobile (Handset & Tablet Responsiveness)  
**Architecture:** React Native (TypeScript / Zustand / React Query)  
**Design Paradigm:** Luxury Engineering / High-Contrast Minimalist (Mercedes-Benz Inspired)  
**Document Version:** 1.1.0  

---

## 1. Executive Summary & Problem Statement

### 1.1 Context
In contemporary automotive servicing, dealerships frequently encounter intricate mechanical, electrical, or software anomalies that surpass the diagnostic expertise of on-site general technicians. To resolve these edge cases, dealerships rely on specialized Technical Consultants. Currently, this communication is fragmented—relying on unmonitored instant messaging, phone calls, and manual paperwork—leading to tracking inefficiencies, lost diagnostic data, and unvouched billing cycles.

### 1.2 Problem Statement
There is a critical operational gap for a structured, mobile-first ecosystem that facilitates real-time technical consultation between automotive dealerships and remote specialists. The workflow requires precise logging of complex vehicular issues, structured asynchronous communication, immutable chronological audit trails, and automated post-resolution billing and reporting workflows.

---

## 2. Core User Personas & Workspaces

The platform strictly segregates features based on two primary authenticated user roles:

### 2.1 The Dealership (Job Creator)
*   **Objective:** Log vehicular diagnostic data efficiently, upload rich telemetry/media, and track the progression of technical resolutions.
*   **Primary Workflows:** Job Initialization, Media/Scan ingestion, Solution validation, and Invoice/Receipt acquisition.

### 2.2 The Technical Consultant (Problem Solver)
*   **Objective:** Review complex diagnostic files, claim incoming cases based on queue priority or specialty, and deliver actionable technical resolutions.
*   **Primary Workflows:** Queue triaging, Diagnostic documentation, State switching, and Executive summary generation.

---

## 3. End-to-End Application Architecture

### 3.1 Onboarding & Gateway Authentication
1.  **First-Time Ingress:** Launch sequence triggers a high-fidelity vector animation (via *Lottie*) outlining the platform's utility without degrading bundle footprint.
2.  **Identity Provider (IdP) Layer:** Redirects to a secure authentication screen supporting:
    *   Federated Identity (Google Sign-In).
    *   Standard Enterprise Auth (Email/Password).
3.  **Role Provisioning:** New users must explicitly select their organizational profile (**Dealership** or **Tech Consultant**) during registration to establish workspace routing rules.

### 3.2 Dealership Interface & Functional Flow
*   **Recent Jobs Feed:** The primary terminal displaying a scrollable list of active and historic tickets, clearly marked with real-time lifecycle status badges.
*   **Job Creation Ingress (`+` Action Terminal):** A wizard-style data input form capturing:
    *   *Vehicle Metadata:* Manufacturer (Make), Model, Production Year.
    *   *Diagnostic Data:* Comprehensive textual explanation of the issue.
    *   *Telemetry & Media Ingestion:* A high-throughput file picker supporting multi-image uploads and video recordings for sound/vibration captures.
    *   *Vehicle Scan Report:* Digital upload slot for OBD-II / ECU scan logs.
    *   *System Fields:* The entry date is programmatically fetched and locked to the current system date (`current_date`) to prevent anti-dating.
*   **Granular Job Log Viewer:** Clicking an item expands it into an isolated detailed layout structured into two explicit components:
    *   *Component A (Core Profile):* Displays all vehicle telemetry, technical parameters, media attachments, and the assigned Consultant's identifier.
    *   *Component B (Audit History):* A chronological, immutable timeline recording every state alteration, the interacting operator's name, and structural timestamp logs.
*   **Ticket Termination & Billing:** Once a solution proves viable in the workshop, the dealer marks the ticket as `Resolved` and closes it. This action automatically freezes edits and triggers the generation of an institutional invoice/bill.

### 3.3 Technical Consultant Interface & Functional Flow
*   **Triage Dashboard:** A centralized ticket pool. Consultants can apply FIFO (First-In, First-Out) queuing parameters to address older, high-priority system deadlocks or manually pick tickets matching their core mechanical domain.
*   **Resolution Workspace:** Allows full visibility into the dealer's uploaded media and OBD files. The consultant submits a detailed text-based technical resolution protocol, which automatically updates the global ticket status.
*   **Executive Reporting:** A prominent, downloadable PDF report action button is dynamically exposed at the top of the details terminal for all closed tickets, serving as an immutable record of diagnostic advice.

---

## 4. Lifecycle State Machine & Lifecycle Rules

To preserve process integrity, system states strictly govern interface transitions and field mutability across both client roles.

```
 [Created] ──> [In Progress] ──> [Resolution Provided] ──> [Resolution Applied] ──> [Closed & Billed]
```

| Lifecycle State | State Mutator | Permitted Actor | UI / Functional Consequences & Side-Effects |
| :--- | :--- | :--- | :--- |
| **`Created`** | Form Submission | Dealership | Job enters the global queue; vehicle parameters become read-only for the dealer. |
| **`In Progress`** | Ticket Acquisition | Consultant | Assigns `consultant_id` to the ticket; initializes the audit log timestamp. Locks the job to this specific consultant. |
| **`Resolution Provided`**| Diagnostics Submission | Consultant | Pushes technical solution parameters; transfers dashboard ownership back to the originating Dealership. |
| **`Resolution Applied`** | Implementation Sync | Dealership | Workshop verifies advice on the physical vehicle; opens up the resolution verification checkboxes. |
| **`Closed`** | Resolution Finalization | Dealership | Changes ticket to an uneditable, archived state. Triggers the automated calculation and emission of the service bill. |

---

## 5. Technical Stack Specifications (Cross-Platform Mobile)

To support rapid delivery, code reuse across platforms, and fluid multi-surface rendering, the application is engineered on a modern React Native cross-platform stack.

*   **Core Framework:** **React Native (v0.74+)** leveraging the **New Architecture (TurboModules & Fabric)** for ultra-low latency rendering, memory efficiency, and optimal multi-threaded performance.
*   **Language Ecosystem:** **TypeScript** for absolute type safety across complex lifecycle states, API payloads, and component parameters.
*   **State Orchestration & Side-Effects:** **Zustand** or **Redux Toolkit** combined with **React Query (TanStack Query)** to handle local caching, asynchronous query synchronization, automatic background retry polling, and multi-part data payload persistence.
*   **Media Ingestion & Processing:** **react-native-image-picker** and **react-native-compressor** to perform on-device down-scaling of video streams before uploading, ensuring rapid transmission times within industrial concrete structures.
*   **Local Ledger & Persistence:** **WatermelonDB** or **MMKV** to cache large lists of job sheets, metadata logs, and chronological audits locally with sub-millisecond read times.

---

## 6. Multi-Device Layout Strategy (Responsive Handset & Tablet Matrices)

Automotive technicians utilize lightweight hand-held mobiles in under-hood environments, while technical advisors use wide-format tablets at testing benches. The application UI adapts dynamically across these target devices using adaptive design hooks.

### 6.1 Unified Breakpoint & Spatial Architecture
The codebase strictly adheres to a standard grid breakpoint schema calculated dynamically using React Native’s `useWindowDimensions()` hook or a specialized grid wrapper:
*   **Compact Screens (Width < 600dp):** Handheld Mobile Phones (Portrait optimized).
*   **Expanded Screens (Width ≥ 600dp):** Medium and Large Tablets (Landscape optimized).

### 6.2 Structural Component Adaptations
*   **Master-Detail Split Layout Engine:**
    *   *On Handheld Screens:* Implements a classic single-pane view model. Tap gestures on the "Recent Jobs Feed" trigger standard stack transitions to navigate cleanly to an independent details layout view.
    *   *On Tablet Screen Portals:* Automatically switches into a **Dual-Pane Persistent Layout**. The left 35% viewport maps a scrollable feed of recent logs, while the right 65% space updates dynamically to display Component A (Telemetry Profile) and Component B (Timeline Log) side-by-side. No backstack navigation occurs.
*   **Responsive Telemetry Inputs & Multi-Column Controls:** The complex `+` Job Creation Wizard renders field forms vertically on handheld screens. On tablets, fields are mapped into multi-column input row matrices, matching the aspect ratio and ensuring data fields are grouped cleanly without causing optical tracking strain.
*   **Fluid Asset Grid System:** Vehicle image captures and OBD scanner reports scale using flexbox wrap matrices, shifting fluidly between a 2-column layout on phones and a 4-column layout on tablets.

---

## 7. Visual Identity & Premium Automotive Design System

The application's interface adopts a premium, high-contrast "Luxury Engineering" theme inspired by modern Mercedes-Benz digital interfaces—utilizing a dark-mode-first hierarchy for mechanical workshop visibility combined with stark, clean light variations for administrative tablet usage.

### 7.1 Core Color Palette (Hex Mapping)
*   **Primary Surface / Background:** `#000000` (Obsidian Jet Black) — Establishes a premium, low-glare depth for garage technicians.
*   **Secondary Canvas Surface:** `#111111` (Midnight Matte Slate) — Separates structural container layout elements, text fields, and dynamic logs from the root background.
*   **Brand Metallic Accent:** `#A4AAAE` (Arrowsilver / Cirrus Metallic) — Used for high-fidelity borders, inactive icons, and structural dividing lines.
*   **High-Contrast Copy:** `#FFFFFF` (Polar White) — Ensures a crisp, readable typography pass with at least a 4.5:1 ratio over dark surfaces.
*   **System Status & Telemetry Accents:**
    *   *Electric Tech Cyan:* `#00A19B` (EQ Luminous Cyan) — Denotes state progression, active buttons, and data scan report points.
    *   *High-Priority Alert / Locked:* `#EB0000` (AMG Dynamic Red) — Highlights structural blockages, older ticket alerts, and locked validation parameters.

### 7.2 Typography & Component Dressing
*   **Typography Hierarchy:** Clean, highly technical neo-grotesque sans-serif typefaces designed with generous letter-spacing to emphasize technological precision.
*   **Elevated Component Styling:** Container views use completely flat planes or minimal 1dp elevations. Dividers borrow characteristics from brushed aluminum textures, replacing standard flat gray bars. Card layouts utilize razor-sharp or minimal 4dp rounded corners instead of heavy bubble styling to enforce a disciplined, luxury-tier layout.

---

## 8. Phased Implementation Roadmap

### Phase 1: Foundations & Auth (Weeks 1–2)
*   Setup React Native boilerplate config with TypeScript, integrating New Architecture hooks (Fabric/TurboModules).
*   Implement Theme Providers managing the custom Obsidian Black and EQ Luminous Cyan design palettes.
*   Build the Google Sign-In & Email/Password configuration with explicit onboarding role selection hooks.

### Phase 2: Responsive Engine & Job Feed (Weeks 3–5)
*   Construct layout hooks parsing `useWindowDimensions()` into clean phone/tablet split view engines.
*   Code the `+` Job Creation wizard with integrated `react-native-compressor` modules for video assets.
*   Establish local data state syncing using Zustand caching structures.

### Phase 3: Consultant Queue & Document Export (Weeks 6–8)
*   Deliver the Consultant multi-sorting FIFO interface dashboard.
*   Construct the Component B nested structural log view for audit histories.
*   Integrate `react-native-html-to-pdf` or a native print-bridge wrapper to compile and export the closed executive ticket reports.