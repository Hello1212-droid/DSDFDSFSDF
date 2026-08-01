/**
 * Data for Indian language input: phonetic (Hinglish) → Indic script transliteration
 * and on-screen keyboard character grids for every major Indian script.
 *
 * Design: a single phonetic scheme maps Latin key sequences to glyph positions.
 * Each script provides glyph arrays in the SAME order, so one transliteration
 * algorithm works for all of them.
 */

export interface IndicScript {
  id: string;
  name: string; // English name
  native: string; // autonym in its own script
  languages: string[];
  /** 12 independent vowels, indices: a aa i ii u uu Ri Rii e ai o au */
  vowels: string[];
  /** 37 consonants, standard varnamala order (see CONSONANT_KEYS) */
  consonants: string[];
  /** 12 dependent matras, index 0 = inherent 'a' (empty) */
  matras: string[];
  halant: string;
  anusvara: string;
  visarga: string;
  candrabindu: string;
  numerals: string[];
}

/** Latin keys mapping to vowel indices. */
export const VOWEL_KEYS = ["a", "aa", "i", "ii", "u", "uu", "Ri", "Rii", "e", "ai", "o", "au"];

/** Latin keys mapping to consonant indices (37). */
export const CONSONANT_KEYS = [
  "k", "kh", "g", "gh", "N", "ch", "chh", "j", "jh", "~n",
  "T", "Th", "D", "Dh", "RN", "t", "th", "d", "dh", "n",
  "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "sh",
  "Sh", "s", "h", "L", "x", "tr", "gy",
];

const D = {
  id: "hi", name: "Hindi", native: "हिन्दी", languages: ["Hindi", "Marathi", "Nepali", "Sanskrit"],
  vowels: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ए", "ऐ", "ओ", "औ"],
  consonants: ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "ळ", "क्ष", "त्र", "ज्ञ"],
  matras: ["", "ा", "ि", "ी", "ु", "ू", "ृ", "ृ", "े", "ै", "ो", "ौ"],
  halant: "्", anusvara: "ं", visarga: "ः", candrabindu: "ँ",
  numerals: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
};

const B = {
  id: "bn", name: "Bengali", native: "বাংলা", languages: ["Bengali", "Assamese"],
  vowels: ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "ৠ", "এ", "ঐ", "ও", "ঔ"],
  consonants: ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "ব", "শ", "ষ", "স", "হ", "ল", "ক্ষ", "ত্র", "জ্ঞ"],
  matras: ["", "া", "ি", "ী", "ু", "ূ", "ৃ", "ৃ", "ে", "ৈ", "ো", "ৌ"],
  halant: "্", anusvara: "ং", visarga: "ঃ", candrabindu: "ঁ",
  numerals: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
};

