/**
 * Enrich opportunities with institution, city, and updated coordinates.
 * Based on known data from URLs, titles, and general knowledge.
 * Run: node scripts/enrich-institutions.mjs
 */
import { readFileSync, writeFileSync } from "fs"

// ---------------------------------------------------------------------------
// Knowledge base: index → { institution, city, lat, lng }
// Only entries where we can confidently determine the data
// ---------------------------------------------------------------------------
const ENRICHMENT = {
  0: { institution: "Argentina Internship Program", city: "Buenos Aires" },
  1: { institution: "Yale University", city: "New Haven", lat: 41.3163, lng: -72.9223 },
  2: { institution: "Weizmann Institute of Science", city: "Rehovot", lat: 31.9065, lng: 34.8097 },
  3: { institution: "NSRI", city: "Remoto" },
  4: { institution: "Comisión Europea (EACEA)", city: "Bruselas" },
  5: { institution: "L'Oréal", city: "París" },
  6: { institution: "Alexander von Humboldt Foundation", city: "Bonn", lat: 50.7374, lng: 7.0982 },
  7: { institution: "HENNGE", city: "Tokio", lat: 35.6762, lng: 139.6503 },
  8: { institution: "KAUST", city: "Thuwal", lat: 22.3095, lng: 39.1044 },
  9: { institution: "Stanford University", city: "Stanford (Remoto)", lat: 37.4275, lng: -122.1697 },
  10: { institution: "ISTA (Institute of Science and Technology Austria)", city: "Klosterneuburg", lat: 48.3093, lng: 16.2578 },
  11: { institution: "Scuola Superiore Sant'Anna", city: "Pisa", lat: 43.7228, lng: 10.4017 },
  12: { institution: "Campus France / Embajada de Francia en Perú", city: "París" },
  13: { institution: "Google Research", city: "Mountain View", lat: 37.3861, lng: -122.0839 },
  14: { institution: "Fulbright Commission / U.S. Department of State", city: "Washington D.C.", lat: 38.9072, lng: -77.0369 },
  15: { institution: "Fundación Carolina / Santander", city: "Madrid", lat: 40.4168, lng: -3.7038 },
  16: { institution: "Universidade de Santiago de Compostela (CiMUS)", city: "Santiago de Compostela", lat: 42.8782, lng: -8.5448 },
  17: { institution: "IBRO / SEE Program", city: "EE.UU." },
  18: { institution: "University College Dublin (UCD)", city: "Dublín", lat: 53.3066, lng: -6.2197 },
  19: { institution: "Bayer Foundation", city: "Leverkusen", lat: 51.0459, lng: 6.9884 },
  20: { institution: "OIST (Okinawa Institute of Science and Technology)", city: "Onna", lat: 26.4614, lng: 127.8313 },
  21: { institution: "IBRO", city: "India" },
  22: { institution: "IBRO / FALAN", city: "Santiago", lat: -33.4489, lng: -70.6693 },
  23: { institution: "ERA:AI Fellowship / Cambridge", city: "Cambridge", lat: 52.2053, lng: 0.1218 },
  24: { institution: "Fundación Carolina", city: "Madrid", lat: 40.4168, lng: -3.7038 },
  25: { institution: "BMSIS (Blue Marble Space Institute of Science)", city: "Remoto" },
  26: { institution: "Stanford University", city: "Stanford (Remoto)", lat: 37.4275, lng: -122.1697 },
  27: { institution: "Woven by Toyota", city: "Tokio", lat: 35.6762, lng: 139.6503 },
  28: { institution: "Interussia", city: "Moscú", lat: 55.7558, lng: 37.6173 },
  29: { institution: "Stanford University", city: "Stanford", lat: 37.4275, lng: -122.1697 },
  30: { institution: "Antigravity Capital / Puentes", city: "San Francisco", lat: 37.7749, lng: -122.4194 },
  31: { institution: "NASA / ORAU", city: "Washington D.C.", lat: 38.9072, lng: -77.0369 },
  32: { institution: "Cold Spring Harbor Asia", city: "Suzhou", lat: 31.2989, lng: 120.5853 },
  33: { institution: "Youth Neuroscience Organization", city: "Remoto" },
  34: { institution: "Smithsonian Tropical Research Institute (STRI)", city: "Ciudad de Panamá", lat: 8.9824, lng: -79.5199 },
  35: { institution: "ProbAI School", city: "Vilna", lat: 54.6872, lng: 25.2797 },
  36: { institution: "Gobierno de Rumania", city: "Bucarest", lat: 44.4268, lng: 26.1025 },
  37: { institution: "IEEE AP-S" },
  38: { institution: "Google", city: "Remoto" },
  39: { institution: "OIST (Okinawa Institute of Science and Technology)", city: "Onna", lat: 26.4614, lng: 127.8313 },
  40: { institution: "Gobierno de Canadá / EduCanada", city: "Ottawa", lat: 45.4215, lng: -75.6972 },
  41: { institution: "University of St Andrews", city: "St Andrews", lat: 56.3398, lng: -2.7967 },
  42: { institution: "EEML", city: "Montenegro" },
  43: { institution: "ITU / Huawei", city: "Ginebra", lat: 46.2044, lng: 6.1432 },
  44: { institution: "IGF / Naciones Unidas", city: "Ginebra", lat: 46.2044, lng: 6.1432 },
  45: { institution: "Coursera", city: "Remoto" },
  46: { institution: "Pillar VC / Encode", city: "Londres", lat: 51.5074, lng: -0.1278 },
  47: { institution: "University of Cambridge", city: "Cambridge", lat: 52.2053, lng: 0.1218 },
  48: { institution: "UNU-BIOLAC / UNAM", city: "Ciudad de México", lat: 19.4326, lng: -99.1332 },
  49: { institution: "Université Grenoble Alpes", city: "Grenoble", lat: 45.1885, lng: 5.7245 },
  50: { institution: "B. Khrease Academic Consult", city: "Remoto" },
  51: { institution: "IEEE IES", city: "São Paulo", lat: -23.5505, lng: -46.6333 },
  52: { institution: "Université Paris-Saclay", city: "París", lat: 48.7141, lng: 2.2085 },
  53: { institution: "British Council / Santander", city: "Remoto" },
  54: { institution: "European Forum Alpbach", city: "Alpbach", lat: 47.3912, lng: 11.9416 },
  55: { institution: "ROSCon / Open Robotics", city: "Montreal", lat: 45.5017, lng: -73.5673 },
  56: { institution: "Columbia University", city: "New York", lat: 40.8075, lng: -73.9626 },
  57: { institution: "USTC (University of Science and Technology of China)", city: "Hefei", lat: 31.8206, lng: 117.2272 },
  58: { institution: "Universitat de Barcelona", city: "Barcelona", lat: 41.3874, lng: 2.1686 },
  59: { institution: "Computer Vision Center (CVC) / UAB", city: "Barcelona", lat: 41.3874, lng: 2.1686 },
  60: { institution: "IBRO / ACCAN", city: "Sídney", lat: -33.8688, lng: 151.2093 },
  61: { institution: "IEEE TEMS", city: "Remoto" },
  62: { institution: "Francis Crick Institute", city: "Londres", lat: 51.5316, lng: -0.1288 },
  63: { institution: "SC Conference / Supercomputing", city: "EE.UU." },
  64: { institution: "Neuromatch", city: "Remoto" },
  65: { institution: "BioComplexity Summer School", city: "Creta", lat: 35.2401, lng: 24.4700 },
  66: { institution: "Cold Spring Harbor Asia", city: "Suzhou", lat: 31.2989, lng: 120.5853 },
  67: { institution: "Cold Spring Harbor Asia", city: "Suzhou", lat: 31.2989, lng: 120.5853 },
  68: { institution: "IBRO", city: "Italia" },
  69: { institution: "Yale University / BDSY", city: "New Haven", lat: 41.3163, lng: -72.9223 },
  70: { institution: "Government of Ireland / HEA", city: "Dublín", lat: 53.3498, lng: -6.2603 },
  71: { institution: "CIC biomaGUNE", city: "San Sebastián", lat: 43.3183, lng: -1.9812 },
  72: { institution: "MorphoPHEN / EU", city: "Europa" },
  73: { institution: "Mila / Université de Montréal", city: "Montreal", lat: 45.5017, lng: -73.5673 },
  74: { institution: "Gobierno de Canadá", city: "Ottawa", lat: 45.4215, lng: -75.6972 },
  75: { institution: "EMBL (European Molecular Biology Laboratory)", city: "Heidelberg", lat: 49.4034, lng: 8.6753 },
  76: { institution: "INSAIT", city: "Sofía", lat: 42.6977, lng: 23.3219 },
  77: { institution: "UNU-BIOLAC", city: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  78: { institution: "Université Côte d'Azur", city: "Niza", lat: 43.7102, lng: 7.262 },
  79: { institution: "Erasmus Mundus / EMMBIOME", city: "Europa" },
  80: { institution: "Instituto de Neurociencias UMH-CSIC", city: "Alicante", lat: 38.3452, lng: -0.481 },
  81: { institution: "SSHRC / Gobierno de Canadá", city: "Ottawa", lat: 45.4215, lng: -75.6972 },
  82: { institution: "Observatorio Astronómico Nacional - UNAM", city: "Ensenada", lat: 31.8667, lng: -116.5964 },
  83: { institution: "University of Pennsylvania", city: "Filadelfia", lat: 39.9522, lng: -75.1932 },
  84: { institution: "Fundación Carolina", city: "Madrid", lat: 40.4168, lng: -3.7038 },
  85: { institution: "Global Biotech Revolution", city: "París", lat: 48.8566, lng: 2.3522 },
  86: { institution: "UT Dallas / SRNDNA", city: "Dallas", lat: 32.9857, lng: -96.7502 },
  87: { institution: "IBRO / TENSS", city: "Cluj-Napoca", lat: 46.7712, lng: 23.6236 },
  88: { institution: "Zhejiang University", city: "Hangzhou", lat: 30.2741, lng: 120.1551 },
  89: { institution: "AIIB (Asian Infrastructure Investment Bank)", city: "Pekín", lat: 39.9042, lng: 116.4074 },
  90: { institution: "Embajada de EE.UU. en Perú", city: "Lima", lat: -12.0464, lng: -77.0428 },
  91: { institution: "Charité – Universitätsmedizin Berlin", city: "Berlín", lat: 52.52, lng: 13.405 },
  92: { institution: "Global BioImaging" },
  93: { institution: "MBZUAI", city: "Abu Dabi", lat: 24.4539, lng: 54.3773 },
  94: { institution: "Empathic Computing Lab", city: "Remoto" },
  95: { institution: "GIST (Gwangju Institute of Science and Technology)", city: "Gwangju", lat: 35.2271, lng: 126.8400 },
  96: { institution: "IEEE" },
  97: { institution: "IEEE ComSoc", city: "Londres", lat: 51.5074, lng: -0.1278 },
  98: { institution: "PUCP (Pontificia Universidad Católica del Perú)", city: "Lima", lat: -12.0695, lng: -77.0795 },
  99: { institution: "Ashinaga", city: "Remoto" },
  100: { institution: "BAYLAT / USACH", city: "Baviera", lat: 48.7904, lng: 11.4979 },
  101: { institution: "UC Santa Cruz", city: "Santa Cruz", lat: 36.9741, lng: -122.0308 },
  102: { institution: "ITRI (Industrial Technology Research Institute)", city: "Hsinchu", lat: 24.8138, lng: 120.9675 },
  103: { institution: "ETH Zurich", city: "Zúrich", lat: 47.3769, lng: 8.5417 },
  104: { institution: "Gobierno de Corea / GKS", city: "Seúl", lat: 37.5665, lng: 126.978 },
  105: { institution: "Swedish Institute", city: "Estocolmo", lat: 59.3293, lng: 18.0686 },
  106: { institution: "Biozentrum / Universität Basel", city: "Basilea", lat: 47.5596, lng: 7.5886 },
  107: { institution: "University College Dublin", city: "Dublín", lat: 53.3066, lng: -6.2197 },
  108: { institution: "Helmholtz-Zentrum Dresden-Rossendorf (HZDR)", city: "Dresde", lat: 51.0504, lng: 13.7373 },
  109: { institution: "Caltech", city: "Pasadena", lat: 34.1378, lng: -118.1253 },
  110: { institution: "Computational Biology Facility", city: "Remoto" },
  111: { institution: "UNIQLO / Fast Retailing", city: "Tokio", lat: 35.6762, lng: 139.6503 },
  112: { institution: "IVI (International Vaccine Institute)", city: "Seúl", lat: 37.5665, lng: 126.978 },
  113: { institution: "Gobierno de Turquía / Türkiye Bursları", city: "Ankara", lat: 39.9334, lng: 32.8597 },
  114: { institution: "IBRO / Lab Neuroscience Cusco", city: "Cusco", lat: -13.532, lng: -71.9675 },
  115: { institution: "Fundación Carolina / UCM", city: "Madrid", lat: 40.4168, lng: -3.7038 },
  116: { institution: "Ghent University (UGent)", city: "Gante", lat: 51.0543, lng: 3.7174 },
  117: { institution: "FENS / Chen Institute / University of Cambridge", city: "Cambridge", lat: 52.2053, lng: 0.1218 },
  118: { institution: "UNC", city: "Remoto" },
  119: { institution: "IEEE AP-S" },
  120: { institution: "Computer Vision Center (CVC) / UAB", city: "Barcelona", lat: 41.3874, lng: 2.1686 },
  121: { institution: "University at Albany / RNA Institute", city: "Remoto" },
  122: { institution: "Yale University", city: "New Haven", lat: 41.3163, lng: -72.9223 },
  123: { institution: "IEEE IES", city: "Australia" },
  124: { institution: "KAIST", city: "Daejeon", lat: 36.3504, lng: 127.3845 },
  125: { institution: "Nanyang Technological University (NTU)", city: "Singapur", lat: 1.3483, lng: 103.6831 },
  126: { institution: "NSTC / STPI Taiwan", city: "Taipéi", lat: 25.033, lng: 121.5654 },
  127: { institution: "Heidelberg Laureate Forum Foundation", city: "Heidelberg", lat: 49.4034, lng: 8.6753 },
  128: { institution: "Erasmus Mundus / RADMEP+", city: "Europa" },
  129: { institution: "University of Hong Kong (HKU)", city: "Hong Kong", lat: 22.2830, lng: 114.1372 },
  130: { institution: "UCLA", city: "Los Ángeles (Remoto)", lat: 34.0689, lng: -118.4452 },
  131: { institution: "Queen Mary University of London", city: "Londres", lat: 51.5243, lng: -0.0399 },
  132: { institution: "Sumitomo Electric", city: "Osaka", lat: 34.6937, lng: 135.5023 },
  133: { institution: "Champalimaud Foundation", city: "Lisboa", lat: 38.6916, lng: -9.2291 },
  134: { institution: "Erasmus Mundus / HYGIEIA", city: "Europa" },
  135: { institution: "IPAM / UCLA", city: "Los Ángeles", lat: 34.0689, lng: -118.4452 },
  136: { institution: "Young Voices of Science", city: "Remoto" },
  137: { institution: "University of Nottingham", city: "Nottingham", lat: 52.9548, lng: -1.1581 },
  138: { institution: "Society of Women Engineers (SWE)" },
  139: { institution: "KAIST / KSA", city: "Busan", lat: 35.1796, lng: 129.0756 },
  140: { institution: "IEEE RAS", city: "Viena", lat: 48.2082, lng: 16.3738 },
  141: { institution: "Woods Hole Oceanographic Institution (WHOI)", city: "Woods Hole", lat: 41.5243, lng: -70.6711 },
  142: { institution: "DIM C-BRAINS / Universités parisiennes", city: "París", lat: 48.8566, lng: 2.3522 },
  143: { institution: "MIT", city: "Cambridge, MA (Remoto)", lat: 42.3601, lng: -71.0942 },
  144: { institution: "Academia Sinica / TIGP", city: "Taipéi", lat: 25.033, lng: 121.5654 },
  145: { institution: "Fondation Mathématique Jacques Hadamard / Paris-Saclay", city: "París", lat: 48.7141, lng: 2.2085 },
  146: { institution: "IIJ Research Laboratory", city: "Tokio", lat: 35.6762, lng: 139.6503 },
  147: { institution: "Space Telescope Science Institute (STScI)", city: "Baltimore", lat: 39.3299, lng: -76.6227 },
  148: { institution: "Columbia University / WHO", city: "Remoto" },
  149: { institution: "Aalto University", city: "Espoo", lat: 60.1841, lng: 24.8301 },
  150: { institution: "Max Planck Institute (IMPRS-MOB)", city: "Múnich", lat: 48.1351, lng: 11.5820 },
  151: { institution: "ReSkillSpan / EU", city: "Remoto" },
  152: { institution: "UCL / Sainsbury Wellcome Centre", city: "Londres", lat: 51.5246, lng: -0.1340 },
  153: { institution: "UC Davis", city: "Davis", lat: 38.5382, lng: -121.7617 },
  154: { institution: "DESY", city: "Hamburgo", lat: 53.5753, lng: 9.8795 },
  155: { institution: "University of Rochester", city: "Rochester", lat: 43.1566, lng: -77.6088 },
  156: { institution: "INACAL / PTB Alemania", city: "Braunschweig", lat: 52.2689, lng: 10.5268 },
  157: { institution: "ESO (European Southern Observatory)", city: "Garching", lat: 48.2597, lng: 11.6697 },
  158: { institution: "Université Côte d'Azur / Erasmus Mundus", city: "Niza", lat: 43.7102, lng: 7.262 },
  159: { institution: "Erasmus Mundus / ECT+", city: "Europa" },
  160: { institution: "Erasmus Mundus / EMOTION", city: "Europa" },
  161: { institution: "Universidade de São Paulo (USP/IFSC)", city: "São Carlos", lat: -22.0064, lng: -47.8944 },
  162: { institution: "NIMS (National Institute for Materials Science)", city: "Tsukuba", lat: 36.0573, lng: 140.1244 },
  163: { institution: "Clean Water Science Network", city: "Remoto" },
  164: { institution: "Aspire Leaders Program", city: "Remoto" },
  165: { institution: "APEC Australia", city: "Sídney", lat: -33.8688, lng: 151.2093 },
  166: { institution: "Fundación La Caixa", city: "Barcelona", lat: 41.3874, lng: 2.1686 },
  167: { institution: "Engineering for Change (E4C)", city: "Remoto" },
  168: { institution: "CERN", city: "Ginebra", lat: 46.2330, lng: 6.0557 },
  169: { institution: "CERN OpenLab", city: "Ginebra", lat: 46.2330, lng: 6.0557 },
  170: { institution: "UNU-BIOLAC", city: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  171: { institution: "UNESCO", city: "Pekín", lat: 39.9042, lng: 116.4074 },
  172: { institution: "UNI (Universidad Nacional de Ingeniería)", city: "Lima (Remoto)", lat: -12.0215, lng: -77.0497 },
  173: { institution: "AAPM", city: "EE.UU." },
  174: { institution: "Erasmus Mundus / SPACEMED", city: "Europa" },
  175: { institution: "Erasmus Mundus / MESD", city: "Montpellier", lat: 43.6108, lng: 3.8767 },
  176: { institution: "Erasmus Mundus / LIVE", city: "Europa" },
  177: { institution: "U.S. Department of State / TechGirls", city: "Washington D.C.", lat: 38.9072, lng: -77.0369 },
  178: { institution: "École Polytechnique", city: "Palaiseau", lat: 48.7116, lng: 2.2110 },
  179: { institution: "VCDNP", city: "Viena", lat: 48.2082, lng: 16.3738 },
  180: { institution: "IYNA / Alzheimer's Association", city: "Remoto" },
  181: { institution: "Université Paris Cité", city: "París", lat: 48.8566, lng: 2.3522 },
  182: { institution: "Gobierno de Hungría / Stipendium Hungaricum", city: "Budapest", lat: 47.4979, lng: 19.0402 },
  183: { institution: "Hansen Leadership Institute", city: "San Diego", lat: 32.7157, lng: -117.1611 },
  184: { institution: "ITU / AMAS", city: "Remoto" },
  185: { institution: "Max Planck Institute for Astronomy (MPIA)", city: "Heidelberg", lat: 49.3964, lng: 8.7248 },
  186: { institution: "Santa Fe Institute (SFI)", city: "Santa Fe", lat: 35.6870, lng: -105.9378 },
  187: { institution: "Caltech / MIT LIGO", city: "Pasadena", lat: 34.1378, lng: -118.1253 },
  188: { institution: "Caltech / MIT LIGO", city: "Pasadena", lat: 34.1378, lng: -118.1253 },
  189: { institution: "Vienna BioCenter", city: "Viena", lat: 48.1892, lng: 16.4025 },
  190: { institution: "Vienna BioCenter", city: "Viena", lat: 48.1892, lng: 16.4025 },
  191: { institution: "Wellcome Sanger Institute", city: "Cambridge", lat: 52.0832, lng: 0.1879 },
  192: { institution: "IRB Barcelona", city: "Barcelona", lat: 41.3874, lng: 2.1686 },
  193: { institution: "RIKEN Center for Brain Science", city: "Wako", lat: 35.7796, lng: 139.6050 },
  194: { institution: "University of Tokyo", city: "Tokio", lat: 35.7126, lng: 139.7620 },
  195: { institution: "Constellation", city: "Berkeley", lat: 37.8716, lng: -122.2727 },
  196: { institution: "National Institute of Genetics (NIG)", city: "Mishima", lat: 35.1167, lng: 138.9269 },
  197: { institution: "U.S. Department of State / SUSI", city: "Washington D.C.", lat: 38.9072, lng: -77.0369 },
  198: { institution: "Dior / UNESCO", city: "Remoto" },
  199: { institution: "Université de Lausanne (UNIL)", city: "Lausana", lat: 46.5197, lng: 6.6323 },
  200: { institution: "University of Amsterdam / ASPIRE", city: "Ámsterdam", lat: 52.3676, lng: 4.9041 },
  201: { institution: "ETH Zurich", city: "Zúrich", lat: 47.3769, lng: 8.5417 },
  202: { institution: "Helmholtz-Zentrum Berlin", city: "Berlín", lat: 52.4547, lng: 13.2861 },
  203: { institution: "LPI / USRA", city: "Houston", lat: 29.5603, lng: -95.0920 },
}

// ---------------------------------------------------------------------------
// Load current enriched data and apply
// ---------------------------------------------------------------------------
const data = JSON.parse(
  readFileSync("components/sections/opportunities/opportunities-enriched.json", "utf-8")
)

let updated = 0
let institutionCount = 0
let cityCount = 0
let coordsCount = 0

for (const [indexStr, enrichment] of Object.entries(ENRICHMENT)) {
  const idx = parseInt(indexStr)
  if (idx >= data.length) continue
  const item = data[idx]

  if (enrichment.institution) {
    item.institution = enrichment.institution
    institutionCount++
  }

  if (enrichment.city) {
    item.city = enrichment.city
    cityCount++
  }

  if (enrichment.lat != null && enrichment.lng != null) {
    item.lat = enrichment.lat
    item.lng = enrichment.lng
    coordsCount++
  }

  updated++
}

writeFileSync(
  "components/sections/opportunities/opportunities-enriched.json",
  JSON.stringify(data, null, 2),
  "utf-8"
)

console.log(`✅ Enriched ${updated} / ${data.length} opportunities`)
console.log(`   → Institutions added: ${institutionCount}`)
console.log(`   → Cities added: ${cityCount}`)
console.log(`   → Coordinates updated: ${coordsCount}`)

// Check remaining without institution
const noInst = data.filter(d => !d.institution).length
const noCity = data.filter(d => !d.city).length
console.log(`   → Still missing institution: ${noInst}`)
console.log(`   → Still missing city: ${noCity}`)
