// Reine, testbare Funktionen ohne React (seit v7).
// Die Oberfläche bleibt komplett in App.jsx. Tests: src/logic.test.js (npm test)

/* ═══ BREAKER: Datum & Terminplanung ═══ */
// Datumsangaben im Breaker sind immer lokale Kalendertage als Text "YYYY-MM-DD".
// Bewusst NICHT toISOString(): das rechnet in UTC, und nachts wäre "heute" dann schon gestern.
export const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export const parseYmd=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
export const addDays=(s,n)=>{const d=parseYmd(s);d.setDate(d.getDate()+n);return ymd(d);};
// Tage von a bis b (gerundet, damit die Zeitumstellung keinen halben Tag verschiebt)
export const daysBetween=(a,b)=>Math.round((parseYmd(b)-parseYmd(a))/864e5);

// Verteilt die Termine der offenen Schritte:
// - mit Frist: gleichmäßig von heute bis heute + 80 % der Resttage (Puffer gegen Zeitblindheit), Schritt 1 ist heute
// - ohne Frist: 1 Schritt pro Tag ab heute
// Erledigte Schritte und von Hand gesetzte Termine (dueManual) bleiben unverändert. Nie ein Termin in der Vergangenheit.
export function planDue(steps,deadline,today){
  const auto=steps.filter(s=>!s.done&&!s.dueManual);
  const span=deadline?Math.max(0,Math.floor(daysBetween(today,deadline)*0.8)):null;
  const due={};
  auto.forEach((s,i)=>{
    if(span===null)due[s.id]=addDays(today,i);
    else due[s.id]=addDays(today,auto.length>1?Math.round(i*span/(auto.length-1)):0);
  });
  return steps.map(s=>due[s.id]?{...s,due:due[s.id]}:s);
}
// Datum kurz auf Deutsch, z.B. "15. Okt."
export const fmtDay=s=>parseYmd(s).toLocaleDateString("de-DE",{day:"numeric",month:"short"});

