#!/usr/bin/env bash
set -euo pipefail
repo="$PWD"
governance="$repo/.github/governance"
test -f .coderabbit.config.ts && test ! -L .coderabbit.config.ts
test -f "$governance/package.json" && test ! -L "$governance/package.json"
test -f "$governance/package-lock.json" && test ! -L "$governance/package-lock.json"
if test -e .coderabbit.yaml || test -e .coderabbit.yml ||
   test -L .coderabbit.yaml || test -L .coderabbit.yml; then
  echo 'FAIL: competing YAML takes precedence over TypeScript' >&2
  exit 1
fi
scratch="$(mktemp -d)"
trap 'rm -rf -- "$scratch"' EXIT
cp -- .coderabbit.config.ts "$scratch/.coderabbit.config.ts"
cp -- "$governance/package.json" "$scratch/package.json"
cp -- "$governance/package-lock.json" "$scratch/package-lock.json"
cd "$scratch"
export NPM_CONFIG_USERCONFIG=/dev/null
export NPM_CONFIG_CACHE="$scratch/npm-cache"
npm ci --registry=https://registry.npmjs.org --ignore-scripts \
  --no-audit --no-fund
cmp -- "$governance/package-lock.json" package-lock.json
sha256sum "$governance/package-lock.json" package-lock.json
node --input-type=module <<'NODE'
import { readFileSync } from 'node:fs';

const expected = {
  '@coderabbitai/config': '1.2.0',
  typescript: '7.0.2',
};
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
if (lock.lockfileVersion !== 3) {
  throw new Error(`Expected package-lock v3, got ${lock.lockfileVersion}`);
}
for (const [name, version] of Object.entries(expected)) {
  if (manifest.dependencies?.[name] !== version) {
    throw new Error(`Manifest mismatch for ${name}`);
  }
  if (lock.packages?.['']?.dependencies?.[name] !== version) {
    throw new Error(`Lock root mismatch for ${name}`);
  }
  const locked = lock.packages?.[`node_modules/${name}`];
  if (locked?.version !== version) {
    throw new Error(`Locked version mismatch for ${name}`);
  }
  if (!locked?.resolved?.startsWith('https://registry.npmjs.org/')) {
    throw new Error(`Unexpected registry resolution for ${name}`);
  }
  if (!/^sha512-/.test(locked?.integrity ?? '')) {
    throw new Error(`Missing sha512 integrity for ${name}`);
  }
  const installed = JSON.parse(
    readFileSync(`node_modules/${name}/package.json`, 'utf8'),
  );
  if (installed.version !== version) {
    throw new Error(`Installed version mismatch for ${name}`);
  }
}
for (const [path, entry] of Object.entries(lock.packages ?? {})) {
  if (!path || entry.link) continue;
  if (entry.resolved?.startsWith('https://registry.npmjs.org/') &&
      !/^sha512-/.test(entry.integrity ?? '')) {
    throw new Error(`Missing registry integrity for ${path}`);
  }
}
console.log('PASS: locked direct versions and registry integrity metadata');
NODE
npm ls --depth=0
./node_modules/.bin/tsc --strict --noEmitOnError --skipLibCheck false \
  --target ES2022 --module NodeNext --moduleResolution NodeNext \
  --outDir build .coderabbit.config.ts
node "$repo/.github/governance/check_dynamic.mjs" "$scratch/build/.coderabbit.config.js"
echo 'PASS: official CodeRabbit SDK typecheck + deterministic dynamic scenarios'
