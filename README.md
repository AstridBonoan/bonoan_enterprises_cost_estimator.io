# Bonoan Enterprises Project Cost Estimator

An interactive, non-binding project estimate tool for website and SaaS leads. Built
with React 19, TypeScript, Vite, Tailwind CSS 3, and Formspree.

## Local development

```bash
npm install
npm run dev
```

Run the same checks used by GitHub Actions:

```bash
npm run check
```

## Change pricing

All project base prices, reference tiers, add-on prices, range percentage, and
rounding are in `src/data/estimatorConfig.ts`. Edit that file to change pricing
without touching the estimator UI.

The estimator starts at the selected project type's base price, adds each selected
feature, and displays a range of about ±10% around the recommended offer. Add-on
prices are tuned so selecting every option reaches — but does not exceed — the
Advanced package price:

- Website Creation: **$500 – $1,200**
- SaaS Tools: **$1,000 – $3,200**

## Connect Formspree

The lead form submits to the Bonoan Enterprises Formspree endpoint
(`https://formspree.io/f/mrenqoza`) via `@formspree/react`. To change it, update
the form ID in `src/components/CostEstimator.tsx`:

```ts
useForm('mrenqoza')
```

The form sends the lead's contact information, message, selected scope, displayed
range, and recommended offer.

## GitHub Pages: Deploy from a branch

The Vite base path is already configured for:

`https://astridbonoan.github.io/bonoan_enterprises_cost_estimator.io/`

On every push to `main`, GitHub Actions:

1. Runs lint, tests, and the production build.
2. Publishes the verified `dist` output to an orphan `gh-pages` branch.

After the first successful **Publish GitHub Pages branch** workflow:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the **gh-pages** branch and **/(root)** folder, then save.

The separate **CI** workflow also reports lint, test, and build results on pushes
and pull requests.
