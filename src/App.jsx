import { useState, useEffect, useCallback, useRef } from "react";

/* ═══ MENU ═══ */
const CATEGORIES = {
  appetizer:{key:"appetizer",label:"Appetizers",subtitle:"Quick Movement",duration:5*60,color:"#C8A8E9",colorLight:"#EDE0F7",colorDark:"#9B6FCF",
    defaults:[{id:"a1",name:"Stretch & Shake",desc:"Streck dich wie ein Seestern"},{id:"a2",name:"Tanz-Break",desc:"30 Sek Lieblingslied tanzen"},{id:"a3",name:"Kaltes Wasser",desc:"Hände unter kaltes Wasser & atmen"},{id:"a4",name:"Hampelmann",desc:"20 Jumping Jacks!"},{id:"a5",name:"Fenster auf!",desc:"Frische Luft schnappen"}]},
  entree:{key:"entree",label:"Entrées",subtitle:"Deep Work",duration:20*60,color:"#FFB5A7",colorLight:"#FFE0DA",colorDark:"#E8876F",
    defaults:[{id:"e1",name:"Power-Fokus",desc:"Eine Aufgabe, kein Handy"},{id:"e2",name:"Schreib-Sprint",desc:"Alles raus was im Kopf ist"},{id:"e3",name:"Sortier-Session",desc:"Einen Bereich aufräumen"},{id:"e4",name:"Lern-Block",desc:"Etwas Neues anschauen"},{id:"e5",name:"Planungs-Zeit",desc:"Woche planen"}]},
  side:{key:"side",label:"Sides",subtitle:"Creative Play",duration:10*60,color:"#B8E8D0",colorLight:"#DFF5EA",colorDark:"#6FC49E",
    defaults:[{id:"s1",name:"Doodle-Time",desc:"Kritzle was dir einfällt"},{id:"s2",name:"Brainstorm",desc:"Wilde Ideen sammeln"},{id:"s3",name:"Musik machen",desc:"Summen, klopfen, spielen"},{id:"s4",name:"Origami",desc:"Endlose Möglichkeiten"},{id:"s5",name:"Tagträumen",desc:"Augen zu & Geschichte erfinden"}]},
};

/* ═══ SOFORTHILFE ═══ */
const SOFORTHILFE = [
  {id:"start",animal:"Schildkröte",title:"Kann nicht anfangen",color:"#A8D8EA",colorDark:"#5BA3C0",colorLight:"#D6EEFB",science:"Exekutive Dysfunktion — Aufgabeninitiation bei ADHS beeinträchtigt (Barkley, 2012).",
    tips:[{id:"st1",icon:"extension",title:"Mini-Schritt",text:"Nur die ersten 2 Minuten. Verhaltensmomentum senkt Widerstand (Nevin, 1996)."},{id:"st2",icon:"music_note",title:"Körper zuerst",text:"30 Sek Bewegung erhöht Dopamin (Ratey, 2008)."},{id:"st3",icon:"campaign",title:"Laut aussprechen",text:"Kompensiert schwächeres inneres Sprechen (Barkley, 1997)."},{id:"st4",icon:"group",title:"Body Doubling",text:"Neben jemandem arbeiten erhöht Aufgabenbindung (Zajonc, 1965)."}]},
  {id:"overwhelm",animal:"Bär",title:"Alles zu viel",color:"#F4A0B5",colorDark:"#D06B83",colorLight:"#FCE0E8",science:"Kognitive Überlast — geringere Arbeitsgedächtnis-Kapazität (Martinussen, 2005).",
    tips:[{id:"ow1",icon:"edit_note",title:"Brain Dump",text:"Alles aufschreiben befreit Arbeitsgedächtnis (Sweller, 1988)."},{id:"ow2",icon:"counter_3",title:"Nur 3 Dinge",text:"Reduziert Entscheidungsmüdigkeit (Baumeister, 1998)."},{id:"ow3",icon:"air",title:"Box Breathing",text:"4-4-4-4. Senkt Cortisol (Ma et al., 2017)."},{id:"ow4",icon:"favorite",title:"Komfort-Anker",text:"Vertraute Reize aktivieren Sicherheitssystem (Porges, 2011)."}]},
  {id:"focus",animal:"Schmetterling",title:"Kann mich nicht konzentrieren",color:"#C8A8E9",colorDark:"#9B6FCF",colorLight:"#EDE0F7",science:"Brown Noise verbessert Leistung bei ADHS (Söderlund, 2007).",
    tips:[{id:"fo1",icon:"headphones",title:"Brown Noise",text:"Erhöht Dopamin im präfrontalen Kortex."},{id:"fo2",icon:"mobile_off",title:"Handy weg",text:"Sichtbare Nähe reduziert kognitive Kapazität (Ward, 2017)."},{id:"fo3",icon:"timer",title:"5-Min-Sprint",text:"Zeigarnik-Effekt motiviert zum Weitermachen."},{id:"fo4",icon:"edit",title:"Ablenkungszettel",text:"Gedanken notieren reduziert Intrusions (Wegner, 1994)."}]},
  {id:"restless",animal:"Äffchen",title:"Unruhig & zappelig",color:"#FFD6A0",colorDark:"#CC9544",colorLight:"#FFF0D6",science:"Fidgeting verbessert kognitive Leistung bei ADHS (Hartanto, 2016).",
    tips:[{id:"re1",icon:"directions_run",title:"Bewegungs-Snack",text:"10 Kniebeugen erhöhen Dopamin (Ratey, 2008)."},{id:"re2",icon:"ac_unit",title:"Sensorik-Reset",text:"Propriozeptiver Input beruhigt (Ayres, 1972)."},{id:"re3",icon:"chair",title:"Position wechseln",text:"Aktiviert Orientierungsnetzwerk (Posner, 1990)."},{id:"re4",icon:"music_note",title:"Rhythmisches Klopfen",text:"Bilaterale Stimulation beruhigt (Shapiro, 2001)."}]},
  {id:"decisions",animal:"Igel",title:"Kann mich nicht entscheiden",color:"#B8D8A8",colorDark:"#6FA05A",colorLight:"#E0F0D6",science:"Analyse-Paralyse bei ADHS (Damasio, 1994).",
    tips:[{id:"de1",icon:"monetization_on",title:"Münze werfen",text:"Dein Gefühl zeigt die wahre Präferenz."},{id:"de2",icon:"alarm",title:"2-Min-Timer",text:"Satisficing statt Maximizing (Schwartz, 2004)."},{id:"de3",icon:"pinch",title:"Kleinste Version",text:"Geringstem Aufwand wählen."},{id:"de4",icon:"record_voice_over",title:"Laut denken",text:"Kompensiert Arbeitsgedächtnis-Defizite."}]},
  {id:"emotions",animal:"Koala",title:"Gefühle überfluten mich",color:"#A8C8E8",colorDark:"#5A8AB8",colorLight:"#D6E8F8",science:"Affect Labeling reduziert Amygdala-Aktivität (Lieberman, 2007).",
    tips:[{id:"em1",icon:"label",title:"Gefühl benennen",text:"Reduziert Amygdala-Reaktivität um ~50%."},{id:"em2",icon:"thermostat",title:"Dive Reflex",text:"Kaltes Wasser senkt Herzfrequenz (Linehan, 1993)."},{id:"em3",icon:"location_on",title:"5-4-3-2-1 Grounding",text:"5 sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken."},{id:"em4",icon:"hourglass_bottom",title:"90-Sekunden-Regel",text:"Emotion dauert ~90 Sek (Bolte Taylor, 2006)."}]},
  {id:"timeblind",animal:"Schnecke",title:"Zeitgefühl verloren",color:"#E8C8A8",colorDark:"#B8945A",colorLight:"#F5E8D6",science:"Zeitblindheit bei ADHS (Barkley, 1997).",
    tips:[{id:"tb1",icon:"alarm",title:"Visuelle Timer",text:"Zeit sichtbar machen."},{id:"tb2",icon:"notifications",title:"3er-Alarm-Kette",text:"3 Alarme statt einem."},{id:"tb3",icon:"fast_rewind",title:"Rückwärts planen",text:"Vom Termin zurückrechnen."},{id:"tb4",icon:"target",title:"Zeit schätzen",text:"Raten, dann stoppen — wird besser."}]},
  {id:"forget",animal:"Elefant",title:"Vergesse ständig Dinge",color:"#D8B8D8",colorDark:"#A07AA0",colorLight:"#F0E0F0",science:"Arbeitsgedächtnis-Defizit (Martinussen, 2005).",
    tips:[{id:"fg1",icon:"location_on",title:"Launch Pad",text:"Fester Platz an der Tür (Barkley, 2012)."},{id:"fg2",icon:"sticky_note_2",title:"Sofort notieren",text:"In 3 Sek ist der Gedanke weg."},{id:"fg3",icon:"repeat",title:"Habit Stacking",text:"An bestehende Gewohnheit ketten (Gollwitzer, 1999)."},{id:"fg4",icon:"photo_camera",title:"Foto-Gedächtnis",text:"Fotografiere was du vergessen könntest."}]},
];

/* ═══ BATTERIE ═══ */
const BAT_CATS = [
  {id:"natur",icon:"park",label:"Natur",color:"#B8E8D0",colorDark:"#6FC49E",colorLight:"#DFF5EA",helpId:"start"},
  {id:"bewegung",icon:"directions_run",label:"Bewegung",color:"#FFB5A7",colorDark:"#E8876F",colorLight:"#FFE0DA",helpId:"restless"},
  {id:"ruhe",icon:"self_improvement",label:"Ruhe",color:"#C8A8E9",colorDark:"#9B6FCF",colorLight:"#EDE0F7",helpId:"overwhelm"},
  {id:"kreativ",icon:"palette",label:"Kreativität",color:"#FFD6A0",colorDark:"#CC9544",colorLight:"#FFF0D6",helpId:"focus"},
  {id:"sozial",icon:"group",label:"Soziales",color:"#A8D8EA",colorDark:"#5BA3C0",colorLight:"#D6EEFB",helpId:"start"},
  {id:"haushalt",icon:"home",label:"Haushalt",color:"#F4A0B5",colorDark:"#D06B83",colorLight:"#FCE0E8",helpId:"overwhelm"},
  {id:"lernen",icon:"menu_book",label:"Lernen",color:"#B8D8A8",colorDark:"#6FA05A",colorLight:"#E0F0D6",helpId:"focus"},
  {id:"schlaf",icon:"bedtime",label:"Schlaf",color:"#D8B8D8",colorDark:"#A07AA0",colorLight:"#F0E0F0",helpId:"overwhelm"},
  {id:"ernaehrung",icon:"nutrition",label:"Ernährung",color:"#A8E8C0",colorDark:"#5AB880",colorLight:"#D6F5E6",helpId:"forget"},
  {id:"hygiene",icon:"spa",label:"Selbstpflege",color:"#E8C8A8",colorDark:"#B8945A",colorLight:"#F5E8D6",helpId:"start"},
];
const INTERVALS=[{id:"daily",label:"Täglich",days:1},{id:"every2",label:"Alle 2–3 Tage",days:2.5},{id:"weekly",label:"Wöchentlich",days:7},{id:"biweekly",label:"Alle 2 Wochen",days:14},{id:"monthly",label:"Monatlich",days:30}];
const REMIND_OPTS=[{id:"none",label:"Aus"},{id:"overdue",label:"Wenn überfällig"},{id:"1day",label:"1 Tag vorher",hoursB4:24},{id:"2days",label:"2 Tage vorher",hoursB4:48}];

function getBatColor(p){if(p>80)return"#5EC269";if(p>60)return"#A8D040";if(p>40)return"#F0C040";if(p>20)return"#E86A5A";return"#B83A3A";}
// Gleiche Stufen wie getBatColor, aber dunkler – für Text auf hellem Hintergrund (Kontrast mind. 4,5:1)
function getBatTextColor(p){if(p>80)return"#2E7D3A";if(p>60)return"#5C7A12";if(p>40)return"#8A6A00";if(p>20)return"#B5402F";return"#9E2F2F";}
// Tipp des Tages: aus dem Datum wird eine feste Zahl berechnet -> den ganzen Tag derselbe Tipp, am nächsten Tag ein anderer
function tipOfDay(dateStr){const all=SOFORTHILFE.flatMap(p=>p.tips.map(t=>({p,t})));let h=0;for(const c of dateStr)h=(h*31+c.charCodeAt(0))>>>0;return all[h%all.length];}
// Motivations-Nachricht auf Home, abhängig vom Batterie-Durchschnitt (null = noch keine Batterie eingerichtet)
function homeMsg(p){if(p===null)return"Willkommen! Starte mit dem Menü oder richte deine Batterien ein.";if(p>80)return"Du rockst das! Weiter so!";if(p>60)return"Gut dabei – bleib dran!";if(p>40)return"Ein kleiner Schritt reicht heute.";if(p>20)return"Deine Batterien brauchen Liebe.";return"Fang mit einer einzigen Sache an.";}
function getBatLabel(p){if(p>80)return"Voll geladen";if(p>60)return"Gut dabei";if(p>40)return"Wird langsam knapp";if(p>20)return"Niedrig — aufladen!";return"Kritisch — kleine Schritte!";}
function isOver(ld,d){if(!ld)return true;return(Date.now()-new Date(ld).getTime())/36e5>d*24;}
function hoursUntilDue(ld,d){if(!ld)return-9999;return(d*24)-((Date.now()-new Date(ld).getTime())/36e5);}
function calcBat(hs){if(!hs.length)return 100;const tw=hs.reduce((s,h)=>s+(h.weight||1),0);let c=0;hs.forEach(h=>{const n=((h.weight||1)/tw)*100;const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];if(!isOver(h.lastDone,iv.days))c+=n;});return Math.round(c);}
function timeAgo(iso){if(!iso)return"Noch nie";const h=(Date.now()-new Date(iso).getTime())/36e5;if(h<1)return"Gerade eben";if(h<24)return`Vor ${Math.floor(h)} Std`;const d=Math.floor(h/24);if(d===1)return"Gestern";if(d<7)return`Vor ${d} Tagen`;const w=Math.floor(d/7);return w===1?"Vor 1 Woche":`Vor ${w} Wochen`;}

