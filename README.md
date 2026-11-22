# 🚀 NEXORA — Modern SaaS Authentication Interface

<div align="center">

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Day_3-100_Web_Dev_Projects-4F46E5?style=for-the-badge&logo=codeforces&logoColor=white" alt="Day 3" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Zero_Dependencies-10B981?style=for-the-badge&logo=dependabot&logoColor=white" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/WCAG_2.1_AA-Compliant-8B5CF6?style=for-the-badge&logo=w3c&logoColor=white" alt="WCAG AA" />
  <img src="https://img.shields.io/badge/License-MIT-06B6D4?style=for-the-badge" alt="MIT License" />

  <p align="center">
    A premium, production-grade split-screen Login and Signup interface for <strong>NEXORA</strong> — a fictional high-velocity engineering workspace platform. Built entirely with semantic <strong>HTML5</strong>, modern <strong>CSS3 (Custom Properties & Glassmorphism)</strong>, and <strong>Vanilla JavaScript</strong>.
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-live-demo--preview">Preview</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-responsive-design">Responsive Design</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-accessibility--security">Accessibility & Security</a> •
    <a href="#-demo-script">Demo Script</a>
  </p>

</div>

---

## 🌟 Overview

**NEXORA** is designed to look and feel like an enterprise-grade developer tool (comparable in craft and finish to Linear, Supabase, and Stripe). It eliminates generic template forms in favor of an intentional design system, rich micro-interactions, ambient gradient lighting, real-time validation, and a 4-tier password strength evaluation engine.

---

## ✨ Key Features

### 🎨 1. Split-Screen Brand Experience
* **Ambient Lighting & Mesh Background**: Multi-layered radial glowing orbs (`filter: blur(80px)`) combined with a subtle vignette-masked dot-matrix grid.
* **Geometric Brand Identity**: Bespoke SVG gradient mark and modern brand typography.
* **Feature Highlights**: 3 value proposition pillars with custom Lucide-style outline icon badges:
  * *Manage your work effortlessly* — Kanban sprint planning and bi-directional git syncing.
  * *Collaborate with your team* — Real-time multiplayer canvas and threaded context.
  * *Track progress in real time* — Live burndown telemetry and milestone delivery tracking.
* **Glassmorphic Customer Testimonial**: Floating glass card featuring 5-star rating indicators, verified customer pill badge, and quote from a fictional VP of Engineering.

### 🔐 2. Authentication Panel & View Switching
* **Segmented Pill Navigation**: Interactive `Sign In` / `Create Account` tab switcher with sliding pill indicator.
* **Deep Linking**: Syncs browser history with URL hashes (`#login` / `#signup`) for direct bookmarking.
* **No Page Reloads**: View switching animates smoothly without disrupting the user flow.

### 👁️ 3. Password Visibility Controls
* Individual show/hide toggles across **Login Password**, **Signup Password**, and **Confirm Password**.
* Real-time icon switching between open and slashed eye SVGs.
* Dynamic screen reader announcements (`aria-label="Show password"` / `"Hide password"`).

### ⚡ 4. Real-Time Password Strength Engine
* Evaluates password complexity dynamically as the user types across 4 distinct criteria:
  * 📏 **Length**: Minimum 8 characters.
  * 🔠 **Casing**: Both uppercase (`A-Z`) and lowercase (`a-z`) characters.
  * 🔢 **Numbers**: At least one numeric digit (`0-9`).
  * 🔣 **Special Symbols**: At least one non-alphanumeric symbol (`!@#$%^&*` etc.).
* **Dynamic 3-Segment Progress Bar**:
  * 🔴 **Weak**: Shorter than 8 characters, or satisfies only 1–2 criteria. (*Length alone never grants Strong*).
  * 🟡 **Medium**: At least 8 characters and satisfies 3 criteria.
  * 🟢 **Strong**: At least 8 characters and satisfies **all 4 criteria**.
