# Docs7 starter

This folder contains the Docs7 configuration, introductory page, and GitHub/Copilot setup guide for RepoKan/virtual-universe-26.

## Pages

- `index.mdx`: repository introduction and learning links.
- `setup.mdx`: GitHub CLI, fork defaults, Copilot agent, Context7 connector, and skill instructions.
- `docs.json`: site identity and navigation.

## Code review

The root `.coderabbit.config.ts` selects the `chill` profile only when CodeRabbit resolves a nonempty changed-file list entirely under `docs7/`. Other changes, or unavailable changed-file metadata, select `assertive`.

For each pull request, inspect CodeRabbit's run configuration and review coverage at the latest head SHA. A successful review with no actionable comments is separate from a submitted approval and authorization to merge. Skipped or cancelled checks are not approvals.

GitHub integration authentication is separate from local CodeRabbit CLI authentication. Docs7 deployment checks do not verify Codespaces Prebuild readiness or installer execution.

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
