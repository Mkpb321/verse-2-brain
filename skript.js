/*
 * Verse2Brain (V2B) – SLT 2000
 * Bibeltext wird zur Laufzeit aus "./slt2000.json" geladen (nicht im ZIP).
 * Erwartetes Format: { tables: { book: { rows: [...] }, verse: { rows: [...] } } }
 * Vers-IDs nutzen book_id / chapter / verse; Buchnamen werden über das
 * bestehende deutsche/englische Aliasverzeichnis auf Loccumer-Kürzel abgebildet.
 * Die Datenquelle kann später ausgetauscht werden, ohne die UI zu verändern.
 */

'use strict';

const STORAGE_KEY = 'bibelstellen-liste-v1';
const SETTINGS_KEY = 'verse2brain-settings-v1';
const BIBLE_FILE = './slt2000.json';
// Bestehender localStorage-Schlüssel bleibt unverändert, damit vorherige
// Listen, Reihenfolge und Ein-/Ausklappzustände übernommen werden.

// Das sichtbare Kürzel ist immer der erste Parameter. Nach dem Kürzel folgen
// geläufige deutsche/englische Namen, Kurzformen und historische Schreibweisen.
function book(abbr, ...aliases) {
  return { abbr, aliases: [abbr, ...aliases] };
}

// Nummerierte Bücher: schreibt automatisch 1 Joh, 1.Joh, 1Joh, I. Joh,
// First John, Erster Johannesbrief, 1st John usw. in den Suchindex.
function numbered(n, short, stems, ...extraAliases) {
  const ordinalDE = ['','erster','zweiter','dritter','vierter'][n];
  const ordinalEN = ['','first','second','third','fourth'][n];
  const roman = ['','I','II','III','IV'][n];
  const variants = [];
  for (const stem of stems) {
    variants.push(
      `${n} ${stem}`, `${n}.${stem}`, `${n}. ${stem}`, `${n}${stem}`,
      `${roman}. ${stem}`, `${roman} ${stem}`,
      `${ordinalDE} ${stem}`, `${ordinalEN} ${stem}`,
      `${n}${['','st','nd','rd','th'][n]} ${stem}`
    );
  }
  return book(`${n} ${short}`, ...variants, ...extraAliases);
}

