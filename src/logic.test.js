// Automatische Tests für src/logic.js. Ausführen: npm test
import { describe, it, expect } from "vitest";
import { ymd, addDays, daysBetween, planDue, cleanTasks, byDeadline, BREAKER_CATS, BREAKER_TO_BAT, isValidEmail, cleanCode, secondsLeft, authErrorText, switchLocalOwner, packData, unpackData, hasRealData, dataSummary, syncDecision, sameData, keysToClear, agoText, LOCAL_DATA_KEYS } from "./logic.js";

// Hilfen: n Schritte ohne Termin, und nur die Termine einer Schrittliste
const mk = n => Array.from({ length: n }, (_, i) => ({ id: "s" + (i + 1), text: "Schritt " + (i + 1), done: false, custom: false, due: null, dueManual: false }));
const dues = st => st.map(s => s.due);

describe("Datums-Helfer", () => {
  it("ymd: lokaler Kalendertag als YYYY-MM-DD", () => {
    expect(ymd(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
  it("ymd: nachts um 00:30 bleibt es der lokale Tag (kein UTC-Versatz)", () => {
    expect(ymd(new Date(2026, 9, 6, 0, 30))).toBe("2026-10-06");
  });
  it("addDays über Monats-, Jahreswechsel und Schaltjahr", () => {
    expect(addDays("2026-10-30", 3)).toBe("2026-11-02");
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  });
  it("daysBetween über die Zeitumstellung", () => {
    expect(daysBetween("2026-10-24", "2026-10-27")).toBe(3);
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
  });
});

describe("planDue: Termine verteilen", () => {
  it("5 Schritte, Frist in 10 Tagen: zwischen heute und Tag 8, Schritt 1 heute", () => {
    expect(dues(planDue(mk(5), "2026-10-15", "2026-10-05")))
      .toEqual(["2026-10-05", "2026-10-07", "2026-10-09", "2026-10-11", "2026-10-13"]);
  });
  it("Frist heute, morgen oder vorbei: alles heute, nie in der Vergangenheit", () => {
    expect(dues(planDue(mk(3), "2026-10-05", "2026-10-05"))).toEqual(Array(3).fill("2026-10-05"));
    expect(dues(planDue(mk(3), "2026-10-06", "2026-10-05"))).toEqual(Array(3).fill("2026-10-05"));
    expect(dues(planDue(mk(2), "2026-10-01", "2026-10-05"))).toEqual(Array(2).fill("2026-10-05"));
  });
  it("ohne Frist: ein Schritt pro Tag, auch über den Monatswechsel", () => {
    expect(dues(planDue(mk(4), null, "2026-10-30"))).toEqual(["2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02"]);
  });
  it("knappe Zeit: mehrere Schritte am selben Tag, aufsteigend, letzter am Tag 2", () => {
    const t = dues(planDue(mk(5), "2026-10-08", "2026-10-05"));
    expect(t[4]).toBe("2026-10-07");
    expect([...t].sort()).toEqual(t);
  });
  it("ein einzelner Schritt ist heute fällig", () => {
    expect(dues(planDue(mk(1), "2026-12-24", "2026-10-05"))).toEqual(["2026-10-05"]);
  });
  it("erledigte und von Hand gesetzte Termine bleiben unverändert", () => {
    const st = mk(4);
    st[0] = { ...st[0], done: true, due: "2026-10-01" };
    st[2] = { ...st[2], dueManual: true, due: "2026-10-20" };
    expect(dues(planDue(st, "2026-10-15", "2026-10-05"))).toEqual(["2026-10-01", "2026-10-05", "2026-10-20", "2026-10-13"]);
  });
  it("verändert die übergebene Liste nicht (React-State)", () => {
    const orig = mk(2);
    planDue(orig, null, "2026-10-05");
    expect(dues(orig)).toEqual([null, null]);
  });
});

describe("cleanTasks: gespeicherte Meilensteine prüfen", () => {
  const BAT = ["bewegung", "sozial", "natur"];
  it("kein Array -> leere Liste", () => {
    expect(cleanTasks("kaputt")).toEqual([]);
    expect(cleanTasks(null)).toEqual([]);
    expect(cleanTasks({})).toEqual([]);
  });
  it("kaputte Einträge fallen weg", () => {
    expect(cleanTasks([null, 5, "x", { name: "ohne id" }, { id: "ohne name" }])).toEqual([]);
  });
  it("ungültige Felder werden repariert", () => {
    const [t] = cleanTasks([{ id: "t1", name: "Test", steps: "kaputt", deadline: "morgen", category: "gibtsnicht" }], BAT);
    expect(t.steps).toEqual([]);
    expect(t.deadline).toBeNull();
    expect(t.category).toBeNull();
  });
  it("gültige Daten bleiben, kaputte Schritte fallen weg", () => {
    const [t] = cleanTasks([{ id: "t2", name: "OK", deadline: "2026-10-20", category: "arbeit",
      steps: [{ id: "s1", text: "A", done: 1, due: "2026-10-06" }, null, { text: "ohne id" }] }], BAT);
    expect(t.deadline).toBe("2026-10-20");
    expect(t.category).toBe("arbeit");
    expect(t.steps).toHaveLength(1);
    expect(t.steps[0]).toMatchObject({ done: true, due: "2026-10-06" });
  });
  it("batCat nur, wenn die Batterie existiert", () => {
    const r = cleanTasks([{ id: "a", name: "x", batCat: "bewegung" }, { id: "b", name: "y", batCat: "gibtsnicht" }, { id: "c", name: "z" }], BAT);
    expect(r.map(t => t.batCat)).toEqual(["bewegung", null, null]);
  });
  it("ohne erlaubte Batterie-IDs wird keine Verknüpfung übernommen", () => {
    expect(cleanTasks([{ id: "a", name: "x", batCat: "bewegung" }])[0].batCat).toBeNull();
  });
  it("batWeight: 1–5 bleibt, sonst 2", () => {
    const r = cleanTasks([{ id: "a", name: "x", batWeight: 4 }, { id: "b", name: "y", batWeight: 9 }, { id: "c", name: "z" }], BAT);
    expect(r.map(t => t.batWeight)).toEqual([4, 2, 2]);
  });
});

describe("byDeadline: Sortierung", () => {
  it("früheste Frist zuerst, ohne Frist ganz unten, sonst nach Erstellung", () => {
    const l = [
      { id: "ohne", deadline: null, created: "2026-10-01" },
      { id: "spaet", deadline: "2026-12-01", created: "2026-10-01" },
      { id: "frueh", deadline: "2026-10-10", created: "2026-10-03" },
      { id: "frueh-alt", deadline: "2026-10-10", created: "2026-10-02" },
    ];
    expect([...l].sort(byDeadline).map(t => t.id)).toEqual(["frueh-alt", "frueh", "spaet", "ohne"]);
  });
});

describe("Breaker-Daten", () => {
  it("jede Kategorie hat 5 Schritte, Icon und Farben", () => {
    for (const c of BREAKER_CATS) {
      expect(c.steps).toHaveLength(5);
      expect(c.icon).toMatch(/^[a-z0-9_]+$/);
      expect(c.colorDark).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
  it("Batterie-Zuordnung zeigt nur auf vorhandene Breaker-Kategorien", () => {
    const ids = BREAKER_CATS.map(c => c.id);
    for (const k of Object.keys(BREAKER_TO_BAT)) expect(ids).toContain(k);
  });
});

describe("Login: E-Mail und Code", () => {
  it("isValidEmail erkennt typische Adressen und Tippfehler", () => {
    expect(isValidEmail("anh@example.de")).toBe(true);
    expect(isValidEmail("  anh.vu+test@mail.co.uk  ")).toBe(true);
    for (const bad of ["", "anh", "anh@", "@mail.de", "anh@mail", "anh@mail.d", "an h@mail.de", null]) expect(isValidEmail(bad)).toBe(false);
  });
  it("cleanCode lässt nur 6 Ziffern übrig", () => {
    expect(cleanCode("123456")).toBe("123456");
    expect(cleanCode("123 456")).toBe("123456");
    expect(cleanCode("Code: 98-76-54")).toBe("987654");
    expect(cleanCode("12345678")).toBe("123456");
    expect(cleanCode("abc")).toBe("");
    expect(cleanCode(undefined)).toBe("");
  });
  it("secondsLeft zählt bis 0 herunter, nie negativ", () => {
    const t0 = 1_000_000;
    expect(secondsLeft(t0, t0)).toBe(60);
    expect(secondsLeft(t0, t0 + 18_400)).toBe(42);
    expect(secondsLeft(t0, t0 + 60_000)).toBe(0);
    expect(secondsLeft(t0, t0 + 999_000)).toBe(0);
    expect(secondsLeft(null, t0)).toBe(0);
  });
});

describe("Login: Fehlertexte", () => {
  it("falscher oder abgelaufener Code (Supabase: otp_expired)", () => {
    expect(authErrorText({ code: "otp_expired", status: 403, message: "Token has expired or is invalid" }).kind).toBe("code");
  });
  it("zu viele Anfragen", () => {
    expect(authErrorText({ code: "over_email_send_rate_limit", status: 429 }).kind).toBe("rate");
    expect(authErrorText({ code: "over_request_rate_limit" }).kind).toBe("rate");
    expect(authErrorText({ status: 429 }).kind).toBe("rate");
  });
  it("keine Internetverbindung", () => {
    expect(authErrorText({ name: "AuthRetryableFetchError", message: "Failed to fetch" }).kind).toBe("offline");
    expect(authErrorText({ message: "Load failed" }).kind).toBe("offline");
    expect(authErrorText({ code: "irgendwas" }, false).kind).toBe("offline");
  });
  it("Server-Fehler (z.B. Mailversand hängt) ist KEIN Verbindungsfehler", () => {
    // supabase-js meldet 502/503/504 als AuthRetryableFetchError – darf nicht "Keine Verbindung" heißen
    expect(authErrorText({ name: "AuthRetryableFetchError", status: 504, message: "{}" }).kind).toBe("server");
    expect(authErrorText({ name: "AuthApiError", status: 500, code: "unexpected_failure", message: "Error sending magic link email" }).kind).toBe("server");
  });
  it("ungültige Adresse", () => {
    expect(authErrorText({ code: "email_address_invalid" }).kind).toBe("email");
  });
  it("Unbekanntes führt zu einem freundlichen Standardtext, nie zu technischen Details", () => {
    const r = authErrorText({ code: "irgendwas", message: "Internal stack trace xyz" });
    expect(r.kind).toBe("other");
    expect(r.text).not.toMatch(/stack|xyz/);
    expect(authErrorText(undefined).kind).toBe("other");
  });
  it("alle Texte sind Deutsch und ohne Fachbegriffe", () => {
    for (const e of [{ code: "otp_expired" }, { status: 429 }, { message: "Failed to fetch" }, { code: "email_address_invalid" }, { status: 504 }, {}]) {
      expect(authErrorText(e).text).not.toMatch(/OTP|token|error|rate limit/i);
    }
  });
});

describe("Lokale Daten gehören einem Konto (switchLocalOwner)", () => {
  // Ersatz für localStorage im Test
  const mem = (init = {}) => { const d = { ...init }; return { d, getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); }, removeItem: k => { delete d[k]; } }; };
  it("erster Login übernimmt die vorhandenen Daten", () => {
    const s = mem({ dopamin_menu_v5: "A-Daten", onboarding_complete: "true" });
    expect(switchLocalOwner(s, "userA")).toBe("claimed");
    expect(s.d).toEqual({ dopamin_menu_v5: "A-Daten", onboarding_complete: "true", data_owner: "userA" });
  });
  it("gleiches Konto: nichts ändert sich", () => {
    const s = mem({ dopamin_menu_v5: "A-Daten", data_owner: "userA" });
    expect(switchLocalOwner(s, "userA")).toBe("same");
    expect(s.d.dopamin_menu_v5).toBe("A-Daten");
  });
  it("anderes Konto sieht die Daten des ersten Kontos NICHT und startet leer", () => {
    const s = mem({ dopamin_menu_v5: "A-Daten", onboarding_complete: "true", data_owner: "userA" });
    expect(switchLocalOwner(s, "userB")).toBe("switched");
    expect(s.getItem("dopamin_menu_v5")).toBeNull();
    expect(s.getItem("onboarding_complete")).toBeNull();
    expect(s.getItem("data_owner")).toBe("userB");
  });
  it("Hin und zurück: jedes Konto bekommt genau seine eigenen Daten wieder", () => {
    const s = mem({ dopamin_menu_v5: "A-Daten", onboarding_complete: "true", data_owner: "userA" });
    switchLocalOwner(s, "userB");
    s.setItem("dopamin_menu_v5", "B-Daten");
    switchLocalOwner(s, "userA");
    expect(s.getItem("dopamin_menu_v5")).toBe("A-Daten");
    expect(s.getItem("onboarding_complete")).toBe("true");
    switchLocalOwner(s, "userB");
    expect(s.getItem("dopamin_menu_v5")).toBe("B-Daten");
    expect(s.getItem("onboarding_complete")).toBeNull();
  });
});

describe("Cloud-Sync: Paket, echte Daten, Kurzinfo", () => {
  const DEF = ["a1", "e1", "s1"]; // IDs der mitgelieferten Menü-Einträge
  const leer = { items: { appetizer: [{ id: "a1" }], entree: [{ id: "e1" }], side: [{ id: "s1" }] }, stars: 0, habits: [], tasks: [], customTips: {} };
  it("packData/unpackData: hin und zurück ohne Verlust", () => {
    const p = packData({ stars: 3, habits: [{ id: "h" }] }, true);
    expect(p).toEqual({ stars: 3, habits: [{ id: "h" }], onboardingComplete: true });
    expect(unpackData(JSON.parse(JSON.stringify(p)))).toEqual({ store: { stars: 3, habits: [{ id: "h" }] }, onboardingComplete: true });
  });
  it("packData ohne gespeicherte Daten", () => {
    expect(packData(null, false)).toEqual({ onboardingComplete: false });
  });
  it("unpackData: Kaputtes wird abgelehnt", () => {
    for (const bad of [null, undefined, "x", 5, [1, 2]]) expect(unpackData(bad)).toBeNull();
  });
  it("hasRealData: leere Standard-Daten zählen nicht", () => {
    expect(hasRealData(null, DEF)).toBe(false);
    expect(hasRealData(packData(leer, false), DEF)).toBe(false);
    expect(hasRealData({ onboardingComplete: false }, DEF)).toBe(false);
  });
  it("hasRealData: Sterne, Habits, Meilensteine, eigene Tipps, eigene Menü-Einträge, Onboarding zählen", () => {
    expect(hasRealData({ ...leer, stars: 1 }, DEF)).toBe(true);
    expect(hasRealData({ ...leer, habits: [{ id: "h" }] }, DEF)).toBe(true);
    expect(hasRealData({ ...leer, tasks: [{ id: "t" }] }, DEF)).toBe(true);
    expect(hasRealData({ ...leer, customTips: { start: [{ id: "c" }] } }, DEF)).toBe(true);
    expect(hasRealData({ ...leer, customTips: { start: [] } }, DEF)).toBe(false);
    expect(hasRealData({ ...leer, items: { ...leer.items, side: [{ id: "s1" }, { id: "eigen" }] } }, DEF)).toBe(true);
    expect(hasRealData({ ...leer, onboardingComplete: true }, DEF)).toBe(true);
  });
  it("dataSummary zählt Meilensteine, Habits und Sterne", () => {
    expect(dataSummary({ tasks: [{}, {}], habits: [{}], stars: 40 })).toEqual({ tasks: 2, habits: 1, stars: 40 });
    expect(dataSummary(null)).toEqual({ tasks: 0, habits: 0, stars: 0 });
  });
});

describe("Cloud-Sync: syncDecision (Tabelle in SPEC-cloud-sync.md)", () => {
  const DEF = [];
  const voll = { stars: 5, onboardingComplete: true };
  const T1 = "2026-10-22T10:00:00.000000+00:00", T2 = "2026-10-22T11:00:00.000000+00:00";
  const remote = (data, updated_at = T1) => ({ data, updated_at });
  it("Gerät leer, Konto leer → frisch", () => {
    expect(syncDecision(null, null, null, DEF)).toBe("fresh");
    expect(syncDecision(null, null, remote({ onboardingComplete: false }), DEF)).toBe("fresh");
  });
  it("Gerät hat Daten (nie abgeglichen), Konto leer → hochladen", () => {
    expect(syncDecision(voll, null, null, DEF)).toBe("upload");
    expect(syncDecision(voll, null, remote({}), DEF)).toBe("upload");
  });
  it("Gerät leer, Konto hat Daten → herunterladen", () => {
    expect(syncDecision(null, null, remote(voll), DEF)).toBe("download");
    expect(syncDecision({ onboardingComplete: false }, null, remote(voll), DEF)).toBe("download");
  });
  it("beide haben Daten, Gerät nie mit diesem Konto abgeglichen → nachfragen", () => {
    expect(syncDecision(voll, null, remote(voll), DEF)).toBe("ask");
    expect(syncDecision(voll, { dirty: true, changedAt: "2026-10-22T12:00:00.000Z" }, remote(voll), DEF)).toBe("ask");
  });
  it("abgeglichen, nichts Ungesichertes: Konto neuer → runter, gleich → nichts", () => {
    expect(syncDecision(voll, { dirty: false, syncedAt: T1 }, remote(voll, T2), DEF)).toBe("download");
    expect(syncDecision(voll, { dirty: false, syncedAt: T1 }, remote(voll, T1), DEF)).toBe("same");
  });
  it("abgeglichen, Ungesichertes da, Konto unverändert → hochladen", () => {
    expect(syncDecision(voll, { dirty: true, syncedAt: T1, changedAt: "2026-10-22T09:00:00.000Z" }, remote(voll, T1), DEF)).toBe("upload");
  });
  it("beide geändert → der neuere gewinnt (auch bei unterschiedlichem Zeitformat)", () => {
    expect(syncDecision(voll, { dirty: true, syncedAt: T1, changedAt: "2026-10-22T11:30:00.000Z" }, remote(voll, T2), DEF)).toBe("upload");
    expect(syncDecision(voll, { dirty: true, syncedAt: T1, changedAt: "2026-10-22T10:30:00.000Z" }, remote(voll, T2), DEF)).toBe("download");
  });
  it("abgeglichen, aber Konto inzwischen leer (z.B. Zeile entfernt) → hochladen", () => {
    expect(syncDecision(voll, { dirty: false, syncedAt: T1 }, null, DEF)).toBe("upload");
  });
});

describe("Cloud-Sync: Hilfen", () => {
  it("sameData: Reihenfolge der Felder egal (die Datenbank sortiert sie um)", () => {
    expect(sameData({ a: 1, b: { c: 2, d: [1, { e: 3, f: 4 }] } }, { b: { d: [1, { f: 4, e: 3 }], c: 2 }, a: 1 })).toBe(true);
    expect(sameData({ a: 1 }, { a: 2 })).toBe(false);
    expect(sameData({ a: [1, 2] }, { a: [2, 1] })).toBe(false); // Listen-Reihenfolge zählt
    expect(sameData(null, null)).toBe(true);
  });
  it("sync_meta gehört zu den Nutzerdaten (wird beim Kontowechsel mit beiseitegelegt)", () => {
    expect(LOCAL_DATA_KEYS).toContain("sync_meta");
  });
  it("keysToClear: alle Nutzerdaten inkl. alter Reste anderer Konten, aber nichts Fremdes", () => {
    const all = ["dopamin_menu_v5", "onboarding_complete", "sync_meta", "data_owner", "dopamin_menu_v5@u1", "onboarding_complete@u2", "sync_meta@u1", "sb-abc-auth-token", "andere_app"];
    expect(keysToClear(all).sort()).toEqual(["data_owner", "dopamin_menu_v5", "dopamin_menu_v5@u1", "onboarding_complete", "onboarding_complete@u2", "sync_meta", "sync_meta@u1"]);
  });
  it("agoText: freundliche Zeitangabe", () => {
    const now = new Date(2026, 9, 22, 14, 0).getTime();
    expect(agoText(now - 20_000, now)).toBe("gerade eben");
    expect(agoText(now - 2 * 60_000, now)).toBe("vor 2 Min.");
    expect(agoText(now - 3 * 3600_000, now)).toBe("vor 3 Std.");
    expect(agoText(new Date(2026, 9, 18, 9, 0).getTime(), now)).toBe("am 18.10.");
    expect(agoText(null, now)).toBe("");
  });
});
