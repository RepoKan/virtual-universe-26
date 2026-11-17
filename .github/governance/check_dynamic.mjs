import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const filename = process.argv[2];
assert.ok(filename, 'Usage: node check_dynamic.mjs compiled-config.js');
const { default: factory } = await import(pathToFileURL(resolve(filename)).href);
assert.equal(typeof factory, 'function', 'Expected a dynamic TypeScript factory');

const required = [
  '.coderabbit.config.ts', '.coderabbit.yaml', '.coderabbit.yml',
  '.github/**', '.github/workflows/**', '.github/CODEOWNERS',
  '.devcontainer/**', '.vscode/**', '.agents/**', '.copilot/**',
  'mcp_config.json', 'AGENTS.md', '**/AGENTS.md', 'CODEOWNERS',
  'docs/CODEOWNERS', '**/CODEOWNERS', '.gitmodules', '.npmrc',
  '**/.npmrc', 'package.json', '**/package.json', 'package-lock.json',
  '**/package-lock.json', 'pnpm-lock.yaml', '**/pnpm-lock.yaml',
  'yarn.lock', '**/yarn.lock', 'bun.lock', '**/bun.lock',
  'bun.lockb', '**/bun.lockb',
];
const resolved = paths => ({pr: {changedFiles: {status: 'resolved', paths}}});
const cases = [
  ['docs-only', resolved(['docs7/index.mdx']), 'chill', true],
  ['nested-docs', resolved(['docs7/nested/a.mdx']), 'chill', true],
  ['mixed', resolved(['docs7/README.md', 'src/main.ts']), 'assertive', true],
  ['non-docs', resolved(['src/main.ts']), 'assertive', true],
  ['governance', resolved(['.coderabbit.config.ts']), 'assertive', true],
  ['mixed-governance', resolved(['.github/workflows/check.yml', 'docs7/a.mdx']), 'assertive', true],
  ['empty', resolved([]), 'assertive', false],
  ['unavailable', {pr: {changedFiles: {status: 'unavailable', paths: []}}}, 'assertive', false],
  ['unsupported', {pr: {changedFiles: {status: 'unsupported', paths: []}}}, 'assertive', false],
  ['stale', {pr: {changedFiles: {status: 'stale', paths: []}}}, 'assertive', false],
  ['no-pr', {}, 'assertive', false],
  ['no-files', {pr: {}}, 'assertive', false],
];
const instructionPaths = ['docs7/**', '.github/**'];
for (const [name, context, expectedProfile, expectedEnabled] of cases) {
  const config = await factory(context);
  assert.equal(config.language, 'en-US', name);
  assert.equal(config.reviews.poem, false, name);
  assert.equal(config.reviews.profile, expectedProfile, name);
  assert.deepEqual(config.reviews.path_instructions.map(x => x.path), instructionPaths, name);
  assert.match(config.reviews.path_instructions[0].instructions, /MDX frontmatter/, name);
  assert.match(config.reviews.path_instructions[1].instructions, /security risks/, name);
  assert.equal(config.reviews.auto_review.enabled, true, name);
  const a = config.reviews.auto_approvals;
  assert.equal(a.enabled, expectedEnabled, name);
  assert.equal(a.allow_author_approval, false, name);
  assert.equal(a.max_merge_risk, 'low', name);
  assert.equal(a.max_security_risk, 'low', name);
  assert.equal(a.overrides.length, 1, name);
  assert.equal(a.overrides[0].enabled, false, name);
  assert.equal(Object.hasOwn(a.overrides[0], 'teams'), false, name);
  assert.deepEqual(new Set(a.overrides[0].paths), new Set(required), name);
  assert.equal(a.overrides[0].paths.length, required.length, name);
  console.log('PASS dynamic case: ' + name);
}
console.log('PASS: 12 typed factory scenarios and 31 required exclusions.');
console.log('NOT CLAIMED: CodeRabbit live approval, security assessment or eligible human review.');
