# CodeRabbit TypeScript CI-only validation pilot

Currently stacked on RepoKan/virtual-universe-26 PR #11 at immutable base `1eeecdf9abbb90282a6e063ef605ff00ddd1b2bc`.
The first PR #12 CI commit was originally based on `7fc5f6280f4eba82afd0e5f464ead40f25bab3da`;
that historical parent remains preserved in the PR commit graph and is not the current base.
No configuration changes: only the workflow, isolated SDK invocation and
deterministic regression cases are added in this draft branch.

The workflow checks the **official** `@coderabbitai/config@1.2.0` SDK
and `typescript@7.0.2`, with scripts disabled and a temporary dependency
directory, on the actual committed `.coderabbit.config.ts`. The validator's
direct dependencies are declared in `.github/governance/package.json` and
must be installed from the committed `.github/governance/package-lock.json`
with `npm ci`. It verifies Docs7-only CHILL, mixed/other ASSERTIVE,
fail-closed unavailable inventory, both review instructions, global risk caps,
and 31 disabled sensitive paths.

A committed and independently reviewed dependency lock is required before this
CI can be promoted as reproducible trusted enforcement. Even with that lock,
this CI is NOT independent enforcement until it is adopted into a separately
reviewed protected baseline. The test scenarios are local TypeScript factory
checks and not live CodeRabbit approval decisions. Network, schema, lockfile,
integrity or type failures FAIL rather than skip. No GitHub ruleset, human
review, CODEOWNERS, permissions or merge is altered. PR #10 must remain open
and unchanged pending a separate disposition.
