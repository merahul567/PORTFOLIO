# KumarRahul.in UI

Vite + React frontend for KumarRahul.in. The application uses React Router, route-level lazy loading, browser-safe environment variables, SEO metadata, TradingView widgets, and a Spring Boot static-resource copy step.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` writes the production bundle to `build/` and copies it to `../portfolio-services/src/main/resources/static/` for the existing Spring Boot packaging flow.

## Routes

- `/`
- `/today`
- `/markets`
- `/tools`
- `/tools/:slug`
- `/ai`
- `/insights`
- `/about`

The legacy `/blog` and `/contact` paths redirect to their current destinations. Unknown paths render the not-found page.

## Environment

Copy `.env.example` to `.env.local` for local overrides:

- `VITE_API_BASE_URL`: browser-safe API base URL. Defaults to `/api/`.
- `VITE_GA_MEASUREMENT_ID`: optional Google Analytics measurement ID.

Only values intended for browser exposure may use the `VITE_*` prefix. Private API keys belong in the backend service.

## Deployment

The app uses browser history routing. Production hosting must serve `index.html` for client routes. The existing Spring Boot `SpaController` provides that fallback when the UI is served by the backend.
