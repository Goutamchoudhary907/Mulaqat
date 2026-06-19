/** Catches async errors so controllers don't need try/catch everywhere. */
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Both participants derive the same chat room id regardless of order. */
export const roomIdFor = (a, b) => [String(a), String(b)].sort().join('_');

/** Strips sensitive fields before sending a user to the client. */
export function clean(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

/**
 * Vibe compatibility: matching answers on the 5-question vibe check carry most
 * of the weight (65%), shared interests top it up. Floored at 12 — nobody at
 * Medicaps deserves to be told "0%".
 */
export function compatibility(a, b) {
  const va = a.vibe || [];
  const vb = b.vibe || [];
  let same = 0;
  for (let i = 0; i < Math.min(va.length, vb.length); i++) {
    if (va[i] === vb[i]) same++;
  }
  // Divide by the number of questions answered (adapts if the question count changes).
  const total = Math.max(va.length, vb.length, 1);
  const shared = (a.interests || []).filter((i) => (b.interests || []).includes(i)).length;
  const score = Math.round((same / total) * 65 + Math.min(shared, 4) * 8.75);
  return Math.max(12, Math.min(100, score));
}

const ADJECTIVES = ['Shy', 'Caffeinated', 'Mysterious', 'Sleepy', 'Dramatic', 'Lowkey', 'Chaotic', 'Soft-spoken', 'Backbench', 'First-bench', 'Overthinking', 'Daydreaming'];
const ANIMALS = ['Sparrow', 'Panda', 'Fox', 'Pigeon', 'Cat', 'Otter', 'Koala', 'Parrot', 'Deer', 'Penguin', 'Squirrel', 'Owl'];

/** Anonymous-but-charming identity for Spotted wall posts. */
export function pseudonym() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal}`;
}
