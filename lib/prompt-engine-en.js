// ─────────────────────────────────────────────────────────────────
// RATE MY EXES — English Prompt Engine
// Rules: ① No Chinese characters ② No ten-god literal translation
//         ③ Five abstracted energy categories only
// ─────────────────────────────────────────────────────────────────

// ── Core constants ────────────────────────────────────────────────
const TG_ELEM  = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
const TG_YY    = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
const TG_NAME  = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
const DZ_ELEM  = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
const DZ_ANIMAL= ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
const DZ_MAIN_TG = [9,5,0,1,4,2,3,5,6,7,4,8];
const DZ_CHUNG   = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
const DZ_HEP     = {0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};

// ── Jieqi solar term data ─────────────────────────────────────────
const JIEQI = {
  1940:[[1,6,19],[2,5,7],[3,6,1],[4,5,6],[5,6,0],[6,6,4],[7,7,11],[8,7,17],[9,7,20],[10,8,6],[11,7,15],[12,7,9]],
  1941:[[1,6,1],[2,4,13],[3,6,7],[4,5,12],[5,6,6],[6,6,10],[7,7,17],[8,8,23],[9,8,2],[10,8,12],[11,7,21],[12,7,15]],
  1942:[[1,6,7],[2,4,19],[3,6,13],[4,5,18],[5,6,12],[6,6,16],[7,7,23],[8,8,5],[9,8,8],[10,8,18],[11,8,3],[12,7,21]],
  1943:[[1,6,13],[2,5,1],[3,6,19],[4,5,23],[5,6,17],[6,6,22],[7,8,5],[8,8,11],[9,8,14],[10,8,23],[11,8,9],[12,8,3]],
  1944:[[1,6,18],[2,5,7],[3,6,0],[4,5,5],[5,5,22],[6,5,3],[7,7,10],[8,7,16],[9,7,19],[10,8,5],[11,7,14],[12,7,8]],
  1945:[[1,6,0],[2,4,13],[3,6,6],[4,5,11],[5,6,4],[6,6,9],[7,7,16],[8,7,22],[9,8,1],[10,8,11],[11,7,20],[12,7,14]],
  1946:[[1,6,6],[2,4,19],[3,6,12],[4,5,16],[5,6,10],[6,6,15],[7,7,22],[8,8,4],[9,8,7],[10,8,17],[11,8,2],[12,7,20]],
  1947:[[1,6,12],[2,5,1],[3,6,18],[4,5,22],[5,6,16],[6,6,21],[7,8,4],[8,8,10],[9,8,13],[10,8,22],[11,8,8],[12,8,2]],
  1948:[[1,6,18],[2,5,6],[3,5,23],[4,5,4],[5,5,21],[6,5,2],[7,7,9],[8,7,14],[9,7,18],[10,8,4],[11,7,13],[12,7,7]],
  1949:[[1,5,23],[2,4,12],[3,6,5],[4,5,10],[5,6,3],[6,6,8],[7,7,15],[8,7,20],[9,7,23],[10,8,10],[11,7,19],[12,7,13]],
  1950:[[1,6,5],[2,4,18],[3,6,11],[4,5,16],[5,6,9],[6,6,13],[7,7,21],[8,8,2],[9,8,5],[10,8,16],[11,8,1],[12,7,19]],
  1951:[[1,6,11],[2,5,0],[3,6,17],[4,5,22],[5,6,15],[6,6,19],[7,8,3],[8,8,8],[9,8,11],[10,8,21],[11,8,7],[12,8,1]],
  1952:[[1,6,17],[2,5,6],[3,5,22],[4,5,3],[5,5,20],[6,5,1],[7,7,8],[8,7,13],[9,7,17],[10,8,3],[11,7,12],[12,7,7]],
  1953:[[1,5,22],[2,4,12],[3,6,4],[4,5,9],[5,6,2],[6,6,7],[7,7,14],[8,7,19],[9,7,22],[10,8,9],[11,7,18],[12,7,12]],
  1954:[[1,6,4],[2,4,18],[3,6,10],[4,5,15],[5,6,8],[6,6,12],[7,7,20],[8,8,1],[9,8,4],[10,8,15],[11,7,23],[12,7,18]],
  1955:[[1,6,10],[2,4,23],[3,6,16],[4,5,21],[5,6,14],[6,6,18],[7,8,2],[8,8,7],[9,8,10],[10,8,20],[11,8,6],[12,8,0]],
  1956:[[1,6,16],[2,5,5],[3,5,21],[4,5,2],[5,5,20],[6,5,0],[7,7,7],[8,7,12],[9,7,16],[10,8,2],[11,7,11],[12,7,6]],
  1957:[[1,5,21],[2,4,11],[3,6,3],[4,5,8],[5,6,1],[6,6,6],[7,7,13],[8,7,18],[9,7,21],[10,8,8],[11,7,17],[12,7,11]],
  1958:[[1,6,3],[2,4,17],[3,6,9],[4,5,14],[5,6,7],[6,6,12],[7,7,19],[8,8,0],[9,8,4],[10,8,14],[11,7,23],[12,7,17]],
  1959:[[1,6,9],[2,4,23],[3,6,15],[4,5,20],[5,6,13],[6,6,17],[7,8,1],[8,8,6],[9,8,9],[10,8,19],[11,8,5],[12,7,23]],
  1960:[[1,6,15],[2,5,5],[3,5,20],[4,5,1],[5,5,19],[6,4,23],[7,7,6],[8,7,12],[9,7,15],[10,8,1],[11,7,10],[12,7,5]],
  1961:[[1,5,21],[2,4,11],[3,6,3],[4,5,7],[5,6,1],[6,6,5],[7,7,12],[8,7,18],[9,7,20],[10,8,7],[11,7,16],[12,7,10]],
  1962:[[1,6,3],[2,4,17],[3,6,9],[4,5,13],[5,6,7],[6,6,11],[7,7,18],[8,7,23],[9,8,2],[10,8,13],[11,7,22],[12,7,16]],
  1963:[[1,6,9],[2,4,22],[3,6,15],[4,5,19],[5,6,13],[6,6,17],[7,8,0],[8,8,6],[9,8,9],[10,8,19],[11,8,5],[12,7,22]],
  1964:[[1,6,15],[2,5,4],[3,5,20],[4,5,1],[5,5,18],[6,4,22],[7,7,6],[8,7,11],[9,7,14],[10,7,31],[11,7,10],[12,7,4]],
  1965:[[1,5,20],[2,4,10],[3,6,2],[4,5,7],[5,5,31],[6,6,5],[7,7,12],[8,7,17],[9,7,20],[10,8,7],[11,7,16],[12,7,10]],
  1966:[[1,6,2],[2,4,16],[3,6,8],[4,5,12],[5,6,6],[6,6,10],[7,7,18],[8,7,22],[9,8,1],[10,8,12],[11,7,21],[12,7,15]],
  1967:[[1,6,8],[2,4,22],[3,6,14],[4,5,18],[5,6,12],[6,6,16],[7,8,0],[8,8,5],[9,8,8],[10,8,18],[11,8,4],[12,7,21]],
  1968:[[1,6,13],[2,5,4],[3,5,19],[4,4,30],[5,5,18],[6,4,21],[7,7,5],[8,7,10],[9,7,13],[10,7,30],[11,7,9],[12,7,3]],
  1969:[[1,5,19],[2,4,10],[3,6,1],[4,5,6],[5,5,31],[6,6,4],[7,7,11],[8,7,16],[9,7,19],[10,8,6],[11,7,15],[12,7,9]],
  1970:[[1,6,1],[2,4,16],[3,6,8],[4,5,12],[5,6,5],[6,6,9],[7,7,17],[8,7,21],[9,7,24],[10,8,11],[11,7,20],[12,7,15]],
  1971:[[1,6,7],[2,4,22],[3,6,14],[4,5,18],[5,6,11],[6,6,15],[7,7,22],[8,8,4],[9,8,6],[10,8,16],[11,8,2],[12,7,20]],
  1972:[[1,6,13],[2,5,3],[3,5,19],[4,4,30],[5,5,18],[6,4,21],[7,7,5],[8,7,10],[9,7,13],[10,7,29],[11,7,9],[12,7,2]],
  1973:[[1,5,19],[2,4,9],[3,6,1],[4,5,5],[5,5,30],[6,6,3],[7,7,11],[8,7,15],[9,7,18],[10,8,5],[11,7,14],[12,7,8]],
  1974:[[1,6,0],[2,4,15],[3,6,7],[4,5,11],[5,6,5],[6,6,9],[7,7,16],[8,7,21],[9,8,23],[10,8,11],[11,7,20],[12,7,14]],
  1975:[[1,6,6],[2,4,21],[3,6,13],[4,5,17],[5,6,11],[6,6,15],[7,7,22],[8,8,3],[9,8,5],[10,8,16],[11,8,1],[12,7,20]],
  1976:[[1,6,12],[2,5,3],[3,5,19],[4,4,29],[5,5,18],[6,4,20],[7,7,4],[8,7,9],[9,7,12],[10,7,29],[11,7,8],[12,7,2]],
  1977:[[1,5,18],[2,4,9],[3,6,0],[4,5,5],[5,5,30],[6,6,3],[7,7,10],[8,7,15],[9,7,17],[10,8,4],[11,7,13],[12,7,7]],
  1978:[[1,5,23],[2,4,15],[3,6,6],[4,5,11],[5,6,4],[6,6,8],[7,7,16],[8,7,20],[9,8,23],[10,8,10],[11,7,19],[12,7,13]],
  1979:[[1,6,5],[2,4,21],[3,6,12],[4,5,17],[5,6,11],[6,6,14],[7,7,21],[8,8,3],[9,8,5],[10,8,15],[11,8,1],[12,7,19]],
  1980:[[1,6,11],[2,5,2],[3,5,18],[4,4,29],[5,5,17],[6,4,20],[7,7,3],[8,7,9],[9,7,12],[10,7,28],[11,7,7],[12,7,2]],
  1981:[[1,5,17],[2,4,8],[3,6,0],[4,5,4],[5,5,29],[6,6,2],[7,7,10],[8,7,14],[9,7,17],[10,8,4],[11,7,13],[12,7,7]],
  1982:[[1,5,23],[2,4,14],[3,6,6],[4,5,10],[5,6,4],[6,6,8],[7,7,15],[8,7,20],[9,7,22],[10,8,9],[11,7,18],[12,7,12]],
  1983:[[1,6,5],[2,4,20],[3,6,12],[4,5,16],[5,6,10],[6,6,14],[7,7,21],[8,8,2],[9,8,4],[10,8,15],[11,7,23],[12,7,18]],
  1984:[[1,6,11],[2,5,2],[3,5,17],[4,4,28],[5,5,17],[6,4,19],[7,7,2],[8,7,8],[9,7,11],[10,7,27],[11,7,6],[12,7,1]],
  1985:[[1,5,16],[2,4,8],[3,5,31],[4,5,4],[5,5,29],[6,6,1],[7,7,9],[8,7,14],[9,7,16],[10,8,3],[11,7,12],[12,7,6]],
  1986:[[1,5,22],[2,4,14],[3,6,6],[4,5,10],[5,6,3],[6,6,7],[7,7,15],[8,7,19],[9,7,22],[10,8,8],[11,7,18],[12,7,12]],
  1987:[[1,6,4],[2,4,20],[3,6,12],[4,5,16],[5,6,9],[6,6,13],[7,7,20],[8,8,1],[9,8,4],[10,8,14],[11,7,23],[12,7,17]],
  1988:[[1,6,10],[2,5,1],[3,5,16],[4,4,27],[5,5,16],[6,4,18],[7,7,2],[8,7,7],[9,7,10],[10,7,26],[11,7,6],[12,7,0]],
  1989:[[1,5,16],[2,4,7],[3,5,31],[4,5,3],[5,5,28],[6,6,1],[7,7,8],[8,7,13],[9,7,15],[10,8,2],[11,7,11],[12,7,5]],
  1990:[[1,6,22],[2,4,13],[3,6,6],[4,5,9],[5,6,3],[6,6,7],[7,7,15],[8,7,19],[9,7,22],[10,8,8],[11,7,17],[12,7,11]],
  1991:[[1,6,4],[2,4,19],[3,6,11],[4,5,15],[5,6,9],[6,6,13],[7,7,20],[8,8,1],[9,8,3],[10,8,13],[11,7,22],[12,7,16]],
  1992:[[1,6,10],[2,5,1],[3,5,16],[4,4,27],[5,5,15],[6,4,17],[7,7,1],[8,7,7],[9,7,9],[10,7,26],[11,7,5],[12,6,23]],
  1993:[[1,5,16],[2,4,6],[3,5,31],[4,5,3],[5,5,28],[6,5,31],[7,7,8],[8,7,12],[9,7,15],[10,8,2],[11,7,11],[12,7,5]],
  1994:[[1,5,22],[2,4,12],[3,6,5],[4,5,9],[5,6,3],[6,6,6],[7,7,14],[8,7,18],[9,7,21],[10,8,7],[11,7,16],[12,7,10]],
  1995:[[1,6,4],[2,4,18],[3,6,11],[4,5,15],[5,6,8],[6,6,12],[7,7,19],[8,8,1],[9,8,3],[10,8,13],[11,7,21],[12,7,15]],
  1996:[[1,6,10],[2,5,0],[3,5,16],[4,4,27],[5,5,15],[6,4,17],[7,7,1],[8,7,6],[9,7,9],[10,7,25],[11,7,5],[12,6,23]],
  1997:[[1,5,15],[2,4,6],[3,5,30],[4,5,3],[5,5,28],[6,5,31],[7,7,8],[8,8,12],[9,8,15],[10,8,9],[11,7,17],[12,7,10]],
  1998:[[1,5,21],[2,4,12],[3,6,4],[4,5,9],[5,6,2],[6,6,6],[7,7,14],[8,7,17],[9,7,21],[10,8,7],[11,7,16],[12,7,10]],
  1999:[[1,6,3],[2,4,18],[3,6,10],[4,5,14],[5,6,8],[6,6,11],[7,7,19],[8,8,0],[9,8,2],[10,8,12],[11,7,21],[12,7,15]],
  2000:[[1,6,9],[2,5,0],[3,5,15],[4,4,26],[5,5,14],[6,4,16],[7,7,0],[8,7,6],[9,7,9],[10,7,25],[11,7,4],[12,6,22]],
  2001:[[1,5,15],[2,4,6],[3,5,30],[4,5,2],[5,5,27],[6,5,31],[7,7,7],[8,7,11],[9,7,14],[10,8,1],[11,7,10],[12,7,4]],
  2002:[[1,5,21],[2,4,11],[3,6,4],[4,5,8],[5,6,2],[6,6,5],[7,7,13],[8,7,17],[9,7,20],[10,8,6],[11,7,15],[12,7,9]],
  2003:[[1,6,3],[2,4,17],[3,6,10],[4,5,13],[5,6,7],[6,6,11],[7,7,18],[8,7,23],[9,8,1],[10,8,12],[11,7,21],[12,7,15]],
  2004:[[1,6,9],[2,4,23],[3,5,15],[4,4,25],[5,5,14],[6,4,15],[7,6,23],[8,7,5],[9,7,8],[10,7,24],[11,7,3],[12,6,21]],
  2005:[[1,5,14],[2,4,5],[3,5,29],[4,5,2],[5,5,27],[6,5,30],[7,7,6],[8,7,11],[9,7,13],[10,7,31],[11,7,10],[12,7,3]],
  2006:[[1,5,20],[2,4,11],[3,6,3],[4,5,8],[5,6,1],[6,6,5],[7,7,12],[8,7,17],[9,7,19],[10,8,5],[11,7,15],[12,7,8]],
  2007:[[1,6,2],[2,4,17],[3,6,9],[4,5,13],[5,6,7],[6,6,10],[7,7,18],[8,7,22],[9,8,0],[10,8,11],[11,7,20],[12,7,14]],
  2008:[[1,6,8],[2,4,22],[3,5,14],[4,4,24],[5,5,13],[6,4,15],[7,6,22],[8,7,4],[9,7,7],[10,7,23],[11,7,2],[12,6,20]],
  2009:[[1,5,14],[2,4,4],[3,5,29],[4,5,1],[5,5,26],[6,5,30],[7,7,6],[8,7,10],[9,7,13],[10,7,30],[11,7,9],[12,7,3]],
  2010:[[1,5,20],[2,4,10],[3,6,3],[4,5,7],[5,6,1],[6,6,4],[7,7,12],[8,7,16],[9,7,19],[10,8,5],[11,7,14],[12,7,8]],
  2011:[[1,6,2],[2,4,16],[3,6,9],[4,5,12],[5,6,6],[6,6,9],[7,7,17],[8,7,21],[9,7,23],[10,8,10],[11,7,19],[12,7,13]],
  2012:[[1,6,7],[2,4,21],[3,5,14],[4,4,24],[5,5,13],[6,4,14],[7,6,22],[8,7,3],[9,7,7],[10,7,23],[11,7,2],[12,6,20]],
  2013:[[1,5,13],[2,4,4],[3,5,28],[4,5,1],[5,5,26],[6,5,29],[7,7,6],[8,7,9],[9,7,12],[10,7,30],[11,7,8],[12,7,2]],
  2014:[[1,5,19],[2,4,10],[3,6,2],[4,5,7],[5,6,0],[6,6,4],[7,7,11],[8,7,15],[9,7,17],[10,8,4],[11,7,13],[12,7,7]],
  2015:[[1,6,1],[2,4,16],[3,6,8],[4,5,12],[5,6,5],[6,6,9],[7,7,16],[8,7,20],[9,7,23],[10,8,9],[11,7,18],[12,7,12]],
  2016:[[1,6,7],[2,4,21],[3,5,13],[4,4,23],[5,5,12],[6,4,14],[7,6,21],[8,7,2],[9,7,6],[10,7,22],[11,7,1],[12,6,19]],
  2017:[[1,5,12],[2,4,3],[3,5,28],[4,5,0],[5,5,25],[6,5,29],[7,7,5],[8,7,8],[9,7,11],[10,7,29],[11,7,8],[12,7,1]],
  2018:[[1,5,18],[2,4,9],[3,6,1],[4,5,6],[5,5,31],[6,6,3],[7,7,11],[8,7,14],[9,7,17],[10,8,3],[11,7,13],[12,7,6]],
  2019:[[1,5,23],[2,4,15],[3,6,7],[4,5,11],[5,6,4],[6,6,8],[7,7,15],[8,7,19],[9,7,22],[10,8,8],[11,7,18],[12,7,11]],
  2020:[[1,6,5],[2,4,20],[3,5,12],[4,4,22],[5,5,11],[6,4,13],[7,6,20],[8,7,1],[9,7,6],[10,7,22],[11,7,1],[12,6,18]],
  2021:[[1,5,11],[2,4,2],[3,5,27],[4,4,29],[5,5,24],[6,5,28],[7,7,4],[8,7,7],[9,7,11],[10,7,28],[11,7,7],[12,7,1]],
  2022:[[1,5,17],[2,4,9],[3,6,1],[4,5,5],[5,5,31],[6,6,3],[7,7,10],[8,7,14],[9,7,16],[10,8,3],[11,7,12],[12,7,6]],
  2023:[[1,5,23],[2,4,15],[3,6,6],[4,5,11],[5,6,4],[6,6,7],[7,7,15],[8,7,18],[9,7,22],[10,8,8],[11,7,17],[12,7,11]],
  2024:[[1,6,4],[2,4,20],[3,5,11],[4,4,21],[5,5,11],[6,4,12],[7,6,19],[8,7,1],[9,7,4],[10,7,21],[11,7,0],[12,6,18]],
  2025:[[1,5,10],[2,4,1],[3,5,26],[4,4,28],[5,5,24],[6,5,27],[7,7,3],[8,7,6],[9,7,10],[10,7,27],[11,7,6],[12,6,23]],
  2026:[[1,5,16],[2,4,7],[3,6,1],[4,5,5],[5,5,30],[6,6,3],[7,7,10],[8,7,13],[9,7,16],[10,8,2],[11,7,12],[12,7,5]],
};
const JIEQI_MONTH_DZ = [1,2,3,4,5,6,7,8,9,10,11,0];

