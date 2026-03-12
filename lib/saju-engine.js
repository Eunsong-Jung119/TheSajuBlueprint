const TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const TG_EN = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
const TG_ELEM = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
const TG_YY   = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];

const DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const DZ_EN = ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai'];
const DZ_ELEM = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
const DZ_NAME = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
// ── 복원된 전역 상수들 ─────────────────────────────────────
const BAEKHO = [[0,4],[1,8],[2,10],[3,1],[4,4],[8,10],[9,1]];
const DZ_CHUNG = { 0:6, 6:0, 1:7, 7:1, 2:8, 8:2, 3:9, 9:3, 4:10, 10:4, 5:11, 11:5 };
const DZ_FIRST = [8,9,4,0,1,4,2,3,4,6,7,4];
const DZ_HANJA = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const DZ_HEP = { 0:1, 1:0, 2:11, 11:2, 3:10, 10:3, 4:9, 9:4, 5:8, 8:5, 6:7, 7:6 };
const DZ_NAMES = ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai'];
const ELEM_STEMS = { Wood:[0,1], Fire:[2,3], Earth:[4,5], Metal:[6,7], Water:[8,9] };
const GOEGANG = [[6,4],[6,10],[8,4],[8,10]];
const HWAGAE = { 2:10, 6:10, 10:10,
                   6:4,  0:4,  4:4,
                   5:1,  7:1,  1:1,
                   11:8, 3:8,  8:8 };
const TG_HANJA = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const TG_NAMES = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
const YEOKMA = { 0:6, 3:6, 4:6, 7:6,   // 申(6)
                   2:9, 5:9, 6:9, 9:9,    // 亥(11) 아님 - 수정
                   1:3, 8:3, 10:3, 11:3 };
const YEOKMA_CORRECT = {
    2:6, 6:6, 10:6,   // 寅午戌 → 申(6)
    6:2, 0:2, 4:2,    // 申子辰 → 寅(2)  
    5:11, 7:11, 1:11, // 巳酉丑 → 亥(11)
    11:5, 3:5, 8:5    // 亥卯未 → 巳(5)
  };

const DZ_MAIN_TG = [9,5,0,1,4,2,3,5,6,7,4,8];
const DZ_MID_TG  = [-1,7,-1,-1,9,6,5,1,8,-1,3,-1];

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

function getMonthDZ(year, month, day, hour) {
  const data = JIEQI[year];
  if (!data) return [11,0,1,2,3,4,5,6,7,8,9,10][month-1];
  let result = 11;
  for (let i = 0; i < 12; i++) {
    const [jm, jd, jh] = data[i];
    if (month > jm || (month===jm && day > jd) || (month===jm && day===jd && hour >= jh)) {
      result = i;
    }
  }
  return JIEQI_MONTH_DZ[result];
}


// ── Timezone → KST 변환 ──────────────────────────────────
function localToKST(localDateStr, tz) {
  const [datePart, timePart] = localDateStr.split('T');
  const [yr, mo, dy] = datePart.split('-').map(Number);
  const [hr, mn]     = (timePart||'00:00:00').split(':').map(Number);

  // 입력 시각을 UTC ms로 일단 만들고
  const utcMs = Date.UTC(yr, mo-1, dy, hr, mn||0, 0);

  // 해당 timezone에서 utcMs가 어떤 로컬 시각으로 보이는지 구해서 offset 역산
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hour12: false
  });
  const parts = {};
  formatter.formatToParts(new Date(utcMs)).forEach(({type,value}) => {
    if (type !== 'literal') parts[type] = Number(value);
  });
  const localMs = Date.UTC(parts.year, parts.month-1, parts.day, parts.hour, parts.minute);
  const offsetMs = localMs - utcMs;

  // 실제 입력 로컬 시각 → UTC 역산 → KST(+9h)
  const inputLocalMs = Date.UTC(yr, mo-1, dy, hr, mn||0);
  const actualUtcMs  = inputLocalMs - offsetMs;
  const kstMs        = actualUtcMs + 9 * 3600000;
  const kd           = new Date(kstMs);

  return {
    year:   kd.getUTCFullYear(),
    month:  kd.getUTCMonth() + 1,
    day:    kd.getUTCDate(),
    hour:   kd.getUTCHours(),
    minute: kd.getUTCMinutes(),
    utcMs:  actualUtcMs,
    kstMs
  };
}

function formatKSTDisplay(kst) {
  const pad = n => String(n).padStart(2, '0');
  return `${kst.year}.${pad(kst.month)}.${pad(kst.day)} ${pad(kst.hour)}:${pad(kst.minute)} KST`;
}

function calcSaju(year, month, day, hour, minute, useTrueSolarTime, longitude) {
  // ── 진태양시 보정 (옵션)
  let adjHour = hour, adjMinute = minute || 0;
  if (useTrueSolarTime && longitude != null) {
    // KST 기준경도(135°E)와 출생지 경도 차이 → 분 단위 보정 (1도=4분)
    const offsetMin = Math.round((longitude - 135) * 4);
    const totalMin  = adjHour * 60 + adjMinute + offsetMin;
    adjHour   = ((Math.floor(totalMin / 60)) % 24 + 24) % 24;
    adjMinute = ((totalMin % 60) + 60) % 60;
  }

  // ── 년주 (입춘 기준)
  const lichun = JIEQI[year] ? JIEQI[year][1] : [2,4,0];
  const [lm,ld,lh] = lichun;
  const beforeLichun = month < lm || (month===lm && day < ld) || (month===lm && day===ld && adjHour < lh);
  const actualYear = beforeLichun ? year-1 : year;
  const yrTG = ((actualYear-4)%10+10)%10;
  const yrDZ = ((actualYear-4)%12+12)%12;

  // ── 월주 (절기 기준, 진태양시 적용 시각 사용)
  const monthDZ = getMonthDZ(year, month, day, adjHour);
  const monthTGBase = [2,4,6,8,10,2,4,6,8,10][yrTG];
  const dzToOffset  = {2:0,3:1,4:2,5:3,6:4,7:5,8:6,9:7,10:8,11:9,0:10,1:11};
  const monthTG = (monthTGBase + dzToOffset[monthDZ]) % 10;

  // ── 일주
  const delta = Math.round((new Date(year,month-1,day) - new Date(2000,0,1)) / 86400000);
  const dayTG = ((4+delta)%10+10)%10;
  const dayDZ = ((6+delta)%12+12)%12;

  // ── 시주 (진태양시 적용 시각 기준)
  const hourDZ = Math.floor((adjHour+1)/2)%12;
  const hourTGBase = [0,2,4,6,8,0,2,4,6,8][dayTG];
  const hourTG = (hourTGBase + hourDZ) % 10;

  const pillars = [[yrTG,yrDZ],[monthTG,monthDZ],[dayTG,dayDZ],[hourTG,hourDZ]];

  // ── 지장간 여기 천간 인덱스 (초기 기운)
  // 子壬,丑癸,寅戊,卯甲,辰乙,巳戊,午丙,未丁,申戊,酉庚,戌辛,亥戊
  const DZ_FIRST = [8,9,4,0,1,4,2,3,4,6,7,4];

  // ── 오행 점수 계산 (가중치 반영)
  // 천간 1.0 / 지지 0.5 / 지장간 정기 1.0 / 중기 0.5 / 여기 0.3
  const elemScore = {Wood:0,Fire:0,Earth:0,Metal:0,Water:0};
  pillars.forEach(([tg,dz]) => {
    elemScore[TG_ELEM[tg]]       += 1.0;
    elemScore[DZ_ELEM[dz]]       += 0.5;
    if (DZ_MAIN_TG[dz]  >= 0) elemScore[TG_ELEM[DZ_MAIN_TG[dz]]]  += 1.0;
    if (DZ_MID_TG[dz]   >= 0) elemScore[TG_ELEM[DZ_MID_TG[dz]]]   += 0.5;
    if (DZ_FIRST[dz]    >= 0) elemScore[TG_ELEM[DZ_FIRST[dz]]]     += 0.3;
  });

  // ── 월령 가중치: 월지 오행이 일간과 같으면 ×1.5, 생해주면 ×1.2
  const monthElem = DZ_ELEM[monthDZ];
  const dayElem   = TG_ELEM[dayTG];
  const generates = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const monthBoost = monthElem === dayElem ? 1.5 : generates[monthElem] === dayElem ? 1.2 : 1.0;
  if (monthBoost > 1.0) elemScore[monthElem] *= monthBoost;

  // ── 계절 & 조후 (월지 기준)
  const seasonMap = {2:'Spring',3:'Spring',4:'Spring',5:'Summer',6:'Summer',7:'Summer',
                     8:'Autumn',9:'Autumn',10:'Autumn',11:'Winter',0:'Winter',1:'Winter'};
  const season = seasonMap[monthDZ];
  const johuNeeds = {
    Spring: {need:['Metal','Water'], avoid:['Wood']},
    Summer: {need:['Water','Metal'], avoid:['Fire']},
    Autumn: {need:['Fire','Water'],  avoid:['Metal']},
    Winter: {need:['Fire','Wood'],   avoid:['Water']}
  };
  const johu = johuNeeds[season];

  // ── 신강/신약 판정 (일간 기준)
  // 일간을 돕는 오행: 비겁(같은 오행) + 인성(일간을 생하는 오행)
  const supports = {Wood:'Water',Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal'};
  const inSungElem = supports[dayElem];
  let strengthScore = 0;
  pillars.forEach(([tg,dz],idx) => {
    if (idx === 2) return; // 일주 자체 제외
    // 천간
    if (TG_ELEM[tg] === dayElem)    strengthScore += 1.0;
    if (TG_ELEM[tg] === inSungElem) strengthScore += 0.8;
    // 지지
    if (DZ_ELEM[dz] === dayElem)    strengthScore += 0.5;
    if (DZ_ELEM[dz] === inSungElem) strengthScore += 0.4;
    // 지장간 정기
    if (DZ_MAIN_TG[dz]>=0) {
      const me = TG_ELEM[DZ_MAIN_TG[dz]];
      if (me === dayElem)    strengthScore += 0.8;
      if (me === inSungElem) strengthScore += 0.6;
    }
  });
  // 월령 득령 여부 (월지가 일간에 도움)
  const monthHelps = DZ_ELEM[monthDZ]===dayElem || DZ_ELEM[monthDZ]===inSungElem
                  || TG_ELEM[DZ_MAIN_TG[monthDZ]>=0?DZ_MAIN_TG[monthDZ]:0]===dayElem;
  if (monthHelps) strengthScore *= 1.3; // 득령 가중

  const strengthLabel = strengthScore >= 6   ? 'Very Strong (강왕)'
                      : strengthScore >= 4   ? 'Strong (신강)'
                      : strengthScore >= 2.5 ? 'Moderate (중화)'
                      : strengthScore >= 1.5 ? 'Weak (신약)'
                      : 'Very Weak (극약)';
  const isStrong = strengthScore >= 3.5;

  // ── 정수 카운트 (UI 색상용)
  const elemCount = {Wood:0,Fire:0,Earth:0,Metal:0,Water:0};
  pillars.forEach(([tg,dz]) => {
    elemCount[TG_ELEM[tg]]++;
    elemCount[DZ_ELEM[dz]]++;
    if (DZ_MAIN_TG[dz]>=0) elemCount[TG_ELEM[DZ_MAIN_TG[dz]]]++;
  });
  const sortedScore = Object.entries(elemScore).sort((a,b)=>a[1]-b[1]);
  const missing  = Object.entries(elemCount).filter(([,v])=>v===0).map(([k])=>k);
  const dominant = sortedScore[sortedScore.length-1][0];

  return {
    yrTG,yrDZ,monthTG,monthDZ,dayTG,dayDZ,hourTG,hourDZ,
    pillars, elemCount, elemScore, missing, dominant,
    season, johu, isStrong, strengthLabel, strengthScore,
    adjHour, adjMinute
  };
}


function getPrompts(BIRTH, chartSummary) {
// ─── Prompts ─────────────────────────────────────────────
// BIRTH already passed in 

const PROMPT_STEP1 = `You are an expert Korean Four Pillars of Destiny (Saju) master and narrative director.

Your job is to: (1) accurately calculate the chart, and (2) lock in ONE consistent interpretation that will guide the entire report. Every downstream section must agree with this foundation — no contradictions allowed.

CALCULATED FOUR PILLARS (절기 기준, pre-computed — DO NOT recalculate):
${chartSummary.fourPillars}

Five Elements (天干+地支+地藏干 정기 count):
${chartSummary.elemStr}

Hidden Stems (지장간):
${chartSummary.hiddenStems}

Self Element: ${chartSummary.dayMasterStr}
Missing Element(s): ${chartSummary.missing.length ? chartSummary.missing.join(', ') : 'None'}
Dominant Element: ${chartSummary.dominant}
Wealth Element: ${chartSummary.wealthElem}
Self Element Strength: ${chartSummary.strengthMsg}
Seasonal Balance (조후): ${chartSummary.johuMsg}

Client: ${BIRTH.name} | Gender: ${BIRTH.gender} | Born: ${BIRTH.date} ${BIRTH.time} (KST)

IMPORTANT: The Four Pillars above are FINAL and correct. Do NOT re-derive or second-guess them.
Your job is ONLY to interpret them and return ONLY valid JSON (no markdown, no explanation):

{
  "archetypeIcon": "<single emoji>",
  "archetypeName": "<poetic 3-5 word archetype, e.g. 'The Unyielding Pioneer'>",
  "dayMaster": "<Self Element in plain English, e.g. 'Yang Wood (Great Tree)'>",
  "elements": [
    {"emoji":"🌳","name":"Wood","colorVar":"wood","missing":<true if Wood count=0>,"count":<from Five Elements above>},
    {"emoji":"🔥","name":"Fire","colorVar":"fire","missing":<true if Fire count=0>,"count":<from Five Elements above>},
    {"emoji":"🌍","name":"Earth","colorVar":"gold","missing":<true if Earth count=0>,"count":<from Five Elements above>},
    {"emoji":"⚔️","name":"Metal","colorVar":"metal","missing":<true if Metal count=0>,"count":<from Five Elements above>},
    {"emoji":"💧","name":"Water","colorVar":"water","missing":<true if Water count=0>,"count":<from Five Elements above>}
  ],
  "missingElement": "<copy from Missing Element(s) above>",
  "dominantElement": "<copy from Dominant Element above>",
  "notableEnergies": ["<energy 1 plain English>","<energy 2>","<energy 3>"],
  "vaults": [
    {"label":"Vault 1","char":"<Chinese char>","name":"<romanized>"},
    {"label":"Vault 2","char":"<Chinese char>","name":"<romanized>"},
    {"label":"Vault 3","char":"<Chinese char>","name":"<romanized>"}
  ],
  "narrativeAnchors": {
    "coreStrength": "<1 sentence: what makes this person powerful — used consistently in sections 1, 4, 5>",
    "coreTension": "<1 sentence: their fundamental internal conflict — used in section 3>",
    "missingElementEffect": "<1 sentence: how the missing element shows up in daily life — used in section 2>",
    "wealthPattern": "<1 sentence: their wealth behavior — conservative/aggressive/volatile etc — used in section 7>",
    "idealPartner": "<1 sentence: what element/energy type they need in relationships — used in section 8>",
    "careerDirection": "<1 sentence: environments where they thrive — used in section 6>",
    "luckyDirection": "<compass direction: North/South/East/West/Northeast etc>",
    "luckyColors": "<2 colors tied to their missing/needed element>",
    "luckyNumbers": "<2 numbers>"
  }
}

Fill element counts accurately. Set missing:true for any element with count 0.

CRITICAL JSON RULES:
- Return ONLY the raw JSON object, no markdown, no backticks, no explanation
- All string values must use double quotes only
- Do NOT use apostrophes or single quotes inside string values, rephrase instead
- Do NOT include newlines inside string values, keep each value on one line
- No trailing commas`;

const PROMPT_STEP2 = (step1) => `You are a warm, expert Saju Blueprint writer. You MUST follow the narrative anchors below exactly — do not reinterpret or contradict them.

LOCKED NARRATIVE ANCHORS (do not deviate):
- Core Strength: ${g(step1,'narrativeAnchors','coreStrength')}
- Core Tension: ${g(step1,'narrativeAnchors','coreTension')}
- Missing Element Effect: ${g(step1,'narrativeAnchors','missingElementEffect')}
- Career Direction: ${g(step1,'narrativeAnchors','careerDirection')}

Chart facts (pre-computed, authoritative):
${chartSummary.fourPillars}
- Name: ${BIRTH.name} | Self Element: ${chartSummary.dayMasterStr}
- Missing: ${chartSummary.missing.join(', ')||'None'} | Dominant: ${chartSummary.dominant}
- Archetype: ${step1.archetypeName} | Notable Energies: ${(step1.notableEnergies||[]).join(', ')}

Write Sections 1–4. Return ONLY valid JSON, no markdown:

{
  "s1": {
    "icon": "<emoji>",
    "title": "The Core Identity",
    "subtitle": "<poetic subtitle>",
    "card1Title": "<title>", "card1Body": "<~70 words, open with a striking metaphor, reference the Core Strength anchor>",
    "card2Title": "<title>", "card2Body": "<~70 words, explain dominant element's effect on personality>",
    "card3Title": "<title>", "card3Body": "<~60 words, life pattern insight>",
    "adviceBody": "<~60 words, practical life advice tied to their chart structure>"
  },
  "s2": {
    "icon": "<emoji>",
    "title": "The Missing Link",
    "subtitle": "<subtitle naming the missing element>",
    "card1Title": "<title>", "card1Body": "<~70 words, use the Missing Element Effect anchor verbatim in spirit>",
    "card2Title": "<title>", "card2Body": "<~80 words, 3 concrete daily tips to invite this element, use <strong> tags>",
    "card3Title": "<title>", "card3Body": "<~60 words, reframe the lack as latent strength>"
  },
  "s3": {
    "icon": "<emoji>",
    "title": "The Struggle They Know Too Well",
    "subtitle": "<subtitle — validate their main tension>",
    "card1Title": "<title>", "card1Body": "<~70 words, use Core Tension anchor — make them feel deeply seen>",
    "card2Title": "<title>", "card2Body": "<~70 words, reframe: why this struggle is part of their design>",
    "card3Title": "<title>", "card3Body": "<~60 words, end with a perspective shift and encouragement>"
  },
  "s4": {
    "icon": "<emoji>",
    "title": "Shadow Work",
    "subtitle": "<subtitle — the blind spot>",
    "card1Title": "<title>", "card1Body": "<~70 words, name the shadow pattern honestly but kindly>",
    "card2Title": "<title>", "card2Body": "<~70 words, show how this shadow links to their tension>",
    "card3Title": "<title>", "card3Body": "<~60 words, reframe shadow as hidden power, encourage>"
  }
}

CRITICAL JSON RULES:
- Return ONLY the raw JSON object — no markdown, no backticks, no explanation
- All string values must use double quotes only
- Do NOT use apostrophes or single quotes inside string values — rephrase to avoid them
- Do NOT include newlines inside string values — one line per value
- No trailing commas

WRITING STYLE — CRITICAL:
- Address the reader directly as "You" — second person throughout
- Never refer to them by name or in third person (not "Seokil is..." but "You are...")
- Tone: like a trusted cosmic guide speaking directly to their soul
- No Korean/Chinese terms. Warm, intimate tone.`;

const PROMPT_STEP3 = (step1) => `You are a warm, expert Saju Blueprint writer. You MUST follow the narrative anchors below exactly — do not reinterpret or contradict them.

LOCKED NARRATIVE ANCHORS (do not deviate):
- Core Strength: ${g(step1,'narrativeAnchors','coreStrength')}
- Wealth Pattern: ${g(step1,'narrativeAnchors','wealthPattern')}
- Ideal Partner: ${g(step1,'narrativeAnchors','idealPartner')}
- Career Direction: ${g(step1,'narrativeAnchors','careerDirection')}
- Lucky Direction: ${g(step1,'narrativeAnchors','luckyDirection')}
- Lucky Colors: ${g(step1,'narrativeAnchors','luckyColors')}
- Lucky Numbers: ${g(step1,'narrativeAnchors','luckyNumbers')}

Chart facts (pre-computed, authoritative):
${chartSummary.fourPillars}
- Name: ${BIRTH.name} | Self Element: ${chartSummary.dayMasterStr}
- Missing: ${chartSummary.missing.join(', ')||'None'} | Dominant: ${chartSummary.dominant}
- Vaults: ${chartSummary.vaults.map(v=>v.name).join(', ')}
- Notable Energies: ${(step1.notableEnergies||[]).join(', ')}

Write Sections 5–9 plus closing quote. Return ONLY valid JSON, no markdown:

{
  "s5": {
    "icon": "<emoji>",
    "title": "Recognition",
    "subtitle": "<subtitle celebrating resilience>",
    "card1Title": "<title>", "card1Body": "<~80 words, celebrate what they've survived, reference Core Strength>",
    "card2Title": "<title>", "card2Body": "<~70 words, their natural leadership gifts, end with encouragement>"
  },
  "s6": {
    "icon": "<emoji>",
    "title": "Career Path",
    "subtitle": "<subtitle>",
    "card1Title": "<title>", "card1Body": "<~80 words, 3-4 specific industries/roles — MUST align with Career Direction anchor>",
    "card2Title": "<title>", "card2Body": "<~70 words, practical career strategy — credential-first vs jump-in, based on their chart>"
  },
  "s7": {
    "icon": "<emoji>",
    "title": "Wealth Management",
    "subtitle": "<subtitle about their wealth vaults>",
    "card1Title": "<title>", "card1Body": "<~70 words, wealth risk — MUST align with Wealth Pattern anchor>",
    "card2Title": "<title>", "card2Body": "<~70 words, wealth strategy — MUST align with Wealth Pattern anchor>"
  },
  "s8": {
    "icon": "<emoji>",
    "title": "Relationships",
    "subtitle": "<subtitle>",
    "card1Title": "<title>", "card1Body": "<~70 words, their relationship patterns — challenges they commonly face>",
    "card2Title": "<title>", "card2Body": "<~70 words, ideal partner energy — MUST use Ideal Partner anchor, be specific>"
  },
  "s9": {
    "icon": "⭐",
    "title": "Lucky Prescriptions",
    "subtitle": "Your Blueprint for Luck",
    "rxItems": [
      {"icon":"🗺","title":"Geography","body":"<where to live — water-adjacent if missing Water, mountain if missing Wood, etc>"},
      {"icon":"🧭","title":"Direction","body":"<use Lucky Direction anchor exactly, explain why this direction>"},
      {"icon":"🎨","title":"Colors & Numbers","body":"<use Lucky Colors and Lucky Numbers anchors exactly>"},
      {"icon":"🏊","title":"Activities","body":"<activities that recharge their specific missing element energy>"}
    ]
  },
  "closingQuote": "<one powerful poetic sentence, 20-30 words, personalized to their Self Element and archetype>"
}

CRITICAL JSON RULES:
- Return ONLY the raw JSON object — no markdown, no backticks, no explanation
- All string values must use double quotes only
- Do NOT use apostrophes or single quotes inside string values — rephrase to avoid them
- Do NOT include newlines inside string values — one line per value
- No trailing commas

WRITING STYLE — CRITICAL:
- Address the reader directly as "You" — second person throughout
- Never refer to them by name or in third person (not "Seokil is..." but "You are...")
- Tone: like a trusted cosmic guide speaking directly to their soul
- No Korean/Chinese terms. Warm tone.`;
  return { PROMPT_STEP1, PROMPT_STEP2, PROMPT_STEP3 };
}


// ══════════════════════════════════════════════════════════
// 십성 계산 v3 - 가중치 누적 + 조합 분석 + 문장 생성
// ══════════════════════════════════════════════════════════

// 지장간 완전 테이블 (본기 → 중기 → 여기)
const JIJANGGAN_FULL = {
  0:  [{s:9,w:1.0}],
  1:  [{s:5,w:1.0},{s:9,w:0.6},{s:7,w:0.3}],
  2:  [{s:0,w:1.0},{s:2,w:0.3},{s:4,w:0.2}],
  3:  [{s:1,w:1.0}],
  4:  [{s:4,w:1.0},{s:1,w:0.6},{s:9,w:0.3}],
  5:  [{s:2,w:1.0},{s:4,w:0.6},{s:6,w:0.3}],
  6:  [{s:3,w:1.0},{s:5,w:0.3}],
  7:  [{s:5,w:1.0},{s:1,w:0.6},{s:3,w:0.3}],
  8:  [{s:6,w:1.0},{s:8,w:0.6},{s:4,w:0.3}],
  9:  [{s:7,w:1.0}],
  10: [{s:4,w:1.0},{s:7,w:0.6},{s:3,w:0.3}],
  11: [{s:8,w:1.0},{s:0,w:0.3}]
};

// 십성 계산
function getTenGod(dayTG, targetTG) {
  if (dayTG === targetTG) return '비견';
  const dE = TG_ELEM[dayTG], dY = TG_YY[dayTG];
  const tE = TG_ELEM[targetTG], tY = TG_YY[targetTG];
  const gen   = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const ctrl  = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const genBy = {Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
  const ctrlBy= {Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
  if (tE===dE)         return tY===dY ? 'Self-Expansion Drive (비견)' : 'Competitive Capital (겁재)';
  if (gen[dE]===tE)    return tY===dY ? 'Creative Output (식신)' : 'Disruptive Expression (상관)';
  if (ctrl[dE]===tE)   return tY!==dY ? 'Structured Income (정재)' : 'Opportunistic Wealth (편재)';
  if (ctrlBy[dE]===tE) return tY!==dY ? 'Authority Structure' : 'Power Challenge';
  if (genBy[dE]===tE)  return tY!==dY ? 'Structured Support (정인)' : 'Independent Intelligence (편인)';
  return '비견';
}

function getLevel(score) {
  if (score === 0)   return '결핍';
  if (score <= 1.0)  return '약';
  if (score < 2.5)   return '보통';
  return '과다';
}

// 기질 키워드 테이블
const TG_TRAITS = {
  '비견': { core:'자기주도·독립심',   excess:'고집·경쟁심 과도, 돈 주변에 새나감', lack:'자기주장 약함, 타인 의존적' },
  '겁재': { core:'추진력·승부욕',     excess:'충동적 지출, 동업 배신 리스크',      lack:'경쟁 회피, 의욕 저하' },
  '식신': { core:'표현력·여유로움',   excess:'먹고 즐기는 성향, 현실 안주',        lack:'감정 억제, 표현 막힘' },
  '상관': { core:'창의성·반항기질',   excess:'말로 사고 냄, 권위와 충돌',          lack:'답답함, 창의력 막혀 있음' },
  '정재': { core:'성실·현실 감각',    excess:'소심·집착, 큰 도전 못함',            lack:'재물 관리 어려움, 흐지부지' },
  '편재': { core:'사업 감각·대범함',  excess:'투기 성향, 이성 문제 발생',          lack:'돈 기회 지나침, 현실 안주' },
  '정관': { core:'책임감·원칙 준수',  excess:'자기검열 심함, 윗사람 스트레스',     lack:'조직 생활 답답함, 규칙 거부' },
  '편관': { core:'카리스마·강한 실행',excess:'공격성, 극단적 상황 유발',           lack:'추진력 부족, 눈치 봄' },
  '정인': { core:'공부·안정 추구',    excess:'의존적, 행동력 약함, 소극적',        lack:'집중력 부족, 끈기 없음' },
  '편인': { core:'직관·독창적 발상',  excess:'변덕, 고립감, 시작만 하고 안 끝냄', lack:'영감 부족, 틀에 박힘' },
};

// 조합 패턴 테이블
const COMBO_RULES = [
  { keys:['상관','정관'], label:'권위 충돌형',
    effect:'창의력과 규칙이 충돌. 조직 안에서 답답함을 느끼고 상사와 마찰.',
    career:'기획·예술·프리랜서·창업', risk:'직장 수명 짧음, 말실수로 관계 손상' },
  { keys:['비견','편재'], label:'리스크 투자형',
    effect:'돈 벌면 주변에 나가거나 큰 판에 베팅. 동업 시 배신 리스크.',
    career:'영업·투자·사업', risk:'동업 손실, 지인 보증 주의' },
  { keys:['비견','정재'], label:'자수성가형',
    effect:'혼자 성실하게 쌓아가는 스타일. 나눔이 어렵고 고집으로 기회 놓침.',
    career:'전문직·기술직·자영업', risk:'협업 어려움, 고집으로 타이밍 놓침' },
  { keys:['정인','정관'], label:'공부형 안정 추구',
    effect:'체계와 안정을 원함. 공무원·대기업 적성. 변화에 느리게 반응.',
    career:'공무원·대기업·교육·법조', risk:'변화 적응 느림, 기회비용 큼' },
  { keys:['식신','편재'], label:'사업가형',
    effect:'아이디어로 돈 버는 구조. 콘텐츠·요식업·서비스업 잘 맞음.',
    career:'사업·콘텐츠·요식업·서비스', risk:'계획 없이 벌이기, 지속성 약함' },
  { keys:['편관','상관'], label:'강인한 파워형',
    effect:'강한 의지와 반항기질. 목표를 향해 돌진. 인간관계 소모 큼.',
    career:'군인·검사·스포츠·경찰', risk:'인간관계 손실, 번아웃' },
  { keys:['편인','상관'], label:'예술가형',
    effect:'독창적 표현과 직관. 대중과 파장 맞으면 큰 성공.',
    career:'예술·글·미디어·연구', risk:'경제적 불안정, 기복 심함' },
  { keys:['겁재','편재'], label:'한방형 투자가',
    effect:'큰 판에서 승부. 성공하면 크게 벌지만 잃을 때도 큼.',
    career:'사업·투자·금융', risk:'빚 리스크, 충동 투자' },
];

// ── 메인 함수 ──────────────────────────────────────────
function calcSipseongV3(pillars, dayTG) {
  const visible = {};  // 천간 점수
  const hidden  = {};  // 지장간 점수
  const total   = {};  // 합산
  const ALL = ['비견','겁재','식신','상관','정재','편재','정관','편관','정인','편인'];
  ALL.forEach(g => { visible[g]=0; hidden[g]=0; total[g]=0; });

  const DZ_CHUNG = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
  const branches = pillars.map(p=>p[1]);

  // 충 맞은 지지 인덱스 세트
  const clashedIdx = new Set();
  branches.forEach((b,i) => {
    branches.forEach((b2,j) => {
      if (i>=j) return;
      if (DZ_CHUNG[b]===b2) { clashedIdx.add(i); clashedIdx.add(j); }
    });
  });

  // 영문→한글 십성 이름 정규화 (전역 getTenGod가 영문 반환하는 경우 대응)
  const EN_TO_KR = {
    'Self-Expansion Drive (비견)': '비견',
    'Competitive Capital (겁재)': '겁재',
    'Creative Output (식신)': '식신',
    'Disruptive Expression (상관)': '상관',
    'Structured Income (정재)': '정재',
    'Opportunistic Wealth (편재)': '편재',
    'Authority Structure': 'Authority Structure',
    'Power Challenge': 'Power Challenge',
    'Structured Support (정인)': '정인',
    'Independent Intelligence (편인)': '편인',
    'Bigyeo (비겁)': '비견', 'Geobjaae (겁재)': '겁재',
    'Sikshin (식신)': '식신', 'Sanggwan (상관)': '상관',
    'Jeongjae (정재)': '정재', 'Pyeonjae (편재)': '편재',
    'Jeonggwan (정관)': '정관', 'Pyeongwan (편관/칠살)': '편관',
    'Jeongin (정인)': '정인', 'Pyeonin (편인/효신)': '편인',
  };
  const normGod = (g) => EN_TO_KR[g] || g;

  pillars.forEach(([tg, dz], idx) => {
    const isMonth = idx===1, isDay = idx===2, isClashed = clashedIdx.has(idx);
    const clashPenalty = isClashed ? 0.7 : 1.0;  // 충 맞으면 30% 감소
    const monthBonus   = isMonth   ? 1.5 : 1.0;

    // 천간 (일간 자신 제외)
    if (idx !== 2) {
      const god = normGod(getTenGod(dayTG, tg));
      const w = 1.0 * clashPenalty;
      visible[god] += w;
      total[god]   += w;
    }

    // 지장간
    const jjg = JIJANGGAN_FULL[dz] || [];
    jjg.forEach(({s, w}, rank) => {
      const god = normGod(getTenGod(dayTG, s));
      // 본기=0.8, 중기=0.5, 여기=0.2 (w 비례)
      const baseW = w===1.0 ? 0.8 : w===0.6 ? 0.5 : 0.2;
      const finalW = baseW * monthBonus * clashPenalty;
      hidden[god] += finalW;
      total[god]  += finalW;
    });
  });

  // 소수점 1자리 반올림
  ALL.forEach(g => {
    visible[g] = Math.round(visible[g]*10)/10;
    hidden[g]  = Math.round(hidden[g]*10)/10;
    total[g]   = Math.round(total[g]*10)/10;
  });

  // 레벨 + 정렬
  const ranked = ALL.map(g => ({
    god:g, visible:visible[g], hidden:hidden[g], total:total[g],
    level: getLevel(total[g])
  })).sort((a,b)=>b.total-a.total);

  const top3      = ranked.filter(g=>g.total>0).slice(0,3);
  const deficient = ranked.filter(g=>g.total===0).map(g=>g.god);
  const top3Names = top3.map(g=>g.god);

  // 조합 분석
  const combos = COMBO_RULES.filter(r => r.keys.every(k=>top3Names.includes(k)));

  // 일지 전용 십성 (배우자궁)
  const dayDZ = pillars[2][1];
  const dayPalacePrimary = getTenGod(dayTG, (JIJANGGAN_FULL[dayDZ]||[])[0]?.s ?? dayTG);
  const dayPalaceGod = JIJANGGAN_FULL[dayDZ]?.[0]
    ? getTenGod(dayTG, JIJANGGAN_FULL[dayDZ][0].s) : null;

  // 월지 전용 십성 (직업/사회성)
  const monthDZ = pillars[1][1];
  const monthPalaceGod = JIJANGGAN_FULL[monthDZ]?.[0]
    ? getTenGod(dayTG, JIJANGGAN_FULL[monthDZ][0].s) : null;

  // 비겁 과다 경고
  const bigyeobTotal = total['비견'] + total['겁재'];
  const gwanTotal    = total['정관'] + total['편관'];
  const jaeTotal     = total['정재'] + total['편재'];

  // ── 프롬프트 주입용 문자열 생성 ──────────────────────────

  // 상위 3개
  const top3Str = top3.map(g =>
    `${g.god}(total:${g.total}, level:${g.level}) -- ${TG_TRAITS[g.god]?.core}`
  ).join(' | ');

  // 결핍
  const defStr = deficient.length > 0
    ? deficient.map(g => `${g}: ${TG_TRAITS[g]?.lack}`).join(' | ')
    : 'None';

  // 과다 경고
  const excessStr = ranked.filter(g=>g.level==='과다')
    .map(g=>`${g.god} EXCESS(${g.total}): ${TG_TRAITS[g.god]?.excess}`).join(' | ') || 'None';

  // 조합 패턴
  const comboStr = combos.length > 0
    ? combos.map(c=>`[${c.label}] ${c.effect} Career:${c.career} Risk:${c.risk}`).join(' || ')
    : 'No major combination pattern';

  // 일지/월지
  const dayPalaceStr = dayPalaceGod
    ? `Day Palace (배우자궁): ${dayPalaceGod} -- ${TG_TRAITS[dayPalaceGod]?.core} (relationship tendency)`
    : 'Day Palace: neutral';
  const monthPalaceStr = monthPalaceGod
    ? `Month Palace (직업궁): ${monthPalaceGod} -- ${TG_TRAITS[monthPalaceGod]?.core} (career/social tendency)`
    : 'Month Palace: neutral';

  // 재물 분석
  const wealthStr = bigyeobTotal >= 2.5
    ? `BIGYEOB EXCESS(${bigyeobTotal}): wealth leaks to others, partnership risk -- Wealth stars: ${jaeTotal.toFixed(1)}`
    : `Wealth stars(재성): ${jaeTotal.toFixed(1)} -- ${getLevel(jaeTotal)}`;

  // 관성 분석
  const gwanStr = gwanTotal === 0
    ? 'No Gwan star (관성 없음): hates being controlled, better as own boss, struggles in rigid org'
    : gwanTotal >= 2.5
    ? `Gwan EXCESS(${gwanTotal}): over-responsible, heavy self-criticism, authority stress`
    : `Gwan present(${gwanTotal}): career ambition, structure-seeking`;

  return {
    visible, hidden, total, ranked, top3, deficient, combos,
    summary: {
      top3Str, defStr, excessStr, comboStr,
      dayPalaceStr, monthPalaceStr, wealthStr, gwanStr
    }
  };
}



// ══════════════════════════════════════════════════════════
// 합충형파해 계산 v2 - 가중치 + 해석 문장 생성
// (한자 용어 없이 영어로 풀어씀)
// ══════════════════════════════════════════════════════════

// ── 기본 테이블 ────────────────────────────────────────────

// 천간합 (Heavenly Stem Combines)
// 갑기합土, 을경합金, 병신합水, 정임합木, 무계합火
const STEM_COMBINES = [
  {pair:[0,5], result:'Earth', label:'Wood-Earth merge'},
  {pair:[1,6], result:'Metal', label:'Wood-Metal merge'},
  {pair:[2,7], result:'Water', label:'Fire-Metal merge'},
  {pair:[3,8], result:'Wood',  label:'Fire-Water merge'},
  {pair:[4,9], result:'Fire',  label:'Earth-Water merge'},
];

// 지지충 (Branch Clash) — 6충
const BRANCH_CLASHES = [
  {pair:[0,6],  label:'Rat-Horse clash',     elem:['Water','Fire'],  effect:'emotional volatility, instability in relationships or career'},
  {pair:[1,7],  label:'Ox-Goat clash',       elem:['Earth','Earth'], effect:'conflicting responsibilities, health and financial friction'},
  {pair:[2,8],  label:'Tiger-Monkey clash',  elem:['Wood','Metal'],  effect:'sudden changes, accidents, disruptions to plans'},
  {pair:[3,9],  label:'Rabbit-Rooster clash',elem:['Wood','Metal'],  effect:'legal issues, hidden enemies, relationship breakdowns'},
  {pair:[4,10], label:'Dragon-Dog clash',    elem:['Earth','Earth'], effect:'obstacles in wealth accumulation, emotional turbulence'},
  {pair:[5,11], label:'Snake-Pig clash',     elem:['Fire','Water'],  effect:'health vulnerabilities, unstable partnerships'},
];

// 지지합 (Branch Combines) — 6합
const BRANCH_COMBINES = [
  {pair:[0,1],  result:'Earth', label:'Rat-Ox combine',     effect:'stable foundation, reliable partnerships'},
  {pair:[2,11], result:'Wood',  label:'Tiger-Pig combine',  effect:'creative momentum, helpful connections'},
  {pair:[3,10], result:'Fire',  label:'Rabbit-Dog combine', effect:'harmonious relationships, artistic expression'},
  {pair:[4,9],  result:'Metal', label:'Dragon-Rooster combine', effect:'precision and structure, career advancement'},
  {pair:[5,8],  result:'Water', label:'Snake-Monkey combine',  effect:'intelligence and adaptability, fluid opportunities'},
  {pair:[6,7],  result:'Fire',  label:'Horse-Goat combine', effect:'passion and warmth, strong interpersonal bonds'},
];

// 삼합 (Triple Harmony) — 사건 매핑 중 가장 강력
const TRIPLE_HARMONIES = [
  {group:[2,6,10],  result:'Fire',  label:'Tiger-Horse-Dog Fire triangle',
   effect:'intense drive, passionate life chapters, leadership and recognition phases'},
  {group:[5,9,1],   result:'Metal', label:'Snake-Rooster-Ox Metal triangle',
   effect:'precision focus, discipline cycles, financial consolidation'},
  {group:[8,0,4],   result:'Water', label:'Monkey-Rat-Dragon Water triangle',
   effect:'intellectual depth, strategic planning, major opportunity windows'},
  {group:[11,3,7],  result:'Wood',  label:'Pig-Rabbit-Goat Wood triangle',
   effect:'growth and creativity phases, compassionate connections, healing cycles'},
];

// 방합 (Directional Combine) — 계절 삼합
const DIRECTIONAL = [
  {group:[2,3,4],  result:'Wood',  season:'Spring', label:'Spring Wood formation',
   effect:'strong growth energy, career expansion, new beginnings'},
  {group:[5,6,7],  result:'Fire',  season:'Summer', label:'Summer Fire formation',
   effect:'peak performance energy, visibility, passionate relationships'},
  {group:[8,9,10], result:'Metal', season:'Autumn', label:'Autumn Metal formation',
   effect:'harvest phase, financial consolidation, decisive action'},
  {group:[11,0,1], result:'Water', season:'Winter', label:'Winter Water formation',
   effect:'reflection and strategy, hidden preparation, spiritual depth'},
];

// 형 (Penalty) — 자형, 축술미형, 인사신형
const PENALTIES = [
  {group:[0],        label:'Self-penalty (Rat)',    effect:'self-sabotage tendency, repeating same mistakes'},
  {group:[9],        label:'Self-penalty (Rooster)', effect:'self-critical loop, perfectionism causing paralysis'},
  {group:[1,10,7],   label:'Uncivilized penalty (Ox-Dog-Goat)', effect:'relationship conflicts, bullying dynamic, authority issues'},
  {group:[2,5,8],    label:'Ungrateful penalty (Tiger-Snake-Monkey)', effect:'sudden reversals, betrayal patterns, legal trouble'},
];

// 파 (Breaking) — 子酉파, 午卯파, 巳申파, 寅亥파, 辰丑파, 戌未파
const BREAKINGS = [
  {pair:[0,9],  label:'Rat-Rooster break'},
  {pair:[6,3],  label:'Horse-Rabbit break'},
  {pair:[5,8],  label:'Snake-Monkey break'},
  {pair:[2,11], label:'Tiger-Pig break'},
  {pair:[4,1],  label:'Dragon-Ox break'},
  {pair:[10,7], label:'Dog-Goat break'},
];

// 해 (Harm) — 子未해, 丑午해, 寅巳해, 卯辰해, 申亥해, 酉戌해
const HARMS = [
  {pair:[0,7],  label:'Rat-Goat harm',       effect:'slow-burning obstacles, hidden enemies draining energy'},
  {pair:[1,6],  label:'Ox-Horse harm',        effect:'relationship strain, emotional exhaustion'},
  {pair:[2,5],  label:'Tiger-Snake harm',     effect:'competitive tension, power struggles'},
  {pair:[3,4],  label:'Rabbit-Dragon harm',   effect:'missed opportunities, frustrating near-misses'},
  {pair:[8,11], label:'Monkey-Pig harm',      effect:'financial drain, deceptive partnerships'},
  {pair:[9,10], label:'Rooster-Dog harm',     effect:'reputation risks, social friction'},
];

// ── 가중치 테이블 ──────────────────────────────────────────
// 위치별 강도 (년=0.8, 월=1.2, 일=1.5, 시=0.7)
const PILLAR_WEIGHT = [0.8, 1.2, 1.5, 0.7];
const PILLAR_NAMES  = ['Year','Month','Day','Hour'];

// 상호작용 강도
const INTERACTION_WEIGHT = {
  triple_complete:  3.0,
  triple_partial:   1.5,
  directional_complete: 2.5,
  directional_partial:  1.2,
  branch_clash:     2.0,
  branch_combine:   1.5,
  stem_combine:     1.2,
  penalty_full:     1.8,
  penalty_partial:  0.8,
  breaking:         0.6,
  harm:             0.5,
};

// ── 메인 함수 ──────────────────────────────────────────────
function calcHapChungV2(pillars) {
  const stems   = pillars.map(p=>p[0]);
  const branches= pillars.map(p=>p[1]);
  const result  = {
    stemCombines:      [],
    branchClashes:     [],
    branchCombines:    [],
    tripleHarmonies:   [],
    directionals:      [],
    penalties:         [],
    breakings:         [],
    harms:             [],
    interactions:      [],  // 모든 상호작용 평탄 리스트
    clashPenaltyMap:   {},  // 지지 인덱스 → 충 패널티 배율
    summary:           {}
  };

  // 천간합
  STEM_COMBINES.forEach(({pair, result:res, label}) => {
    const [a,b] = pair;
    stems.forEach((s1,i) => {
      stems.forEach((s2,j) => {
        if (i>=j) return;
        if ((s1===a&&s2===b)||(s1===b&&s2===a)) {
          const w = (PILLAR_WEIGHT[i]+PILLAR_WEIGHT[j])/2 * INTERACTION_WEIGHT.stem_combine;
          result.stemCombines.push({ positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, result:res, weight:w });
          result.interactions.push({ type:'Stem Combine', positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, weight:w, positive:true });
        }
      });
    });
  });

  // 지지충
  BRANCH_CLASHES.forEach(({pair, label, elem, effect}) => {
    const [a,b] = pair;
    branches.forEach((b1,i) => {
      branches.forEach((b2,j) => {
        if (i>=j) return;
        if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
          const w = (PILLAR_WEIGHT[i]+PILLAR_WEIGHT[j])/2 * INTERACTION_WEIGHT.branch_clash;
          result.branchClashes.push({ positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, elem, effect, weight:w });
          result.interactions.push({ type:'Branch Clash', positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, effect, weight:w, positive:false });
          // 충 패널티 등록
          result.clashPenaltyMap[i] = 0.7;
          result.clashPenaltyMap[j] = 0.7;
        }
      });
    });
  });

  // 지지합
  BRANCH_COMBINES.forEach(({pair, result:res, label, effect}) => {
    const [a,b] = pair;
    branches.forEach((b1,i) => {
      branches.forEach((b2,j) => {
        if (i>=j) return;
        if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
          const w = (PILLAR_WEIGHT[i]+PILLAR_WEIGHT[j])/2 * INTERACTION_WEIGHT.branch_combine;
          result.branchCombines.push({ positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, result:res, effect, weight:w });
          result.interactions.push({ type:'Branch Combine', positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, effect, weight:w, positive:true });
        }
      });
    });
  });

  // 삼합
  TRIPLE_HARMONIES.forEach(({group, result:res, label, effect}) => {
    const matched = group.filter(dz=>branches.includes(dz));
    const matchedPos = matched.map(dz=>PILLAR_NAMES[branches.indexOf(dz)]);
    if (matched.length >= 2) {
      const complete = matched.length === 3;
      const wType = complete ? INTERACTION_WEIGHT.triple_complete : INTERACTION_WEIGHT.triple_partial;
      const w = matchedPos.reduce((s,p)=>s+PILLAR_WEIGHT[PILLAR_NAMES.indexOf(p)],0)/matchedPos.length * wType;
      result.tripleHarmonies.push({ positions:matchedPos, label, result:res, effect, complete, weight:w });
      result.interactions.push({ type: complete?'Triple Harmony (complete)':'Triple Harmony (partial)', positions:matchedPos, label, effect, weight:w, positive:true });
    }
  });

  // 방합
  DIRECTIONAL.forEach(({group, result:res, season, label, effect}) => {
    const matched = group.filter(dz=>branches.includes(dz));
    const matchedPos = matched.map(dz=>PILLAR_NAMES[branches.indexOf(dz)]);
    if (matched.length >= 2) {
      const complete = matched.length === 3;
      const wType = complete ? INTERACTION_WEIGHT.directional_complete : INTERACTION_WEIGHT.directional_partial;
      const w = matchedPos.reduce((s,p)=>s+PILLAR_WEIGHT[PILLAR_NAMES.indexOf(p)],0)/matchedPos.length * wType;
      result.directionals.push({ positions:matchedPos, label, result:res, season, effect, complete, weight:w });
      result.interactions.push({ type: complete?'Directional (complete)':'Directional (partial)', positions:matchedPos, label, effect, weight:w, positive:true });
    }
  });

  // 형
  PENALTIES.forEach(({group, label, effect}) => {
    const matched = group.filter(dz=>branches.includes(dz));
    if (matched.length === group.length) {
      const matchedPos = matched.map(dz=>PILLAR_NAMES[branches.indexOf(dz)]);
      const w = matchedPos.reduce((s,p)=>s+PILLAR_WEIGHT[PILLAR_NAMES.indexOf(p)],0)/matchedPos.length * INTERACTION_WEIGHT.penalty_full;
      result.penalties.push({ positions:matchedPos, label, effect, weight:w });
      result.interactions.push({ type:'Penalty', positions:matchedPos, label, effect, weight:w, positive:false });
    } else if (group.length>1 && matched.length===group.length-1) {
      const matchedPos = matched.map(dz=>PILLAR_NAMES[branches.indexOf(dz)]);
      const w = matchedPos.reduce((s,p)=>s+PILLAR_WEIGHT[PILLAR_NAMES.indexOf(p)],0)/matchedPos.length * INTERACTION_WEIGHT.penalty_partial;
      result.penalties.push({ positions:matchedPos, label:label+' (partial)', effect, weight:w });
    }
  });

  // 파
  BREAKINGS.forEach(({pair, label}) => {
    const [a,b] = pair;
    branches.forEach((b1,i) => {
      branches.forEach((b2,j) => {
        if (i>=j) return;
        if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
          const w = (PILLAR_WEIGHT[i]+PILLAR_WEIGHT[j])/2 * INTERACTION_WEIGHT.breaking;
          result.breakings.push({ positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, weight:w });
        }
      });
    });
  });

  // 해
  HARMS.forEach(({pair, label, effect}) => {
    const [a,b] = pair;
    branches.forEach((b1,i) => {
      branches.forEach((b2,j) => {
        if (i>=j) return;
        if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
          const w = (PILLAR_WEIGHT[i]+PILLAR_WEIGHT[j])/2 * INTERACTION_WEIGHT.harm;
          result.harms.push({ positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, effect, weight:w });
          result.interactions.push({ type:'Harm', positions:[PILLAR_NAMES[i],PILLAR_NAMES[j]], label, effect, weight:w, positive:false });
        }
      });
    });
  });

  // ── 프롬프트 요약 문자열 생성 ───────────────────────────

  // 충: 관계/이동 불안 해석
  const clashStr = result.branchClashes.length > 0
    ? result.branchClashes.map(c =>
        `[${c.positions.join('-')} CLASH: ${c.label}] Life pattern: ${c.effect}. Intensity: ${c.weight.toFixed(1)}`
      ).join(' || ')
    : 'No major clashes -- relatively stable life trajectory';

  // 합: 기회/시너지 해석
  const combineStr = [
    ...result.tripleHarmonies.map(t =>
      `[${t.positions.join('-')} TRIPLE HARMONY${t.complete?'':' partial'}: ${t.label}] ${t.effect}. Power: ${t.weight.toFixed(1)}`
    ),
    ...result.branchCombines.map(c =>
      `[${c.positions.join('-')} COMBINE: ${c.label}] ${c.effect}`
    ),
    ...result.directionals.map(d =>
      `[${d.positions.join('-')} SEASONAL${d.complete?'':' partial'}: ${d.label}] ${d.effect}`
    ),
  ].join(' || ') || 'No major combines detected';

  // 천간합
  const stemCombineStr = result.stemCombines.length > 0
    ? result.stemCombines.map(s =>
        `[${s.positions.join('-')} STEM COMBINE: ${s.label} → ${s.result}]`
      ).join(', ')
    : 'None';

  // 형파해
  const tensionStr = [
    ...result.penalties.map(p => `[PENALTY: ${p.label}] ${p.effect}`),
    ...result.harms.map(h => `[HIDDEN TENSION: ${h.label}] ${h.effect}`),
    ...result.breakings.map(b => `[DISRUPTION: ${b.label}]`),
  ].join(' || ') || 'None';

  // 일지 관련 상호작용 (배우자궁)
  const dayInteractions = result.interactions.filter(i =>
    i.positions.includes('Day')
  );
  const spouseStr = dayInteractions.length > 0
    ? dayInteractions.map(i =>
        `Day pillar involved in ${i.type}: ${i.label||''} -- ${i.effect||''}`
      ).join(' | ')
    : 'Day pillar relatively undisturbed -- stable relationship potential';

  // 월지 관련 (직업/사회)
  const careerInteractions = result.interactions.filter(i =>
    i.positions.includes('Month')
  );
  const careerInterStr = careerInteractions.length > 0
    ? careerInteractions.map(i =>
        `Month pillar in ${i.type}: ${i.label||''} -- ${i.effect||''}`
      ).join(' | ')
    : 'Month pillar stable';

  // 전체 에너지 방향
  const positiveCount = result.interactions.filter(i=>i.positive).length;
  const negativeCount = result.interactions.filter(i=>!i.positive).length;
  const overallEnergy = positiveCount > negativeCount
    ? 'Chart has more harmonious than disruptive forces -- favorable overall trajectory'
    : negativeCount > positiveCount
    ? 'Chart has more disruptive than harmonious forces -- resilience and adaptability required'
    : 'Chart is balanced between harmony and tension';

  result.summary = {
    clashStr, combineStr, stemCombineStr, tensionStr,
    spouseStr, careerInterStr, overallEnergy,
    hasClash:     result.branchClashes.length > 0,
    hasTriple:    result.tripleHarmonies.some(t=>t.complete),
    hasDirectional: result.directionals.some(d=>d.complete),
    clashPenaltyMap: result.clashPenaltyMap
  };

  return result;
}


