---
name: Command Tactical Direct
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#44474d'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#515f7a'
  primary: '#000412'
  on-primary: '#ffffff'
  primary-container: '#0f1e36'
  on-primary-container: '#7886a3'
  inverse-primary: '#b8c7e6'
  secondary: '#4e5e82'
  on-secondary: '#ffffff'
  secondary-container: '#c4d4fe'
  on-secondary-container: '#4b5b7f'
  tertiary: '#140000'
  on-tertiary: '#ffffff'
  tertiary-container: '#460002'
  on-tertiary-container: '#f93d37'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#b8c7e6'
  on-primary-fixed: '#0c1b33'
  on-primary-fixed-variant: '#394761'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#b6c6f0'
  on-secondary-fixed: '#071b3b'
  on-secondary-fixed-variant: '#364669'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: publicSans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: publicSans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: publicSans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: publicSans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: publicSans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: publicSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: publicSans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: publicSans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: publicSans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: publicSans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.025em
  label-sm:
    fontFamily: publicSans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
  code-md:
    fontFamily: publicSans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  spacing-3xs: 0.125rem
  spacing-2xs: 0.25rem
  spacing-xs: 0.5rem
  spacing-sm: 0.75rem
  spacing-md: 1rem
  spacing-lg: 1.25rem
  spacing-xl: 1.5rem
  spacing-2xl: 2rem
  spacing-3xl: 3rem
  gutter-desktop: 1rem
  margin-desktop: 1.5rem
  gutter-mobile: 0.75rem
  margin-mobile: 1rem
---

## Brand & Style

This design system delivers an authoritative, high-integrity mission-control interface engineered for round-the-clock emergency operations, field dispatching, and rapid case triage. Drawing direct inspiration from mission-critical national security consoles, public safety answering points (PSAPs), and civil protection systems, the visual language prioritizes situational clarity, rapid scannability, and operational rigor.

### Personality & Tone
- **Authoritative & Uncompromising:** Uncluttered layouts, precise data labeling, structured operational status indicators, and institutional gravitas that instill operational discipline.
- **Zero-Cognitive-Friction:** Every visual element serves triage speed. Decorative flourishes, vague metaphors, and low-contrast stylistic treatments are eliminated.
- **Urgency-Calibrated:** Visual energy is quiet and systematic during steady-state monitoring, shifting instantly to high-salience optical alerts during critical incidents.

### Target Operator Profile
- **Station House Officers (SHOs), Dispatch Duty Officers, and Emergency Watch Desk Commanders:** Personnel operating across 8- to 12-hour rotating shifts under variable lighting conditions (harsh fluorescent station rooms, dim tactical control pods, and field-station terminals). Operators require immediate differentiation between critical elder distress alerts, routine welfare checks, and administrative records.

### Design Movement
- **Tactical Government Modern:** A balanced fusion of structured administrative design systems (like institutional public infrastructure standards) and high-density emergency command consoles. It employs sharp structural borders, tonal status tiering, strict tabular alignment, and dedicated triage channels.

## Colors

The system uses an institutional light mode foundation designed to maintain legibility on varying monitor hardware, complemented by a tactical dark navy structural frame. Color is deployed as functional data, never as decorative fill.

### Palette Architecture & Semantic Roles

- **Command Navy (Primary `#0F1E36`, Secondary `#1A2B4C`):** Represents institutional authority and command hierarchy. Reserved for global navigation headers, top-tier summary bars, active station selectors, and primary affirmative actions (e.g., "Dispatch Unit", "Acknowledge Incident").
- **Neutral Canvas & Surfaces (`#F4F6F9`, `#FFFFFF`, `#E2E8F0`):**
  - App Background: Tactical cool slate (`#F4F6F9`), preventing eye fatigue during continuous screen interaction.
  - Surface Containers: Crisp white (`#FFFFFF`) with precision 1px borders (`#E2E8F0`).
  - Subtle Insets: `#EDF2F7` for log tables, metadata sidecars, and disabled zones.