// ── Saju calculation (same logic as Korean engine) ────────────────
function getMonthDZ(year, month, day, hour) {
  const years = Object.keys(JIEQI).map(Number).sort((a,b)=>a-b);
  let yr = years[0];
  for (const y of years) { if (y <= year) yr = y; }
  const data = JIEQI[yr];
  if (!data) return [11,0,1,2,3,4,5,6,7,8,9,10][month-1];
  let result = 11;
  for (let i = 0; i < 12; i++) {
    const [jm, jd, jh] = data[i];
    if (month > jm || (month===jm && day > jd) || (month===jm && day===jd && hour >= jh)) result = i;
  }
  return JIEQI_MONTH_DZ[result];
}

function calcSaju(year, month, day, hour) {
  const years = Object.keys(JIEQI).map(Number).sort((a,b)=>a-b);
  let yr = years[0];
  for (const y of years) { if (y <= year) yr = y; }
  const jd = JIEQI[yr] || JIEQI[2000];
  const [lm,ld,lh] = jd[1];
  const beforeLichun = month<lm||(month===lm&&day<ld)||(month===lm&&day===ld&&hour<lh);
  const ay = beforeLichun ? year-1 : year;
  const yrTG  = ((ay-4)%10+10)%10;
  const yrDZ  = ((ay-4)%12+12)%12;
  const monthDZ = getMonthDZ(year, month, day, hour);
  const dzOff = {2:0,3:1,4:2,5:3,6:4,7:5,8:6,9:7,10:8,11:9,0:10,1:11};
  const monthTG = (([2,4,6,8,10,2,4,6,8,10][yrTG]) + dzOff[monthDZ]) % 10;
  const delta = Math.round((new Date(year,month-1,day)-new Date(2000,0,1))/86400000);
  const dayTG = ((4+delta)%10+10)%10;
  const dayDZ = ((6+delta)%12+12)%12;
  const hourDZ = Math.floor((hour+1)/2)%12;
  const hourTG = (([0,2,4,6,8,0,2,4,6,8][dayTG])+hourDZ)%10;
  return { yrTG, yrDZ, monthTG, monthDZ, dayTG, dayDZ, hourTG, hourDZ };
}

