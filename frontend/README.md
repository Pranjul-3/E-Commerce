# Meridian storefront

React frontend for the E-Commerce microservices. It talks only to the API gateway; the backend is unchanged.

## Run

1. Start the backend from `../deployment`, as described in the root README.
2. `npm install`
3. `npm run seed` adds the demo catalogue (safe to re-run).
4. `npm run dev`, then open http://localhost:5173

The dev server proxies `/api` to `localhost:8080`, so no CORS setup is needed.

## Structure

- `src/app`: providers, router, layout, error handling
- `src/pages`: one folder per route, lazy loaded
- `src/features`, `src/entities`: user actions and product presentation
- `src/shared/api`: typed endpoints and React Query hooks
- `src/shared/slices`: all Redux state (auth, cart, toast)
- `src/shared/ui/reusablecomponent`: the UI kit
- `src/shared/config/constants`: all interface text

To swap the derived artwork and categories for real data, change `src/entities/product/catalog.ts`.

## Security notes

- The JWT is held in `sessionStorage`, so it ends with the tab, and is cleared on sign-out or a 401.
- Production builds ship a strict Content-Security-Policy, no source maps and no logging.
- The cart stores only ids and quantities; prices and stock always come from the API.

Production hosting needs `VITE_API_BASE_URL` in `.env.prod`, and CORS on the gateway that exposes the `Authorization` header.
