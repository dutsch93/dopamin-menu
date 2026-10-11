// Prüft bei jedem "npm test": keine Emojis im Code, und jedes verwendete Icon steht in ICON_NAMES.
// (Google liefert nur gelistete Icons aus – fehlt ein Name, erscheint statt des Icons das Wort, z.B. "star".)
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const read = f => readFileSync(new URL(f, import.meta.url), "utf8");
const app = read("./App.jsx");
const scan = app + "\n" + read("./logic.js");

describe("Icons statt Emojis", () => {
  it("keine Emojis in App.jsx und logic.js", () => {
    const emo = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{23E9}-\u{23FA}\u{231A}\u{231B}]\u{FE0F}?|[0-9#*]\u{FE0F}?\u{20E3}/gu;
    const found = scan.split("\n").flatMap((l, i) => (l.match(emo) || []).map(e => `Zeile ${i + 1}: ${e}`));
    expect(found).toEqual([]);
  });

  it("jedes verwendete Icon steht in ICON_NAMES (und keins zu viel)", () => {
    const listed = new Set([...app.match(/const ICON_NAMES=\[([^\]]*)\]/)[1].matchAll(/"([a-z0-9_]+)"/g)].map(m => m[1]));
    const used = new Set();
    const add = re => { for (const m of scan.matchAll(re)) used.add(m[1]); };
    add(/<Icon name="([a-z0-9_]+)"/g);                    // <Icon name="star"
    add(/\bicon: ?"([a-z0-9_]+)"/g);                      // Daten: icon:"park"
    add(/bkHead\("[^"]*","([a-z0-9_]+)"/g);               // bkHead("work","hourglass_top",...)
    add(/setTIcon\("([a-z0-9_]+)"\)/g);                   // Standard-Icon für eigene Tipps
    for (const m of scan.matchAll(/<Icon name=\{([^}]*)\}/g))   // name={x?"a":"b"} – nur Ergebniswerte
      for (const r of m[1].matchAll(/[?:]\s*"([a-z0-9_]+)"/g)) used.add(r[1]);
    for (const r of app.match(/const ICON_PICK=\[([^\]]*)\]/)[1].matchAll(/"([a-z0-9_]+)"/g)) used.add(r[1]);
    expect([...used].filter(n => !listed.has(n)).sort()).toEqual([]);   // fehlen in ICON_NAMES
    expect([...listed].filter(n => !used.has(n)).sort()).toEqual([]);   // überflüssig in ICON_NAMES
  });
});
