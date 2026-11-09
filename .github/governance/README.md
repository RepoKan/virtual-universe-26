# CodeRabbit TypeScript CI-only validation pilot

Stacked on RepoKan/virtual-universe-26 PR #11 at immutable head `7fc5f6280f4eba82afd0e5f464ead40f25bab3da`.
No configuration changes: only the workflow, isolated SDK invocation and
deterministic regression cases are added in this draft branch.

The workflow checks the **official** `@coderabbitai/config@1.2.0` SDK
and `typescript@7.0.2`, with scripts disabled and a temporary dependency
directory, on the actual committed `.coderabbit.config.ts`. It verifies
Docs7-only CHILL, mixed/other ASSERTIVE, fail-closed unavailable inventory,
both review instructions, global risk caps, and 31 disabled sensitive paths.

Until the dependencies are reproducibly locked and this CI is adopted into
a separately reviewed protected baseline, it is NOT independent enforcement.
The test scenarios are local TypeScript factory checks and not live CodeRabbit
approval decisions. Network, schema, or type failures FAIL rather than skip.
No GitHub ruleset, human review, CODEOWNERS, permissions or merge is altered.
PR #10 must remain open and unchanged pending a separate disposition.
