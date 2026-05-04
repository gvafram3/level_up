// semData[year][sem] = array of { name, code, cr, score }
// sem 1 & 2 = regular semesters; sem 3 = resit (auto-populated from trails)
const semData = {
  1: {
    1: [
      { name: 'Intro to Basic Computing',  code: 'DCIT 111', cr: 3, score: 67 },
      { name: 'General Biology I',         code: 'BIOL 111', cr: 3, score: 74 },
      { name: 'General Chemistry I',       code: 'CHEM 111', cr: 3, score: 58 },
      { name: 'Calculus I',                code: 'MATH 151', cr: 3, score: 49 },
      { name: 'Principles of Nutrition',   code: 'NUTR 111', cr: 3, score: 81 },
      { name: 'Communication Skills I',    code: 'LANG 111', cr: 2, score: 70 },
      { name: 'Food Science Basics',       code: 'NUTR 113', cr: 2, score: 35 },
    ],                                     // total: 19 cr
    2: [
      { name: 'Intro to Biochemistry',     code: 'BIOC 121', cr: 3, score: 62 },
      { name: 'Human Anatomy',             code: 'ANAT 121', cr: 3, score: 55 },
      { name: 'Organic Chemistry I',       code: 'CHEM 121', cr: 3, score: 48 },
      { name: 'Biostatistics I',           code: 'STAT 121', cr: 3, score: 71 },
      { name: 'Nutrition & Health',        code: 'NUTR 121', cr: 3, score: 77 },
      { name: 'Communication Skills II',   code: 'LANG 121', cr: 2, score: 66 },
      { name: 'Applied Physics',           code: 'PHYS 121', cr: 2, score: 43 },
    ],                                     // total: 19 cr
    3: []
  },
  2: {
    1: [
      { name: 'Human Physiology I',        code: 'PHSL 211', cr: 3, score: 73 },
      { name: 'Biochemistry I',            code: 'BIOC 211', cr: 3, score: 60 },
      { name: 'Organic Chemistry II',      code: 'CHEM 211', cr: 3, score: 54 },
      { name: 'Nutrition Assessment',      code: 'NUTR 211', cr: 3, score: 79 },
      { name: 'Food Microbiology',         code: 'MBIO 211', cr: 3, score: 38 },
      { name: 'Research Methods I',        code: 'RESM 211', cr: 2, score: 65 },
      { name: 'Community Nutrition I',     code: 'NUTR 213', cr: 2, score: 58 },
    ],                                     // total: 19 cr
    2: [
      { name: 'Human Physiology II',       code: 'PHSL 221', cr: 3, score: 68 },
      { name: 'Biochemistry II',           code: 'BIOC 221', cr: 3, score: 57 },
      { name: 'Nutritional Biochemistry',  code: 'NUTR 221', cr: 3, score: 72 },
      { name: 'Epidemiology',              code: 'EPID 221', cr: 3, score: 64 },
      { name: 'Food Chemistry',            code: 'CHEM 221', cr: 3, score: 50 },
      { name: 'Biostatistics II',          code: 'STAT 221', cr: 3, score: 76 },
    ],                                     // total: 18 cr
    3: []
  },
  3: {
    1: [
      { name: 'Clinical Nutrition I',      code: 'NUTR 311', cr: 3, score: 75 },
      { name: 'Metabolism & Energetics',   code: 'BIOC 311', cr: 3, score: 63 },
      { name: 'Public Health Nutrition',   code: 'NUTR 313', cr: 3, score: 69 },
      { name: 'Food Policy & Law',         code: 'NUTR 315', cr: 2, score: 82 },
      { name: 'Pharmacology Basics',       code: 'PHAR 311', cr: 2, score: 56 },
      { name: 'Research Methods II',       code: 'RESM 311', cr: 3, score: 71 },
      { name: 'Molecular Biology',         code: 'BIOC 313', cr: 3, score: 44 },
    ],                                     // total: 19 cr
    2: [
      { name: 'Clinical Nutrition II',     code: 'NUTR 321', cr: 3, score: 78 },
      { name: 'Dietetics Practice I',      code: 'NUTR 323', cr: 3, score: 66 },
      { name: 'Community Health',          code: 'PUHL 321', cr: 3, score: 73 },
      { name: 'Food Safety & Quality',     code: 'NUTR 325', cr: 3, score: 61 },
      { name: 'Nutrition Counselling',     code: 'NUTR 327', cr: 3, score: 85 },
      { name: 'Health Economics',          code: 'ECON 321', cr: 3, score: 52 },
    ],                                     // total: 18 cr
    3: []
  },
  4: {
    1: [
      { name: 'Dissertation I',            code: 'NUTR 411', cr: 6, score: 74 },
      { name: 'Advanced Clinical Nutr.',   code: 'NUTR 413', cr: 3, score: 68 },
      { name: 'Global Nutrition',          code: 'NUTR 415', cr: 3, score: 77 },
      { name: 'Advanced Biochemistry',     code: 'BIOC 411', cr: 3, score: 62 },
      { name: 'Dietetics Practice II',     code: 'NUTR 417', cr: 3, score: 71 },
    ],                                     // total: 18 cr
    2: [
      { name: 'Dissertation II',           code: 'NUTR 421', cr: 6, score: 80 },
      { name: 'Professional Practice',     code: 'NUTR 423', cr: 3, score: 73 },
      { name: 'Nutrition & Disease',       code: 'NUTR 425', cr: 3, score: 67 },
      { name: 'Food Systems',              code: 'NUTR 427', cr: 3, score: 59 },
      { name: 'Seminar & Presentation',    code: 'NUTR 429', cr: 3, score: 76 },
    ],                                     // total: 18 cr (+ 2 from dissertation = 20 total... wait: 6+3+3+3+3=18 ✓)
    3: []
  }
};

// Active view state
let activeYear = 1;
let activeSem  = 1;
