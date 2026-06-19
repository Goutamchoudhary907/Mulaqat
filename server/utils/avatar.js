// Young, friendly, gender-correct cartoon avatar — same recipe the client
// picker uses, so a freshly registered user always has a sensible default face.
const MALE_HAIR = ['shortFlat', 'shortRound', 'shortWaved', 'shortCurly', 'theCaesar', 'theCaesarAndSidePart', 'sides', 'frizzle'];
const FEMALE_HAIR = ['straight01', 'straight02', 'straightAndStrand', 'bob', 'bun', 'curly', 'curvy', 'longButNotTooLong', 'miaWallace', 'bigHair', 'frida', 'fro'];
const HAIR_COLORS = ['2c1b18', '4a312c', '724133', 'a55728', 'b58143', 'c93305', 'd6b370'];

export function defaultAvatar(gender, seed) {
  const p = new URLSearchParams();
  p.set('seed', String(seed || 'mulaqat'));
  ['default', 'smile', 'twinkle'].forEach((v) => p.append('mouth', v));
  ['default', 'happy', 'wink'].forEach((v) => p.append('eyes', v));
  ['default', 'defaultNatural', 'raisedExcitedNatural'].forEach((v) => p.append('eyebrows', v));
  p.set('accessoriesProbability', '0');
  HAIR_COLORS.forEach((v) => p.append('hairColor', v));
  (gender === 'female' ? FEMALE_HAIR : MALE_HAIR).forEach((v) => p.append('top', v));
  if (gender === 'female') {
    p.set('facialHairProbability', '0');
  } else {
    p.set('facialHairProbability', '70');
    ['beardLight', 'beardMedium', 'moustacheFancy'].forEach((v) => p.append('facialHair', v));
    ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'shirtCrewNeck', 'shirtVNeck'].forEach((v) => p.append('clothing', v));
    ['262e33', '3c4f5c', '5199e4', '25557c', '929598', '65c9ff', 'b1e2ff', 'e6e6e6'].forEach((v) => p.append('clothesColor', v));
  }
  return `https://api.dicebear.com/7.x/avataaars/svg?${p.toString()}`;
}