- **Signal Red / SOS Accent (`#DC2626`, Highlight `#EF4444`):** Strictly quarantined for live elder SOS triggers, unacknowledged physical emergencies, panic button pings, and escalation breaches. It must never be used for standard destructive actions (like "Clear Filters").
- **Escalation Amber (`#D97706`, Highlight `#F59E0B`):** Denotes SLA threshold warnings, unattended high-risk check-ins, medical timer expirations, and elevated watch statuses.
- **Field Green / Verified (`#059669`, Highlight `#10B981`):** Applied to resolved incidents, safe elder verifications, on-scene beat officer confirmations, and healthy system telemetry.
- **Tactical Blue (`#2563EB`, Highlight `#3B82F6`):** Indicates active dispatch routing, unit assignment, standard case progress, and informational system telemetry.
- **Typography & Dark Neutrals (`#0F172A`, `#334155`, `#64748B`):** Ultra-high-contrast slate charcoal for zero-glare, crisp optical readability down to 11px micro-labels.

## Typography

Typography is calibrated for uncompromising data density and instantaneous scanning. Public Sans provides neutral, geometric clarity with distinct numerals and open counters that resist degradation across low-resolution station monitors.

### Typographic Directives
- **Tabular Figures Required:** All case counters, Indian phone numbers (+91), coordinates (lat/long), timestamps (HH:mm:ss IST), and police beat IDs must use tabular lining figures (`font-feature-settings: "tnum" 1`).
- **Identifier Hierarchy:** Case tokens, FIR/GD numbers, and Beat Vehicle IDs use `label-sm` with 0.05em letter-spacing and uppercase styling (`text-transform: uppercase`) to prevent ambiguity between characters like `0` and `O` or `1` and `I`.
- **Vertical Rhythm:** Headings feature tight, disciplined line-heights to preserve vertical screen real estate for incident queues, dispatch maps, and live sensor feeds.

## Layout & Spacing

The system implements an operational fluid grid with strict layout zones designed to support multi-monitor police desks and tactical in-vehicle tablets.

### Layout Model
- **Command Header:** Fixed 56px tactical utility bar containing Station Identifier, Current SHO Duty Officer, Real-time Clock (IST), Emergency DEFCON status, and Global Search.
- **Split-Screen Command Canvas (Desktop ≥ 1280px):**
  - **Left Rail / Queue (380px - 440px fixed width):** Incident Triage Feed (SOS triggers, escalated calls, pending elder checks). High data density with persistent sorting.
  - **Center Canvas (Fluid 12-column grid, 16px gutters):** Geospatial Sector Map, Live GIS Beat Car Tracking, or Active Incident File.
  - **Right Panel (360px - 420px contextual width):** Citizen Health Profile, Medical Dossier, Emergency Contacts, Assigned Officer Telemetry, and Case Dispatch Actions.
- **Field Tablet Mode (768px – 1279px):** Stacks the Incident Triage into an off-canvas drawer or top collapsible tier, allocating primary visual area to the live map and case details.
- **Mobile Mode (< 768px):** Linear single-column flow with a persistent bottom emergency response action bar for field beat officers.

### Spacing Density
- Standard inner container padding is calibrated to `12px` (`0.75rem`) and `16px` (`1rem`) to ensure high information capacity per viewport while maintaining strict visual division between adjacent incident cards.

## Elevation & Depth

Visual hierarchy is maintained through high-contrast borders and low-diffuse ambient elevation, preventing the muddy appearance common in multi-card dashboard software.

### Depth System

1. **Base Layer (Level 0):** Background canvas (`#F4F6F9`), completely flat.
2. **Structural Layer (Level 1):** Command cards, data grids, and map containers (`#FFFFFF`) framed by a crisp 1px border of `#E2E8F0`. No shadow is cast; separation is achieved purely through contrast and edge definition.
3. **Elevated Flyout & Popovers (Level 2):** Quick citizen previews, unit reassignments, and contextual menus. Utilizes `box-shadow: 0 4px 6px -1px rgba(15, 30, 54, 0.08), 0 2px 4px -2px rgba(15, 30, 54, 0.04)` bordered by `#CBD5E1`.
4. **Urgent Overlay / SOS Critical Modal (Level 3):** Incident override screens and immediate response confirmation dialogs. Casts `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 8px 10px -6px rgba(15, 23, 42, 0.1)`.
5. **Emergency Glow (Conditional):** Active SOS cards and flashing dispatch tags use a localized chromatic outline: `0 0 0 2px #DC2626, 0 0 12px rgba(220, 38, 38, 0.35)` to command immediate operator attention across peripheral vision.

