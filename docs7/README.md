# Docs7 starter

This folder contains the Docs7 configuration, introductory page, and GitHub/Copilot setup guide for RepoKan/virtual-universe-26.

## Pages

- `index.mdx`: repository introduction and learning links.
- `setup.mdx`: GitHub CLI, fork defaults, Copilot agent, Context7 connector, and skill instructions.
- `docs.json`: site identity and navigation.

## Local preview

Use Node.js 20.19 or newer. From the repository root:

```bash
npx -y @upstash/docs7 dev ./docs7 --port 4000
```

Open the address printed by the CLI. The first run downloads the renderer.

## Publish when ready

For a GitHub-backed site, choose RepoKan/virtual-universe-26 in the Context7 teamspace's Docs7 tab and set the docs path to `docs7`. Set the production branch deliberately; publication starts only after you choose Publish Site.

Alternatively, from this folder:

```bash
npx -y @upstash/docs7 login
npx -y @upstash/docs7 deploy
```

The deploy command publishes to production. Keep `.docs7/project.json` after publishing: it records which site subsequent deployments update. Keep authentication credentials out of Git.

Preparing this starter does not publish a site or authenticate a Context7 account.

Official reference: https://context7.com/docs/docs7/quickstart