* Checklist badges illuminate with green checkmark badges in real time as each rule is fulfilled.

### 🛡️ 5. Resilient Validation & Error Recovery
* **Immediate Error Removal**: Field borders and messages clear the instant the user begins correcting input.
* **Live Confirm-Password Verification**: Re-checks matching logic dynamically if the primary password is altered.
* **Accessible Guidance**: High-contrast crimson text (`#dc2626`, 4.9:1 contrast ratio) with dedicated `aria-invalid` states.

### 🪟 6. Accessible Forgot Password Modal
* Centered modal dialog with blurred backdrop filter.
* **WAI-ARIA Focus Trap**: `Tab` and `Shift+Tab` are trapped inside modal controls while open.
* **Dismissal Flexibility**: Closes via `Escape` key, backdrop click, or close button, safely restoring focus to the triggering element.
* **Simulated Recovery**: Displays an inline demo confirmation banner explaining token dispatch.

### 💾 7. Client-Side "Remember Me"
* Stores the user's work email in `localStorage` under `nexora_remembered_email`.
* Auto-populates the login email and selects the checkbox on subsequent visits.
* **Zero Password Storage**: Passwords are **never** stored in browser storage.

### 🍞 8. Toast Notifications & Social Auth Placeholders
* Google and GitHub authentication buttons display non-intrusive floating toasts explaining prototype mode.
* Auto-dismisses with slide-up entrance and fade-out animations.

---

## 📸 Visual Tour

```
┌──────────────────────────────────────┬──────────────────────────────────────┐
│          LEFT: BRAND HERO            │       RIGHT: AUTHENTICATION CARD     │
├──────────────────────────────────────┼──────────────────────────────────────┤
│  NEXORA [v2.5 Enterprise]            │   [ Sign In ]   [ Create Account ]   │
│                                      │                                      │
│  Welcome back to your workspace.     │   Sign in to your account            │
│  The unified collaboration suite...  │   [ G  Continue with Google  ]       │
│                                      │   [ 🐙 Continue with GitHub  ]       │
│  ✓ Manage your work effortlessly     │   ──────── OR CONTINUE WITH ──────── │
│  ✓ Collaborate with your team        │                                      │
│  ✓ Track progress in real time       │   Work Email                         │
│                                      │   [ name@company.com               ] │
│  ┌────────────────────────────────┐  │   Password              Forgot pwd?  │
│  │ ★★★★★ “Nexora cut sprint       │  │   [ ••••••••••••                 👁 ] │
│  │ overhead by 42%...”            │  │                                      │
│  │ — Elena Rostova, VP Eng        │  │   [x] Remember me for 30 days        │
│  └────────────────────────────────┘  │   [ Sign In to Workspace         ➔ ] │
│  Trusted by 45,000+ teams            │   🔒 256-bit SSL • SOC2 Type II      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure (`<main>`, `<section>`, `<header>`, `<form>`, `<dialog>`, ARIA tags). |
| **CSS3** | Custom design tokens, radial gradient glows, glassmorphism (`backdrop-filter`), CSS Grid & Flexbox. |
| **Vanilla JavaScript (ES6+)** | IIFE-scoped controller, DOM events, input validation, focus trapping, storage sync. |
| **Google Fonts** | `Plus Jakarta Sans` (headlines & CTA buttons) + `Inter` (body, labels & form inputs). |
| **Inline SVGs** | 100% self-contained vectors (brand logo, Lucide icons, Google, GitHub, eye toggles). |

> **Zero Frameworks**: No React, Next.js, Bootstrap, Tailwind, or external icon libraries.

---

## 📁 Project Structure

```
Day 3 loginand sign page/
├── index.html        # Complete semantic HTML5 markup & inline SVG favicon
├── styles.css        # Modular design tokens, animations, and responsive rules
├── script.js         # Client-side controller (validation, modal, strength meter)
└── README.md         # Documentation, architecture, and demonstration guide
```

---

## 📱 Responsive Design

The interface is engineered and tested across 7 responsive breakpoints:

| Breakpoint | Viewport Target | Visual Adaptation |
|---|---|---|
| **≥ 1440px** | Large Desktops / Ultrawide | Generous 2-column layout, elevated brand container, large display typography. |
| **≤ 1200px** | Standard Desktop Monitors | Proportional padding and balanced column scale. |
| **≤ 1024px** | Laptops / Small Displays | Compact margins, balanced 1fr / 1.15fr grid. |
| **≤ 768px** | Tablets (iPad Portrait) | Single column; brand transforms into an upper banner; auth card centers cleanly. |
| **≤ 480px** | Mobile Landscape / Phablet | Brand panel gracefully collapses; sleek top logo banner appears above auth card. |
| **≤ 425px** | Large Mobile (iPhone Plus/Max) | Tailored card padding, stacked modal buttons, bottom-docked toasts. |
| **≤ 375px** | Standard Mobile (iPhone SE/14) | 46px touch targets, compact form groups, zero horizontal overflow. |
| **≤ 320px** | Small Mobile Devices | Single-column strength checklist, compact social buttons. |

---

## 🚀 Getting Started

### Method 1: Direct File Launch
Simply double-click `index.html` in your file explorer to open it in your browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local HTTP Server

```bash
# Clone or navigate to the project directory
cd "Day 3 loginand sign page"

