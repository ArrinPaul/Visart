// Compares the craft class predicted from the photo with the material the artisan typed.
export type CraftClass = "pottery" | "wood" | "textile" | "metal" | "bamboo";
export type ClaimResult = "match" | "mismatch" | "cannot_tell";

const MATERIAL_WORDS: Record<CraftClass, string[]> = {
  pottery: ["pottery", "clay", "terracotta", "ceramic", "ceramics", "earthenware", "stoneware", "porcelain"],
  wood: ["wood", "wooden", "teak", "teakwood", "rosewood", "sandalwood", "sheesham"],
  textile: ["textile", "fabric", "cotton", "silk", "wool", "linen", "khadi", "jute", "handloom", "yarn"],
  metal: ["metal", "brass", "bronze", "copper", "silver", "iron", "bidri", "bidriware"],
  bamboo: ["bamboo", "cane", "rattan", "wicker"],
};

export function checkClaim(material: string, predicted: CraftClass | "uncertain" | null): ClaimResult {
  if (!predicted || predicted === "uncertain") return "cannot_tell";

  // Pad with spaces so only whole words match.
  const text = ` ${material.toLowerCase().replace(/[^a-z]+/g, " ")} `;
  const claimed = (Object.keys(MATERIAL_WORDS) as CraftClass[]).filter((craft) =>
    MATERIAL_WORDS[craft].some((word) => text.includes(` ${word} `))
  );

  if (claimed.length === 0) return "cannot_tell";
  return claimed.includes(predicted) ? "match" : "mismatch";
}
