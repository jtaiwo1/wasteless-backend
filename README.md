# WasteLess Backend

Three Docker services: Express (public API), Python (dashboard analytics),
PostgreSQL (pantry records).

## Start locally

1. Copy `.env.example` to `.env` and choose your own database password.
2. Run `docker compose up -d --build`.
3. Visit `/health`, `/pantry`, or `/dashboard` on http://localhost.

`/charities` is a placeholder until Give Food integration is written.
The pantry currently supports GET only; implement the remaining CRUD routes next.
The Jenkins and Terraform files are starter placeholders, not a working deployment.

Express owns pantry CRUD, Give Food calls and matching. Python owns analytics.
Express communicates with Python using `http://wasteless-insights:8000`.
