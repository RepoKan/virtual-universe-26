import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { formatHighlights } from './list.mjs';

test('groups repeated topics while preserving topic and title order', () => {
  assert.equal(formatHighlights([
    { topic: 'Tools', title: 'First' },
    { topic: 'Skills', title: 'Second' },
    { topic: 'Tools', title: 'Third' },
  ]), 'Tools\n- First\n- Third\n\nSkills\n- Second');
});

test('handles an empty highlight list', () => {
  assert.equal(formatHighlights([]), '');
});

test('CLI reads bundled notes independently of the working directory', () => {
  const notes = JSON.parse(readFileSync(new URL('./notes/keynote-highlights.json', import.meta.url), 'utf8'));
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('./list.mjs', import.meta.url))], {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    encoding: 'utf8',
  });
  assert.equal(output, formatHighlights(notes.highlights) + '\n');
  assert.equal(output.split('\n').filter(line => line.startsWith('- ')).length, notes.highlights.length);
});
