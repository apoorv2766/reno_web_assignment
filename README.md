# Reno Notice Board

Notice Board CRUD application built with the required stack:
- Next.js Pages Router
- Prisma
- Hosted MySQL-compatible database (TiDB Cloud recommended)

## Features

- Create, read, update, and delete notices
- Server-side validation inside API routes
- Urgent-first ordering enforced in Prisma query
- Responsive card-based list for mobile and desktop
- Edit/Delete actions on each notice card
- Delete confirmation flow
- Optional image URL per notice

## Tech Stack

- Next.js 16 (Pages Router via pages/)
- TypeScript
- Prisma ORM
- Tailwind CSS

## Notice Fields

- title (required)
- body (required)
- category (Exam, Event, General)
- priority (Normal, Urgent)
- publishDate (required valid date)
- imageUrl (optional)

## API Routes

- GET /api/notices
- POST /api/notices
- GET /api/notices/:id
- PUT /api/notices/:id
- DELETE /api/notices/:id

Mutating operations are implemented through pages/api/ routes with appropriate HTTP methods and status codes.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
copy .env.example .env
```

3. Update DATABASE_URL in .env to your hosted MySQL-compatible database.

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Create and apply migration:

```bash
npx prisma migrate dev --name init_notice_board
```

6. Start development server:

```bash
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import repository in Vercel.
3. Add environment variable DATABASE_URL in Vercel project settings.
4. Build command can remain default (npm run build).
5. Ensure database schema is migrated for production using Prisma migrate deploy during release flow.
6. Verify app opens publicly without login.

## One Improvement With More Time

Add authenticated admin access and rich text editor support with image upload to object storage, replacing plain image URL entry.

## AI Usage Disclosure

AI assistance was used to:
- draft implementation structure and endpoint contracts,
- speed up initial component and API boilerplate,
- refine validation and README phrasing.

All code paths, data model decisions, API behavior, and assignment-rule compliance were manually reviewed and adjusted.

## Submission Links

- Live app: https://reno-web-assignment.vercel.app/
- GitHub repo: https://github.com/apoorv2766/reno_web_assignment