// ══════════════════════════════════════════════════════════
// Love & Relationship Engine
// 3축: 용신 / 배우자궁(일지) / 관성 시기
// ══════════════════════════════════════════════════════════

// ── 1. 강약 계산 (4요소 가중치 모델) ─────────────────────
// ── 신살 (神殺) 상수 ──────────────────────────────────────
const DOHWA     = { 0:'酉', 3:'午', 6:'卯', 9:'子', 1:'午', 4:'卯', 7:'子', 10:'酉', 2:'卯', 5:'子', 8:'酉', 11:'午' };
const DOHWA_IDX = { 0:7, 3:6, 6:3, 9:0, 1:6, 4:3, 7:0, 10:7, 2:3, 5:0, 8:7, 11:6 };

function calcSinsal(pillars) {
  const [yrTG,yrDZ] = pillars[0];
  const [,monthDZ]  = pillars[1];
  const [dayTG,dayDZ] = pillars[2];
  const [,hourDZ]   = pillars[3];
  const branches = [yrDZ, monthDZ, dayDZ, hourDZ];
  const result = [];

  // 도화살 (년지 기준)
  const dohwaTarget = DOHWA_IDX[yrDZ];
  if (dohwaTarget !== undefined) {
    const dohwaPositions = branches.slice(1).map((b,i)=>b===dohwaTarget?['Month','Day','Hour'][i]:null).filter(Boolean);
    if (dohwaPositions.length > 0) {
      result.push({
        name: 'Dohwa (도화살)',
        nameKo: '도화살',
        desc: `Magnetic charm and attraction energy. Strong romantic appeal, artistic sensitivity. Can indicate fame or romantic entanglements. Positions: ${dohwaPositions.join(', ')}`,
        positions: dohwaPositions,
        intensity: dohwaPositions.length >= 2 ? 'Strong' : 'Moderate'
      });
    }
  }

  // 역마살 (驛馬殺) - 이동, 해외운
  // 년지/일지 기준: 寅申巳亥 그룹 = 申, 子辰 그룹 = 寅, 午戌 그룹 = 申 ...
  const YEOKMA = { 0:6, 3:6, 4:6, 7:6,   // 申(6)
                   2:9, 5:9, 6:9, 9:9,    // 亥(11) 아님 - 수정
                   1:3, 8:3, 10:3, 11:3 }; // 寅(2) 아님
  // 정확한 역마: 寅午戌→申, 申子辰→寅, 巳酉丑→亥, 亥卯未→巳
  const YEOKMA_CORRECT = {
    2:6, 6:6, 10:6,   // 寅午戌 → 申(6)
    6:2, 0:2, 4:2,    // 申子辰 → 寅(2)  
    5:11, 7:11, 1:11, // 巳酉丑 → 亥(11)
    11:5, 3:5, 8:5    // 亥卯未 → 巳(5)
  };
  const yeokmaTarget = YEOKMA_CORRECT[yrDZ];
  if (yeokmaTarget !== undefined) {
    const yeokmaPos = branches.map((b,i)=>b===yeokmaTarget?['Year','Month','Day','Hour'][i]:null).filter(Boolean);
    if (yeokmaPos.length > 0) {
      result.push({
        name: 'Yeokma (역마살)',
        nameKo: '역마살',
        desc: `Constant movement, travel, and change energy. Thrives when active and mobile. Good for international work, trade, or careers requiring travel. Positions: ${yeokmaPos.join(', ')}`,
        positions: yeokmaPos,
        intensity: yeokmaPos.length >= 2 ? 'Strong' : 'Moderate'
      });
    }
  }

  // 괴강살 (魁罡殺) - 庚辰, 庚戌, 壬辰, 壬戌
  const GOEGANG = [[6,4],[6,10],[8,4],[8,10]]; // [天干idx, 地支idx]
  const goegangPillars = pillars.map(([tg,dz],i) =>
    GOEGANG.some(([t,d])=>t===tg&&d===dz) ? ['Year','Month','Day','Hour'][i] : null
  ).filter(Boolean);
  if (goegangPillars.length > 0) {
    result.push({
      name: 'Goegang (괴강살)',
      nameKo: '괴강살',
      desc: 'Extreme personality -- either exceptional talent or extreme hardship. Commanding presence, sharp intelligence, uncompromising nature. High achievement potential but relationships can be intense.',
      positions: goegangPillars,
      intensity: 'Strong'
    });
  }

  // 백호살 (白虎殺) - 甲辰, 乙未, 丙戌, 丁丑, 戊辰, 壬戌, 癸丑
  const BAEKHO = [[0,4],[1,8],[2,10],[3,1],[4,4],[8,10],[9,1]];
  const baekhoPillars = pillars.map(([tg,dz],i) =>
    BAEKHO.some(([t,d])=>t===tg&&d===dz) ? ['Year','Month','Day','Hour'][i] : null
  ).filter(Boolean);
  if (baekhoPillars.length > 0) {
    result.push({
      name: 'Baekho (백호살)',
      nameKo: '백호살',
      desc: 'White Tiger energy -- intensity, sudden events, strong will. Associated with accidents, surgeries, or intense life experiences. Also indicates fierce determination and unusual life path.',
      positions: baekhoPillars,
      intensity: baekhoPillars.includes('Day') ? 'Strong' : 'Moderate'
    });
  }

  // 화개살 (華蓋殺) - 예술, 종교, 고독
  // 년지 기준: 寅午戌→戌, 申子辰→辰, 巳酉丑→丑, 亥卯未→未
  const HWAGAE = { 2:10, 6:10, 10:10,
                   6:4,  0:4,  4:4,
                   5:1,  7:1,  1:1,
                   11:8, 3:8,  8:8 };
  const hwagaeTarget = HWAGAE[yrDZ];
  if (hwagaeTarget !== undefined) {
    const hwagaePos = branches.map((b,i)=>b===hwagaeTarget?['Year','Month','Day','Hour'][i]:null).filter(Boolean);
    if (hwagaePos.length > 0) {
      result.push({
        name: 'Hwagae (화개살)',
        nameKo: '화개살',
        desc: 'Artistic and spiritual energy. Deep inner world, creative gifts, tendency toward solitude or contemplation. Indicates talent in arts, spirituality, or philosophy.',
        positions: hwagaePos,
        intensity: 'Moderate'
      });
    }
  }

  return result;
}

function calcYongshin(saju) {
  const { dayTG, isStrong, elemScore, johu } = saju;
  const dayElem = TG_ELEM[dayTG];
  const generates = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const controls  = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};

  let yongshin, kibun;

  if (isStrong) {
    // 신강 → 극설기(설기하거나 극하는 오행)
    // 식상(내가 생하는) 또는 재성(내가 극하는) 또는 관성(나를 극하는)
    const priority = [generates[dayElem], controls[dayElem]];
    // 조후도 반영
    yongshin = johu?.need?.[0] && priority.includes(johu.need[0]) ? johu.need[0] : priority[0];
    kibun = priority[1];
  } else {
    // 신약 → 인겁(나를 생하거나 같은 오행)
    const supports = {Wood:'Water',Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal'};
    priority2 = [dayElem, supports[dayElem]];
    yongshin = johu?.need?.[0] && priority2.includes(johu.need[0]) ? johu.need[0] : priority2[0];
    kibun = priority2[1];
  }

  return {
    yongshin,  // 용신
    kibun,     // 희신 (2순위)
    gishin: johu?.avoid?.[0], // 기신
    desc: `Yongshin (용신): ${yongshin} | Heeshin (희신): ${kibun} | Gishin (기신): ${johu?.avoid?.[0]||'None'}`
  };
}

