#!/usr/bin/env bash
set -euo pipefail
repo="$PWD"
test -f .coderabbit.config.ts && test ! -L .coderabbit.config.ts
if test -e .coderabbit.yaml || test -e .coderabbit.yml ||
   test -L .coderabbit.yaml || test -L .coderabbit.yml; then
  echo 'FAIL: competing YAML takes precedence over TypeScript' >&2
  exit 1
fi
scratch="$(mktemp -d)"
trap 'rm -rf -- "$scratch"' EXIT
cp -- .coderabbit.config.ts "$scratch/.coderabbit.config.ts"
cd "$scratch"
printf '%s\n' '{"name":"coderabbit-official-sdk-check","private":true,"type":"module"}' > package.json
export NPM_CONFIG_USERCONFIG=/dev/null
export NPM_CONFIG_CACHE="$scratch/npm-cache"
npm install --registry=https://registry.npmjs.org --ignore-scripts \
  --no-audit --no-fund --save-exact @coderabbitai/config@1.2.0 typescript@7.0.2
npm ls --depth=0
sha256sum package-lock.json
./node_modules/.bin/tsc --strict --noEmitOnError --skipLibCheck false \
  --target ES2022 --module NodeNext --moduleResolution NodeNext \
  --outDir build .coderabbit.config.ts
node "$repo/.github/governance/check_dynamic.mjs" "$scratch/build/.coderabbit.config.js"
echo 'PASS: official CodeRabbit SDK typecheck + deterministic dynamic scenarios'