// ── English annual flow (no Chinese chars) ────────────────────────
const STEM_ELEMS = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
const BRANCH_ELEMS = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];

function getAnnualFlowEN(startYear=2026, count=10) {
  const result = [];
  for (let y = startYear; y < startYear+count; y++) {
    const tg = ((y-4)%10+10)%10;
    const dz = ((y-4)%12+12)%12;
    result.push(`${y} [${STEM_ELEMS[tg]}·${BRANCH_ELEMS[dz]}]`);
  }
  return result.join(' · ');
}

// ── Five energy categories (no ten-god literal translation) ───────
// Self = peer/mirror  | Output = expressive/creative  | Wealth = magnetic/desire
// Bond = structure/commitment  | Support = nourishing/resource
function getTenGodCategory(dayTG, targetTG) {
  if (dayTG === targetTG) return 'Self';
  const dE = TG_ELEM[dayTG], dY = TG_YY[dayTG];
  const tE = TG_ELEM[targetTG], tY = TG_YY[targetTG];
  const gen   = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const ctrl  = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const genBy = {Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
  const ctrlBy= {Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
  if (tE===dE)         return 'Self';     // both same element
  if (gen[dE]===tE)    return 'Output';
  if (ctrl[dE]===tE)   return 'Wealth';
  if (ctrlBy[dE]===tE) return 'Bond';
  if (genBy[dE]===tE)  return 'Support';
  return 'Self';
}

// ── Element distribution (English %) ─────────────────────────────
function getElemDistEN(r, hasHour) {
  const pillars = hasHour
    ? [[r.yrTG,r.yrDZ],[r.monthTG,r.monthDZ],[r.dayTG,r.dayDZ],[r.hourTG,r.hourDZ]]
    : [[r.yrTG,r.yrDZ],[r.monthTG,r.monthDZ],[r.dayTG,r.dayDZ]];
  const W = {Wood:0,Fire:0,Earth:0,Metal:0,Water:0};
  pillars.forEach(([tg,dz]) => { W[TG_ELEM[tg]]++; W[DZ_ELEM[dz]]++; });
  const total = Object.values(W).reduce((a,b)=>a+b,0);
  const parts = Object.entries(W).map(([k,v]) => `${k} ${Math.round(v/total*100)}%`);
  const missing = Object.entries(W).filter(([,v])=>v===0).map(([k])=>k);
  return { str: parts.join(' | '), missing: missing.join(', ') || 'none' };
}

// ── Day branch relationship (clash/combine) ───────────────────────
function getBranchRelation(myDZ, partnerDZ) {
  if (DZ_CHUNG[myDZ] === partnerDZ) return 'clash — intense friction, push-pull dynamic';
  if (DZ_HEP[myDZ]   === partnerDZ) return 'combine — natural magnetic pull, ease of bonding';
  if (myDZ === partnerDZ)            return 'mirror — same sign, comfort and familiarity but potential stagnation';
  return 'neutral — no direct structural pull or friction';
}

// ── Partner energy profile relative to my day master ─────────────
function getPartnerEnergyProfile(myDayTG, pR, hasHour) {
  const pillars = hasHour
    ? [pR.yrTG, pR.monthTG, pR.dayTG, pR.hourTG]
    : [pR.yrTG, pR.monthTG, pR.dayTG];
  const branches = hasHour
    ? [pR.yrDZ, pR.monthDZ, pR.dayDZ, pR.hourDZ]
    : [pR.yrDZ, pR.monthDZ, pR.dayDZ];

  const counts = { Self:0, Output:0, Wealth:0, Bond:0, Support:0 };
  pillars.forEach(tg => { counts[getTenGodCategory(myDayTG, tg)]++; });
  branches.forEach(dz => {
    const main = DZ_MAIN_TG[dz];
    counts[getTenGodCategory(myDayTG, main)]++;
  });

  // Dominant category
  const dominant = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];

  // Descriptions
  const desc = {
    Self:    'mirror/peer energy — recognition, competition, same-wavelength pull',
    Output:  'expressive/creative energy — stimulation, warmth, attraction pull',
    Wealth:  'magnetic energy — charm, opportunity, desire to possess or be possessed',
    Bond:    'structure/commitment energy — authority, discipline, draws toward formalization',
    Support: 'nourishing/resource energy — care, wisdom, replenishes your core energy',
  };

  const lines = Object.entries(counts)
    .filter(([,v])=>v>0)
    .sort((a,b)=>b[1]-a[1])
    .map(([k,v])=>`  → ${k} energy (${desc[k]}): ${v} position${v>1?'s':''}`);

  return `Their energy profile relative to you:\n${lines.join('\n')}\n  → Dominant pull: ${dominant} energy`;
}

// ── Birth season context (no direct translation) ──────────────────
const SEASON_CONTEXT = {
  2: 'Wood/Spring — expansive, growth-oriented, seeks movement and new beginnings',
  3: 'Wood/Spring — expansive, growth-oriented, seeks movement and new beginnings',
  4: 'Wood/Spring — expansive, growth-oriented, seeks movement and new beginnings',
  5: 'Fire/Summer — expressive, social, driven by passion and visibility',
  6: 'Fire/Summer — expressive, social, driven by passion and visibility',
  7: 'Fire/Summer — expressive, social, driven by passion and visibility',
  8: 'Metal/Autumn — precision-driven, high standards, values completion over exploration',
  9: 'Metal/Autumn — precision-driven, high standards, values completion over exploration',
  10:'Metal/Autumn — precision-driven, high standards, values completion over exploration',
  11:'Water/Winter — introspective, strategic, depth-first processing',
  0: 'Water/Winter — introspective, strategic, depth-first processing',
  1: 'Water/Winter — introspective, strategic, depth-first processing',
};

// ── Main person text builder (English, no Chinese chars) ──────────
function buildPersonTextEN(label, year, month, day, hour, timezone) {
  const hasHour = hour !== null && hour !== undefined;
  const h = hasHour ? hour : 12;
  const r = calcSaju(year, month, day, h);

  const dayElem = TG_ELEM[r.dayTG];
  const dayYY   = TG_YY[r.dayTG];
  const dayMaster = `${dayYY} ${dayElem}`;
  const dayMasterLabel = dayElem;

  const dayBranch = `${DZ_ELEM[r.dayDZ]}/${DZ_ANIMAL[r.dayDZ]}`;
  const monthSeason = SEASON_CONTEXT[r.monthDZ] || 'Mixed season';
  const elemDist = getElemDistEN(r, hasHour);
  const hourNote = hasHour ? '' : ' (birth time unknown — 3-pillar estimate)';

  // Day master personality shorthand
  const dayMasterDesc = {
    'Yang Wood':  'expansive, growth-driven, self-directed — needs space to move forward',
    'Yin Wood':   'adaptive, persistent, reads between the lines',
    'Yang Fire':  'bold, charismatic, leads with energy and passion',
    'Yin Fire':   'warm, illuminating, steady heat rather than explosion',
    'Yang Earth': 'reliable, principled, slow to trust but deeply loyal',
    'Yin Earth':  'nurturing, receptive, holds things together behind the scenes',
    'Yang Metal': 'precise, high-standard, cuts through ambiguity',
    'Yin Metal':  'refined, exacting, beauty-oriented and quietly intense',
    'Yang Water': 'fluid, perceptive, emotionally intelligent and strategically deep',
    'Yin Water':  'intuitive, sensitive, absorbs everything around them',
  }[dayMaster] || dayElem;

  const tzNote = timezone ? `\nTimezone: ${timezone}` : '';
  const text = `${label}:
⚡ Day Master (core element): ${dayMasterLabel} — ${dayMasterDesc}
Birth season: ${monthSeason}
Element spread: ${elemDist.str}${hourNote}
Missing element${elemDist.missing !== 'none' ? ': ' + elemDist.missing : ': none'}
Day sign: ${DZ_ANIMAL[r.dayDZ]}${tzNote}`;

  return { text, r, dayElem, dayYY, dayDZ: r.dayDZ };
}

// ─────────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a Bazi (Four Pillars of Destiny) compatibility analyst and relationship psychology writer.
Based on birth chart data provided, analyze the connection between the user and each person listed.

⚠️ CRITICAL — DAY MASTER READING (read this before anything else):
The "Day Master" field in each person's data is the SINGLE most important input. It tells you their core elemental identity.
- If Day Master says "Fire" → that person IS Fire. Write "Fire energy", "Fire core", "Fire day master". NEVER call them Wood, Metal, Water, or Earth.
- If Day Master says "Water" → that person IS Water. NEVER call them Metal or any other element.
- If Day Master says "Wood" → that person IS Wood. NEVER substitute.
- BEFORE writing any section, confirm to yourself: "User's Day Master is ___, Partner's Day Master is ___." If those are wrong, everything downstream is wrong.
- Do NOT infer the element from anything else. Do NOT use the element distribution or birth season to override the Day Master label.
- Misidentifying the Day Master (e.g., calling a Fire person "Wood") is a critical failure. The entire analysis becomes invalid.

ANALYSIS PRIORITY ORDER:
1. Day Master (the person's core element — highest priority)
2. Birth season / Month context
3. Day sign (relationship sign)
4. Energy profile (Support / Bond / Output / Wealth / Self)
5. Element distribution (lowest priority — context only, never overrides Day Master)

ANALYSIS RULES:
1. Analyze each person across 5 sections in this order: Emotional Depth · Growth · Stability · Worldview · Timing
2. Each section: score (0-100), narrative text (3-5 sentences), one-line summary.
3. Score logic (internal calculation):

❤️ Emotional Depth:  relationship sign interaction 35 + energy profile match 30 + day master dynamic 15 + element complement 10 + polarity 5 + other 5
🚀 Growth:           energy profile match 50 + birth season contrast 20 + element complement 15 + day master interaction 15
🏠 Stability:        relationship sign 30 + day branch clash/combine 30 + elemental balance 20 + polarity 10 + other 10
🦎 Worldview:        birth season similarity 30 + day master element 30 + polarity 20 + element 20
⏳ Timing:           my day master vs annual flow 50 + their day master vs annual flow 50

Total score: ❤️×0.25 + 🚀×0.20 + 🏠×0.30 + 🦎×0.15 + ⏳×0.10

4. Archetype — combine total score with highest-scoring section:
   90+   → deeply grounding partnership
   80–89 → growth-driving, hard to forget
   70–79 → intense but needs calibration
   60–69 → stable but may feel like a ceiling
   below 50 → fundamentally different frequencies

5. STRICT LANGUAGE RULES:
   - Write ONLY in English
   - NEVER use the words "Yang" or "Yin" — describe polarity as "active/receptive" or just drop it
   - NEVER say "[element]-missing" or "[element]-heavy" — use "limited [element] influence" or "[element]-dominant energy"
   - NO Chinese characters anywhere
   - NO Korean terms anywhere
   - NO literal Bazi jargon: never write "ten-god", "sipseong", "gwan", "inseong", "jeongjae", "bigyeon", "geobjaae", "jieqi", or any romanized Korean/Chinese term
   - Describe dynamics in plain English: "nourishing pull", "controlling dynamic", "mirror energy", "structural friction", etc.
   - For energy categories use ONLY: Self energy / Output energy / Wealth energy / Bond energy / Support energy

6. Tone: direct, warm, slightly sharp. Second person ("you"). Like a trusted friend who's also read the chart.

7. If multiple people, end with overall ranking + comparison comment in ranking_comment.
   If single person, ranking_comment = null.

8. Respond ONLY in valid JSON. No markdown. No text outside the JSON object.

JSON FORMAT:
{
  "annual_flow": "yearly energy string",
  "results": [
    {
      "name": "person nickname",
      "scores": { "heart": 88, "growth": 82, "stability": 71, "worldview": 79, "timing": 68, "total": 78 },
      "archetype": "🌪 growth-driving — the kind you don't forget",
      "sections": {
        "heart":      { "text": "3-5 sentences.", "summary": "one-line summary." },
        "growth":     { "text": "...", "summary": "..." },
        "stability":  { "text": "...", "summary": "..." },
        "worldview":  { "text": "...", "summary": "..." },
        "timing":     { "text": "...", "summary": "..." }
      },
      "overall": "3-4 sentence overall comment"
    }
  ],
  "ranking_comment": "comparison comment if multiple people. null if single."
}`.trim();

// ─────────────────────────────────────────────────────────────────
// FEW-SHOT SET 1 — two people (ex + situationship)
// ─────────────────────────────────────────────────────────────────
const FEW_SHOT_USER = `
[Yearly energy flow 2026–2035]
2026 [Fire·Fire] · 2027 [Fire·Earth] · 2028 [Earth·Metal] · 2029 [Earth·Metal] · 2030 [Metal·Earth] · 2031 [Metal·Water] · 2032 [Water·Water] · 2033 [Water·Earth] · 2034 [Wood·Wood] · 2035 [Wood·Wood]

[Me — Female, 1997.10.29]:
⚡ Day Master (core element): Wood — expansive, growth-driven, self-directed — needs space to move forward
Birth season: Metal/Autumn — precision-driven, high standards, values completion over exploration
Element spread: Wood 25% | Fire 13% | Earth 50% | Metal 13% | Water 0%
Missing element: Water
Day sign: Dragon

[Person A — "the situationship" (1996.04.17)]:
Day Master: Wood — expansive, growth-driven, self-directed — needs space to move forward
Birth season: Water/Spring — emotionally intuitive, opportunity-sensing before conditions are perfect
Element spread: Wood 25% | Fire 13% | Earth 25% | Metal 13% | Water 25%
Missing element: none
Day sign: Monkey
Their energy profile relative to you:
  → Self energy (mirror/peer energy — recognition, competition, same-wavelength pull): 3 positions
  → Bond energy (structure/commitment energy — authority, discipline, draws toward formalization): 1 position
  → Support energy (nourishing/resource energy — care, wisdom, replenishes your core energy): 1 position
  → Dominant pull: Self energy
Day sign connection: neutral — no direct structural pull or friction

[Person B — "the ex" (1995.01.10)]:
⚡ Day Master (core element): Metal — refined, exacting, beauty-oriented and quietly intense
Birth season: Water/Winter — introspective, strategic, depth-first processing
Element spread: Wood 13% | Fire 0% | Earth 50% | Metal 25% | Water 13% (birth time unknown — 3-pillar estimate)
Missing element: Fire
Day sign: Ox
Their energy profile relative to you:
  → Bond energy (structure/commitment energy — authority, discipline, draws toward formalization): 3 positions
  → Self energy (mirror/peer energy — recognition, competition, same-wavelength pull): 1 position
  → Support energy (nourishing/resource energy — care, wisdom, replenishes your core energy): 1 position
  → Dominant pull: Bond energy
Day sign connection: neutral — no direct structural pull or friction
`.trim();

const FEW_SHOT_ASSISTANT = `
{
  "annual_flow": "2026 [Fire·Fire] · 2027 [Fire·Earth] · 2028 [Earth·Metal] · 2029 [Earth·Metal] · 2030 [Metal·Earth] · 2031 [Metal·Water] · 2032 [Water·Water] · 2033 [Water·Earth] · 2034 [Wood·Wood] · 2035 [Wood·Wood]",
  "results": [
    {
      "name": "the situationship",
      "scores": { "heart": 87, "growth": 84, "stability": 71, "worldview": 79, "timing": 75, "total": 79 },
      "archetype": "🌪 the mirror match — electric, magnetic, and a little chaotic",
      "sections": {
        "heart": {
          "text": "You both share a Wood core, meaning the pull here hits fast and feels incredibly familiar — like recognizing your own reflection. When two people have the exact same elemental drive, the attraction isn't just physical; it's a deep, unspoken peer energy. He didn't just 'like' you; he truly saw you, measuring his own growth against yours. That double-edged mirroring — part magnetic pull, part unspoken competition — is exactly why this connection lives rent-free in your head.",
          "summary": "Not just chemistry — a profound mutual recognition that keeps pulling you back."
        },
        "growth": {
          "text": "His chart is heavy in Water (the element of intuition and flow), while your Earth-dominant placements build methodical, heavy foundations. This contrast creates a natural evolutionary push. Being around him forced you to reconsider your rigid rules, while your grounding energy gave his fluidity some shape. It's a connection that forces growth through friction rather than comfort. The risk? Without conscious effort, that stimulating challenge easily turns into a power struggle.",
          "summary": "Pushed you out of your comfort zone, but the friction was real."
        },
        "stability": {
          "text": "Your day signs are structurally neutral — meaning the elements aren't forcing you together or pulling you apart. The stability of this bond is 100% up to your free will. Because your chart has limited Water influence and he has plenty of it, his presence probably felt incredibly healing at times, yet completely untethered at others. When two Wood signs move at different speeds, someone always ends up feeling left behind unless you actively sync your pacing.",
          "summary": "The chemistry is effortless, but the stability requires serious intentional work."
        },
        "worldview": {
          "text": "You are heavily influenced by your Autumn/Metal season — high standards, calculating risk before jumping — while he carries Spring/Water energy: visionary, moving before conditions are perfect. It's the classic dynamic of the strategist vs. the intuitive. You both want growth and independence, so the destination is the same, but your maps couldn't be more different. The conversations are intoxicating until you actually have to agree on a shared plan.",
          "summary": "Same destination, totally different maps — fascinating until a route has to be chosen."
        },
        "timing": {
          "text": "Under the current Fire years (2026–2027), Wood energy is highly activated. This is an expansion phase for both of you. If you crossed paths right now, the spark would be instant and explosive. However, the incoming Metal years (2030–2031) will act like a hard reset for Wood-dominant charts — bringing strict pressure and a reality check on what's actually solid. The universe will test if this foundation is real or just a beautiful illusion.",
          "summary": "Explosive timing right now, but a major reality check is coming later."
        }
      },
      "overall": "This connection has a specific, undeniable staying power that has less to do with easy romance and more to do with karmic mirroring. He saw a version of you that mattered. The chart doesn't call this a disaster — it calls it a high-voltage growth relationship with unresolved timing. If this came back, it would be intense. Whether that intensity burns everything down or builds something new depends entirely on turning competition into collaboration."
    },
    {
      "name": "the ex",
      "scores": { "heart": 78, "growth": 67, "stability": 88, "worldview": 57, "timing": 66, "total": 74 },
      "archetype": "⚖️ the grounding anchor — stable, protective, but maybe a ceiling",
      "sections": {
        "heart": {
          "text": "Metal energy cutting through your expansive Wood core — this is a classic tension dynamic, but one that feels incredibly safe. He doesn't love loudly; he loves through acts of service, structure, and quiet responsibility. For an Earth-dominant chart like yours with limited Water, his hyper-organized, protective nature provided the exact grounding you were searching for. But Metal's urge to direct Wood can feel like profound care at first, until one day it starts feeling like constraint.",
          "summary": "The kind of love that stays long after the honeymoon phase — for better and worse."
        },
        "growth": {
          "text": "Metal refines Wood. He likely made you sharper, more realistic about timelines, and more grounded — genuinely useful for your natural urge to expand too fast. But growth in this dynamic comes from being pruned rather than being watered. You probably became highly efficient while he was around, but you may not have felt encouraged to dream bigger. It's a relationship that polished your existing self but didn't necessarily help you discover a new one.",
          "summary": "Made you sharper and more grounded, but rarely stretched your imagination."
        },
        "stability": {
          "text": "Your Dragon sign and his Ox sign are both fixed Earth energy. Structurally, this is one of the most durably compatible placements in the chart system. Neither of you bails at the first sign of a storm. The stability here is quiet, deeply rooted, and cumulative. Over time, this bond becomes as reliable as gravity. For many people, this is the ultimate endgame — but only if you're okay with predictability.",
          "summary": "Built to survive anything — the question is whether surviving and living are the same thing."
        },
        "worldview": {
          "text": "Wood and Metal operate on fundamentally different frequencies. You look for possibilities; he calculates worst-case scenarios. You expand; he contracts and secures. You likely found his precision stabilizing but slightly suffocating, while he probably viewed your ambition as inspiring but slightly reckless. Since you both have elemental gaps — limited Water for you, limited Fire for him — you function incredibly well as a pragmatic team. But functioning as a team isn't the same as sharing a deeper wavelength.",
          "summary": "Complementary as a tactical duo, but speaking totally different emotional languages."
        },
        "timing": {
          "text": "You are currently moving through expansive Fire years, which fuels your Wood energy beautifully but exhausts his Metal chart. This means you are likely evolving and moving much faster right now than he is comfortable with. The upcoming Metal years (2030–2031) will shift the energy back in his favor, forcing consolidation. Your seasonal rhythms simply peak at different times.",
          "summary": "Mismatched rhythms — you're in a season of expansion while he prefers to consolidate."
        }
      },
      "overall": "This relationship had genuine, undeniable structural compatibility — the kind that shows up as deep trust and someone who actually stays when things get hard. The chart confirms this was a very real, grounding chapter. The real question isn't whether it 'worked'; it's whether the version of rock-solid stability it offered is still what you need, or if you've outgrown the container."
    }
  ],
  "ranking_comment": "Comparing the two: the situationship scores much higher on Emotional Depth and Growth — it has that electric chemistry and productive friction that makes a connection unforgettable. The ex dominates in Stability — offering the kind of fixed, durable foundation the situationship entirely lacked. If your current era is about building a safe, predictable foundation, the ex's chart aligns. If you're in an era of self-discovery and momentum, the situationship matches your energy. They aren't competing for the same role; they represent two completely different versions of your life."
}
`.trim();

// ─────────────────────────────────────────────────────────────────
// FEW-SHOT SET 2 — one person (talking stage)
// ─────────────────────────────────────────────────────────────────
const FEW_SHOT_USER2 = `
[Yearly energy flow 2026–2035]
2026 [Fire·Fire] · 2027 [Fire·Earth] · 2028 [Earth·Metal] · 2029 [Earth·Metal] · 2030 [Metal·Earth] · 2031 [Metal·Water] · 2032 [Water·Water] · 2033 [Water·Earth] · 2034 [Wood·Wood] · 2035 [Wood·Wood]

[Me — Female, 1997.10.29]:
⚡ Day Master (core element): Wood — expansive, growth-driven, self-directed — needs space to move forward
Birth season: Metal/Autumn — precision-driven, high standards, values completion over exploration
Element spread: Wood 25% | Fire 13% | Earth 50% | Metal 13% | Water 0%
Missing element: Water
Day sign: Dragon

[Person A — "the talking stage" (1992.11.18)]:
⚡ Day Master (core element): Water — fluid, perceptive, emotionally intelligent and strategically deep
Birth season: Metal/Autumn-Winter cusp — shaped by introspection and strategic reserve
Element spread: Water 38% | Wood 25% | Metal 25% | Fire 0% | Earth 13% (birth time unknown — 3-pillar estimate)
Missing element: Fire
Day sign: Rat
Their energy profile relative to you:
  → Support energy (nourishing/resource energy — care, wisdom, replenishes your core energy): 3 positions
  → Bond energy (structure/commitment energy — authority, discipline, draws toward formalization): 1 position
  → Output energy (expressive/creative energy — stimulation, warmth, attraction pull): 1 position
  → Dominant pull: Support energy
Day sign connection: neutral — no direct structural pull or friction
`.trim();

const FEW_SHOT_ASSISTANT2 = `
{
  "annual_flow": "2026 [Fire·Fire] · 2027 [Fire·Earth] · 2028 [Earth·Metal] · 2029 [Earth·Metal] · 2030 [Metal·Earth] · 2031 [Metal·Water] · 2032 [Water·Water] · 2033 [Water·Earth] · 2034 [Wood·Wood] · 2035 [Wood·Wood]",
  "results": [
    {
      "name": "the talking stage",
      "scores": { "heart": 82, "growth": 75, "stability": 68, "worldview": 74, "timing": 70, "total": 74 },
      "archetype": "🌊 the slow burn — acts like a cosmic reset for your nervous system",
      "sections": {
        "heart": {
          "text": "Water feeding Wood is one of the most naturally flowing elemental combinations. What this means in real life is that being around him acts like a deep exhale for your nervous system. It's less about dramatic fireworks and more about arriving somewhere you didn't know you were trying to reach. Because your chart has limited Water influence, his core element provides exactly the emotional nourishment you usually have to generate yourself. The limited Fire in his chart means he won't rush this — it deepens quietly rather than exploding.",
          "summary": "Not the loudest spark, but one of the most authentic and healing pulls you'll experience."
        },
        "growth": {
          "text": "Water teaches Wood to slow down and absorb. Since you have heavy Earth and Metal placements that constantly push you to achieve and build, his energy invites you to simply be. The growth here is less about overcoming external challenges and more about being given the emotional safety to drop your armor. The only risk? Too much comfort. A Wood-core chart like yours sometimes needs a little friction to keep moving forward, and he might be almost too accommodating.",
          "summary": "Growth through emotional safety and depth, rather than pressure."
        },
        "stability": {
          "text": "Water-dominant charts are deeply intuitive but notoriously fluid — they flow around obstacles rather than confronting them. Your Dragon sign wants to define the relationship and build a concrete future; his Rat sign is perfectly happy just floating in the vibe. Stability here is definitely achievable, but it requires actual communication. Because he has limited Fire energy (the element of direct action), he might avoid defining the connection until you initiate the 'what are we' conversation.",
          "summary": "Emotionally steady but structurally fluid — you'll likely need to be the one to define the terms."
        },
        "worldview": {
          "text": "You expand horizontally into the world (Wood); he dives vertically into the depths (Water). It's like a sprinter meeting a deep-sea diver. You think in terms of forward momentum; he thinks in terms of hidden meanings. Early on, this difference shows up as intense, mutually intoxicating curiosity. You're both outwardly oriented and action-inclined, which keeps the dynamic fresh. You approach the same situation with entirely different first instincts, making every conversation a discovery.",
          "summary": "Different in all the right ways — the kind of contrast that keeps things endlessly interesting."
        },
        "timing": {
          "text": "The current Fire years (2026–2027) heavily favor your Wood energy, making you feel expansive and ready to leap. However, these Fire years can make his Water-dominant chart feel drained or withdrawn. You might feel like you're moving at 100mph while he's still analyzing the route. It's not a dealbreaker, but the timing is slightly asymmetrical right now. The true alignment for this connection arrives during the Water years of 2032–2033.",
          "summary": "You're ready to sprint, he's taking a mindful walk. Patience is required right now."
        }
      },
      "overall": "This chart has something genuinely rare: a nourishing pull with zero toxicity. The elemental dynamic of Water feeding Wood means this connection will likely feel more profound and real the longer it simmers. The main hurdle isn't chemistry — it's his fluid Water nature. Because he prefers to go with the flow, moving from talking stage to something real will require you to gently set the structure. If he steps up into that structure, this has serious long-term potential."
    }
  ],
  "ranking_comment": null
}
`.trim();

// ─────────────────────────────────────────────────────────────────
// Main: build prompt messages
// ─────────────────────────────────────────────────────────────────

/**
 * buildPromptMessagesEN(myInfo, partners)
 *
 * myInfo:   { year, month, day, hour (null = unknown), gender }
 * partners: [{ nickname, year, month, day, hour (null = unknown) }, ...]
 *
 * Returns OpenAI messages array (system + 2 few-shot sets + actual user msg)
 */
function buildPromptMessagesEN(myInfo, partners) {
  const annualFlow = getAnnualFlowEN(2026, 10);

  // Build my data
  const genderLabel = myInfo.gender === 'female' ? 'Female' : 'Male';
  const myBirth = `${myInfo.year}.${String(myInfo.month).padStart(2,'0')}.${String(myInfo.day).padStart(2,'0')}`;
  const myData = buildPersonTextEN(
    `Me — ${genderLabel}, ${myBirth}`,
    myInfo.year, myInfo.month, myInfo.day, myInfo.hour, myInfo.timezone
  );

  // Build partner texts
  const partnerTexts = partners.map((p, i) => {
    const birth = `${p.year}.${String(p.month).padStart(2,'0')}.${String(p.day).padStart(2,'0')}`;
    const label = `Person ${String.fromCharCode(65+i)} — "${p.nickname}" (${birth})`;
    const hasHour = p.hour !== null && p.hour !== undefined;
    const pData = buildPersonTextEN(label, p.year, p.month, p.day, p.hour, p.timezone);
    const energyProfile = getPartnerEnergyProfile(myData.r.dayTG, pData.r, hasHour);
    const branchRel = getBranchRelation(myData.dayDZ, pData.dayDZ);
    return `${pData.text}\n${energyProfile}\nDay sign connection: ${branchRel}`;
  });

  const userMessage = `
[Yearly energy flow 2026–2035]
${annualFlow}

${myData.text}

${partnerTexts.join('\n\n')}
`.trim();

  return [
    { role: 'system',    content: SYSTEM_PROMPT },
    { role: 'user',      content: FEW_SHOT_USER },
    { role: 'assistant', content: FEW_SHOT_ASSISTANT },
    { role: 'user',      content: FEW_SHOT_USER2 },
    { role: 'assistant', content: FEW_SHOT_ASSISTANT2 },
    { role: 'user',      content: userMessage },
  ];
}

module.exports = {
  buildPromptMessagesEN,
  buildPersonTextEN,
  getPartnerEnergyProfile,
  getBranchRelation,
  getAnnualFlowEN,
  calcSaju,
};