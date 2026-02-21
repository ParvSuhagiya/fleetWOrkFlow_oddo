import React from 'react';

/**
 * Component Index & Architecture Guide
 * 
 * This file documents the component structure and import paths
 * for the Professional Fleet Management Dashboard
 */

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

/**
 * Main Layout Wrapper - Combines all layout elements
 * Path: src/components/Layout.jsx
 * 
 * Usage:
 *   <Layout title="Dashboard">
 *     {children}
 *   </Layout>
 */
import Layout from './components/Layout';

/**
 * Sidebar Navigation - Fixed left navigation with menu
 * Path: src/components/Sidebar.jsx
 * Features:
 *   - Fixed 256px width
 *   - Dark theme (#111827)
 *   - 7 menu items with icons
 *   - Active state highlighting
 *   - Smooth hover transitions
 */
import Sidebar from './components/Sidebar';

/**
 * Top Navbar - Professional header with user controls
 * Path: src/components/Navbar.jsx
 * Features:
 *   - Dynamic page title
 *   - Notification & settings icons
 *   - User info & avatar
 *   - Logout button
 *   - Sticky positioning
 */
import Navbar from './components/Navbar';

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

/**
 * Card Component - Wrapper for content sections
 * Path: src/components/Card.jsx
 * Props:
 *   - children: Card content
 *   - className?: Additional CSS classes
 *   - title?: Card header title
 *   - footer?: Card footer section
 * 
 * Usage:
 *   <Card title="Recent Trips">
 *     {content}
 *   </Card>
 */
import Card from './components/Card';

/**
 * Status Badge - Status indicator with different colors
 * Path: src/components/StatusBadge.jsx
 * Props:
 *   - status?: 'success' | 'warning' | 'danger' | 'info' | 'default'
 *   - children: Badge text
 *   - className?: Additional CSS classes
 * 
 * Usage:
 *   <StatusBadge status="success">Active</StatusBadge>
 *   <StatusBadge status="warning">Pending</StatusBadge>
 *   <StatusBadge status="danger">Failed</StatusBadge>
 */
import StatusBadge from './components/StatusBadge';

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

/**
 * Dashboard Page
 * Path: src/pages/DashboardPage.jsx
 * Features:
 *   - Welcome message
 *   - 4 stat cards
 *   - Recent trips table
 *   - Fleet health overview
 *   - Maintenance schedule
 */

/**
 * Drivers Page
 * Path: src/pages/DriversPage.jsx
 * Features:
 *   - Driver statistics
 *   - Driver profiles table
 *   - Safety ratings
 *   - Status indicators
 */

/**
 * Dispatch Page
 * Path: src/pages/DispatchPage.jsx
 * Features:
 *   - Trip statistics
 *   - Active trips table
 *   - Status tracking
 *   - Driver assignments
 */

/**
 * Reports Page
 * Path: src/pages/ReportsPage.jsx
 * Features:
 *   - Financial statistics
 *   - Financial summary table
 *   - Report types
 *   - Status indicators
 */

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const DesignTokens = {
  colors: {
    primary: 'blue-600',        // #2563eb
    success: 'green-500',       // #22c55e
    warning: 'yellow-500',      // #eab308
    danger: 'red-500',          // #ef4444
    sidebar: '#111827',         // gray-900
    background: '#F9FAFB',      // gray-50
    white: '#ffffff',
  },
  spacing: {
    cardPadding: 'p-6',
    sidebar: 'w-64',
    ml: 'ml-64',
  },
  typography: {
    rounded: 'rounded-xl',
    shadow: 'shadow-md',
  },
  transitions: {
    smooth: 'transition-all duration-200',
    hover: 'group-hover:scale-110',
  },
};

// ============================================================================
// DEPENDENCIES
// ============================================================================

/**
 * External Libraries:
 * - react: UI library
 * - react-router-dom: Client-side routing
 * - axios: HTTP client (API calls)
 * - lucide-react: Icon library
 * 
 * Dev Dependencies:
 * - tailwindcss: Utility-first CSS
 * - vite: Build tool & dev server
 * - postcss: CSS transformations
 */

// ============================================================================
// TAILWIND CSS CLASSES REFERENCE
// ============================================================================

const TailwindClasses = {
  layout: {
    sidebar: 'fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white',
    navbar: 'bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40',
    content: 'flex-1 overflow-auto bg-gray-50 p-8',
  },
  card: {
    wrapper: 'bg-white rounded-xl shadow-md overflow-hidden',
    padding: 'p-6',
    header: 'px-6 py-4 border-b border-gray-200 bg-gray-50',
  },
  badge: {
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
  },
  table: {
    header: 'border-b border-gray-200 text-left text-sm font-semibold text-gray-700',
    row: 'text-sm hover:bg-gray-50 transition-colors',
    cell: 'py-4 text-gray-900 font-medium',
  },
  button: {
    hover: 'hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors',
  },
};

// ============================================================================
// FILE STRUCTURE
// ============================================================================

const FileStructure = `
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          ⭐ Main layout wrapper
│   │   ├── Sidebar.jsx         ⭐ Left navigation
│   │   ├── Navbar.jsx          ⭐ Top bar with user controls
│   │   ├── Card.jsx            ⭐ Reusable card wrapper
│   │   ├── StatusBadge.jsx     ⭐ Status indicator
│   │   ├── ProtectedRoute.jsx
│   │   └── [other components]
│   ├── pages/
│   │   ├── DashboardPage.jsx   ⭐ Updated with new layout
│   │   ├── DriversPage.jsx     ⭐ Updated with new layout
│   │   ├── DispatchPage.jsx    ⭐ Updated with new layout
│   │   ├── ReportsPage.jsx     ⭐ Updated with new layout
│   │   ├── LoginPage.jsx
│   │   └── PlaceholderPages.jsx ⭐ Placeholder components
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx                ⭐ Console log added
│   └── index.css
├── tailwind.config.js
├── vite.config.js
├── package.json                ⭐ Updated with new deps
└── DASHBOARD_README.md         ⭐ Full documentation
`;

// ============================================================================
// QUICK START
// ============================================================================

const QuickStart = `
1. Navigate to frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start development server:
   npm run dev

4. Open browser and check console:
   ✅ Professional Layout Loaded Successfully

5. Navigate to http://localhost:5173
   Login → Dashboard with professional layout
`;

export { DesignTokens, TailwindClasses, FileStructure, QuickStart };
