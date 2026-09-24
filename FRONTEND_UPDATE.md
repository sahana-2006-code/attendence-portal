# Frontend update

The frontend has been redesigned into a simple, responsive campus attendance application.

Updated areas:
- Student dashboard with attendance overview, subject breakdown and recent history
- Student QR attendance screen with clearer camera/location states
- Faculty dashboard with overview cards and quick actions
- Faculty subject management form and subject cards
- Faculty attendance session flow with location, QR and expiry information
- Faculty attendance report with session selection, summary and student table
- Login and registration screens
- Shared desktop sidebar, top bar and mobile navigation

Backend/API, authentication, QR scanning, GPS verification and attendance business logic were kept intact.

## Run locally

From `frontend`:

```bash
npm install
npm run dev
```

From `backend`:

```bash
npm install
npm run dev
```

The backend `.env` file is intentionally not included in this package. Keep your existing local `.env` file in `backend/`.
