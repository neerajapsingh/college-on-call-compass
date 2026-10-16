# College On Call — Website (React + Vite)

Frontend for the College On Call public website. Backend is a **separate PHP REST API + MySQL** (XAMPP/Apache). This repo contains no backend and never fakes API success.

## Setup
1. `cp .env.example .env` and set `VITE_API_BASE_URL` to the PHP API.
2. `npm i && npm run dev` (dev) or `npm run build` → serve `dist/` via Apache with SPA fallback to `index.html`.
Without `VITE_API_BASE_URL`, pages show honest "not connected" error states and forms refuse to claim success.

## Response envelope (all endpoints)
`{ "success": true, "data": ..., "meta": { "page", "per_page", "total", "total_pages" }, "message"?, "errors"?: { field: msg } }`

## Public endpoints the frontend calls (NOT yet implemented)
| Method | Path | Notes |
|---|---|---|
| GET | /api/universities/ | q, category (comma list), course, mode, location, partner (1/0), exclude_government, featured, institution, page, per_page |
| GET | /api/universities/{slug} | Institution detail |
| GET | /api/courses/ | q, category, mode, level, institution, page, per_page |
| GET | /api/courses/{slug} | Course detail |
| GET | /api/blog/ , /api/blog/{slug} | category (comma list), exam, page |
| POST | /api/enquiries/ | Must return `data.id` only after the MySQL insert succeeds |

## Admin CRM (built: /admin/login, dashboard, leads, leads/:id, followups, universities, colleges, courses, reports, settings)
All admin pages call these endpoints; no data is shown until the server responds.

## Admin endpoints
/api/auth/login, /logout, /me · /api/admin/leads/ (list, {id}, {id}/status, {id}/notes) · /api/admin/followups/ · /api/admin/reports/ · /api/admin/settings/ · POST/PUT/DELETE on /api/universities/ and /api/courses/.
Lead pipeline: new, contacted, counselling_done, converted, not_interested.

## XAMPP backend starter (`backend/`)
1. Import `backend/schema.sql` in phpMyAdmin (creates tables only — no sample data).
2. Copy `backend/api` to `C:\xampp\htdocs\collegeoncall-api`, copy `config.sample.php` to `config.php`, set DB credentials and allowed origins. Requires PHP 8.1+ and mod_rewrite.
3. Create the first admin (see bottom of schema.sql), then set `VITE_API_BASE_URL=http://localhost/collegeoncall-api` and rebuild.
Extra admin routes used: GET `/api/admin/reports/dashboard`, GET/PATCH `/api/admin/universities/`, GET `/api/admin/courses/`, PATCH `/api/admin/followups/{id}`.
**Untested:** these PHP files were written without a PHP/MySQL server available; test locally before going live.

## Server-side requirements
- PDO prepared statements only; validate every field server-side (same rules as the client: 10-digit Indian mobile, required fields, length caps).
- Never return regular/campus fees from public endpoints; exclude government institutions when `exclude_government=1`.
- Sessions: HttpOnly, Secure, SameSite=Lax cookies; regenerate ID on login; password_hash/verify.
- CSRF token for every admin write (`X-CSRF-Token` header); authorization checked on every admin endpoint.
- Rate-limit enquiries and login by IP/mobile; reject the hidden `website` honeypot field when filled.
- Duplicate enquiries (same mobile within a window): return success with `duplicate: true` and the existing id.
- CORS restricted to the site origin with credentials; generic error messages (no stack traces).
- Indexes: leads(mobile, created_at, status), institutions(slug UNIQUE, category, is_government), courses(slug UNIQUE, mode, institution_id).
- Store consent text + timestamp with each enquiry.

## SEO
Per-page title/description/canonical via `Seo` component; JSON-LD only from real data. Plan: backend-generated `sitemap.xml`; robots.txt disallows `/admin`.