const G = {
  id: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", languages: ["Punjabi"],
  vowels: ["ਅ", "ਆ", "ਇ", "ਈ", "ਉ", "ਊ", "੍ਰ", "੍ਰ", "ਏ", "ਐ", "ਓ", "ਔ"],
  consonants: ["ਕ", "ਖ", "ਗ", "ਘ", "ਙ", "ਚ", "ਛ", "ਜ", "ਝ", "ਞ", "ਟ", "ਠ", "ਡ", "ਢ", "ਣ", "ਤ", "ਥ", "ਦ", "ਧ", "ਨ", "ਪ", "ਫ", "ਬ", "ਭ", "ਮ", "ਯ", "ਰ", "ਲ", "ਵ", "ਸ਼", "ਸ਼", "ਸ", "ਹ", "ਲ਼", "ਕ੍ਸ਼", "ਤ੍ਰ", "ਗ੍ਯ"],
  matras: ["", "ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "੍ਰ", "੍ਰ", "ੇ", "ੈ", "ੋ", "ੌ"],
  halant: "੍", anusvara: "ਂ", visarga: "ਃ", candrabindu: "ਂ",
  numerals: ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"],
};

const GU = {
  id: "gu", name: "Gujarati", native: "ગુજરાતી", languages: ["Gujarati"],
  vowels: ["અ", "આ", "ઇ", "ઈ", "ઉ", "ઊ", "ઋ", "ૠ", "એ", "ઐ", "ઓ", "ઔ"],
  consonants: ["ક", "ખ", "ગ", "ઘ", "ઙ", "ચ", "છ", "જ", "ઝ", "ઞ", "ટ", "ઠ", "ડ", "ઢ", "ણ", "ત", "થ", "દ", "ધ", "ન", "પ", "ફ", "બ", "ભ", "મ", "ય", "ર", "લ", "વ", "શ", "ષ", "સ", "હ", "ળ", "ક્ષ", "ત્ર", "જ્ઞ"],
  matras: ["", "ા", "િ", "ી", "ુ", "ૂ", "ૃ", "ૄ", "ે", "ૈ", "ો", "ૌ"],
  halant: "્", anusvara: "ં", visarga: "ઃ", candrabindu: "ઁ",
  numerals: ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"],
};

const OR = {
  id: "or", name: "Odia", native: "ଓଡ଼ିଆ", languages: ["Odia"],
  vowels: ["ଅ", "ଆ", "ଇ", "ଈ", "ଉ", "ଊ", "ଋ", "ୠ", "ଏ", "ଐ", "ଓ", "ଔ"],
  consonants: ["କ", "ଖ", "ଗ", "ଘ", "ଙ", "ଚ", "ଛ", "ଜ", "ଝ", "ଞ", "ଟ", "ଠ", "ଡ", "ଢ", "ଣ", "ତ", "ଥ", "ଦ", "ଧ", "ନ", "ପ", "ଫ", "ବ", "ଭ", "ମ", "ଯ", "ର", "ଳ", "ବ", "ଶ", "ଷ", "ସ", "ହ", "ଳ", "କ୍ଷ", "ତ୍ର", "ଜ୍ଞ"],
  matras: ["", "ା", "ି", "ୀ", "ୁ", "ୂ", "ୃ", "ୄ", "େ", "ୈ", "ୋ", "ୌ"],
  halant: "୍", anusvara: "ଂ", visarga: "ଃ", candrabindu: "ଁ",
  numerals: ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"],
};

const TA = {
  id: "ta", name: "Tamil", native: "தமிழ்", languages: ["Tamil"],
  vowels: ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "", "", "எ", "ஐ", "ஒ", "ஔ"],
  consonants: ["க", "க", "க", "க", "ங", "ச", "ச", "ஜ", "ஜ", "ஞ", "ட", "ட", "ட", "ட", "ண", "த", "த", "த", "த", "ந", "ப", "ப", "ப", "ப", "ம", "ய", "ர", "ல", "வ", "ஶ", "ஷ", "ஸ", "ஹ", "ழ", "க்ஷ", "த்ர", "ஜ்ஞ"],
  matras: ["", "ா", "ி", "ீ", "ு", "ூ", "", "", "ெ", "ை", "ொ", "ௌ"],
  halant: "்", anusvara: "ஂ", visarga: "ஃ", candrabindu: "",
  numerals: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"],
};

const TE = {
  id: "te", name: "Telugu", native: "తెలుగు", languages: ["Telugu"],
  vowels: ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ౠ", "ఎ", "ఏ", "ఒ", "ఓ"],
  consonants: ["క", "ఖ", "గ", "ఘ", "ఙ", "చ", "ఛ", "జ", "ఝ", "ఞ", "ట", "ఠ", "డ", "ఢ", "ణ", "త", "థ", "ద", "ధ", "న", "ప", "ఫ", "బ", "భ", "మ", "య", "ర", "ల", "వ", "శ", "ష", "స", "హ", "ళ", "క్ష", "త్ర", "జ్ఞ"],
  matras: ["", "ా", "ి", "ీ", "ు", "ూ", "ృ", "ౄ", "ె", "ై", "ొ", "ౌ"],
  halant: "్", anusvara: "ం", visarga: "ః", candrabindu: "ఁ",
  numerals: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"],
};

const KN = {
  id: "kn", name: "Kannada", native: "ಕನ್ನಡ", languages: ["Kannada"],
  vowels: ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಋ", "ೠ", "ಎ", "ಏ", "ಒ", "ಓ"],
  consonants: ["ಕ", "ಖ", "ಗ", "ಘ", "ಙ", "ಚ", "ಛ", "ಜ", "ಝ", "ಞ", "ಟ", "ಠ", "ಡ", "ಢ", "ಣ", "ತ", "ಥ", "ದ", "ಧ", "ನ", "ಪ", "ಫ", "ಬ", "ಭ", "ಮ", "ಯ", "ರ", "ಲ", "ವ", "ಶ", "ಷ", "ಸ", "ಹ", "ಳ", "ಕ್ಷ", "ತ್ರ", "ಜ್ಞ"],
  matras: ["", "ಾ", "ಿ", "ೀ", "ು", "ೂ", "ೃ", "ೄ", "ೆ", "ೈ", "ೊ", "ೌ"],
  halant: "್", anusvara: "ಂ", visarga: "ಃ", candrabindu: "ಁ",
  numerals: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"],
};