const BOOKS = [
  // 1–5 Mose / Pentateuch
  book('Gen', 'Genesis', '1 Mose', '1. Mose', '1.Mose', '1 Mos', '1 Mo',
    '1 Moses', '1 Buch Mose', '1. Buch Mose', 'erstes Buch Mose',
    'first book of Moses', 'book of Genesis', 'Bereschit', 'Bereshit', 'Gn'),
  book('Ex', 'Exodus', '2 Mose', '2. Mose', '2.Mose', '2 Mos', '2 Mo',
    '2 Moses', '2 Buch Mose', 'zweites Buch Mose', 'second book of Moses',
    'book of Exodus', 'Exod', 'Exo', 'Schmot', 'Shemot'),
  book('Lev', 'Levitikus', 'Leviticus', '3 Mose', '3. Mose', '3 Mos', '3 Mo',
    '3 Moses', '3 Buch Mose', 'drittes Buch Mose', 'third book of Moses',
    'Leviti kus', 'Levit', 'Wajikra', 'Vayikra'),
  book('Num', 'Numeri', 'Numbers', '4 Mose', '4. Mose', '4 Mos', '4 Mo',
    '4 Moses', '4 Buch Mose', 'viertes Buch Mose', 'fourth book of Moses',
    'Nm', 'Bamidbar'),
  book('Dtn', 'Deuteronomium', 'Deuteronomy', 'Deut', 'Dt', '5 Mose',
    '5. Mose', '5 Mos', '5 Mo', '5 Moses', '5 Buch Mose',
    'fünftes Buch Mose', 'fuenftes Buch Mose', 'fifth book of Moses', 'Devarim'),

  // Geschichtsbücher
  book('Jos', 'Josua', 'Joshua', 'Josh', 'Josuabuch', 'Buch Josua'),
  book('Ri', 'Richter', 'Buch der Richter', 'Richterbuch', 'Judges', 'Judg', 'Jdg'),
  book('Rut', 'Rut', 'Ruth', 'Buch Rut', 'Book of Ruth', 'Ru'),
  numbered(1, 'Sam', ['Sam','Samuel','Samuelbuch','Samuel book'],
    '1 Buch Samuel', '1. Buch Samuel', 'erstes Buch Samuel', '1st Samuel'),
  numbered(2, 'Sam', ['Sam','Samuel','Samuelbuch','Samuel book'],
    '2 Buch Samuel', '2. Buch Samuel', 'zweites Buch Samuel', '2nd Samuel'),
  numbered(1, 'Kön', ['Kön','Koen','Kon','Könige','Koenige','Königen',
    'Kings','King','Kgs','Königsbuch'],
    '1 Buch der Könige', '1. Buch der Könige', 'erstes Buch der Könige',
    '1st Kings'),
  numbered(2, 'Kön', ['Kön','Koen','Kon','Könige','Koenige','Königen',
    'Kings','King','Kgs','Königsbuch'],
    '2 Buch der Könige', '2. Buch der Könige', 'zweites Buch der Könige',
    '2nd Kings'),
  numbered(1, 'Chr', ['Chr','Chronik','Chroniken','Chronikbuch',
    'Chronicles','Chronicle','Chron'],
    '1 Buch der Chronik', '1. Buch der Chronik', 'erste Chronik', '1st Chronicles'),
  numbered(2, 'Chr', ['Chr','Chronik','Chroniken','Chronikbuch',
    'Chronicles','Chronicle','Chron'],
    '2 Buch der Chronik', '2. Buch der Chronik', 'zweite Chronik', '2nd Chronicles'),
  book('Esra', 'Ezra', 'Esdras', 'Buch Esra', 'Book of Ezra', 'Esr'),
  book('Neh', 'Nehemia', 'Nehemiah', 'Nehemias', 'Nehm', 'Buch Nehemia'),
  book('Tob', 'Tobit', 'Tobias', 'Tobiah', 'Book of Tobit', 'Buch Tobit'),
  book('Jdt', 'Judit', 'Judith', 'Buch Judit', 'Book of Judith', 'Jdth'),
  book('Est', 'Ester', 'Esther', 'Esth', 'Buch Ester', 'Book of Esther'),
  numbered(1, 'Makk', ['Makk','Makkabäer','Makkabaeer','Makkabäerbuch',
    'Maccabees','Maccabean','Macc'], '1 Buch der Makkabäer', '1 Macc'),
  numbered(2, 'Makk', ['Makk','Makkabäer','Makkabaeer','Makkabäerbuch',
    'Maccabees','Maccabean','Macc'], '2 Buch der Makkabäer', '2 Macc'),

  // Weisheit, Dichtung, Psalmen
  book('Ijob', 'Hiob', 'Job', 'Iob', 'Buch Hiob', 'Book of Job'),
  book('Ps', 'Psalm', 'Psalmen', 'Psalms', 'Psalter', 'Psa', 'Psm', 'Pss', 'Psalmbook'),
  book('Spr', 'Sprüche', 'Sprueche', 'Sprichwörter', 'Sprichwoerter',
    'Sprüche Salomos', 'Proverbs', 'Prov', 'Pro', 'Prv', 'Buch der Sprüche'),
  book('Koh', 'Kohelet', 'Koheleth', 'Prediger', 'Prediger Salomo',
    'Ecclesiastes', 'Eccl', 'Ecc', 'Ekklesiastes', 'Qohelet'),
  book('Hld', 'Hohelied', 'Hohes Lied', 'Hoheslied', 'Hohelied Salomos',
    'Lied der Lieder', 'Song of Songs', 'Song of Solomon', 'Song',
    'Canticles', 'Cant', 'Sos'),
  book('Weish', 'Weisheit', 'Weisheit Salomos', 'Buch der Weisheit',
    'Wisdom', 'Wisdom of Solomon', 'Wis', 'Wisd'),
  book('Sir', 'Jesus Sirach', 'Sirach', 'Buch Jesus Sirach', 'Ecclesiasticus',
    'Ecclus', 'Ben Sira', 'Sira', 'Sirac', 'Ekklesiastikus'),

  // Große und kleine Propheten
  book('Jes', 'Jesaja', 'Jesaia', 'Isaiah', 'Isa', 'Isaias', 'Esaias'),
  book('Jer', 'Jeremia', 'Jeremias', 'Jeremiah', 'Jr'),
  book('Klgl', 'Klagelieder', 'Klagelieder Jeremias', 'Klagelieder des Jeremia',
    'Lamentations', 'Lam', 'Klg', 'Klagen'),
  book('Bar', 'Baruch', 'Baruk', 'Book of Baruch'),
  book('Ez', 'Ezechiel', 'Ezekiel', 'Hesekiel', 'Hes', 'Ezek', 'Eze', 'Ezech'),
  book('Dan', 'Daniel', 'Book of Daniel', 'Dn'),
  book('Hos', 'Hosea', 'Hoschea', 'Osee', 'Ho'),
  book('Joël', 'Joel', 'Joël', 'Joëlbuch', 'Buch Joel', 'Jl'),
  book('Am', 'Amos', 'Book of Amos'),
  book('Obd', 'Obadja', 'Obadiah', 'Obadia', 'Obdias', 'Obad', 'Ob'),
  book('Jona', 'Jona', 'Jonah', 'Jonas', 'Buch Jona', 'Jon'),
  book('Mi', 'Micha', 'Micah', 'Michäas', 'Michaeas', 'Mic', 'Mika'),
  book('Nah', 'Nahum', 'Nachum', 'Naoum', 'Na'),
  book('Hab', 'Habakuk', 'Habakkuk', 'Habbakuk', 'Chabakkuk', 'Hb'),
  book('Zef', 'Zefanja', 'Zephanja', 'Zephaniah', 'Zeph', 'Zep',
    'Sophonias', 'Sefanja', 'Zefania'),
  book('Hag', 'Haggai', 'Haggäus', 'Haggaeus', 'Aggaeus', 'Hagg'),
  book('Sach', 'Sacharja', 'Sacharia', 'Sacharias', 'Zechariah', 'Zech',
    'Zec', 'Zacharias'),
  book('Mal', 'Maleachi', 'Malachi', 'Malachias', 'Ml'),

  // Evangelien, Geschichte
  book('Mt', 'Matthäus', 'Matthaeus', 'Matthew', 'Matt', 'Mat', 'Matth',
    'Matthäusevangelium', 'Evangelium nach Matthäus', 'Gospel of Matthew'),
  book('Mk', 'Markus', 'Mark', 'Marc', 'Mrk', 'Markusevangelium',
    'Evangelium nach Markus', 'Gospel of Mark'),
  book('Lk', 'Lukas', 'Luke', 'Luc', 'Luk', 'Lukasevangelium',
    'Evangelium nach Lukas', 'Gospel of Luke'),
  book('Joh', 'Johannes', 'John', 'Jn', 'Jhn', 'Johannesevangelium',
    'Johannes Evangelium', 'Evangelium nach Johannes', 'Gospel of John',
    'Johns Gospel'),
  book('Apg', 'Apostelgeschichte', 'Apostelgesch', 'Acts', 'Acts of the Apostles',
    'Act', 'Apostelgeschichte des Lukas'),

  // Paulusbriefe
  book('Röm', 'Römer', 'Roemer', 'Romer', 'Römerbrief', 'Brief an die Römer',
    'Romans', 'Rom', 'Römerbrief des Paulus'),
  numbered(1, 'Kor', ['Kor','Korinther','Korintherbrief','Cor',
    'Corinthians','Corinthian','Corinth'],
    '1 Brief an die Korinther', '1. Brief an die Korinther',
    'erster Brief an die Korinther', 'first epistle to the Corinthians'),
  numbered(2, 'Kor', ['Kor','Korinther','Korintherbrief','Cor',
    'Corinthians','Corinthian','Corinth'],
    '2 Brief an die Korinther', '2. Brief an die Korinther',
    'zweiter Brief an die Korinther', 'second epistle to the Corinthians'),
  book('Gal', 'Galater', 'Galaterbrief', 'Galatians', 'Galatian',
    'Brief an die Galater'),
  book('Eph', 'Epheser', 'Epheserbrief', 'Ephesians', 'Ephesian',
    'Brief an die Epheser'),
  book('Phil', 'Philipper', 'Philipperbrief', 'Philippians', 'Philippian',
    'Php', 'Philp', 'Brief an die Philipper'),
  book('Kol', 'Kolosser', 'Kolosserbrief', 'Colossians', 'Colossian',
    'Col', 'Brief an die Kolosser'),
  numbered(1, 'Thess', ['Thess','Thes','Thessalonicher','Thessalonicherbrief',
    'Thessalonians','Thessalonian'], '1 Brief an die Thessalonicher'),
  numbered(2, 'Thess', ['Thess','Thes','Thessalonicher','Thessalonicherbrief',
    'Thessalonians','Thessalonian'], '2 Brief an die Thessalonicher'),
  numbered(1, 'Tim', ['Tim','Timotheus','Timotheusbrief','Timothy','Timothee'],
    '1 Brief an Timotheus', 'first letter to Timothy'),
  numbered(2, 'Tim', ['Tim','Timotheus','Timotheusbrief','Timothy','Timothee'],
    '2 Brief an Timotheus', 'second letter to Timothy'),
  book('Tit', 'Titus', 'Titusbrief', 'Titusbrief des Paulus', 'Titus letter', 'Ti'),
  book('Phlm', 'Philemon', 'Philemonbrief', 'Phm', 'Philem', 'Brief an Philemon'),

  // Übrige Briefe und Offenbarung
  book('Hebr', 'Hebräer', 'Hebraeer', 'Hebraer', 'Hebräerbrief', 'Hebrews',
    'Heb', 'Hebräerbrief', 'Brief an die Hebräer'),
  book('Jak', 'Jakobus', 'Jakobusbrief', 'James', 'Jas', 'Jam',
    'Brief des Jakobus', 'Epistle of James'),
  numbered(1, 'Petr', ['Petr','Pet','Pt','Petrus','Petrusbrief','Peter'],
    '1 Brief des Petrus', '1. Brief des Petrus', 'first epistle of Peter'),
  numbered(2, 'Petr', ['Petr','Pet','Pt','Petrus','Petrusbrief','Peter'],
    '2 Brief des Petrus', '2. Brief des Petrus', 'second epistle of Peter'),
  numbered(1, 'Joh', ['Joh','Johannes','Johannesbrief','John','Jn','Jhn'],
    '1 Brief des Johannes', '1. Brief des Johannes', 'first epistle of John',
    'first letter of John'),
  numbered(2, 'Joh', ['Joh','Johannes','Johannesbrief','John','Jn','Jhn'],
    '2 Brief des Johannes', '2. Brief des Johannes', 'second epistle of John',
    'second letter of John'),
  numbered(3, 'Joh', ['Joh','Johannes','Johannesbrief','John','Jn','Jhn'],
    '3 Brief des Johannes', '3. Brief des Johannes', 'third epistle of John',
    'third letter of John'),
  book('Jud', 'Judas', 'Judasbrief', 'Brief des Judas', 'Jude', 'Jude epistle',
    'Epistle of Jude'),
  book('Offb', 'Offenbarung', 'Offenbarung des Johannes', 'Johannesoffenbarung',
    'Apokalypse', 'Apokalypse des Johannes', 'Revelation', 'Revelations',
    'Revelation of John', 'Rev', 'Apk', 'Off', 'Apocalypse'),

  // Weitere in verschiedenen Bibelkanones überlieferte Bücher / Anhänge
  numbered(1, 'Esr', ['Esdras'], '1 Esr', '1 Esra', '1. Buch Esra', 'first Esdras'),
  numbered(2, 'Esr', ['Esdras'], '2 Esr', '2 Esra', 'second Esdras'),
  numbered(3, 'Esr', ['Esdras'], '3 Esr', '3 Esra', 'third Esdras'),
  numbered(4, 'Esr', ['Esdras'], '4 Esr', '4 Esra', 'fourth Esdras'),
  numbered(3, 'Makk', ['Makk','Makkabäer','Maccabees','Macc'],
    '3 Buch der Makkabäer'),
  numbered(4, 'Makk', ['Makk','Makkabäer','Maccabees','Macc'],
    '4 Buch der Makkabäer'),
  book('GebMan', 'Gebet des Manasse', 'Gebet Manasses', 'Prayer of Manasseh',
    'Prayer of Manasses', 'Manassegebet'),
  book('BrJer', 'Brief des Jeremia', 'Brief Jeremias', 'Letter of Jeremiah',
    'Epistle of Jeremiah', 'Jeremiasbrief')
];

