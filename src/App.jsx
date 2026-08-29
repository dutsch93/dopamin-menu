import { useState, useEffect, useCallback, useRef } from "react";

/* ═══ MENU ═══ */
const CATEGORIES = {
  appetizer:{key:"appetizer",emoji:"🐙",label:"Appetizers",subtitle:"Quick Movement",duration:5*60,color:"#C8A8E9",colorLight:"#EDE0F7",colorDark:"#9B6FCF",
    defaults:[{id:"a1",name:"Stretch & Shake",desc:"Streck dich wie ein Seestern 🌟"},{id:"a2",name:"Tanz-Break",desc:"30 Sek Lieblingslied tanzen 💃"},{id:"a3",name:"Kaltes Wasser",desc:"Hände unter kaltes Wasser"},{id:"a4",name:"Hampelmann",desc:"20 Jumping Jacks! 🦘"},{id:"a5",name:"Fenster auf!",desc:"Frische Luft schnappen ☁️ "}]},
  entree:{key:"entree",emoji:"🦊",label:"Entrées",subtitle:"Deep Work",duration:20*60,color:"#FFB5A7",colorLight:"#FFE0DA",colorDark:"#E8876F",
    defaults:[{id:"e1",name:"Power-Fokus",desc:"Eine Aufgabe, kein Handy 🎯"},{id:"e2",name:"Schreib-Sprint",desc:"Alles raus was im Kopf ist ✍️ "},{id:"e3",name:"Sortier-Session",desc:"Einen Bereich aufräumen 📦"},{id:"e4",name:"Lern-Block",desc:"Etwas Neues anschauen 📚"},{id:"e5",name:"Planungs-Zeit",desc:"Woche planen 🗓️ "}]},
  side:{key:"side",emoji:"🐛",label:"Sides",subtitle:"Creative Play",duration:10*60,color:"#B8E8D0",colorLight:"#DFF5EA",colorDark:"#6FC49E",
    defaults:[{id:"s1",name:"Doodle-Time",desc:"Kritzle was dir einfällt 🎨"},{id:"s2",name:"Brainstorm",desc:"Wilde Ideen sammeln 💡"},{id:"s3",name:"Musik machen",desc:"Summen, klopfen, spielen 
🎵"},{id:"s4",name:"Origami",desc:"Endlose Möglichkeiten 🦢"},{id:"s5",name:"Tagträumen",desc:"Augen zu & Geschichte erfinden 🌈"}]},
};

/* ═══ SOFORTHILFE ═══ */
const SOFORTHILFE = [
  {id:"start",emoji:"🐢",animal:"Schildkröte",title:"Kann nicht anfangen",color:"#A8D8EA",colorDark:"#5BA3C0",colorLight:"#D6EEFB",science:"Exekutive Dysfunktion — Aufgabeninitiation bei ADHS beeinträchtigt 
(Barkley, 2012).",
    tips:[{id:"st1",icon:"🧩",title:"Mini-Schritt",text:"Nur die ersten 2 Minuten. Verhaltensmomentum senkt Widerstand (Nevin, 1996)."},{id:"st2",icon:"🎵",title:"Körper zuerst",text:"30 Sek Bewegung erhöht 
Dopamin (Ratey, 2008)."},{id:"st3",icon:"📢",title:"Laut aussprechen",text:"Kompensiert schwächeres inneres Sprechen (Barkley, 1997)."},{id:"st4",icon:"👯",title:"Body Doubling",text:"Neben jemandem arbeiten 
erhöht Aufgabenbindung (Zajonc, 1965)."}]},
  {id:"overwhelm",emoji:"🐻",animal:"Bär",title:"Alles zu viel",color:"#F4A0B5",colorDark:"#D06B83",colorLight:"#FCE0E8",science:"Kognitive Überlast — geringere Arbeitsgedächtnis-Kapazität (Martinussen, 2005).",
    tips:[{id:"ow1",icon:"📝",title:"Brain Dump",text:"Alles aufschreiben befreit Arbeitsgedächtnis (Sweller, 1988)."},{id:"ow2",icon:"3️⃣",title:"Nur 3 Dinge",text:"Reduziert Entscheidungsmüdigkeit (Baumeister, 
1998)."},{id:"ow3",icon:"🫁",title:"Box Breathing",text:"4-4-4-4. Senkt Cortisol (Ma et al., 2017)."},{id:"ow4",icon:"🧸",title:"Komfort-Anker",text:"Vertraute Reize aktivieren Sicherheitssystem (Porges, 
2011)."}]},
  {id:"focus",emoji:"🦋",animal:"Schmetterling",title:"Kann mich nicht konzentrieren",color:"#C8A8E9",colorDark:"#9B6FCF",colorLight:"#EDE0F7",science:"Brown Noise verbessert Leistung bei ADHS (Söderlund, 
2007).",
    tips:[{id:"fo1",icon:"🎧",title:"Brown Noise",text:"Erhöht Dopamin im präfrontalen Kortex."},{id:"fo2",icon:"📱",title:"Handy weg",text:"Sichtbare Nähe reduziert kognitive Kapazität (Ward, 
2017)."},{id:"fo3",icon:"⏱️ ",title:"5-Min-Sprint",text:"Zeigarnik-Effekt motiviert zum Weitermachen."},{id:"fo4",icon:"✍️ ",title:"Ablenkungszettel",text:"Gedanken notieren reduziert Intrusions (Wegner, 
1994)."}]},
  {id:"restless",emoji:"🐒",animal:"Äffchen",title:"Unruhig & zappelig",color:"#FFD6A0",colorDark:"#CC9544",colorLight:"#FFF0D6",science:"Fidgeting verbessert kognitive Leistung bei ADHS (Hartanto, 2016).",
    tips:[{id:"re1",icon:"🏃",title:"Bewegungs-Snack",text:"10 Kniebeugen erhöhen Dopamin (Ratey, 2008)."},{id:"re2",icon:"🧊",title:"Sensorik-Reset",text:"Propriozeptiver Input beruhigt (Ayres, 
1972)."},{id:"re3",icon:"🪑",title:"Position wechseln",text:"Aktiviert Orientierungsnetzwerk (Posner, 1990)."},{id:"re4",icon:"🎵",title:"Rhythmisches Klopfen",text:"Bilaterale Stimulation beruhigt (Shapiro, 
2001)."}]},
  {id:"decisions",emoji:"🦔",animal:"Igel",title:"Kann mich nicht entscheiden",color:"#B8D8A8",colorDark:"#6FA05A",colorLight:"#E0F0D6",science:"Analyse-Paralyse bei ADHS (Damasio, 1994).",
    tips:[{id:"de1",icon:"🪙",title:"Münze werfen",text:"Dein Gefühl zeigt die wahre Präferenz."},{id:"de2",icon:"⏰",title:"2-Min-Timer",text:"Satisficing statt Maximizing (Schwartz, 
2004)."},{id:"de3",icon:"🤏",title:"Kleinste Version",text:"Geringstem Aufwand wählen."},{id:"de4",icon:"🗣️ ",title:"Laut denken",text:"Kompensiert Arbeitsgedächtnis-Defizite."}]},
  {id:"emotions",emoji:"🐨",animal:"Koala",title:"Gefühle überfluten mich",color:"#A8C8E8",colorDark:"#5A8AB8",colorLight:"#D6E8F8",science:"Affect Labeling reduziert Amygdala-Aktivität (Lieberman, 2007).",
    tips:[{id:"em1",icon:"🏷️ ",title:"Gefühl benennen",text:"Reduziert Amygdala-Reaktivität um ~50%."},{id:"em2",icon:"🌡️ ",title:"Dive Reflex",text:"Kaltes Wasser senkt Herzfrequenz (Linehan, 
1993)."},{id:"em3",icon:"📍",title:"5-4-3-2-1 Grounding",text:"5 sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken."},{id:"em4",icon:"⏳",title:"90-Sekunden-Regel",text:"Emotion dauert ~90 Sek (Bolte Taylor, 
2006)."}]},
  {id:"timeblind",emoji:"🐌",animal:"Schnecke",title:"Zeitgefühl verloren",color:"#E8C8A8",colorDark:"#B8945A",colorLight:"#F5E8D6",science:"Zeitblindheit bei ADHS (Barkley, 1997).",
    tips:[{id:"tb1",icon:"⏰",title:"Visuelle Timer",text:"Zeit sichtbar machen."},{id:"tb2",icon:"🔔",title:"3er-Alarm-Kette",text:"3 Alarme statt einem."},{id:"tb3",icon:"⏪",title:"Rückwärts planen",text:"Vom
Termin zurückrechnen."},{id:"tb4",icon:"🎯",title:"Zeit schätzen",text:"Raten, dann stoppen — wird besser."}]},
  {id:"forget",emoji:"🐘",animal:"Elefant",title:"Vergesse ständig Dinge",color:"#D8B8D8",colorDark:"#A07AA0",colorLight:"#F0E0F0",science:"Arbeitsgedächtnis-Defizit (Martinussen, 2005).",
    tips:[{id:"fg1",icon:"📍",title:"Launch Pad",text:"Fester Platz an der Tür (Barkley, 2012)."},{id:"fg2",icon:"🗒️ ",title:"Sofort notieren",text:"In 3 Sek ist der Gedanke 
weg."},{id:"fg3",icon:"🔁",title:"Habit Stacking",text:"An bestehende Gewohnheit ketten (Gollwitzer, 1999)."},{id:"fg4",icon:"📸",title:"Foto-Gedächtnis",text:"Fotografiere was du vergessen könntest."}]},
];

/* ═══ BATTERIE ═══ */
const BAT_CATS = [
  {id:"natur",emoji:"🌿",label:"Natur",color:"#B8E8D0",colorDark:"#6FC49E",colorLight:"#DFF5EA",helpId:"start"},
  {id:"bewegung",emoji:"🏃",label:"Bewegung",color:"#FFB5A7",colorDark:"#E8876F",colorLight:"#FFE0DA",helpId:"restless"},
  {id:"ruhe",emoji:"🧘",label:"Ruhe",color:"#C8A8E9",colorDark:"#9B6FCF",colorLight:"#EDE0F7",helpId:"overwhelm"},
  {id:"kreativ",emoji:"🎨",label:"Kreativität",color:"#FFD6A0",colorDark:"#CC9544",colorLight:"#FFF0D6",helpId:"focus"},
  {id:"sozial",emoji:"👥",label:"Soziales",color:"#A8D8EA",colorDark:"#5BA3C0",colorLight:"#D6EEFB",helpId:"start"},
  {id:"haushalt",emoji:"🏠",label:"Haushalt",color:"#F4A0B5",colorDark:"#D06B83",colorLight:"#FCE0E8",helpId:"overwhelm"},
  {id:"lernen",emoji:"📚",label:"Lernen",color:"#B8D8A8",colorDark:"#6FA05A",colorLight:"#E0F0D6",helpId:"focus"},
  {id:"schlaf",emoji:"💤",label:"Schlaf",color:"#D8B8D8",colorDark:"#A07AA0",colorLight:"#F0E0F0",helpId:"overwhelm"},
  {id:"ernaehrung",emoji:"🥗",label:"Ernährung",color:"#A8E8C0",colorDark:"#5AB880",colorLight:"#D6F5E6",helpId:"forget"},
  {id:"hygiene",emoji:"🫧",label:"Selbstpflege",color:"#E8C8A8",colorDark:"#B8945A",colorLight:"#F5E8D6",helpId:"start"},
];
const INTERVALS=[{id:"daily",label:"Täglich",days:1},{id:"every2",label:"Alle 2–3 Tage",days:2.5},{id:"weekly",label:"Wöchentlich",days:7},{id:"biweekly",label:"Alle 2 
Wochen",days:14},{id:"monthly",label:"Monatlich",days:30}];
const REMIND_OPTS=[{id:"none",label:"Aus"},{id:"overdue",label:"Wenn überfällig"},{id:"1day",label:"1 Tag vorher",hoursB4:24},{id:"2days",label:"2 Tage vorher",hoursB4:48}];

function getBatColor(p){if(p>80)return"#5EC269";if(p>60)return"#A8D040";if(p>40)return"#F0C040";if(p>20)return"#E86A5A";return"#B83A3A";}
function getBatLabel(p){if(p>80)return"Voll geladen";if(p>60)return"Gut dabei";if(p>40)return"Wird langsam knapp";if(p>20)return"Niedrig — aufladen!";return"Kritisch — kleine Schritte!";}
function isOver(ld,d){if(!ld)return true;return(Date.now()-new Date(ld).getTime())/36e5>d*24;}
function hoursUntilDue(ld,d){if(!ld)return-9999;return(d*24)-((Date.now()-new Date(ld).getTime())/36e5);}
function calcBat(hs){if(!hs.length)return 100;const tw=hs.reduce((s,h)=>s+(h.weight||1),0);let c=0;hs.forEach(h=>{const n=((h.weight||1)/tw)*100;const
iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];if(!isOver(h.lastDone,iv.days))c+=n;});return Math.round(c);}
function timeAgo(iso){if(!iso)return"Noch nie";const h=(Date.now()-new Date(iso).getTime())/36e5;if(h<1)return"Gerade eben";if(h<24)return`Vor ${Math.floor(h)} Std`;const
d=Math.floor(h/24);if(d===1)return"Gestern";if(d<7)return`Vor ${d} Tagen`;const w=Math.floor(d/7);return w===1?"Vor 1 Woche":`Vor ${w} Wochen`;}

/* ═══ SVG ═══ */
const Octopus=({size=80,animate=false})=>(<svg width={size} height={size} viewBox="0 0 100 100" style={animate?{animation:"wiggle .6s ease-in-out infinite"}:{}}><ellipse cx="50" cy="38" rx="30" ry="28" 
fill="#C8A8E9"/><ellipse cx="50" cy="38" rx="26" ry="24" fill="#DCC8F0"/><circle cx="40" cy="34" r="5" fill="#333"/><circle cx="60" cy="34" r="5" fill="#333"/><circle cx="42" cy="32" r="2" fill="#fff"/><circle 
cx="62" cy="32" r="2" fill="#fff"/><ellipse cx="50" cy="44" rx="4" ry="2.5" fill="#E8876F"/>{["M25 55Q20 75 15 80","M32 58Q25 78 22 85","M42 60Q38 80 35 88","M58 60Q62 80 65 88","M68 58Q75 78 78 85","M75 55Q80
75 85 80"].map((d,i)=><path key={i} d={d} stroke="#C8A8E9" strokeWidth="6" fill="none" strokeLinecap="round"/>)}</svg>);
const Fox=({size=80,animate=false})=>(<svg width={size} height={size} viewBox="0 0 100 100" style={animate?{animation:"nod 1s ease-in-out infinite"}:{}}><polygon points="30,35 20,10 40,28" 
fill="#FFB5A7"/><polygon points="70,35 80,10 60,28" fill="#FFB5A7"/><polygon points="32,35 24,16 40,30" fill="#FFE0DA"/><polygon points="68,35 76,16 60,30" fill="#FFE0DA"/><ellipse cx="50" cy="50" rx="28" 
ry="26" fill="#FFB5A7"/><ellipse cx="50" cy="56" rx="18" ry="16" fill="#FFF5E4"/><circle cx="40" cy="44" r="4" fill="#333"/><circle cx="60" cy="44" r="4" fill="#333"/><circle cx="41.5" cy="42.5" r="1.5" 
fill="#fff"/><circle cx="61.5" cy="42.5" r="1.5" fill="#fff"/><ellipse cx="50" cy="54" rx="4" ry="2.5" fill="#333"/><path d="M46 58Q50 63 54 58" stroke="#333" strokeWidth="1.5" fill="none" 
strokeLinecap="round"/></svg>);
const Caterpillar=({size=80,animate=false})=>(<svg width={size} height={size} viewBox="0 0 100 100" style={animate?{animation:"bounce .8s ease-in-out infinite"}:{}}><circle cx="20" cy="65" r="10" 
fill="#8DD4A8"/><circle cx="35" cy="58" r="11" fill="#9BE0B4"/><circle cx="52" cy="54" r="12" fill="#A8E8C0"/><circle cx="70" cy="50" r="13" fill="#B8E8D0"/><circle cx="70" cy="50" r="9" fill="#D0F0E0"/><circle 
cx="65" cy="46" r="3.5" fill="#333"/><circle cx="76" cy="46" r="3.5" fill="#333"/><circle cx="66.2" cy="44.5" r="1.3" fill="#fff"/><circle cx="77.2" cy="44.5" r="1.3" fill="#fff"/><path d="M67 54Q70.5 57 74 54" 
stroke="#6FC49E" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>);
const MiniAnimal=({type,size=44})=>{const m={"🐢":<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="30" ry="22" fill="#8CC8A0"/><path d="M30 52Q50 38 70 52" 
fill="#6CB888"/><ellipse cx="80" cy="42" rx="8" ry="7" fill="#A8D8B8"/><circle cx="78" cy="40" r="2.5" fill="#333"/></svg>,"🐻":<svg width={size} height={size} viewBox="0 0 100 100"><circle cx="30" cy="28" 
r="14" fill="#D4A574"/><circle cx="70" cy="28" r="14" fill="#D4A574"/><ellipse cx="50" cy="52" rx="28" ry="26" fill="#D4A574"/><circle cx="40" cy="46" r="4" fill="#333"/><circle cx="60" cy="46" r="4" 
fill="#333"/><ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#333"/></svg>,"🦋":<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="30" cy="40" rx="20" ry="22" fill="#D8B8F0" transform="rotate(-15 
30 40)"/><ellipse cx="70" cy="40" rx="20" ry="22" fill="#D8B8F0" transform="rotate(15 70 40)"/><ellipse cx="50" cy="50" rx="5" ry="18" fill="#9B7CC0"/><circle cx="50" cy="30" r="6" fill="#9B7CC0"/><circle 
cx="47" cy="28" r="2" fill="#333"/><circle cx="53" cy="28" r="2" fill="#333"/></svg>,"🐒":<svg width={size} height={size} viewBox="0 0 100 100"><circle cx="25" cy="45" r="12" fill="#D4A574"/><circle cx="75" 
cy="45" r="12" fill="#D4A574"/><ellipse cx="50" cy="48" rx="25" ry="24" fill="#C49464"/><circle cx="42" cy="42" r="3.5" fill="#333"/><circle cx="58" cy="42" r="3.5" fill="#333"/><path d="M44 58Q50 63 56 58" 
stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>,"🦔":<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="30" ry="22" fill="#C4A882"/><ellipse cx="35" 
cy="58" rx="14" ry="12" fill="#E8D8C4"/><circle cx="30" cy="54" r="3" fill="#333"/></svg>,"🐨":<svg width={size} height={size} viewBox="0 0 100 100"><circle cx="28" cy="30" r="14" fill="#A0B8C8"/><circle cx="72"
cy="30" r="14" fill="#A0B8C8"/><ellipse cx="50" cy="50" rx="26" ry="25" fill="#B0C8D8"/><circle cx="40" cy="44" r="4" fill="#333"/><circle cx="60" cy="44" r="4" fill="#333"/><ellipse cx="50" cy="55" rx="6" 
ry="4" fill="#444"/></svg>,"🐌":<svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="42" cy="68" rx="28" ry="10" fill="#E8D4B8"/><circle cx="62" cy="48" r="22" fill="#E8C8A8"/><circle cx="62" 
cy="48" r="15" fill="#D4A880"/><ellipse cx="30" cy="60" rx="10" ry="8" fill="#E8D4C0"/><circle cx="26" cy="56" r="2.5" fill="#333"/></svg>,"🐘":<svg width={size} height={size} viewBox="0 0 100 100"><ellipse 
cx="50" cy="48" rx="28" ry="26" fill="#B0B8C8"/><ellipse cx="25" cy="42" rx="12" ry="16" fill="#A0A8B8"/><ellipse cx="75" cy="42" rx="12" ry="16" fill="#A0A8B8"/><circle cx="38" cy="40" r="4" 
fill="#333"/><circle cx="58" cy="40" r="4" fill="#333"/><path d="M50 52Q48 62 45 70Q48 72 52 70Q50 62 50 52" fill="#A0A8B8"/></svg>};return m[type]||<span style={{fontSize:size*.6}}>{type}</span>;};
const Star=({filled=false,size=24})=>(<svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
fill={filled?"#FFD700":"#E8E0D8"} stroke={filled?"#E8A800":"none"} strokeWidth=".5"/></svg>);
const Mascots={appetizer:Octopus,entree:Fox,side:Caterpillar};
const EMOJIS=["💡","🌟","🎯","🧩","🏃","🎵","📝","🫁","🧘","💪","🌱","🔔","📸","🗒️ ","☕","🫂","🎨","🔑","🧊","✨"];
const BatterySVG=({pct,size=100})=>{const color=getBatColor(pct),h=60,w=36,r=6;return(<svg width={size} height={size} viewBox="0 0 80 80"><g transform={`translate(${40-w/2},10)`}><rect x={w/2-6} y={-4} 
width={12} height={6} rx={2} fill="#ccc"/><rect x={0} y={0} width={w} height={h} rx={r} fill="none" stroke="#D0D0D0" strokeWidth={2.5}/><clipPath id={`bc${size}${pct}`}><rect x={1.5} y={1.5} width={w-3} 
height={h-3} rx={r-1}/></clipPath><rect x={1.5} y={1.5+(h-3)-(h-3)*pct/100} width={w-3} height={(h-3)*pct/100} fill={color} clipPath={`url(#bc${size}${pct})`} style={{transition:"all .6s 
ease-out"}}/>{[20,40,60,80].map(l=><line key={l} x1={3} y1={h-h*l/100} x2={w-3} y2={h-h*l/100} stroke="#fff" strokeWidth={1} opacity={.5}/>)}</g><text x={40} y={78} textAnchor="middle" fontSize={12} 
fontWeight={700} fill={color} fontFamily="Fredoka,sans-serif">{pct}%</text></svg>);};

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
  if(settings?.dailyTip){const sh=SOFORTHILFE[Math.floor(Math.random()*SOFORTHILFE.length)];const t=sh.tips[Math.floor(Math.random()*sh.tips.length)];notifs.push({type:"tip",msg:`${sh.emoji} ${t.title}:
${t.text}`,color:"#C8A8E9",helpId:sh.id});}
  if(settings?.dailyMenu){const cats=Object.values(CATEGORIES);const c=cats[Math.floor(Math.random()*cats.length)];const
it=c.defaults[Math.floor(Math.random()*c.defaults.length)];notifs.push({type:"menu",msg:`${c.emoji} Menü-Tipp: ${it.name} — ${it.desc}`,color:"#B8E8D0"});}
  return notifs;
}

/* ═══ STORAGE ═══ */
const SK="dopamin_menu_v5";const ld=()=>{try{const r=localStorage.getItem(SK);return r?JSON.parse(r):null;}catch{return null;}};const sv=d=>{try{localStorage.setItem(SK,JSON.stringify(d));}catch{}};const
defI=()=>{const it={};Object.values(CATEGORIES).forEach(c=>{it[c.key]=[...c.defaults];});return it;};

/* ═══ APP ═══ */
const ONBOARDING_DATA = {
  struggles: [
    { id: "focus", label: "Fokus halten", emoji: "🧠" },
    { id: "start", label: "In Gang kommen", emoji: "⚡" },
    { id: "emotions", label: "Gefühle regulieren", emoji: "😤" },
    { id: "overwhelm", label: "Energie & Antrieb", emoji: "😴" },
    { id: "restless", label: "Gedankenkarussell stoppen", emoji: "🌀" }
  ],
  times: [
    { id: "5", label: "5 Minuten", emoji: "⏱️ " },
    { id: "15", label: "15-20 Minuten", emoji: "⌛" },
    { id: "30", label: "30+ Minuten", emoji: "📅" }
  ],
  preferences: [
    { id: "bewegung", label: "Bewegung", emoji: "🏃" },
    { id: "kreativ", label: "Kreatives", emoji: "🎨" },
    { id: "ruhe", label: "Musik/Sensorik", emoji: "🎵" },
    { id: "ruhe_strict", label: "Ruhe/Atemübungen", emoji: "🧘" }
  ]
};

export default function DopaminMenu(){
  const st = ld();
  const [onboardingComplete, setOnboardingComplete] = useState(localStorage.getItem("onboarding_complete") === "true");
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingProfile, setOnboardingProfile] = useState(st?.onboardingProfile || { struggles: [], time: null, preferences: [] });
  const [showHint, setShowHint] = useState(false);

  const[items,setItems]=useState(st?.items||defI());
  const[stars,setStars]=useState(st?.stars||0);const[streak,setStreak]=useState(st?.streak||0);const[lastDate,setLastDate]=useState(st?.lastDate||null);const[doneToday,setDoneToday]=useState(st?.doneToday||0);
  const[habits,setHabits]=useState(st?.habits||[]);const[customTips,setCustomTips]=useState(st?.customTips||{});const[catOrder,setCatOrder]=useState(st?.catOrder||BAT_CATS.map(c=>c.id));
  const[notifSettings,setNotifSettings]=useState(st?.notifSettings||{dailyTip:false,dailyMenu:false});
  const[activeTimer,setActiveTimer]=useState(null);const[showAdd,setShowAdd]=useState(null);const[nn,setNN]=useState("");const[nd,setND]=useState("");
  const[celebration,setCelebration]=useState(false);const[randomPick,setRandomPick]=useState(null);const[tab,setTab]=useState("menu");const[timerOn,setTimerOn]=useState(false);
  const[openProb,setOpenProb]=useState(null);const[showSci,setShowSci]=useState(null);const[addTipFor,setAddTipFor]=useState(null);const[tIcon,setTIcon]=useState("💡");const[tTitle,setTTitle]=useState("");const[
tText,setTText]=useState("");
  const[openCat,setOpenCat]=useState(null);const[showHF,setShowHF]=useState(false);const[hN,setHN]=useState("");const[hW,setHW]=useState(1);const[hInt,setHInt]=useState("weekly");const[hRemind,setHRemind]=useSta
te("overdue");
  const[checkAnim,setCheckAnim]=useState(null);const[dragId,setDragId]=useState(null);
  const[showNotifs,setShowNotifs]=useState(false);const[showNotifSettings,setShowNotifSettings]=useState(false);
  const[notifications,setNotifications]=useState([]);
  const timerRef=useRef(null);

  // persist
  useEffect(()=>{sv({items,stars,streak,lastDate,doneToday,habits,customTips,catOrder,notifSettings,onboardingProfile});},[items,stars,streak,lastDate,doneToday,habits,customTips,catOrder,notifSettings,onboardin
gProfile]);

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
    if(overdue.length>0){sendBrowserNotif("🔋 Dopamin-Menü",`${overdue.length} Habit${overdue.length>1?"s":""} überfällig — schau mal rein!`);}
    const interval=setInterval(build,60000);
    return()=>clearInterval(interval);
  },[habits,notifSettings]);

  // timer
  useEffect(()=>{if(activeTimer&&activeTimer.remaining>0){timerRef.current=setInterval(()=>{setActiveTimer(p=>{if(!p)return null;if(p.remaining<=1){clearInterval(timerRef.current);doComplete();return{...p,remain
ing:0};}return{...p,remaining:p.remaining-1};});},1000);}return()=>clearInterval(timerRef.current);},[activeTimer?.item?.id,timerOn]);

  const doComplete=useCallback(()=>{setCelebration(true);setStars(s=>s+1);const t=new
Date().toDateString();setDoneToday(c=>c+1);if(lastDate!==t){setStreak(s=>s+1);setLastDate(t);}setTimeout(()=>setCelebration(false),3000);},[lastDate]);
  const startTm=(ck,item)=>{clearInterval(timerRef.current);setActiveTimer({category:ck,item,remaining:CATEGORIES[ck].duration});setTimerOn(true);};
  const stopTm=()=>{clearInterval(timerRef.current);setActiveTimer(null);setTimerOn(false);};
  const pickR=()=>{const cs=Object.keys(CATEGORIES);const ck=cs[Math.floor(Math.random()*cs.length)];const ci=items[ck];setRandomPick({catKey:ck,item:ci[Math.floor(Math.random()*ci.length)]});};
  const addI=ck=>{if(!nn.trim())return;setItems(p=>({...p,[ck]:[...p[ck],{id:"c_"+Date.now(),name:nn.trim(),desc:nd.trim()||"✨"}]}));setNN("");setND("");setShowAdd(null);};
  const rmI=(ck,id)=>{setItems(p=>({...p,[ck]:p[ck].filter(i=>i.id!==id)}));};
  const fmt=s=>Math.floor(s/60)+":"+(s%60).toString().padStart(2,"0");
  const prog=activeTimer?1-activeTimer.remaining/CATEGORIES[activeTimer.category].duration:0;
  const addCT=pid=>{if(!tTitle.trim())return;setCustomTips(p=>({...p,[pid]:[...(p[pid]||[]),{id:"ct_"+Date.now(),icon:tIcon,title:tTitle.trim(),text:tText.trim()||"",custom:true}]}));setTIcon("💡");setTTitle("")
;setTText("");setAddTipFor(null);};
  const rmCT=(pid,tid)=>{setCustomTips(p=>({...p,[pid]:(p[pid]||[]).filter(t=>t.id!==tid)}));};
  const allTips=pid=>{const pr=SOFORTHILFE.find(p=>p.id===pid);return[...(pr?.tips||[]),...(customTips[pid]||[])];};
  const habitsFor=cid=>habits.filter(h=>h.category===cid);
  const addHabit=cid=>{if(!hN.trim())return;setHabits(p=>[...p,{id:"h_"+Date.now(),name:hN.trim(),category:cid,weight:hW,interval:hInt,remind:hRemind,lastDone:null}]);setHN("");setHW(1);setHInt("weekly");setHRem
ind("overdue");setShowHF(false);};
  const checkIn=hid=>{setHabits(p=>p.map(h=>h.id===hid?{...h,lastDone:new Date().toISOString()}:h));setCheckAnim(hid);setTimeout(()=>setCheckAnim(null),800);setStars(s=>s+1);};
  const rmH=hid=>{setHabits(p=>p.filter(h=>h.id!==hid));};
  const goToHelp=hid=>{setTab("hilfe");setOpenProb(hid);setOpenCat(null);setShowNotifs(false);};

  const cfgCats=catOrder.filter(cid=>habitsFor(cid).length>0);
  const avgBat=cfgCats.length?Math.round(cfgCats.reduce((s,cid)=>s+calcBat(habitsFor(cid)),0)/cfgCats.length):null;
  const onDS=(e,id)=>{setDragId(id);e.dataTransfer.effectAllowed="move";};const onDO=e=>{e.preventDefault();};const onDr=(e,tid)=>{e.preventDefault();if(!dragId||dragId===tid)return;setCatOrder(p=>{const
a=[...p],fi=a.indexOf(dragId),ti=a.indexOf(tid);a.splice(fi,1);a.splice(ti,0,dragId);return a;});setDragId(null);};
  const getQT=cid=>{const cat=BAT_CATS.find(c=>c.id===cid);const ch=habitsFor(cid);const ov=ch.filter(h=>{const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];return isOver(h.lastDone,iv.days);});const
hp=SOFORTHILFE.find(p=>p.id===cat?.helpId);const tips=[];if(ov.length){const e=ov.reduce((a,b)=>(a.weight||1)<(b.weight||1)?a:b);const
tw=ch.reduce((s,h)=>s+(h.weight||1),0);tips.push({icon:"⚡",title:"Schnellster Boost: "+e.name,text:`+${Math.round(((e.weight||1)/tw)*100)}%`,action:()=>checkIn(e.id)});}if(hp?.tips.length){const
t=hp.tips[Math.floor(Math.random()*hp.tips.length)];tips.push({icon:hp.emoji,title:t.title,text:t.text,link:cat?.helpId});}tips.push({icon:"🧸",title:"Nur 1 Minute",text:"Timer auf 60 Sek. Tu das 
Einfachste."});return tips.slice(0,3);};
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes
wiggle{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}@keyframes nod{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes bounce{0%,100%{transform:translateY(0)
scaleY(1)}50%{transform:translateY(-8px) scaleY(.95)}}@keyframes pop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}@keyframes confetti{0%{transform:translateY(0)
rotate(0);opacity:1}100%{transform:translateY(-120px) rotate(720deg);opacity:0}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes
fadeIn{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}@keyframes slideIn{0%{transform:translateX(50px);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes
pulse{0%,100%{opacity:1}50%{opacity:.6}}@keyframes checkPop{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}@media(min-width:768px){.tablet-grid{grid-template-columns:repeat(auto-fill,mi
nmax(180px,1fr))!important}.bat-grid-t{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))!important}}`}</style>

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
                      <span style={{ fontSize: 32 }}>{s.emoji}</span>
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
                      <span style={{ fontSize: 32 }}>{t.emoji}</span>
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
                      style={{ ...S.obOpt, borderColor: onboardingProfile.preferences.includes(p.id) ? "#B8E8D0" : "transparent", background: onboardingProfile.preferences.includes(p.id) ? "#DFF5EA" : "#FFF5E4" 
}}
                      onClick={() => toggleOnboardingSelection("preferences", p.id, true)}
                    >
                      <span style={{ fontSize: 32 }}>{p.emoji}</span>
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
                style={{ ...S.obNext, opacity: (onboardingStep === 1 && onboardingProfile.struggles.length > 0) || (onboardingStep === 2 && onboardingProfile.time) || (onboardingStep === 3 &&
onboardingProfile.preferences.length > 0) ? 1 : 0.5 }}
                disabled={!((onboardingStep === 1 && onboardingProfile.struggles.length > 0) || (onboardingStep === 2 && onboardingProfile.time) || (onboardingStep === 3 && onboardingProfile.preferences.length >
0))}
                onClick={() => onboardingStep < 3 ? setOnboardingStep(s => s + 1) : finishOnboarding()}
              >
                {onboardingStep === 3 ? "Fertig ✨" : "Weiter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HINT */}
      {showHint && <div style={S.hint}>Du kannst alles jederzeit anpassen ✨</div>}

      {/* HEADER */}
      <div style={S.hdr}><div style={S.hdrTop}><div style={{animation:"float 3s ease-in-out infinite"}}><Octopus size={34}/></div><div><h1 style={S.title}>Dopamin-Menü</h1><p style={S.sub}>🧸 Jellycat
Edition</p></div><div style={{animation:"float 3s ease-in-out infinite 1s"}}><Fox size={34}/></div></div>
        <div style={S.stats}>
          <div style={S.stat}>⭐<span style={S.statN}>{stars}</span><span style={S.statL}>Sterne</span></div>
          <div style={S.stat}>🔥<span style={S.statN}>{streak}</span><span style={S.statL}>Streak</span></div>
          <div style={S.stat}>✅<span style={S.statN}>{doneToday}</span><span style={S.statL}>Heute</span></div>
          {avgBat!==null&&<div style={{...S.stat,borderLeft:`3px solid ${getBatColor(avgBat)}`}}>🔋<span style={{...S.statN,color:getBatColor(avgBat)}}>{avgBat}%</span><span style={S.statL}>Energie</span></div>}
          {/* notif bell */}
          <button style={{...S.stat,cursor:"pointer",border:"none",position:"relative"}} onClick={()=>{setShowNotifs(!showNotifs);setShowNotifSettings(false);requestNotifPermission();}}>
            🔔{urgentNotifs.length>0&&<span style={S.notifBadge}>{urgentNotifs.length}</span>}
          </button>
        </div>
      </div>

      {/* NOTIFICATION PANEL */}
      {showNotifs&&<div style={S.notifPanel}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h3 style={{fontSize:15,fontWeight:700,color:"#5B4A6A"}}>🔔 Benachrichtigungen</h3>
          <button style={S.notifGear} onClick={()=>setShowNotifSettings(!showNotifSettings)}>⚙️ </button>
        </div>

        {showNotifSettings&&<div style={S.notifSettingsBox}>
          <h4 style={{fontSize:13,fontWeight:600,color:"#5B4A6A",marginBottom:8}}>Einstellungen</h4>
          <label style={S.notifToggle}><input type="checkbox" checked={notifSettings.dailyTip} onChange={e=>setNotifSettings(p=>({...p,dailyTip:e.target.checked}))}/><span>🩹 Täglicher Hilfe-Tipp</span></label>
          <label style={S.notifToggle}><input type="checkbox" checked={notifSettings.dailyMenu} onChange={e=>setNotifSettings(p=>({...p,dailyMenu:e.target.checked}))}/><span>🍽️  Täglicher
Menü-Vorschlag</span></label>
          <p style={{fontSize:10,color:"#9B8AAE",marginTop:6}}>Erinnerungen pro Habit stellst du beim Anlegen oder Bearbeiten ein.</p>
        </div>}

        {notifications.length===0&&<p style={{fontSize:12,color:"#9B8AAE",textAlign:"center",padding:"16px 0"}}>Alles im grünen Bereich! 🌿</p>}
        {notifications.map((n,i)=>(<div key={i} style={{...S.notifItem,borderLeftColor:n.color,animation:`fadeIn .2s ease-out ${i*.05}s both`}}>
          <p style={{fontSize:12,color:"#5B4A6A",lineHeight:1.4}}>{n.msg}</p>
          {n.type==="overdue"&&<button style={{...S.notifAction,background:n.color}} onClick={()=>{checkIn(n.habit.id);setShowNotifs(false);}}>Erledigt ✓</button>}
          {n.link&&<button style={{...S.notifAction,background:"#A8D8EA"}} onClick={()=>goToHelp(n.link)}>Hilfe →</button>}
        </div>))}
      </div>}

      {/* TABS */}
      {!timerOn&&<div style={S.tabBar}>{[["menu","🍽️  Menü"],["hilfe","🩹 Hilfe"],["batterie","🔋 Batterie"]].map(([k,l])=>(<button key={k} style={{...S.tabBtn,...(tab===k?S.tabAct[k]:{})}} 
onClick={()=>{setTab(k);setOpenProb(null);setOpenCat(null);setShowNotifs(false);}}>{l}</button>))}</div>}
      {tab==="menu"&&!timerOn&&<button style={S.rndBtn} onClick={pickR}>🎲 Ich brauch was!</button>}

      {/* MODALS */}
      {randomPick&&<div style={S.ov} onClick={()=>setRandomPick(null)}><div style={S.modal} onClick={e=>e.stopPropagation()}><p style={{fontSize:12,color:"#9B8AAE",marginBottom:7}}>Dein Gehirn
bekommt...</p>{(()=>{const M=Mascots[randomPick.catKey];return<M size={62} animate/>;})()}<h3 
style={{fontSize:18,fontWeight:700,marginTop:4,color:CATEGORIES[randomPick.catKey].colorDark}}>{randomPick.item.name}</h3><p style={{fontSize:12,color:"#6B5F7F",margin:"3px 0"}}>{randomPick.item.desc}</p><div 
style={{display:"flex",gap:8,marginTop:12}}><button style={{...S.modBtn,background:CATEGORIES[randomPick.catKey].color}} onClick={()=>{startTm(randomPick.catKey,randomPick.item);setRandomPick(null);}}>Los!
🚀</button><button style={{...S.modBtn,background:"#E8E0D8",color:"#666"}} onClick={()=>{setRandomPick(null);pickR();}}>Nochmal 🎲</button></div></div></div>}
      {celebration&&<div style={S.celeb}><div style={{animation:"pop .5s ease-out"}}><p style={{fontSize:24,fontWeight:700,color:"#5B4A6A"}}>Geschafft! 🎉</p><div 
style={{display:"flex",gap:4,justifyContent:"center",margin:"10px 0"}}>{[...Array(5)].map((_,i)=><div key={i} style={{animation:`pop .3s ease-out ${i*.1}s both`}}><Star filled size={28}/></div>)}</div><p 
style={{fontSize:14,color:"#9B6FCF",fontWeight:600}}>+1 ⭐ für dich!</p></div></div>}
      {timerOn&&activeTimer&&<div style={{...S.tmV,background:CATEGORIES[activeTimer.category].colorLight}}><div style={{animation:"float 2.5s ease-in-out infinite"}}>{(()=>{const
M=Mascots[activeTimer.category];return<M size={86} animate={activeTimer.remaining>0}/>;})()}</div><h2 
style={{fontSize:19,fontWeight:700,color:CATEGORIES[activeTimer.category].colorDark}}>{activeTimer.item.name}</h2><p style={{fontSize:12,color:"#6B5F7F",marginBottom:4}}>{activeTimer.item.desc}</p><div 
style={S.tmR}><svg width="164" height="164" viewBox="0 0 164 164"><circle cx="82" cy="82" r="70" fill="none" stroke="#fff" strokeWidth="8" opacity=".5"/><circle cx="82" cy="82" r="70" fill="none" 
stroke={CATEGORIES[activeTimer.category].color} strokeWidth="8" strokeLinecap="round" strokeDasharray={2*Math.PI*70} strokeDashoffset={2*Math.PI*70*(1-prog)} transform="rotate(-90 82 82)" 
style={{transition:"stroke-dashoffset 1s linear"}}/></svg><div style={S.tmTx}>{activeTimer.remaining>0?<span 
style={{fontSize:32,fontWeight:700,color:CATEGORIES[activeTimer.category].colorDark}}>{fmt(activeTimer.remaining)}</span>:<span style={{fontSize:32}}>🎉</span>}</div></div><button 
style={{background:"#fff",border:`2.5px solid ${CATEGORIES[activeTimer.category].colorDark}`,borderRadius:50,padding:"9px 
22px",fontSize:13,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",color:CATEGORIES[activeTimer.category].colorDark,marginTop:4}} onClick={stopTm}>{activeTimer.remaining===0?"Zurück
🧸":"Abbrechen"}</button></div>}
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
      }).map(cat=>{const M=Mascots[cat.key];return(<div key={cat.key}><div style={{...S.cH,background:cat.colorLight}}><M size={40}/><div><h2 style={{fontSize:15,fontWeight:700,color:cat.colorDark}}>{cat.emoji}
{cat.label}</h2><p style={{fontSize:10,fontWeight:500,color:cat.colorDark,opacity:.8}}>{cat.subtitle} · {cat.duration/60} Min</p></div></div><div className="tablet-grid" 
style={S.gr}>{items[cat.key].map(item=>(<div key={item.id} style={{...S.cd,borderColor:cat.color}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><h3 
style={{fontSize:13,fontWeight:600,color:"#4A3D5C"}}>{item.name}</h3>{item.id.startsWith("c_")&&<button style={S.rm} onClick={()=>rmI(cat.key,item.id)}>×</button>}</div><p 
style={{fontSize:10.5,color:"#8B7FA0",lineHeight:1.35,flex:1}}>{item.desc}</p><button style={{...S.ab,background:cat.color,color:cat.colorDark}} onClick={()=>startTm(cat.key,item)}>Starten
▶</button></div>))}{showAdd===cat.key?(<div style={{...S.cd,borderColor:cat.color,borderStyle:"dashed"}}><input style={{...S.inp,borderColor:cat.color}} placeholder="Name ✨" value={nn} 
onChange={e=>setNN(e.target.value)} autoFocus/><input style={{...S.inp,borderColor:cat.color}} placeholder="Beschreibung" value={nd} onChange={e=>setND(e.target.value)}/><div 
style={{display:"flex",gap:6}}><button style={{...S.ab,background:cat.color,color:cat.colorDark,flex:1}} onClick={()=>addI(cat.key)}>OK</button><button style={{...S.ab,background:"#E8E0D8",color:"#888",flex:1}} 
onClick={()=>{setShowAdd(null);setNN("");setND("");}}>×</button></div></div>):(<button style={{...S.addCd,borderColor:cat.color,color:cat.colorDark}} 
onClick={()=>setShowAdd(cat.key)}>+</button>)}</div></div>);})}</div>}

      {/* ═══ HILFE ═══ */}
      {tab==="hilfe"&&!timerOn&&<div style={{padding:"4px 16px"}}><div style={S.hI}><Caterpillar size={40} animate/><p style={{fontSize:12,color:"#5B4A6A",fontWeight:500,lineHeight:1.4}}>Was macht dir gerade zu
schaffen? 💛</p></div>
        {!openProb?(<div className="tablet-grid" style={S.pG}>{sortedSoforthilfe.map((p,i)=>(<button key={p.id} style={{...S.pC,background:p.colorLight,borderColor:p.color,animation:`fadeIn .3s ease-out
${i*.04}s both`}} onClick={()=>setOpenProb(p.id)}><MiniAnimal type={p.emoji} size={44}/><span style={{fontSize:11.5,fontWeight:600,textAlign:"center",lineHeight:1.25,color:p.colorDark}}>{p.title}</span><span
style={{fontSize:9.5,fontWeight:500,color:"#9B8AAE"}}>{p.animal}</span></button>))}</div>)
        :(()=>{const pr=SOFORTHILFE.find(p=>p.id===openProb);const tips=allTips(openProb);return(<div style={{animation:"fadeIn .3s ease-out"}}><button style={S.bk}
onClick={()=>{setOpenProb(null);setAddTipFor(null);}}>← Zurück</button>
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:16,marginBottom:8,background:pr.colorLight}}><MiniAnimal type={pr.emoji} size={50}/><div style={{flex:1}}><h2
style={{fontSize:17,fontWeight:700,color:pr.colorDark}}>{pr.title}</h2><p style={{fontSize:11,fontWeight:500,opacity:.8,color:pr.colorDark}}>{pr.animal} hat Tipps 💛</p></div><button
style={{background:"#fff",border:`2px solid ${pr.color}`,borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}}
onClick={()=>setShowSci(showSci===pr.id?null:pr.id)}>🔬</button></div>
          {showSci===pr.id&&<div style={{borderRadius:12,border:`2px solid ${pr.color}`,padding:"8px 12px",marginBottom:8,background:pr.colorLight}}><p
style={{fontSize:11.5,lineHeight:1.5,fontWeight:500,color:pr.colorDark}}>📚 {pr.science}</p></div>}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{tips.map((t,i)=>(<div key={t.id} style={{background:"#fff",borderRadius:14,padding:11,border:`2px solid 
${pr.color}`,display:"flex",gap:9,alignItems:"flex-start",animation:`fadeIn .3s ease-out ${i*.05}s both`}}><div 
style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,background:pr.colorLight}}>{t.icon}</div><div style={{flex:1}}><div 
style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{fontSize:13,fontWeight:600,color:pr.colorDark,marginBottom:2}}>{t.title}</h3>{t.custom&&<button style={S.rm} 
onClick={()=>rmCT(pr.id,t.id)}>×</button>}</div><p style={{fontSize:11.5,color:"#5B4A6A",lineHeight:1.45}}>{t.text}</p></div></div>))}</div>
          {addTipFor===pr.id?(<div style={{background:"#fff",borderRadius:16,border:`2.5px solid ${pr.color}`,padding:14,marginTop:10,animation:"fadeIn .2s ease-out"}}><label style={S.fL}>Emoji:</label><div 
style={{display:"flex",flexWrap:"wrap",gap:3}}>{EMOJIS.map(e=>(<button key={e} style={{width:32,height:32,borderRadius:7,border:`2px solid 
${tIcon===e?pr.color:"transparent"}`,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:tIcon===e?pr.colorLight:"transparent"}} 
onClick={()=>setTIcon(e)}>{e}</button>))}</div><input style={{...S.inp,borderColor:pr.color,marginTop:6}} placeholder="Titel" value={tTitle} onChange={e=>setTTitle(e.target.value)} autoFocus/><textarea 
style={{...S.inp,borderColor:pr.color,marginTop:5,minHeight:50,resize:"vertical"}} placeholder="Was hilft dir?" value={tText} onChange={e=>setTText(e.target.value)}/><div 
style={{display:"flex",gap:6,marginTop:6}}><button style={{...S.ab,background:pr.color,color:"#fff",flex:1,padding:"9px 0"}} onClick={()=>addCT(pr.id)}>OK</button><button 
style={{...S.ab,background:"#E8E0D8",color:"#888",flex:1,padding:"9px 0"}} onClick={()=>{setAddTipFor(null);setTTitle("");setTText("");}}>×</button></div></div>):(<button 
style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"10px",borderRadius:14,border:`2.5px dashed 
${pr.color}`,background:"#fff",fontSize:13,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",marginTop:10,color:pr.colorDark}} onClick={()=>setAddTipFor(pr.id)}>+ Eigenen Tipp</button>)}
        </div>);})()}</div>}

      {/* ═══ BATTERIE ═══ */}
      {tab==="batterie"&&!timerOn&&<div style={{padding:"4px 16px"}}>
        <div style={S.hI}><Fox size={40} animate/><p style={{fontSize:12,color:"#5B4A6A",fontWeight:500,lineHeight:1.4}}>Deine Energie-Batterien. Halte gedrückt & ziehe zum Sortieren. 🔋</p></div>
        {!openCat?(<>
          {ordCfg.length>0&&<><h3 style={S.secT}>Meine Batterien</h3><div className="bat-grid-t" style={S.batGrid}>{ordCfg.map((cid,i)=>{const bc=BAT_CATS.find(c=>c.id===cid);const ch=habitsFor(cid);const
pct=calcBat(ch);return(<button key={cid} draggable onDragStart={e=>onDS(e,cid)} onDragOver={onDO} onDrop={e=>onDr(e,cid)}
style={{...S.batCard,borderColor:getBatColor(pct),opacity:dragId===cid?.5:1,animation:`fadeIn .3s ease-out ${i*.04}s both`}} onClick={()=>setOpenCat(cid)}><BatterySVG pct={pct} size={64}/><span 
style={{fontSize:11.5,fontWeight:600,textAlign:"center",color:getBatColor(pct)}}>{bc.label}</span>{pct<=40&&<span style={{fontSize:9,color:"#E86A5A",fontWeight:600,animation:"pulse 2s 
infinite"}}>Aufladen!</span>}</button>);})}</div></>}
          {ordEmpty.length>0&&<><h3 style={{...S.secT,marginTop:ordCfg.length?16:0,opacity:.7}}>Weitere Kategorien</h3><div className="bat-grid-t" style={S.batGrid}>{ordEmpty.map((cid,i)=>{const
bc=BAT_CATS.find(c=>c.id===cid);return(<button key={cid} draggable onDragStart={e=>onDS(e,cid)} onDragOver={onDO} onDrop={e=>onDr(e,cid)}
style={{...S.batCard,borderColor:bc.color,opacity:dragId===cid?.4:.6,animation:`fadeIn .3s ease-out ${i*.04}s both`}} onClick={()=>setOpenCat(cid)}><div 
style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:64,height:64,fontSize:28,opacity:.5}}>{bc.emoji}<span style={{fontSize:10,marginTop:2}}>Leer</span></div><span 
style={{fontSize:11.5,fontWeight:600,color:bc.colorDark}}>{bc.label}</span></button>);})}</div></>}
        </>):(()=>{const bc=BAT_CATS.find(c=>c.id===openCat);const ch=habitsFor(openCat);const pct=ch.length?calcBat(ch):100;const totalW=ch.reduce((s,h)=>s+(h.weight||1),0);const
qt=pct<=40&&ch.length?getQT(openCat):[];
          return(<div style={{animation:"fadeIn .3s ease-out"}}><button style={S.bk} onClick={()=>{setOpenCat(null);setShowHF(false);}}>← Alle Batterien</button>
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:20,marginBottom:12,background:bc.colorLight}}><BatterySVG pct={ch.length?pct:100} size={90}/><div 
style={{flex:1}}><h2 style={{fontSize:20,fontWeight:700,color:bc.colorDark}}>{bc.emoji} {bc.label}</h2><p 
style={{fontSize:12,color:bc.colorDark,fontWeight:500,marginTop:2}}>{getBatLabel(ch.length?pct:100)}</p><p style={{fontSize:11,color:"#9B8AAE",marginTop:4}}>{ch.length}
Habit{ch.length!==1?"s":""}</p></div></div>
            {pct<=40&&ch.length>0&&<div style={S.qT}><h3 style={{fontSize:14,fontWeight:700,color:"#B83A3A",marginBottom:8}}>⚡ Schnell aufladen:</h3>{qt.map((q,i)=>(<div key={i} 
style={{background:"#fff",borderRadius:14,padding:11,display:"flex",gap:9,alignItems:"flex-start",marginBottom:6,animation:`fadeIn .3s ease-out ${i*.08}s both`}}><div 
style={{width:34,height:34,borderRadius:10,background:"#FDE8E6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{q.icon}</div><div style={{flex:1}}><h4 
style={{fontSize:13,fontWeight:600,color:"#5B4A6A"}}>{q.title}</h4><p style={{fontSize:11,color:"#6B5F7F",lineHeight:1.4,marginTop:2}}>{q.text}</p></div>{q.action&&<button 
style={{background:"#E86A5A",color:"#fff",border:"none",borderRadius:10,padding:"6px 12px",fontSize:11,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",alignSelf:"center"}} 
onClick={q.action}>Jetzt!</button>}{q.link&&<button style={{background:"none",border:"none",fontSize:11,fontWeight:600,color:"#5BA3C0",fontFamily:"Fredoka,sans-serif",cursor:"pointer",alignSelf:"center"}} 
onClick={()=>goToHelp(q.link)}>Hilfe →</button>}</div>))}</div>}
            {ch.length>0&&<div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12}}>{ch.map((h,idx)=>{const iv=INTERVALS.find(i=>i.id===h.interval)||INTERVALS[2];const
ov=isOver(h.lastDone,iv.days);const np=Math.round(((h.weight||1)/totalW)*100);const rm=REMIND_OPTS.find(r=>r.id===h.remind);return(<div key={h.id} 
style={{background:"#fff",borderRadius:16,padding:13,border:`2.5px solid ${ov?"#E86A5A":"#5EC269"}`,animation:`fadeIn .3s ease-out ${idx*.05}s both`}}><div style={{display:"flex",alignItems:"center",gap:9}}><div
style={{width:12,height:12,borderRadius:6,background:ov?"#E86A5A":"#5EC269",flexShrink:0}}/><div style={{flex:1,minWidth:0}}><h3 style={{fontSize:14,fontWeight:700,color:"#4A3D5C"}}>{h.name}</h3><p 
style={{fontSize:10.5,color:"#9B8AAE",fontWeight:500,marginTop:1}}>{iv.label} · {np}% · {timeAgo(h.lastDone)}{rm&&rm.id!=="none"?` · 🔔 ${rm.label}`:""}</p></div><button 
style={{background:"none",border:"none",fontSize:13,cursor:"pointer",opacity:.4}} onClick={()=>rmH(h.id)}>🗑️ </button></div><button style={{border:"none",borderRadius:12,padding:"9px 
0",fontSize:12.5,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",color:"#fff",marginTop:8,width:"100%",background:ov?"#E86A5A":"#5EC269",animation:checkAnim===h.id?"checkPop .4s 
ease-out":"none"}} onClick={()=>checkIn(h.id)}>{ov?`Aufladen +${np}%`:"Erledigt ✓"}</button></div>);})}</div>}
            {ch.length===0&&!showHF&&<div style={{textAlign:"center",padding:"24px 0"}}><Caterpillar size={50}/><p style={{fontSize:14,color:"#5B4A6A",fontWeight:600,marginTop:9}}>Noch keine Habits für
{bc.label}.</p><p style={{fontSize:12,color:"#9B8AAE",fontWeight:500,marginTop:3}}>Was lädt diese Batterie auf?</p></div>}
            {showHF?(<div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 4px 16px rgba(180,160,200,.12)",animation:"fadeIn .3s ease-out"}}><h3 
style={{fontSize:16,fontWeight:700,color:"#5B4A6A",marginBottom:10}}>Neuer Habit für {bc.emoji} {bc.label}</h3>
              <label style={S.fL}>Was lädt diese Batterie auf?</label><input style={{...S.fIn,borderColor:bc.color}} placeholder="z.B. Spaziergang, Yoga…" value={hN} onChange={e=>setHN(e.target.value)}
autoFocus/>
              <label style={S.fL}>Wichtigkeit</label><p style={{fontSize:10.5,color:"#9B8AAE",marginBottom:4}}>Höher = mehr Einfluss auf die Batterie.</p><div 
style={{display:"flex",gap:6,justifyContent:"center"}}>{[1,2,3,4,5].map(w=>(<button key={w} 
style={{width:40,height:40,borderRadius:12,border:"none",fontSize:16,fontWeight:700,fontFamily:"Fredoka,sans-serif",cursor:"pointer",background:hW===w?bc.color:bc.colorLight,color:hW===w?"#fff":bc.colorDark}} 
onClick={()=>setHW(w)}>{w}</button>))}</div>
              <label style={S.fL}>Wie oft?</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{INTERVALS.map(iv=>(<button key={iv.id} style={{border:"none",borderRadius:12,padding:"7px 
12px",fontSize:12,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",background:hInt===iv.id?"#C8A8E9":"#EDE0F7",color:hInt===iv.id?"#fff":"#9B6FCF"}} 
onClick={()=>setHInt(iv.id)}>{iv.label}</button>))}</div>
              <label style={S.fL}>🔔 Erinnerung</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{REMIND_OPTS.map(ro=>(<button key={ro.id} style={{border:"none",borderRadius:12,padding:"7px 
12px",fontSize:12,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",background:hRemind===ro.id?"#FFB5A7":"#FFE0DA",color:hRemind===ro.id?"#fff":"#E8876F"}} 
onClick={()=>setHRemind(ro.id)}>{ro.label}</button>))}</div>
              <div style={{display:"flex",gap:8,marginTop:14}}><button style={{...S.ab,background:bc.color,color:"#fff",flex:1,padding:"11px 0",fontSize:14}} onClick={()=>addHabit(openCat)}>Anlegen
🌱</button><button style={{...S.ab,background:"#E8E0D8",color:"#888",flex:1,padding:"11px 0",fontSize:14}} onClick={()=>{setShowHF(false);setHN("");}}>Abbruch</button></div>
            </div>):(<button style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",padding:"11px",borderRadius:16,border:`2.5px dashed 
${bc.color}`,background:"#fff",fontSize:13.5,fontWeight:600,fontFamily:"Fredoka,sans-serif",color:bc.colorDark,cursor:"pointer"}} onClick={()=>setShowHF(true)}>+ Neuer Habit</button>)}
          </div>);})()}
      </div>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"20px 0 4px"}}><Caterpillar size={22}/><span style={{fontSize:10.5,color:"#9B8AAE",fontWeight:500}}>Du machst das toll!
💖</span><Octopus size={22}/></div>
    </div>
  );
}

/* ═══ STYLES ═══ */
const S={
  wrap:{fontFamily:"'Fredoka',sans-serif",background:"linear-gradient(180deg,#FFF5E4,#FFF0F5 50%,#F0F5FF)",minHeight:"100vh",padding:"0 0 40px",position:"relative",overflowX:"hidden",maxWidth:900,margin:"0 
auto"},
  hdr:{textAlign:"center",padding:"18px 20px 9px",background:"linear-gradient(180deg,#FFFAF0,transparent)"},hdrTop:{display:"flex",alignItems:"center",justifyContent:"center",gap:9},
  title:{fontSize:23,fontWeight:700,color:"#5B4A6A",letterSpacing:"-.5px"},sub:{fontSize:11,color:"#9B8AAE",fontWeight:500,marginTop:1},
  stats:{display:"flex",justifyContent:"center",gap:7,marginTop:9,flexWrap:"wrap"},stat:{background:"#fff",borderRadius:16,padding:"4px 10px",display:"flex",alignItems:"center",gap:4,boxShadow:"0 2px 10px 
rgba(180,160,200,.13)",fontSize:13},statN:{fontWeight:700,fontSize:14,color:"#5B4A6A"},statL:{fontSize:9,color:"#9B8AAE",fontWeight:500},
  notifBadge:{position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:9,background:"#E86A5A",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"},
  notifPanel:{position:"absolute",top:110,left:16,right:16,background:"#fff",borderRadius:20,padding:16,boxShadow:"0 8px 32px rgba(91,74,106,.2)",zIndex:50,maxHeight:"60vh",overflowY:"auto",animation:"fadeIn .2s
ease-out"},
  notifGear:{background:"none",border:"none",fontSize:18,cursor:"pointer"},
  notifSettingsBox:{background:"#F8F4FF",borderRadius:14,padding:12,marginBottom:10},
  notifToggle:{display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:500,color:"#5B4A6A",padding:"4px 0",cursor:"pointer"},
  notifItem:{background:"#FAFAFA",borderRadius:12,padding:"10px 12px",marginBottom:6,borderLeft:"4px solid",display:"flex",alignItems:"center",gap:8},
  notifAction:{border:"none",borderRadius:10,padding:"5px 12px",fontSize:11,fontWeight:600,fontFamily:"Fredoka,sans-serif",cursor:"pointer",color:"#fff",flexShrink:0},
  tabBar:{display:"flex",gap:4,margin:"8px 16px 2px",background:"#fff",borderRadius:15,padding:3,boxShadow:"0 2px 10px rgba(180,160,200,.12)"},
  tabBtn:{flex:1,border:"none",borderRadius:12,padding:"8px 0",fontSize:12,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",background:"transparent",color:"#9B8AAE",transition:"all .2s"},
  tabAct:{menu:{background:"linear-gradient(135deg,#EDE0F7,#FFE0DA)",color:"#5B4A6A"},hilfe:{background:"linear-gradient(135deg,#D6EEFB,#DFF5EA)",color:"#5B4A6A"},batterie:{background:"linear-gradient(135deg,#DF
F5EA,#FFF0D6)",color:"#5B4A6A"}},
  rndBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,margin:"8px auto 4px",padding:"9px 22px",borderRadius:50,border:"2.5px solid #E8D0F0",background:"linear-gradient(135deg,#F5E6FF,#FFE0DA
  rndBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,margin:"8px auto 4px",padding:"9px 22px",borderRadius:50,border:"2.5px solid #E8D0F0",background:"linear-gradient(135deg,#F5E6FF,#FFE0DA
50%,#DFF5EA)",fontSize:13.5,fontWeight:600,fontFamily:"'Fredoka',sans-serif",color:"#5B4A6A",cursor:"pointer",boxShadow:"0 3px 16px rgba(200,168,233,.2)"},
  cats:{padding:"4px 16px",display:"flex",flexDirection:"column",gap:16},cH:{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:16,marginBottom:6},
  gr:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:8},
  cd:{background:"#fff",borderRadius:15,padding:10,border:"2.5px solid",boxShadow:"0 2px 10px rgba(180,160,200,.1)",display:"flex",flexDirection:"column",gap:5},
  ab:{border:"none",borderRadius:12,padding:"6px 0",fontSize:11.5,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",textAlign:"center"},
  rm:{background:"none",border:"none",fontSize:16,color:"#C4B8D4",cursor:"pointer",lineHeight:1},
  addCd:{background:"#fff",borderRadius:15,padding:10,border:"2.5px 
dashed",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:"'Fredoka',sans-serif",fontSize:22,minHeight:70},
  inp:{border:"2px solid",borderRadius:10,padding:"6px 9px",fontSize:12,fontFamily:"'Fredoka',sans-serif",outline:"none",width:"100%"},
  ov:{position:"fixed",inset:0,background:"rgba(91,74,106,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16},
  modal:{background:"#fff",borderRadius:24,padding:"22px 18px",textAlign:"center",maxWidth:320,width:"100%",animation:"pop .35s ease-out",boxShadow:"0 12px 40px rgba(91,74,106,.25)"},
  modBtn:{border:"none",borderRadius:14,padding:"8px 14px",fontSize:12,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",color:"#fff"},
  celeb:{position:"fixed",inset:0,background:"rgba(255,245,228,.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200},
  tmV:{margin:"7px 16px",borderRadius:24,padding:"24px 16px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:6},tmR:{position:"relative",width:164,height:164},tmTx:{position:"abs
olute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"},
  hI:{display:"flex",alignItems:"center",gap:8,background:"#fff",borderRadius:16,padding:"10px 12px",marginBottom:10,boxShadow:"0 2px 10px rgba(180,160,200,.1)"},
  pG:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(135px,1fr))",gap:8},
  pC:{border:"2.5px solid",borderRadius:16,padding:"11px 6px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontFamily:"'Fredoka',sans-serif"},
  bk:{background:"none",border:"none",fontSize:13,fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",marginBottom:6,color:"#5B4A6A"},
  fL:{fontSize:12,fontWeight:600,color:"#5B4A6A",marginBottom:4,marginTop:9,display:"block"},
  fIn:{border:"2.5px solid",borderRadius:12,padding:"8px 11px",fontSize:13,fontFamily:"'Fredoka',sans-serif",outline:"none",width:"100%"},
  secT:{fontSize:13,fontWeight:700,color:"#5B4A6A",marginBottom:6},
  batGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:10},
  batCard:{background:"#fff",borderRadius:18,padding:"12px 8px 10px",border:"2.5px 
solid",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontFamily:"'Fredoka',sans-serif",transition:"opacity .2s"},
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
  obNext:{background:"#C8A8E9",border:"none",borderRadius:16,padding:"12px 32px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Fredoka,sans-serif",boxShadow:"0 4px 12px 
rgba(200,168,233,.3)"},
  hint:{position:"fixed",bottom:80,left:20,right:20,background:"#5B4A6A",color:"#fff",padding:"12px 20px",borderRadius:16,fontSize:13,fontWeight:600,textAlign:"center",zIndex:1000,animation:"fadeIn .4s 
ease-out"},
};