/* ═══ SVG ═══ */
const Octopus=({size=80,animate=false})=>(<svg width={size} height={size} viewBox="0 0 100 100" style={animate?{animation:"wiggle .6s ease-in-out infinite"}:{}}><ellipse cx="50" cy="38" rx="30" ry="28" fill="#C8A8E9"/><ellipse cx="50" cy="38" rx="26" ry="24" fill="#DCC8F0"/><circle cx="40" cy="34" r="5" fill="#333"/><circle cx="60" cy="34" r="5" fill="#333"/><circle cx="42" cy="32" r="2" fill="#fff"/><circle cx="62" cy="32" r="2" fill="#fff"/><ellipse cx="50" cy="44" rx="4" ry="2.5" fill="#E8876F"/>{["M25 55Q20 75 15 80","M32 58Q25 78 22 85","M42 60Q38 80 35 88","M58 60Q62 80 65 88","M68 58Q75 78 78 85","M75 55Q80 75 85 80"].map((d,i)=><path key={i} d={d} stroke="#C8A8E9" strokeWidth="6" fill="none" strokeLinecap="round"/>)}</svg>);
const Fox=({size=80,animate=false})=>(<svg width={size} height={size} viewBox="0 0 100 100" style={animate?{animation:"nod 1s ease-in-out infinite"}:{}}><polygon points="30,35 20,10 40,28" fill="#FFB5A7"/><polygon points="70,35 80,10 60,28" fill="#FFB5A7"/><polygon points="32,35 24,16 40,30" fill="#FFE0DA"/><polygon points="68,35 76,16 60,30" fill="#FFE0DA"/><ellipse cx="50" cy="50" rx="28" ry="26" fill="#FFB5A7"/><ellipse cx="50" cy="56" rx="18" ry="16" fill="#FFF5E4"/><circle cx="40" cy="44" r="4" fill="#333"/><circle cx="60" cy="44" r="4" fill="#333"/><circle cx="41.5" cy="42.5" r="1.5" fill="#fff"/><circle cx="61.5" cy="42.5" r="1.5" fill="#fff"/><ellipse cx="50" cy="54" rx="4" ry="2.5" fill="#333"/><path d="M46 58Q50 63 54 58" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>);
const Caterpillar=({size=80,animate=false})=>(<svg width={size} height={size} viewBox="0 0 100 100" style={animate?{animation:"bounce .8s ease-in-out infinite"}:{}}><circle cx="20" cy="65" r="10" fill="#8DD4A8"/><circle cx="35" cy="58" r="11" fill="#9BE0B4"/><circle cx="52" cy="54" r="12" fill="#A8E8C0"/><circle cx="70" cy="50" r="13" fill="#B8E8D0"/><circle cx="70" cy="50" r="9" fill="#D0F0E0"/><circle cx="65" cy="46" r="3.5" fill="#333"/><circle cx="76" cy="46" r="3.5" fill="#333"/><circle cx="66.2" cy="44.5" r="1.3" fill="#fff"/><circle cx="77.2" cy="44.5" r="1.3" fill="#fff"/><path d="M67 54Q70.5 57 74 54" stroke="#6FC49E" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>);
const MiniAnimal=({type,size=44})=>{const m={start:<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="30" ry="22" fill="#8CC8A0"/><path d="M30 52Q50 38 70 52" fill="#6CB888"/><ellipse cx="80" cy="42" rx="8" ry="7" fill="#A8D8B8"/><circle cx="78" cy="40" r="2.5" fill="#333"/></svg>,overwhelm:<svg width={size} height={size} viewBox="0 0 100 100"><circle cx="30" cy="28" r="14" fill="#D4A574"/><circle cx="70" cy="28" r="14" fill="#D4A574"/><ellipse cx="50" cy="52" rx="28" ry="26" fill="#D4A574"/><circle cx="40" cy="46" r="4" fill="#333"/><circle cx="60" cy="46" r="4" fill="#333"/><ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#333"/></svg>,focus:<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="30" cy="40" rx="20" ry="22" fill="#D8B8F0" transform="rotate(-15 30 40)"/><ellipse cx="70" cy="40" rx="20" ry="22" fill="#D8B8F0" transform="rotate(15 70 40)"/><ellipse cx="50" cy="50" rx="5" ry="18" fill="#9B7CC0"/><circle cx="50" cy="30" r="6" fill="#9B7CC0"/><circle cx="47" cy="28" r="2" fill="#333"/><circle cx="53" cy="28" r="2" fill="#333"/></svg>,restless:<svg width={size} height={size} viewBox="0 0 100 100"><circle cx="25" cy="45" r="12" fill="#D4A574"/><circle cx="75" cy="45" r="12" fill="#D4A574"/><ellipse cx="50" cy="48" rx="25" ry="24" fill="#C49464"/><circle cx="42" cy="42" r="3.5" fill="#333"/><circle cx="58" cy="42" r="3.5" fill="#333"/><path d="M44 58Q50 63 56 58" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>,decisions:<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="30" ry="22" fill="#C4A882"/><ellipse cx="35" cy="58" rx="14" ry="12" fill="#E8D8C4"/><circle cx="30" cy="54" r="3" fill="#333"/></svg>,emotions:<svg width={size} height={size} viewBox="0 0 100 100"><circle cx="28" cy="30" r="14" fill="#A0B8C8"/><circle cx="72" cy="30" r="14" fill="#A0B8C8"/><ellipse cx="50" cy="50" rx="26" ry="25" fill="#B0C8D8"/><circle cx="40" cy="44" r="4" fill="#333"/><circle cx="60" cy="44" r="4" fill="#333"/><ellipse cx="50" cy="55" rx="6" ry="4" fill="#444"/></svg>,timeblind:<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="42" cy="68" rx="28" ry="10" fill="#E8D4B8"/><circle cx="62" cy="48" r="22" fill="#E8C8A8"/><circle cx="62" cy="48" r="15" fill="#D4A880"/><ellipse cx="30" cy="60" rx="10" ry="8" fill="#E8D4C0"/><circle cx="26" cy="56" r="2.5" fill="#333"/></svg>,forget:<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="50" cy="48" rx="28" ry="26" fill="#B0B8C8"/><ellipse cx="25" cy="42" rx="12" ry="16" fill="#A0A8B8"/><ellipse cx="75" cy="42" rx="12" ry="16" fill="#A0A8B8"/><circle cx="38" cy="40" r="4" fill="#333"/><circle cx="58" cy="40" r="4" fill="#333"/><path d="M50 52Q48 62 45 70Q48 72 52 70Q50 62 50 52" fill="#A0A8B8"/></svg>};return m[type]||<span style={{fontSize:size*.6}}>{type}</span>;};
const Star=({filled=false,size=24})=>(<svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={filled?"#FFD700":"#E8E0D8"} stroke={filled?"#E8A800":"none"} strokeWidth=".5"/></svg>);
const Mascots={appetizer:Octopus,entree:Fox,side:Caterpillar};
// Auswahl für eigene Tipps (Material-Symbol-Namen)
const ICON_PICK=["lightbulb","star","target","extension","directions_run","music_note","edit_note","air","self_improvement","fitness_center","eco","notifications","photo_camera","sticky_note_2","coffee","volunteer_activism","palette","key","ac_unit","auto_awesome"];
const BatterySVG=({pct,size=100})=>{const color=getBatColor(pct),h=60,w=36,r=6;return(<svg width={size} height={size} viewBox="0 0 80 80"><g transform={`translate(${40-w/2},10)`}><rect x={w/2-6} y={-4} width={12} height={6} rx={2} fill="#ccc"/><rect x={0} y={0} width={w} height={h} rx={r} fill="none" stroke="#D0D0D0" strokeWidth={2.5}/><clipPath id={`bc${size}${pct}`}><rect x={1.5} y={1.5} width={w-3} height={h-3} rx={r-1}/></clipPath><rect x={1.5} y={1.5+(h-3)-(h-3)*pct/100} width={w-3} height={(h-3)*pct/100} fill={color} clipPath={`url(#bc${size}${pct})`} style={{transition:"all .6s ease-out"}}/>{[20,40,60,80].map(l=><line key={l} x1={3} y1={h-h*l/100} x2={w-3} y2={h-h*l/100} stroke="#fff" strokeWidth={1} opacity={.5}/>)}</g><text x={40} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill={color} fontFamily="Fredoka,sans-serif">{pct}%</text></svg>);};

/* ═══ NOTIFICATIONS ═══ */
function requestNotifPermission(){if("Notification" in window&&Notification.permission==="default"){Notification.requestPermission();}}
function sendBrowserNotif(title,body){if("Notification" in window&&Notification.permission==="granted"){try{new Notification(title,{body,icon:"/icon-192.png"});}catch{}}}
function buildNotifications(habits,settings){
  const notifs=[];const now=Date.now();
  habits.forEach(h=>{
    if(!h.remind||h.remind==="none")return;
    const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];
    const hLeft=hoursUntilDue(h.lastDone,iv.days);
    const cat=BAT_CATS.find(c=>c.id===h.category);
    if(h.remind==="overdue"&&hLeft<0){notifs.push({type:"overdue",habit:h,cat,msg:`${h.name} ist überfällig (${timeAgo(h.lastDone)})`,color:"#E86A5A"});}
    else if(h.remind==="1day"&&hLeft>0&&hLeft<=24){notifs.push({type:"soon",habit:h,cat,msg:`${h.name} — noch ${Math.round(hLeft)} Std Zeit`,color:"#F0C040"});}
    else if(h.remind==="2days"&&hLeft>0&&hLeft<=48){notifs.push({type:"soon",habit:h,cat,msg:`${h.name} — noch ${Math.round(hLeft)} Std Zeit`,color:"#F0C040"});}
  });
  if(settings?.dailyTip){const sh=SOFORTHILFE[Math.floor(Math.random()*SOFORTHILFE.length)];const t=sh.tips[Math.floor(Math.random()*sh.tips.length)];notifs.push({type:"tip",msg:`${t.title}: ${t.text}`,color:"#C8A8E9",helpId:sh.id});}
  if(settings?.dailyMenu){const cats=Object.values(CATEGORIES);const c=cats[Math.floor(Math.random()*cats.length)];const it=c.defaults[Math.floor(Math.random()*c.defaults.length)];notifs.push({type:"menu",msg:`Menü-Tipp: ${it.name} — ${it.desc}`,color:"#B8E8D0"});}
  return notifs;
}

/* ═══ STORAGE ═══ */
const SK="dopamin_menu_v5";const ld=()=>{try{const r=localStorage.getItem(SK);return r?JSON.parse(r):null;}catch{return null;}};const sv=d=>{try{localStorage.setItem(SK,JSON.stringify(d));}catch{}};const defI=()=>{const it={};Object.values(CATEGORIES).forEach(c=>{it[c.key]=[...c.defaults];});return it;};
// Mitgelieferte Menü-Einträge immer mit dem aktuellen Text laden (z.B. nach dem Entfernen der Emojis). Eigene Einträge bleiben unverändert.
const migI=it=>{if(!it)return defI();const o={};Object.values(CATEGORIES).forEach(c=>{o[c.key]=(it[c.key]||[]).map(x=>c.defaults.find(d=>d.id===x.id)||x);});return o;};

/* ═══ BREAKER: Datum & Terminplanung ═══ */
// Datumsangaben im Breaker sind immer lokale Kalendertage als Text "YYYY-MM-DD".
// Bewusst NICHT toISOString(): das rechnet in UTC, und nachts wäre "heute" dann schon gestern.
const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const parseYmd=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const addDays=(s,n)=>{const d=parseYmd(s);d.setDate(d.getDate()+n);return ymd(d);};
// Tage von a bis b (gerundet, damit die Zeitumstellung keinen halben Tag verschiebt)
const daysBetween=(a,b)=>Math.round((parseYmd(b)-parseYmd(a))/864e5);

// Verteilt die Termine der offenen Schritte:
// - mit Frist: gleichmäßig von heute bis heute + 80 % der Resttage (Puffer gegen Zeitblindheit), Schritt 1 ist heute
// - ohne Frist: 1 Schritt pro Tag ab heute
// Erledigte Schritte und von Hand gesetzte Termine (dueManual) bleiben unverändert. Nie ein Termin in der Vergangenheit.
function planDue(steps,deadline,today){
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
const fmtDay=s=>parseYmd(s).toLocaleDateString("de-DE",{day:"numeric",month:"short"});

// Breaker-Kategorien mit Schritt-Vorlagen (werden beim Zerlegen vorausgefüllt und sind editierbar).
// colorDark/colorLight: geprüfte Text-/Hintergrundfarben (Kontrast mind. 4,5:1)
const BREAKER_CATS=[
  {id:"alltag",icon:"home",label:"Alltag",color:"#F4A0B5",colorDark:"#A83D61",colorLight:"#FCE4EA",steps:["Entscheide wann du es machst","Bereite vor was du brauchst","Mach den ersten kleinen Schritt","Mach weiter oder plane den nächsten Block","Abschließen und aufräumen"]},
  {id:"soziales",icon:"group",label:"Soziales",color:"#A8D8EA",colorDark:"#326B85",colorLight:"#E7F4F9",steps:["Nachricht schreiben","Termin oder Zeitpunkt vorschlagen","In Kalender eintragen","Vorbereiten (Ort, Anfahrt, was mitnehmen)","Durchführen und genießen"]},
  {id:"arbeit",icon:"work",label:"Arbeit",color:"#FFD6A0",colorDark:"#9A5F0E",colorLight:"#FFF4E4",steps:["Aufgabe in einem Satz definieren","Was brauchst du dafür? (Infos, Tools, Zugang)","Ersten Entwurf / ersten Schritt machen","Überprüfen und anpassen","Abgeben oder kommunizieren"]},
  {id:"sport",icon:"directions_run",label:"Sport & Bewegung",color:"#B8E8D0",colorDark:"#2F7D57",colorLight:"#EBF9F2",steps:["Sportkleidung rauslegen","Tasche packen / Route planen","Schuhe anziehen und losgehen","Training durchziehen (auch nur 10 Min zählt!)","Belohnung: Dusche + etwas Schönes"]},
  {id:"gesundheit",icon:"medical_services",label:"Gesundheit",color:"#C8A8E9",colorDark:"#7A52B3",colorLight:"#F0E7F9",steps:["Nummer oder Website raussuchen","Termin machen (anrufen / online buchen)","In Kalender eintragen + Erinnerung setzen","Unterlagen vorbereiten (Versichertenkarte etc.)","Hingehen"]},
  {id:"finanzen",icon:"savings",label:"Finanzen",color:"#E8C8A8",colorDark:"#85592E",colorLight:"#F9F0E7",steps:["Überblick verschaffen (was genau ist zu tun?)","Unterlagen/Zugänge sammeln","Einen konkreten Betrag/Schritt berechnen","Aktion durchführen (überweisen, kündigen, beantragen)","Abhaken und Beleg speichern"]},
  {id:"kreatives",icon:"palette",label:"Kreatives",color:"#FFB5A7",colorDark:"#A6472F",colorLight:"#FFEAE6",steps:["Inspiration sammeln (1–2 Referenzen reichen)","Material / Tools bereitlegen","Einfach anfangen — perfekt muss es nicht sein","15 Min dranbleiben, dann Pause erlaubt","Ergebnis würdigen — egal wie es aussieht"]},
  {id:"haushalt",icon:"cleaning_services",label:"Haushalt",color:"#D8B8D8",colorDark:"#85508A",colorLight:"#F4EBF4",steps:["Einen einzigen Bereich / eine Aufgabe wählen","Timer auf 10 Minuten stellen","Loslegen — nur das Nötigste","Timer klingelt? Entscheide ob du weitermachst oder aufhörst","Aufräumen / Müll rausbringen"]},
];
// Gespeicherte Meilensteine beim Laden prüfen: kaputte Einträge weglassen, fehlende Felder auffüllen.
// So kann beschädigter localStorage den Breaker nicht zum Absturz bringen.
const isYmd=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v);
function cleanTasks(raw){
  if(!Array.isArray(raw))return[];
  return raw.filter(t=>t&&typeof t.id==="string"&&typeof t.name==="string").map(t=>({
    id:t.id,name:t.name,deadline:isYmd(t.deadline)?t.deadline:null,deadlineType:t.deadlineType==="hard"||t.deadlineType==="soft"?t.deadlineType:null,
    category:BREAKER_CATS.some(c=>c.id===t.category)?t.category:null,why:typeof t.why==="string"?t.why:"",reward:typeof t.reward==="string"?t.reward:"",
    batCat:BAT_CATS.some(c=>c.id===t.batCat)?t.batCat:null,batWeight:[1,2,3,4,5].includes(t.batWeight)?t.batWeight:2,
    steps:(Array.isArray(t.steps)?t.steps:[]).filter(s=>s&&typeof s.id==="string"&&typeof s.text==="string").map(s=>({id:s.id,text:s.text,done:!!s.done,custom:!!s.custom,due:isYmd(s.due)?s.due:null,dueManual:!!s.dueManual})),
    created:typeof t.created==="string"?t.created:new Date(0).toISOString(),lastProgress:typeof t.lastProgress==="string"?t.lastProgress:null,completed:typeof t.completed==="string"?t.completed:null,
  }));
}
// Welche Batterie passt zu welcher Breaker-Kategorie? (wird beim Zerlegen vorgeschlagen/vorausgewählt)
const BREAKER_TO_BAT={sport:"bewegung",soziales:"sozial",kreatives:"kreativ",haushalt:"haushalt"};
// Sortierung: früheste Frist zuerst, ohne Frist ganz unten, sonst nach Erstellung
const byDeadline=(a,b)=>{const x=a.deadline||"9999-12-31",y=b.deadline||"9999-12-31";return x<y?-1:x>y?1:a.created<b.created?-1:1;};

/* ═══ ICONS (Google Material Symbols Rounded, gefüllt) ═══ */
// Google liefert nur die Icons aus dieser Liste aus – so bleibt die Schrift klein.
// Neues Icon verwenden? -> Namen hier ergänzen. Alle Namen: https://fonts.google.com/icons
const ICON_NAMES=["ac_unit","add","air","alarm","auto_awesome","battery_charging_full","battery_low","bedtime","bolt","calendar_month","campaign","casino","celebration","chair","check","check_circle","cleaning_services","close","coffee","counter_3","cyclone","delete","directions_run","eco","edit","edit_note","event_busy","expand_more","extension","fast_rewind","favorite","fitness_center","group","headphones","healing","home","hourglass_bottom","hourglass_top","key","label","lightbulb","local_fire_department","location_on","medical_services","menu_book","mobile_off","monetization_on","music_note","notifications","nutrition","palette","park","photo_camera","pinch","psychology","push_pin","record_voice_over","redeem","repeat","restaurant","savings","science","self_improvement","sentiment_stressed","settings","spa","star","sticky_note_2","target","thermostat","timer","volunteer_activism","work"];
const ICON_URL="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&icon_names="+[...ICON_NAMES].sort().join(",")+"&display=block";
// Ein Icon. Rein dekorativ (aria-hidden) – daneben muss immer ein sichtbarer Text stehen.
const Icon=({name,color,size=20,style})=>(<span className="material-symbols-rounded" aria-hidden="true" style={{fontSize:size,lineHeight:1,color,...style}}>{name}</span>);
// Für gespeicherte Nutzerdaten: neue Einträge haben einen Icon-Namen, ältere eigene Tipps noch ein Emoji – beides wird angezeigt.
const Ico=({v,color,size=20})=>/^[a-z0-9_]+$/.test(v||"")?<Icon name={v} color={color} size={size}/>:<span aria-hidden="true" style={{fontSize:size*.85,lineHeight:1}}>{v}</span>;

/* ═══ FOOTER-TABS ═══ */
// Reihenfolge = Reihenfolge im Footer.
// "icon" = Material-Symbol-Name, "iconColor" = Farbe des Icons, "bg" = Hintergrund hinter dem Icon, wenn der Tab aktiv ist.
const TABS=[
  {id:"home",icon:"home",label:"Home",iconColor:"#9B6FCF",bg:"#EDE0F7"},
  {id:"menu",icon:"restaurant",label:"Menü",iconColor:"#E8876F",bg:"#FFE0DA"},
  {id:"breaker",icon:"extension",label:"Breaker",iconColor:"#D9709A",bg:"#FDE2EA"},
  {id:"hilfe",icon:"healing",label:"Hilfe",iconColor:"#5BA3C0",bg:"#D6EEFB"},
  {id:"batterie",icon:"battery_charging_full",label:"Batterie",iconColor:"#4FA97F",bg:"#DFF5EA"},
];

/* ═══ APP ═══ */
const ONBOARDING_DATA = {
  struggles: [
    { id: "focus", label: "Fokus halten", icon: "psychology" },
    { id: "start", label: "In Gang kommen", icon: "bolt" },
    { id: "emotions", label: "Gefühle regulieren", icon: "sentiment_stressed" },
    { id: "overwhelm", label: "Energie & Antrieb", icon: "battery_low" },
    { id: "restless", label: "Gedankenkarussell stoppen", icon: "cyclone" }
  ],
  times: [
    { id: "5", label: "5 Minuten", icon: "timer" },
    { id: "15", label: "15-20 Minuten", icon: "hourglass_bottom" },
    { id: "30", label: "30+ Minuten", icon: "calendar_month" }
  ],
  preferences: [
    { id: "bewegung", label: "Bewegung", icon: "directions_run" },
    { id: "kreativ", label: "Kreatives", icon: "palette" },
    { id: "ruhe", label: "Musik/Sensorik", icon: "music_note" },
    { id: "ruhe_strict", label: "Ruhe/Atemübungen", icon: "self_improvement" }
  ]
};

export default function DopaminMenu(){
  const st = ld();
  const [onboardingComplete, setOnboardingComplete] = useState(localStorage.getItem("onboarding_complete") === "true");
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingProfile, setOnboardingProfile] = useState(st?.onboardingProfile || { struggles: [], time: null, preferences: [] });
  const [showHint, setShowHint] = useState(false);

  const[items,setItems]=useState(migI(st?.items));
  const[stars,setStars]=useState(st?.stars||0);const[streak,setStreak]=useState(st?.streak||0);const[lastDate,setLastDate]=useState(st?.lastDate||null);const[doneToday,setDoneToday]=useState(st?.doneToday||0);
  const[habits,setHabits]=useState(st?.habits||[]);const[customTips,setCustomTips]=useState(st?.customTips||{});const[catOrder,setCatOrder]=useState(st?.catOrder||BAT_CATS.map(c=>c.id));
  const[notifSettings,setNotifSettings]=useState(st?.notifSettings||{dailyTip:false,dailyMenu:false});
  const[activeTimer,setActiveTimer]=useState(null);const[showAdd,setShowAdd]=useState(null);const[nn,setNN]=useState("");const[nd,setND]=useState("");
  const[celebration,setCelebration]=useState(false);const[randomPick,setRandomPick]=useState(null);const[tab,setTab]=useState("home");const[timerOn,setTimerOn]=useState(false);
  const[openProb,setOpenProb]=useState(null);const[showSci,setShowSci]=useState(null);const[addTipFor,setAddTipFor]=useState(null);const[tIcon,setTIcon]=useState("lightbulb");const[tTitle,setTTitle]=useState("");const[tText,setTText]=useState("");
  const[openCat,setOpenCat]=useState(null);const[showHF,setShowHF]=useState(false);const[hN,setHN]=useState("");const[hW,setHW]=useState(1);const[hInt,setHInt]=useState("weekly");const[hRemind,setHRemind]=useState("overdue");
  const[checkAnim,setCheckAnim]=useState(null);const[dragId,setDragId]=useState(null);
  const[showNotifs,setShowNotifs]=useState(false);const[showNotifSettings,setShowNotifSettings]=useState(false);
  const[notifications,setNotifications]=useState([]);
  const timerRef=useRef(null);

  // Breaker: Meilensteine + Zustand der Breaker-Ansicht
  const[tasks,setTasks]=useState(()=>cleanTasks(st?.tasks));
  const[bkName,setBkName]=useState("");const[bkDate,setBkDate]=useState("");
  const[bkDel,setBkDel]=useState(null);   // id des Meilensteins, bei dem gerade "Wirklich löschen?" gefragt wird
  const[bkOpen,setBkOpen]=useState(null); // id des geöffneten Meilensteins (Fragebogen / Schritte)
  const bkInput=useRef(null);
  const[todayYmd]=useState(()=>ymd(new Date()));
  // Fragebogen: Entwurf wird erst bei "Fertig zerlegt" in den Meilenstein übernommen
  const[draft,setDraft]=useState(null); // {name, deadline, category, steps} oder null
  const[bkQ,setBkQ]=useState(1);         // aktueller Fragebogen-Bildschirm
  const[bkSec,setBkSec]=useState({open:true,work:true,done:false}); // welche Listen-Bereiche aufgeklappt sind
  // "Frist vorbei": bei welchem Meilenstein gerade das Datumsfeld bzw. die Loslassen-Rückfrage offen ist
  const[bkNewDate,setBkNewDate]=useState(null);const[bkLetGo,setBkLetGo]=useState(null);
  const[bkToast,setBkToast]=useState(null); // kurze Nachricht unten (z.B. nach dem Loslassen)

  // persist
  useEffect(()=>{sv({items,stars,streak,lastDate,doneToday,habits,customTips,catOrder,notifSettings,onboardingProfile,tasks});},[items,stars,streak,lastDate,doneToday,habits,customTips,catOrder,notifSettings,onboardingProfile,tasks]);

  const finishOnboarding = () => {
    localStorage.setItem("onboarding_complete", "true");

    // Sort CatOrder based on preferences
    const newOrder = [...catOrder];
    onboardingProfile.preferences.forEach(prefId => {
      const actualId = prefId === "ruhe_strict" ? "ruhe" : prefId;
      const idx = newOrder.indexOf(actualId);
      if (idx > -1) {
        newOrder.splice(idx, 1);
        newOrder.unshift(actualId);
      }
    });
    setCatOrder(newOrder);

    // Suggest starter habits if none exist
    if (habits.length === 0) {
      const starters = [];
      if (onboardingProfile.struggles.includes("start")) starters.push({ id: "h_s1", name: "Mini-Morgen-Routine", category: "hygiene", weight: 3, interval: "daily", remind: "overdue", lastDone: null });
      if (onboardingProfile.preferences.includes("bewegung")) starters.push({ id: "h_s2", name: "Täglicher Spaziergang", category: "bewegung", weight: 2, interval: "daily", remind: "overdue", lastDone: null });
      if (onboardingProfile.struggles.includes("focus")) starters.push({ id: "h_s3", name: "Fokus-Session", category: "lernen", weight: 3, interval: "every2", remind: "overdue", lastDone: null });

      if (starters.length > 0) setHabits(starters);
    }

    setOnboardingComplete(true);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 5000);
  };

  const toggleOnboardingSelection = (key, val, multi = true, max = null) => {
    setOnboardingProfile(p => {
      const curr = p[key] || [];
      if (!multi) return { ...p, [key]: val };
      if (curr.includes(val)) return { ...p, [key]: curr.filter(v => v !== val) };
      if (max && curr.length >= max) return p;
      return { ...p, [key]: [...curr, val] };
    });
  };
  useEffect(()=>{const t=new Date().toDateString();if(lastDate&&lastDate!==t){const y=new Date();y.setDate(y.getDate()-1);if(lastDate!==y.toDateString())setStreak(0);setDoneToday(0);}},[]);

  // build notifications on load & every minute
  useEffect(()=>{
    const build=()=>setNotifications(buildNotifications(habits,notifSettings));
    build();
    // send browser notif for overdue on first load
    const overdue=habits.filter(h=>{if(!h.remind||h.remind==="none")return false;const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];return isOver(h.lastDone,iv.days);});
    if(overdue.length>0){sendBrowserNotif("Dopamin-Menü",`${overdue.length} Habit${overdue.length>1?"s":""} überfällig — schau mal rein!`);}
    const interval=setInterval(build,60000);
    return()=>clearInterval(interval);
  },[habits,notifSettings]);

  // timer
  useEffect(()=>{if(activeTimer&&activeTimer.remaining>0){timerRef.current=setInterval(()=>{setActiveTimer(p=>{if(!p)return null;if(p.remaining<=1){clearInterval(timerRef.current);doComplete();return{...p,remaining:0};}return{...p,remaining:p.remaining-1};});},1000);}return()=>clearInterval(timerRef.current);},[activeTimer?.item?.id,timerOn]);

  const doComplete=useCallback(()=>{setCelebration(true);setStars(s=>s+1);const t=new Date().toDateString();setDoneToday(c=>c+1);if(lastDate!==t){setStreak(s=>s+1);setLastDate(t);}setTimeout(()=>setCelebration(false),3000);},[lastDate]);
  const startTm=(ck,item)=>{clearInterval(timerRef.current);setActiveTimer({category:ck,item,remaining:CATEGORIES[ck].duration});setTimerOn(true);};
  const stopTm=()=>{clearInterval(timerRef.current);setActiveTimer(null);setTimerOn(false);};
  const pickR=()=>{const cs=Object.keys(CATEGORIES);const ck=cs[Math.floor(Math.random()*cs.length)];const ci=items[ck];setRandomPick({catKey:ck,item:ci[Math.floor(Math.random()*ci.length)]});};
  const addI=ck=>{if(!nn.trim())return;setItems(p=>({...p,[ck]:[...p[ck],{id:"c_"+Date.now(),name:nn.trim(),desc:nd.trim()}]}));setNN("");setND("");setShowAdd(null);};
  const rmI=(ck,id)=>{setItems(p=>({...p,[ck]:p[ck].filter(i=>i.id!==id)}));};
  const fmt=s=>Math.floor(s/60)+":"+(s%60).toString().padStart(2,"0");
  const prog=activeTimer?1-activeTimer.remaining/CATEGORIES[activeTimer.category].duration:0;
  const addCT=pid=>{if(!tTitle.trim())return;setCustomTips(p=>({...p,[pid]:[...(p[pid]||[]),{id:"ct_"+Date.now(),icon:tIcon,title:tTitle.trim(),text:tText.trim()||"",custom:true}]}));setTIcon("lightbulb");setTTitle("");setTText("");setAddTipFor(null);};
  const rmCT=(pid,tid)=>{setCustomTips(p=>({...p,[pid]:(p[pid]||[]).filter(t=>t.id!==tid)}));};
  const allTips=pid=>{const pr=SOFORTHILFE.find(p=>p.id===pid);return[...(pr?.tips||[]),...(customTips[pid]||[])];};
  const habitsFor=cid=>habits.filter(h=>h.category===cid);
  // Batterie-Inhalt = Habits + verknüpfte, offene Meilensteine (v6.1).
  // Ein Meilenstein zählt wie ein Habit: Gewicht batWeight, Intervall "Alle 2–3 Tage", "zuletzt erledigt" = letzter abgehakter Schritt.
  const batTasks=cid=>tasks.filter(t=>t.batCat===cid&&!t.completed&&t.steps.length).map(t=>({id:"task_"+t.id,taskId:t.id,name:t.name,weight:t.batWeight||2,interval:"every2",lastDone:t.lastProgress}));
  const batItems=cid=>[...habitsFor(cid),...batTasks(cid)];
  const batPct=cid=>calcBat(batItems(cid));
  // Anteil eines Meilensteins an der Batterie in % (wie "+X %" bei Habits). taskId: der Meilenstein selbst wird nicht doppelt gezählt.
  const batShare=(cid,w,taskId)=>{const tw=batItems(cid).filter(x=>x.taskId!==taskId).reduce((s,x)=>s+(x.weight||1),0)+w;return Math.round(w/tw*100);};
  // Ist der Anteil gerade geladen? (letzter Schritt vor weniger als 2–3 Tagen)
  const batCharged=t=>!isOver(t.lastProgress,(INTERVALS.find(i=>i.id==="every2")||INTERVALS[1]).days);
  const addHabit=cid=>{if(!hN.trim())return;setHabits(p=>[...p,{id:"h_"+Date.now(),name:hN.trim(),category:cid,weight:hW,interval:hInt,remind:hRemind,lastDone:null}]);setHN("");setHW(1);setHInt("weekly");setHRemind("overdue");setShowHF(false);};
  const checkIn=hid=>{setHabits(p=>p.map(h=>h.id===hid?{...h,lastDone:new Date().toISOString()}:h));setCheckAnim(hid);setTimeout(()=>setCheckAnim(null),800);setStars(s=>s+1);};
  const rmH=hid=>{setHabits(p=>p.filter(h=>h.id!==hid));};
  const goToHelp=hid=>{setTab("hilfe");setOpenProb(hid);setOpenCat(null);setShowNotifs(false);};
  // Tab wechseln und offene Detailansichten schließen (Footer-Navigation)
  const goTab=k=>{setTab(k);setOpenProb(null);setOpenCat(null);setShowNotifs(false);setBkOpen(null);setBkDel(null);setDraft(null);setBkNewDate(null);setBkLetGo(null);};

  // Breaker: Meilenstein schnell eintippen ("Rauskippen"). Feld wird sofort geleert, Fokus bleibt für den nächsten Eintrag.
  const addTask=e=>{e.preventDefault();const n=bkName.trim();if(!n)return;
    setTasks(p=>[...p,{id:"t_"+Date.now(),name:n,deadline:bkDate||null,deadlineType:null,category:null,why:"",reward:"",steps:[],created:new Date().toISOString(),lastProgress:null,completed:null}]);
    setBkName("");setBkDate("");bkInput.current?.focus();};
  const rmTask=id=>{setTasks(p=>p.filter(t=>t.id!==id));setBkDel(null);};

  // Fragebogen ("Zerlegen →")
  const startBreak=t=>{setBkOpen(t.id);setBkQ(1);setDraft({name:t.name,deadline:t.deadline||"",category:null,steps:[],why:"",first:"",deadlineType:null,batCat:null,batWeight:2,reward:""});};
  // Optionale Fragen (ab Bildschirm 3). "Echte Frist?" nur mit Datum, "Batterie?" nur, wenn es eingerichtete Batterien gibt.
  const bkOpt=draft?["why","first",...(draft.deadline?["dtype"]:[]),...(habits.length?["battery"]:[]),"reward"]:[];
  // Batterie-Verknüpfung: nur eingerichtete Batterien (mit Habits), die zur Breaker-Kategorie passende zuerst
  const batChoices=cat=>{const m=BREAKER_TO_BAT[cat];const ids=catOrder.filter(cid=>habits.some(h=>h.category===cid));return[...ids].sort((a,b)=>(b===m)-(a===m));};
  const bkTotal=bkQ>2?2+bkOpt.length:2; // Fortschrittspunkte: optionale Fragen erst zeigen, wenn man sie beantworten will
  const bkNextQ=()=>setBkQ(q=>q+1);
  // Belohnungs-Vorschläge: Sides + Appetizers aus dem Menü (inkl. eigener Einträge), keine Entrées (= Deep Work)
  const rewardIdeas=[...(items.side||[]),...(items.appetizer||[])].map(i=>i.name);
  const closeBreak=()=>{setBkOpen(null);setDraft(null);};
  // Kategorie wählen -> Schritt-Vorlage einsetzen (nur wenn sich die Kategorie wirklich ändert)
  // Passende Batterie wird automatisch vorgemerkt (nur wenn sie eingerichtet ist), änderbar in der Batterie-Frage und in der Schritt-Ansicht
  const pickBkCat=cid=>setDraft(d=>d.category===cid?d:{...d,category:cid,batCat:BREAKER_TO_BAT[cid]&&habits.some(h=>h.category===BREAKER_TO_BAT[cid])?BREAKER_TO_BAT[cid]:null,steps:BREAKER_CATS.find(c=>c.id===cid).steps.map((text,i)=>({id:"s"+(i+1),text,done:false,custom:false,due:null,dueManual:false}))});
  // Bei jedem Wechsel auf die Schritte werden die automatischen Termine neu verteilt (z.B. nach Änderung der Frist)
  const toBkSteps=()=>{setDraft(d=>({...d,steps:planDue(d.steps,d.deadline||null,todayYmd)}));setBkQ(2);};
  const updDraftStep=(sid,patch)=>setDraft(d=>({...d,steps:d.steps.map(s=>s.id===sid?{...s,...patch}:s)}));
  const rmDraftStep=sid=>setDraft(d=>({...d,steps:planDue(d.steps.filter(s=>s.id!==sid),d.deadline||null,todayYmd)}));
  const addDraftStep=()=>setDraft(d=>({...d,steps:planDue([...d.steps,{id:"c"+Date.now(),text:"",done:false,custom:true,due:null,dueManual:false}],d.deadline||null,todayYmd)}));
  // "Fertig zerlegt": leere Schritte weglassen, Termine final verteilen, in den Meilenstein speichern
  // Der "kleinste erste Schritt" (optional) wird vorne als Schritt 1 eingefügt.
  // "over" = Felder, die beim Speichern noch überschrieben werden (z.B. "Überspringen" bei der letzten Frage leert die Antwort)
  const finishBreak=(over={})=>{const d={...draft,...over};let steps=d.steps.filter(s=>s.text.trim()).map(s=>({...s,text:s.text.trim()}));
    if(d.first.trim())steps=[{id:"first",text:d.first.trim(),done:false,custom:true,due:null,dueManual:false},...steps];
    if(!steps.length)return;
    setTasks(p=>p.map(t=>t.id===bkOpen?{...t,name:d.name.trim()||t.name,deadline:d.deadline||null,category:d.category,steps:planDue(steps,d.deadline||null,todayYmd),
      why:d.why.trim(),reward:d.reward.trim(),deadlineType:d.deadline?d.deadlineType:null,batCat:d.batCat||null,batWeight:d.batWeight||2}:t));
    setDraft(null);};
  // ── Schritt-Ansicht ──
  const updTask=(id,fn)=>setTasks(p=>p.map(t=>t.id===id?fn(t):t));
  // Ein Schritt zählt wie eine Menü-Aktivität: +1 Stern, "Heute" +1, hält die Streak am Leben
  const stepCredit=()=>{setStars(s=>s+1);setDoneToday(c=>c+1);const d=new Date().toDateString();if(lastDate!==d){setStreak(s=>s+1);setLastDate(d);}};
  // Sind alle Schritte erledigt? -> Meilenstein abschließen, +5 Bonus-Sterne, Feier (mit Belohnung, falls gesetzt)
  const finishIfDone=t=>{if(t.completed||!t.steps.length||t.steps.some(s=>!s.done))return t;
    setStars(s=>s+5);setCelebration({title:t.name,bonus:5,reward:t.reward});setTimeout(()=>setCelebration(false),4500);setBkOpen(null);
    return{...t,completed:new Date().toISOString()};};
  // Abhaken gibt sofort einen Stern; Rückgängig nimmt ihn wieder weg (sonst könnte man Sterne "farmen")
  const toggleStep=(tid,sid)=>{const t=tasks.find(x=>x.id===tid);const s=t?.steps.find(x=>x.id===sid);if(!s)return;
    if(!s.done){stepCredit();setCheckAnim(sid);setTimeout(()=>setCheckAnim(null),800);
      // Verknüpfte Batterie lädt automatisch: der Meilenstein zählt dort wie ein Habit, und lastProgress (unten) ist sein "zuletzt erledigt".
    }
    // Rückgängig: Stern zurück. War der Meilenstein schon erledigt, wird er wieder geöffnet und der Bonus (5) ebenfalls abgezogen –
    // sonst gäbe es beim erneuten Abhaken den Bonus doppelt.
    else{setStars(n=>Math.max(0,n-1-(t.completed?5:0)));setDoneToday(c=>Math.max(0,c-1));}
    // finishIfDone bewusst AUSSERHALB von setTasks aufrufen: React kann Updater doppelt ausführen (StrictMode) -> sonst doppelte Bonus-Sterne
    const next=finishIfDone({...t,steps:t.steps.map(x=>x.id===sid?{...x,done:!x.done}:x),lastProgress:s.done?t.lastProgress:new Date().toISOString(),completed:s.done?null:t.completed});
    updTask(tid,()=>next);};
  const editStep=(tid,sid,patch)=>updTask(tid,t=>({...t,steps:t.steps.map(s=>s.id===sid?{...s,...patch}:s)}));
  // "+1 Tag": vom Termin aus (oder von heute, falls der Termin schon vorbei ist)
  const pushStep=(tid,s)=>editStep(tid,s.id,{due:addDays(s.due&&s.due>todayYmd?s.due:todayYmd,1),dueManual:true});
  const rmStep=(tid,sid)=>{const t=tasks.find(x=>x.id===tid);if(!t)return;const next=finishIfDone({...t,steps:t.steps.filter(s=>s.id!==sid)});updTask(tid,()=>next);};
  // Neuer Schritt in einem erledigten Meilenstein öffnet ihn wieder (Bonus wird zurückgenommen, wie beim Haken-Entfernen)
  const addStep=tid=>{if(tasks.find(t=>t.id===tid)?.completed)setStars(n=>Math.max(0,n-5));updTask(tid,t=>({...t,completed:null,steps:planDue([...t.steps,{id:"c"+Date.now(),text:"",done:false,custom:true,due:null,dueManual:false}],t.deadline,todayYmd)}));};
  // Neue Frist -> offene Schritte neu verteilen (von Hand gesetzte bleiben)
  const setTaskDeadline=(tid,dl)=>updTask(tid,t=>({...t,deadline:dl||null,steps:planDue(t.steps,dl||null,todayYmd)}));

  // Einheitliche, aufklappbare Bereichs-Überschrift für die drei Listen im Breaker
  const bkHead=(key,icon,color,label,count)=>(
    <button style={S.bkSecHead} aria-expanded={bkSec[key]} aria-controls={`bksec-${key}`} onClick={()=>setBkSec(p=>({...p,[key]:!p[key]}))}>
      <Icon name={icon} color={color} size={18}/>
      <span style={{flex:1,textAlign:"left"}}>{label} <span style={{fontWeight:500,color:"#6B5F7F"}}>({count})</span></span>
      <Icon name="expand_more" color="#6B5F7F" size={22} style={{transition:"transform .2s",transform:bkSec[key]?"rotate(180deg)":"none"}}/>
    </button>);

  // Home "Erledigen": Button wird kurz grün ("Erledigt" mit Haken-Icon), die Zeile blendet aus, DANN wird abgehakt und der nächste Eintrag rückt nach.
  // Während der Animation werden weitere Taps ignoriert (kein doppeltes Abhaken).
  const[homeFlash,setHomeFlash]=useState(null);
  const homeDo=(key,fn)=>{if(homeFlash)return;setHomeFlash(key);setTimeout(()=>{fn();setHomeFlash(null);},900);};
  const homeDoneBtn=(key,label,fn)=>{const on=homeFlash===key;return(
    <button style={{...S.homeDone,...(on?S.homeDoneOn:{})}} aria-label={on?`${label}: erledigt`:`${label} erledigen`} onClick={()=>homeDo(key,fn)}>
      {on?<span style={{display:"inline-flex",alignItems:"center",gap:3,animation:"checkPop .4s ease-out"}}>Erledigt <Icon name="check" size={14}/></span>:"Erledigen"}
    </button>);};
  // ── Sanfte Hinweise im Breaker (kein Rot, kein Alarm) ──
  const pastDue=t=>!!t.deadline&&t.deadline<todayYmd&&!t.completed;
  // Tage seit dem letzten abgehakten Schritt (bzw. seit dem Anlegen)
  const stuckDays=t=>daysBetween(ymd(new Date(t.lastProgress||t.created)),todayYmd);
  const isStuck=t=>!t.completed&&t.steps.some(s=>!s.done)&&stuckDays(t)>3;
  // "Loslassen": Meilenstein entfernen + freundliche Nachricht
  const letGo=id=>{rmTask(id);setBkOpen(null);setBkLetGo(null);setBkToast("Losgelassen. Das ist auch eine Entscheidung.");setTimeout(()=>setBkToast(null),3500);};

  // Home: Breaker-Schritte, die heute fällig oder überfällig sind (überfälligste zuerst, max. 3)
  const dueSteps=tasks.filter(t=>!t.completed).flatMap(t=>t.steps.filter(s=>!s.done&&s.due&&s.due<=todayYmd).map(s=>({t,s}))).sort((a,b)=>a.s.due<b.s.due?-1:a.s.due>b.s.due?1:0).slice(0,3);

  const unplanned=tasks.filter(t=>!t.steps.length).sort(byDeadline);
  const planned=tasks.filter(t=>t.steps.length&&!t.completed).sort(byDeadline);
  const doneTasks=tasks.filter(t=>t.completed).sort((a,b)=>a.completed<b.completed?1:-1).slice(0,5);

  const cfgCats=catOrder.filter(cid=>habitsFor(cid).length>0);
  const avgBat=cfgCats.length?Math.round(cfgCats.reduce((s,cid)=>s+batPct(cid),0)/cfgCats.length):null;
  // Home: die 3 leersten Batterien
  const lowBats=cfgCats.map(cid=>({cid,pct:batPct(cid)})).sort((a,b)=>a.pct-b.pct).slice(0,3);
  // Home: Habits, die in den nächsten 24 Std fällig oder schon überfällig sind (dringendste zuerst, max. 3)
  const dueHabits=habits.map(h=>{const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];return{h,left:hoursUntilDue(h.lastDone,iv.days)};}).filter(x=>x.left<=24).sort((a,b)=>a.left-b.left).slice(0,3);
  // Home: Tipp des Tages (Datum wird beim Öffnen der App festgehalten)
  const[today]=useState(()=>new Date().toDateString());
  const dayTip=tipOfDay(today);
  const onDS=(e,id)=>{setDragId(id);e.dataTransfer.effectAllowed="move";};const onDO=e=>{e.preventDefault();};const onDr=(e,tid)=>{e.preventDefault();if(!dragId||dragId===tid)return;setCatOrder(p=>{const a=[...p],fi=a.indexOf(dragId),ti=a.indexOf(tid);a.splice(fi,1);a.splice(ti,0,dragId);return a;});setDragId(null);};
  const getQT=cid=>{const cat=BAT_CATS.find(c=>c.id===cid);const ch=habitsFor(cid);const ov=ch.filter(h=>{const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];return isOver(h.lastDone,iv.days);});const hp=SOFORTHILFE.find(p=>p.id===cat?.helpId);const tips=[];if(ov.length){const e=ov.reduce((a,b)=>(a.weight||1)<(b.weight||1)?a:b);const tw=batItems(cid).reduce((s,h)=>s+(h.weight||1),0);tips.push({icon:"bolt",title:"Schnellster Boost: "+e.name,text:`+${Math.round(((e.weight||1)/tw)*100)}%`,action:()=>checkIn(e.id)});}if(hp?.tips.length){const t=hp.tips[Math.floor(Math.random()*hp.tips.length)];tips.push({animal:hp.id,title:t.title,text:t.text,link:cat?.helpId});}tips.push({icon:"timer",title:"Nur 1 Minute",text:"Timer auf 60 Sek. Tu das Einfachste."});return tips.slice(0,3);};
  const ordCfg=catOrder.filter(cid=>habitsFor(cid).length>0);const ordEmpty=catOrder.filter(cid=>habitsFor(cid).length===0);
  const urgentNotifs=notifications.filter(n=>n.type==="overdue"||n.type==="soon");

  const sortedSoforthilfe = [...SOFORTHILFE].sort((a, b) => {
    const aSelected = onboardingProfile.struggles.includes(a.id);
    const bSelected = onboardingProfile.struggles.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return(
    <div style={S.wrap}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');@import url('${ICON_URL}');*{box-sizing:border-box;margin:0;padding:0}@keyframes wiggle{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}@keyframes nod{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes bounce{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-8px) scaleY(.95)}}@keyframes pop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-120px) rotate(720deg);opacity:0}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes fadeIn{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}@keyframes slideIn{0%{transform:translateX(50px);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}@keyframes checkPop{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}@keyframes rowOut{0%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(24px)}}@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-delay:0s!important;transition-duration:.01ms!important}}@media(min-width:768px){.tablet-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))!important}.bat-grid-t{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))!important}}`}</style>

      {/* ONBOARDING */}
      {!onboardingComplete && (
        <div style={S.obWrap}>
          <div style={S.obCard}>
            <div style={S.obProg}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ ...S.obDot, background: onboardingStep >= s ? "#C8A8E9" : "#E8E0D8" }} />
              ))}
            </div>

            {onboardingStep === 1 && (
              <div style={{ animation: "slideIn .4s ease-out" }}>
                <h2 style={S.obTitle}>Was fällt dir gerade am schwersten?</h2>
                <p style={S.obSub}>Wähle bis zu 3 Bereiche aus.</p>
                <div style={S.obGrid}>
                  {ONBOARDING_DATA.struggles.map(s => (
                    <button
                      key={s.id}
                      style={{ ...S.obOpt, borderColor: onboardingProfile.struggles.includes(s.id) ? "#C8A8E9" : "transparent", background: onboardingProfile.struggles.includes(s.id) ? "#EDE0F7" : "#FFF5E4" }}
                      onClick={() => toggleOnboardingSelection("struggles", s.id, true, 3)}
                    >
                      <Icon name={s.icon} color="#9B6FCF" size={32} />
                      <span style={S.obOptLabel}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div style={{ animation: "slideIn .4s ease-out" }}>
                <h2 style={S.obTitle}>Wie viel Zeit hast du typischerweise für dich?</h2>
                <p style={S.obSub}>Das hilft uns, das Menü für dich zu sortieren.</p>
                <div style={S.obGrid}>
                  {ONBOARDING_DATA.times.map(t => (
                    <button
                      key={t.id} 
                      style={{ ...S.obOpt, borderColor: onboardingProfile.time === t.id ? "#FFB5A7" : "transparent", background: onboardingProfile.time === t.id ? "#FFE0DA" : "#FFF5E4" }}
                      onClick={() => toggleOnboardingSelection("time", t.id, false)}
                    >
                      <Icon name={t.icon} color="#E8876F" size={32} />
                      <span style={S.obOptLabel}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div style={{ animation: "slideIn .4s ease-out" }}>
                <h2 style={S.obTitle}>Was hilft dir normalerweise am besten?</h2>
                <p style={S.obSub}>Deine bevorzugten Aktivitäten.</p>
                <div style={S.obGrid}>
                  {ONBOARDING_DATA.preferences.map(p => (
                    <button
                      key={p.id}
                      style={{ ...S.obOpt, borderColor: onboardingProfile.preferences.includes(p.id) ? "#B8E8D0" : "transparent", background: onboardingProfile.preferences.includes(p.id) ? "#DFF5EA" : "#FFF5E4" }}
                      onClick={() => toggleOnboardingSelection("preferences", p.id, true)}
                    >
                      <Icon name={p.icon} color="#4FA97F" size={32} />
                      <span style={S.obOptLabel}>{p.label}</span>
                    </button>
                  ))}
                </div> 
              </div>
            )}

            <div style={S.obNav}>
              {onboardingStep > 1 ? (
                <button style={S.obBack} onClick={() => setOnboardingStep(s => s - 1)}>Zurück</button>
              ) : <div />}
              <button
                style={{ ...S.obNext, opacity: (onboardingStep === 1 && onboardingProfile.struggles.length > 0) || (onboardingStep === 2 && onboardingProfile.time) || (onboardingStep === 3 &&onboardingProfile.preferences.length > 0) ? 1 : 0.5 }}
                disabled={!((onboardingStep === 1 && onboardingProfile.struggles.length > 0) || (onboardingStep === 2 && onboardingProfile.time) || (onboardingStep === 3 && onboardingProfile.preferences.length >0))}
                onClick={() => onboardingStep < 3 ? setOnboardingStep(s => s + 1) : finishOnboarding()}
              >
                {onboardingStep === 3 ? "Fertig" : "Weiter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HINT */}
      {showHint && <div style={S.hint}>Du kannst alles jederzeit anpassen</div>}
      {bkToast&&<div style={S.hint} role="status">{bkToast}</div>}


      {/* HEADER */}
      <div style={S.hdr}><div style={S.hdrTop}><div style={{animation:"float 3s ease-in-out infinite"}}><Octopus size={34}/></div><div><h1 style={S.title}>Dopamin-Menü</h1></div><div style={{animation:"float 3s ease-in-out infinite 1s"}}><Fox size={34}/></div></div>
        <div style={S.stats}>
          <div style={S.stat}><Icon name="star" color="#E8A820" size={17}/><span style={S.statN}>{stars}</span><span style={S.statL}>Sterne</span></div>
          <div style={S.stat}><Icon name="local_fire_department" color="#F07A4A" size={17}/><span style={S.statN}>{streak}</span><span style={S.statL}>Streak</span></div>
          <div style={S.stat}><Icon name="check_circle" color="#5EC269" size={17}/><span style={S.statN}>{doneToday}</span><span style={S.statL}>Heute</span></div>
          {avgBat!==null&&<div style={{...S.stat,borderLeft:`3px solid ${getBatColor(avgBat)}`}}><Icon name="battery_charging_full" color={getBatColor(avgBat)} size={17}/><span style={{...S.statN,color:getBatColor(avgBat)}}>{avgBat}%</span><span style={S.statL}>Energie</span></div>}
          {/* notif bell */}
          <button style={{...S.stat,cursor:"pointer",border:"none",position:"relative"}} aria-label="Benachrichtigungen" onClick={()=>{setShowNotifs(!showNotifs);setShowNotifSettings(false);requestNotifPermission();}}>
            <Icon name="notifications" color="#9B6FCF" size={18}/>{urgentNotifs.length>0&&<span style={S.notifBadge}>{urgentNotifs.length}</span>}
          </button>
        </div>
      </div>

      {/* NOTIFICATION PANEL */}
      {showNotifs&&<div style={S.notifPanel}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h3 style={{fontSize:15,fontWeight:700,color:"#5B4A6A",display:"flex",alignItems:"center",gap:6}}><Icon name="notifications" color="#9B6FCF" size={18}/>Benachrichtigungen</h3>
          <button style={S.notifGear} aria-label="Einstellungen" onClick={()=>setShowNotifSettings(!showNotifSettings)}><Icon name="settings" color="#9B8AAE" size={20}/></button>
        </div>

        {showNotifSettings&&<div style={S.notifSettingsBox}>
          <h4 style={{fontSize:13,fontWeight:600,color:"#5B4A6A",marginBottom:8}}>Einstellungen</h4>
          <label style={S.notifToggle}><input type="checkbox" checked={notifSettings.dailyTip} onChange={e=>setNotifSettings(p=>({...p,dailyTip:e.target.checked}))}/><Icon name="healing" color="#5BA3C0" size={16}/><span>Täglicher Hilfe-Tipp</span></label>
          <label style={S.notifToggle}><input type="checkbox" checked={notifSettings.dailyMenu} onChange={e=>setNotifSettings(p=>({...p,dailyMenu:e.target.checked}))}/><Icon name="restaurant" color="#E8876F" size={16}/><span>Täglicher Menü-Vorschlag</span></label>
          <p style={{fontSize:10,color:"#9B8AAE",marginTop:6}}>Erinnerungen pro Habit stellst du beim Anlegen oder Bearbeiten ein.</p>
        </div>}

        {notifications.length===0&&<p style={{fontSize:12,color:"#9B8AAE",textAlign:"center",padding:"16px 0"}}>Alles im grünen Bereich!</p>}
        {notifications.map((n,i)=>(<div key={i} style={{...S.notifItem,borderLeftColor:n.color,animation:`fadeIn .2s ease-out ${i*.05}s both`}}>
          <p style={{fontSize:12,color:"#5B4A6A",lineHeight:1.4}}>{n.msg}</p>
          {n.type==="overdue"&&<button style={{...S.notifAction,background:n.color}} onClick={()=>{checkIn(n.habit.id);setShowNotifs(false);}}>Erledigt <Icon name="check" size={13} style={{verticalAlign:"-2px"}}/></button>}
          {n.link&&<button style={{...S.notifAction,background:"#A8D8EA"}} onClick={()=>goToHelp(n.link)}>Hilfe →</button>}
        </div>))}
      </div>}

      {tab==="menu"&&!timerOn&&<button style={S.rndBtn} onClick={pickR}><Icon name="casino" color="#9B6FCF" size={20}/>Ich brauch was!</button>}

      {/* MODALS */}
      {randomPick&&<div style={S.ov} onClick={()=>setRandomPick(null)}><div style={S.modal} onClick={e=>e.stopPropagation()}><p style={{fontSize:12,color:"#9B8AAE",marginBottom:7}}>Dein Gehirn bekommt...</p>{(()=>{const M=Mascots[randomPick.catKey];return<M size={62} animate/>;})()}<h3 style={{fontSize:18,fontWeight:700,marginTop:4,color:CATEGORIES[randomPick.catKey].colorDark}}>{randomPick.item.name}</h3><p style={{fontSize:12,color:"#6B5F7F",margin:"3px 0"}}>{randomPick.item.desc}</p><div style={{display:"flex",gap:8,marginTop:12}}><button style={{...S.modBtn,background:CATEGORIES[randomPick.catKey].color}} onClick={()=>{startTm(randomPick.catKey,randomPick.item);setRandomPick(null);}}>Los!</button><button style={{...S.modBtn,background:"#E8E0D8",color:"#666"}} onClick={()=>{setRandomPick(null);pickR();}}><Icon name="casino" size={15} style={{verticalAlign:"-3px",marginRight:4}}/>Nochmal</button></div></div></div>}
      {celebration&&<div style={S.celeb} role="status" onClick={()=>setCelebration(false)}><div style={{animation:"pop .5s ease-out",textAlign:"center",padding:16}}><p style={{fontSize:24,fontWeight:700,color:"#5B4A6A"}}>Geschafft!</p>{celebration.title&&<p style={{fontSize:15,fontWeight:600,color:"#5B4A6A",marginTop:4,overflowWrap:"anywhere"}}>„{celebration.title}“ ist erledigt</p>}<div style={{display:"flex",gap:4,justifyContent:"center",margin:"10px 0"}}>{[...Array(5)].map((_,i)=><div key={i} style={{animation:`pop .3s ease-out ${i*.1}s both`}}><Star filled size={28}/></div>)}</div><p style={{fontSize:14,color:"#9B6FCF",fontWeight:600}}>+{celebration.bonus||1} <Icon name="star" color="#E8A820" size={16} style={{verticalAlign:"-3px"}}/> {celebration.bonus?"Bonus ":""}für dich!</p>{celebration.reward&&<p style={{fontSize:15,fontWeight:700,color:"#A83D61",marginTop:8,overflowWrap:"anywhere"}}>Du hast dir „{celebration.reward}“ verdient!</p>}</div></div>}
      {timerOn&&activeTimer&&<div style={{...S.tmV,background:CATEGORIES[activeTimer.category].colorLight}}><div style={{animation:"float 2.5s ease-in-out infinite"}}>{(()=>{const M=Mascots[activeTimer.category];return<M size={86} animate={activeTimer.remaining>0}/>;})()}</div><h2 style={{fontSize:19,fontWeight:700,color:CATEGORIES[activeTimer.category].colorDark}}>{activeTimer.item.name}</h2><p style={{fontSize:12,color:"#6B5F7F",marginBottom:4}}>{activeTimer.item.desc}</p><div style={S.tmR}><svg width="164" height="164" viewBox="0 0 164 164"><circle cx="82" cy="82" r="70" fill="none" stroke="#fff" strokeWidth="8" opacity=".5"/><circle cx="82" cy="82" r="70" fill="none" stroke={CATEGORIES[activeTimer.category].color} strokeWidth="8" strokeLinecap="round" strokeDasharray={2*Math.PI*70} strokeDashoffset={2*Math.PI*70*(1-prog)} transform="rotate(-90 82 82)" style={{transition:"stroke-dashoffset 1s linear"}}/></svg><div style={S.tmTx}>{activeTimer.remaining>0?<span style={{fontSize:32,fontWeight:700,color:CATEGORIES[activeTimer.category].colorDark}}>{fmt(activeTimer.remaining)}</span>:<Icon name="celebration" color={CATEGORIES[activeTimer.category].colorDark} size={44}/>}</div></div><button style={{background:"#fff",border:`2.5px solid ${CATEGORIES[activeTimer.category].colorDark}`,borderRadius:50,padding:"9px 22px",fontSize:13,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",color:CATEGORIES[activeTimer.category].colorDark,marginTop:4}} onClick={stopTm}>{activeTimer.remaining===0?"Zurück":"Abbrechen"}</button></div>}

      {/* ═══ MENÜ ═══ */}
      {tab==="menu"&&!timerOn&&<div style={S.cats}>{Object.values(CATEGORIES).sort((a,b) => {
        if (onboardingProfile.time === "5") {
          if (a.key === "appetizer") return -1;
          if (b.key === "appetizer") return 1;
        } else if (onboardingProfile.time === "15") {
          if (a.key === "side") return -1;
          if (b.key === "side") return 1;
        } else if (onboardingProfile.time === "30") {
          if (a.key === "entree") return -1;
          if (b.key === "entree") return 1;
        }
        return 0;
      }).map(cat=>{const M=Mascots[cat.key];return(<div key={cat.key}><div style={{...S.cH,background:cat.colorLight}}><M size={40}/><div><h2 style={{fontSize:15,fontWeight:700,color:cat.colorDark}}>{cat.label}</h2><p style={{fontSize:10,fontWeight:500,color:cat.colorDark,opacity:.8}}>{cat.subtitle} · {cat.duration/60} Min</p></div></div><div className="tablet-grid" style={S.gr}>{items[cat.key].map(item=>(<div key={item.id} style={{...S.cd,borderColor:cat.color}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><h3 style={{fontSize:13,fontWeight:600,color:"#4A3D5C"}}>{item.name}</h3>{item.id.startsWith("c_")&&<button style={S.rm} onClick={()=>rmI(cat.key,item.id)}>×</button>}</div><p style={{fontSize:10.5,color:"#8B7FA0",lineHeight:1.35,flex:1}}>{item.desc}</p><button style={{...S.ab,background:cat.color,color:cat.colorDark}} onClick={()=>startTm(cat.key,item)}>Starten ▶</button></div>))}{showAdd===cat.key?(<div style={{...S.cd,borderColor:cat.color,borderStyle:"dashed"}}><input style={{...S.inp,borderColor:cat.color}} placeholder="Name" value={nn} onChange={e=>setNN(e.target.value)} autoFocus/><input style={{...S.inp,borderColor:cat.color}} placeholder="Beschreibung" value={nd} onChange={e=>setND(e.target.value)}/><div style={{display:"flex",gap:6}}><button style={{...S.ab,background:cat.color,color:cat.colorDark,flex:1}} onClick={()=>addI(cat.key)}>OK</button><button style={{...S.ab,background:"#E8E0D8",color:"#888",flex:1}} onClick={()=>{setShowAdd(null);setNN("");setND("");}}>×</button></div></div>):(<button style={{...S.addCd,borderColor:cat.color,color:cat.colorDark}} onClick={()=>setShowAdd(cat.key)}>+</button>)}</div></div>);})}</div>}

      {/* ═══ HILFE ═══ */}
      {tab==="hilfe"&&!timerOn&&<div style={{padding:"4px 16px"}}><div style={S.hI}><Caterpillar size={40} animate/><p style={{fontSize:12,color:"#5B4A6A",fontWeight:500,lineHeight:1.4}}>Was macht dir gerade zu schaffen?</p></div>
        {!openProb?(<div className="tablet-grid" style={S.pG}>{sortedSoforthilfe.map((p,i)=>(<button key={p.id} style={{...S.pC,background:p.colorLight,borderColor:p.color,animation:`fadeIn .3s ease-out ${i*.04}s both`}} onClick={()=>setOpenProb(p.id)}><MiniAnimal type={p.id} size={44}/><span style={{fontSize:11.5,fontWeight:600,textAlign:"center",lineHeight:1.25,color:p.colorDark}}>{p.title}</span><span style={{fontSize:9.5,fontWeight:500,color:"#9B8AAE"}}>{p.animal}</span></button>))}</div>)
        :(()=>{const pr=SOFORTHILFE.find(p=>p.id===openProb);const tips=allTips(openProb);return(<div style={{animation:"fadeIn .3s ease-out"}}><button style={S.bk} onClick={()=>{setOpenProb(null);setAddTipFor(null);}}>← Zurück</button>
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:16,marginBottom:8,background:pr.colorLight}}><MiniAnimal type={pr.id} size={50}/><div style={{flex:1}}><h2 style={{fontSize:17,fontWeight:700,color:pr.colorDark}}>{pr.title}</h2><p style={{fontSize:11,fontWeight:500,opacity:.8,color:pr.colorDark}}>{pr.animal} hat Tipps</p></div><button style={{background:"#fff",border:`2px solid ${pr.color}`,borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}} aria-label="Wissenschaftliche Quellen" onClick={()=>setShowSci(showSci===pr.id?null:pr.id)}><Icon name="science" color={pr.colorDark} size={18}/></button></div>
          {showSci===pr.id&&<div style={{borderRadius:12,border:`2px solid ${pr.color}`,padding:"8px 12px",marginBottom:8,background:pr.colorLight}}><p style={{fontSize:11.5,lineHeight:1.5,fontWeight:500,color:pr.colorDark}}><Icon name="menu_book" color={pr.colorDark} size={14} style={{verticalAlign:"-2px",marginRight:4}}/>{pr.science}</p></div>}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{tips.map((t,i)=>(<div key={t.id} style={{background:"#fff",borderRadius:14,padding:11,border:`2px solid ${pr.color}`,display:"flex",gap:9,alignItems:"flex-start",animation:`fadeIn .3s ease-out ${i*.05}s both`}}><div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,background:pr.colorLight}}><Ico v={t.icon} color={pr.colorDark} size={18}/></div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{fontSize:13,fontWeight:600,color:pr.colorDark,marginBottom:2}}>{t.title}</h3>{t.custom&&<button style={S.rm} onClick={()=>rmCT(pr.id,t.id)}>×</button>}</div><p style={{fontSize:11.5,color:"#5B4A6A",lineHeight:1.45}}>{t.text}</p></div></div>))}</div>
          {addTipFor===pr.id?(<div style={{background:"#fff",borderRadius:16,border:`2.5px solid ${pr.color}`,padding:14,marginTop:10,animation:"fadeIn .2s ease-out"}}><label style={S.fL}>Icon:</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{ICON_PICK.map(e=>(<button key={e} aria-label={e.replace(/_/g," ")} aria-pressed={tIcon===e} style={{width:32,height:32,borderRadius:7,border:`2px solid ${tIcon===e?pr.color:"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:tIcon===e?pr.colorLight:"transparent"}} onClick={()=>setTIcon(e)}><Icon name={e} color={pr.colorDark} size={18}/></button>))}</div><input style={{...S.inp,borderColor:pr.color,marginTop:6}} placeholder="Titel" value={tTitle} onChange={e=>setTTitle(e.target.value)} autoFocus/><textarea style={{...S.inp,borderColor:pr.color,marginTop:5,minHeight:50,resize:"vertical"}} placeholder="Was hilft dir?" value={tText} onChange={e=>setTText(e.target.value)}/><div style={{display:"flex",gap:6,marginTop:6}}><button style={{...S.ab,background:pr.color,color:"#fff",flex:1,padding:"9px 0"}} onClick={()=>addCT(pr.id)}>OK</button><button style={{...S.ab,background:"#E8E0D8",color:"#888",flex:1,padding:"9px 0"}} onClick={()=>{setAddTipFor(null);setTTitle("");setTText("");}}>×</button></div></div>):(<button style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"10px",borderRadius:14,border:`2.5px dashed ${pr.color}`,background:"#fff",fontSize:13,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",marginTop:10,color:pr.colorDark}} onClick={()=>setAddTipFor(pr.id)}>+ Eigenen Tipp</button>)}
        </div>);})()}</div>}

      {/* ═══ HOME ═══ */}
      {tab==="home"&&!timerOn&&<div style={S.home}>
        {/* B) Motivations-Nachricht */}
        <p style={{...S.homeMsg,color:avgBat===null?"#7A52B3":getBatTextColor(avgBat)}}>{homeMsg(avgBat)}</p>

        {/* C) Batterie-Übersicht: die 3 leersten Batterien */}
        <section aria-label="Batterie-Übersicht">
          <h3 style={S.secT}>Deine Batterien</h3>
          {!cfgCats.length?(
            <button style={S.homeCard} onClick={()=>goTab("batterie")}><Icon name="battery_charging_full" color="#4FA97F" size={22}/><span style={{flex:1,textAlign:"left"}}>Richte deine erste Batterie ein →</span></button>
          ):lowBats[0].pct>80?(
            <p style={S.homeOk}><Icon name="check_circle" color="#5EC269" size={20}/>Alle Batterien geladen!</p>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>{lowBats.map((b,i)=>{const bc=BAT_CATS.find(c=>c.id===b.cid);return(
              <button key={b.cid} style={{...S.homeCard,animation:`fadeIn .3s ease-out ${i*.05}s both`}} onClick={()=>{goTab("batterie");setOpenCat(b.cid);}}>
                <Icon name={bc.icon} color={bc.colorDark} size={22}/>
                <span style={{flex:1,textAlign:"left"}}>{bc.label}</span>
                <span style={S.miniBar}><span style={{display:"block",height:"100%",width:`${b.pct}%`,background:getBatColor(b.pct),borderRadius:4}}/></span>
                <span style={{width:38,textAlign:"right",fontWeight:700,color:getBatTextColor(b.pct)}}>{b.pct}%</span>
              </button>
            );})}</div>
          )}
        </section>

        {/* D) Dein Fokus: fällige und überfällige Habits + Breaker-Schritte */}
        <section aria-label="Dein Fokus">
          <h3 style={S.secT}>Dein Fokus</h3>
          {dueHabits.length===0&&dueSteps.length===0?(
            <p style={S.homeOk}><Icon name="eco" color="#5EC269" size={20}/>Alles erledigt – gut gemacht!</p>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>{dueHabits.map(({h,left},i)=>{const bc=BAT_CATS.find(c=>c.id===h.category);const ov=left<0;return(
              <div key={h.id} style={{...S.homeCard,cursor:"default",animation:homeFlash==="h"+h.id?S.rowOut:`fadeIn .3s ease-out ${i*.05}s both`}}>
                <span aria-hidden="true" style={{width:10,height:10,borderRadius:5,flexShrink:0,background:ov?"#E86A5A":"#F0C040"}}/>
                <span style={{flex:1,minWidth:0}}>
                  <span style={{display:"block"}}>{h.name}</span>
                  <span style={{fontSize:10.5,fontWeight:500,color:ov?"#B5402F":"#8A6A00"}}>{ov?"überfällig":"heute fällig"}</span>
                </span>
                {bc&&<Icon name={bc.icon} color={bc.colorDark} size={18}/>}
                {homeDoneBtn("h"+h.id,h.name,()=>checkIn(h.id))}
              </div>
            );})}
            {/* Fällige Breaker-Schritte: Text antippen öffnet den Meilenstein, "Erledigt" hakt ab (wie im Breaker) */}
            {dueSteps.map(({t,s},i)=>{const ov=s.due<todayYmd;return(
              <div key={s.id+t.id} style={{...S.homeCard,cursor:"default",animation:homeFlash==="s"+t.id+s.id?S.rowOut:`fadeIn .3s ease-out ${(dueHabits.length+i)*.05}s both`}}>
                <span aria-hidden="true" style={{width:10,height:10,borderRadius:5,flexShrink:0,background:ov?"#E86A5A":"#F0C040"}}/>
                <button style={S.homeStepLink} onClick={()=>{goTab("breaker");setBkOpen(t.id);}}>
                  <span style={{display:"block",overflowWrap:"anywhere"}}>{s.text}</span>
                  <span style={{fontSize:10.5,fontWeight:500,color:ov?"#B5402F":"#8A6A00"}}>{ov?"überfällig":"heute fällig"} · <span style={{color:"#6B5F7F"}}>{t.name}</span></span>
                </button>
                <Icon name="extension" color="#D9709A" size={18}/>
                {homeDoneBtn("s"+t.id+s.id,s.text,()=>toggleStep(t.id,s.id))}
              </div>
            );})}</div>
          )}
        </section>

        {/* E) Zufalls-Aktivität (öffnet dasselbe Modal wie im Menü) */}
        <button style={S.rndBtn} onClick={pickR}><Icon name="casino" color="#9B6FCF" size={20}/>Ich brauch was!</button>

        {/* F) Tipp des Tages: Tap öffnet die passende Hilfe-Kategorie */}
        <section aria-label="Tipp des Tages">
          <h3 style={S.secT}>Tipp des Tages</h3>
          <button style={{...S.homeCard,alignItems:"flex-start"}} onClick={()=>goToHelp(dayTip.p.id)}>
            <MiniAnimal type={dayTip.p.id} size={40}/>
            <span style={{flex:1,textAlign:"left"}}>
              <span style={{display:"flex",alignItems:"center",gap:4,color:dayTip.p.colorDark}}><Icon name={dayTip.t.icon} color={dayTip.p.colorDark} size={16}/>{dayTip.t.title}</span>
              <span style={S.clamp2}>{dayTip.t.text}</span>
            </span>
          </button>
        </section>
      </div>}

      {/* ═══ BREAKER ═══ */}
      {tab==="breaker"&&!timerOn&&<div style={S.home}>
        {bkOpen&&draft?(()=>{const dc=BREAKER_CATS.find(c=>c.id===draft.category);return(
          /* Stufe 2: Fragebogen – eine Frage pro Bildschirm */
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button style={{...S.bk,alignSelf:"flex-start"}} onClick={()=>bkQ===1?closeBreak():setBkQ(q=>q-1)}>← Zurück</button>
            <div style={S.obProg} aria-hidden="true">{[...Array(bkTotal)].map((_,n)=><div key={n} style={{...S.obDot,width:bkTotal>2?28:40,background:bkQ>n?"#D9709A":"#E8E0D8"}}/>)}</div>
            <p style={S.srOnly}>Frage {bkQ} von {bkTotal}</p>

            {bkQ===1&&<div style={S.bkForm}>
              <h2 style={S.bkH}>Was ist das für eine Aufgabe?</h2>
              <label htmlFor="bkq-name" style={S.fL}>Name</label>
              <input id="bkq-name" style={S.bkInp} value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))}/>
              <label htmlFor="bkq-date" style={S.fL}>Bis wann? <span style={{fontWeight:500,color:"#6B5F7F"}}>(optional)</span></label>
              <input id="bkq-date" type="date" min={todayYmd} style={{...S.bkDate,flex:"none"}} value={draft.deadline} onChange={e=>setDraft(d=>({...d,deadline:e.target.value}))}/>
              <p id="bkq-cat" style={S.fL}>Kategorie</p>
              <div role="group" aria-labelledby="bkq-cat" style={S.bkCats}>{BREAKER_CATS.map(c=>{const on=draft.category===c.id;return(
                <button key={c.id} aria-pressed={on} style={{...S.bkChip,borderColor:on?c.colorDark:c.color,background:on?c.colorLight:"#fff"}} onClick={()=>pickBkCat(c.id)}>
                  <Icon name={c.icon} color={c.colorDark} size={20}/><span style={{flex:1,textAlign:"left"}}>{c.label}</span>{on&&<Icon name="check" color={c.colorDark} size={16}/>}
                </button>
              );})}</div>
              <button style={{...S.bkNext,opacity:draft.category?1:.5}} disabled={!draft.category} onClick={toBkSteps}>Weiter →</button>
            </div>}

            {bkQ===2&&dc&&<div style={S.bkForm}>
              <h2 style={S.bkH}>Deine Schritte</h2>
              <p style={{fontSize:12,color:"#6B5F7F",lineHeight:1.4}}>Vorschlag für „{dc.label}“. Tipp einen Schritt an, um ihn zu ändern. Die Termine sind automatisch verteilt{draft.deadline?` bis kurz vor dem ${fmtDay(draft.deadline)}`:", ein Schritt pro Tag"}.</p>
              <ol style={{listStyle:"none",display:"flex",flexDirection:"column",gap:8}}>{draft.steps.map((s,i)=>(
                <li key={s.id} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                  <span aria-hidden="true" style={{...S.bkNum,background:dc.colorLight,color:dc.colorDark}}>{i+1}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <input aria-label={`Schritt ${i+1}`} style={S.bkStepInp} value={s.text} placeholder="Was ist zu tun?" onChange={e=>updDraftStep(s.id,{text:e.target.value})}/>
                    <input type="date" aria-label={`Termin für Schritt ${i+1}`} min={todayYmd} style={S.bkDateSm} value={s.due||""} onChange={e=>updDraftStep(s.id,{due:e.target.value||null,dueManual:!!e.target.value})}/>
                  </div>
                  <button style={S.bkX} aria-label={`Schritt ${i+1} löschen`} onClick={()=>rmDraftStep(s.id)}><Icon name="close" color="#6B5F7F" size={18}/></button>
                </li>
              ))}</ol>
              <button style={{...S.bkBtn,alignSelf:"flex-start",display:"flex",alignItems:"center",gap:4}} onClick={addDraftStep}><Icon name="add" color="#A83D61" size={16}/>Eigenen Schritt hinzufügen</button>
              <button style={{...S.bkNext,opacity:draft.steps.some(s=>s.text.trim())?1:.5}} disabled={!draft.steps.some(s=>s.text.trim())} onClick={()=>finishBreak()}><Icon name="extension" color="#fff" size={20}/>Fertig zerlegt</button>
              {draft.steps.some(s=>s.text.trim())&&<button style={{...S.bk,alignSelf:"center",color:"#A83D61"}} onClick={()=>setBkQ(3)}>Noch ein paar Fragen? (optional) →</button>}
            </div>}

            {/* Optionale Fragen – jede einzeln überspringbar, "Fertig zerlegt" jederzeit möglich */}
            {bkQ>2&&(()=>{const k=bkOpt[bkQ-3];const last=bkQ-2>=bkOpt.length;
              // Überspringen leert die Antwort dieser Frage; bei der letzten Frage wird direkt gespeichert
              const skip=()=>{const clear=k==="why"?{why:""}:k==="first"?{first:""}:k==="dtype"?{deadlineType:null}:k==="battery"?{batCat:null}:{reward:""};
                if(last)finishBreak(clear);else{setDraft(d=>({...d,...clear}));bkNextQ();}};
              return(<div style={S.bkForm}>
                {k==="why"&&<>
                  <label htmlFor="bkq-why" style={S.bkH}>Warum ist dir das wichtig?</label>
                  <p style={{fontSize:12,color:"#6B5F7F"}}>Ein Satz reicht. Er steht später oben im Meilenstein – als Erinnerung, wenn's zäh wird.</p>
                  <input id="bkq-why" style={S.bkInp} value={draft.why} placeholder="z.B. Damit ich ohne Stress in den Urlaub fahre" onChange={e=>setDraft(d=>({...d,why:e.target.value}))}/>
                </>}
                {k==="first"&&<>
                  <label htmlFor="bkq-first" style={S.bkH}>Was ist der allerkleinste erste Schritt?</label>
                  <p style={{fontSize:12,color:"#6B5F7F"}}>Etwas, das unter 2 Minuten dauert. Er wird als Schritt 1 vorne eingefügt.</p>
                  <input id="bkq-first" style={S.bkInp} value={draft.first} placeholder="z.B. Ordner öffnen" onChange={e=>setDraft(d=>({...d,first:e.target.value}))}/>
                </>}
                {k==="dtype"&&<>
                  <p id="bkq-dtype" style={S.bkH}>Ist die Frist echt oder selbst gesetzt?</p>
                  <div role="group" aria-labelledby="bkq-dtype" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[{v:"hard",icon:"push_pin",l:"Echt",sub:"z.B. Behörde, Abgabe"},{v:"soft",icon:"eco",l:"Selbst gesetzt",sub:"wäre schön bis dahin"}].map(({v,icon:ic,l,sub})=>{const on=draft.deadlineType===v;return(
                      <button key={v} aria-pressed={on} style={{...S.bkChip,flex:1,minWidth:140,borderColor:on?"#A83D61":"#F4A0B5",background:on?"#FCE4EA":"#fff"}} onClick={()=>setDraft(d=>({...d,deadlineType:v}))}>
                        <Icon name={ic} color="#A83D61" size={20}/><span style={{flex:1,textAlign:"left"}}>{l}<span style={{display:"block",fontSize:11,fontWeight:500,color:"#6B5F7F"}}>{sub}</span></span>
                      </button>);})}
                  </div>
                </>}
                {k==="battery"&&<>
                  <p id="bkq-bat" style={S.bkH}>Lädt dieser Meilenstein eine deiner Batterien?</p>
                  <p style={{fontSize:12,color:"#6B5F7F"}}>Der Meilenstein wird Teil der Batterie, wie ein Habit. Jeder abgehakte Schritt lädt seinen Anteil – ohne Fortschritt entlädt er sich nach 2–3 Tagen wieder. Nochmal antippen hebt die Auswahl auf.</p>
                  <div role="group" aria-labelledby="bkq-bat" style={{display:"flex",flexDirection:"column",gap:6}}>{batChoices(draft.category).map(cid=>{const bc=BAT_CATS.find(c=>c.id===cid);const on=draft.batCat===cid;const p=batPct(cid);return(
                    <button key={cid} aria-pressed={on} style={{...S.bkChip,borderColor:on?"#A83D61":bc.color,background:on?"#FCE4EA":"#fff"}} onClick={()=>setDraft(d=>({...d,batCat:on?null:cid}))}>
                      <Icon name={bc.icon} color={bc.colorDark} size={20}/>
                      <span style={{flex:1,textAlign:"left"}}>{bc.label}{BREAKER_TO_BAT[draft.category]===cid&&<span style={{display:"block",fontSize:11,fontWeight:500,color:"#6B5F7F"}}>passt zur Kategorie</span>}</span>
                      <span style={S.miniBar}><span style={{display:"block",height:"100%",width:`${p}%`,background:getBatColor(p),borderRadius:4}}/></span>
                      <span style={{width:36,textAlign:"right",color:getBatTextColor(p)}}>{p}%</span>
                      {on&&<Icon name="check" color="#A83D61" size={16}/>}
                    </button>);})}
                  </div>
                  {/* Wichtigkeit wie bei Habits: bestimmt den Anteil an der Batterie */}
                  {draft.batCat&&(()=>{const bc=BAT_CATS.find(c=>c.id===draft.batCat);return(<>
                    <p id="bkq-w" style={S.fL}>Wie stark lädt er die Batterie?</p>
                    <div role="group" aria-labelledby="bkq-w" style={{display:"flex",gap:6,justifyContent:"center"}}>{[1,2,3,4,5].map(w=>(
                      <button key={w} aria-pressed={draft.batWeight===w} style={{width:40,height:40,borderRadius:12,border:"none",fontSize:16,fontWeight:700,fontFamily:"Fredoka,sans-serif",cursor:"pointer",background:draft.batWeight===w?bc.colorDark:bc.colorLight,color:draft.batWeight===w?"#fff":bc.colorDark}} onClick={()=>setDraft(d=>({...d,batWeight:w}))}>{w}</button>))}
                    </div>
                    <p style={{fontSize:12.5,fontWeight:600,color:"#2E7D3A",textAlign:"center"}}>Ein abgehakter Schritt lädt {bc.label} um +{batShare(draft.batCat,draft.batWeight,bkOpen)} %</p>
                  </>);})()}
                </>}
                {k==="reward"&&<>
                  <label htmlFor="bkq-reward" style={S.bkH}>Deine Belohnung</label>
                  <p style={{fontSize:12,color:"#6B5F7F"}}>Was gönnst du dir, wenn alles erledigt ist? Eigene Idee eintippen oder einen Vorschlag antippen.</p>
                  <input id="bkq-reward" style={S.bkInp} value={draft.reward} placeholder="z.B. Serie schauen, Eis essen" onChange={e=>setDraft(d=>({...d,reward:e.target.value}))}/>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}} aria-label="Vorschläge aus dem Menü">{rewardIdeas.map((n,i)=>(
                    <button key={i} style={{...S.bkBtn,background:draft.reward===n?"#FCE4EA":"#F8F4FF",color:"#5B4A6A",border:`1.5px solid ${draft.reward===n?"#A83D61":"transparent"}`}} onClick={()=>setDraft(d=>({...d,reward:n}))}>{n}</button>
                  ))}</div>
                </>}
                <button style={S.bkNext} onClick={()=>last?finishBreak():bkNextQ()}>{last?<><Icon name="extension" color="#fff" size={20}/>Fertig zerlegt</>:"Weiter →"}</button>
                <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
                  <button style={{...S.bk,color:"#6B5F7F"}} onClick={skip}>Überspringen</button>
                  {!last&&<button style={{...S.bk,color:"#A83D61"}} onClick={()=>finishBreak()}>Alle überspringen – fertig zerlegt</button>}
                </div>
              </div>);})()}
          </div>
        );})():bkOpen?(()=>{const ot=tasks.find(t=>t.id===bkOpen);if(!ot)return null;const c=BREAKER_CATS.find(x=>x.id===ot.category)||BREAKER_CATS[0];const nDone=ot.steps.filter(s=>s.done).length;return(
          /* Stufe 3: Schritt-Ansicht – abhaken, bearbeiten, verschieben */
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button style={{...S.bk,alignSelf:"flex-start"}} onClick={()=>{setBkOpen(null);setBkDel(null);}}>← Zurück</button>

            {/* Sanfter Hinweis: Frist vorbei -> neues Datum oder loslassen */}
            {pastDue(ot)&&<div style={S.bkHint} role="status">
              <span style={{display:"flex",alignItems:"center",gap:8}}><Icon name="event_busy" color="#8A6A00" size={22}/>Die Frist ist vorbei – neues Datum oder loslassen?</span>
              {bkNewDate===ot.id?(
                <span style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <label htmlFor="bkh-date" style={{fontSize:12,fontWeight:600}}>Neue Frist:</label>
                  <input id="bkh-date" type="date" min={todayYmd} autoFocus style={S.bkDateSm} onChange={e=>{if(e.target.value){setTaskDeadline(ot.id,e.target.value);setBkNewDate(null);}}}/>
                  <button style={{...S.bkBtn,background:"#F0EAF5",color:"#5B4A6A"}} onClick={()=>setBkNewDate(null)}>Abbrechen</button>
                </span>
              ):bkLetGo===ot.id?(
                <span style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:12.5}}>Wirklich loslassen? Der Meilenstein wird entfernt.</span>
                  <button style={S.bkBtn} onClick={()=>letGo(ot.id)}>Loslassen</button>
                  <button style={{...S.bkBtn,background:"#F0EAF5",color:"#5B4A6A"}} onClick={()=>setBkLetGo(null)}>Abbrechen</button>
                </span>
              ):(
                <span style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button style={S.bkBtn} onClick={()=>setBkNewDate(ot.id)}>Neues Datum</button>
                  <button style={{...S.bkBtn,display:"flex",alignItems:"center",gap:4}} onClick={()=>setBkLetGo(ot.id)}><Icon name="eco" color="#A83D61" size={15}/>Loslassen</button>
                </span>
              )}
            </div>}

            {/* Sanfter Hinweis: länger als 3 Tage kein Fortschritt -> Tipps der Schildkröte */}
            {isStuck(ot)&&<div style={{...S.bkHint,flexDirection:"row",alignItems:"center"}}>
              <MiniAnimal type="start" size={36}/>
              <span style={{flex:1}}>Steckst du fest? Die Schildkröte hat Tipps fürs Anfangen.</span>
              <button style={S.bkBtn} onClick={()=>goToHelp("start")}>Tipps →</button>
            </div>}

            {/* Erledigter Meilenstein: Hinweis, dass man Schritte wieder öffnen kann */}
            {ot.completed&&<p style={{...S.homeOk,justifyContent:"flex-start",textAlign:"left"}}><Icon name="check_circle" color="#5EC269" size={20}/><span>Erledigt am {fmtDay(ymd(new Date(ot.completed)))}. Verklickt? Nimm bei einem Schritt den Haken wieder raus – dann kommt der Meilenstein zurück zu „In Arbeit“.</span></p>}

            {/* Kopf: Name und Frist direkt änderbar */}
            <div style={S.bkForm}>
              <input aria-label="Name des Meilensteins" style={S.bkTitleInp} value={ot.name} onChange={e=>updTask(ot.id,t=>({...t,name:e.target.value}))} onBlur={e=>{if(!e.target.value.trim())updTask(ot.id,t=>({...t,name:"Ohne Namen"}));}}/>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{...S.bkBadge,background:c.colorLight,color:c.colorDark}}><Icon name={c.icon} color={c.colorDark} size={13}/>{c.label}</span>
                <label htmlFor="bks-date" style={{fontSize:12,fontWeight:600,color:"#5B4A6A"}}>Frist:</label>
                <input id="bks-date" type="date" min={todayYmd} style={S.bkDateSm} value={ot.deadline||""} onChange={e=>setTaskDeadline(ot.id,e.target.value)}/>
                {ot.deadline&&ot.deadlineType&&<span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:11,fontWeight:600,color:"#6B5F7F"}}><Icon name={ot.deadlineType==="hard"?"push_pin":"eco"} color="#A83D61" size={14}/>{ot.deadlineType==="hard"?"echte Frist":"selbst gesetzt"}</span>}
              </div>
              <span style={{display:"flex",alignItems:"center",gap:8,fontSize:11.5,fontWeight:500,color:"#6B5F7F"}}>
                <span style={{...S.miniBar,flex:1,width:"auto"}}><span style={{display:"block",height:"100%",width:`${nDone/ot.steps.length*100}%`,background:c.color,borderRadius:4,transition:"width .4s"}}/></span>
                {nDone}/{ot.steps.length} Schritte
              </span>
              {ot.why&&<p style={{fontSize:12.5,color:"#5B4A6A",background:c.colorLight,borderRadius:12,padding:"8px 10px"}}><b>Warum:</b> {ot.why}</p>}
              {ot.reward&&<p style={{fontSize:12.5,color:"#5B4A6A",display:"flex",alignItems:"center",gap:6}}><Icon name="redeem" color="#A83D61" size={18}/>Am Ziel wartet: <b>{ot.reward}</b></p>}
              {/* Batterie-Verknüpfung: jederzeit änderbar oder entfernbar */}
              {habits.length>0&&<div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",fontSize:12.5,color:"#5B4A6A"}}>
                <Icon name="battery_charging_full" color="#4FA97F" size={18}/>
                <label htmlFor="bks-bat" style={{fontWeight:600}}>Lädt Batterie:</label>
                <select id="bks-bat" style={{...S.bkDateSm,marginTop:0,maxWidth:"100%"}} value={batChoices(ot.category).includes(ot.batCat)?ot.batCat:""} onChange={e=>updTask(ot.id,t=>({...t,batCat:e.target.value||null}))}>
                  <option value="">– keine –</option>
                  {batChoices(ot.category).map(cid=>{const bc=BAT_CATS.find(c=>c.id===cid);return<option key={cid} value={cid}>{bc.label} ({batPct(cid)} %)</option>;})}
                </select>
                {batChoices(ot.category).includes(ot.batCat)&&<>
                  <label htmlFor="bks-w" style={{fontWeight:600}}>Stärke:</label>
                  <select id="bks-w" style={{...S.bkDateSm,marginTop:0}} value={ot.batWeight||2} onChange={e=>updTask(ot.id,t=>({...t,batWeight:Number(e.target.value)}))}>{[1,2,3,4,5].map(w=><option key={w} value={w}>{w}</option>)}</select>
                  <span style={{fontWeight:700,color:batCharged(ot)?"#2E7D3A":"#A83D61"}}>+{batShare(ot.batCat,ot.batWeight||2,ot.id)} %</span>
                  <span style={{fontSize:11,fontWeight:500,color:"#6B5F7F",flexBasis:"100%"}}>{batCharged(ot)?"Gerade geladen – hält 2–3 Tage nach dem letzten Schritt.":"Lädt beim nächsten abgehakten Schritt."}</span>
                </>}
              </div>}
            </div>

            {/* Schritte */}
            <ol style={{listStyle:"none",display:"flex",flexDirection:"column",gap:6}}>{ot.steps.map((s,i)=>{const late=!s.done&&s.due&&s.due<todayYmd;return(
              <li key={s.id} style={{...S.homeCard,cursor:"default",alignItems:"flex-start",opacity:s.done?.65:1,animation:checkAnim===s.id?"checkPop .4s ease-out":"none"}}>
                <button role="checkbox" aria-checked={s.done} aria-label={`Schritt ${i+1} erledigt`} style={{...S.bkCheck,borderColor:s.done?"#5EC269":c.color,background:s.done?"#5EC269":"#fff"}} onClick={()=>toggleStep(ot.id,s.id)}>{s.done&&<Icon name="check" color="#fff" size={18}/>}</button>
                <div style={{flex:1,minWidth:0}}>
                  <input aria-label={`Schritt ${i+1}`} style={{...S.bkStepInp,textDecoration:s.done?"line-through":"none"}} value={s.text} placeholder="Was ist zu tun?" autoFocus={!s.text} onChange={e=>editStep(ot.id,s.id,{text:e.target.value})}/>
                  {!s.done&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,flexWrap:"wrap"}}>
                    <input type="date" aria-label={`Termin für Schritt ${i+1}`} style={{...S.bkDateSm,marginTop:0}} value={s.due||""} onChange={e=>editStep(ot.id,s.id,{due:e.target.value||null,dueManual:!!e.target.value})}/>
                    {late&&<span style={{fontSize:10.5,fontWeight:600,color:"#B5402F"}}>überfällig</span>}
                    <button style={{...S.bkBtn,padding:"3px 8px",fontSize:11}} aria-label={`Schritt ${i+1} um einen Tag verschieben`} onClick={()=>pushStep(ot.id,s)}>+1 Tag</button>
                  </div>}
                </div>
                <button style={S.bkX} aria-label={`Schritt ${i+1} löschen`} onClick={()=>rmStep(ot.id,s.id)}><Icon name="close" color="#6B5F7F" size={18}/></button>
              </li>
            );})}</ol>
            <button style={{...S.bkBtn,alignSelf:"flex-start",display:"flex",alignItems:"center",gap:4}} onClick={()=>addStep(ot.id)}><Icon name="add" color="#A83D61" size={16}/>Eigenen Schritt hinzufügen</button>
            <p style={{fontSize:12,color:"#6B5F7F",textAlign:"center"}}>Du kannst jederzeit pausieren.</p>

            {/* Meilenstein löschen, mit Rückfrage */}
            {bkDel===ot.id?(
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12.5,color:"#5B4A6A"}}>Meilenstein wirklich löschen?</span>
                <button style={{...S.bkBtn,background:"#FDE8E6",color:"#9E2F2F"}} onClick={()=>{rmTask(ot.id);setBkOpen(null);}}>Löschen</button>
                <button style={{...S.bkBtn,background:"#F0EAF5",color:"#5B4A6A"}} onClick={()=>setBkDel(null)}>Abbrechen</button>
              </div>
            ):(
              <button style={{...S.bk,alignSelf:"center",display:"flex",alignItems:"center",gap:4,color:"#6B5F7F",fontSize:12}} onClick={()=>setBkDel(ot.id)}><Icon name="delete" color="#6B5F7F" size={16}/>Meilenstein löschen</button>
            )}
          </div>
        );})():(<>
          {/* Stufe 1: Rauskippen – nur Name und optionales Datum, Enter speichert sofort */}
          <form onSubmit={addTask} style={S.bkForm}>
            <label htmlFor="bk-name" style={{...S.secT,marginBottom:0}}>Was steht an?</label>
            <input id="bk-name" ref={bkInput} style={S.bkInp} value={bkName} onChange={e=>setBkName(e.target.value)} placeholder="z.B. Steuererklärung abgeben" autoComplete="off" enterKeyHint="done"/>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <label htmlFor="bk-date" style={{fontSize:12,fontWeight:600,color:"#5B4A6A"}}>Bis wann? <span style={{fontWeight:500,color:"#6B5F7F"}}>(optional)</span></label>
              <input id="bk-date" type="date" min={todayYmd} style={S.bkDate} value={bkDate} onChange={e=>setBkDate(e.target.value)}/>
              <button type="submit" style={{...S.bkAdd,opacity:bkName.trim()?1:.5}} disabled={!bkName.trim()}><Icon name="add" size={18}/>Rauskippen</button>
            </div>
          </form>

          {/* Leerer Zustand */}
          {tasks.length===0&&<div style={S.soon}><Caterpillar size={56} animate/><p>Was schwirrt dir im Kopf rum? Kipp's hier raus.</p></div>}

          {/* Sanfter Anstoß, wenn mehrere Meilensteine aufs Zerlegen warten (bei einem reicht die Liste selbst) */}
          {unplanned.length>1&&<div style={{...S.bkHint,flexDirection:"row",alignItems:"center",flexWrap:"wrap"}}>
            <MiniAnimal type="start" size={36}/>
            <span style={{flex:1,minWidth:160}}>{unplanned.length} Meilensteine warten noch aufs Zerlegen. Fang mit dem dringendsten an – einer reicht für heute.</span>
            <button style={S.bkBtn} onClick={()=>startBreak(unplanned[0])}>„{unplanned[0].name.length>22?unplanned[0].name.slice(0,22)+"…":unplanned[0].name}“ zerlegen →</button>
          </div>}

          {/* Stufe 2: Noch nicht zerlegt */}
          {unplanned.length>0&&<section aria-label="Noch nicht zerlegt">
            {bkHead("open","extension","#D9709A","Noch nicht zerlegt",unplanned.length)}
            {bkSec.open&&<div id="bksec-open" style={{display:"flex",flexDirection:"column",gap:6}}>{unplanned.map((t,i)=>(
              <div key={t.id} style={{...S.homeCard,cursor:"default",flexWrap:"wrap",animation:`fadeIn .3s ease-out ${i*.04}s both`}}>
                <span style={{flex:1,minWidth:0}}>
                  <span style={{display:"block",overflowWrap:"anywhere"}}>{t.name}</span>
                  <span style={{fontSize:10.5,fontWeight:500,color:pastDue(t)?"#8A6A00":"#6B5F7F"}}>{t.deadline?(pastDue(t)?`Frist vorbei (${fmtDay(t.deadline)})`:`bis ${fmtDay(t.deadline)}`):"ohne Datum"}</span>
                </span>
                {bkDel===t.id?(
                  <span style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:12,color:"#5B4A6A"}}>Wirklich löschen?</span>
                    <button style={{...S.bkBtn,background:"#FDE8E6",color:"#9E2F2F"}} onClick={()=>rmTask(t.id)}>Löschen</button>
                    <button style={{...S.bkBtn,background:"#F0EAF5",color:"#5B4A6A"}} onClick={()=>setBkDel(null)}>Abbrechen</button>
                  </span>
                ):(<>
                  <button style={S.bkBtn} onClick={()=>startBreak(t)}>Zerlegen →</button>
                  <button style={S.bkX} aria-label={`${t.name} löschen`} onClick={()=>setBkDel(t.id)}><Icon name="close" color="#6B5F7F" size={18}/></button>
                </>)}
              </div>
            ))}</div>}
          </section>}

          {/* Geplante Meilensteine mit Fortschritt */}
          {planned.length>0&&<section aria-label="In Arbeit">
            {bkHead("work","hourglass_top","#E8876F","In Arbeit",planned.length)}
            {bkSec.work&&<div id="bksec-work" style={{display:"flex",flexDirection:"column",gap:6}}>{planned.map(t=>{const c=BREAKER_CATS.find(x=>x.id===t.category)||BREAKER_CATS[0];const d=t.steps.filter(s=>s.done).length;return(
              <button key={t.id} style={{...S.homeCard,flexDirection:"column",alignItems:"stretch",gap:6}} onClick={()=>setBkOpen(t.id)}>
                <span style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{flex:1,textAlign:"left",overflowWrap:"anywhere"}}>{t.name}</span>
                  <span style={{...S.bkBadge,background:c.colorLight,color:c.colorDark}}><Icon name={c.icon} color={c.colorDark} size={13}/>{c.label}</span>
                </span>
                <span style={{display:"flex",alignItems:"center",gap:8,fontSize:11,fontWeight:500,color:"#6B5F7F"}}>
                  <span style={{...S.miniBar,flex:1,width:"auto"}}><span style={{display:"block",height:"100%",width:`${d/t.steps.length*100}%`,background:c.color,borderRadius:4}}/></span>
                  <span>{d}/{t.steps.length} Schritte{t.deadline?(pastDue(t)?<span style={{color:"#8A6A00"}}> · Frist vorbei</span>:` · bis ${fmtDay(t.deadline)}`):""}</span>
                </span>
              </button>
            );})}</div>}
          </section>}

          {/* Erledigte Meilensteine (letzte 5) – antippen zum Ansehen oder Korrigieren */}
          {doneTasks.length>0&&<section aria-label="Erledigt">
            {bkHead("done","check_circle","#5EC269","Erledigt",doneTasks.length)}
            {bkSec.done&&<div id="bksec-done" style={{display:"flex",flexDirection:"column",gap:6}}>{doneTasks.map(t=>(
              <button key={t.id} style={{...S.homeCard,opacity:.85}} onClick={()=>setBkOpen(t.id)}>
                <Icon name="check_circle" color="#5EC269" size={20}/>
                <span style={{flex:1,textAlign:"left",overflowWrap:"anywhere"}}>{t.name}</span>
                <span style={{fontSize:11,fontWeight:500,color:"#6B5F7F"}}>{fmtDay(ymd(new Date(t.completed)))}</span>
              </button>
            ))}</div>}
          </section>}
        </>)}
      </div>}

      {/* ═══ BATTERIE ═══ */}
      {tab==="batterie"&&!timerOn&&<div style={{padding:"4px 16px"}}>
        <div style={S.hI}><Fox size={40} animate/><p style={{fontSize:12,color:"#5B4A6A",fontWeight:500,lineHeight:1.4}}>Deine Energie-Batterien. Halte gedrückt & ziehe zum Sortieren.</p></div>
        {!openCat?(<>
          {ordCfg.length>0&&<><h3 style={S.secT}>Meine Batterien</h3><div className="bat-grid-t" style={S.batGrid}>{ordCfg.map((cid,i)=>{const bc=BAT_CATS.find(c=>c.id===cid);const pct=batPct(cid);return(<button key={cid} draggable onDragStart={e=>onDS(e,cid)} onDragOver={onDO} onDrop={e=>onDr(e,cid)} style={{...S.batCard,borderColor:getBatColor(pct),opacity:dragId===cid?.5:1,animation:`fadeIn .3s ease-out ${i*.04}s both`}} onClick={()=>setOpenCat(cid)}><BatterySVG pct={pct} size={64}/><span style={{fontSize:11.5,fontWeight:600,textAlign:"center",color:getBatColor(pct)}}>{bc.label}</span>{pct<=40&&<span style={{fontSize:9,color:"#E86A5A",fontWeight:600,animation:"pulse 2s infinite"}}>Aufladen!</span>}</button>);})}</div></>}
          {ordEmpty.length>0&&<><h3 style={{...S.secT,marginTop:ordCfg.length?16:0,opacity:.7}}>Weitere Kategorien</h3><div className="bat-grid-t" style={S.batGrid}>{ordEmpty.map((cid,i)=>{const bc=BAT_CATS.find(c=>c.id===cid);return(<button key={cid} draggable onDragStart={e=>onDS(e,cid)} onDragOver={onDO} onDrop={e=>onDr(e,cid)} style={{...S.batCard,borderColor:bc.color,opacity:dragId===cid?.4:.6,animation:`fadeIn .3s ease-out ${i*.04}s both`}} onClick={()=>setOpenCat(cid)}><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:64,height:64,fontSize:28,opacity:.5}}><Icon name={bc.icon} color={bc.colorDark} size={28}/><span style={{fontSize:10,marginTop:2}}>Leer</span></div><span style={{fontSize:11.5,fontWeight:600,color:bc.colorDark}}>{bc.label}</span></button>);})}</div></>}
        </>):(()=>{const bc=BAT_CATS.find(c=>c.id===openCat);const ch=habitsFor(openCat);const bt=batTasks(openCat);const pct=ch.length?batPct(openCat):100;const totalW=batItems(openCat).reduce((s,h)=>s+(h.weight||1),0);const qt=pct<=40&&ch.length?getQT(openCat):[];
          return(<div style={{animation:"fadeIn .3s ease-out"}}><button style={S.bk} onClick={()=>{setOpenCat(null);setShowHF(false);}}>← Alle Batterien</button>
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:20,marginBottom:12,background:bc.colorLight}}><BatterySVG pct={ch.length?pct:100} size={90}/><div style={{flex:1}}><h2 style={{fontSize:20,fontWeight:700,color:bc.colorDark,display:"flex",alignItems:"center",gap:6}}><Icon name={bc.icon} color={bc.colorDark} size={22}/>{bc.label}</h2><p style={{fontSize:12,color:bc.colorDark,fontWeight:500,marginTop:2}}>{getBatLabel(ch.length?pct:100)}</p><p style={{fontSize:11,color:"#9B8AAE",marginTop:4}}>{ch.length} Habit{ch.length!==1?"s":""}{bt.length?` · ${bt.length} Meilenstein${bt.length!==1?"e":""}`:""}</p></div></div>
            {pct<=40&&ch.length>0&&<div style={S.qT}><h3 style={{fontSize:14,fontWeight:700,color:"#B83A3A",marginBottom:8,display:"flex",alignItems:"center",gap:4}}><Icon name="bolt" color="#B83A3A" size={18}/>Schnell aufladen:</h3>{qt.map((q,i)=>(<div key={i} style={{background:"#fff",borderRadius:14,padding:11,display:"flex",gap:9,alignItems:"flex-start",marginBottom:6,animation:`fadeIn .3s ease-out ${i*.08}s both`}}><div style={{width:34,height:34,borderRadius:10,background:"#FDE8E6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{q.animal?<MiniAnimal type={q.animal} size={28}/>:<Icon name={q.icon} color="#B83A3A" size={18}/>}</div><div style={{flex:1}}><h4 style={{fontSize:13,fontWeight:600,color:"#5B4A6A"}}>{q.title}</h4><p style={{fontSize:11,color:"#6B5F7F",lineHeight:1.4,marginTop:2}}>{q.text}</p></div>{q.action&&<button style={{background:"#E86A5A",color:"#fff",border:"none",borderRadius:10,padding:"6px 12px",fontSize:11,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",alignSelf:"center"}} onClick={q.action}>Jetzt!</button>}{q.link&&<button style={{background:"none",border:"none",fontSize:11,fontWeight:600,color:"#5BA3C0",fontFamily:"Fredoka,sans-serif",cursor:"pointer",alignSelf:"center"}} onClick={()=>goToHelp(q.link)}>Hilfe →</button>}</div>))}</div>}
            {ch.length>0&&<div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12}}>{ch.map((h,idx)=>{const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];const ov=isOver(h.lastDone,iv.days);const np=Math.round(((h.weight||1)/totalW)*100);const rm=REMIND_OPTS.find(r=>r.id===h.remind);return(<div key={h.id} style={{background:"#fff",borderRadius:16,padding:13,border:`2.5px solid ${ov?"#E86A5A":"#5EC269"}`,animation:`fadeIn .3s ease-out ${idx*.05}s both`}}><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:12,height:12,borderRadius:6,background:ov?"#E86A5A":"#5EC269",flexShrink:0}}/><div style={{flex:1,minWidth:0}}><h3 style={{fontSize:14,fontWeight:700,color:"#4A3D5C"}}>{h.name}</h3><p style={{fontSize:10.5,color:"#9B8AAE",fontWeight:500,marginTop:1}}>{iv.label} · {np}% · {timeAgo(h.lastDone)}{rm&&rm.id!=="none"?` · Erinnerung: ${rm.label}`:""}</p></div><button style={{background:"none",border:"none",fontSize:13,cursor:"pointer",opacity:.4}} aria-label="Habit löschen" onClick={()=>rmH(h.id)}><Icon name="delete" color="#5B4A6A" size={18}/></button></div><button style={{border:"none",borderRadius:12,padding:"9px 0",fontSize:12.5,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",color:"#fff",marginTop:8,width:"100%",background:ov?"#E86A5A":"#5EC269",animation:checkAnim===h.id?"checkPop .4s ease-out":"none"}} onClick={()=>checkIn(h.id)}>{ov?`Aufladen +${np}%`:<>Erledigt <Icon name="check" size={13} style={{verticalAlign:"-2px"}}/></>}</button></div>);})}</div>}
            {/* Verknüpfte Meilensteine (v6.1): laden wie ein Habit, Tap öffnet den Meilenstein */}
            {bt.length>0&&<div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12}}>{bt.map(m=>{const t=tasks.find(x=>x.id===m.taskId);const on=batCharged(t);const np=Math.round((m.weight/totalW)*100);return(
              <button key={m.id} style={{...S.homeCard,border:`2.5px solid ${on?"#5EC269":"#F4A0B5"}`}} onClick={()=>{goTab("breaker");setBkOpen(t.id);}}>
                <Icon name="extension" color="#D9709A" size={20}/>
                <span style={{flex:1,minWidth:0,textAlign:"left"}}>
                  <span style={{display:"block",overflowWrap:"anywhere"}}>{t.name}</span>
                  <span style={{fontSize:10.5,fontWeight:500,color:"#6B5F7F"}}>Meilenstein · {on?"geladen durch den letzten Schritt":"lädt beim nächsten abgehakten Schritt"}</span>
                </span>
                <span style={{fontWeight:700,color:on?"#2E7D3A":"#A83D61"}}>+{np}%</span>
              </button>);})}</div>}
            {ch.length===0&&!showHF&&<div style={{textAlign:"center",padding:"24px 0"}}><Caterpillar size={50}/><p style={{fontSize:14,color:"#5B4A6A",fontWeight:600,marginTop:9}}>Noch keine Habits für {bc.label}.</p><p style={{fontSize:12,color:"#9B8AAE",fontWeight:500,marginTop:3}}>Was lädt diese Batterie auf?</p></div>}
            {showHF?(<div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 4px 16px rgba(180,160,200,.12)",animation:"fadeIn .3s ease-out"}}><h3 style={{fontSize:16,fontWeight:700,color:"#5B4A6A",marginBottom:10}}>Neuer Habit für {bc.label}</h3>
              <label style={S.fL}>Was lädt diese Batterie auf?</label><input style={{...S.fIn,borderColor:bc.color}} placeholder="z.B. Spaziergang, Yoga…" value={hN} onChange={e=>setHN(e.target.value)} autoFocus/>
              <label style={S.fL}>Wichtigkeit</label><p style={{fontSize:10.5,color:"#9B8AAE",marginBottom:4}}>Höher = mehr Einfluss auf die Batterie.</p><div style={{display:"flex",gap:6,justifyContent:"center"}}>{[1,2,3,4,5].map(w=>(<button key={w} style={{width:40,height:40,borderRadius:12,border:"none",fontSize:16,fontWeight:700,fontFamily:"Fredoka,sans-serif",cursor:"pointer",background:hW===w?bc.color:bc.colorLight,color:hW===w?"#fff":bc.colorDark}} onClick={()=>setHW(w)}>{w}</button>))}</div>
              <label style={S.fL}>Wie oft?</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{INTERVALS.map(iv=>(<button key={iv.id} style={{border:"none",borderRadius:12,padding:"7px 12px",fontSize:12,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",background:hInt===iv.id?"#C8A8E9":"#EDE0F7",color:hInt===iv.id?"#fff":"#9B6FCF"}} onClick={()=>setHInt(iv.id)}>{iv.label}</button>))}</div>
              <label style={{...S.fL,display:"flex",alignItems:"center",gap:4}}><Icon name="notifications" color="#9B6FCF" size={15}/>Erinnerung</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{REMIND_OPTS.map(ro=>(<button key={ro.id} style={{border:"none",borderRadius:12,padding:"7px 12px",fontSize:12,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",background:hRemind===ro.id?"#FFB5A7":"#FFE0DA",color:hRemind===ro.id?"#fff":"#E8876F"}} onClick={()=>setHRemind(ro.id)}>{ro.label}</button>))}</div>
              <div style={{display:"flex",gap:8,marginTop:14}}><button style={{...S.ab,background:bc.color,color:"#fff",flex:1,padding:"11px 0",fontSize:14}} onClick={()=>addHabit(openCat)}>Anlegen</button><button style={{...S.ab,background:"#E8E0D8",color:"#888",flex:1,padding:"11px 0",fontSize:14}} onClick={()=>{setShowHF(false);setHN("");}}>Abbruch</button></div>
            </div>):(<button style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",padding:"11px",borderRadius:16,border:`2.5px dashed ${bc.color}`,background:"#fff",fontSize:13.5,fontWeight:600,fontFamily:"Fredoka,sans-serif",color:bc.colorDark,cursor:"pointer"}} onClick={()=>setShowHF(true)}>+ Neuer Habit</button>)}
          </div>);})()}
      </div>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"20px 0 4px"}}><Caterpillar size={22}/><span style={{fontSize:10.5,color:"#9B8AAE",fontWeight:500}}>Du machst das toll!</span><Octopus size={22}/></div>

      {/* ═══ FOOTER-NAVIGATION (Glasoptik, bleibt auch im Timer sichtbar) ═══ */}
      <nav style={S.footer} aria-label="Hauptnavigation">
        {TABS.map(t=>{const act=tab===t.id;return(
          <button key={t.id} style={S.footBtn} onClick={()=>goTab(t.id)} aria-current={act?"page":undefined}>
            <span style={{...S.footIcon,background:act?t.bg:"transparent",opacity:act?1:.6}}><Icon name={t.icon} color={t.iconColor} size={22}/></span>
            <span style={{...S.footLbl,color:act?"#5B4A6A":"#9B8AAE"}}>{t.label}</span>
          </button>
        );})}
      </nav>
    </div>
  );
}

/* ═══ STYLES ═══ */
const S={
  wrap:{fontFamily:"'Fredoka',sans-serif",background:"linear-gradient(180deg,#FFF5E4,#FFF0F5 50%,#F0F5FF)",minHeight:"100vh",padding:"0 0 calc(84px + env(safe-area-inset-bottom))",position:"relative",overflowX:"hidden",maxWidth:900,margin:"0 auto"},
  hdr:{textAlign:"center",padding:"18px 20px 9px",background:"linear-gradient(180deg,#FFFAF0,transparent)"},hdrTop:{display:"flex",alignItems:"center",justifyContent:"center",gap:9},
  title:{fontSize:23,fontWeight:700,color:"#5B4A6A",letterSpacing:"-.5px"},sub:{fontSize:11,color:"#9B8AAE",fontWeight:500,marginTop:1},
  stats:{display:"flex",justifyContent:"center",gap:7,marginTop:9,flexWrap:"wrap"},stat:{background:"#fff",borderRadius:16,padding:"4px 10px",display:"flex",alignItems:"center",gap:4,boxShadow:"0 2px 10px rgba(180,160,200,.13)",fontSize:13},statN:{fontWeight:700,fontSize:14,color:"#5B4A6A"},statL:{fontSize:9,color:"#9B8AAE",fontWeight:500},
  notifBadge:{position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:9,background:"#E86A5A",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"},
  notifPanel:{position:"absolute",top:110,left:16,right:16,background:"#fff",borderRadius:20,padding:16,boxShadow:"0 8px 32px rgba(91,74,106,.2)",zIndex:50,maxHeight:"60vh",overflowY:"auto",animation:"fadeIn .2s ease-out"},
  notifGear:{background:"none",border:"none",fontSize:18,cursor:"pointer"},
  notifSettingsBox:{background:"#F8F4FF",borderRadius:14,padding:12,marginBottom:10},
  notifToggle:{display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:500,color:"#5B4A6A",padding:"4px 0",cursor:"pointer"},
  notifItem:{background:"#FAFAFA",borderRadius:12,padding:"10px 12px",marginBottom:6,borderLeft:"4px solid",display:"flex",alignItems:"center",gap:8},
  notifAction:{border:"none",borderRadius:10,padding:"5px 12px",fontSize:11,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",color:"#fff",flexShrink:0},
  // Footer: fest unten, so breit wie der Wrapper (max. 900px), Glasoptik
  footer:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:900,display:"flex",justifyContent:"space-around",alignItems:"center",minHeight:64,padding:"4px 6px calc(4px + env(safe-area-inset-bottom))",background:"rgba(255,245,228,.75)",backdropFilter:"blur(16px) saturate(180%)",WebkitBackdropFilter:"blur(16px) saturate(180%)",borderTop:"1px solid rgba(200,168,233,.2)",zIndex:60},
  footBtn:{flex:1,maxWidth:96,minHeight:52,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"none",cursor:"pointer",fontFamily:"'Fredoka',sans-serif",padding:0},
  footIcon:{display:"flex",padding:"4px 14px",borderRadius:14,transition:"background .2s, opacity .2s"},
  footLbl:{fontSize:10,fontWeight:600,transition:"color .2s"},
  // Home-Dashboard
  home:{padding:"4px 16px",display:"flex",flexDirection:"column",gap:14},
  homeMsg:{textAlign:"center",fontSize:14,fontWeight:600,margin:"6px 0 0"},
  homeCard:{display:"flex",alignItems:"center",gap:10,width:"100%",background:"#fff",border:"none",borderRadius:16,padding:"10px 12px",boxShadow:"0 2px 10px rgba(180,160,200,.1)",fontFamily:"'Fredoka',sans-serif",fontSize:13,fontWeight:600,color:"#5B4A6A",cursor:"pointer"},
  homeOk:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#fff",borderRadius:16,padding:12,fontSize:13,fontWeight:600,color:"#2E7D3A",boxShadow:"0 2px 10px rgba(180,160,200,.1)"},
  homeStepLink:{flex:1,minWidth:0,textAlign:"left",background:"none",border:"none",padding:0,fontFamily:"'Fredoka',sans-serif",fontSize:13,fontWeight:600,color:"#5B4A6A",cursor:"pointer"},
  // "Erledigen"-Button: neutral (weiß, lila Rand) -> nach Tippen kurz grün
  homeDone:{border:"2px solid #C8A8E9",borderRadius:12,padding:"5px 11px",minWidth:92,background:"#fff",color:"#7A52B3",fontSize:12,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",flexShrink:0,transition:"background .2s, color .2s, border-color .2s"},
  homeDoneOn:{background:"#2E7D3A",borderColor:"#2E7D3A",color:"#fff"},
  // Zeile blendet nach "Erledigt" aus (startet, nachdem der Button kurz grün war)
  rowOut:"rowOut .3s ease-in .55s forwards",
  clamp2:{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",marginTop:2,fontSize:11.5,fontWeight:500,color:"#6B5F7F",lineHeight:1.35},
  // Breaker
  bkForm:{background:"#fff",borderRadius:18,padding:14,display:"flex",flexDirection:"column",gap:8,boxShadow:"0 2px 10px rgba(180,160,200,.1)"},
  bkInp:{border:"2px solid #F4A0B5",borderRadius:12,padding:"10px 12px",fontSize:16,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",width:"100%"},
  bkDate:{border:"2px solid #E8E0D8",borderRadius:10,padding:"6px 8px",fontSize:14,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",flex:1,minWidth:130},
  bkAdd:{display:"flex",alignItems:"center",gap:4,border:"none",borderRadius:12,padding:"8px 14px",background:"#B8476C",color:"#fff",fontSize:13,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer"},
  bkBtn:{border:"none",borderRadius:10,padding:"6px 10px",background:"#FDE2EA",color:"#A83D61",fontSize:12,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",flexShrink:0},
  bkX:{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,border:"none",background:"none",borderRadius:8,cursor:"pointer",flexShrink:0},
  bkBadge:{display:"inline-flex",alignItems:"center",gap:3,borderRadius:8,padding:"2px 8px",fontSize:10.5,fontWeight:600,flexShrink:0},
  bkH:{fontSize:17,fontWeight:700,color:"#5B4A6A"},
  bkTitleInp:{border:"none",borderBottom:"2px solid #F0EAF5",padding:"2px 2px 4px",fontSize:18,fontWeight:700,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",width:"100%",background:"transparent"},
  bkCheck:{width:30,height:30,borderRadius:10,border:"2.5px solid",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,padding:0,transition:"background .2s"},
  bkCats:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:6},
  bkChip:{display:"flex",alignItems:"center",gap:8,border:"2px solid",borderRadius:14,padding:"8px 10px",fontSize:13,fontWeight:600,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",cursor:"pointer"},
  bkNext:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,border:"none",borderRadius:14,padding:"12px 20px",marginTop:6,background:"#B8476C",color:"#fff",fontSize:15,fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer"},
  bkNum:{width:24,height:24,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,marginTop:4},
  bkStepInp:{border:"none",borderBottom:"2px solid #F0EAF5",padding:"4px 2px",fontSize:15,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",width:"100%",background:"transparent"},
  bkDateSm:{border:"1.5px solid #E8E0D8",borderRadius:8,padding:"2px 6px",marginTop:4,fontSize:12,fontFamily:"'Fredoka',sans-serif",color:"#6B5F7F",background:"#fff"},
  // Nur für Screenreader sichtbar
  srOnly:{position:"absolute",width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:0},
  // Sanfte Hinweise: warm, kein Rot
  bkHint:{display:"flex",flexDirection:"column",gap:8,background:"#FFF4E4",border:"2px solid #FFD6A0",borderRadius:16,padding:"10px 12px",fontSize:13,fontWeight:600,color:"#5B4A6A"},
  bkSecHead:{display:"flex",alignItems:"center",gap:6,width:"100%",background:"none",border:"none",padding:"4px 0",marginBottom:6,fontSize:13,fontWeight:700,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",cursor:"pointer"},
  miniBar:{display:"block",width:70,height:8,borderRadius:4,background:"#F0EAF5",overflow:"hidden",flexShrink:0},
  soon:{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"40px 16px",fontSize:14,fontWeight:600,color:"#9B8AAE",textAlign:"center"},
  rndBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,margin:"8px auto 4px",padding:"9px 22px",borderRadius:50,border:"2.5px solid #E8D0F0",background:"linear-gradient(135deg,#F5E6FF,#FFE0DA 50%,#DFF5EA)",fontSize:13.5,fontWeight:600,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",cursor:"pointer",boxShadow:"0 3px 16px rgba(200,168,233,.2)"},
  cats:{padding:"4px 16px",display:"flex",flexDirection:"column",gap:16},cH:{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:16,marginBottom:6},
  gr:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:8},
  cd:{background:"#fff",borderRadius:15,padding:10,border:"2.5px solid",boxShadow:"0 2px 10px rgba(180,160,200,.1)",display:"flex",flexDirection:"column",gap:5},
  ab:{border:"none",borderRadius:12,padding:"6px 0",fontSize:11.5,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",textAlign:"center"},
  rm:{background:"none",border:"none",fontSize:16,color:"#C4B8D4",cursor:"pointer",lineHeight:1},
  addCd:{background:"#fff",borderRadius:15,padding:10,border:"2.5px dashed",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:"'Fredoka',sans-serif",fontSize:22,minHeight:70},
  inp:{border:"2px solid",borderRadius:10,padding:"6px 9px",fontSize:12,fontFamily:"'Fredoka',sans-serif",outline:"none",width:"100%"},
  ov:{position:"fixed",inset:0,background:"rgba(91,74,106,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16},
  modal:{background:"#fff",borderRadius:24,padding:"22px 18px",textAlign:"center",maxWidth:320,width:"100%",animation:"pop .35s ease-out",boxShadow:"0 12px 40px rgba(91,74,106,.25)"},
  modBtn:{border:"none",borderRadius:14,padding:"8px 14px",fontSize:12,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",color:"#fff"},
  celeb:{position:"fixed",inset:0,background:"rgba(255,245,228,.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200},
  tmV:{margin:"7px 16px",borderRadius:24,padding:"24px 16px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:6},tmR:{position:"relative",width:164,height:164},tmTx:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"},
  hI:{display:"flex",alignItems:"center",gap:8,background:"#fff",borderRadius:16,padding:"10px 12px",marginBottom:10,boxShadow:"0 2px 10px rgba(180,160,200,.1)"},
  pG:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(135px,1fr))",gap:8},
  pC:{border:"2.5px solid",borderRadius:16,padding:"11px 6px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontFamily:"'Fredoka',sans-serif"},
  bk:{background:"none",border:"none",fontSize:13,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",marginBottom:6,color:"#5B4A6A"},
  fL:{fontSize:12,fontWeight:600,color:"#5B4A6A",marginBottom:4,marginTop:9,display:"block"},
  fIn:{border:"2.5px solid",borderRadius:12,padding:"8px 11px",fontSize:13,fontFamily:"'Fredoka',sans-serif",outline:"none",width:"100%"},
  secT:{fontSize:13,fontWeight:700,color:"#5B4A6A",marginBottom:6},
  batGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:10},
  batCard:{background:"#fff",borderRadius:18,padding:"12px 8px 10px",border:"2.5px solid",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontFamily:"'Fredoka',sans-serif",transition:"opacity .2s"},
  qT:{background:"linear-gradient(135deg,#FDE8E6,#FFF0D6)",borderRadius:18,padding:14,marginBottom:12,border:"2px solid #E86A5A30"},
  obWrap:{position:"fixed",inset:0,background:"#FFF5E4",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20},
  obCard:{background:"#fff",borderRadius:32,width:"100%",maxWidth:500,padding:24,boxShadow:"0 12px 40px rgba(180,160,200,.15)",display:"flex",flexDirection:"column",gap:20,maxHeight:"90vh",overflowY:"auto"},
  obProg:{display:"flex",justifyContent:"center",gap:8},
  obDot:{width:40,height:6,borderRadius:3,transition:"all .3s"},
  obTitle:{fontSize:20,fontWeight:700,color:"#5B4A6A",textAlign:"center",lineHeight:1.3},
  obSub:{fontSize:13,color:"#9B8AAE",textAlign:"center",marginTop:4},
  obGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:20},
  obOpt:{border:"3px solid",borderRadius:24,padding:16,display:"flex",flexDirection:"column",alignItems:"center",gap:10,cursor:"pointer",transition:"all .2s",fontFamily:"Fredoka,sans-serif"},
  obOptLabel:{fontSize:12,fontWeight:600,color:"#5B4A6A",textAlign:"center"},
  obNav:{display:"flex",justifyContent:"space-between",marginTop:10},
  obBack:{background:"none",border:"none",color:"#9B8AAE",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"Fredoka,sans-serif"},
  obNext:{background:"#C8A8E9",border:"none",borderRadius:16,padding:"12px 32px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Fredoka,sans-serif",boxShadow:"0 4px 12px rgba(200,168,233,.3)"},
  hint:{position:"fixed",bottom:"calc(84px + env(safe-area-inset-bottom))",left:20,right:20,background:"#5B4A6A",color:"#fff",padding:"12px 20px",borderRadius:16,fontSize:13,fontWeight:600,textAlign:"center",zIndex:1000,animation:"fadeIn .4s ease-out"},
};
