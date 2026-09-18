# DevOps Runbook — CK Capital

Hosting: Coolify 4.x at `https://coolify.fundedproptraders.com`
Server: single host `178.105.229.60` (Traefik proxy, Let's Encrypt TLS)
Repo: `https://github.com/kimjoshuadr/ck-capital-website` (private)

## Environments

| Env | Branch | Coolify app | UUID | URL | Access |
|---|---|---|---|---|---|
| Production | `main` | `ckcapital-production` | `lde1gmseo79pejezzekzbiw0` | `https://ckpropfirm.com` | public |
| Staging | `staging` | `ckcapital-staging` | `ls2g8t0l5oulspny65epyvxx` | `https://staging.ckpropfirm.com` | HTTP Basic Auth (`ckstaging` / see Coolify) |

Both apps: build pack **dockerfile**, port `3000`, auto-deploy enabled (push to the branch deploys).

## Deploy flow

1. Push to `staging` → Coolify builds/deploys staging → GitHub Actions runs the **staging smoke test** (Playwright against the staging URL with basic-auth creds from GH secrets).
2. Merge `staging` → `main` → production deploys automatically.
3. CMS publish events trigger `POST /api/revalidate` (Strapi webhook) → ISR caches purged instantly; otherwise content refreshes within 5 min via ISR.

## Environment variables (set in each Coolify app)

| Key | Value |
|---|---|
| `STRAPI_BASE_URL` | `https://cms.fundedproptraders.com` |
| `STRAPI_API_TOKEN` | read-only Strapi token (rotate separately per env if desired) |
| `REVALIDATE_SECRET` | strong random value; must match the Strapi webhook header |

Never commit env files — `.env*` is gitignored and excluded from the Docker build.

## Staging access

Staging is protected by Coolify's built-in HTTP Basic Auth
(`is_http_basic_auth_enabled` + username/password on the staging app). Credentials
are stored in Coolify — share them only with the small review group. The CI smoke
test uses `STAGING_BASIC_AUTH` (format `user:pass`) from GitHub secrets.

## GitHub secrets (CI)

- `STAGING_URL` — `https://staging.ckcapital.co.uk`
- `STAGING_BASIC_AUTH` — `user:pass` for the staging basic auth

## DNS / TLS

A records (set at the DNS provider):
- `ckpropfirm.com` → `178.105.229.60`
- `www.ckpropfirm.com` → `178.105.229.60`
- `staging.ckpropfirm.com` → `178.105.229.60`

Traefik issues Let's Encrypt certificates automatically once DNS resolves. If the
domain sits behind Cloudflare, either proxy through Cloudflare to the origin IP or
add the records as DNS-only.

## Useful Coolify API calls (token in a password manager, not in the repo)

```bash
# deploy an app
curl -X POST -H "Authorization: Bearer $COOLIFY_TOKEN" -H "Content-Type: application/json" \
  https://coolify.fundedproptraders.com/api/v1/deploy -d '{"uuid":"<app-uuid>","force":true}'

# app status
curl -H "Authorization: Bearer $COOLIFY_TOKEN" \
  https://coolify.fundedproptraders.com/api/v1/applications/<app-uuid>
```

## Rotating secrets

- Strapi token / `REVALIDATE_SECRET`: edit the Coolify app env var, then redeploy
  and update the Strapi webhook header accordingly.
- Staging basic auth: update the staging app's `http_basic_auth_username`/`password`
  in Coolify and the `STAGING_BASIC_AUTH` GitHub secret together.

## Repo artifacts

- `Dockerfile` — multi-stage `node:22-alpine`, `output: standalone`, healthcheck
- `.github/workflows/ci.yml` — typecheck + build on PR/push; staging smoke on `staging`
- `tests/smoke.spec.ts` — route 200s, key sections, theme toggle, basic-auth guard
- `docs/strapi-cms.md` — CMS schema/setup reference
