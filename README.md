# URL Mapper Worker

Cloudflare Worker for URL mapping and redirects.

**Worker URL:** https://url-mapper.mvsteelgroup.workers.dev

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Login to Cloudflare:

    ```bash
    npx wrangler login
    ```

3. Get your Account ID and update `wrangler.toml`:

    ```bash
    npx wrangler whoami
    ```

4. Test locally:

    ```bash
    npm run dev
    ```

5. Deploy to production:
    ```bash
    npm run deploy
    ```

## Configuration

Edit `wrangler.toml` to configure your worker settings and add your Cloudflare account ID.

## Development

-   `npm run dev` - Start local development server
-   `npm run deploy` - Deploy to Cloudflare
-   `npm run tail` - View live logs from your worker