// Breaker-Kategorien mit Schritt-Vorlagen (werden beim Zerlegen vorausgefüllt und sind editierbar).
// colorDark/colorLight: geprüfte Text-/Hintergrundfarben (Kontrast mind. 4,5:1)
export const BREAKER_CATS=[
  {id:"alltag",icon:"home",label:"Alltag",color:"#F4A0B5",colorDark:"#A83D61",colorLight:"#FCE4EA",steps:["Entscheide wann du es machst","Bereite vor was du brauchst","Mach den ersten kleinen Schritt","Mach weiter oder plane den nächsten Block","Abschließen und aufräumen"]},
  {id:"soziales",icon:"group",label:"Soziales",color:"#A8D8EA",colorDark:"#326B85",colorLight:"#E7F4F9",steps:["Nachricht schreiben","Termin oder Zeitpunkt vorschlagen","In Kalender eintragen","Vorbereiten (Ort, Anfahrt, was mitnehmen)","Durchführen und genießen"]},
  {id:"arbeit",icon:"work",label:"Arbeit",color:"#FFD6A0",colorDark:"#9A5F0E",colorLight:"#FFF4E4",steps:["Aufgabe in einem Satz definieren","Was brauchst du dafür? (Infos, Tools, Zugang)","Ersten Entwurf / ersten Schritt machen","Überprüfen und anpassen","Abgeben oder kommunizieren"]},
  {id:"sport",icon:"directions_run",label:"Sport & Bewegung",color:"#B8E8D0",colorDark:"#2F7D57",colorLight:"#EBF9F2",steps:["Sportkleidung rauslegen","Tasche packen / Route planen","Schuhe anziehen und losgehen","Training durchziehen (auch nur 10 Min zählt!)","Belohnung: Dusche + etwas Schönes"]},
  {id:"gesundheit",icon:"medical_services",label:"Gesundheit",color:"#C8A8E9",colorDark:"#7A52B3",colorLight:"#F0E7F9",steps:["Nummer oder Website raussuchen","Termin machen (anrufen / online buchen)","In Kalender eintragen + Erinnerung setzen","Unterlagen vorbereiten (Versichertenkarte etc.)","Hingehen"]},
  {id:"finanzen",icon:"savings",label:"Finanzen",color:"#E8C8A8",colorDark:"#85592E",colorLight:"#F9F0E7",steps:["Überblick verschaffen (was genau ist zu tun?)","Unterlagen/Zugänge sammeln","Einen konkreten Betrag/Schritt berechnen","Aktion durchführen (überweisen, kündigen, beantragen)","Abhaken und Beleg speichern"]},
  {id:"kreatives",icon:"palette",label:"Kreatives",color:"#FFB5A7",colorDark:"#A6472F",colorLight:"#FFEAE6",steps:["Inspiration sammeln (1–2 Referenzen reichen)","Material / Tools bereitlegen","Einfach anfangen — perfekt muss es nicht sein","15 Min dranbleiben, dann Pause erlaubt","Ergebnis würdigen — egal wie es aussieht"]},
  {id:"haushalt",icon:"cleaning_services",label:"Haushalt",color:"#D8B8D8",colorDark:"#85508A",colorLight:"#F4EBF4",steps:["Einen einzigen Bereich / eine Aufgabe wählen","Timer auf 10 Minuten stellen","Loslegen — nur das Nötigste","Timer klingelt? Entscheide ob du weitermachst oder aufhörst","Aufräumen / Müll rausbringen"]},
];
// batIds: erlaubte Batterie-IDs (aus BAT_CATS in App.jsx).
// Gespeicherte Meilensteine beim Laden prüfen: kaputte Einträge weglassen, fehlende Felder auffüllen.
// So kann beschädigter localStorage den Breaker nicht zum Absturz bringen.
export const isYmd=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v);
export function cleanTasks(raw,batIds=[]){
  if(!Array.isArray(raw))return[];
  return raw.filter(t=>t&&typeof t.id==="string"&&typeof t.name==="string").map(t=>({
    id:t.id,name:t.name,deadline:isYmd(t.deadline)?t.deadline:null,deadlineType:t.deadlineType==="hard"||t.deadlineType==="soft"?t.deadlineType:null,
    category:BREAKER_CATS.some(c=>c.id===t.category)?t.category:null,why:typeof t.why==="string"?t.why:"",reward:typeof t.reward==="string"?t.reward:"",
    batCat:batIds.includes(t.batCat)?t.batCat:null,batWeight:[1,2,3,4,5].includes(t.batWeight)?t.batWeight:2,
    steps:(Array.isArray(t.steps)?t.steps:[]).filter(s=>s&&typeof s.id==="string"&&typeof s.text==="string").map(s=>({id:s.id,text:s.text,done:!!s.done,custom:!!s.custom,due:isYmd(s.due)?s.due:null,dueManual:!!s.dueManual})),
    created:typeof t.created==="string"?t.created:new Date(0).toISOString(),lastProgress:typeof t.lastProgress==="string"?t.lastProgress:null,completed:typeof t.completed==="string"?t.completed:null,
  }));
}
// Welche Batterie passt zu welcher Breaker-Kategorie? (wird beim Zerlegen vorgeschlagen/vorausgewählt)
export const BREAKER_TO_BAT={sport:"bewegung",soziales:"sozial",kreatives:"kreativ",haushalt:"haushalt"};
// Sortierung: früheste Frist zuerst, ohne Frist ganz unten, sonst nach Erstellung
export const byDeadline=(a,b)=>{const x=a.deadline||"9999-12-31",y=b.deadline||"9999-12-31";return x<y?-1:x>y?1:a.created<b.created?-1:1;};

