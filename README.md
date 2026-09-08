# Asset Allocation Calculator

A small single-page app that splits a USD amount 70/30 into BTC and ETH using live Coinbase exchange rates, built with Vue 3, TypeScript, and Vite.

## Setup and run

```bash
npm install       # install dependencies
npm run dev       # start the local dev server
npm run test      # run the unit test suite
```

Other scripts:

```bash
npm run build     # type-check and produce a production build
npm run preview   # preview the production build locally
npm run lint      # lint and auto-fix with ESLint
npm run format    # format src/ with Prettier
```

## Architecture

The code is split into three layers by responsibility:

- **`src/utils/`** — pure, framework-agnostic functions (`calculateAllocation`, the formatters). No Vue imports, no side effects, no network calls. This is what makes the money math independently unit-testable with Vitest, without mounting a component or touching the DOM.
- **`src/composables/`** — stateful, side-effecting logic (`useExchangeRates`: fetching, reactive `rates`/`loading`/`error`/`updatedAt` state, the `onMounted` fetch-on-load behavior). This is where Vue reactivity and the Coinbase API call live, decoupled from how that data gets rendered.
- **`src/components/`** — the view layer. `CurrencyInput` and `AllocationResult` are small, presentational, reusable components with no business logic of their own — they just render props and emit events. `AllocationCalculator` is the one component that wires everything together: it calls the composable for rates, holds the USD input, and derives the split via a `computed()` over `calculateAllocation()`.

The payoff of this split: the calculation logic can change (say, a different split ratio or an extra asset) without touching a single `.vue` file, and the fetch logic can be swapped or mocked without touching the math.

## Design decisions

The wireframe I was given was explicitly scoped as a rough content/structure reference, not a high-fidelity visual target. Given that, I deliberately diverged from its two-column split (input on the left, results on the right) and built a single unified column instead — title, subtitle, input, proportion bar, and both result cards all read as one contained instrument. A two-column layout splits attention across the page and doesn't hold up well at narrow widths without extra breakpoint work; a single column reads faster and needed no compromise for mobile.

## Trade-offs given time constraints

Things I deliberately did not build, and why:

- **No E2E tests.** Only the pure functions in `utils/` have automated tests. Component and full-flow behavior (loading state, typing, validation, retry) was verified manually via a scripted headless-browser pass during development, not committed as a repeatable E2E suite. Setting up Playwright/Cypress with fixtures for the live Coinbase API (or mocking it) was more infrastructure than the scope justified here.
- **No rate polling/auto-refresh.** Rates are fetched once on mount, plus a manual retry on failure. There's no `setInterval`-based refresh with the cleanup-on-unmount and rate-limit handling that would require — a static fetch was enough to demonstrate the pattern.
- **No currency selector beyond BTC/ETH.** The 70/30 BTC/ETH split is hardcoded as `BTC_WEIGHT`/`ETH_WEIGHT` constants. Generalizing to an arbitrary asset list and configurable weights would touch the types, the composable, and the calculation function, which was out of scope for a fixed two-asset calculator.
- **No persistence.** The entered USD amount resets on page reload; nothing is written to `localStorage`.
- **No i18n.** Currency formatting is hardcoded to `en-US` via `Intl.NumberFormat`.
- **No dark mode / theming system.** Colors are literal hex values, not CSS custom properties, so there's a single fixed light palette.
- **Coarse error handling.** Every fetch failure (network error, non-2xx, unexpected response shape) collapses to one generic "Unable to load exchange rates" message rather than distinguishing offline vs. server error vs. malformed response.

What I'd add with more time:

- An E2E suite (Playwright) covering the real user flow end to end, including a mocked API failure/retry path.
- Interval-based rate refresh with a visible "stale" indicator once rates age past some threshold.
- A generalized asset list with a configurable split, instead of hardcoded BTC/ETH weights.
- Component-level tests (Vue Test Utils) for `CurrencyInput`, `AllocationResult`, and `AllocationCalculator`, not just the pure utils.
- `localStorage` persistence of the last-entered amount.
