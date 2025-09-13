# 🦸 Superheroes App — Root-First Full-Stack Guide

This repository is a full-stack app that already **runs from the project root** using root-level npm scripts.

- **server/** — Node.js + Express API (Supabase: Postgres + Storage)
- **client/** — React (Vite) frontend
- **Root** — npm workspaces + scripts to start both parts together

---

## ✅ Prerequisites

- Node.js v18+ (v20 recommended) & npm 8+
- Git
- Supabase account (free tier is OK)
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - Storage bucket (e.g., `images`)

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```
PORT=4000

SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_BUCKET=hero-images
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:4000
```

---

## 📦 Repository Structure

```
superheroes/
├── client/                     # frontend (React / Vite)
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
├── server/                     # backend (Express + Supabase)
│   ├── config/                 # supabase.js, app config
│   ├── middleware/             # error, validate
│   ├── modules/                # features (superheroes, uploads)
│   ├── schemas/                # SQL init scripts
│   ├── utils/
│   ├── index.js                # server entry
│   └── package.json
├── package.json                # root package (workspaces / scripts)
├── .gitignore
└── README.md
```

---

## 🏃 Run from Root

From the repository **root**:

```bash
#clone repo from Git Bash
git clone https://github.com/ReEyDaAng/superheroes
cd superheroes

# install all deps for server and client via npm workspaces 
cd client
npm install
npm test

cd ..
cd server
npm install
npm test

# start both server (3000) and client (5173) together in superheroes folder
cd ..
npm run dev

---

## 🔌 Supabase Setup (DB + Storage)

1. Create/open project → **Settings → API** → copy `Project URL` and `service_role` key.
2. **Storage** → Create bucket: `hero-images` (recommended: private).
3. **DB schema** → SQL Editor → run `server/schemas/sql-init.sql` (if present).

---

## 🔗 API Endpoints (Backend)

```
GET    /superheroes
GET    /superheroes/:id
POST   /superheroes
PUT    /superheroes/:id
DELETE /superheroes/:id

POST   /upload-image     # multipart/form-data, field: file; optional body: heroId
```

**cURL examples**
```bash
curl -X POST http://localhost:3000/superheroes \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Batman","real_name":"Bruce Wayne","origin_description":"Gotham vigilante"}'

curl -X POST http://localhost:3000/upload-image \
  -F "heroId=h1" \
  -F "file=@./pic.png"
```

---

## ✍️ Authors

- Maxim Pilipushko (Максим Пилипушко)
