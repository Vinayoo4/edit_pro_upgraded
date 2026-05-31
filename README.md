# SALTEDHASH: Vegan Meal Planning Hub

Welcome to the **Vegan Meal Planning Hub**, a Progressive Web App (PWA) that provides curated weekly vegan meal plans, smart grocery lists, and rich recipe tracking.

## Features

- **Weekly Plans:** Browse curated basic and premium vegan meal plans.
- **Recipe Tracking:** Step-by-step instructions with ingredient checklists. Mark meals as "Planned" or "Cooked".
- **Smart Grocery List:** Automatically aggregates ingredients for all your planned meals, grouped by category.
- **Offline Mode:** As a PWA, the app works entirely offline! Cached plans, recipes, and your meal progress are saved securely to your device using `localforage`.
- **Premium Membership:** Upgrade to Green Member for access to all premium plans and features.
- **Admin Dashboard:** Seed and manage plans and recipes.

## Getting Started

First, install the dependencies with `npm install` and start the server with `npm run start`.
Open `http://localhost:5173` to view it in the browser.

## Authentication & Default Users

The application simulates authentication using a local store.

**Demo User:**
- Email: `demo@example.com`
- Password: `password`
- Role: Basic user

**Admin User:**
- Email: `admin@example.com`
- Password: `admin`
- Role: Premium user with Admin access

## Routes Overview

- `/login` - Login portal.
- `/dashboard` - Overview of your active plan, weekly progress, and cooking streak.
- `/plans` - Browse all available weekly meal plans.
- `/plan/:id` - View details and recipes for a specific weekly plan.
- `/recipe/:id` - Detailed recipe instructions, ingredients, and tracking toggles.
- `/groceries` - Aggregate grocery list generated from your planned meals.
- `/membership` - View and upgrade your membership tier.
- `/profile` - User profile, statistics, and favorite recipes.
- `/admin` - (Admin Only) Manage plans, recipes, members, and seed mock data.

## Data Management & Premium Activation

- **Activate Premium:** Simply visit the `/membership` route and click "Activate Premium" to upgrade your user tier and unlock all plans.
- **Reset Data:** If you need to start fresh, go to the `/admin` route under the "Settings" tab and click "Reset Seed Flag & Clear Data".
- **Offline Capability:** You can install the app on your mobile or desktop device to access recipes without internet.