const BOOK_BY_ABBR = new Map(BOOKS.map(entry => [entry.abbr, entry]));
const SINGLE_CHAPTER_BOOKS = new Set(['Obd','Phlm','2 Joh','3 Joh','Jud','BrJer','GebMan']);

// Akzente, Groß-/Kleinschreibung, Leerzeichen, Bindestriche und Punkte
// werden ignoriert. Deutsche Umlaut-Transkription wird doppelt indexiert:
//   Kön = Koen = Kon; Römer = Roemer = Romer.
function normalizeName(value, mode = 'expanded') {
  let s = String(value).toLowerCase().trim();
  s = s.replace(/^(iv|iii|ii|i)\s*\.?\s+(?=[a-zäöü])/i,
    (_match, roman) => String({i:1,ii:2,iii:3,iv:4}[roman.toLowerCase()]) + ' ');
  s = s.replace(/\b(erste|erster|erstes|ersten|first)\b/g, '1')
    .replace(/\b(zweite|zweiter|zweites|zweiten|second)\b/g, '2')
    .replace(/\b(dritte|dritter|drittes|dritten|third)\b/g, '3')
    .replace(/\b(vierte|vierter|viertes|vierten|fourth)\b/g, '4')
    .replace(/\b([1-4])(?:st|nd|rd|th)\b/g, '$1')
    .replace(/ß/g, 'ss');
  if (mode === 'expanded') {
    s = s.replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue');
  }
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

const ALIAS_INDEX = new Map();
for (const entry of BOOKS) {
  for (const alias of entry.aliases) {
    for (const mode of ['expanded','simple']) {
      const key = normalizeName(alias, mode);
      if (!key) continue;
      if (!ALIAS_INDEX.has(key)) ALIAS_INDEX.set(key, new Set());
      ALIAS_INDEX.get(key).add(entry.abbr);
    }
  }
}

function leadingNumber(key) {
  return /^[1-4]/.test(key) ? key[0] : '';
}

// Damerau–Levenshtein: erlaubt auch vertauschte Nachbarbuchstaben.
function editDistance(a, b) {
  const d = Array.from({length: a.length + 1}, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) d[i][0] = i;
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] &&
          a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

function findBook(rawName) {
  const variants = [...new Set([
    normalizeName(rawName, 'expanded'),
    normalizeName(rawName, 'simple')
  ])].filter(Boolean);

  // 1. Exakte, fest eingetragene Schreibweisen – haben immer Vorrang.
  for (const key of variants) {
    const match = ALIAS_INDEX.get(key);
    if (match && match.size === 1) {
      return {abbr: [...match][0], fuzzy: false};
    }
    if (match && match.size > 1) return null; // keine willkürliche Auswahl
  }

  // 2. Erst danach Fuzzy-Matching; nummerierte Bücher bleiben getrennt.
  // Bei sehr kurzen Namen wird KEIN unsicherer Tippfehler geraten.
  const scores = new Map();
  for (const input of variants) {
    if (input.length < 4) continue;
    const maxErrors = input.length < 6 ? 1 : input.length < 10 ? 2 : 3;
    for (const [alias, books] of ALIAS_INDEX.entries()) {
      if (leadingNumber(alias) !== leadingNumber(input)) continue;
      if (Math.abs(input.length - alias.length) > maxErrors) continue;
      const distance = editDistance(input, alias);
      if (distance > maxErrors || distance / Math.max(input.length, alias.length) > 0.29) continue;
      for (const abbr of books) {
        const old = scores.get(abbr);
        if (old === undefined || distance < old) scores.set(abbr, distance);
      }
    }
  }
  if (scores.size === 0) return null;
  const minScore = Math.min(...scores.values());
  const winners = [...scores].filter(([_abbr, distance]) => distance === minScore);
  if (winners.length !== 1) return null; // Zweifelsfälle nicht erraten
  return {abbr: winners[0][0], fuzzy: true};
}

function parseReference(input) {
  let text = String(input).trim();
  if (!text) return {error: 'Bitte eine Bibelstelle eingeben.'};

  // Optional ausgeschriebene Kapitel-/Vers-Bezeichnungen tolerieren.
  text = text.replace(/\b(?:kapitel|chapter|chap\.?|kap\.?)\s*/gi, '')
    .replace(/\b(?:verse|vers|v\.)\s*/gi, '')
    .replace(/\s+/g, ' ');

  // Akzeptiert z. B. Joh 3,16, Joh3:16, Johannes 3 16, 1. Mose 1.1.
  // Der Trenner zwischen Kapitel und Vers muss vorhanden sein.
  const full = text.match(/^(.+?)(\d{1,3})\s*[,.:;\/\s-]\s*(\d{1,3})\s*$/u);
  let rawBook, chapter, verse;
  if (full) {
    rawBook = full[1].trim();
    chapter = Number(full[2]);
    verse = Number(full[3]);
  } else {
    // Ein-Kapitel-Bücher können auch als "Jud 4" eingegeben werden.
    const short = text.match(/^(.+?)\s+(\d{1,3})\s*$/u);
    if (!short) return {error: 'Format: Buch Kapitel,Vers – z. B. Joh 3,16.'};
    rawBook = short[1].trim();
    chapter = 1;
    verse = Number(short[2]);
    const shortBook = findBook(rawBook);
    if (!shortBook || !SINGLE_CHAPTER_BOOKS.has(shortBook.abbr)) {
      return {error: 'Format: Buch Kapitel,Vers – z. B. Joh 3,16.'};
    }
  }
  // Ein eingegebener Versbereich (Joh 3,16-18) darf nicht so zerlegt
  // werden, dass die ersten Zahlen unbemerkt Teil des Buchnamens werden.
  // Nur eine führende Buchnummer (1 Mose, 2 Joh usw.) ist erlaubt.
  const bookWithoutOrdinal = rawBook.replace(/^\s*[1-5]\s*(?:\.|st|nd|rd|th)?\s*/i, '');
  if (/\d/.test(bookWithoutOrdinal)) {
    return {error: 'Bitte nur einen einzelnen Vers eingeben.'};
  }
  if (!Number.isInteger(chapter) || chapter < 1 ||
      !Number.isInteger(verse) || verse < 1) {
    return {error: 'Kapitel und Vers müssen größer als 0 sein.'};
  }
  const result = findBook(rawBook);
  if (!result) return {error: 'Bibelbuch nicht eindeutig erkannt. Bitte anders schreiben.'};
  return {book: result.abbr, chapter, verse, fuzzy: result.fuzzy};
}

function formatReference(item) {
  return `${item.book} ${item.chapter},${item.verse}`;
}

// Die JSON-Datei enthält numerische book_id-Werte und 31.171 Einzelverse.
// Der Index wird nur einmal erstellt; alle Verse teilen sich eine Textquelle.
let bibleIndex = null;
let bibleBooks = null;
let bibleState = 'loading';
let bibleSequence = null;
let biblePositions = null;
let bibleAbbrById = null;

function getVerseText(bookAbbr, chapter, verse) {
  if (!bibleIndex || !bibleBooks) return bibleState === 'error'
    ? 'SLT 2000 konnte nicht geladen werden.' : 'Bibeltext wird geladen …';
  const id = bibleBooks.get(bookAbbr);
  if (id === undefined) return 'Dieser Vers ist in der SLT 2000 nicht enthalten.';
  return bibleIndex.get(`${id}:${chapter}:${verse}`) ??
    'Dieser Vers ist in der SLT 2000 nicht enthalten.';
}

function hasVerse(bookAbbr, chapter, verse) {
  const id = bibleBooks?.get(bookAbbr);
  return id !== undefined && bibleIndex?.has(`${id}:${chapter}:${verse}`) === true;
}

function readBibleData(payload) {
  const books = payload?.tables?.book?.rows;
  const rows = payload?.tables?.verse?.rows;
  if (!Array.isArray(books) || !Array.isArray(rows) || !books.length || !rows.length) {
    throw new Error('Die Datei besitzt keine gültigen book-/verse-Tabellen.');
  }

  const bookIds = new Map();
  const seenIds = new Set();
  for (const row of books) {
    if (!Number.isInteger(row?.id) || typeof row.name !== 'string' || seenIds.has(row.id)) {
      throw new Error('Ungültige Buch-IDs in der SLT-2000-Datei.');
    }
    const found = findBook(row.name);
    if (!found || found.fuzzy || bookIds.has(found.abbr)) {
      throw new Error(`Bibelbuch nicht eindeutig zuordenbar: ${row.name}`);
    }
    seenIds.add(row.id);
    bookIds.set(found.abbr, row.id);
  }

  const index = new Map();
  for (const row of rows) {
    if (!seenIds.has(row?.book_id) || !Number.isInteger(row.chapter) || row.chapter < 1 ||
        !Number.isInteger(row.verse) || row.verse < 1 || typeof row.text !== 'string') {
      throw new Error('Ungültige Versdaten in der SLT-2000-Datei.');
    }
    const key = `${row.book_id}:${row.chapter}:${row.verse}`;
    if (index.has(key)) throw new Error(`Vers doppelt vorhanden: ${key}`);
    index.set(key, row.text);
  }
  // Kanonische Reihenfolge für mehrere Kontextverse; funktioniert
  // auch an Kapitel- und Buchgrenzen und bei unsortierten JSON-Zeilen.
  const sequence = rows.map(row => ({id: row.book_id, chapter: row.chapter, verse: row.verse}));
  sequence.sort((a, b) => a.id - b.id || a.chapter - b.chapter || a.verse - b.verse);
  const positions = new Map();
  sequence.forEach((current, i) => {
    positions.set(`${current.id}:${current.chapter}:${current.verse}`, i);
  });
  const abbrById = new Map([...bookIds].map(([abbr, id]) => [id, abbr]));
  return {bookIds, index, sequence, positions, abbrById};
}

function setBibleData(payload) {
  const parsed = readBibleData(payload);
  bibleBooks = parsed.bookIds;
  bibleIndex = parsed.index;
  bibleSequence = parsed.sequence;
  biblePositions = parsed.positions;
  bibleAbbrById = parsed.abbrById;
  bibleState = 'ready';
  document.getElementById('data-status').hidden = true;
  document.getElementById('data-recovery').hidden = true;
  document.getElementById('data-status').classList.remove('error');
  document.getElementById('search-enter').disabled = false;
  renderRoute();
}

function showBibleLoadError(reason) {
  bibleState = 'error';
  const status = document.getElementById('data-status');
  status.hidden = false;
  status.classList.add('error');
  status.textContent = `slt2000.json nicht geladen (${reason}). Datei neben index.html ablegen und über einen Webserver öffnen – oder unten manuell auswählen.`;
  document.getElementById('data-recovery').hidden = false;
  document.getElementById('search-enter').disabled = true;
  renderRoute();
}

async function loadBibleFile() {
  try {
    const response = await fetch(BIBLE_FILE);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setBibleData(await response.json());
  } catch (error) {
    showBibleLoadError(error instanceof Error ? error.message : 'Lesefehler');
  }
}

const listView = document.getElementById('list-view');
const detailView = document.getElementById('detail-view');
const listElement = document.getElementById('verse-list');
const emptyState = document.getElementById('empty-state');
const countElement = document.getElementById('verse-count');
const inputElement = document.getElementById('verse-search');
const messageElement = document.getElementById('message');
const detailReference = document.getElementById('detail-reference');
const detailText = document.getElementById('detail-text');
const searchButton = document.getElementById('search-enter');
const settingsDialog = document.getElementById('settings-dialog');
const darkModeToggle = document.getElementById('setting-dark-mode');
const versesBeforeInput = document.getElementById('setting-verses-before');
const versesAfterInput = document.getElementById('setting-verses-after');
const detailPrevious = document.getElementById('detail-previous');
const detailNext = document.getElementById('detail-next');
const detailMedia = document.getElementById('detail-media');
const detailPlayback = document.getElementById('detail-playback');
const detailImageWrap = document.getElementById('detail-image-wrap');

/*
 * Lokale Medien: Der Dateiname entspricht exakt der sichtbaren Loccumer-Stelle,
 * z. B. "./media/1 Kor 5,5.mp3". Es gibt keine Verzeichnis-API im Browser;
 * deshalb prüfen wir die bekannten Endungen auf Existenz. Die Reihenfolge
 * ist die feste Priorität, wenn mehrere Dateien desselben Typs existieren.
 * Audio hat Vorrang vor Video; ein Bild kann zusätzlich gezeigt werden.
 * Der Browser bestimmt, welche Codecs er tatsächlich wiedergeben kann.
 */
const MEDIA_DIRECTORY = './media/';
const AUDIO_EXTENSIONS = [
  'mp3', 'm4a', 'aac', 'wav', 'wave', 'ogg', 'oga', 'opus', 'flac',
  'weba', 'aif', 'aiff', 'caf', 'wma', 'mid', 'midi'
];
const VIDEO_EXTENSIONS = [
  'mp4', 'webm', 'ogv', 'm4v', 'mov', 'mkv', 'avi', 'mpeg', 'mpg', '3gp'
];
const IMAGE_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg', 'apng', 'bmp',
  'heic', 'heif', 'tif', 'tiff', 'ico', 'jxl'
];
let mediaRenderId = 0;