const ML = {
  id: "ml", name: "Malayalam", native: "മലയാളം", languages: ["Malayalam"],
  vowels: ["അ", "ആ", "ഇ", "ഈ", "ഉ", "ഊ", "ഋ", "ൠ", "എ", "ഏ", "ഒ", "ഓ"],
  consonants: ["ക", "ഖ", "ഗ", "ഘ", "ങ", "ച", "ഛ", "ജ", "ഝ", "ഞ", "ട", "ഠ", "ഡ", "ഢ", "ണ", "ത", "ഥ", "ദ", "ധ", "ന", "പ", "ഫ", "ബ", "ഭ", "മ", "യ", "ര", "ല", "വ", "ശ", "ഷ", "സ", "ഹ", "ള", "ക്ഷ", "ത്ര", "ജ്ഞ"],
  matras: ["", "ാ", "ി", "ീ", "ു", "ൂ", "ൃ", "ൄ", "െ", "ൈ", "ൊ", "ൌ"],
  halant: "്", anusvara: "ം", visarga: "ഃ", candrabindu: "",
  numerals: ["൦", "൧", "൨", "൩", "൪", "൫", "൬", "൭", "൮", "൯"],
};

export const SCRIPTS: IndicScript[] = [
  D, B, G, GU, OR, TA, TE, KN, ML,
];

export function getScript(id: string): IndicScript {
  return SCRIPTS.find((s) => s.id === id) || D;
}

/** Build a lookup: longest-first list of {key, type, idx}. */
interface KeyEntry { key: string; type: "c" | "v"; idx: number }

export function buildKeyMap(): KeyEntry[] {
  const entries: KeyEntry[] = [];
  CONSONANT_KEYS.forEach((k, idx) => entries.push({ key: k, type: "c", idx }));
  VOWEL_KEYS.forEach((k, idx) => entries.push({ key: k, type: "v", idx }));
  // special signs
  entries.push({ key: "M", type: "anusvara", idx: 0 } as any);
  entries.push({ key: "H", type: "visarga", idx: 0 } as any);
  entries.sort((a, b) => b.key.length - a.key.length);
  return entries;
}

const KEY_MAP = buildKeyMap();

/**
 * Transliterate a single Latin (Hinglish) word into an Indic script.
 * Handles inherent 'a', matras, conjuncts (halant) and independent vowels.
 */
export function transliterateWord(latin: string, script: IndicScript): string {
  if (!latin) return "";
  let out = "";
  let i = 0;
  let prevC: number | null = null; // index of the last emitted consonant

  const word = latin.toLowerCase();

  while (i < word.length) {
    const rest = word.slice(i);
    let matched: KeyEntry | null = null;
    for (const e of KEY_MAP) {
      if (rest.startsWith(e.key)) {
        matched = e;
        break;
      }
    }

    if (!matched) {
      // unknown char — close any open consonant, emit as-is
      out += word[i];
      prevC = null;
      i += 1;
      continue;
    }

    if (matched.type === "c") {
      // consonant: if previous consonant not yet voweled, add halant (conjunct)
      if (prevC !== null) out += script.halant;
      out += script.consonants[matched.idx] || script.consonants[prevC ?? 0];
      prevC = matched.idx;
      i += matched.key.length;
    } else if (matched.type === "v") {
      if (prevC === null) {
        // independent vowel (word start or after another vowel/sign)
        out += script.vowels[matched.idx] || "";
      } else {
        // dependent matra after a consonant
        if (matched.idx !== 0) out += script.matras[matched.idx] || "";
        prevC = null;
      }
      i += matched.key.length;
    } else {
      // anusvara / visarga
      const sign = matched.type === "anusvara" ? script.anusvara : script.visarga;
      out += sign;
      prevC = null;
      i += matched.key.length;
    }
  }

  return out;
}


