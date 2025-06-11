# Bandjax

Bandjax is a fitness‐focused web application that encourages friendly competition among groups ("sections"). Each section logs exercises, earns points, and climbs a leaderboard either by total points or average points per member to motivate users to stay active and engaged.

## 🚀 Tech Stack

- **Framework:** Next.js 15.3.2 (App Router, RSC)
- **Language:** TypeScript, React 19
- **UI:** Tailwind CSS, shadcn/ui (Radix primitives), Lucide icons, Sonner toasts
- **Auth & User Management:** Clerk (Next.js SDK)
- **Database & ORM:** PostgreSQL, Drizzle ORM + drizzle-kit migrations

## 📖 Features

- **Section Leaderboards:** Compare groups by total or average scores.
- **Exercise Logging:** Assign point values per minute/repetition; real‐time score updates.
- **User Profiles:** Avatar display, section membership lookup.
- **Scoring Modes:** Toggle between Total Score Mode and Average Score Mode for fair play.
- **Section Profiles:** Set a bio, profile image, and linked instagram account for each section.

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥18
- PostgreSQL database
- Clerk account (publishable & secret keys)

### Development

1. Clone & install
   ```bash
   git clone https://github.com/your-org/bandjax.git
   cd bandjax
   npm install
   ```
2. Copy & configure env
   ```bash
   cp .env.example .env
   # Fill in NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, DATABASE_URL
   ```
3. Run migrations
   ```bash
   npx drizzle-kit migrate
   ```
4. Start dev server
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

### Production

1. Build
   ```bash
   npm run build
   ```
2. Run migrations against your production database
   ```bash
   npx drizzle-kit migrate
   ```
3. Start
   ```bash
   npm start
   ```
4. Ensure environment variables are set in your host (DATABASE_URL, CLERK keys, etc.)

## 🤝 Contributing

We love contributions! Please follow these guidelines:

1. Fork the repo and create a feature branch
   ```
   git checkout -b feat/your-feature
   ```
2. Follow code style:
   - Run `npm run lint`
   - Format with `npm run format`
3. Write tests where applicable
4. Commit using conventional commits:
   ```
   feat: add new leaderboard filter
   fix: correct average score calculation
   ```
5. Open a Pull Request describing your changes

## 📝 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2025 April Hall

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