function mediaFileUrl(reference, extension) {
  return `${MEDIA_DIRECTORY}${encodeURIComponent(reference)}.${extension}`;
}

// Lokale file://-Seiten dürfen fetch() je nach Browser nicht verwenden.
// Dort versuchen wir, die Dateien direkt mit den passenden Medien-Elementen
// zu laden; über HTTP(S) genügt für die Existenzprüfung ein HEAD-Request.
function probeLocalMedia(url, type) {
  return new Promise(resolve => {
    const element = type === 'image' ? new Image() : document.createElement(type);
    const success = type === 'image' ? 'load' : 'loadedmetadata';
    let finished = false;
    const finish = available => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      element.removeEventListener(success, onSuccess);
      element.removeEventListener('error', onError);
      if (type !== 'image') {
        element.removeAttribute('src');
        element.load();
      }
      resolve(available);
    };
    const onSuccess = () => finish(true);
    const onError = () => finish(false);
    const timeout = setTimeout(() => finish(false), 4500);
    element.addEventListener(success, onSuccess);
    element.addEventListener('error', onError);
    if (type !== 'image') element.preload = 'metadata';
    element.src = url;
    if (type !== 'image') element.load();
  });
}

async function mediaExists(url, type) {
  if (location.protocol === 'file:') return probeLocalMedia(url, type);
  try {
    let response = await fetch(url, {method: 'HEAD'});
    if (response.status === 405 || response.status === 501) {
      // Hosts ohne HEAD-Unterstützung: Inhalt mit kleinem Range-GET prüfen.
      response = await fetch(url, {
        method: 'GET', headers: {Range: 'bytes=0-0'}
      });
      // Bei Hosts ohne Range-Unterstützung keine ganze Mediendatei laden.
      if (response.body) await response.body.cancel();
    }
    if (!response.ok) return false;
    // Manche SPA-Hosts beantworten unbekannte Pfade mit index.html (HTTP 200).
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('text/html')) return false;
    return true;
  } catch (_error) {
    return false;
  }
}

