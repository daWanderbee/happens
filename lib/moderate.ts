import { Filter } from "bad-words";

const filter = new Filter();

filter.addWords(
  "chutiya",
  "madarchod",
  "bhenchod",
  "gandu",
  "bc",
  "mc",
  "bkl",
  "harami",
);

// ✅ Normalize
function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[@*#!$%^&]/g, "")
    .replace(/(.)\1{2,}/g, "$1")
    .trim();
}

// 🔥 Emotional patterns (ALLOW THESE)
const emotionalPatterns = [
  /(i cant take it)/i,
  /(i feel lost)/i,
  /(i am tired)/i,
  /(i feel empty)/i,
  /(i hate my life)/i,
  /(main thak gaya|main thak gayi)/i,
];

// 🔥 Targeted hate (BLOCK)
const targetedPatterns = [
  /(you|tu|tum).*(die|mar)/i,
  /(deserve).*(die|mar)/i,
  /(go\s*die|kill\s*yourself)/i,
  /(tu|tum).*(chutiya|gandu|idiot|stupid)/i,
  /(madarchod|bhenchod)/i,
  /(जा\s*मर)/,
];

// 🔥 Main function
export function moderateText(text: string) {
  const clean = normalize(text);

  const isProfane = filter.isProfane(clean);
  const isEmotional = emotionalPatterns.some((p) => p.test(clean));
  const isTargeted = targetedPatterns.some((p) => p.test(clean));

  // ❌ BLOCK
  if (isTargeted && !isEmotional) {
    return {
      status: "blocked",
      reason: "Hate speech",
    };
  }

  // ⚠️ WARNING (only if not emotional)
  if (isProfane && !isEmotional) {
    return {
      status: "warning",
      reason: "Offensive language",
    };
  }

  // ✅ SAFE
  return {
    status: "ok",
  };
}
