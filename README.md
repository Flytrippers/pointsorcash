# Points or Cash

One-page Jekyll site for the PointsOrCash calculator.

## Data Flow

- WordPress (Flytrippers) remains the source of truth for point valuations.
- The Flytrippers card data plugin writes a public static JSON file after card data updates.
- The GitHub Action in `.github/workflows/sync-valuations.yml` pulls that file daily and on demand.
- The action commits `assets/data/points-valuations.json` only when the normalized JSON changes.
- The public site reads only the local static JSON file.

## Source JSON

`https://flytrippers.com/wp-content/uploads/flytrippers-card-data/pointsorcash-valuations.json`

## Local Development

```bash
bundle exec jekyll serve
```

The calculator can also be opened through any local static server, but Jekyll is preferred so Liquid comments and layouts are processed correctly.

## Deployment

Push to `main`. GitHub Actions builds and deploys the site to GitHub Pages.