async function existingMediaFiles(reference, extensions, type) {
  // Parallel prüfen, aber die ursprüngliche Endungs-Priorität beibehalten.
  const matches = await Promise.all(extensions.map(async extension => {
    const url = mediaFileUrl(reference, extension);
    return await mediaExists(url, type) ? {url, type, extension} : null;
  }));
  return matches.filter(Boolean);
}

function updateDetailMediaVisibility() {
  detailMedia.hidden = detailPlayback.hidden && detailImageWrap.hidden;
}

// canPlayType prüft die Fähigkeiten des jeweiligen Browsers (wichtig auf iOS,
// das OGG je nach Codec/Browserversion nicht wiedergeben kann). Die Prüfung
// ist nur ein Hinweis: Ein echter Playback-Fehler wird zusätzlich abgefangen.
const MEDIA_MIME = {
  mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac',
  wav: 'audio/wav', wave: 'audio/wav', ogg: 'audio/ogg',
  oga: 'audio/ogg', opus: 'audio/ogg; codecs="opus"',
  flac: 'audio/flac', weba: 'audio/webm', aif: 'audio/aiff',
  aiff: 'audio/aiff', caf: 'audio/x-caf', wma: 'audio/x-ms-wma',
  mid: 'audio/midi', midi: 'audio/midi',
  mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg',
  m4v: 'video/mp4', mov: 'video/quicktime', mkv: 'video/x-matroska',
  avi: 'video/x-msvideo', mpeg: 'video/mpeg', mpg: 'video/mpeg',
  '3gp': 'video/3gpp'
};

function browserCanPlay(candidate) {
  const mediaElement = document.createElement(candidate.type);
  const mime = MEDIA_MIME[candidate.extension];
  // Unbekannte Formate nicht vorab ausschließen: die echte Wiedergabe prüft der Player.
  return !mime || mediaElement.canPlayType(mime) !== '';
}

function showMediaWarning(candidate, reference) {
  detailPlayback.replaceChildren();
  if (!candidate) {
    detailPlayback.hidden = true;
    updateDetailMediaVisibility();
    return;
  }
  const warning = document.createElement('p');
  warning.className = 'media-warning';
  warning.append(document.createTextNode(
    `Die ${candidate.type === 'audio' ? 'Audio-' : 'Video-'}Datei (.${candidate.extension}) kann auf diesem Gerät nicht abgespielt werden. `
  ));
  const link = document.createElement('a');
  link.href = candidate.url;
  link.textContent = 'Datei öffnen';
  link.setAttribute('aria-label', `Mediendatei zu ${reference} öffnen`);
  warning.append(link);
  detailPlayback.append(warning);
  detailPlayback.hidden = false;
  updateDetailMediaVisibility();
}