# Option A: Using Python 3
python -m http.server 8000

# Option B: Using Node.js (npx)
npx serve .
```

Open your browser and navigate to:
```
http://localhost:8000
```

---

## ♿ Accessibility & Security (QA Audit)

* **WCAG 2.1 AA Compliant**: All form error messages use `#dc2626` (4.9:1 contrast ratio against white).
* **Keyboard Navigation**: Complete Tab/Shift+Tab navigation with visible `:focus-visible` outline rings.
* **WAI-ARIA Dialog Trap**: The Forgot Password modal prevents background tab leakage and restores focus on close.
* **XSS Defense**: Untrusted user inputs (names, emails) are written strictly via `textContent` rather than `innerHTML`.
* **Safe Storage**: Passwords and sensitive credentials are **never stored** in `localStorage` or `sessionStorage`.
* **Explicit Prototype Notice**: All successful demo submissions and social sign-in clicks display clear notices that no backend server was contacted.

---

## 🎬 45–60 Second YouTube Demonstration Script

| Timestamp | Screen Action | What to Highlight |
|---|---|---|
| **0:00 – 0:08** | **Desktop Overview** | Showcase the split-screen layout: ambient radial gradient orbs, geometric NEXORA logo, product benefits, and glassmorphic testimonial card. |
| **0:08 – 0:16** | **Tab View Switching** | Click *"Create Account"* on the pill switcher; watch the indicator slide to the Signup view. Click *"Already have an account? Log in"* to return. |
| **0:16 – 0:26** | **Validation & Password Toggle** | Click *"Sign In"* with empty fields to show accessible crimson error states. Enter a password and click the eye button to toggle plaintext visibility. |
| **0:26 – 0:38** | **Password Strength Meter** | In Signup, type `demo` (Weak/Red) → `Demo123` (Medium/Amber) → `Demo123!@#` (Strong/Green) while showing the 4 criteria checkmarks light up. |
| **0:38 – 0:48** | **Forgot Password & Toasts** | Click *"Forgot password?"* to showcase the modal dialog with focus trapping and demo link simulation. Click Google/GitHub for toast feedback. |
| **0:48 – 0:60** | **Mobile Responsiveness** | Resize to 375px in DevTools; demonstrate the compact brand header, full-width touch targets, zero horizontal scrolling, and final submission loading spinner. |

---

## 📄 License

This project is part of the **100 Web Development Projects Challenge** and is licensed under the [MIT License](https://opensource.org/licenses/MIT).