## Shapes

The design system employs a soft, highly disciplined corner geometry (`roundedness: 1` — 4px base radius) engineered for tactical environments. Sharp, precise corners reinforce stability, structural order, and governmental seriousness, eliminating playful or consumer-app characteristics.

### Radius Assignments
- **Base UI Controls (Inputs, Buttons, Dropdowns):** `4px` (`0.25rem`). Ensures compact juxtaposition without awkward visual gaps.
- **Data Panels, Cards, Map Overlays:** `6px` (`0.375rem`) with clean 1px borders.
- **Badges, Priority Tags, Status Indicators:** `3px` (`0.1875rem`) or strict micro-pills (`9999px`) strictly limited to count indicators (e.g., active unread notifications).

## Components

### 1. Buttons & Tactical Action Triggers
- **Primary Command Button:** Background `#0F1E36`, text `#FFFFFF`, radius 4px, height 36px (desktop) / 44px (touch). Focused with a 2px offset border in `#2563EB`. Used for "Assign Beat Officer", "Save Log", "Update Status".
- **Critical SOS Dispatch Button:** Solid Police Crimson (`#DC2626`), text `#FFFFFF`, bold weight. When triggered, initiates an emergency broadcast. Includes tactile active states with zero transition lag.
- **Secondary Action Button:** White background (`#FFFFFF`), border 1px solid `#CBD5E1`, text `#0F172A`. Hover transitions to `#F1F5F9`.
- **Icon Utility Button:** 32x32px or 36x36px square with 1px border. Houses map controls, phone dialers, and print/export utilities.

### 2. Status Chips & Priority Badges
- **SOS Critical:** Background `#FEF2F2`, border 1px solid `#FCA5A5`, text `#991B1B`. Accompanied by a 6px pulsating `#DC2626` dot.
- **Priority Escalated (Amber):** Background `#FFFBEB`, border 1px solid `#FCD34D`, text `#92400E`.
- **Field Unit En Route (Blue):** Background `#EFF6FF`, border 1px solid `#BFDBFE`, text `#1E40AF`.
- **Resolved / Safe (Green):** Background `#ECFDF5`, border 1px solid `#A7F3D0`, text `#065F46`.
- **Typography:** All chips use `label-sm` (11px bold, uppercase, 0.05em tracking) with tabular numeric counts.

### 3. Case & Incident Cards
- **Structure:** 1px solid `#E2E8F0` on white surface. Divided into Header (Case ID, Time Elapsed, Sector), Body (Senior Name, Age, Vital Medical Condition, Exact Landmark/Address), and Footer (Assigned Beat Patrol, SLA Countdown Timer, Action Tray).
- **Critical SOS Variant:** Left-border accent of 4px solid `#DC2626`, with ambient warning background `#FFF8F8` and prominent elder contact access.

### 4. Input Fields & Search Controls
- **Global Search:** Height 36px, background `#FFFFFF`, border 1px solid `#CBD5E1`. Placeholder: "Search by Senior Name, Aadhaar/ID, Mobile, Address or Case Ref..." with keyboard shortcut hint (`Ctrl + K`).
- **Operational Data Inputs:** High contrast, crisp borders. Text color `#0F172A`. Active focus produces a 1px border in `#0F1E36` plus a 2px outer ring in `rgba(15, 30, 54, 0.15)`.

### 5. Data Tables (CCTNS / GD Log Standard)
- **Header:** Background `#F1F5F9`, border-bottom 2px solid `#CBD5E1`. Labels are `label-md` in `#475569`.
- **Rows:** 40px compact height for high visibility. Alternating or clear hover states (`#F8FAFC`).
- **Cells:** Tabular figures for incident timestamps, elder phone numbers, police station ward codes, and officer badge numbers.

### 6. Senior Citizen Emergency Profile Card (Domain Specific)
- Dedicated micro-layout featuring high-visibility medical tags (e.g., "Non-Ambulatory", "Cardiac History", "Lives Alone - High Vulnerability"), verified emergency relative contacts with direct dispatch-to-call hooks, registered keyholder details, and GIS Geo-Fence radius.