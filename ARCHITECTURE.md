# Architecture

## Application flow

```text
                 ┌─────────────────────┐
                 │      User           │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Login / Auth UI    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Dashboard / UI    │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        Search/Filter     CRUD        Statistics
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                 ┌─────────────────────┐
                 │ JavaScript State    │
                 └──────────┬──────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Browser LocalStorage│
                 └─────────────────────┘
```

## Deployment architecture

```text
GitHub Repository
       │
       ▼
Vercel / Netlify / Cloudflare Pages
       │
       ▼
Public HTTPS Website
```

## CRUD mapping

| Operation | Implementation |
|---|---|
| Create | Add Product form |
| Read | Product catalog |
| Update | Edit button |
| Delete | Delete button |
| Persist | LocalStorage |

## Production upgrade path

For a true multi-user production system, replace LocalStorage with a backend API and database, add secure authentication, authorization, validation, logging and environment-managed secrets.