/* ═══ LOGIN (v7, Modul identity) ═══ */
// Einfache Prüfung der E-Mail-Adresse vor dem Senden (die genaue Prüfung macht Supabase)
export const isValidEmail=s=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s||"").trim());
// Code-Eingabe bereinigen: nur Ziffern, höchstens 6 (z.B. beim Einfügen "123 456" oder "Code: 123456")
export const cleanCode=s=>String(s||"").replace(/\D/g,"").slice(0,6);
// Wie viele Sekunden noch bis "Code erneut senden"? (nie negativ)
export const secondsLeft=(sentAt,now,wait=60)=>sentAt?Math.max(0,Math.ceil(wait-(now-sentAt)/1000)):0;
// Supabase-Fehler -> freundlicher deutscher Satz. kind steuert die Oberfläche:
// "code" = Code falsch/abgelaufen (Supabase unterscheidet das nicht), "rate" = zu viele Versuche,
// "offline" = keine Verbindung, "server" = Supabase/Mailversand hat ein Problem, "email" = Adresse ungültig, "other" = unbekannt
// online: navigator.onLine (false = Gerät sicher offline)
export function authErrorText(err,online=true){
  const code=err?.code||"",status=Number(err?.status)||0,msg=String(err?.message||"");
  // Server-Fehler (5xx): Supabase stuft 502/503/504 selbst als "RetryableFetchError" ein – das ist aber KEIN Verbindungsproblem
  // beim Nutzer, sondern meist ein hängender Mailversand (SMTP). Deshalb vor der Offline-Prüfung.
  if(status>=500)
    return{kind:"server",text:"Die E-Mail konnte gerade nicht verschickt werden. Versuch es bitte in ein paar Minuten nochmal."};
  if(!online||err?.name==="AuthRetryableFetchError"||/failed to fetch|networkerror|load failed/i.test(msg))
    return{kind:"offline",text:"Keine Verbindung zum Internet. Prüf deine Verbindung und versuch es nochmal."};
  if(code==="otp_expired"||/token has expired|invalid/i.test(msg))
    return{kind:"code",text:"Der Code stimmt leider nicht oder ist schon abgelaufen (er gilt 5 Minuten). Prüf ihn noch mal oder fordere einen neuen an."};
  if(code==="over_email_send_rate_limit"||code==="over_request_rate_limit"||status===429)
    return{kind:"rate",text:"Gerade kamen zu viele Anfragen. Warte bitte ein paar Minuten und versuch es dann nochmal."};
  if(code==="email_address_invalid"||code==="validation_failed")
    return{kind:"email",text:"Mit dieser E-Mail-Adresse klappt es leider nicht. Prüf sie bitte noch mal."};
  return{kind:"other",text:"Da ist etwas schiefgelaufen. Versuch es bitte gleich nochmal."};
}

/* ═══ LOKALE DATEN PRO KONTO (v7, Modul identity) ═══ */
// Die App speichert alles unter festen localStorage-Schlüsseln. Damit ein anderes Konto im selben Browser
// nie die Daten des vorherigen Kontos sieht, merkt sich "data_owner", wem die Daten gehören.
// Beim Kontowechsel werden die Daten des alten Kontos beiseitegelegt ("<schlüssel>@<id>") und
// die des neuen Kontos (falls vorhanden) zurückgeholt. Muss VOR dem Laden der App laufen.
// Rückgabe: "same" (gleiches Konto), "claimed" (erster Login übernimmt vorhandene Daten), "switched" (anderes Konto)
export const LOCAL_DATA_KEYS=["dopamin_menu_v5","onboarding_complete"];
export function switchLocalOwner(store,uid){
  const owner=store.getItem("data_owner");
  if(owner===uid)return"same";
  for(const k of LOCAL_DATA_KEYS){
    // Daten des bisherigen Kontos beiseitelegen
    const v=store.getItem(k);
    if(owner&&v!==null)store.setItem(`${k}@${owner}`,v);
    if(owner)store.removeItem(k);
    // Daten des neuen Kontos zurückholen (falls es hier schon mal angemeldet war)
    const mine=store.getItem(`${k}@${uid}`);
    if(mine!==null){store.setItem(k,mine);store.removeItem(`${k}@${uid}`);}
  }
  store.setItem("data_owner",uid);
  return owner?"switched":"claimed";
}