function showMediaPlayer(candidates, reference, requestId) {
  if (requestId !== mediaRenderId) return;
  if (!candidates.length) {
    showMediaWarning(null, reference);
    return;
  }
  const playable = candidates.filter(browserCanPlay);
  // Nur nicht abspielbare Formate gefunden: Die Medien-Datei nicht still
  // verschwinden lassen, sondern kurz auf das Problem hinweisen.
  if (!playable.length) {
    showMediaWarning(candidates[0], reference);
    return;
  }
  let nextIndex = 0;
  const tryNext = () => {
    if (requestId !== mediaRenderId) return;
    if (nextIndex >= playable.length) {
      showMediaWarning(playable[0], reference);
      return;
    }
    const next = playable[nextIndex++];
    const player = document.createElement(next.type);
    player.controls = true;
    player.preload = 'metadata';
    player.setAttribute('aria-label',
      `${next.type === 'audio' ? 'Audio' : 'Video'} zu ${reference}`);
    if (next.type === 'video') player.playsInline = true;
    player.addEventListener('error', () => {
      // Fehler kann erst beim Drücken auf Play auftreten, vor allem in Safari.
      if (requestId === mediaRenderId && detailPlayback.contains(player)) tryNext();
    }, {once: true});
    detailPlayback.replaceChildren(player);
    detailPlayback.hidden = false;
    updateDetailMediaVisibility();
    player.src = next.url;
  };
  tryNext();
}

function showMediaImage(candidates, reference, requestId) {
  if (requestId !== mediaRenderId) return;
  const next = candidates.shift();
  if (!next) {
    detailImageWrap.replaceChildren();
    detailImageWrap.hidden = true;
    updateDetailMediaVisibility();
    return;
  }
  const image = document.createElement('img');
  image.alt = `Bild zu ${reference}`;
  image.decoding = 'async';
  image.addEventListener('load', () => {
    if (requestId !== mediaRenderId) return;
    detailImageWrap.replaceChildren(image);
    detailImageWrap.hidden = false;
    updateDetailMediaVisibility();
  }, {once: true});
  image.addEventListener('error', () => {
    if (requestId === mediaRenderId) showMediaImage(candidates, reference, requestId);
  }, {once: true});
  image.src = next.url;
}

function renderDetailMedia(reference) {
  const requestId = ++mediaRenderId;
  detailMedia.hidden = true;
  detailPlayback.hidden = true;
  detailImageWrap.hidden = true;
  detailPlayback.replaceChildren();
  detailImageWrap.replaceChildren();

  // Medien nur für einen geöffneten Listeneintrag suchen, niemals für
  // sämtliche Bibelstellen oder für die Hauptliste.
  Promise.all([
    existingMediaFiles(reference, AUDIO_EXTENSIONS, 'audio'),
    existingMediaFiles(reference, VIDEO_EXTENSIONS, 'video'),
    existingMediaFiles(reference, IMAGE_EXTENSIONS, 'image')
  ]).then(([audioFiles, videoFiles, imageFiles]) => {
    if (requestId !== mediaRenderId) return; // Nutzer hat Vers gewechselt
    showMediaPlayer([...audioFiles, ...videoFiles], reference, requestId);
    showMediaImage(imageFiles, reference, requestId);
  }).catch(() => { /* Fehlende / unzugängliche Medien bleiben unsichtbar. */ });
}

// 0 unterdrückt den jeweiligen Kontext. Ältere Einstellungen mit deaktiviertem
// Nachbarvers-Schalter werden auf 0/0 migriert (statt unerwartet 5/5 zu zeigen).
function parseVerseCount(value, fallback) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? Math.min(n, 9999) : fallback;
}

function loadSettings() {
  const defaults = {
    darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
    versesBefore: 5,
    versesAfter: 5
  };
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return defaults;
    const oldCount = stored.showAdjacentVerses === false ? 0 : 5;
    return {
      darkMode: typeof stored.darkMode === 'boolean' ? stored.darkMode : defaults.darkMode,
      versesBefore: parseVerseCount(stored.versesBefore, oldCount),
      versesAfter: parseVerseCount(stored.versesAfter, oldCount)
    };
  } catch (_error) { return defaults; }
}

const settings = loadSettings();
function applySettings() {
  document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',
    settings.darkMode ? '#181b20' : '#ffffff');
  darkModeToggle.checked = settings.darkMode;
  versesBeforeInput.value = settings.versesBefore;
  versesAfterInput.value = settings.versesAfter;
}
function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
  catch (_error) { showMessage('Einstellungen konnten nicht gespeichert werden.', true); }
}
applySettings();

for (const trigger of document.querySelectorAll('.settings-trigger')) {
  trigger.addEventListener('click', () => settingsDialog.showModal());
}
document.getElementById('settings-close').addEventListener('click', () => settingsDialog.close());
settingsDialog.addEventListener('click', event => {
  if (event.target === settingsDialog) settingsDialog.close();
});
darkModeToggle.addEventListener('change', () => {
  settings.darkMode = darkModeToggle.checked;
  applySettings();
  saveSettings();
});
function updateVerseCountSetting(field, input) {
  // Leere oder ungültige Eingabe erst beim Verlassen des Felds korrigieren.
  if (input.value.trim() === '') return;
  const value = parseVerseCount(input.value, null);
  if (value === null) return;
  settings[field] = value;
  saveSettings();
  if (!detailView.hidden) renderAdjacentVerses();
}
for (const [field, input] of [
  ['versesBefore', versesBeforeInput], ['versesAfter', versesAfterInput]
]) {
  input.addEventListener('input', () => updateVerseCountSetting(field, input));
  input.addEventListener('change', () => {
    settings[field] = parseVerseCount(input.value, settings[field]);
    input.value = settings[field];
    saveSettings();
    if (!detailView.hidden) renderAdjacentVerses();
  });
}

function loadList() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(data)) return [];
    return data.filter(item => item && typeof item.id === 'string' &&
        BOOK_BY_ABBR.has(item.book) && Number.isInteger(item.chapter) &&
        item.chapter > 0 && Number.isInteger(item.verse) && item.verse > 0)
      .map(item => ({id: item.id, book: item.book, chapter: item.chapter,
        verse: item.verse, open: item.open === true}));
  } catch (_error) {
    return [];
  }
}

let verses = loadList();

function saveList() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verses));
  } catch (_error) {
    showMessage('Lokale Speicherung ist in diesem Browser nicht verfügbar.', true);
  }
}

function showMessage(text, error = false) {
  messageElement.textContent = text;
  messageElement.classList.toggle('error', error);
  messageElement.hidden = !text;
  inputElement.setAttribute('aria-invalid', error ? 'true' : 'false');
}

function actionButton(label, title, action, disabled = false, className = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.title = title;
  button.setAttribute('aria-label', title);
  button.className = className;
  button.disabled = disabled;
  button.addEventListener('click', action);
  return button;
}

function detailUrl(item) {
  return `#vers/${encodeURIComponent(item.id)}`;
}

// Verschieben mit Pointer Events statt HTML5-Drag-and-drop (funktioniert auch
// auf iOS/Android). Nur der Griff startet das Ziehen; Links bleiben klickbar.
const reorderStatus = document.getElementById('reorder-status');
let draggedVerse = null;

function makeDragHandle(li, item, ref) {
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'drag-handle';
  handle.title = `${ref} ziehen, um den Vers zu verschieben`;
  handle.setAttribute('aria-label', `${ref} verschieben`);
  handle.setAttribute('aria-keyshortcuts', 'Space ArrowUp ArrowDown Enter Escape');
  handle.setAttribute('aria-describedby', 'reorder-instructions reorder-status');
  handle.innerHTML = '<svg viewBox="0 0 18 24" aria-hidden="true" focusable="false"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="6" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="6" cy="19" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';
  handle.addEventListener('pointerdown', event => startPointerDrag(event, li, item.id));
  handle.addEventListener('keydown', event => onDragKeydown(event, li, item.id, ref));
  return handle;
}

