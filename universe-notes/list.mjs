import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function formatHighlights(highlights) {
  const topics = new Map();
  for (const { topic, title } of highlights) {
    if (!topics.has(topic)) topics.set(topic, []);
    topics.get(topic).push(title);
  }
  return [...topics]
    .map(([topic, titles]) => [topic, ...titles.map(title => `- ${title}`)].join('\n'))
    .join('\n\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { highlights } = JSON.parse(
    readFileSync(new URL('./notes/keynote-highlights.json', import.meta.url), 'utf8'),
  );
  const output = formatHighlights(highlights);
  if (output) console.log(output);
}
