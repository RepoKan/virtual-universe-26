import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const html = await readFile(new URL("../docs/world-clock.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

function createElements() {
    return new Map([
        "date-label", "local-time", "utc-time", "new-york-time", "london-time", "tokyo-time",
        "local-offset", "new-york-offset", "london-offset", "tokyo-offset",
    ].map((id) => [id, { textContent: "" }]));
}

test("world clock includes the displayed time zones and date", () => {
    assert.ok(script, "page should include its clock script");
    for (const zone of ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"]) {
        assert.ok(html.includes(zone), `page should display ${zone}`);
    }
    assert.match(html, /id="local-time"/);
    assert.match(html, /id="date-label"/);
});

test("world clock renders times, offsets, and refreshes every second", () => {
    assert.ok(script, "page should include its clock script");
    new vm.Script(script);

    const elements = createElements();
    let intervalCallback;
    let intervalMs;

    vm.runInNewContext(script, {
        Date,
        Intl,
        document: { getElementById: (id) => elements.get(id) },
        setInterval(callback, ms) {
            intervalCallback = callback;
            intervalMs = ms;
        },
    });

    assert.equal(intervalMs, 1000);
    assert.equal(typeof intervalCallback, "function");
    for (const id of ["local-time", "utc-time", "new-york-time", "london-time", "tokyo-time"]) {
        assert.match(elements.get(id).textContent, /^\d{2}:\d{2}:\d{2}$/);
    }
    for (const id of ["local-offset", "new-york-offset", "london-offset", "tokyo-offset"]) {
        assert.notEqual(elements.get(id).textContent, "");
    }
    assert.notEqual(elements.get("date-label").textContent, "");

    intervalCallback();
    assert.match(elements.get("utc-time").textContent, /^\d{2}:\d{2}:\d{2}$/);
});