function commitDomOrder() {
  const byId = new Map(verses.map(verse => [verse.id, verse]));
  verses = Array.from(listElement.children, li => byId.get(li.dataset.verseId))
    .filter(Boolean);
  saveList();
}

function restoreHandleFocus(id) {
  const li = Array.from(listElement.children)
    .find(element => element.dataset.verseId === id);
  li?.querySelector('.drag-handle')?.focus({preventScroll: true});
}

function stopPointerListeners() {
  window.removeEventListener('pointermove', onPointerDragMove);
  window.removeEventListener('pointerup', onPointerDragEnd);
  window.removeEventListener('pointercancel', onPointerDragCancel);
  window.removeEventListener('blur', onPointerDragCancel);
}

function cleanUpDrag() {
  const state = draggedVerse;
  if (!state) return;
  stopPointerListeners();
  if (state.scrollFrame != null) cancelAnimationFrame(state.scrollFrame);
  state.ghost?.remove();
  state.element.classList.remove('drag-placeholder', 'keyboard-dragging');
  document.body.classList.remove('dragging-verse');
  draggedVerse = null;
}

function announceReorder(text) {
  reorderStatus.textContent = text;
}

function startPointerDrag(event, element, id) {
  // Rechtsklick und zusätzliche Finger ignorieren.
  if (draggedVerse || event.button !== 0 || event.isPrimary === false) return;
  const rect = element.getBoundingClientRect();
  draggedVerse = {
    mode: 'pointer', pointerId: event.pointerId, element, id,
    startX: event.clientX, startY: event.clientY,
    pointerX: event.clientX, pointerY: event.clientY,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    rect, started: false, ghost: null, scrollFrame: null
  };
  window.addEventListener('pointermove', onPointerDragMove, {passive: false});
  window.addEventListener('pointerup', onPointerDragEnd);
  window.addEventListener('pointercancel', onPointerDragCancel);
  window.addEventListener('blur', onPointerDragCancel);
}

function liftPointerVerse(state) {
  const ghost = state.element.cloneNode(true);
  ghost.classList.remove('drag-placeholder');
  ghost.classList.add('verse-drag-ghost');
  ghost.removeAttribute('data-verse-id');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.querySelectorAll('a, button').forEach(node => { node.tabIndex = -1; });
  ghost.style.width = `${Math.min(state.rect.width, window.innerWidth - 16)}px`;
  document.body.append(ghost);
  state.ghost = ghost;
  state.started = true;
  state.element.classList.add('drag-placeholder');
  document.body.classList.add('dragging-verse');
  positionDragGhost(state);
}

