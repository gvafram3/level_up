// semData[year][sem] = array of { name, code, cr, score }
// sem 1 & 2 = regular semesters; sem 3 = resit (auto-populated from trails)
const semData = {
  1: {
    1: [
      { name: 'Intro to Basic Computing', code: 'DCIT 111', cr: 3, score: 65 },
      { name: 'General Biology I',        code: 'BIOL 111', cr: 3, score: 78 },
      { name: 'General Chemistry I',      code: 'CHEM 111', cr: 3, score: 63 },
      { name: 'Calculus I',               code: 'MATH 151', cr: 3, score: 54 },
      { name: 'Principles of Nutrition',  code: 'NUTR 111', cr: 2, score: 82 },
      { name: 'Communication Skills I',   code: 'LANG 111', cr: 2, score: 66 },
      { name: 'Applied Physics',          code: 'PHYS 151', cr: 2, score: 45 },
      { name: 'Food Science Basics',      code: 'NUTR 113', cr: 2, score: 32 },
    ],
    2: [
      { name: 'Intro to Biochemistry',    code: 'BIOC 211', cr: 3, score: 65 },
      { name: 'Human Physiology',         code: 'NUTR 211', cr: 3, score: 74 },
      { name: 'Organic Chemistry',        code: 'CHEM 211', cr: 3, score: 52 },
      { name: 'Biostatistics',            code: 'STAT 211', cr: 2, score: 61 },
      { name: 'Nutrition Assessment',     code: 'NUTR 213', cr: 2, score: 77 },
      { name: 'Research Methods',         code: 'NUTR 215', cr: 2, score: 53 },
      { name: 'Food Microbiology',        code: 'NUTR 217', cr: 2, score: 44 },
    ],
    3: [] // auto-populated from trails in sem 1 & 2
  },
  2: {
    1: [
      { name: 'Metabolism I',             code: 'BIOC 311', cr: 3, score: 80 },
      { name: 'Clinical Nutrition',       code: 'NUTR 311', cr: 3, score: 68 },
      { name: 'Community Nutrition',      code: 'NUTR 313', cr: 2, score: 75 },
      { name: 'Food Chemistry',           code: 'CHEM 311', cr: 3, score: 64 },
      { name: 'Dietetics Practice',       code: 'NUTR 315', cr: 2, score: 55 },
      { name: 'Epidemiology',             code: 'EPID 311', cr: 2, score: 62 },
    ],
    2: [
      { name: 'Public Health Nutrition',  code: 'NUTR 317', cr: 2, score: 71 },
      { name: 'Nutritional Biochemistry', code: 'BIOC 321', cr: 3, score: 58 },
      { name: 'Food Policy',              code: 'NUTR 319', cr: 2, score: 66 },
      { name: 'Microbiology II',          code: 'BIOL 321', cr: 3, score: 35 },
      { name: 'Statistics II',            code: 'STAT 321', cr: 2, score: 60 },
    ],
    3: []
  },
  3: {
    1: [
      { name: 'Advanced Nutrition',       code: 'NUTR 411', cr: 3, score: 72 },
      { name: 'Molecular Biology',        code: 'BIOC 411', cr: 3, score: 65 },
      { name: 'Research Design',          code: 'NUTR 413', cr: 2, score: 58 },
      { name: 'Clinical Dietetics',       code: 'NUTR 415', cr: 3, score: 70 },
      { name: 'Pharmacology Basics',      code: 'PHAR 311', cr: 2, score: 55 },
    ],
    2: [
      { name: 'Community Health',         code: 'PUHL 411', cr: 2, score: 68 },
      { name: 'Food Safety',              code: 'NUTR 417', cr: 2, score: 74 },
      { name: 'Biostatistics II',         code: 'STAT 411', cr: 3, score: 62 },
      { name: 'Nutrition Counselling',    code: 'NUTR 419', cr: 2, score: 77 },
    ],
    3: []
  },
  4: {
    1: [
      { name: 'Dissertation I',           code: 'NUTR 511', cr: 6, score: 75 },
      { name: 'Advanced Biochemistry',    code: 'BIOC 511', cr: 3, score: 68 },
      { name: 'Health Economics',         code: 'ECON 411', cr: 2, score: 60 },
    ],
    2: [
      { name: 'Dissertation II',          code: 'NUTR 521', cr: 6, score: 78 },
      { name: 'Professional Practice',    code: 'NUTR 523', cr: 2, score: 72 },
      { name: 'Global Nutrition',         code: 'NUTR 525', cr: 2, score: 65 },
    ],
    3: []
  }
};

// Active view state
let activeYear = 1;
let activeSem  = 1;
