// Automatische Tests für src/logic.js. Ausführen: npm test
import { describe, it, expect } from "vitest";
import { ymd, addDays, daysBetween, planDue, cleanTasks, byDeadline, BREAKER_CATS, BREAKER_TO_BAT, isValidEmail, cleanCode, secondsLeft, authErrorText } from "./logic.js";

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