function getSipseong(dayTG, targetTG) {
  const dayElem = TG_ELEM[dayTG];
  const dayYY   = TG_YY[dayTG];
  const tgtElem = TG_ELEM[targetTG];
  const tgtYY   = TG_YY[targetTG];
  const generates = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const controls  = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const generated = {Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
  const controlled= {Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
  if (tgtElem === dayElem) return tgtYY === dayYY ? 'Bigyeo (비겁)' : 'Geobjaae (겁재)';
  if (generates[dayElem] === tgtElem) return tgtYY === dayYY ? 'Sikshin (식신)' : 'Sanggwan (상관)';
  if (controls[dayElem] === tgtElem) return tgtYY !== dayYY ? 'Jeongjae (정재)' : 'Pyeonjae (편재)';
  if (controlled[dayElem] === tgtElem) return tgtYY !== dayYY ? 'Jeonggwan (정관)' : 'Pyeongwan (편관/칠살)';
  if (generated[dayElem] === tgtElem) return tgtYY !== dayYY ? 'Jeongin (정인)' : 'Pyeonin (편인/효신)';
  return 'Unknown';
}

function analyzeSpouseGung(pillars, dayTG, gender) {
  const dayDZ = pillars[2][1];
  const spouseElemDZ = DZ_ELEM[dayDZ];
  const mainStem = DZ_MAIN_TG[dayDZ] >= 0 ? TG_EN[DZ_MAIN_TG[dayDZ]] : null;
  const mainSS = mainStem ? getSipseong(dayTG, DZ_MAIN_TG[dayDZ]) : null;

  // 충이 있는지 (배우자궁 손상)
  const clashWith = DZ_CHUNG[dayDZ];
  const branches = pillars.map(p=>p[1]);
  const hasClash = [branches[0],branches[1],branches[3]].includes(clashWith);

  // 합이 있는지 (배우자궁 안정)
  const combineWith = DZ_HEP[dayDZ];
  const hasCombine = [branches[0],branches[1],branches[3]].includes(combineWith);

  return {
    dayBranch: DZ_EN[dayDZ],
    spouseStarType: mainSS,
    hasClash,
    hasCombine,
    stability: hasClash ? 'Unstable (충)' : hasCombine ? 'Stable (합)' : 'Neutral',
    desc: `Day Branch: ${DZ_EN[dayDZ]} (${spouseElemDZ}) | Spouse Star: ${mainSS||'N/A'} | ${hasClash?'CLASH present -- relationship instability':''}${hasCombine?'COMBINE present -- stable relationship':''}`
  };
}

function buildChartSummary(saju, birth) {
  const {yrTG,yrDZ,monthTG,monthDZ,dayTG,dayDZ,hourTG,hourDZ,elemCount,missing,dominant} = saju;
  const fourPillars = [
    `Year:  ${TG[yrTG]}${DZ[yrDZ]} (${TG_EN[yrTG]}-${DZ_EN[yrDZ]}, ${TG_ELEM[yrTG]}/${DZ_ELEM[yrDZ]})`,
    `Month: ${TG[monthTG]}${DZ[monthDZ]} (${TG_EN[monthTG]}-${DZ_EN[monthDZ]}, ${TG_ELEM[monthTG]}/${DZ_ELEM[monthDZ]})`,
    `Day:   ${TG[dayTG]}${DZ[dayDZ]} (${TG_EN[dayTG]}-${DZ_EN[dayDZ]}, ${TG_ELEM[dayTG]}/${DZ_ELEM[dayDZ]}) ← Self Element`,
    `Hour:  ${TG[hourTG]}${DZ[hourDZ]} (${TG_EN[hourTG]}-${DZ_EN[hourDZ]}, ${TG_ELEM[hourTG]}/${DZ_ELEM[hourDZ]})`,
  ].join('\n');

  const elemStr = Object.entries(elemCount)
    .map(([e,c])=>`${e}:${c}${c===0?' (MISSING)':''}`)
    .join(', ');

  const hiddenStems = saju.pillars.map(([tg,dz]) => {
    const main = DZ_MAIN_TG[dz]>=0 ? TG_EN[DZ_MAIN_TG[dz]] : '-';
    const mid  = DZ_MID_TG[dz]>=0  ? TG_EN[DZ_MID_TG[dz]]  : '-';
    return `${DZ[dz]}(main:${main}, mid:${mid})`;
  }).join('; ');

  // 지장간에서 wealth star 찾기 (정재/편재)
  const dayTGElem = TG_ELEM[dayTG];
  const wealthElems = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const wealthElem = wealthElems[dayTGElem];

  // 지장간 합 기반 vault 한자
  const vaultChars = {
    0:'壬',1:'癸',2:'甲',3:'乙',4:'戊',5:'丙',6:'丁',7:'己',8:'庚',9:'辛',10:'庚',11:'壬'
  };
  const vaultDZ = [yrDZ, monthDZ, dayDZ];
  const vaults = vaultDZ.map((dz,i) => ({
    label: `Vault ${i+1}`,
    char: vaultChars[dz] || TG[DZ_MAIN_TG[dz]],
    name: TG_EN[DZ_MAIN_TG[dz]]
  }));

  const dayMasterStr = `${TG_YY[dayTG]} ${TG_ELEM[dayTG]} (${TG[dayTG]}, ${TG_EN[dayTG]})`;

  return { fourPillars, elemStr, hiddenStems, missing, dominant, vaults, dayMasterStr, wealthElem };
}

function calcStrengthScore(pillars, dayTG) {
  const dayElem  = TG_ELEM[dayTG];
  const monthDZ  = pillars[1][1];
  const monthElem= DZ_ELEM[monthDZ];
  const branches = pillars.map(p=>p[1]);
  const stems    = pillars.map(p=>p[0]);

  const gen   = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const genBy = {Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
  const ctrl  = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};

  // 월지 계절 가중치 40%
  const monthHelps = monthElem===dayElem || genBy[monthElem]===dayElem;
  const monthScore = monthHelps ? 40 : 0;

  // 같은 오행 개수 20%
  const sameCount = [...stems,...branches].filter(x=>TG_ELEM[x]===dayElem||DZ_ELEM[x]===dayElem).length;
  const sameScore = Math.min(sameCount * 5, 20);

  // 생조 오행 개수 20%
  const supportElem = genBy[dayElem];
  const supportCount = [...stems,...branches].filter(x=>TG_ELEM[x]===supportElem||DZ_ELEM[x]===supportElem).length;
  const supportScore = Math.min(supportCount * 5, 20);

  // 극 오행 개수 20% (빼기)
  const weakenElem = ctrl[dayElem]; // 나를 극하는
  const weakenCount = [...stems,...branches].filter(x=>TG_ELEM[x]===weakenElem||DZ_ELEM[x]===weakenElem).length;
  const weakenScore = Math.min(weakenCount * 5, 20);

  const total = monthScore + sameScore + supportScore - weakenScore;
  const label = total >= 55 ? 'Strong (신강)' : total <= 35 ? 'Weak (신약)' : 'Balanced (중화)';

  return { total, label, monthScore, sameScore, supportScore, weakenScore };
}

// ── 2. 용신 도출 (Love 특화) ─────────────────────────────
function calcLoveYongshin(pillars, dayTG, strengthResult, season) {
  const dayElem = TG_ELEM[dayTG];
  const { total: score } = strengthResult;
  const gen  = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const ctrl = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const genBy= {Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};

  // 조열/한랭 체크
  const hotSeasons   = ['Summer'];
  const coldSeasons  = ['Winter'];
  const isHot  = hotSeasons.includes(season);
  const isCold = coldSeasons.includes(season);

  let stabilityElem;   // 용신 = 안정 파트너 오행
  let attractionElem;  // 끌림 오행 (나를 자극/극하는)
  let yongshinReason;

  if (score >= 55) {
    // 신강 → 설기(식상) 또는 관성
    stabilityElem = gen[dayElem];      // 내가 생하는 (설기)
    attractionElem = genBy[dayElem];   // 나를 생하는 (더 강하게 해서 끌림)
    yongshinReason = 'Strong chart needs outlet energy -- partners who channel your power';
  } else if (score <= 35) {
    // 신약 → 인성/비겁
    stabilityElem = genBy[dayElem];    // 나를 생하는 (인성)
    attractionElem = ctrl[dayElem];    // 나를 극하는 (관성 — 강렬한 끌림)
    yongshinReason = 'Weak chart needs support energy -- partners who nourish and stabilize';
  } else {
    // 중화 → 조후 기준
    stabilityElem = isHot ? 'Water' : isCold ? 'Fire' : genBy[dayElem];
    attractionElem = ctrl[dayElem];
    yongshinReason = 'Balanced chart -- seasonal adjustment needed for harmony';
  }

  // 조열/한랭 오버라이드
  if (isHot)  stabilityElem = 'Water';
  if (isCold) stabilityElem = 'Fire';

  // 끌림 ≠ 안정 설명
  const attractionDesc = {
    Wood:'expressive, growth-driven, idealistic people',
    Fire:'charismatic, passionate, high-energy personalities',
    Earth:'grounded, nurturing, steady presences',
    Metal:'sharp, principled, achievement-oriented types',
    Water:'fluid, deep, emotionally intelligent individuals'
  };
  const stabilityDesc = {
    Wood:'someone who encourages your growth without pressure',
    Fire:'someone who brings warmth and activation to your stillness',
    Earth:'someone grounded, consistent, and emotionally secure',
    Metal:'someone clear-headed, reliable, and structurally stable',
    Water:'someone emotionally deep, adaptable, and intuitively connected'
  };

  return {
    stabilityElem,
    attractionElem,
    yongshinReason,
    attractionDesc: attractionDesc[attractionElem] || attractionElem,
    stabilityDesc:  stabilityDesc[stabilityElem]   || stabilityElem,
    isSameAsAttraction: stabilityElem === attractionElem
  };
}

// ── 3. 배우자궁 안정 점수 ─────────────────────────────────
function calcSpouseScore(pillars, dayTG, hapchung, sipseongData, loveYongshin) {
  const dayDZ   = pillars[2][1];
  const monthDZ = pillars[1][1];
  const dayElem = TG_ELEM[dayTG];
  const gen  = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const ctrl = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};

  let score = 50; // 기본
  const factors = [];

  // 충 여부 (-25)
  const DZ_CHUNG = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
  const branches = pillars.map(p=>p[1]);
  const dayClash = [branches[0],branches[1],branches[3]].some(b=>DZ_CHUNG[dayDZ]===b);
  if (dayClash) { score -= 25; factors.push('Day palace clash (-25): relationship foundation periodically disrupted'); }

  // 파/형 여부 (-15)
  const BREAKING = [[0,9],[6,3],[5,8],[2,11],[4,1],[10,7]];
  const dayBreak = BREAKING.some(([a,b])=>(dayDZ===a&&branches.includes(b))||(dayDZ===b&&branches.includes(a)));
  if (dayBreak) { score -= 15; factors.push('Day palace breaking (-15): subtle friction undermines stability'); }

  // 합 여부 (+15)
  const DZ_HEP = {0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};
  const dayHarmonize = [branches[0],branches[1],branches[3]].some(b=>DZ_HEP[dayDZ]===b);
  if (dayHarmonize) { score += 15; factors.push('Day palace combine (+15): natural bonding, deep commitment once formed'); }

  // 일지 지장간에 관성 존재 여부 (+20)
  const dayJJG = JIJANGGAN_FULL[dayDZ] || [];
  const hasGwanInDay = dayJJG.some(({s})=>{
    const g = getTenGod(dayTG, s);
    return g==='정관'||g==='편관';
  });
  if (hasGwanInDay) { score += 20; factors.push('Relationship star in Day palace (+20): natural partnership energy embedded'); }

  // 일지가 용신 오행인지 (+20)
  const dayBranchElem = DZ_ELEM[dayDZ];
  if (dayBranchElem === loveYongshin.stabilityElem) {
    score += 20;
    factors.push('Day palace matches stability element (+20): relationship naturally restores your balance');
  }

  // 일지가 기신 오행인지 (-15)
  const gishinElem = ctrl[loveYongshin.stabilityElem]; // 용신을 극하는 = 기신
  if (dayBranchElem === gishinElem) {
    score -= 15;
    factors.push('Day palace conflicts with stability element (-15): often drawn to partners who intensify imbalance');
  }

  // 월지와 일지 관계
  const monthDZElem = DZ_ELEM[monthDZ];
  if (monthDZElem === dayBranchElem) {
    score += 10;
    factors.push('Month-Day branch alignment (+10): social and romantic energies in sync');
  }

  score = Math.max(0, Math.min(100, score));
  const stability = score < 40 ? 'unstable' : score <= 70 ? 'mixed' : 'marriage-friendly';
  const stabilityLabel = score < 40
    ? 'Unstable foundation -- relationships tend to start intensely but face recurring disruption'
    : score <= 70
    ? 'Mixed foundation -- capable of lasting commitment but requires conscious effort to stabilize'
    : 'Strong foundation -- chart is structurally supportive of lasting partnership';

  return { score, stability, stabilityLabel, factors, dayClash, dayHarmonize, hasGwanInDay };
}

// ── 4. 연애/결혼 시기 판단 ───────────────────────────────
function calcLoveTiming(pillars, dayTG, sipseongData, sinsal, currentYear=2026) {
  const scores = sipseongData.total || {};
  const hasDohwa = sinsal.some(s=>s.nameKo==='도화살');

  // 연애운 조건 체크
  const shikScore  = (scores['식신']||0) + (scores['상관']||0);
  const gyeobScore = (scores['겁재']||0);
  const gwanScore  = (scores['정관']||0) + (scores['편관']||0);
  const jaeScore   = (scores['정재']||0) + (scores['편재']||0);

  const isPassionType = shikScore >= 1.5 || hasDohwa || gyeobScore >= 1.5;
  const isCommitmentType = gwanScore >= 1.5 || jaeScore >= 1.5;

  // 용신/기신 오행의 천간 10년 사이클 기반 타이밍
  // 실제 대운은 별도 계산 필요하지만 일간 기준 rough 추정
  const dayElem = TG_ELEM[dayTG];
  const ELEM_STEMS = {
    Wood:[0,1], Fire:[2,3], Earth:[4,5], Metal:[6,7], Water:[8,9]
  };

  // 현재 연도 기준 향후 관성 강화 시기 추정 (10년 사이클)
  // 천간 사이클: 갑=2024, 을=2025, 병=2026, 정=2027, 무=2028, 기=2029, 경=2030, 신=2031, 임=2032, 계=2033
  const YEAR_STEMS = {};
  for (let y=2020; y<=2040; y++) YEAR_STEMS[y] = ((y-4)%10+10)%10;

  // 관성 강화 연도 (관성 = 일간을 극하는 오행 천간 해)
  const ctrl = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const gwanElem = ctrl[dayElem];
  const gwanStemIdxs = ELEM_STEMS[gwanElem] || [];

  const passionYears   = [];
  const commitYears    = [];
  const shikElem = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'}[dayElem];
  const shikStemIdxs = ELEM_STEMS[shikElem] || [];

  for (let y=currentYear; y<=currentYear+10; y++) {
    const stemIdx = YEAR_STEMS[y];
    if (shikStemIdxs.includes(stemIdx)) passionYears.push(y);
    if (gwanStemIdxs.includes(stemIdx)) commitYears.push(y);
  }

  // 2년 이상 연속 커밋 창 찾기
  let commitWindow = null;
  for (let i=0; i<commitYears.length-1; i++) {
    if (commitYears[i+1]-commitYears[i]<=2) {
      commitWindow = `${commitYears[i]}--${commitYears[i+1]}`;
      break;
    }
  }

  return {
    isPassionType, isCommitmentType,
    passionYears: passionYears.slice(0,3),
    commitYears:  commitYears.slice(0,4),
    commitWindow,
    shikScore, gwanScore, hasDohwa,
    summary: [
      isPassionType
        ? `Romance-active type: expression and attraction energy is high (식상 ${shikScore.toFixed(1)}${hasDohwa?' + Dohwa star':''}) -- passionate connections are accessible but may be short-lived`
        : `Commitment-first type: you feel romantic energy more through depth and structure than excitement`,
      passionYears.length>0
        ? `Peak attraction windows: ${passionYears.join(', ')} (expression energy years)`
        : 'No strong standalone romance years in near term',
      commitYears.length>0
        ? `Partnership-deepening years: ${commitYears.join(', ')} (relationship-star years)`
        : 'Commitment energy is currently low -- internal work needed first',
      commitWindow
        ? `Marriage-capable window: ${commitWindow} -- consecutive partnership cycles create structural support for long-term commitment`
        : 'No consecutive commitment window in next 10 years -- focus on foundation-building',
    ].join(' || ')
  };
}

// ── 5. Love 종합 프롬프트 문자열 생성 ─────────────────────
function buildLoveContext(pillars, dayTG, strengthResult, sipseongData, hapchung, sinsal, season) {
  const loveYongshin = calcLoveYongshin(pillars, dayTG, strengthResult, season);
  const spouseScore  = calcSpouseScore(pillars, dayTG, hapchung, sipseongData, loveYongshin);
  const timing       = calcLoveTiming(pillars, dayTG, sipseongData, sinsal);
  const scores       = sipseongData.total || {};

  const gwanScore   = (scores['정관']||0) + (scores['편관']||0);
  const jaeScore    = (scores['정재']||0) + (scores['편재']||0);
  const gyeobScore  = (scores['겁재']||0);
  const shikScore   = (scores['식신']||0) + (scores['상관']||0);

  // 관계 리스크 플래그
  const risks = [];
  if (spouseScore.dayClash)   risks.push('Day palace clash: relationships start strong but face periodic disruption -- external pressure destabilizes the foundation');
  if (gyeobScore >= 2.0)      risks.push(`Excess rival energy (겁재 ${gyeobScore.toFixed(1)}): unconsciously treats partners as competitors -- intimacy feels like loss of independence`);
  if (gwanScore === 0)        risks.push('No relationship-star energy: dislikes being structured by a partner -- needs a relationship that feels like freedom, not obligation');
  if (jaeScore >= 2.5)        risks.push(`Excess wealth-star energy (재성 ${jaeScore.toFixed(1)}): may pursue partners for security or status rather than emotional fit`);
  if (shikScore >= 2.5)       risks.push(`High expression energy (식상 ${shikScore.toFixed(1)}): charm and attraction are high but depth and commitment may lag`);

  return {
    loveYongshin,
    spouseScore,
    timing,
    riskStr: risks.join(' | ') || 'No major structural risks -- chart supports healthy relationship patterns',
    // 완성된 컨텍스트 문자열 (프롬프트에 주입)
    fullContext: `
LOVE & RELATIONSHIP CHART ANALYSIS:

[1. Strength & Stability Element]
Chart strength: ${strengthResult.label} (score: ${strengthResult.total})
Stability partner type (용신 기반): ${loveYongshin.stabilityElem} energy -- ${loveYongshin.stabilityDesc}
Attraction type (끌림 기반): ${loveYongshin.attractionElem} energy -- ${loveYongshin.attractionDesc}
Key insight: ${loveYongshin.isSameAsAttraction
  ? 'Attraction and stability align -- who you want IS who is good for you. Trust your pull.'
  : 'Attraction ≠ Stability. You are drawn to ' + loveYongshin.attractionElem + ' energy but stabilize with ' + loveYongshin.stabilityElem + ' energy. This gap is the source of your relationship pattern.'}
Reason: ${loveYongshin.yongshinReason}

[2. Partnership Palace (Day Branch)]
Stability score: ${spouseScore.score}/100 -- ${spouseScore.stabilityLabel}
Structural factors:
${spouseScore.factors.map(f=>'  - '+f).join('\n')}

[3. Relationship Risks]
${risks.length > 0 ? risks.map(r=>'  - '+r).join('\n') : '  - No major structural risks'}

[4. Timing Windows]
${timing.summary}

[5. Ten-Star Love Profile]
Relationship star (관성): ${gwanScore.toFixed(1)} -- ${gwanScore===0?'absent: freedom-seeking, dislikes being controlled':gwanScore>=2.5?'excess: over-responsible in love, self-critical':'moderate: balanced ambition and connection'}
Partner-energy star (재성 for male): ${jaeScore.toFixed(1)} -- ${jaeScore===0?'absent: partner comes through unexpected routes':jaeScore>=2.5?'excess: may over-pursue or attract complex partners':'moderate'}
Disruptive Expression (식상): ${shikScore.toFixed(1)} -- ${shikScore>=2.0?'high: naturally charming, expressive, attractive -- but may prioritize feeling over commitment':'moderate'}
Rival energy (겁재): ${gyeobScore.toFixed(1)} -- ${gyeobScore>=2.0?'high: partner may feel like competition -- intimacy triggers independence reflex':'low-moderate'}
`.trim()
  };
}


// ══════════════════════════════════════════════════════════
// 대운 계산 엔진 (Grand Tides / Life Cycle Phases)
// ══════════════════════════════════════════════════════════

// 절기 데이터 내장 (주요 년도 - 없으면 rough 추정)
const JIEQI_DB = {
  1960:[[1,6,7],[2,5,22],[3,6,13],[4,5,17],[5,6,11],[6,6,15],[7,7,22],[8,8,3],[9,8,6],[10,8,16],[11,7,24],[12,7,19]],
  1961:[[1,6,12],[2,4,18],[3,6,14],[4,5,20],[5,6,16],[6,6,20],[7,7,23],[8,8,4],[9,8,8],[10,8,19],[11,8,7],[12,8,0]],
  1962:[[1,6,17],[2,4,20],[3,6,15],[4,5,21],[5,6,22],[6,6,22],[7,7,29],[8,8,8],[9,8,9],[10,8,23],[11,8,8],[12,8,7]],
  1963:[[1,6,23],[2,4,19],[3,6,21],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1964:[[1,6,8],[2,5,5],[3,6,21],[4,5,20],[5,6,21],[6,6,21],[7,7,23],[8,8,7],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1965:[[1,6,5],[2,4,19],[3,6,11],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1966:[[1,6,10],[2,4,19],[3,6,12],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,7],[12,7,22]],
  1967:[[1,6,16],[2,4,18],[3,6,13],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1968:[[1,6,21],[2,5,5],[3,5,20],[4,5,21],[5,6,22],[6,6,21],[7,7,23],[8,8,7],[9,8,7],[10,8,23],[11,7,22],[12,7,22]],
  1969:[[1,6,6],[2,4,19],[3,6,11],[4,5,21],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1970:[[1,6,11],[2,4,19],[3,6,12],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1971:[[1,6,16],[2,4,19],[3,6,13],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1972:[[1,6,21],[2,5,5],[3,5,20],[4,4,30],[5,5,21],[6,6,21],[7,7,23],[8,8,7],[9,8,8],[10,8,23],[11,7,22],[12,7,22]],
  1973:[[1,6,6],[2,4,19],[3,6,11],[4,5,20],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1974:[[1,6,11],[2,4,19],[3,6,11],[4,5,21],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,7],[12,8,7]],
  1975:[[1,6,16],[2,4,19],[3,6,12],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1976:[[1,6,21],[2,5,5],[3,5,20],[4,4,30],[5,5,21],[6,6,21],[7,7,23],[8,8,7],[9,8,8],[10,8,23],[11,7,22],[12,7,21]],
  1977:[[1,6,6],[2,4,19],[3,6,11],[4,5,20],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,7],[12,7,22]],
  1978:[[1,6,11],[2,4,19],[3,6,11],[4,5,21],[5,6,22],[6,6,22],[7,7,24],[8,8,8],[9,8,8],[10,8,24],[11,8,7],[12,7,22]],
  1979:[[1,6,16],[2,4,19],[3,6,12],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1980:[[1,6,21],[2,5,5],[3,5,20],[4,4,30],[5,5,21],[6,6,21],[7,7,23],[8,8,7],[9,8,7],[10,8,23],[11,7,22],[12,7,21]],
  1981:[[1,6,6],[2,4,19],[3,6,11],[4,5,20],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,7],[10,8,23],[11,8,7],[12,7,22]],
  1982:[[1,6,11],[2,4,19],[3,6,11],[4,5,21],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,7],[12,7,22]],
  1983:[[1,6,16],[2,4,20],[3,6,12],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1984:[[1,6,21],[2,5,5],[3,5,20],[4,4,30],[5,5,21],[6,6,21],[7,7,23],[8,8,7],[9,8,8],[10,8,23],[11,7,22],[12,7,22]],
  1985:[[1,6,6],[2,4,20],[3,6,11],[4,5,20],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1986:[[1,6,11],[2,4,20],[3,6,11],[4,5,21],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,7],[12,7,22]],
  1987:[[1,6,5],[2,4,20],[3,6,12],[4,5,16],[5,6,9],[6,6,13],[7,7,20],[8,8,1],[9,8,4],[10,8,14],[11,7,23],[12,7,17]],
  1988:[[1,6,21],[2,5,5],[3,5,20],[4,4,30],[5,5,21],[6,6,21],[7,7,23],[8,8,7],[9,8,8],[10,8,23],[11,7,22],[12,7,22]],
  1989:[[1,6,6],[2,4,20],[3,6,11],[4,5,20],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1990:[[1,6,11],[2,4,20],[3,6,11],[4,5,21],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1991:[[1,6,16],[2,4,20],[3,6,12],[4,5,21],[5,6,22],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  1992:[[1,6,10],[2,5,1],[3,5,16],[4,4,27],[5,5,15],[6,4,17],[7,7,1],[8,7,7],[9,7,9],[10,7,26],[11,7,5],[12,6,23]],
  1993:[[1,6,5],[2,4,20],[3,6,12],[4,5,16],[5,6,10],[6,6,14],[7,7,21],[8,8,2],[9,8,4],[10,8,15],[11,7,23],[12,7,18]],
  1994:[[1,6,11],[2,4,23],[3,6,16],[4,5,21],[5,6,14],[6,6,18],[7,8,2],[8,8,7],[9,8,10],[10,8,20],[11,8,6],[12,8,0]],
  1995:[[1,6,6],[2,4,20],[3,6,11],[4,5,20],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1996:[[1,6,11],[2,5,5],[3,5,20],[4,4,30],[5,5,21],[6,6,21],[7,7,23],[8,8,7],[9,8,8],[10,8,23],[11,7,22],[12,7,22]],
  1997:[[1,6,5],[2,4,19],[3,6,11],[4,5,20],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,23],[11,8,7],[12,7,22]],
  1998:[[1,6,6],[2,4,19],[3,6,11],[4,5,21],[5,6,21],[6,6,22],[7,7,23],[8,8,8],[9,8,8],[10,8,24],[11,8,7],[12,7,22]],
  1999:[[1,6,6],[2,4,19],[3,6,6],[4,5,21],[5,6,6],[6,6,22],[7,7,8],[8,8,8],[9,8,8],[10,8,24],[11,8,8],[12,8,7]],
  2000:[[1,6,21],[2,5,5],[3,5,20],[4,4,30],[5,5,21],[6,6,21],[7,7,23],[8,8,7],[9,8,8],[10,8,23],[11,7,22],[12,7,22]],
};

const JIEQI_MONTH_DZ_MAP = [1,2,3,4,5,6,7,8,9,10,11,0];

function getJieqiForYear(year) {
  if (JIEQI_DB[year]) return JIEQI_DB[year];
  // rough fallback
  return Array.from({length:12},(_,i)=>[i+1,6,0]);
}

// 대운 계산 (엔진 핵심)
function calcDaewonFull(year, month, day, gender, yrTG, monthTG, monthDZ) {
  const TG_YY = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
  const isYangYear = TG_YY[yrTG] === 'Yang';
  const isMale = gender === 'M';
  const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);

  const jieqiData = getJieqiForYear(year);
  const birthMs = new Date(year, month-1, day).getTime();

  let daysToJieqi;
  if (isForward) {
    // 다음 절기까지 일수
    const nextIdx = month < 12 ? month : 0;
    const nextYear = month < 12 ? year : year+1;
    const nj = jieqiData[nextIdx] || [month+1, 6, 0];
    const nextMs = new Date(nextYear, nj[0]-1, nj[1]).getTime();
    daysToJieqi = (nextMs - birthMs) / 86400000;
  } else {
    // 이전 절기까지 일수
    const prevIdx = month - 2 >= 0 ? month-2 : 11;
    const prevYear = month-2 >= 0 ? year : year-1;
    const pj = getJieqiForYear(prevYear)[prevIdx] || [month-1, 6, 0];
    const prevMs = new Date(prevYear, pj[0]-1, pj[1]).getTime();
    daysToJieqi = (birthMs - prevMs) / 86400000;
  }

  daysToJieqi = Math.max(1, Math.abs(daysToJieqi));
  const startAge = Math.round(daysToJieqi / 3);
  const startYear = year + startAge;

  const daewons = [];
  for (let i = 1; i <= 8; i++) {
    const tgIdx = isForward ? (monthTG + i) % 10 : ((monthTG - i) % 10 + 10) % 10;
    const dzIdx = isForward ? (monthDZ + i) % 12 : ((monthDZ - i) % 12 + 12) % 12;
    const age = startAge + (i-1)*10;
    const dwStart = year + age;
    daewons.push({ idx: i, age, startYear: dwStart, endYear: dwStart+9, tg: tgIdx, dz: dzIdx });
  }

  return { isForward, startAge, startYear, daewons };
}

// 대운 GPT 주입용 문자열 생성
function buildDaewonContext(daewonResult, dayTG, yongshinElem, gishinElem, currentYear=2026) {
  const { isForward, startAge, daewons } = daewonResult;

  const TG_ELEM = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const TG_YY   = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
  const DZ_ELEM = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
  const TG_NAMES= ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
  const DZ_NAMES= ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai'];
  const TG_HANJA= ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const DZ_HANJA= ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  const gen    = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const ctrl   = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const genBy  = {Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
  const ctrlBy = {Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};

  function getTenGod(dTG, tTG) {
    if (dTG===tTG) return 'Self-Expansion Drive (비견)';
    const dE=TG_ELEM[dTG],dY=TG_YY[dTG],tE=TG_ELEM[tTG],tY=TG_YY[tTG];
    if (tE===dE) return tY===dY?'Self-Expansion Drive (비견)':'Competitive Capital (겁재)';
    if (gen[dE]===tE) return tY===dY?'Creative Output (식신)':'Disruptive Expression (상관)';
    if (ctrl[dE]===tE) return tY!==dY?'Structured Income (정재)':'Opportunistic Wealth (편재)';
    if (ctrlBy[dE]===tE) return tY!==dY?'Authority Structure':'Power Challenge';
    if (genBy[dE]===tE) return tY!==dY?'Structured Support (정인)':'Independent Intelligence (편인)';
    return 'Self-Expansion Drive (비견)';
  }

  // 에너지 등급 라벨
  function getEnergyLabel(tgElem, dzElem) {
    const tgYong = tgElem===yongshinElem, tgGi = tgElem===gishinElem;
    const dzYong = dzElem===yongshinElem, dzGi = dzElem===gishinElem;
    if (tgYong && dzYong) return 'PEAK -- both stem and branch activate your favorable element. Major opportunity decade.';
    if (tgYong && !dzGi)  return 'FAVORABLE -- stem energy supports you. Steady growth with manageable challenges.';
    if (!tgGi && dzYong)  return 'FAVORABLE -- branch energy supports foundation. Slower buildup but solid gains.';
    if (tgGi && dzGi)     return 'DIFFICULT -- both stem and branch create friction. Consolidate, do not overextend.';
    if (tgGi)             return 'MIXED/TENSE -- surface friction but opportunity exists in the foundation. Stay strategic.';
    if (dzGi)             return 'MIXED/UNSTABLE -- foundation under pressure but surface may look fine. Build reserves.';
    return 'NEUTRAL -- transitional energy. Neither strongly favorable nor unfavorable. Preparation phase.';
  }

  // 십성 키워드 (영어 풀이)
  const GOD_THEMES = {
    'Self-Expansion Drive (비견)':        'self-reliance, independent ventures, peer collaboration, identity assertion',
    'Competitive Capital (겁재)':          'competition, bold risk-taking, financial gambling, breakthroughs through pressure',
    'Creative Output (식신)':         'creative expression, enjoyment, reputation building, steady talent monetization',
    'Disruptive Expression (상관)':     'unconventional moves, innovation, fame through disruption, speaking your truth',
    'Structured Income (정재)':         'earned income growth, financial consolidation, practical asset building',
    'Opportunistic Wealth (편재)':'business windfalls, investment opportunities, bold financial expansion',
    'Authority Structure': 'career recognition, institutional advancement, commitment energy, structured success',
    'Power Challenge': 'transformative pressure, authority challenges, high-risk high-reward power moves',
    'Structured Support (정인)':       'learning, mentorship, healing, recovery, spiritual deepening',
    'Independent Intelligence (편인)':           'intuitive insight, creative pivot, unconventional wisdom, solitary breakthroughs',
  };

  // 라이프 페이즈 라벨
  function getPhaseLabel(energy, tgGod) {
    if (energy.startsWith('PEAK')) return 'Harvest Phase';
    if (energy.startsWith('FAVORABLE')) return 'Growth Phase';
    if (energy.startsWith('DIFFICULT')) return 'Fortification Phase';
    if (energy.startsWith('MIXED/TENSE')) return 'Tension-Opportunity Phase';
    if (energy.startsWith('MIXED/UNSTABLE')) return 'Caution Phase';
    return 'Foundation Phase';
  }

  // 현재 대운 식별
  // 각 대운 해석
  const interpreted = daewons.map(d => {
    const tgElem = TG_ELEM[d.tg], dzElem = DZ_ELEM[d.dz];
    const tgGod  = getTenGod(dayTG, d.tg);
    const energy = getEnergyLabel(tgElem, dzElem);
    const phase  = getPhaseLabel(energy, tgGod);
    const themes = GOD_THEMES[tgGod] || '';
    const isCurrent = d.startYear <= currentYear && currentYear <= d.endYear;
    const isFuture  = d.startYear > currentYear;

    // 충 체크 (일지 기준)
    const DZ_CHUNG = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};

    return {
      ...d,
      tgElem, dzElem, tgGod, energy, phase, themes,
      tgHanja: TG_HANJA[d.tg], dzHanja: DZ_HANJA[d.dz],
      tgName: TG_NAMES[d.tg], dzName: DZ_NAMES[d.dz],
      isCurrent, isFuture,
      label: `${TG_HANJA[d.tg]}${DZ_HANJA[d.dz]}`,
    };
  });

  // currentDw / nextDw — interpreted 기반으로 재선언 (energy 등 필드 포함)
  const activeIdx = interpreted.findIndex(d => d.startYear <= currentYear && currentYear <= d.endYear);
  const currentDw = activeIdx >= 0 ? interpreted[activeIdx] : null;
  const nextDw    = activeIdx >= 0 && activeIdx < interpreted.length-1 ? interpreted[activeIdx+1] : null;

  // PEAK 구간 찾기
  const peakDws = interpreted.filter(d => d.energy.startsWith('PEAK') || d.energy.startsWith('FAVORABLE'));
  const hardDws = interpreted.filter(d => d.energy.startsWith('DIFFICULT') || d.energy.startsWith('MIXED/UNSTABLE'));

  // 미래 대운만 (GPT에 쓸 부분)
  const futureDws = interpreted.filter(d => d.isFuture || d.isCurrent);

  // GPT 주입용 문자열
  const dwLines = interpreted.map(d =>
    `  [${d.isCurrent?'CURRENT':''}${d.isFuture&&!d.isCurrent?'FUTURE':''}${!d.isFuture&&!d.isCurrent?'PAST':''}] ` +
    `Age ${d.age} (${d.startYear}-${d.endYear}): ${d.label} (${d.tgName}-${d.dzName}) | ` +
    `${d.tgElem}/${d.dzElem} | ${d.tgGod} | ${d.phase} | ${d.energy.split('--')[0].trim()} | ` +
    `Themes: ${d.themes}`
  ).join('\n');

  const peakStr = peakDws.length > 0
    ? peakDws.map(d=>`Age ${d.age} (${d.startYear}-${d.endYear}): ${d.phase} -- ${d.themes.split(',').slice(0,2).join(',')}`).join(' | ')
    : 'No strong peak in this chart -- consistent moderate energy across cycles';

  const cautionStr = hardDws.length > 0
    ? hardDws.map(d=>`Age ${d.age} (${d.startYear}-${d.endYear}): ${d.phase} -- consolidate, avoid overextension`).join(' | ')
    : 'No severe caution periods -- chart has manageable friction';

  const currentStr = currentDw
    ? `CURRENT DECADE (${currentDw.startYear}-${currentDw.endYear}): ${currentDw.label} -- ${currentDw.energy.split('--')[0].trim()}. ${currentDw.themes}. Phase: ${currentDw.phase}`
    : 'No active decade identified';

  const nextStr = nextDw
    ? `NEXT DECADE (${nextDw.startYear}-${nextDw.endYear}): ${nextDw.label} -- ${nextDw.energy.split('--')[0].trim()}. ${nextDw.themes}. Phase: ${nextDw.phase}`
    : '';

  return {
    interpreted,
    peakDws, hardDws, futureDws,
    currentDw, nextDw,
    // GPT 프롬프트 주입용
    fullContext: `
GRAND TIDES DATA (Life Cycle Phases -- use this as the ONLY source for s9):
Cycle direction: ${isForward ? 'Forward (Yang male / Yin female)' : 'Reverse (Yin male / Yang female)'}
First cycle starts: Age ${startAge} (Year ${daewons[0]?.startYear || ''})
Favorable element (용신): ${yongshinElem}
Conflict element (기신): ${gishinElem}

All cycles:
${dwLines}

${currentStr}
${nextStr ? nextStr : ''}

Peak windows: ${peakStr}
Caution periods: ${cautionStr}

INSTRUCTION FOR s9:
- Use EXACT age ranges and years from the data above -- do not invent or generalize
- The "decades" array must cover the 4 most relevant decades (current + near future first, then context past/future)
- Each decade body must reference the specific energy label (PEAK/FAVORABLE/DIFFICULT/MIXED) and specific themes
- peakWindow must give SPECIFIC year range from the data (e.g. "2033-2042")
- cautionWindow must give SPECIFIC years from the data
- DO NOT write generic statements like "this is a time of growth" -- tie every sentence to the specific element and ten-star energy of that cycle
`.trim()
  };
}


// ══════════════════════════════════════════════════════════
// 원국 × 대운 상호작용 엔진
// 합충형해파 + 재자극 로직 + 점수화 + 문장 자동화
// ══════════════════════════════════════════════════════════

// ── 상수 테이블 ───────────────────────────────────────────
const CLASH_MAP = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
const COMBINE_MAP = {0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};
const COMBINE_RESULT_ELEM = {
  '0-1':'Earth','1-0':'Earth','2-11':'Wood','11-2':'Wood',
  '3-10':'Fire','10-3':'Fire','4-9':'Metal','9-4':'Metal',
  '5-8':'Water','8-5':'Water','6-7':'Fire','7-6':'Fire',
};

// 방합 (Directional Harmony) — 완성(3개) 시만 activation
const DIRECTIONAL_SETS = [
  {group:[8,9,10],  result:'Metal', label:'West/Autumn (申酉戌)'},
  {group:[11,0,1],  result:'Water', label:'North/Winter (亥子丑)'},
  {group:[2,3,4],   result:'Wood',  label:'East/Spring (寅卯辰)'},
  {group:[5,6,7],   result:'Fire',  label:'South/Summer (巳午未)'},
];

// 삼합 (Triple Harmony)
const TRIPLE_SETS = [
  {group:[2,6,10], result:'Fire'},
  {group:[5,9,1],  result:'Metal'},
  {group:[8,0,4],  result:'Water'},
  {group:[11,3,7], result:'Wood'},
];

// 형 (Penalty)
const PENALTY_SETS = [
  {group:[0,0],     label:'Self-penalty (Rat)',    effect:'self-sabotage loop'},
  {group:[9,9],     label:'Self-penalty (Rooster)', effect:'perfectionism paralysis'},
  {group:[1,10,7],  label:'Uncivilized penalty',   effect:'authority conflict, bullying dynamic'},
  {group:[2,5,8],   label:'Ungrateful penalty',    effect:'betrayal pattern, sudden reversals'},
];

// 파 (Breaking)
const BREAK_PAIRS = [[0,9],[6,3],[5,8],[2,11],[4,1],[10,7]];

// 해 (Harm)
const HARM_PAIRS = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];

// DZ 영어명 (전역 상수는 파일 상단에 이미 선언됨 — 중복 제거)

// ── 헬퍼 ─────────────────────────────────────────────────
function hasPair(arr, a, b) {
  return (arr.includes(a) && arr.includes(b));
}
function pairKey(a, b) { return `${Math.min(a,b)}-${Math.max(a,b)}`; }

// ── 원국 사전 분석 (기존 긴장 구조 추출) ─────────────────
function analyzeNatalTensions(pillars) {
  // 시주 더미(甲子=0,0) 방지: 시주가 없거나 더미면 3기둥만 분석
  const hasHour = pillars[3] && (pillars[3][0] !== 0 || pillars[3][1] !== 0);
  const branches = hasHour ? pillars.map(p=>p[1]) : pillars.slice(0,3).map(p=>p[1]);
  const stems    = hasHour ? pillars.map(p=>p[0]) : pillars.slice(0,3).map(p=>p[0]);
  const NAMES    = ['Year','Month','Day','Hour'];
  const tensions = {
    clashes:[], combines:[], penalties:[], breaks:[], harms:[],
    dayClashed: false, monthClashed: false,
    existingClashMap: {}, // dzIdx → [충 대상 pillar]
  };

  // 지지충
  branches.forEach((b,i) => branches.forEach((b2,j) => {
    if (i >= j) return;
    if (CLASH_MAP[b] === b2) {
      tensions.clashes.push({
        positions: [NAMES[i], NAMES[j]], dzA: b, dzB: b2,
        severity: (i===2||j===2) ? 'critical' : (i===1||j===1) ? 'major' : 'moderate',
      });
      if (i===2||j===2) tensions.dayClashed = true;
      if (i===1||j===1) tensions.monthClashed = true;
      tensions.existingClashMap[b]  = (tensions.existingClashMap[b]  || []).concat(NAMES[j]);
      tensions.existingClashMap[b2] = (tensions.existingClashMap[b2] || []).concat(NAMES[i]);
    }
  }));

  // 지지합
  branches.forEach((b,i) => branches.forEach((b2,j) => {
    if (i >= j) return;
    if (COMBINE_MAP[b] === b2) {
      tensions.combines.push({
        positions: [NAMES[i], NAMES[j]], dzA: b, dzB: b2,
        resultElem: COMBINE_RESULT_ELEM[`${b}-${b2}`] || COMBINE_RESULT_ELEM[`${b2}-${b}`],
      });
    }
  }));

  // 형
  PENALTY_SETS.forEach(({group, label, effect}) => {
    const matched = group.filter(dz => branches.includes(dz));
    if (matched.length === group.length) {
      tensions.penalties.push({
        label, effect, dzList: matched,
        positions: matched.map(dz => NAMES[branches.indexOf(dz)]),
      });
    }
  });

  // 파
  BREAK_PAIRS.forEach(([a,b]) => {
    if (hasPair(branches, a, b)) {
      tensions.breaks.push({
        dzA: a, dzB: b,
        positions: [NAMES[branches.indexOf(a)], NAMES[branches.indexOf(b)]],
        effect: 'trust erosion, hidden friction'
      });
    }
  });

  // 해
  HARM_PAIRS.forEach(([a,b]) => {
    if (hasPair(branches, a, b)) {
      tensions.harms.push({
        dzA: a, dzB: b,
        positions: [NAMES[branches.indexOf(a)], NAMES[branches.indexOf(b)]],
        effect: 'misunderstanding, emotional distance'
      });
    }
  });

  return tensions;
}

// ── 대운 × 원국 상호작용 분석 ────────────────────────────
function analyzeDaewonInteraction(daewon, pillars, dayTG, yongshinElem, gishinElem, natalTensions, strengthScore = 0) {
  const dwTG = daewon.tg, dwDZ = daewon.dz;
  // 시주가 없는 경우(null/undefined) 또는 더미(甲子=0,0)인 경우 3기둥만 사용
  // 더미 시주로 인한 방합/삼합 오발동 방지
  const hasHourPillar = pillars[3] && (pillars[3][0] !== 0 || pillars[3][1] !== 0);
  const branches = hasHourPillar ? pillars.map(p=>p[1]) : pillars.slice(0,3).map(p=>p[1]);
  const stems    = hasHourPillar ? pillars.map(p=>p[0]) : pillars.slice(0,3).map(p=>p[0]);
  const NAMES    = ['Year','Month','Day','Hour'];
  const dayDZ    = branches[2];
  const monthDZ  = branches[1];

  const events   = [];
  let score      = 50;
  const scoreLog = [];

  // 대운 천간 오행 (완충 체크에 사용)
  const dwTGElem = TG_ELEM[dwTG];
  const stemIsYong = dwTGElem === yongshinElem;
  const stemIsGi   = dwTGElem === gishinElem;

  // ── 1. 충 (Clash) — 강도 4단계 ───────────────────────────
  // 충 강도 등급:
  //   TRIPLE   : 충 + 기신 + 재자극  → 최고 감점
  //   DOUBLE   : 충 + (기신 OR 재자극)
  //   SIMPLE   : 단순 충
  // 용신 천간이 있으면 완충 적용 (바닥 방지)
  branches.forEach((b, i) => {
    if (CLASH_MAP[dwDZ] !== b) return;

    const posName  = NAMES[i];
    const isDay    = (i === 2);
    const isMonth  = (i === 1);

    // 재자극 여부
    const isReactivation = !!(natalTensions.existingClashMap[b]?.length > 0);
    // 기신 오행 충 여부 (대운 지지가 기신 오행)
    const clashBranchElem = DZ_ELEM[dwDZ];
    const isGishinClash   = (clashBranchElem === gishinElem) || (DZ_ELEM[b] === gishinElem);
    // 충 당사자(대운지지 OR 원국지지) 둘 중 하나라도 기신 오행이면 기신 충으로 판정

    // 강도 결정
    let clashGrade;
    if (isReactivation && isGishinClash)    clashGrade = 'TRIPLE';
    else if (isReactivation || isGishinClash) clashGrade = 'DOUBLE';
    else                                      clashGrade = 'SIMPLE';

    // 기본 감점 (위치 기준)
    const basePenalty = isDay ? -30 : isMonth ? -20 : -12;

    // 강도 배수
    const gradeMulti = { TRIPLE: 2.0, DOUBLE: 1.5, SIMPLE: 1.0 }[clashGrade];

    // 용신 완충: 천간이 용신이면 최대 감점을 40%로 제한
    // → "용신 등장 시 완전 파괴는 거의 없다" 로직
    let actualPenalty = Math.round(basePenalty * gradeMulti);
    if (stemIsYong) {
      // 용신 완충: 감점을 50% 감소
      actualPenalty = Math.round(actualPenalty * 0.5);
      scoreLog.push(`Yongshin stem buffers clash (×0.5)`);
    }

    score += actualPenalty;
    scoreLog.push(
      `${posName}-clash [${clashGrade}] (${DZ_NAME[dwDZ]}↔${DZ_NAME[b]}): ${actualPenalty}` +
      (isReactivation ? ' [REACTIVATION]' : '') +
      (isGishinClash  ? ' [GISHIN-CLASH]' : '')
    );

    // 이벤트 텍스트
    const gradeDesc = {
      TRIPLE: `TRIPLE-FORCE clash (reactivation + conflict element): `,
      DOUBLE: `DOUBLE-FORCE clash (${isReactivation?'reactivation':'conflict element'}): `,
      SIMPLE: ``,
    }[clashGrade];

    if (isDay) {
      events.push({
        type: 'RELATIONSHIP_DISRUPTION', clashGrade, reactivation: isReactivation,
        label: gradeDesc + (
          isReactivation
            ? `The Day Palace clash already embedded in your natal chart is now externally triggered at amplified force. This is not a random disruption -- it is a fault line breaking surface. Relationship endings, separations, or forced restructuring of living situation are structurally triggered.`
            : `Day Palace clash this decade. Partnership foundation under direct pressure. Existing relationships face structural stress; new connections may arrive suddenly but without stable ground.`
        ) + (stemIsYong ? ` The favorable stem element provides partial insulation -- complete collapse is unlikely, but active navigation is required.` : ``),
      });
    } else if (isMonth) {
      events.push({
        type: 'CAREER_DISRUPTION', clashGrade, reactivation: isReactivation,
        label: gradeDesc + (
          isReactivation
            ? `Month Palace reactivation: career tension already present in the natal structure is now externally triggered. Organizational disruption, authority conflict, or forced role change arrives with higher force than a first-time clash.`
            : `Month Palace clash: career momentum disrupted. Friction with supervisors, forced role change, or professional pivot.`
        ) + (stemIsYong ? ` Favorable stem element partially buffers the impact.` : ``),
      });
    } else {
      events.push({
        type: 'ENVIRONMENTAL_SHIFT', clashGrade, reactivation: isReactivation,
        label: `${posName} pillar ${clashGrade} clash: environmental change or peripheral life disruption.`,
      });
    }
  });

  // ── 2. 합 (Combine) ──────────────────────────────────────
  branches.forEach((b, i) => {
    if (COMBINE_MAP[dwDZ] !== b) return;
    const posName    = NAMES[i];
    const isDay      = (i === 2);
    const isMonth    = (i === 1);
    const resultElem = COMBINE_RESULT_ELEM[`${dwDZ}-${b}`] || COMBINE_RESULT_ELEM[`${b}-${dwDZ}`];
    const isYong     = resultElem === yongshinElem;
    const isGi       = resultElem === gishinElem;

    const bonus = isYong ? +25 : isGi ? -10 : +10;
    score += bonus;
    scoreLog.push(`${posName}-combine→${resultElem} (${isYong?'YONG+25':isGi?'GI-10':'neutral+10'})`);

    if (isDay) {
      events.push({
        type: isYong ? 'RELATIONSHIP_OPPORTUNITY' : isGi ? 'RELATIONSHIP_ENTANGLEMENT' : 'RELATIONSHIP_BONDING',
        label: isYong
          ? `Day Palace combines this decade, producing your favorable element. Structural green light for partnership: deep bonding energy, naturally supportive of commitment and lasting connection. Marriage window conditions partially met.`
          : isGi
          ? `Day Palace combines but produces your conflict element. The relationship that forms carries hidden weight -- an attachment that intensifies existing imbalances. Proceed consciously.`
          : `Day Palace combines: relationship bonding elevated. Existing bonds deepen; new connections arrive organically.`,
      });
    } else if (isMonth) {
      events.push({
        type: isYong ? 'CAREER_ACCELERATION' : 'CAREER_LOCK_IN',
        label: isYong
          ? `Month Palace combines, producing favorable element. Career momentum accelerates -- organizational alignment and recognition available.`
          : `Month Palace combines: organizational commitment deepens. Evaluate before extending long-term commitments.`,
      });
    }
  });

  // ── 3. 삼합/방합 — 완성 조건 충족 시만 적용 ──────────────
  // 피드백: "가능성 서사 금지 -- 3개 완성 시만 activation"
  TRIPLE_SETS.forEach(({group, result}) => {
    // 원국 지지들 + 대운 지지 합산
    const allBranches = [...branches, dwDZ];
    const matchCount  = group.filter(dz => allBranches.includes(dz)).length;

    if (matchCount === 3) {
      // 완성 삼합만 처리
      const isYong = result === yongshinElem;
      const isGi   = result === gishinElem;
      const bonus  = isYong ? +20 : isGi ? -15 : +5;
      score += bonus;
      scoreLog.push(`Triple Harmony COMPLETE → ${result}: ${bonus > 0 ? '+' : ''}${bonus}`);
      events.push({
        type: 'TRIPLE_HARMONY_COMPLETE',
        label: `A complete Triple Harmony forms (${group.map(d=>DZ_NAME[d]).join('-')}), producing ${result} energy. ${isYong ? 'Your favorable element surges across all life domains -- major activation of career, wealth, and relationship potential simultaneously.' : isGi ? 'Conflict element achieves full activation. Concentrated friction across life domains -- consolidate and defend rather than expand.' : 'Elemental transformation touches multiple areas. Energy is significant but not directly aligned with your core beneficial element.'}`,
      });
    }
    // matchCount < 3 → 무시 (부분 삼합은 이벤트 생성 안 함)
  });

  // ── 3b. 방합 (Directional Harmony) — 완성 조건 충족 시만 ────
  DIRECTIONAL_SETS.forEach(({group, result, label}) => {
    const allBranches4 = [...branches, dwDZ];
    const matchCount4  = group.filter(dz => allBranches4.includes(dz)).length;

    if (matchCount4 === 3) {
      const isYong = result === yongshinElem;
      const isGi   = result === gishinElem;
      const bonus  = isYong ? +15 : isGi ? -12 : +4;
      score += bonus;
      scoreLog.push(`Directional Harmony COMPLETE (${label}) → ${result}: ${bonus > 0 ? '+' : ''}${bonus}`);
      events.push({
        type: 'DIRECTIONAL_HARMONY_COMPLETE',
        label: `Complete Directional Harmony (${label}) forms, concentrating ${result} energy. ` +
          (isYong ? `Your favorable element reaches full seasonal activation -- sustained support across career and relationships.` :
           isGi   ? `Conflict element achieves seasonal concentration. Sustained friction rather than single event -- requires consistent management over the decade.` :
                    `Seasonal energy concentrates. Significant elemental shift but not directly aligned with your core element.`),
      });
    }
    // matchCount < 3 → 무시
  });

  // ── 4. 형 (Penalty) ──────────────────────────────────────
  PENALTY_SETS.forEach(({group, label, effect}) => {
    // 원국 지지 + 대운 지지로 형 구성 여부
    const allBranches = [...branches, dwDZ];
    const matched = group.filter(dz => allBranches.includes(dz));
    // 형도 완성 조건(전체 그룹)만 처리
    if (matched.length === group.length) {
      score -= 15;
      scoreLog.push(`Penalty (${label}): -15`);
      events.push({
        type: 'PENALTY',
        label: `${label} penalty activates this decade. ${effect}. Relationship friction and authority conflicts accumulate as a slow grind rather than explosive event -- but consistent enough to erode foundations over the decade.`,
      });
    }
  });

  // ── 5. 파 (Breaking) ─────────────────────────────────────
  BREAK_PAIRS.forEach(([a, b]) => {
    const natalHas = branches.includes(dwDZ === a ? b : (dwDZ === b ? a : -1));
    if ((dwDZ === a && branches.includes(b)) || (dwDZ === b && branches.includes(a))) {
      score -= 10;
      scoreLog.push('Break: -10');
      events.push({
        type: 'BREAKING',
        label: `Breaking pattern active. Trust issues surface -- agreements and commitments made this decade may not hold to their original terms. Verify before signing or committing.`,
      });
    }
  });

  // ── 6. 해 (Harm) ─────────────────────────────────────────
  HARM_PAIRS.forEach(([a, b]) => {
    if ((dwDZ === a && branches.includes(b)) || (dwDZ === b && branches.includes(a))) {
      score -= 8;
      scoreLog.push('Harm: -8');
      events.push({
        type: 'HARM',
        label: `Harm pattern active. Chronic misunderstanding and emotional distance develop gradually. Requires active communication to prevent slow drift.`,
      });
    }
  });

  // ── 7. 천간 용신/기신 ────────────────────────────────────
  if (stemIsYong) {
    score += 20;
    scoreLog.push(`Stem = Yongshin (${yongshinElem}): +20`);
  } else if (stemIsGi) {
    score -= 15;
    scoreLog.push(`Stem = Gishin (${gishinElem}): -15`);
  }

  // ── 8. 용신 바닥 방지 (최저 점수 보정) ──────────────────
  // "용신 등장 시 완전 파괴는 거의 없다"
  // 용신 천간이 있으면 score 최저를 20으로 보장
  if (stemIsYong && score < 20) {
    scoreLog.push(`Yongshin floor applied (was ${score} → 20)`);
    score = 20;
  }

  // ── 9. 관성 투출 + 비견/겁재 보강 ──────────────────────────
  // (isShinYak / isShinGang / 비견겁재 점수는 getTenGodLocal 이후에 계산)
  function getTenGodLocal(dTG, tTG) {
    if(dTG===tTG)return'비견';
    const dE=TG_ELEM[dTG],dY=TG_YY[dTG],tE=TG_ELEM[tTG],tY=TG_YY[tTG];
    const gen={Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
    const ctrl={Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
    const genBy={Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
    const ctrlBy={Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
    if(tE===dE)return tY===dY?'비견':'겁재';
    if(gen[dE]===tE)return tY===dY?'식신':'상관';
    if(ctrl[dE]===tE)return tY!==dY?'정재':'편재';
    if(ctrlBy[dE]===tE)return tY!==dY?'정관':'편관';
    if(genBy[dE]===tE)return tY!==dY?'정인':'편인';
    return'비견';
  }
  const dwTGGod = getTenGodLocal(dayTG, dwTG);
  const isGwan  = (dwTGGod === '정관' || dwTGGod === '편관');
  const isJae   = (dwTGGod === '정재' || dwTGGod === '편재');
  const isBijeonStar = (dwTGGod === '비견');
  const isGyeobStar  = (dwTGGod === '겁재');
  // 신약/신강 분기 — getTenGodLocal 이후 dwTGGod 확정된 다음 계산
  const isShinYak  = (strengthScore < -5);
  const isShinGang = (strengthScore > 15);
  const isSelfStar   = isBijeonStar || isGyeobStar;

  // ── 9b. 비견/겁재 실제 점수 반영 ─────────────────────────
  if (isSelfStar) {
    const dayElem    = TG_ELEM[dayTG];
    const dzElem     = DZ_ELEM[dwDZ];
    const dzDayElem  = DZ_ELEM[pillars[2][1]]; // 일지 오행

    // STEP 1: 신약/신강 기준 천간 기본 점수
    let selfBonus = 0;
    if (isShinYak) {
      selfBonus = isBijeonStar ? +15 : +10; // 비견 체력보강 > 겁재
      scoreLog.push(`${isBijeonStar?'비견':'겁재'} [신약 보강]: +${selfBonus}`);
    } else if (isShinGang) {
      selfBonus = isBijeonStar ? -10 : -15; // 신강에 자성 추가 = 과열
      scoreLog.push(`${isBijeonStar?'비견':'겁재'} [신강 과열]: ${selfBonus}`);
    } else {
      // 중화 → 미미한 양수
      selfBonus = isBijeonStar ? +5 : +3;
      scoreLog.push(`${isBijeonStar?'비견':'겁재'} [중화 중립]: +${selfBonus}`);
    }
    score += selfBonus;

    // STEP 2: 지지 뿌리 보너스 — 대운 지지가 일간 동일 오행이면 뿌리 형성
    // 甲→Wood 인 경우 寅(Wood)·卯(Wood) 지지는 장생/건록지
    if (dzElem === dayElem && isShinYak) {
      // 장생지 여부: 각 오행의 장생지 (일간 기준)
      const JANGSENEG = {
        Wood: [11, 2],   // 亥寅 (亥=Water feeds Wood, 寅=Wood's home)
        Fire: [2, 6],    // 寅午
        Earth: [2, 5],   // 寅巳
        Metal: [5, 9],   // 巳酉
        Water: [8, 11],  // 申亥
      };
      const isJangSaeng = (JANGSENEG[dayElem]||[]).includes(dwDZ);
      const rootBonus   = isJangSaeng ? +15 : +10;
      score += rootBonus;
      scoreLog.push(`Root formation (${isJangSaeng?'장생지':'동일오행'} branch): +${rootBonus}`);
      events.push({
        type: 'ROOT_FORMATION',
        label: `The decade branch shares your day master's element${isJangSaeng ? ' and represents your root-growth position' : ''}. For a weak chart, this is structural reinforcement -- the tree finally has earth it can grow into.`,
      });
    }

    // STEP 3: 용신도 동시 존재하면 시너지 +5
    // (stemIsYong 이미 선언됨)
    if (isSelfStar && stemIsYong) {
      score += 5;
      scoreLog.push(`Self-star + Yongshin synergy: +5`);
    }

    // STEP 4: 일지 충이 동시에 발생하면 감쇄 -10
    // "커리어는 오르고 관계는 흔들리는" 패턴
    const isDayClashAlso = events.some(e => e.type === 'RELATIONSHIP_DISRUPTION');
    if (isSelfStar && isDayClashAlso) {
      score -= 10;
      scoreLog.push(`Self-star + Day clash offset: -10 (career↑ relationship↓)`);
      events.push({
        type: 'SPLIT_ENERGY',
        label: `Independence and self-reliance surge this decade (${isBijeonStar?'비견':'겁재'} energy), but your relationship palace is simultaneously under structural pressure. This decade likely brings career momentum and relational disruption at the same time -- not a contradiction, just the shape of this particular cycle.`,
      });
    }

    // STEP 5: 플래그 이벤트 추가
    events.push({
      type: isBijeonStar ? 'INDEPENDENCE_SURGE' : 'COMPETITION_EXPANSION',
      label: isBijeonStar
        ? (isShinYak
            ? `A decade of self-reinforcement. Your core energy is being directly bolstered -- expect a tangible increase in personal authority, physical stamina, and the capacity to hold your ground in situations that previously felt overwhelming. The tree is getting roots.`
            : `Self-Expansion Drive energy arrives in a strong chart. Self-reliance intensifies, but so does the tendency to go it alone when collaboration would serve you better. Watch for solo tunnel-vision.`)
        : (isShinYak
            ? `Competitive Capital energy arrives in a weak chart -- this brings competitive drive and market-facing ambition that can translate into real momentum, but the edge is sharper than 비견. Opportunity through friction: the competition you face this decade sharpens you. Financial risk-taking is also elevated.`
            : `Competitive Capital in a strong chart amplifies competitive and scattering tendencies. Financial impulsivity and difficulty trusting partners are the primary risks.`),
    });
  }

  if (isGwan) {
    score += 15;
    scoreLog.push(`${dwTGGod} in stem: +15 (commitment energy)`);
    events.push({
      type: 'COMMITMENT_SIGNAL',
      label: `${dwTGGod === '정관' ? 'Authority Structure' : 'Power Challenge'} in decade stem. Career recognition and relationship formalization both become available. Structural support for long-term commitment strengthens.`,
    });
  }
  if (isJae) {
    score += 10;
    scoreLog.push(`${dwTGGod} in stem: +10`);
  }

  // ── 10. 최종 점수 클램프 및 라벨 ─────────────────────────
  score = Math.max(0, Math.min(100, score));
  const scoreLabel =
    score >= 70 ? 'STABLE -- structurally supportive decade' :
    score >= 50 ? 'ROMANCE-ACTIVE -- connection available, foundation mixed' :
    score >= 30 ? 'UNSTABLE -- friction dominates, careful navigation required' :
                  'DISRUPTION -- structural event trigger present';

  // ── 11. 결혼창/파국 판정 ─────────────────────────────────
  const isDayClash    = events.some(e => e.type === 'RELATIONSHIP_DISRUPTION');
  const isDayCombine  = events.some(e => e.type === 'RELATIONSHIP_OPPORTUNITY' || e.type === 'RELATIONSHIP_BONDING');
  const hasCommitment = events.some(e => e.type === 'COMMITMENT_SIGNAL');
  const noDayClash    = !isDayClash && !natalTensions.dayClashed;

  let mScore = 0;
  if (isGwan)           mScore += 2;
  if (noDayClash)       mScore += 2;
  if (isDayCombine)     mScore += 2;
  if (stemIsYong)       mScore += 1;
  if (score >= 70)      mScore += 1;
  const marriageWindow = (mScore >= 5);
  const relationshipDisruption = isDayClash && (stemIsGi || score < 40);

  // ── 12. 대표 서사 문장 ────────────────────────────────────
  function buildNarrative() {
    const sorted = [...events].sort((a, b) => {
      const order = {
        RELATIONSHIP_DISRUPTION:0, CAREER_DISRUPTION:1,
        TRIPLE_HARMONY_COMPLETE:2, COMMITMENT_SIGNAL:3,
        RELATIONSHIP_OPPORTUNITY:4, PENALTY:5,
        RELATIONSHIP_BONDING:6, BREAKING:7, HARM:8,
        CAREER_ACCELERATION:9, CAREER_LOCK_IN:10,
        RELATIONSHIP_ENTANGLEMENT:11, ENVIRONMENTAL_SHIFT:12,
      };
      return (order[a.type]??99) - (order[b.type]??99);
    });
    if (sorted.length === 0) {
      return `Neutral interaction energy this decade -- no major clashes or combines with the natal chart. The decade operates primarily through elemental balance, shaped by the Yongshin/Gishin ratio.`;
    }
    const top = sorted[0];
    const reactivationSuffix = top.reactivation
      ? ` This is a reactivation of a tension already embedded in the natal chart -- it arrives with amplified force because the fault line was always there.`
      : '';
    return top.label + reactivationSuffix;
  }

  return {
    score, scoreLabel, scoreLog, events,
    marriageWindow, relationshipDisruption,
    isDayClashThisDecade: isDayClash,
    isDayCombineThisDecade: isDayCombine,
    hasCommitmentSignal: hasCommitment,
    narrative: buildNarrative(),
    summary: [
      `Score: ${score}/100 -- ${scoreLabel}`,
      `Breakdown: ${scoreLog.join(' | ')}`,
      events.length > 0 ? `Events: ${events.map(e=>e.type).join(', ')}` : 'No major interactions',
      marriageWindow          ? `★ MARRIAGE WINDOW` : '',
      relationshipDisruption  ? `⚠ RELATIONSHIP DISRUPTION` : '',
      `Narrative: ${buildNarrative()}`,
    ].filter(Boolean).join('\n    '),
  };
}


function buildInteractionAugmentedDaewons(daewonResult, pillars, dayTG, yongshinElem, gishinElem, strengthScore = 0) {
  const natalTensions = analyzeNatalTensions(pillars);

  const augmented = daewonResult.daewons.map(dw => {
    const interaction = analyzeDaewonInteraction(dw, pillars, dayTG, yongshinElem, gishinElem, natalTensions, strengthScore);
    return { ...dw, interaction };
  });

  // 결혼 창 / 파국 창 집계
  const marriageWindows    = augmented.filter(d => d.interaction.marriageWindow);
  const disruptionWindows  = augmented.filter(d => d.interaction.relationshipDisruption);
  const peakInteractions   = augmented.filter(d => d.interaction.score >= 70);
  const criticalPeriods    = augmented.filter(d => d.interaction.score < 30);

  // 재활성화된 대운
  const reactivations = augmented.filter(d =>
    d.interaction.events.some(e => e.reactivation)
  );

  // GPT 주입용 상호작용 텍스트 생성
  const interactionLines = augmented.map(dw => {
    const itr = dw.interaction;
    const TG_HANJA = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const DZ_HANJA = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const TG_EN    = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
    const DZ_EN    = ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai'];
    return (
      `  Age ${dw.age} (${dw.startYear}-${dw.endYear}) ${TG_HANJA[dw.tg]}${DZ_HANJA[dw.dz]}:\n` +
      `    Interaction score: ${itr.score}/100 (${itr.scoreLabel.split('--')[0].trim()})\n` +
      `    ${itr.scoreLog.join(' | ')}\n` +
      `    Key events: ${itr.events.map(e=>e.type).join(', ') || 'none'}\n` +
      `    ${itr.marriageWindow ? '★ MARRIAGE WINDOW' : ''}${itr.relationshipDisruption ? '⚠ DISRUPTION' : ''}\n` +
      `    Narrative: ${itr.narrative}`
    );
  }).join('\n\n');

  const natalStr = [
    natalTensions.clashes.length > 0 ? `Natal clashes: ${natalTensions.clashes.map(c=>`${c.positions.join('-')} (${DZ_NAME[c.dzA]}-${DZ_NAME[c.dzB]}, ${c.severity})`).join(', ')}` : 'No natal clashes',
    natalTensions.combines.length > 0 ? `Natal combines: ${natalTensions.combines.map(c=>`${c.positions.join('-')} → ${c.resultElem}`).join(', ')}` : '',
    natalTensions.penalties.length > 0 ? `Natal penalties: ${natalTensions.penalties.map(p=>p.label).join(', ')}` : '',
  ].filter(Boolean).join('\n');

  return {
    augmented,
    natalTensions,
    marriageWindows,
    disruptionWindows,
    peakInteractions,
    criticalPeriods,
    reactivations,
    // GPT 프롬프트 주입용
    fullContext: `
NATAL-DAEWON INTERACTION ANALYSIS:
${natalStr}

Per-decade interaction scores and events:
${interactionLines}

Summary:
  Marriage windows: ${marriageWindows.length > 0 ? marriageWindows.map(d=>`Age ${d.age} (${d.startYear}-${d.endYear})`).join(', ') : 'None identified'}
  Disruption periods: ${disruptionWindows.length > 0 ? disruptionWindows.map(d=>`Age ${d.age} (${d.startYear}-${d.endYear})`).join(', ') : 'None identified'}
  Reactivations (2× force): ${reactivations.length > 0 ? reactivations.map(d=>`Age ${d.age} (${d.startYear}-${d.endYear})`).join(', ') : 'None'}
  Peak interaction decades: ${peakInteractions.map(d=>`Age ${d.age} (${d.startYear}-${d.endYear})`).join(', ') || 'None'}
  Critical periods: ${criticalPeriods.map(d=>`Age ${d.age} (${d.startYear}-${d.endYear})`).join(', ') || 'None'}

INSTRUCTION: Use this interaction data to augment s10_daewon decade bodies and peakWindow/cautionWindow. 
Every decade that has a marriage window, disruption, or reactivation MUST reference it explicitly.
Do not ignore reactivation events -- these are the "why this decade specifically" moments.
`.trim()
  };
}


// ══════════════════════════════════════════════════════
// WEALTH MODE ENGINE — 재성 구조 기반 독립 판정
// 신강/신약 전략과 절대 섞지 않음. 구조만으로 판정.
// ══════════════════════════════════════════════════════
function calcWealthMode(pillars, dayTG) {

  const TG_ELEM  = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const TG_YY    = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
  const DZ_CHUNG = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
  const JIJANGGAN = {
    0:[{s:9,w:1.0}],
    1:[{s:5,w:1.0},{s:9,w:0.6},{s:7,w:0.3}],
    2:[{s:0,w:1.0},{s:2,w:0.3},{s:4,w:0.2}],
    3:[{s:1,w:1.0}],
    4:[{s:4,w:1.0},{s:1,w:0.6},{s:9,w:0.3}],
    5:[{s:2,w:1.0},{s:4,w:0.6},{s:6,w:0.3}],
    6:[{s:3,w:1.0},{s:5,w:0.3}],
    7:[{s:5,w:1.0},{s:1,w:0.6},{s:3,w:0.3}],
    8:[{s:6,w:1.0},{s:8,w:0.6},{s:4,w:0.3}],
    9:[{s:7,w:1.0}],
    10:[{s:4,w:1.0},{s:7,w:0.6},{s:3,w:0.3}],
    11:[{s:8,w:1.0},{s:0,w:0.3}]
  };

  // 위치 가중치 (문서 설계 기준)
  const POS_WEIGHT = [1.0, 1.5, 1.2, 0.9]; // 年1.0 月1.5 日1.2 時0.9
  // 지장간 내 순서별 가중치 (본기/중기/여기)
  const JJG_RANK_W = {1.0: 0.8, 0.6: 0.5, 0.3: 0.2};

  function getTenGod(tg) {
    const dE=TG_ELEM[dayTG],dY=TG_YY[dayTG],tE=TG_ELEM[tg],tY=TG_YY[tg];
    const gen  ={Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
    const ctrl ={Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
    const ctrlBy={Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
    const genBy ={Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
    if(tE===dE) return tY===dY?'비견':'겁재';
    if(gen[dE]===tE)    return tY===dY?'식신':'상관';
    if(ctrl[dE]===tE)   return tY!==dY?'정재':'편재';
    if(ctrlBy[dE]===tE) return tY!==dY?'정관':'편관';
    if(genBy[dE]===tE)  return tY!==dY?'정인':'편인';
    return '비견';
  }

  // 충 맞은 기둥 인덱스
  const branches = pillars.map(p=>p[1]);
  const clashedIdx = new Set();
  branches.forEach((b,i) => branches.forEach((b2,j) => {
    if(i<j && DZ_CHUNG[b]===b2){ clashedIdx.add(i); clashedIdx.add(j); }
  }));

  let structuredScore = 0;   // 정재
  let opportunisticScore = 0; // 편재

  pillars.forEach(([tg, dz], idx) => {
    const posW       = POS_WEIGHT[idx];
    const clashMult  = clashedIdx.has(idx) ? 0.85 : 1.0; // 충 -15%

    // ── 천간 (일간 자신 제외)
    if(idx !== 2) {
      const god = getTenGod(tg);
      const w   = 1.0 * posW * clashMult; // 천간 기본가중치 1.0
      if(god === '정재') structuredScore     += w;
      if(god === '편재') opportunisticScore  += w;
    }

    // ── 지장간
    const jjg = JIJANGGAN[dz] || [];
    jjg.forEach(({s, w: jW}) => {
      const god     = getTenGod(s);
      const rankW   = JJG_RANK_W[jW] || 0.2;  // 본기 0.8 / 중기 0.5 / 여기 0.2
      const finalW  = rankW * posW * clashMult * 0.6; // 지장간 전체 스케일 0.6
      if(god === '정재') structuredScore     += finalW;
      if(god === '편재') opportunisticScore  += finalW;
    });
  });

  // 월지 득령 보정 +20%
  const moJjg = JIJANGGAN[pillars[1][1]] || [];
  moJjg.forEach(({s}) => {
    const god = getTenGod(s);
    if(god === '정재') structuredScore     *= 1.20;
    if(god === '편재') opportunisticScore  *= 1.20;
  });
  // 재성이 2개 이상 기둥에 등장하면 +10% (존재 기둥 카운팅)
  let structuredPillars = 0, opportunisticPillars = 0;
  pillars.forEach(([tg, dz], idx) => {
    let hasS=false, hasO=false;
    if(idx!==2 && getTenGod(tg)==='정재') hasS=true;
    if(idx!==2 && getTenGod(tg)==='편재') hasO=true;
    (JIJANGGAN[dz]||[]).forEach(({s})=>{
      if(getTenGod(s)==='정재') hasS=true;
      if(getTenGod(s)==='편재') hasO=true;
    });
    if(hasS) structuredPillars++;
    if(hasO) opportunisticPillars++;
  });
  if(structuredPillars >= 2)     structuredScore     *= 1.10;
  if(opportunisticPillars >= 2)  opportunisticScore  *= 1.10;

  // 소수점 2자리 반올림
  structuredScore     = Math.round(structuredScore * 100) / 100;
  opportunisticScore  = Math.round(opportunisticScore * 100) / 100;

  // Mode 판정 — 1.15배 임계값
  let primaryWealthMode, secondaryWealthMode;
  if(opportunisticScore > structuredScore * 1.15) {
    primaryWealthMode   = 'Opportunistic Wealth';
    secondaryWealthMode = structuredScore > 0 ? 'Structured Income' : 'None';
  } else if(structuredScore > opportunisticScore * 1.15) {
    primaryWealthMode   = 'Structured Income';
    secondaryWealthMode = opportunisticScore > 0 ? 'Opportunistic Wealth' : 'None';
  } else {
    primaryWealthMode   = 'Hybrid Wealth Structure';
    secondaryWealthMode = 'None';
  }

  // Volatility Index 계산 (재성 기반 + 구조 리스크)
  const sip = calcSipseongV3(pillars, dayTG);
  const gebjai = sip.total['겁재'] || 0;
  const clashCount = clashedIdx.size;
  let volatilityRaw = opportunisticScore * 10 + gebjai * 8 + clashCount * 10 - structuredScore * 5;
  let volatilityIndex;
  if(volatilityRaw >= 76)      volatilityIndex = 'Extreme';
  else if(volatilityRaw >= 56) volatilityIndex = 'Elevated';
  else if(volatilityRaw >= 31) volatilityIndex = 'Moderate';
  else                         volatilityIndex = 'Low';

  // Archetype 자동 결정 (Wealth Mode 기반)
  let archetype;
  if(primaryWealthMode === 'Opportunistic Wealth') {
    archetype = gebjai > 0.5 ? 'Market Leverager' : 'Strategic Expansionist';
  } else if(primaryWealthMode === 'Structured Income') {
    const gwanTotal = (sip.total['정관']||0) + (sip.total['편관']||0);
    archetype = gwanTotal > 0.5 ? 'Institutional Architect' : 'Structural Builder';
  } else {
    archetype = 'Strategic Expansionist'; // Hybrid 기본값
  }

  // Monetization Activation (식상 기반)
  const sikSangTotal = (sip.total['식신']||0) + (sip.total['상관']||0);
  let monetizationActivation;
  if(sikSangTotal > 1.5)      monetizationActivation = 'High';
  else if(sikSangTotal > 0.5) monetizationActivation = 'Moderate';
  else                        monetizationActivation = 'Low';

  // Authority Pressure (관성 기반)
  const gwanTotal = (sip.total['정관']||0) + (sip.total['편관']||0);
  let authorityPressure;
  if(gwanTotal > 1.5)      authorityPressure = 'High';
  else if(gwanTotal > 0.5) authorityPressure = 'Moderate';
  else                     authorityPressure = 'Low';

  // Authority Pattern
  let authorityPattern;
  const jeonGwan = sip.total['정관']||0;
  const pyeonGwan = sip.total['편관']||0;
  const biGyeon = (sip.total['비견']||0) + (sip.total['겁재']||0);
  if(pyeonGwan > jeonGwan && pyeonGwan > 0.3)        authorityPattern = 'Crisis Performer';
  else if(jeonGwan > pyeonGwan && jeonGwan > 0.3)    authorityPattern = 'Institutional Climber';
  else                                                authorityPattern = 'Independent Operator';

  return {
    primaryWealthMode,
    secondaryWealthMode,
    volatilityIndex,
    monetizationActivation,
    authorityPressure,
    authorityPattern,
    archetype,
    // 디버그용 raw scores
    _scores: { structuredScore, opportunisticScore, structuredPillars, opportunisticPillars }
  };
}


// 궁위 분리 + 십성 번역 + 조합 트리거 + 확률 점수화
// ══════════════════════════════════════════════════════
function calcEventPredictions(augmented, pillars, dayTG, yongshin, gishin, strengthTotal) {

  const TG_ELEM  = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const TG_YY    = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
  const DZ_ELEM  = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
  const DZ_CHUNG = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
  const DZ_HEP   = {0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};
  const YEOKMA   = {0:6,3:6,4:6,7:6,2:9,5:9,6:9,9:9,1:3,8:3,10:3,11:3};

  // 궁위 인덱스
  const YR_DZ  = pillars[0][1]; // 年支 환경/가족
  const MO_DZ  = pillars[1][1]; // 月支 직업/사회
  const DAY_DZ = pillars[2][1]; // 日支 배우자
  const HR_DZ  = pillars[3][1]; // 時支 자녀/투자

  // 십성 계산
  function getStemGod(tg) {
    const dE = TG_ELEM[dayTG], dY = TG_YY[dayTG];
    const tE = TG_ELEM[tg],    tY = TG_YY[tg];
    const gen   = {Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
    const ctrl  = {Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
    const genBy = {Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
    const ctrlBy= {Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
    if (tE===dE) return tY===dY ? 'Self-Expansion Drive (비견)' : 'Competitive Capital (겁재)';
    if (gen[dE]===tE)    return tY===dY ? 'Creative Output (식신)' : 'Disruptive Expression (상관)';
    if (ctrl[dE]===tE)   return tY!==dY ? 'Structured Income (정재)' : 'Opportunistic Wealth (편재)';
    if (ctrlBy[dE]===tE) return tY!==dY ? 'Authority Structure' : 'Power Challenge';
    if (genBy[dE]===tE)  return tY!==dY ? 'Structured Support (정인)' : 'Independent Intelligence (편인)';
    return '비견';
  }

  // 궁위 안정도 — 원국에서 사전 계산
  function palaceStability(palaceDZ) {
    let score = 100;
    // 원국 내 해당 지지와의 충/합 계산
    pillars.forEach(function(p) {
      if (p[1] === palaceDZ) return; // 자기 자신 제외
      if (DZ_CHUNG[p[1]] === palaceDZ) score -= 25;
      if (DZ_HEP[p[1]]   === palaceDZ) score += 8;
    });
    return Math.max(0, Math.min(100, score));
  }

  const dayPalaceStab  = palaceStability(DAY_DZ);  // 배우자궁
  const moPalaceStab   = palaceStability(MO_DZ);   // 직업궁
  const hrPalaceStab   = palaceStability(HR_DZ);   // 투자궁
  const isShinYak      = strengthTotal < 40;

  // 십성 → 이벤트 번역 테이블
  const GOD_EVENTS = {
    '정관': { rel:['Marriage Formalization','Official Commitment'],           career:['Promotion','Official Title','Stable Role'],              money:['Structured Income Contract','Recurring Revenue'] },
    '편관': { rel:['Authority Pressure in Relationship'],                     career:['Competitive Exam','Forced Role Change','Legal Stress'],  money:['Litigation Risk','Pressure-driven Gain'] },
    '정재': { rel:['Relationship Stability','Long-term Bond'],                career:['Salary Increase','Contract Signing'],                    money:['Asset Accumulation','Structured Income Surge'] },
    '편재': { rel:['Attraction Spike','New Encounter Energy'],                career:['Business Expansion','Opportunistic Venture'],            money:['Investment Opportunity','Capital Influx'] },
    '식신': { rel:['Pregnancy Window','Creative Partnership'],                career:['Product Launch','Creative Output Monetized'],            money:['Passive Income Build','Skill-to-Revenue Window'] },
    '상관': { rel:['Relationship Friction','Breakup Risk'],                   career:['Resignation','Public Breakout','Disruptive Move'],       money:['Financial Impulsivity','Influence-driven Revenue'] },
    '정인': { rel:['Support Network Deepens'],                                career:['Degree / Certification','Mentor Arrives'],               money:['Inheritance / Protection','Structured Support Arrives'] },
    '편인': { rel:['Emotional Withdrawal','Isolation Phase'],                 career:['Research Mode','Strategic Retreat'],                     money:['Hidden Resource Discovery','Independent Intelligence Pays Off'] },
    '비견': { rel:['Independence in Relationship','Peer Bond'],               career:['Solo Launch','Self-Expansion Move'],                     money:['Self-Funded Venture','Parallel Income Stream'] },
    '겁재': { rel:['Partnership Conflict','Competitive Tension'],             career:['Aggressive Expansion','Market Rivalry'],                 money:['Financial Drain Risk','Bold Capital Move'] },
  };

  return augmented.map(function(d) {
    const stemGod   = getStemGod(d.tg);
    const stemElem  = TG_ELEM[d.tg];
    const branchElem= DZ_ELEM[d.dz];
    const log       = d.interaction.scoreLog || [];
    const logStr    = log.join(' ');
    const rawScore  = d.interaction.score;
    // 점수 최솟값 10 처리 — 유저에게 0점 노출 방지
    const score     = rawScore < 10 ? rawScore + 10 : rawScore;
    // 20세 미만 / 70세 이상에서 Marriage 이벤트 숨김 (서양 정서)
    const hideMarriage = d.age < 20 || d.age >= 70;

    // ── 궁위 충 분석
    const clashesDay    = DZ_CHUNG[d.dz] === DAY_DZ;   // 배우자궁 충
    const clashesMo     = DZ_CHUNG[d.dz] === MO_DZ;    // 직업궁 충
    const clashesHr     = DZ_CHUNG[d.dz] === HR_DZ;    // 투자궁 충
    const clashesYr     = DZ_CHUNG[d.dz] === YR_DZ;    // 환경궁 충
    const isReactivation= logStr.indexOf('REACTIVATION') > -1;
    const hasYong       = stemElem === yongshin || branchElem === yongshin;
    const hasGi         = stemElem === gishin   || branchElem === gishin;
    const isYeokma      = YEOKMA[YR_DZ] === d.dz || YEOKMA[MO_DZ] === d.dz;
    const hasHarm       = logStr.indexOf('Harm') > -1;
    const hasBreak      = logStr.indexOf('Break') > -1;
    const hasPenalty    = logStr.indexOf('Penalty') > -1;

    // 이 대운의 십성 이벤트 풀
    const godPool = GOD_EVENTS[stemGod] || { rel:[], career:[], money:[] };

    // ── 이벤트 확률 계산 (조합 트리거)
    const events = [];

    // ── 💍 RELATIONSHIP events
    (() => {
      // 결혼 공식화
      let mp = 0;
      if (stemGod === '정관' || stemGod === '정재')     mp += 35;
      if (!clashesDay && dayPalaceStab > 60)            mp += 20;
      if (hasYong)                                       mp += 15;
      if (score > 70)                                    mp += 10;
      if (clashesDay)                                    mp -= 30;
      if (stemGod === '겁재' || stemGod === '상관')      mp -= 20;
      if (mp >= 35 && !hideMarriage) events.push({ cat:'💍', label:'Marriage Formalization Window', prob: Math.min(92, mp), triggers: ['Authority Structure energy active', dayPalaceStab > 60 ? 'Relationship Axis stable' : null, hasYong ? 'Favorable element active' : null].filter(Boolean) });

      // 이별/관계 붕괴
      let bp = 0;
      if (clashesDay)                                    bp += 40;
      if (stemGod === '겁재' || stemGod === '상관')      bp += 25;
      if (hasGi)                                         bp += 15;
      if (hasPenalty || hasHarm)                         bp += 10;
      if (score < 45)                                    bp += 10;
      if (bp >= 35) events.push({ cat:'💔', label:'Break Structure Risk', prob: Math.min(88, bp), triggers: [clashesDay ? 'Day palace clash active' : null, stemGod === '상관' ? 'Expressive Power disrupts bonds' : null, hasGi ? 'Conflict element dominant' : null].filter(Boolean) });

      // 새 만남 에너지
      let np = 0;
      if (stemGod === '편재' || stemGod === '식신')      np += 30;
      if (hasYong && !clashesDay)                        np += 20;
      if (score > 65)                                    np += 15;
      if (np >= 35 && !hideMarriage) events.push({ cat:'❤️', label:'New Attraction Energy', prob: Math.min(85, np), triggers: [stemGod === '편재' ? 'Opportunistic Wealth energizes encounters' : null, hasYong ? 'Favorable element supports openness' : null].filter(Boolean) });

      // 관계 갈등
      let cp = 0;
      if (stemGod === '겁재')                            cp += 30;
      if (hasHarm && dayPalaceStab < 60)                 cp += 25;
      if (cp >= 35) events.push({ cat:'⚡', label:'Partnership Tension', prob: Math.min(80, cp), triggers: ['Competitive Drive introduces tension', hasHarm ? 'Harm pattern creates slow friction' : null].filter(Boolean) });
    })();

    // ── 💼 CAREER events
    (() => {
      // 승진/인정
      let up = 0;
      if (stemGod === '정관' || stemGod === '편관')      up += 30;
      if (hasYong && !clashesMo)                         up += 25;
      if (score > 75)                                    up += 15;
      if (clashesMo && isReactivation)                   up -= 40;
      if (up >= 35) events.push({ cat:'🏆', label:'Career Recognition / Promotion', prob: Math.min(90, up), triggers: [stemGod === '정관' ? 'Authority Structure formalizes status' : null, hasYong ? 'Favorable decade supports authority' : null].filter(Boolean) });

      // 독립/창업
      let lp = 0;
      if (stemGod === '비견' || stemGod === '겁재')      lp += 25;
      if (stemGod === '편재')                            lp += 20;
      if (hasYong)                                       lp += 20;
      if (score > 70)                                    lp += 10;
      if (isShinYak)                                     lp -= 10;
      if (lp >= 35) events.push({ cat:'🚀', label:'Independent Launch / Solo Venture', prob: Math.min(88, lp), triggers: [stemGod === '비견' ? 'Self Drive pushes independence' : null, hasYong ? 'Structural support for solo action' : null].filter(Boolean) });

      // 강제 퇴사/역할 붕괴
      let fp = 0;
      if (clashesMo && isReactivation)                   fp += 50;
      if (clashesMo && !isReactivation)                  fp += 25;
      if (stemGod === '상관')                            fp += 20;
      if (hasGi)                                         fp += 10;
      if (score < 20)                                    fp += 15;
      if (fp >= 30) events.push({ cat:'⚠️', label:'Forced Career Restructuring', prob: Math.min(92, fp), triggers: [clashesMo ? 'Career Axis under pressure' : null, isReactivation ? 'Reactivation of natal tension — higher force' : null, stemGod === '상관' ? 'Expressive Power defies authority' : null].filter(Boolean) });

      // 산업 이동/업종 전환
      let sp = 0;
      if (isYeokma && hasBreak)                          sp += 40;
      if (stemGod === '편인' || stemGod === '정인')      sp += 20;
      if (clashesYr || clashesHr)                        sp += 15;
      if (sp >= 35) events.push({ cat:'🔄', label:'Industry Shift / Reinvention', prob: Math.min(82, sp), triggers: [isYeokma ? 'Movement Star activates' : null, hasBreak ? 'Breaking pattern loosens structures' : null].filter(Boolean) });
    })();

    // ── 💰 MONEY events
    (() => {
      // 자본 유입
      let ip = 0;
      if (stemGod === '편재')                            ip += 35;
      if (stemGod === '정재' && hasYong)                 ip += 25;
      if (score > 70)                                    ip += 10;
      if (hasGi)                                         ip -= 15;
      if (ip >= 30) events.push({ cat:'💰', label:'Capital Influx / Revenue Surge', prob: Math.min(88, ip), triggers: [stemGod === '편재' ? 'Opportunistic Wealth activates income channel' : null, hasYong ? 'Favorable energy accelerates flow' : null].filter(Boolean) });

      // 투자 리스크
      let rp = 0;
      if (stemGod === '겁재' && score > 65)              rp += 35;
      if (clashesHr)                                     rp += 25;
      if (stemGod === '편재' && hasGi)                   rp += 20;
      if (rp >= 30) events.push({ cat:'📉', label:'High Investment Risk / Financial Gamble', prob: Math.min(85, rp), triggers: [stemGod === '겁재' ? 'Competitive Drive amplifies speculative impulse' : null, clashesHr ? 'Financial Axis under pressure' : null].filter(Boolean) });

      // 자산 고정
      let ap = 0;
      if (stemGod === '정재' && !clashesDay)             ap += 30;
      if (score > 60 && !hasGi)                         ap += 20;
      if (ap >= 35) events.push({ cat:'🏦', label:'Asset Consolidation Window', prob: Math.min(82, ap), triggers: ['Structured Income stable — good period for long-term assets'].filter(Boolean) });
    })();

    // ── 🌍 LIFE MOVEMENT events
    (() => {
      // 이주 (국내)
      let rp = 0;
      if (isYeokma)                                      rp += 30;
      if (clashesDay || clashesYr)                       rp += 20;
      if (hasBreak)                                      rp += 15;
      if (rp >= 35) events.push({ cat:'✈️', label:'Relocation Probability', prob: Math.min(80, rp), triggers: [isYeokma ? 'Movement Star activated' : null, clashesDay ? 'Home base destabilized' : null].filter(Boolean) });

      // 고립/재정비
      let ip = 0;
      if (stemGod === '편인')                            ip += 35;
      if (hasGi && score < 45)                           ip += 20;
      if (hasPenalty)                                    ip += 15;
      if (ip >= 35) events.push({ cat:'🌑', label:'Isolation / Strategic Withdrawal', prob: Math.min(80, ip), triggers: [stemGod === '편인' ? 'Adaptive Learning turns inward' : null, hasGi ? 'Conflict element creates friction' : null].filter(Boolean) });

      // 건강 경고
      let hp = 0;
      if (hasGi && (isReactivation || score < 20))       hp += 45;
      if (hasPenalty && score < 40)                      hp += 20;
      if (hp >= 35) events.push({ cat:'🏥', label:'Health Attention Period', prob: Math.min(80, hp), triggers: [isReactivation ? 'Double-force reactivation — physical depletion risk' : null, hasGi ? 'Conflict element dominant' : null].filter(Boolean) });
    })();

    // 확률 낮은 것 제거 & 정렬
    const filtered = events
      .filter(function(ev) { return ev.prob >= 30; })
      .sort(function(a, b) { return b.prob - a.prob; });

    return {
      age:        d.age,
      startYear:  d.startYear,
      endYear:    d.endYear,
      score:      score,        // 10점 미만이면 +10 보정됨
      rawScore:   rawScore,     // 원본 점수 (내부 참조용)
      stemGod:    (function(g){
        var map={'비견':'Self Drive','겁재':'Competitive Drive','식신':'Creative Output','상관':'Expressive Power',
                 '정재':'Structured Wealth','편재':'Opportunistic Wealth','정관':'Authority Structure',
                 '편관':'Power Challenge','정인':'Support & Knowledge','편인':'Adaptive Learning'};
        return map[g] || g;
      })(stemGod),
      stemElem:   stemElem,
      branchElem: branchElem,
      palaceClashes: {
        spouse:  clashesDay  ? 'CLASH' : 'STABLE',
        career:  clashesMo   ? 'CLASH' : 'STABLE',
        invest:  clashesHr   ? 'CLASH' : 'STABLE',
        env:     clashesYr   ? 'CLASH' : 'STABLE',
      },
      isYeokma:   isYeokma,
      events:     filtered,
    };
  });
}

// ══════════════════════════════════════════════════════
// RELATIONAL STRUCTURE PROFILE ENGINE
// 궁합 아님 — 내 관계 구조적 성향 분석
// 상대 필요 없음. 어떤 사주에도 적용.
// ══════════════════════════════════════════════════════
function calcRelationalStructure(pillars, dayTG, strengthResult, sipseongData, hapchung) {

  const scores   = (sipseongData && sipseongData.total) ? sipseongData.total : {};
  const branches = pillars.map(p => p[1]);
  const dayDZ    = pillars[2][1];
  const DZ_CHUNG_LOCAL = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
  const DZ_HEP_LOCAL   = {0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};
  const DZ_XING = [[2,5,8],[3,6,9],[0,7],[1,4,10]]; // 삼형
  const DZ_PO   = [[0,5],[1,10],[2,7],[3,8],[4,9],[6,11]]; // 파

  const clashWith   = DZ_CHUNG_LOCAL[dayDZ];
  const combineWith = DZ_HEP_LOCAL[dayDZ];
  const otherBranches = [branches[0], branches[1], branches[3]];

  const hasClash    = otherBranches.includes(clashWith);
  const hasCombine  = otherBranches.includes(combineWith);
  const hasPo       = DZ_PO.some(([a,b]) => (dayDZ===a && otherBranches.includes(b)) || (dayDZ===b && otherBranches.includes(a)));
  const hasXing     = DZ_XING.some(g => g.includes(dayDZ) && g.some(x => x!==dayDZ && otherBranches.includes(x)));
  // 일지 자형 (辰辰 午午 酉酉 亥亥)
  const selfPenalty = [4,6,9,11].includes(dayDZ) && otherBranches.includes(dayDZ);
  // 월지-일지 충: 사회/사랑 축 갈등
  const moDayClash    = DZ_CHUNG_LOCAL[branches[1]] === dayDZ;

  const resourceScore = (scores['정인']||0) + (scores['편인']||0);
  const rivalScore    = (scores['겁재']||0);
  const gwanScore     = (scores['정관']||0) + (scores['편관']||0);
  const jaeScore      = (scores['정재']||0) + (scores['편재']||0);
  const shikScore     = (scores['식신']||0) + (scores['상관']||0);
  const sangGwan      = (scores['상관']||0);
  const bigyeon       = (scores['비견']||0);
  const clashCount    = (hapchung && hapchung.clashes) ? hapchung.clashes.length : (hasClash ? 1 : 0);
  const isShinYak     = strengthResult && strengthResult.total < 50;

  // ── METRIC 1: Intimate Axis Stability (일지 기반)
  let axisScore = 70;
  if (hasClash)    axisScore -= 25;
  if (hasXing)     axisScore -= 15;
  if (hasPo)       axisScore -= 15;
  if (selfPenalty) axisScore -= 10;
  if (moDayClash)    axisScore -= 10; // 월지-일지 충 (사회/감정 축 분리)
  if (hasCombine)  axisScore += 15;
  if (resourceScore > 0.5) axisScore += 10;
  if (rivalScore > 0.8)    axisScore -= 10;
  axisScore = Math.max(5, Math.min(100, Math.round(axisScore)));

  // ── METRIC 2: Attraction Intensity Index
  let attractionScore = 50;
  if (shikScore > 1.0)  attractionScore += 15;
  if (gwanScore > 0.5)  attractionScore += 10; // 관성 = 강한 끌림 구조
  if (jaeScore  > 1.0)  attractionScore += 10;
  if (hasClash)         attractionScore += 10; // 충 = 강렬한 만남 에너지
  // Fire 과다 체크
  const DZ_ELEM_LOCAL = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
  const TG_ELEM_LOCAL = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const fireCount = branches.filter(b => DZ_ELEM_LOCAL[b]==='Fire').length
                  + pillars.map(p=>p[0]).filter(t => TG_ELEM_LOCAL[t]==='Fire').length;
  if (fireCount >= 3) attractionScore += 5;
  if (sangGwan > 0.8) attractionScore += 8; // 상관 = 강한 매력 발산
  attractionScore = Math.max(10, Math.min(100, Math.round(attractionScore)));

  // ── METRIC 3: Attachment Stability Index
  let attachmentScore = 60;
  if (resourceScore > 0.8)  attachmentScore += 15;
  if (!isShinYak && bigyeon > 0.3) attachmentScore += 10; // 신강 + 비견 = 안정된 자아
  if (rivalScore > 0.8)     attachmentScore -= 15;
  if (sangGwan > 1.0)       attachmentScore -= 10; // 상관 강 = 관계 이탈 에너지
  if (hasClash)             attachmentScore -= 20;
  if (hasPo || hasXing)     attachmentScore -= 8;
  attachmentScore = Math.max(5, Math.min(100, Math.round(attachmentScore)));

  // ── METRIC 4: Commitment Readiness Level (점수화 후 레벨)
  let commitScore = 50;
  if (gwanScore > 0.5)  commitScore += 15; // 관성 = 공식화 에너지
  if (jaeScore  > 0.8)  commitScore += 10;
  if (axisScore > 65)   commitScore += 10;
  if (hasClash)         commitScore -= 25;
  if (sangGwan > 1.0)   commitScore -= 15;
  if (rivalScore > 0.8) commitScore -= 10;
  commitScore = Math.max(0, Math.min(100, Math.round(commitScore)));
  let commitLevel;
  if      (commitScore >= 65) commitLevel = 'Strong';
  else if (commitScore >= 40) commitLevel = 'Conditional';
  else                        commitLevel = 'Not Structurally Supported';

  // ── METRIC 5: Relational Volatility Index
  const opportunisticJae = scores['편재'] || 0;
  let volatilityRaw = 0;
  if (hasClash)             volatilityRaw += 25;
  if (hasPo || hasXing)     volatilityRaw += 10;
  volatilityRaw += rivalScore  * 10;
  volatilityRaw += opportunisticJae * 8;
  volatilityRaw += sangGwan    * 8;
  volatilityRaw -= (scores['정재']||0) * 5;
  volatilityRaw -= resourceScore * 5;
  volatilityRaw = Math.max(0, Math.round(volatilityRaw));
  let volatilityLevel;
  if      (volatilityRaw >= 76) volatilityLevel = 'Structural Risk';
  else if (volatilityRaw >= 56) volatilityLevel = 'Elevated';
  else if (volatilityRaw >= 31) volatilityLevel = 'Moderate';
  else                          volatilityLevel = 'Low';

  // ── Structural Notes (자동 생성)
  const notes = [];
  if (hasClash)         notes.push('Intimate Axis under active clash');
  if (hasXing)          notes.push('Penalty pattern on Intimate Axis');
  if (hasPo)            notes.push('Breaking pattern — slow erosion of connection');
  if (rivalScore > 0.8) notes.push('Competitive Capital (겁재) present — rivalry energy in relationships');
  if (sangGwan > 0.8)   notes.push('Disruptive Expression (상관) strong — high independence drive');
  if (resourceScore < 0.3) notes.push('Support element limited — self-reliance over nurturing');
  if (hasCombine)       notes.push('Intimate Axis harmonized — capacity for deep bonding');
  if (gwanScore > 1.0)  notes.push('Authority star present — drawn to structured commitment');

  // ── Emotional Depth (resource + water element 기반)
  const TG_ELEM_LOC = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const DZ_ELEM_LOC = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
  const waterCount = pillars.filter(([tg,dz]) => TG_ELEM_LOC[tg]==='Water').length
                   + pillars.filter(([tg,dz]) => DZ_ELEM_LOC[dz]==='Water').length;
  let emotionalDepth = 50;
  emotionalDepth += resourceScore * 15;
  emotionalDepth += waterCount * 8;
  if (isShinYak) emotionalDepth += 8; // 신약 = 감수성 높음
  if (hasClash)  emotionalDepth -= 10;
  emotionalDepth = Math.max(10, Math.min(95, Math.round(emotionalDepth)));

  // ── Relationship Volatility Index (0-100 숫자 버전)
  let volatilityScore = 20;
  if (hasClash)        volatilityScore += 30;
  if (hasXing)         volatilityScore += 15;
  if (hasPo)           volatilityScore += 10;
  volatilityScore += rivalScore * 12;
  volatilityScore += sangGwan  * 10;
  volatilityScore += (scores['편재']||0) * 8;
  volatilityScore -= resourceScore * 8;
  volatilityScore -= (scores['정재']||0) * 5;
  volatilityScore = Math.max(5, Math.min(95, Math.round(volatilityScore)));
  let volatilityLabel;
  if      (volatilityScore >= 70) volatilityLabel = 'High';
  else if (volatilityScore >= 45) volatilityLabel = 'Moderate';
  else                            volatilityLabel = 'Low';

  // ════════════════════════════════════════════════
  // LOVE PATTERN — 4-axis system (20+ combinations)
  // Axis 1: Attraction Driver
  // Axis 2: Stability Source
  // Axis 3: Intimacy Style
  // Axis 4: Relationship Risk
  // + Day Branch modifier
  // ════════════════════════════════════════════════

  // 십성 점수를 0-100 normalized로 변환 (비교 용이)
  const normO  = Math.min(100, shikScore  * 50);   // 식상 합산
  const normR  = Math.min(100, resourceScore * 50); // 인성 합산
  const normW  = Math.min(100, jaeScore    * 50);   // 재성 합산
  const normA  = Math.min(100, gwanScore   * 50);   // 관성 합산
  const normP  = Math.min(100, (bigyeon + rivalScore) * 40); // 비겁 합산

  // relative dominant: 가장 높은 에너지 파악
  const energyVec = { O: normO, R: normR, W: normW, A: normA, P: normP };
  const sorted = Object.entries(energyVec).sort((a,b) => b[1]-a[1]);
  const dom1  = sorted[0][0]; // 1위
  const dom2  = sorted[1][0]; // 2위
  const dom1v = sorted[0][1];
  const dom2v = sorted[1][1];

  // ─── Axis 1: Attraction Driver (누구에게 끌리나)
  // 단순 threshold 아닌 relative dominance 기반
  let attractionType;
  if (dom1 === 'O' && dom1v >= 30) {
    attractionType = sangGwan > 0.6
      ? 'Rebellious & Unconventional'    // 상관 강 = 파격적인 사람에게 끌림
      : 'Expressive & Charismatic';
  } else if (dom1 === 'P' && dom1v >= 25) {
    attractionType = rivalScore > 0.6
      ? 'Competitive & Driven'           // 겁재 강 = 경쟁심 있는 상대에게 끌림
      : 'Independent & Self-Directed';
  } else if (dom1 === 'W' && dom1v >= 25) {
    attractionType = (scores['편재']||0) > 0.5
      ? 'Exciting & Unpredictable'       // 편재 강 = 자유롭고 예측불가한 사람
      : 'Ambitious & Success-Oriented';
  } else if (dom1 === 'A' && dom1v >= 25) {
    attractionType = (scores['편관']||0) > 0.5
      ? 'Intense & Commanding'           // 편관 강 = 강렬하고 카리스마 있는 사람
      : 'Reliable & Responsible';
  } else if (dom1 === 'R' && dom1v >= 25) {
    attractionType = (scores['편인']||0) > 0.5
      ? 'Intellectual & Unconventional'  // 편인 강 = 독특하고 지적인 사람
      : 'Nurturing & Emotionally Safe';
  } else {
    // 에너지 분산형 — 2위까지 함께 반영
    if (dom1 === 'O' || dom2 === 'O') attractionType = 'Creative & Stimulating';
    else if (dom1 === 'W' || dom2 === 'W') attractionType = 'Confident & Goal-Oriented';
    else attractionType = 'Steady & Grounded';
  }

  // Day Branch modifier on attraction
  if (hasCombine && attractionType.includes('Independent')) {
    attractionType = 'Deeply Bonding & Devoted';  // 일지합 = 깊은 attachment 추구
  }
  if (hasClash && (dom1 === 'O' || dom1 === 'P')) {
    attractionType = 'Intense & Chemistry-Driven'; // 충 + 식상/비겁 = 강렬한 화학반응
  }

  // ─── Axis 2: Stability Source (실제 장기 안정 파트너)
  // 신약도 지배 에너지에 따라 세분화
  let stabilityType;
  if (isShinYak) {
    // 신약이라도 어떤 에너지가 지배하는지 반영
    if (normW >= 60 && normA >= 50) {
      stabilityType = 'Ambitious & Structured';       // 재성+관성 강 신약 → 성취형 파트너
    } else if (normW >= 60) {
      stabilityType = 'Practical & Empowering';       // 재성 강 신약 → 현실적 지원자
    } else if (normA >= 60) {
      stabilityType = 'Grounding & Dependable';       // 관성 강 신약 → 안정적 책임감
    } else if (normR >= 50 && normO >= 30) {
      stabilityType = 'Intellectually Nurturing';     // 인성+식상 → 지적이고 따뜻한
    } else if (normO >= 50) {
      stabilityType = 'Expressive & Emotionally Safe'; // 식상 강 신약
    } else {
      stabilityType = 'Supportive & Emotionally Present'; // 기본 신약
    }
  } else if (normA >= 35 && normA >= normR) {
    stabilityType = (scores['정관']||0) >= (scores['편관']||0)
      ? 'Structured & Committed'         // 정관 우세 = 공식적 헌신
      : 'Protective & Strong-Willed';    // 편관 우세 = 보호적이지만 강함
  } else if (normR >= 35) {
    stabilityType = (scores['정인']||0) >= (scores['편인']||0)
      ? 'Nurturing & Dependable'         // 정인 = 따뜻한 지지
      : 'Intellectually Stimulating';    // 편인 = 정서보다 지적 자극
  } else if (normW >= 35) {
    stabilityType = 'Practical & Growth-Oriented';
  } else if (normP >= 35) {
    stabilityType = 'Equal & Non-Controlling';
  } else {
    // 에너지 균형형 — 지배 에너지 부족한 것 기반
    const lowest = sorted[sorted.length-1][0];
    if (lowest === 'R') stabilityType = 'Emotionally Steady & Caring';
    else if (lowest === 'A') stabilityType = 'Free-Spirited & Accepting';
    else stabilityType = 'Calm & Consistent';
  }

  // Day Branch modifier on stability
  if (hasCombine)   stabilityType += ' (深 bonding potential)';
  if (hasClash)     stabilityType = stabilityType.split(' (')[0] + ' — but hard to sustain';
  if (hasPo)        stabilityType = stabilityType.split(' (')[0].split(' — ')[0] + ' — connection erodes slowly';

  // ─── Axis 3: Intimacy Style (관계 내 행동 방식)
  let intimacyStyle;
  if (normP >= 40 && normP >= normA) {
    intimacyStyle = 'independence-oriented';
  } else if (normR >= 35 && (isShinYak || resourceScore > 0.4)) {
    intimacyStyle = 'emotionally bonded';
  } else if (normA >= 35) {
    intimacyStyle = 'commitment-focused';
  } else if (normO >= 35) {
    intimacyStyle = sangGwan > 0.5 ? 'unconventionally expressive' : 'warmly expressive';
  } else if (normW >= 35) {
    intimacyStyle = 'pragmatic & goal-aligned';
  } else {
    intimacyStyle = hasClash ? 'intense but unstable' : 'adaptable & measured';
  }

  // ─── Axis 4: Relationship Risk (구조적 취약점)
  let relationshipRisk;
  if (hasClash && normO >= 30) {
    relationshipRisk = 'Attraction-driven choices override compatibility';
  } else if (hasClash) {
    relationshipRisk = 'Relational foundation under structural tension';
  } else if (normP >= 50 && normA <= 25) {
    relationshipRisk = 'Power balance struggles — independence vs intimacy';
  } else if (normO >= 50 && normA <= 25) {
    relationshipRisk = 'Passion without long-term structure';
  } else if (normW >= 50 && normR <= 20) {
    relationshipRisk = 'Transactional dynamics over emotional depth';
  } else if (normR <= 20 && (clashCount >= 2 || (gwanScore + jaeScore) > 1.5)) {
    relationshipRisk = 'Emotional depletion under sustained pressure';
  } else if (normA >= 55 && normO <= 20) {
    relationshipRisk = 'Control or rigidity suppresses spontaneity';
  } else if (hasPo) {
    relationshipRisk = 'Slow erosion of connection over time';
  } else if (hasXing) {
    relationshipRisk = 'Recurring friction in close relationships';
  } else if (rivalScore > 0.6 && normP >= 35) {
    relationshipRisk = 'Competitive energy creates tension with partners';
  } else {
    relationshipRisk = isShinYak
      ? 'Over-reliance on external emotional support'
      : 'Expectation mismatch in long-term commitment';
  }

  // ════════════════════════════════════════════════════════
  // LOVE ARCHETYPE ENGINE
  // Attraction Archetype (40-library) + Behavior + Stability
  // ════════════════════════════════════════════════════════

  // ─── Attraction Archetype (dom1 + 正/偏 세분화)
  const sangGwanRatio = shikScore > 0 ? sangGwan / shikScore : 0;
  const peonJaeRatio  = jaeScore  > 0 ? (scores['편재']||0) / jaeScore : 0;
  const peonGwanRatio = gwanScore > 0 ? (scores['편관']||0) / gwanScore : 0;
  const peonInRatio   = resourceScore > 0 ? (scores['편인']||0) / resourceScore : 0;
  const geobJaeRatio  = (bigyeon + rivalScore) > 0 ? rivalScore / (bigyeon + rivalScore) : 0;

  let attractionArchetype;
  if (dom1 === 'O') {
    if (sangGwanRatio >= 0.5) {
      // 상관 강 — 파격적, 독창적인 사람에게 끌림
      attractionArchetype = normO >= 60
        ? { label: 'Rebellious & Unconventional', desc: 'Black Cat Energy', behavior: 'You\'re drawn to those who break the mold — edgy, contrarian, and unapologetically themselves.' }
        : { label: 'Creative Thinker', desc: 'Artistic Creative', behavior: 'You gravitate toward people with a distinct aesthetic and original perspective on life.' };
    } else {
      // 식신 강 — 따뜻하고 표현적인 사람에게 끌림
      attractionArchetype = normO >= 60
        ? { label: 'Warm & Expressive', desc: 'Golden Retriever Energy', behavior: 'You\'re drawn to people who are openly affectionate, enthusiastic, and emotionally generous.' }
        : { label: 'Curious Philosopher', desc: 'Deep Conversation Partner', behavior: 'You\'re attracted to people who think deeply and engage in meaningful dialogue.' };
    }
  } else if (dom1 === 'W') {
    if (peonJaeRatio >= 0.5) {
      // 편재 강 — 자유롭고 역동적인 사람에게 끌림
      attractionArchetype = normW >= 60
        ? { label: 'Charming & Unpredictable', desc: 'Urban Sophisticate', behavior: 'You\'re pulled toward people who radiate confidence and move through the world with ease and magnetism.' }
        : { label: 'Outdoorsy Adventurer', desc: 'Travel Partner', behavior: 'You\'re drawn to spontaneous, experience-driven people who keep life interesting.' };
    } else {
      // 정재 강 — 성취지향, 안정된 사람에게 끌림
      attractionArchetype = normW >= 60
        ? { label: 'Empire Builder', desc: 'Career-Driven Achiever', behavior: 'You\'re attracted to people who are building something — ambitious, focused, and financially capable.' }
        : { label: 'Financially Stable Partner', desc: 'Disciplined Leader', behavior: 'You\'re drawn to partners with clear direction and the discipline to back it up.' };
    }
  } else if (dom1 === 'A') {
    if (peonGwanRatio >= 0.5) {
      // 편관 강 — 강렬하고 카리스마 있는 사람에게 끌림
      attractionArchetype = normA >= 60
        ? { label: 'Intense & Commanding', desc: 'Power Couple Energy', behavior: 'You\'re drawn to people with undeniable presence — magnetic, demanding, and hard to ignore.' }
        : { label: 'Strategic Thinker', desc: 'High Performer', behavior: 'You\'re attracted to people who think ten steps ahead and operate with precision.' };
    } else {
      // 정관 강 — 신뢰감, 책임감 있는 사람에게 끌림
      attractionArchetype = normA >= 60
        ? { label: 'Reliable Protector', desc: 'Soft Protector', behavior: 'You\'re drawn to people who make you feel secure — steady, responsible, and consistent in how they show up.' }
        : { label: 'Disciplined Leader', desc: 'Structured Reliability', behavior: 'You\'re attracted to people with strong personal standards and quiet dependability.' };
    }
  } else if (dom1 === 'R') {
    if (peonInRatio >= 0.5) {
      // 편인 강 — 지적이고 독특한 사람에게 끌림
      attractionArchetype = normR >= 60
        ? { label: 'Mysterious Introvert', desc: 'Quiet Observer', behavior: 'You\'re drawn to people with hidden depth — reserved on the surface, complex underneath.' }
        : { label: 'Bookish Intellectual', desc: 'Deep Conversation Partner', behavior: 'You\'re attracted to people who are knowledgeable, thoughtful, and take ideas seriously.' };
    } else {
      // 정인 강 — 따뜻하고 안전한 사람에게 끌림
      attractionArchetype = normR >= 60
        ? { label: 'Emotionally Safe Partner', desc: 'High Emotional Intelligence', behavior: 'You\'re drawn to people who are emotionally attuned, patient, and genuinely nurturing.' }
        : { label: 'Supportive Cheerleader', desc: 'Gentle Caretaker', behavior: 'You\'re attracted to people who show up for others — warm, encouraging, and low-drama.' };
    }
  } else {
    // dom1 === 'P' (비겁)
    if (geobJaeRatio >= 0.5) {
      // 겁재 강 — 강하고 경쟁적인 사람에게 끌림
      attractionArchetype = normP >= 50
        ? { label: 'Black Cat Energy', desc: 'Lone Wolf Type', behavior: 'You\'re drawn to people with fierce independence — self-possessed, a little guarded, and not easily impressed.' }
        : { label: 'Quick-Witted Debater', desc: 'Sarcastic Humor Type', behavior: 'You\'re attracted to people with sharp wit and a playfully competitive edge.' };
    } else {
      // 비견 강 — 독립적이고 대등한 파트너
      attractionArchetype = normP >= 50
        ? { label: 'Emotionally Independent Partner', desc: 'Minimalist Personality', behavior: 'You\'re drawn to people who don\'t need you — self-sufficient, unbothered, and clear about who they are.' }
        : { label: 'Equal & Autonomous', desc: 'Low-Key Chill Partner', behavior: 'You\'re attracted to people who respect your space and don\'t try to complete you.' };
    }
  }

  // Day Branch modifier on archetype
  if (hasClash && (dom1 === 'O' || dom1 === 'P')) {
    attractionArchetype = { label: 'Intense Chemistry First', desc: 'Charming Chaos', behavior: 'You\'re drawn to people who create immediate electric tension — the kind you feel before you can explain it.' };
  }
  if (hasCombine && dom1 === 'R') {
    attractionArchetype = { label: 'Deeply Bonding & Devoted', desc: 'Princess Treatment Partner', behavior: 'You\'re drawn to partners who are all-in from the start — devoted, attentive, and emotionally generous.' };
  }

  // ─── Relationship Behavior Pattern
  let relationshipBehavior;
  if (normO >= 50 && normA <= 30) {
    relationshipBehavior = 'You move fast emotionally and express yourself openly. You create intensity early on — but can struggle when the initial spark settles into routine.';
  } else if (normP >= 50 && normA <= 30) {
    relationshipBehavior = 'You value independence inside relationships and need significant personal space. You care deeply but show it indirectly — which partners can misread as emotional distance.';
  } else if (normA >= 50 && normO <= 25) {
    relationshipBehavior = 'You approach relationships with structure and expectation. You invest heavily when committed, but you hold partners to high standards — sometimes without articulating them clearly.';
  } else if (normW >= 50 && normR <= 25) {
    relationshipBehavior = 'You approach relationships practically — you notice what\'s working and what isn\'t. You\'re drawn to partners who match your ambition, but you can deprioritize emotional connection when focused on goals.';
  } else if (normR >= 50 && isShinYak) {
    relationshipBehavior = 'You invest deeply in the people you let in. You\'re an attentive partner who picks up on emotional undercurrents — but you can over-invest early and feel drained when the energy isn\'t returned.';
  } else if (hasClash) {
    relationshipBehavior = 'Your relationship energy runs hot and disruptive. You attract intense connections and are drawn to people who challenge you — but stability requires conscious effort against your natural pull toward friction.';
  } else if (normO >= 35 && normR >= 35) {
    relationshipBehavior = 'You bring both warmth and depth to relationships. You\'re expressive and emotionally present, and you genuinely invest in understanding your partner. The risk is over-giving before the relationship has earned it.';
  } else {
    relationshipBehavior = 'You take time to open up fully, but your commitment once given is solid. You\'re selective about who gets access to your inner world — and that selectivity usually serves you well.';
  }

  // ─── Stability Archetype (dom1 + 결핍 에너지 역산)
  // "지배 에너지의 반대"가 안정의 원천
  let stabilityArchetype;
  const structuralDeficit = sorted[sorted.length-1][0];

  if (dom1 === 'O' && normR <= 50) {
    stabilityArchetype = { label: 'Emotionally Grounding', desc: 'Your chart stabilizes with partners who are calm and steady — people who don\'t match your intensity but absorb it without breaking.' };
  } else if (dom1 === 'O' && normA <= 40) {
    stabilityArchetype = { label: 'Quietly Reliable', desc: 'Long-term stability comes from partners who bring structure to your expressiveness — grounded, consistent, and not easily rattled.' };
  } else if (dom1 === 'P' && normR <= 45) {
    stabilityArchetype = { label: 'Warm & Non-Competitive', desc: 'You stabilize with partners who bring genuine warmth without competing for space — emotionally generous and unbothered by your independence.' };
  } else if (dom1 === 'P') {
    stabilityArchetype = { label: 'Non-Controlling & Accepting', desc: 'You stabilize with partners who give you room to operate — supportive without being directive, present without being possessive.' };
  } else if (dom1 === 'W' && normR <= 50) {
    stabilityArchetype = { label: 'Emotionally Intelligent', desc: 'Your chart finds its footing with partners who bring emotional depth and patience — people who slow you down in the best way.' };
  } else if (dom1 === 'W' && normO <= 35) {
    stabilityArchetype = { label: 'Expressive & Playful', desc: 'Long-term stability comes from partners who bring lightness and spontaneity — keeping the relationship from becoming too transactional.' };
  } else if (dom1 === 'A' && normO <= 30) {
    stabilityArchetype = { label: 'Free-Spirited & Warm', desc: 'Your chart stabilizes with partners who bring warmth and spontaneity — people who soften your structure and add genuine joy to the dynamic.' };
  } else if (dom1 === 'A') {
    stabilityArchetype = { label: 'Intellectually Stimulating', desc: 'Your chart stabilizes with partners who engage your mind — curious, well-read, and able to hold their own in deep conversation.' };
  } else if (dom1 === 'R' && normO <= 35) {
    stabilityArchetype = { label: 'Expressive & Energizing', desc: 'You stabilize with partners who draw you out — expressive, warm, and comfortable with emotional openness.' };
  } else if (dom1 === 'R' && isShinYak) {
    stabilityArchetype = { label: 'Supportive & Consistent', desc: 'Your chart stabilizes with partners who are reliably present — emotionally available, patient, and genuinely invested in your growth.' };
  } else if (dom1 === 'R') {
    stabilityArchetype = { label: 'Ambitious & Energizing', desc: 'You stabilize with partners who are goal-oriented and lively — people who complement your depth with forward momentum.' };
  } else {
    stabilityArchetype = { label: 'Steady & Dependable', desc: 'Your chart finds its footing with partners who bring consistency — people who do what they say and show up the same way every time.' };
  }

  // ─── Radical Honesty — Core + Type + Soft Layer
  // Type 매핑 → GPT에 soft reinforcement 선택 전달
  const RADICAL_HONESTY_SOFT = {
    attraction_intensity: [
      'You sometimes confuse the feeling of excitement with the feeling of being understood.',
      'Attraction can feel like compatibility — but they measure different things.',
      'The people who excite you most aren\'t always the ones who show up consistently.'
    ],
    independence_intimacy: [
      'Sometimes partners struggle to know where they stand because you process things privately.',
      'You can want closeness while still guarding parts of yourself.',
      'Letting someone see your uncertainty may feel uncomfortable, even when it would deepen intimacy.'
    ],
    transactional_depth: [
      'You tend to believe relationships should naturally balance themselves.',
      'When relationships become unbalanced, you might notice it later than others.',
      'In reality, emotional reciprocity sometimes requires clearer asks than you initially make.'
    ],
    communication_expectation: [
      'Sometimes you expect people to understand what you need without clearly saying it.',
      'You assume emotional signals are obvious when they may not be.',
      'You often communicate expectations indirectly — and feel the gap when they\'re missed.'
    ],
    hidden_commitment: [
      'Partners may not always realize how deeply something affected you.',
      'You carry more emotional weight internally than most people around you realize.',
      'The version of the relationship in your head is sometimes stronger than the one being experienced.'
    ],
    unexpressed_expectation: [
      'When effort feels one-sided, it can affect your enthusiasm quietly.',
      'You value partners who show consistent effort — but rarely say so directly.',
      'Mutual engagement matters deeply to you, even when you don\'t name it.'
    ],
    over_investment: [
      'You can move emotionally faster than some partners expect.',
      'When a relationship slows down, you may start questioning whether it still works.',
      'You sometimes interpret pauses in emotional intensity as loss of connection.'
    ],
    giving_imbalance: [
      'You often give emotional energy generously and hope it will be matched naturally.',
      'When that reciprocity doesn\'t happen, disappointment can build quietly.',
      'You tend to assume that shared emotional depth should come naturally in relationships.'
    ],
    recurring_friction: [
      'You may replay conversations internally instead of resolving them out loud.',
      'When communication breaks down, you sometimes withdraw rather than repair the conversation.',
      'Small misalignments can accumulate before they\'re addressed.'
    ],
    slow_erosion: [
      'You might wait too long before expressing dissatisfaction in a relationship.',
      'The warning signs are usually there earlier than they\'re caught.',
      'Early renegotiation tends to work better for you than patient waiting.'
    ],
    depth_withheld: [
      'Early in relationships, you may hold back more than the other person realizes.',
      'You tend to open up in layers — which can read as distance before it reads as depth.',
      'The tendency to wait until someone has proven themselves can close doors quietly.'
    ],
    stability_gap: [
      'Your chart supports long-term connection, but who excites you and who sustains you aren\'t always the same person.',
      'The gap between initial attraction and lasting compatibility is where most friction originates.',
      'Deliberate alignment between what draws you in and what actually works is worth developing.'
    ]
  };

  // ─── Attraction–Stability Gap Library (엔진 선택)
  // attractionArchetype.label vs stabilityArchetype.label 기반 Gap 유형 결정
  const GAP_LIBRARY = {
    intensity_vs_steady: 'Emotional excitement draws you in quickly. But long-term stability usually comes from partners who are calm and steady — the ones who don\'t spike your adrenaline but never disappear either.',
    mystery_vs_transparency: 'The partners who intrigue you first are often the ones who reveal themselves slowly. Yet your chart stabilizes with people who are emotionally transparent — present, direct, and readable.',
    charisma_vs_reliability: 'Charismatic personalities tend to catch your attention first. But the relationships that last involve partners who are dependable rather than dazzling.',
    ambition_vs_warmth: 'You\'re drawn to people who are building something and moving fast. But what actually creates stability is warmth and emotional availability — qualities that don\'t always come packaged with ambition.',
    independence_vs_support: 'You\'re drawn to independent personalities who don\'t need you. Yet emotional support and consistent presence are what your chart actually stabilizes with.',
    complexity_vs_clarity: 'Emotional complexity can feel fascinating early on. But the healthiest relationships for you tend to involve emotional clarity — partners who say what they mean and mean what they say.',
    intellect_vs_presence: 'Intellectual compatibility draws you in quickly. But emotional presence — someone who is fully there, not just smart — is what stabilizes the relationship over time.',
    momentum_vs_patience: 'Fast emotional momentum can feel like a sign of rightness. But relationships that begin more slowly often prove more structurally stable for your chart.',
    expressive_vs_grounded: 'You\'re drawn to people who are warm and openly expressive. But long-term stability comes from partners who are grounded and consistent — people who bring steadiness to your expressiveness.',
    default: 'The type of person who initially attracts you and the type who actually creates stability in your chart don\'t always overlap. That gap is worth knowing about.'
  };

  // Gap 유형 선택 로직
  let attractionGapKey;
  const aLabel = attractionArchetype.label;
  const sLabel = stabilityArchetype.label;

  if (hasClash && (dom1 === 'O' || dom1 === 'P')) {
    attractionGapKey = 'intensity_vs_steady';
  } else if (aLabel.includes('Mysterious') || aLabel.includes('Intellectual') || aLabel.includes('Bookish')) {
    attractionGapKey = sLabel.includes('Consistent') || sLabel.includes('Grounding') ? 'mystery_vs_transparency' : 'intellect_vs_presence';
  } else if (aLabel.includes('Charming') || aLabel.includes('Intense') || aLabel.includes('Black Cat')) {
    attractionGapKey = 'charisma_vs_reliability';
  } else if (aLabel.includes('Empire') || aLabel.includes('Career') || aLabel.includes('Strategic') || aLabel.includes('Ambitious')) {
    attractionGapKey = sLabel.includes('Playful') || sLabel.includes('Expressive') ? 'ambition_vs_warmth' : 'charisma_vs_reliability';
  } else if (aLabel.includes('Independent') || aLabel.includes('Lone Wolf') || aLabel.includes('Black Cat')) {
    attractionGapKey = 'independence_vs_support';
  } else if (aLabel.includes('Warm') || aLabel.includes('Golden Retriever') || aLabel.includes('Expressive')) {
    attractionGapKey = sLabel.includes('Reliable') || sLabel.includes('Consistent') ? 'expressive_vs_grounded' : 'momentum_vs_patience';
  } else if (aLabel.includes('Rebellious') || aLabel.includes('Unconventional')) {
    attractionGapKey = 'complexity_vs_clarity';
  } else {
    attractionGapKey = 'default';
  }
  const attractionStabilityGap = GAP_LIBRARY[attractionGapKey];

  // ─── Radical Honesty core 선택
  let radicalHonesty;
  let radicalHonestyType;

  if (hasClash && (dom1 === 'O' || dom1 === 'P')) {
    radicalHonesty = 'The people who create the most electricity for you are often the least structurally compatible. You\'re wired to chase intensity — but intensity and stability pull in opposite directions in your chart.';
    radicalHonestyType = 'attraction_intensity';
  } else if (normO >= 50 && normA <= 25) {
    radicalHonesty = 'You often confuse emotional excitement with emotional compatibility. The relationships that feel most alive early on are not always the ones built to last.';
    radicalHonestyType = 'attraction_intensity';
  } else if (normP >= 50 && normR <= 25) {
    radicalHonesty = 'Your need for independence can look like emotional unavailability to partners who want closeness. What you experience as healthy distance, they may experience as being kept at arm\'s length.';
    radicalHonestyType = 'independence_intimacy';
  } else if (normW >= 50 && normR <= 25) {
    radicalHonesty = 'You evaluate relationships in part by what they produce — whether practically, socially, or professionally. The risk is deprioritizing emotional depth until it becomes a problem you can\'t optimize your way out of.';
    radicalHonestyType = 'transactional_depth';
  } else if (normA >= 55 && normO <= 20) {
    radicalHonesty = 'You hold relationships to high internal standards that you don\'t always communicate. Partners end up confused — performing against rules they were never given.';
    radicalHonestyType = 'communication_expectation';
  } else if (normW >= 65 && normA >= 65 && normO <= 30) {
    radicalHonesty = 'You can be intensely committed without showing it in ways your partner can actually feel. The relationship exists as a priority in your mind long before it shows up in your behavior.';
    radicalHonestyType = 'hidden_commitment';
  } else if (normW >= 55 && normA >= 55 && normR >= 50) {
    radicalHonesty = 'You know exactly what you want from a relationship but rarely say it outright — expecting partners to intuit it. The gap between what you want and what you ask for creates recurring disappointment.';
    radicalHonestyType = 'unexpressed_expectation';
  } else if (isShinYak && normR >= 50 && normO >= 35) {
    radicalHonesty = 'You\'re more emotionally expressive than you realize — and you can over-invest before a relationship has proven itself. The intensity you bring early can overwhelm people who need more time to warm up.';
    radicalHonestyType = 'over_investment';
  } else if (isShinYak && normR >= 50) {
    radicalHonesty = 'You give more in relationships than you ask for in return — and you often don\'t notice the imbalance until you\'re already depleted. Receiving is a skill your chart actively needs to develop.';
    radicalHonestyType = 'giving_imbalance';
  } else if (hasXing) {
    radicalHonesty = 'There\'s a recurring friction pattern in your close relationships — small conflicts that keep resurfacing. This isn\'t about the other person. It\'s a structural tension that follows you across different relationships.';
    radicalHonestyType = 'recurring_friction';
  } else if (hasPo) {
    radicalHonesty = 'Your relationships tend to erode slowly rather than break dramatically. Things look fine on the surface until they suddenly aren\'t. The warning signs are there earlier than you usually catch them.';
    radicalHonestyType = 'slow_erosion';
  } else {
    radicalHonesty = isShinYak
      ? 'You\'re more capable of depth in relationships than you often show. The tendency to hold back early — waiting to see if the person is safe — means you sometimes miss windows that won\'t reopen.'
      : 'Your chart supports long-term stability, but you need deliberate alignment between who excites you and who actually sustains you. The gap between those two is where most of your relationship friction originates.';
    radicalHonestyType = isShinYak ? 'depth_withheld' : 'stability_gap';
  }

  // Soft layer: type 기반으로 첫 번째 문장 선택
  const radicalHonestySoft = (RADICAL_HONESTY_SOFT[radicalHonestyType] || RADICAL_HONESTY_SOFT['stability_gap'])[0];

  // legacy fields 유지 (기존 HTML rendering과 호환)
  const attractionTypeCompat = attractionArchetype.label;
  const stabilityTypeCompat  = stabilityArchetype.label;

  return {
    intimateAxisStability:  axisScore,
    attractionIntensity:    attractionScore,
    attachmentStability:    attachmentScore,
    emotionalDepth,
    commitmentReadiness:    commitLevel,
    commitmentScore:        commitScore,
    relationalVolatility:   volatilityLevel,
    volatilityScore,
    volatilityLabel,
    attractionType:         attractionTypeCompat,
    stabilityType:          stabilityTypeCompat,
    intimacyStyle,
    relationshipRisk,
    stabilityTypeFull:      stabilityType,
    // Love Archetype fields
    attractionArchetypeLabel:  attractionArchetype.label,
    attractionArchetypeDesc:   attractionArchetype.desc,
    attractionArchetypeBehavior: attractionArchetype.behavior,
    stabilityArchetypeLabel:   stabilityArchetype.label,
    stabilityArchetypeDesc:    stabilityArchetype.desc,
    relationshipBehavior,
    radicalHonesty,
    radicalHonestyType,
    radicalHonestySoft,
    attractionStabilityGap,
    structuralNotes:        notes,
    hasClash, hasCombine, hasPo, hasXing,
    _flags: { hasClash, hasCombine, hasPo, hasXing, rivalScore, sangGwan, resourceScore, gwanScore, jaeScore,
              normO, normR, normW, normA, normP, dom1, dom2 }
  };
}

// ══════════════════════════════════════════════════════
// ENERGY PROFILE ENGINE — Section 1용
// Energy vs Pressure + 5-group Distribution
// ══════════════════════════════════════════════════════
function calcEnergyProfile(pillars, dayTG, strengthResult) {
  const JIJANGGAN_LOCAL = [
    [{s:5,w:1.0},{s:9,w:0.6},{s:1,w:0.3}],
    [{s:5,w:1.0},{s:9,w:0.6},{s:7,w:0.3}],
    [{s:0,w:1.0},{s:2,w:0.6},{s:4,w:0.3}],
    [{s:0,w:1.0},{s:2,w:0.6}],
    [{s:4,w:1.0},{s:1,w:0.6},{s:9,w:0.3}],
    [{s:2,w:1.0},{s:4,w:0.6},{s:0,w:0.3}],
    [{s:2,w:1.0},{s:4,w:0.6},{s:0,w:0.3}],
    [{s:4,w:1.0},{s:2,w:0.6},{s:0,w:0.3}],
    [{s:6,w:1.0},{s:8,w:0.6},{s:4,w:0.3}],
    [{s:6,w:1.0},{s:8,w:0.6}],
    [{s:4,w:1.0},{s:6,w:0.6},{s:8,w:0.3}],
    [{s:8,w:1.0},{s:4,w:0.6},{s:0,w:0.3}],
  ];
  const SS_MAP = ['비견','겁재','식신','상관','정재','편재','정관','편관','정인','편인'];

  const raw = {};
  pillars.forEach(([tg, dz], idx) => {
    if (idx !== 2) {
      const rel = (tg - dayTG + 10) % 10;
      const ss = SS_MAP[rel];
      raw[ss] = (raw[ss]||0) + 1.0;
    }
    (JIJANGGAN_LOCAL[dz]||[]).forEach(({s,w}) => {
      const rel = (s - dayTG + 10) % 10;
      const ss = SS_MAP[rel];
      raw[ss] = (raw[ss]||0) + w * 0.6;
    });
  });

  const peer      = (raw['비견']||0) + (raw['겁재']||0);
  const output    = (raw['식신']||0) + (raw['상관']||0);
  const wealth    = (raw['정재']||0) + (raw['편재']||0);
  const authority = (raw['정관']||0) + (raw['편관']||0);
  const resource  = (raw['정인']||0) + (raw['편인']||0);

  const total = peer + output + wealth + authority + resource || 1;

  // 0-100 정규화
  function norm(v) { return Math.round((v / total) * 100); }

  const energyScore   = Math.max(5, Math.min(95, Math.round(strengthResult.total || 50)));
  const pressureScore = 100 - energyScore;

  // System state
  let systemState, systemStateDesc;
  if (energyScore >= 60) {
    systemState = 'Energy > Pressure';
    systemStateDesc = 'Your system generates more energy than the external demands require. Self-directed momentum is your natural mode.';
  } else if (energyScore >= 45) {
    systemState = 'Balanced';
    systemStateDesc = 'Your energy and external pressure are roughly matched. Performance depends on timing and environment.';
  } else {
    systemState = 'Pressure > Energy';
    systemStateDesc = 'External demands consistently exceed your natural energy supply. Strategic selectivity matters more than raw effort.';
  }

  // Distribution levels
  function level(v) {
    if (v >= 35) return 'Very High';
    if (v >= 25) return 'High';
    if (v >= 15) return 'Medium';
    if (v >= 8)  return 'Low';
    return 'Minimal';
  }

  const dist = {
    peer:      { score: norm(peer),      raw: peer,      level: level(norm(peer))      },
    output:    { score: norm(output),    raw: output,    level: level(norm(output))    },
    wealth:    { score: norm(wealth),    raw: wealth,    level: level(norm(wealth))    },
    authority: { score: norm(authority), raw: authority, level: level(norm(authority)) },
    resource:  { score: norm(resource),  raw: resource,  level: level(norm(resource))  },
  };

  // isStrong: strengthResult 에서 가져옴
  const isStrong = strengthResult && strengthResult.total !== undefined
    ? strengthResult.total >= 50
    : (energyScore >= 50);

  return {
    energyScore,
    pressureScore,
    systemState,
    systemStateDesc,
    distribution: dist,
    isStrong,
  };
}


// ══════════════════════════════════════════════════════
// BLIND SPOT ENGINE v2 — Section 2
// Category-based selection + driver scoring + hapchung integration
// Categories: Energy / Execution / Money / Relationship / Decision
// ══════════════════════════════════════════════════════
function calcBlindSpots(energyProfile, hapchung) {
  const d        = energyProfile.distribution;
  const R        = d.resource.score;
  const O        = d.output.score;
  const W        = d.wealth.score;
  const A        = d.authority.score;
  const P        = d.peer.score;
  const eScore   = energyProfile.energyScore;
  const pScore   = energyProfile.pressureScore;
  const isStrong = energyProfile.isStrong !== undefined ? energyProfile.isStrong : (eScore >= 50);
  const riskMod  = isStrong ? 0 : 15;

  // ── Hapchung clash data
  const branchClashes = (hapchung && hapchung.branchClashes) ? hapchung.branchClashes : [];
  const hasYearMonthClash  = branchClashes.some(c => c.positions.includes('Year')  && c.positions.includes('Month'));
  const hasMonthDayClash   = branchClashes.some(c => c.positions.includes('Month') && c.positions.includes('Day'));
  const hasDayHourClash    = branchClashes.some(c => c.positions.includes('Day')   && c.positions.includes('Hour'));
  const hasYearDayClash    = branchClashes.some(c => c.positions.includes('Year')  && c.positions.includes('Day'));
  const clashCount         = branchClashes.length;

  // ── Driver-based score function
  function patternScore(base, drivers) {
    let score = base;
    if (drivers.includes('High Output'))    score += 15;
    if (drivers.includes('Low Resource'))   score += 15;
    if (drivers.includes('High Pressure'))  score += 15;
    if (drivers.includes('Weak Authority')) score += 10;
    if (drivers.includes('Strong Wealth'))  score += 10;
    if (drivers.includes('Strong Authority')) score += 10;
    if (drivers.includes('High Peer'))      score += 10;
    if (drivers.includes('Low Output'))     score += 10;
    if (drivers.includes('Low Wealth'))     score += 10;
    if (drivers.includes('Natal Clash'))    score += 20;
    if (!isStrong)                          score += riskMod;
    return score;
  }

  function drivers(checks) {
    const d = [];
    if (checks.highO  && O >= 60)   d.push('High Output');
    if (checks.lowO   && O <= 25)   d.push('Low Output');
    if (checks.lowR   && R <= 30)   d.push('Low Resource');
    if (checks.highR  && R >= 60)   d.push('High Resource');
    if (checks.highP  && pScore >= 65) d.push('High Pressure');
    if (checks.weakA  && A <= 25)   d.push('Weak Authority');
    if (checks.strongA && A >= 60)  d.push('Strong Authority');
    if (checks.highW  && W >= 60)   d.push('Strong Wealth');
    if (checks.lowW   && W <= 20)   d.push('Low Wealth');
    if (checks.highPeer && P >= 60) d.push('High Peer');
    if (checks.lowPeer  && P <= 20) d.push('Low Peer');
    if (checks.clash)               d.push('Natal Clash');
    return d;
  }

  // ══════════════════════════════════
  // ENERGY PATTERNS (20)
  // ══════════════════════════════════
  const ENERGY = [
    {
      key: 'burnout_risk', title: 'Burnout Risk', category: 'Energy',
      trigger: () => pScore >= 70 && R <= 30,
      getDrivers: () => drivers({ highP: true, lowR: true }),
      base: 55,
    },
    {
      key: 'creative_burnout', title: 'Creative Burnout Loop', category: 'Energy',
      trigger: () => O >= 60 && R <= 30,
      getDrivers: () => drivers({ highO: true, lowR: true }),
      base: 50,
    },
    {
      key: 'momentum_dependency', title: 'Momentum Dependency', category: 'Energy',
      trigger: () => O >= 55 && R <= 35 && !(pScore >= 70),
      getDrivers: () => drivers({ highO: true, lowR: true }),
      base: 42,
    },
    {
      key: 'pressure_without_support', title: 'Pressure Without Support', category: 'Energy',
      trigger: () => A >= 60 && R <= 25,
      getDrivers: () => drivers({ strongA: true, lowR: true }),
      base: 48,
    },
    {
      key: 'energy_deficit', title: 'Energy Deficit', category: 'Energy',
      trigger: () => eScore <= 35,
      getDrivers: () => drivers({ highP: true, lowR: true }),
      base: 50,
    },
    {
      key: 'delayed_recovery', title: 'Delayed Recovery', category: 'Energy',
      trigger: () => R <= 25 && pScore >= 60,
      getDrivers: () => drivers({ lowR: true, highP: true }),
      base: 45,
    },
    {
      key: 'pressure_driven_growth', title: 'Pressure-Driven Growth Trap', category: 'Energy',
      trigger: () => pScore >= 65 && O >= 60 && R <= 30,
      getDrivers: () => drivers({ highP: true, highO: true, lowR: true }),
      base: 52,
    },
    {
      key: 'resource_deficiency', title: 'Recovery Deficit', category: 'Energy',
      trigger: () => R <= 20,
      getDrivers: () => drivers({ lowR: true, highP: true }),
      base: 48,
    },
    {
      key: 'fragile_balance', title: 'Fragile Balance', category: 'Energy',
      trigger: () => eScore >= 45 && eScore <= 55 && pScore >= 60,
      getDrivers: () => drivers({ highP: true }),
      base: 38,
    },
    {
      key: 'clash_energy_drain', title: 'Clash-Driven Energy Drain', category: 'Energy',
      trigger: () => clashCount >= 2 && R <= 40,
      getDrivers: () => drivers({ lowR: true, clash: true }),
      base: 58,
    },
    {
      key: 'low_momentum', title: 'Structural Low Momentum', category: 'Energy',
      trigger: () => O <= 25 && W <= 30,
      getDrivers: () => drivers({ lowO: true, lowW: true }),
      base: 40,
    },
    {
      key: 'energy_leak', title: 'Energy Leak Pattern', category: 'Energy',
      trigger: () => P >= 55 && O >= 55 && R <= 35,
      getDrivers: () => drivers({ highPeer: true, highO: true, lowR: true }),
      base: 44,
    },
    {
      key: 'pressure_fatigue', title: 'Chronic Pressure Fatigue', category: 'Energy',
      trigger: () => pScore >= 75 && eScore <= 45,
      getDrivers: () => drivers({ highP: true, lowR: true }),
      base: 60,
    },
    {
      key: 'month_day_clash_energy', title: 'Inner Conflict Drain', category: 'Energy',
      trigger: () => hasMonthDayClash && R <= 40,
      getDrivers: () => drivers({ clash: true, lowR: true }),
      base: 55,
    },
    {
      key: 'output_resource_imbalance', title: 'Output-Resource Imbalance', category: 'Energy',
      trigger: () => O >= 65 && R <= 20,
      getDrivers: () => drivers({ highO: true, lowR: true }),
      base: 58,
    },
    {
      key: 'resource_dominance', title: 'Over-Reliance on Support', category: 'Energy',
      trigger: () => R >= 70 && O <= 25 && W <= 25,
      getDrivers: () => drivers({ highR: true, lowO: true }),
      base: 40,
    },
    {
      key: 'high_pressure_low_output', title: 'Suppressed Drive', category: 'Energy',
      trigger: () => pScore >= 65 && O <= 30,
      getDrivers: () => drivers({ highP: true, lowO: true }),
      base: 48,
    },
    {
      key: 'collision_fatigue', title: 'Structural Collision Fatigue', category: 'Energy',
      trigger: () => clashCount >= 3,
      getDrivers: () => drivers({ clash: true, highP: true }),
      base: 62,
    },
    {
      key: 'weak_start_weak_finish', title: 'Consistency Gap', category: 'Energy',
      trigger: () => O <= 35 && A <= 35 && R <= 35,
      getDrivers: () => drivers({ lowO: true, weakA: true, lowR: true }),
      base: 44,
    },
    {
      key: 'year_month_clash_instability', title: 'Foundation Instability', category: 'Energy',
      trigger: () => hasYearMonthClash,
      getDrivers: () => drivers({ clash: true, highP: true }),
      base: 52,
    },
  ];

  // ══════════════════════════════════
  // EXECUTION PATTERNS (20)
  // ══════════════════════════════════
  const EXECUTION = [
    {
      key: 'starting_strong_finishing_weak', title: 'Starting Strong, Finishing Weak', category: 'Execution',
      trigger: () => O >= 60 && A <= 35,
      getDrivers: () => drivers({ highO: true, weakA: true }),
      base: 50,
    },
    {
      key: 'structure_resistance', title: 'Structure Resistance', category: 'Execution',
      trigger: () => O >= 55 && A <= 25,
      getDrivers: () => drivers({ highO: true, weakA: true }),
      base: 52,
    },
    {
      key: 'scattered_focus', title: 'Scattered Focus', category: 'Execution',
      trigger: () => O >= 60 && W >= 60,
      getDrivers: () => drivers({ highO: true, highW: true }),
      base: 48,
    },
    {
      key: 'output_dominance', title: 'Expression Overload', category: 'Execution',
      trigger: () => O >= 68 && O >= W + 12,
      getDrivers: () => drivers({ highO: true }),
      base: 44,
    },
    {
      key: 'authority_dominance', title: 'Control Orientation', category: 'Execution',
      trigger: () => A >= 65 && A >= O + 10,
      getDrivers: () => drivers({ strongA: true }),
      base: 44,
    },
    {
      key: 'suppressed_voice', title: 'Suppressed Voice', category: 'Execution',
      trigger: () => A >= 65 && O <= 35,
      getDrivers: () => drivers({ strongA: true, lowO: true }),
      base: 50,
    },
    {
      key: 'output_deficiency', title: 'Suppressed Expression', category: 'Execution',
      trigger: () => O <= 20,
      getDrivers: () => drivers({ lowO: true }),
      base: 44,
    },
    {
      key: 'direction_drift', title: 'Direction Drift', category: 'Execution',
      trigger: () => O >= 60 && W >= 55 && A <= 30,
      getDrivers: () => drivers({ highO: true, highW: true, weakA: true }),
      base: 54,
    },
    {
      key: 'fragmented_focus', title: 'Fragmented Focus', category: 'Execution',
      trigger: () => P >= 55 && O >= 55 && A <= 30,
      getDrivers: () => drivers({ highPeer: true, highO: true, weakA: true }),
      base: 46,
    },
    {
      key: 'creative_identity', title: 'Identity-Output Dependency', category: 'Execution',
      trigger: () => O >= 70 && P <= 30,
      getDrivers: () => drivers({ highO: true, lowPeer: true }),
      base: 46,
    },
    {
      key: 'day_hour_clash_execution', title: 'Execution Disruption Pattern', category: 'Execution',
      trigger: () => hasDayHourClash && O >= 45,
      getDrivers: () => drivers({ clash: true, highO: true }),
      base: 56,
    },
    {
      key: 'idea_overflow', title: 'Idea Overflow', category: 'Execution',
      trigger: () => O >= 65 && W >= 50 && A <= 35,
      getDrivers: () => drivers({ highO: true, highW: true, weakA: true }),
      base: 50,
    },
    {
      key: 'year_month_clash_career', title: 'Career Path Disruption', category: 'Execution',
      trigger: () => hasYearMonthClash && A <= 45,
      getDrivers: () => drivers({ clash: true, weakA: true }),
      base: 54,
    },
    {
      key: 'low_authority_drift', title: 'Structural Drift', category: 'Execution',
      trigger: () => A <= 20,
      getDrivers: () => drivers({ weakA: true }),
      base: 40,
    },
    {
      key: 'high_output_no_anchor', title: 'High Drive, No Anchor', category: 'Execution',
      trigger: () => O >= 65 && A <= 30 && R <= 30,
      getDrivers: () => drivers({ highO: true, weakA: true, lowR: true }),
      base: 56,
    },
    {
      key: 'pressure_execution_gap', title: 'Pressure-Execution Gap', category: 'Execution',
      trigger: () => pScore >= 70 && O <= 40,
      getDrivers: () => drivers({ highP: true, lowO: true }),
      base: 50,
    },
    {
      key: 'reactive_execution', title: 'Reactive Execution Pattern', category: 'Execution',
      trigger: () => P >= 60 && A <= 35,
      getDrivers: () => drivers({ highPeer: true, weakA: true }),
      base: 44,
    },
    {
      key: 'month_day_clash_execution', title: 'Internal-External Execution Conflict', category: 'Execution',
      trigger: () => hasMonthDayClash && O >= 50,
      getDrivers: () => drivers({ clash: true, highO: true }),
      base: 52,
    },
    {
      key: 'authority_output_clash', title: 'Drive vs Control Tension', category: 'Execution',
      trigger: () => O >= 60 && A >= 60,
      getDrivers: () => drivers({ highO: true, strongA: true }),
      base: 46,
    },
    {
      key: 'low_output_high_pressure', title: 'Stalled Under Pressure', category: 'Execution',
      trigger: () => O <= 30 && pScore >= 65,
      getDrivers: () => drivers({ lowO: true, highP: true }),
      base: 50,
    },
  ];

  // ══════════════════════════════════
  // MONEY PATTERNS (20)
  // ══════════════════════════════════
  const MONEY = [
    {
      key: 'opportunity_overextension', title: 'Opportunity Overextension', category: 'Money',
      trigger: () => W >= 65 && R <= 30,
      getDrivers: () => drivers({ highW: true, lowR: true }),
      base: 52,
    },
    {
      key: 'wealth_instability', title: 'Wealth Instability', category: 'Money',
      trigger: () => W >= 25 && W <= 55 && R <= 20 && pScore >= 65,
      getDrivers: () => drivers({ highP: true, lowR: true }),
      base: 48,
    },
    {
      key: 'risk_aversion', title: 'Risk Avoidance Pattern', category: 'Money',
      trigger: () => W <= 25 && R >= 55,
      getDrivers: () => drivers({ lowW: true, highR: true }),
      base: 40,
    },
    {
      key: 'wealth_dominance', title: 'Opportunity Fixation', category: 'Money',
      trigger: () => W >= 68 && W >= R + 12,
      getDrivers: () => drivers({ highW: true }),
      base: 46,
    },
    {
      key: 'wealth_deficiency', title: 'Opportunity Blindness', category: 'Money',
      trigger: () => W <= 20,
      getDrivers: () => drivers({ lowW: true }),
      base: 40,
    },
    {
      key: 'career_money_conflict', title: 'Career vs Money Tension', category: 'Money',
      trigger: () => W >= 55 && A <= 30,
      getDrivers: () => drivers({ highW: true, weakA: true }),
      base: 50,
    },
    {
      key: 'financial_drain', title: 'Financial Energy Drain', category: 'Money',
      trigger: () => W >= 60 && R <= 25,
      getDrivers: () => drivers({ highW: true, lowR: true }),
      base: 54,
    },
    {
      key: 'money_leakage', title: 'Money Leakage Pattern', category: 'Money',
      trigger: () => P >= 60 && W >= 45,
      getDrivers: () => drivers({ highPeer: true, highW: true }),
      base: 44,
    },
    {
      key: 'resource_drain', title: 'Resource Drain Risk', category: 'Money',
      trigger: () => R <= 25 && W >= 50 && O >= 55,
      getDrivers: () => drivers({ lowR: true, highW: true, highO: true }),
      base: 52,
    },
    {
      key: 'risk_attraction', title: 'High-Risk Attraction', category: 'Money',
      trigger: () => W >= 60 && O >= 55 && A <= 35,
      getDrivers: () => drivers({ highW: true, highO: true, weakA: true }),
      base: 50,
    },
    {
      key: 'day_clash_wealth_drain', title: 'Relationship-Wealth Conflict', category: 'Money',
      trigger: () => hasMonthDayClash && W >= 40,
      getDrivers: () => drivers({ clash: true, highW: true }),
      base: 54,
    },
    {
      key: 'year_month_clash_money', title: 'Early Pattern Wealth Disruption', category: 'Money',
      trigger: () => hasYearMonthClash && W >= 35,
      getDrivers: () => drivers({ clash: true, highW: true }),
      base: 52,
    },
    {
      key: 'status_conflict', title: 'Status vs Wealth Conflict', category: 'Money',
      trigger: () => W >= 60 && A >= 60,
      getDrivers: () => drivers({ highW: true, strongA: true }),
      base: 48,
    },
    {
      key: 'opportunity_overload', title: 'Opportunity Overload', category: 'Money',
      trigger: () => W >= 65 && O >= 60,
      getDrivers: () => drivers({ highW: true, highO: true }),
      base: 50,
    },
    {
      key: 'low_wealth_high_pressure', title: 'Financial Pressure Without Direction', category: 'Money',
      trigger: () => W <= 30 && pScore >= 65,
      getDrivers: () => drivers({ lowW: true, highP: true }),
      base: 46,
    },
    {
      key: 'day_hour_clash_money', title: 'Inconsistent Financial Execution', category: 'Money',
      trigger: () => hasDayHourClash && W >= 35,
      getDrivers: () => drivers({ clash: true, highW: true }),
      base: 50,
    },
    {
      key: 'peer_wealth_drain', title: 'Social Financial Drain', category: 'Money',
      trigger: () => P >= 65 && W <= 45,
      getDrivers: () => drivers({ highPeer: true, lowW: true }),
      base: 44,
    },
    {
      key: 'wealth_no_structure', title: 'Wealth Without Structure', category: 'Money',
      trigger: () => W >= 60 && A <= 25 && R <= 30,
      getDrivers: () => drivers({ highW: true, weakA: true, lowR: true }),
      base: 56,
    },
    {
      key: 'high_output_low_wealth', title: 'Effort-Reward Gap', category: 'Money',
      trigger: () => O >= 65 && W <= 25,
      getDrivers: () => drivers({ highO: true, lowW: true }),
      base: 48,
    },
    {
      key: 'clash_count_wealth', title: 'Multi-Clash Financial Instability', category: 'Money',
      trigger: () => clashCount >= 2 && W >= 30,
      getDrivers: () => drivers({ clash: true, highP: true }),
      base: 50,
    },
  ];

  // ══════════════════════════════════
  // RELATIONSHIP PATTERNS (20)
  // ══════════════════════════════════
  const RELATIONSHIP = [
    {
      key: 'independence_reflex', title: 'Independence Reflex', category: 'Relationship',
      trigger: () => P <= 25 && A >= 55,
      getDrivers: () => drivers({ lowPeer: true, strongA: true }),
      base: 48,
    },
    {
      key: 'isolation_drive', title: 'Isolation Drive', category: 'Relationship',
      trigger: () => O >= 60 && P <= 20,
      getDrivers: () => drivers({ highO: true, lowPeer: true }),
      base: 50,
    },
    {
      key: 'comparison_trap', title: 'Comparison Pressure', category: 'Relationship',
      trigger: () => P >= 65,
      getDrivers: () => drivers({ highPeer: true }),
      base: 44,
    },
    {
      key: 'peer_dominance', title: 'External Approval Dependency', category: 'Relationship',
      trigger: () => P >= 68,
      getDrivers: () => drivers({ highPeer: true }),
      base: 46,
    },
    {
      key: 'independence_identity', title: 'Lone Operator Pattern', category: 'Relationship',
      trigger: () => P <= 25 && O >= 55,
      getDrivers: () => drivers({ lowPeer: true, highO: true }),
      base: 50,
    },
    {
      key: 'peer_deficiency', title: 'Connection Avoidance', category: 'Relationship',
      trigger: () => P <= 20,
      getDrivers: () => drivers({ lowPeer: true }),
      base: 40,
    },
    {
      key: 'emotional_misalignment', title: 'Emotional Misalignment', category: 'Relationship',
      trigger: () => R >= 60 && O <= 30,
      getDrivers: () => drivers({ highR: true, lowO: true }),
      base: 44,
    },
    {
      key: 'trust_reserve', title: 'Trust Reserve Pattern', category: 'Relationship',
      trigger: () => A >= 60 && P <= 35,
      getDrivers: () => drivers({ strongA: true, lowPeer: true }),
      base: 44,
    },
    {
      key: 'attraction_compat_gap', title: 'Attraction vs Compatibility Gap', category: 'Relationship',
      trigger: () => O >= 60 && A >= 55,
      getDrivers: () => drivers({ highO: true, strongA: true }),
      base: 46,
    },
    {
      key: 'day_clash_relationship', title: 'Day Palace Relationship Disruption', category: 'Relationship',
      trigger: () => hasMonthDayClash,
      getDrivers: () => drivers({ clash: true }),
      base: 62,
    },
    {
      key: 'year_day_clash_relationship', title: 'Identity-Relationship Conflict', category: 'Relationship',
      trigger: () => hasYearDayClash,
      getDrivers: () => drivers({ clash: true }),
      base: 58,
    },
    {
      key: 'high_peer_low_resource', title: 'Social Energy Drain', category: 'Relationship',
      trigger: () => P >= 60 && R <= 30,
      getDrivers: () => drivers({ highPeer: true, lowR: true }),
      base: 50,
    },
    {
      key: 'authority_peer_gap', title: 'Control vs Connection Conflict', category: 'Relationship',
      trigger: () => A >= 65 && P <= 30,
      getDrivers: () => drivers({ strongA: true, lowPeer: true }),
      base: 50,
    },
    {
      key: 'output_relationship_imbalance', title: 'Creation Over Connection', category: 'Relationship',
      trigger: () => O >= 65 && P <= 30 && R <= 30,
      getDrivers: () => drivers({ highO: true, lowPeer: true, lowR: true }),
      base: 52,
    },
    {
      key: 'comparison_pressure', title: 'Competitive Relationship Lens', category: 'Relationship',
      trigger: () => P >= 55 && W >= 55,
      getDrivers: () => drivers({ highPeer: true, highW: true }),
      base: 44,
    },
    {
      key: 'day_hour_clash_relationship', title: 'Intimacy Disruption Pattern', category: 'Relationship',
      trigger: () => hasDayHourClash,
      getDrivers: () => drivers({ clash: true }),
      base: 58,
    },
    {
      key: 'high_output_low_peer', title: 'Output Isolation Pattern', category: 'Relationship',
      trigger: () => O >= 60 && P <= 25,
      getDrivers: () => drivers({ highO: true, lowPeer: true }),
      base: 48,
    },
    {
      key: 'peer_authority_clash', title: 'Social-Authority Friction', category: 'Relationship',
      trigger: () => P >= 60 && A >= 55,
      getDrivers: () => drivers({ highPeer: true, strongA: true }),
      base: 42,
    },
    {
      key: 'wealth_relationship_drain', title: 'Wealth-Relationship Trade-off', category: 'Relationship',
      trigger: () => W >= 65 && P <= 30,
      getDrivers: () => drivers({ highW: true, lowPeer: true }),
      base: 46,
    },
    {
      key: 'multi_clash_relationships', title: 'Relational Instability Pattern', category: 'Relationship',
      trigger: () => clashCount >= 2 && P <= 45,
      getDrivers: () => drivers({ clash: true, lowPeer: true }),
      base: 56,
    },
  ];

  // ══════════════════════════════════
  // DECISION PATTERNS (20)
  // ══════════════════════════════════
  const DECISION = [
    {
      key: 'overthinking_loop', title: 'Overthinking Loop', category: 'Decision',
      trigger: () => R >= 65 && O <= 35,
      getDrivers: () => drivers({ highR: true, lowO: true }),
      base: 46,
    },
    {
      key: 'uncertain_direction', title: 'Uncertain Direction', category: 'Decision',
      trigger: () => O <= 35 && A <= 35,
      getDrivers: () => drivers({ lowO: true, weakA: true }),
      base: 42,
    },
    {
      key: 'pressure_identity', title: 'Pressure-Driven Identity', category: 'Decision',
      trigger: () => pScore >= 75,
      getDrivers: () => drivers({ highP: true }),
      base: 50,
    },
    {
      key: 'status_orientation', title: 'Status-Driven Decision Making', category: 'Decision',
      trigger: () => A >= 65 && W >= 55,
      getDrivers: () => drivers({ strongA: true, highW: true }),
      base: 48,
    },
    {
      key: 'resource_dominance_decision', title: 'Support Dependence in Decisions', category: 'Decision',
      trigger: () => R >= 65 && O <= 30 && W <= 30,
      getDrivers: () => drivers({ highR: true, lowO: true }),
      base: 46,
    },
    {
      key: 'external_validation_loop', title: 'External Validation Loop', category: 'Decision',
      trigger: () => A >= 55 && P >= 50,
      getDrivers: () => drivers({ strongA: true, highPeer: true }),
      base: 44,
    },
    {
      key: 'analysis_paralysis', title: 'Analysis Paralysis', category: 'Decision',
      trigger: () => R >= 60 && A >= 55 && O <= 35,
      getDrivers: () => drivers({ highR: true, strongA: true, lowO: true }),
      base: 52,
    },
    {
      key: 'reactive_decision', title: 'Reactive Decision Pattern', category: 'Decision',
      trigger: () => P >= 60 && O >= 55 && A <= 30,
      getDrivers: () => drivers({ highPeer: true, highO: true, weakA: true }),
      base: 50,
    },
    {
      key: 'narrow_focus_trap', title: 'Narrow Focus Trap', category: 'Decision',
      trigger: () => A >= 65 && W <= 30,
      getDrivers: () => drivers({ strongA: true, lowW: true }),
      base: 44,
    },
    {
      key: 'selective_ambition', title: 'Selective Ambition', category: 'Decision',
      trigger: () => W >= 60 && O <= 30,
      getDrivers: () => drivers({ highW: true, lowO: true }),
      base: 46,
    },
    {
      key: 'year_month_clash_decision', title: 'Early Conditioning Decision Pattern', category: 'Decision',
      trigger: () => hasYearMonthClash && A <= 50,
      getDrivers: () => drivers({ clash: true, weakA: true }),
      base: 56,
    },
    {
      key: 'day_hour_clash_decision', title: 'Inconsistent Decision Execution', category: 'Decision',
      trigger: () => hasDayHourClash && O >= 40,
      getDrivers: () => drivers({ clash: true, highO: true }),
      base: 52,
    },
    {
      key: 'high_pressure_low_clarity', title: 'High Pressure, Low Clarity', category: 'Decision',
      trigger: () => pScore >= 70 && A <= 35 && O <= 40,
      getDrivers: () => drivers({ highP: true, weakA: true, lowO: true }),
      base: 54,
    },
    {
      key: 'wealth_authority_conflict', title: 'Wealth vs Structure Conflict', category: 'Decision',
      trigger: () => W >= 65 && A >= 55,
      getDrivers: () => drivers({ highW: true, strongA: true }),
      base: 48,
    },
    {
      key: 'direction_without_anchor', title: 'Direction Without Anchor', category: 'Decision',
      trigger: () => O >= 55 && W >= 55 && A <= 25 && R <= 25,
      getDrivers: () => drivers({ highO: true, highW: true, weakA: true, lowR: true }),
      base: 58,
    },
    {
      key: 'clash_decision_instability', title: 'Clash-Driven Decision Instability', category: 'Decision',
      trigger: () => clashCount >= 2 && A <= 45,
      getDrivers: () => drivers({ clash: true, weakA: true }),
      base: 54,
    },
    {
      key: 'peer_decision_noise', title: 'Peer Decision Noise', category: 'Decision',
      trigger: () => P >= 65 && A <= 40,
      getDrivers: () => drivers({ highPeer: true, weakA: true }),
      base: 46,
    },
    {
      key: 'resource_decision_loop', title: 'Preparation Over Action Loop', category: 'Decision',
      trigger: () => R >= 60 && W <= 30 && O <= 35,
      getDrivers: () => drivers({ highR: true, lowW: true, lowO: true }),
      base: 48,
    },
    {
      key: 'weak_anchor_multi_direction', title: 'Multi-Direction Scatter', category: 'Decision',
      trigger: () => O >= 60 && W >= 50 && P >= 50 && A <= 30,
      getDrivers: () => drivers({ highO: true, highW: true, highPeer: true, weakA: true }),
      base: 52,
    },
    {
      key: 'high_output_identity_lock', title: 'Identity Lock', category: 'Decision',
      trigger: () => O >= 70 && R <= 30 && A <= 30,
      getDrivers: () => drivers({ highO: true, lowR: true, weakA: true }),
      base: 50,
    },
  ];

  const ALL_PATTERNS = [...ENERGY, ...EXECUTION, ...MONEY, ...RELATIONSHIP, ...DECISION];

  // ── Evaluate all patterns, compute driver-based scores
  const evaluated = ALL_PATTERNS
    .filter(p => p.trigger())
    .map(p => {
      const drvs = p.getDrivers();
      const score = patternScore(p.base, drvs) * (0.96 + Math.random() * 0.08);
      return { ...p, drivers: drvs, score };
    });

  // ── Category-based selection: pick highest score per category
  const categoryMap = {};
  for (const p of evaluated) {
    if (!categoryMap[p.category] || p.score > categoryMap[p.category].score) {
      categoryMap[p.category] = p;
    }
  }

  // ── Sort category winners by score, take top 3
  const candidates = Object.values(categoryMap)
    .sort((a, b) => b.score - a.score);

  const selected = candidates.slice(0, 3);

  // ── Fallback if fewer than 3 categories triggered
  if (selected.length < 3) {
    const usedKeys = new Set(selected.map(p => p.key));
    for (const p of evaluated.sort((a, b) => b.score - a.score)) {
      if (selected.length >= 3) break;
      if (!usedKeys.has(p.key)) { usedKeys.add(p.key); selected.push(p); }
    }
  }

  return {
    spots: selected.slice(0, 3).map(p => ({
      key: p.key,
      title: p.title,
      category: p.category,
      drivers: p.drivers,
      severity: Math.round(p.score),
    })),
    triggeredCount: evaluated.length,
    scores: { R, O, W, A, P },
    isStrong,
    clashCount,
  };
}






// ══════════════════════════════════════════════════════
// FINANCIAL PROFILE ENGINE — Section 4 스냅샷용
// Income Stability / Opportunity Sensitivity / Risk Orientation / Money Retention
// ══════════════════════════════════════════════════════
function calcFinancialProfile(pillars, dayTG, wealthModeResult, energyProfile) {
  const d = energyProfile.distribution;
  const wm = wealthModeResult._scores || {};

  // raw 십성 스코어 (0-based normalized from energyProfile)
  const W_direct       = d.wealth.raw * (wm.structuredScore   / (wm.structuredScore + wm.opportunisticScore + 0.01));
  const W_opportunity  = d.wealth.raw * (wm.opportunisticScore / (wm.structuredScore + wm.opportunisticScore + 0.01));
  const output         = d.output.raw;
  const authority      = d.authority.raw;
  const resource       = d.resource.raw;
  const peer           = d.peer.raw;

  // ── Wealth Mode (이미 calcWealthMode에서 있지만 여기서도 명시)
  const wealthMode = wealthModeResult.primaryWealthMode;

  // ── Income Stability (0-100)
  const stabilityRaw = (W_direct * 0.5) + (authority * 0.3) + (resource * 0.2);
  const stabilityScore = Math.max(5, Math.min(95, Math.round(stabilityRaw * 25)));
  let stabilityLabel;
  if      (stabilityScore >= 65) stabilityLabel = 'High';
  else if (stabilityScore >= 35) stabilityLabel = 'Moderate';
  else                           stabilityLabel = 'Low';

  // ── Opportunity Sensitivity (0-100)
  const oppRaw = (W_opportunity * 0.6) + (output * 0.4);
  const opportunityScore = Math.max(5, Math.min(95, Math.round(oppRaw * 25)));
  let opportunityLabel;
  if      (opportunityScore >= 65) opportunityLabel = 'High';
  else if (opportunityScore >= 35) opportunityLabel = 'Moderate';
  else                             opportunityLabel = 'Low';

  // ── Risk Orientation (0-100)
  const riskRaw = (W_opportunity * 0.4) + (peer * 0.3) + (output * 0.3);
  const riskScore = Math.max(5, Math.min(95, Math.round(riskRaw * 25)));
  let riskLabel;
  if      (riskScore >= 65) riskLabel = 'High';
  else if (riskScore >= 35) riskLabel = 'Moderate';
  else                      riskLabel = 'Low';

  // ── Money Retention Pattern (0-100)
  const retentionRaw = (W_direct * 0.5) + (authority * 0.3) - (peer * 0.3) - (W_opportunity * 0.2);
  const retentionScore = Math.max(5, Math.min(95, Math.round((retentionRaw + 2) * 20)));
  let retentionLabel, retentionDesc;
  if (retentionScore >= 60) {
    retentionLabel = 'Accumulating';
    retentionDesc  = 'Strong saving and asset-building tendency';
  } else if (retentionScore >= 35) {
    retentionLabel = 'Flow';
    retentionDesc  = 'Money flows in and out — income is real but retention requires structure';
  } else {
    retentionLabel = 'Cyclical';
    retentionDesc  = 'Strong earning potential but money moves fast — deliberate retention systems needed';
  }

  // ── Snapshot descriptions (한 줄 의미 설명)
  const wealthModeDesc = wealthMode.includes('Opportunistic')
    ? 'Income primarily through timing, deals, and strategic opportunities'
    : wealthMode.includes('Structured')
    ? 'Income primarily through consistent systems, skills, or institutional roles'
    : 'Income through both opportunity-sensing and structured channels';

  const stabilityDesc = stabilityScore >= 65
    ? 'Financial flow tends to be consistent when systems are in place'
    : stabilityScore >= 35
    ? 'Income can be generated but may fluctuate with decisions and environment'
    : 'Financial flow is variable — structure and predictability need deliberate effort';

  const opportunityDesc = opportunityScore >= 65
    ? 'You naturally detect and move on opportunities quickly'
    : opportunityScore >= 35
    ? 'Opportunity awareness is present but selective activation'
    : 'You tend to evaluate carefully before acting on opportunities';

  const riskDesc = riskScore >= 65
    ? 'Comfortable taking calculated risks when upside is visible'
    : riskScore >= 35
    ? 'Moderate risk tolerance — size and timing of bets matter'
    : 'Risk-averse by structure — preservation tends to outweigh speculation';

  return {
    wealthMode,
    wealthModeDesc,
    stabilityScore, stabilityLabel, stabilityDesc,
    opportunityScore, opportunityLabel, opportunityDesc,
    riskScore, riskLabel, riskDesc,
    retentionScore, retentionLabel, retentionDesc,
  };
}


// ══════════════════════════════════════════════════════
// MONEY ENGINE v2 — 재성 위치 + 흐름 + 타이밍
// wealthLocation / moneyFlow / wealthTiming
// ══════════════════════════════════════════════════════
function calcMoneyEngine(pillars, dayTG, daewonResult, wealthModeResult, energyProfile) {

  const TG_ELEM  = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const TG_YY    = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
  const JIJANGGAN = {
    0:[{s:9}], 1:[{s:5},{s:9},{s:7}], 2:[{s:0},{s:2},{s:4}], 3:[{s:1}],
    4:[{s:4},{s:1},{s:9}], 5:[{s:2},{s:4},{s:6}], 6:[{s:3},{s:5}],
    7:[{s:5},{s:1},{s:3}], 8:[{s:6},{s:8},{s:4}], 9:[{s:7}],
    10:[{s:4},{s:7},{s:3}], 11:[{s:8},{s:0}]
  };

  function getTenGod(tg) {
    const dE=TG_ELEM[dayTG], dY=TG_YY[dayTG], tE=TG_ELEM[tg], tY=TG_YY[tg];
    const gen  ={Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
    const ctrl ={Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
    const ctrlBy={Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
    const genBy ={Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
    if(tE===dE) return tY===dY?'비견':'겁재';
    if(gen[dE]===tE)    return tY===dY?'식신':'상관';
    if(ctrl[dE]===tE)   return tY!==dY?'정재':'편재';
    if(ctrlBy[dE]===tE) return tY!==dY?'정관':'편관';
    if(genBy[dE]===tE)  return tY!==dY?'정인':'편인';
    return '비견';
  }

  function isWealthGod(god) { return god === '정재' || god === '편재'; }
  function isOutputGod(god)  { return god === '식신' || god === '상관'; }

  // ── STEP 1: 재성 위치 파악 (천간 + 지장간 본기)
  const PILLAR_NAMES = ['Year', 'Month', 'Day', 'Hour'];
  const wealthPositions = [];
  pillars.forEach(([tg, dz], idx) => {
    if (idx === 2) return; // 일간 제외
    // 천간
    if (isWealthGod(getTenGod(tg))) wealthPositions.push(PILLAR_NAMES[idx]);
    else {
      // 지장간 본기
      const jjg = JIJANGGAN[dz] || [];
      if (jjg.length > 0 && isWealthGod(getTenGod(jjg[0].s))) {
        wealthPositions.push(PILLAR_NAMES[idx]);
      }
    }
  });

  // ── STEP 2: 위치 의미 매핑
  let wealthSource;
  if (wealthPositions.includes('Month'))      wealthSource = 'career_income';
  else if (wealthPositions.includes('Year'))  wealthSource = 'network_opportunities';
  else if (wealthPositions.includes('Day'))   wealthSource = 'partnership_money';
  else if (wealthPositions.includes('Hour'))  wealthSource = 'investment_future';
  else                                        wealthSource = 'latent_wealth';

  const wealthSourceLabel = {
    career_income:        'Career & Professional Income',
    network_opportunities:'Network & Opportunity-Based',
    partnership_money:    'Partnership & Collaborative Income',
    investment_future:    'Investment & Future-Oriented',
    latent_wealth:        'Latent Potential (requires activation)',
  }[wealthSource];

  // ── STEP 3: 돈 흐름 구조 (식상→재성 vs 관성→재성)
  const d = energyProfile.distribution;
  const O = d.output.score;
  const W = d.wealth.score;
  const A = d.authority.score;
  const R = d.resource.score;

  let moneyFlow;
  if (O >= 50 && O > W)       moneyFlow = 'creation_driven';   // 식상 > 재성: 생산으로 돈
  else if (W >= 50 && W > O)  moneyFlow = 'opportunity_driven'; // 재성 지배: 기회로 돈
  else if (A >= 50 && A > W)  moneyFlow = 'career_salary';      // 관성 지배: 경력/급여
  else if (R >= 55 && W < 30) moneyFlow = 'resource_blocked';   // 인성이 재성 극: 돈 막힘
  else                         moneyFlow = 'hybrid';

  const moneyFlowLabel = {
    creation_driven:   'Creation → Wealth (output converts to income)',
    opportunity_driven:'Opportunity-Sensing (wealth energy dominant)',
    career_salary:     'Career & Authority (structured institutional income)',
    resource_blocked:  'Blocked Flow (resource energy suppresses wealth)',
    hybrid:            'Hybrid Flow (multiple activation channels)',
  }[moneyFlow];

  // ── STEP 4: 세운 기반 Financial Activation Year 탐지
  const currentYear = new Date().getFullYear();
  const wealthTiming = [];

  // 지지 합/충 테이블
  const DZ_CHUNG_ME = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
  const DZ_HAP_ME   = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
  function dzHap(a, b)   { return DZ_HAP_ME.some(([x,y]) => (a===x&&b===y)||(a===y&&b===x)); }
  function dzChung(a, b) { return DZ_CHUNG_ME[a] === b; }

  // 세운 천간/지지 계산 (60갑자)
  function getYearlyPillar(year) {
    return {
      tg: ((year - 4) % 10 + 10) % 10,
      dz: ((year - 4) % 12 + 12) % 12,
    };
  }

  // 대운별 tg 인덱스 맵 (연도 → {tg, dz})
  const daewonList = Array.isArray(daewonResult)
    ? daewonResult
    : (daewonResult && daewonResult.daewons ? daewonResult.daewons : []);
  const daewonByYear = {};
  daewonList.forEach(dw => {
    const s = dw.startYear || dw.start;
    const e = dw.endYear   || dw.end || (s + 9);
    for (let y = s; y <= e; y++) daewonByYear[y] = { tg: dw.tg, dz: dw.dz };
  });

  // 원국 지지 목록
  const natalBranches = pillars.map(p => p[1]);

  // 현재~15년 세운 스캔
  const yearScores = {};
  const yearReasons = {};

  for (let yr = currentYear; yr <= currentYear + 25; yr++) {
    const yp     = getYearlyPillar(yr);
    const dwInfo = daewonByYear[yr];
    const stemGod   = getTenGod(yp.tg);
    const dwStemGod = dwInfo ? getTenGod(dwInfo.tg) : null;

    // 지장간 본기로 지지 십성 확인
    const ypBranchJjg = JIJANGGAN[yp.dz] || [];
    const ypBranchMainGod = ypBranchJjg.length > 0 ? getTenGod(ypBranchJjg[0].s) : null;

    let score = 0;
    const reasons = [];

    // ① 세운 천간 재성 (+40)
    if (isWealthGod(stemGod)) {
      score += 40;
      reasons.push(stemGod === '정재' ? 'Structured wealth year' : 'Opportunistic wealth year');
    }
    // ② 세운 지지 본기 재성 (+30)
    if (ypBranchMainGod && isWealthGod(ypBranchMainGod)) {
      score += 30;
      reasons.push('Wealth energy in yearly branch');
    }
    // ③ 대운 재성 보너스 (+20) — 대운이 재성이면 세운 효과 증폭
    if (dwStemGod && isWealthGod(dwStemGod)) {
      score += 20;
      reasons.push('Wealth decade amplifier');
    }
    // ④ 식상 세운 + 대운 재성 → 식상→재성 흐름 (+35)
    if (isOutputGod(stemGod) && dwStemGod && isWealthGod(dwStemGod)) {
      score += 35;
      reasons.push('Output converts to wealth (creation → income flow)');
    }
    // ⑤ 세운 지지 합 + 재성 관련 (+25)
    const hapWithNatal = natalBranches.some(nb => dzHap(yp.dz, nb));
    if (hapWithNatal && (isWealthGod(stemGod) || (dwStemGod && isWealthGod(dwStemGod)))) {
      score += 25;
      reasons.push('Branch combination activates wealth');
    }
    // ⑥ 세운 지지 충 (재성 자극 — 변화 유발) (+15)
    const chungWithNatal = natalBranches.some(nb => dzChung(yp.dz, nb));
    if (chungWithNatal && score > 0) {
      score += 15;
      reasons.push('Clash triggers financial shift');
    }

    if (score >= 25) {
      yearScores[yr]  = score;
      yearReasons[yr] = reasons;
    }
  }

  // 상위 3개 선택 — 인접 연도는 묶되(1개로 카운트), 독립 항목 3개 채울 때까지 탐색
  const ranked = Object.entries(yearScores)
    .map(([yr, sc]) => ({ year: Number(yr), score: sc, reasons: yearReasons[yr] }))
    .sort((a, b) => b.score - a.score);

  const selected = [];
  const usedYears = new Set();
  for (const item of ranked) {
    if (selected.length >= 3) break;
    if (usedYears.has(item.year)) continue;
    // 인접 연도(±1) → 기존 항목에 묶기 (selected.length 증가 없음)
    const adjacent = selected.find(s =>
      Math.abs(s.year - item.year) === 1 ||
      (s.endYear && Math.abs(s.endYear - item.year) === 1)
    );
    if (adjacent) {
      adjacent.endYear = Math.max(adjacent.endYear || adjacent.year, item.year);
      adjacent.year    = Math.min(adjacent.year, item.year);
      usedYears.add(item.year);
    } else {
      selected.push({ ...item, endYear: item.year });
      usedYears.add(item.year);
    }
  }

  // wealthTiming 최종 포맷
  selected.forEach(s => {
    const topReason = s.reasons[0] || '';
    let type, label;
    if (s.reasons.some(r => r.includes('creation') || r.includes('Output'))) {
      type = 'output_to_wealth_flow';
      label = 'Output-to-income activation';
    } else if (s.reasons.some(r => r.includes('Opportunistic'))) {
      type = 'opportunistic_wealth_year';
      label = 'Opportunity window opens';
    } else if (s.reasons.some(r => r.includes('Structured'))) {
      type = 'structured_wealth_year';
      label = 'Stable income expansion';
    } else if (s.reasons.some(r => r.includes('amplifier') || r.includes('Wealth decade'))) {
      type = 'major_wealth_cycle';
      label = 'Wealth decade peak year';
    } else {
      type = 'wealth_activation';
      label = 'Financial activation window';
    }
    wealthTiming.push({
      year: s.year,
      endYear: s.endYear > s.year ? s.endYear : undefined,
      score: s.score,
      type,
      label,
      reason: s.reasons.join('. '),
    });
  });

  // ── FALLBACK: 3개 미만이면 대운 기반으로 채우기
  if (wealthTiming.length < 3) {
    // used: 이미 선택된 범위 안의 모든 연도 포함
    const used = new Set();
    wealthTiming.forEach(t => {
      const start = t.year;
      const end = t.endYear || t.year;
      for (let y = start; y <= end; y++) used.add(y);
    });
    // 아직 안 쓴 연도 중 score 가장 높은 것부터 추가
    const candidates = Object.entries(yearScores)
      .map(([yr, sc]) => ({ year: Number(yr), score: sc, reasons: yearReasons[yr] }))
      .sort((a, b) => b.score - a.score)
      .filter(item => !used.has(item.year));
    for (const item of candidates) {
      if (wealthTiming.length >= 3) break;
      const topReason = item.reasons[0] || '';
      let type, label;
      if (item.reasons.some(r => r.includes('creation') || r.includes('Output'))) {
        type = 'output_to_wealth_flow'; label = 'Output-to-income activation';
      } else if (item.reasons.some(r => r.includes('Opportunistic'))) {
        type = 'opportunistic_wealth_year'; label = 'Opportunity window opens';
      } else if (item.reasons.some(r => r.includes('Structured'))) {
        type = 'structured_wealth_year'; label = 'Stable income expansion';
      } else if (item.reasons.some(r => r.includes('amplifier') || r.includes('Wealth decade'))) {
        type = 'major_wealth_cycle'; label = 'Wealth decade peak year';
      } else {
        type = 'wealth_activation'; label = 'Financial activation window';
      }
      wealthTiming.push({
        year: item.year,
        endYear: undefined,
        score: item.score,
        type, label,
        reason: item.reasons.join('. '),
      });
      used.add(item.year);
    }
    // 그래도 부족하면 대운 기반으로 채우기
    if (wealthTiming.length < 3) {
      const dwYears = Object.entries(daewonByYear)
        .map(([yr, dw]) => ({ year: Number(yr), dw }))
        .filter(({ year, dw }) => {
          const g = getTenGod(dw.tg);
          return (isWealthGod(g) || isOutputGod(g)) && !used.has(year) && year >= currentYear;
        })
        .sort((a, b) => a.year - b.year);
      for (const { year } of dwYears) {
        if (wealthTiming.length >= 3) break;
        if (used.has(year)) continue;
        wealthTiming.push({
          year, endYear: undefined, score: 20,
          type: 'wealth_activation', label: 'Financial activation window',
          reason: 'Favorable decade energy'
        });
        used.add(year);
      }
    }
  }

  // ── STEP 5: 최대 재성 활성화 강도 기간
  const peakWealthWindow = wealthTiming.length > 0
    ? wealthTiming.reduce((best, t) =>
        t.type === 'major_wealth_cycle' ? t : best, wealthTiming[0])
    : null;

  // ── Financial advantage / risk (엔진 확정값)
  let financialAdvantage, financialRisk;

  if (moneyFlow === 'creation_driven') {
    financialAdvantage = 'Output energy converts to income when work reaches the right audience or scale';
    financialRisk = 'Income inconsistency when output slows or audience engagement drops';
  } else if (moneyFlow === 'opportunity_driven') {
    financialAdvantage = 'Strong opportunity-sensing — income accelerates during high-deal or high-mobility periods';
    financialRisk = 'Overextension risk — wealth energy without sufficient resource support leads to cash flow gaps';
  } else if (moneyFlow === 'career_salary') {
    financialAdvantage = 'Institutional income is stable and predictable — advancement compounds over time';
    financialRisk = 'Income ceiling if authority structure is resisted or role transitions are delayed';
  } else if (moneyFlow === 'resource_blocked') {
    financialAdvantage = 'Deep analytical and strategic capacity — financial decisions are careful and considered';
    financialRisk = 'Resource energy suppresses direct wealth activation — income requires deliberate structural override';
  } else {
    financialAdvantage = 'Multiple income activation channels — adaptable across career, opportunity, and creative modes';
    financialRisk = 'Lack of singular focus may dilute financial momentum — priority setting is critical';
  }

  return {
    wealthPositions,
    wealthSource,
    wealthSourceLabel,
    moneyFlow,
    moneyFlowLabel,
    wealthTiming,
    peakWealthWindow,
    financialAdvantage,
    financialRisk,
  };
}


module.exports = { calcSaju, buildChartSummary, localToKST, formatKSTDisplay, calcSipseongV3, calcSinsal, calcHapChungV2, calcYongshin, analyzeSpouseGung, buildLoveContext, calcStrengthScore, calcDaewonFull, buildDaewonContext, analyzeNatalTensions, buildInteractionAugmentedDaewons, calcEventPredictions, calcWealthMode, calcRelationalStructure, calcEnergyProfile, calcBlindSpots, calcFinancialProfile, calcMoneyEngine };