function positionDragGhost(state) {
  if (!state.ghost) return;
  const width = state.ghost.getBoundingClientRect().width;
  const left = Math.max(8, Math.min(window.innerWidth - width - 8,
    state.pointerX - state.offsetX));
  const top = state.pointerY - state.offsetY;
  state.ghost.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(-2deg) scale(1.045)`;
}

function insertAtPointer(pointerY) {
  const state = draggedVerse;
  if (!state || state.mode !== 'pointer' || !state.started) return;
  const siblings = Array.from(listElement.children)
    .filter(li => li !== state.element);
  for (const sibling of siblings) {
    const rect = sibling.getBoundingClientRect();
    if (pointerY < rect.top + rect.height / 2) {
      if (state.element.nextElementSibling !== sibling) {
        listElement.insertBefore(state.element, sibling);
      }
      return;
    }
  }
  if (listElement.lastElementChild !== state.element) listElement.append(state.element);
}

function autoScrollDrag() {
  const state = draggedVerse;
  if (!state || state.mode !== 'pointer' || !state.started) return;
  state.scrollFrame = null;
  const edge = Math.min(85, Math.max(48, window.innerHeight * .13));
  const y = state.pointerY;
  let speed = 0;
  if (y < edge) speed = -Math.min(21, 4 + ((edge - y) / edge) * 17);
  if (y > window.innerHeight - edge) {
    speed = Math.min(21, 4 + ((y - (window.innerHeight - edge)) / edge) * 17);
  }
  if (speed !== 0) {
    window.scrollBy(0, speed);
    insertAtPointer(y);
    state.scrollFrame = requestAnimationFrame(autoScrollDrag);
  }
}

function onPointerDragMove(event) {
  const state = draggedVerse;
  if (!state || state.mode !== 'pointer' || event.pointerId !== state.pointerId) return;
  state.pointerX = event.clientX;
  state.pointerY = event.clientY;
  if (!state.started) {
    if (Math.hypot(event.clientX - state.startX, event.clientY - state.startY) < 5) return;
    liftPointerVerse(state);
  }
  event.preventDefault();
  positionDragGhost(state);
  insertAtPointer(state.pointerY);
  if (state.scrollFrame == null) {
    state.scrollFrame = requestAnimationFrame(autoScrollDrag);
  }
}

function onPointerDragEnd(event) {
  const state = draggedVerse;
  if (!state || state.mode !== 'pointer' || event.pointerId !== state.pointerId) return;
  const moved = state.started;
  if (moved) commitDomOrder();
  cleanUpDrag();
  if (moved) {
    renderList();
    announceReorder('Vers verschoben. Neue Reihenfolge gespeichert.');
  }
}

function onPointerDragCancel() {
  if (!draggedVerse || draggedVerse.mode !== 'pointer') return;
  const wasDragging = draggedVerse.started;
  cleanUpDrag();
  if (wasDragging) renderList(); // nicht gespeicherte Position zurücksetzen
}

function finishKeyboardDrag(save) {
  const state = draggedVerse;
  if (!state || state.mode !== 'keyboard') return;
  if (save) commitDomOrder();
  const id = state.id;
  cleanUpDrag();
  renderList();
  restoreHandleFocus(id);
  announceReorder(save ? 'Neue Reihenfolge gespeichert.' : 'Verschieben abgebrochen.');
}

function onDragKeydown(event, element, id, ref) {
  const toggle = event.code === 'Space' || event.key === ' ' || event.key === 'Enter';
  if (toggle) {
    event.preventDefault();
    if (draggedVerse?.mode === 'keyboard' && draggedVerse.id === id) {
      finishKeyboardDrag(true);
    } else if (!draggedVerse) {
      draggedVerse = {mode: 'keyboard', element, id};
      element.classList.add('keyboard-dragging');
      announceReorder(`${ref} aufgenommen. Mit Pfeil hoch und runter verschieben, mit Enter ablegen, mit Escape abbrechen.`);
    }
    return;
  }
  if (!draggedVerse || draggedVerse.mode !== 'keyboard' || draggedVerse.id !== id) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    finishKeyboardDrag(false);
    return;
  }
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
  event.preventDefault();
  if (event.key === 'ArrowUp' && element.previousElementSibling) {
    listElement.insertBefore(element, element.previousElementSibling);
  } else if (event.key === 'ArrowDown' && element.nextElementSibling) {
    listElement.insertBefore(element.nextElementSibling, element);
  }
  element.querySelector('.drag-handle')?.focus({preventScroll: true});
  element.scrollIntoView({block: 'nearest'});
  const position = Array.from(listElement.children).indexOf(element) + 1;
  announceReorder(`${ref}: Position ${position} von ${verses.length}.`);
}

document.addEventListener('keydown', event => {
  if (draggedVerse?.mode === 'keyboard' && event.key === 'Escape') {
    event.preventDefault();
    finishKeyboardDrag(false);
  }
});

function renderList() {
  if (draggedVerse) cleanUpDrag();
  countElement.textContent = `${verses.length} ${verses.length === 1 ? 'Vers' : 'Verse'}`;
  emptyState.hidden = verses.length > 0;
  document.getElementById('collapse-all').disabled = verses.length === 0;
  document.getElementById('expand-all').disabled = verses.length === 0;
  document.getElementById('clear-all').disabled = verses.length === 0;

  // Ein DOM-Fragment hält auch bei langen Listen die Neuzeichnung sparsam.
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < verses.length; index++) {
    const item = verses[index];
    const ref = formatReference(item);
    const li = document.createElement('li');
    li.className = 'verse-item';
    li.dataset.verseId = item.id;

    const row = document.createElement('div');
    row.className = 'verse-row';
    const link = document.createElement('a');
    link.className = 'verse-reference';
    link.href = detailUrl(item);
    link.textContent = ref;
    link.setAttribute('aria-label', `${ref} einzeln anzeigen`);
    row.append(link);

    const actions = document.createElement('div');
    actions.className = 'row-actions';
    actions.append(
      actionButton(item.open ? '▾' : '▸',
        `${ref} ${item.open ? 'einklappen' : 'ausklappen'}`, () => {
          item.open = !item.open;
          saveList();
          renderList();
        }, false, 'toggle'),
      makeDragHandle(li, item, ref),
      actionButton('×', `${ref} löschen`, () => {
        verses.splice(index, 1);
        saveList();
        renderList();
      }, false, 'delete')
    );
    row.append(actions);
    li.append(row);

    if (item.open) {
      const textLink = document.createElement('a');
      textLink.className = 'verse-text';
      textLink.href = detailUrl(item);
      textLink.textContent = getVerseText(item.book, item.chapter, item.verse);
      textLink.setAttribute('aria-label', `${ref} einzeln anzeigen`);
      li.append(textLink);
    }
    fragment.append(li);
  }
  listElement.replaceChildren(fragment);
}

function renderAdjacentVerses() {
  const match = location.hash.match(/^#vers\/(.+)$/);
  let id = '';
  if (match) {
    try { id = decodeURIComponent(match[1]); } catch (_error) { /* ungültiger Link */ }
  }
  const item = verses.find(entry => entry.id === id);
  const bookId = item && bibleBooks?.get(item.book);
  const position = bookId !== undefined && biblePositions
    ? biblePositions.get(`${bookId}:${item.chapter}:${item.verse}`) : undefined;

  const contexts = [
    [detailPrevious, settings.versesBefore, 'before'],
    [detailNext, settings.versesAfter, 'after']
  ];
  for (const [element, count, direction] of contexts) {
    if (position === undefined || count === 0 || !bibleSequence) {
      element.hidden = true;
      element.querySelector('.adjacent-text').textContent = '';
      continue;
    }
    const start = direction === 'before'
      ? Math.max(0, position - count) : position + 1;
    const end = direction === 'before'
      ? position : Math.min(bibleSequence.length, position + 1 + count);
    const text = bibleSequence.slice(start, end).map(row =>
      bibleIndex.get(`${row.id}:${row.chapter}:${row.verse}`)?.replace(/\s+/g, ' ').trim()
    ).filter(Boolean).join(' ');
    element.querySelector('.adjacent-text').textContent = text;
    element.hidden = !text;
  }
}

function renderRoute() {
  const match = location.hash.match(/^#vers\/(.+)$/);
  if (match) {
    let id;
    try { id = decodeURIComponent(match[1]); }
    catch (_error) { id = ''; }
    const item = verses.find(entry => entry.id === id);
    if (item) {
      listView.hidden = true;
      detailView.hidden = false;
      detailReference.textContent = formatReference(item);
      detailText.textContent = getVerseText(item.book, item.chapter, item.verse);
      renderAdjacentVerses();
      renderDetailMedia(formatReference(item));
      document.title = `${formatReference(item)} – Verse2Brain`;
      window.scrollTo(0, 0);
      return;
    }
  }
  ++mediaRenderId; // Ausstehende Medien-Prüfungen der Einzelansicht verwerfen.
  detailPlayback.replaceChildren(); // Eventuelle laufende Wiedergabe stoppen.
  detailImageWrap.replaceChildren();
  detailMedia.hidden = true;
  detailPlayback.hidden = true;
  detailImageWrap.hidden = true;
  listView.hidden = false;
  detailView.hidden = true;
  document.title = 'Verse2Brain';
  renderList();
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

document.getElementById('search-form').addEventListener('submit', event => {
  event.preventDefault();
  if (bibleState !== 'ready') {
    showMessage('Bibeltext ist noch nicht geladen.', true);
    return;
  }
  const result = parseReference(inputElement.value);
  if (result.error) {
    showMessage(result.error, true);
    inputElement.focus();
    return;
  }

  if (!hasVerse(result.book, result.chapter, result.verse)) {
    showMessage(`${formatReference(result)} ist in der SLT 2000 nicht enthalten.`, true);
    inputElement.focus();
    return;
  }

  verses.unshift({id: newId(), book: result.book, chapter: result.chapter,
    verse: result.verse, open: false});
  saveList();
  inputElement.value = '';
  const reference = formatReference(verses[0]);
  showMessage(result.fuzzy ? `Ähnliche Schreibweise erkannt: ${reference}` : '');
  if (location.hash.startsWith('#vers/')) location.hash = '#liste';
  renderList();
  inputElement.focus();
});

inputElement.addEventListener('input', () => {
  if (!messageElement.hidden) showMessage('');
});

document.getElementById('collapse-all').addEventListener('click', () => {
  verses.forEach(item => { item.open = false; });
  saveList(); renderList();
});

document.getElementById('expand-all').addEventListener('click', () => {
  verses.forEach(item => { item.open = true; });
  saveList(); renderList();
});

document.getElementById('clear-all').addEventListener('click', () => {
  if (!verses.length) return;
  if (!window.confirm(`Alle ${verses.length} Bibelstellen wirklich löschen?`)) return;
  verses = [];
  saveList(); renderList(); showMessage('');
});

document.getElementById('choose-json').addEventListener('click', () => {
  document.getElementById('json-file').click();
});

document.getElementById('json-file').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    setBibleData(JSON.parse(await file.text()));
    showMessage('SLT 2000 geladen.');
  } catch (error) {
    showBibleLoadError(error instanceof Error ? error.message : 'Ungültige JSON-Datei');
  } finally {
    event.target.value = '';
  }
});

window.addEventListener('hashchange', renderRoute);
searchButton.disabled = true;
renderRoute();
loadBibleFile();
