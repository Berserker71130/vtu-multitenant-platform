# Multi_Tenant VTU Reseller Platform

A modern, full-stack multi-tenant Virtual Top-Up (VTU) platform where entrepreneurs and sub-sellers can instantly spin up branded storefronts to sell mobile data, airtime and utility services to their own customers.

## Features

- **Multi-Tenant Architecture:** Independent storefronts driven by tenant detection and custom branding.
- **Customizable Storefronts:** Resellers can personalize their store logo, brand colors and site titles.
- **Flexible Markup Pricing:** Resellers set independent profit margins on top of base API plans.
- **Reseller Dashboard:** Real-time tracking of sales volume, profit margins, customer base, wallet balances and transaction history.
- **Super-admin Panel:** Global platform control to approve/suspend resellers, manage base utility plans and monitor platform-wide analytics.
- **Strict Data Isolation:** Built with robust database partitioning and Row Level Security (RLS) to ensure customer records, wallets and orders remain strictly siloed per tenant.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database & Auth:** Supabase (PostgreSQL, RLS, SSR Auth)
- **Styling:** Tailwind CSS / UI Components
- **Deployment:** Vercel

## Getting Started Locally

1. **Clone the repository:**
   git clone [https://github.com/Berserker71130/vtu-multitenant-platform.git]

**Install dependencies:**
npm install

**Set up environment variables:**
Create a .env.local file in the root directory and add the supabase credentials
NEXT_PUBLIC_SUPABASE_URL=supabase_url
BASE_ANON_KEY=supabase_anon_key

**Run the development server:**
npm run dev

Open http://localhost:3000 in your browser to view the platform
