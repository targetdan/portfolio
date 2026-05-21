# Dan Church-Wilsher — CV Site

A Next.js 14 single-page CV website built with the App Router, TypeScript, and CSS Modules.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
├── app/
│   ├── layout.tsx        # Root layout with fonts & metadata
│   ├── page.tsx          # Main page — composes all sections
│   └── globals.css       # Design tokens, animations, base styles
├── components/
│   ├── Nav.tsx           # Sticky nav with active section tracking
│   ├── Header.tsx        # Name, role, tagline, meta
│   ├── About.tsx         # Bio paragraph
│   ├── Experience.tsx    # Expandable job cards
│   ├── Skills.tsx        # Skill pills (core + secondary)
│   ├── Education.tsx     # Degree details
│   ├── Interests.tsx     # Interests paragraph
│   ├── Contact.tsx       # Email, phone, location links
│   └── Footer.tsx        # Copyright line
└── lib/
    └── cv-data.ts        # All CV content — edit this file to update
```

## Customising content

All CV content lives in **`lib/cv-data.ts`**. Edit that file to update any text, roles, skills, or contact details — no other files need to change.

## Deploying

The easiest option is [Vercel](https://vercel.com):

```bash
npm i -g vercel
vercel
```

Or build a static export:

```bash
npm run build
```
