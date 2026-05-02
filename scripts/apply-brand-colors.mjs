import fs from "node:fs";

const files = [
  "app/page.js",
  "app/bootcamp/page.js",
  "app/privacy/page.js",
  "app/terms/page.js",
  "app/opengraph-image.js",
  "app/manifest.js",
  "app/icon.js",
  "app/apple-icon.js",
];

/** @type {[RegExp, string][]} */
const reps = [
  [/text-\[#1E3A5F\]\/80/g, "text-brand-navy/80"],
  [/text-\[#1E3A5F\]\/75/g, "text-brand-navy/75"],
  [/text-\[#1E3A5F\]/g, "text-brand-navy"],
  [/italic text-\[#1E3A5F\]/g, "italic text-brand-navy"],
  [/bg-\[#1E3A5F\]/g, "bg-brand-navy"],
  [/border-\[#1E3A5F\]\/18/g, "border-brand-navy/18"],
  [/shadow-\[#1E3A5F\]\/06/g, "shadow-brand-navy/06"],
  [/ring-\[#1E3A5F\]\/08/g, "ring-brand-navy/08"],
  [/from-\[#1E3A5F\]/g, "from-brand-navy"],
  [/to-\[#1E3A5F\]/g, "to-brand-navy"],
  [/via-\[#1E3A5F\]/g, "via-brand-navy"],
  [/hover:text-\[#1E3A5F\]/g, "hover:text-brand-navy"],
  [/hover:bg-\[#152c47\]/g, "hover:bg-brand-navy-muted"],
  [/focus:border-\[#1E3A5F\]/g, "focus:border-brand-navy"],
  [/focus-visible:ring-\[#1E3A5F\]/g, "focus-visible:ring-brand-navy"],
  [/focus:ring-\[#1E3A5F\]/g, "focus:ring-brand-navy"],
  [/text-\[#2E7D32\]/g, "text-brand-green"],
  [/bg-\[#2E7D32\]/g, "bg-brand-green"],
  [/border-\[#2E7D32\]/g, "border-brand-green"],
  [/border-l-\[#2E7D32\]/g, "border-l-brand-green"],
  [/border-t-\[#2E7D32\]/g, "border-t-brand-green"],
  [/hover:border-\[#2E7D32\]/g, "hover:border-brand-green"],
  [/via-\[#2E7D32\]/g, "via-brand-green"],
  [/hover:bg-\[#256629\]/g, "hover:bg-brand-green-muted"],
  [/hover:text-\[#2E7D32\]/g, "hover:text-brand-green"],
  [/group-hover:text-\[#2E7D32\]/g, "group-hover:text-brand-green"],
  [/hover:border-\[#2E7D32\]\/45/g, "hover:border-brand-green/45"],
  [/hover:border-\[#2E7D32\]\/55/g, "hover:border-brand-green/55"],
  [/hover:shadow-\[#2E7D32\]/g, "hover:shadow-brand-green"],
  [/open:border-\[#2E7D32\]/g, "open:border-brand-green"],
  [/border-\[#2E7D32\]\/20/g, "border-brand-green/20"],
  [/border-\[#2E7D32\]\/35/g, "border-brand-green/35"],
  [/ring-\[#2E7D32\]/g, "ring-brand-green"],
  [/shadow-\[#2E7D32\]\/25/g, "shadow-brand-green/25"],
  [/shadow-\[#2E7D32\]\/30/g, "shadow-brand-green/30"],
  [/shadow-\[#2E7D32\]\/12/g, "shadow-brand-green/12"],
  [/shadow-\[#2E7D32\]/g, "shadow-brand-green"],
  [/bg-\[#e8f5e9\]/g, "bg-brand-tint"],
  [/from-\[#e8f5e9\]\/55/g, "from-brand-tint/90"],
  [/bg-\[#e8f5e9\]\/40/g, "bg-brand-tint/40"],
  [/bg-\[#e8f5e9\]\/55/g, "bg-brand-tint/80"],
  [/border-\[#2E7D32\]\/40/g, "border-brand-green/40"],
  [/color: "#1E3A5F"/g, 'color: "#11274c"'],
  [/color: "#2E7D32"/g, 'color: "#166534"'],
  [/backgroundColor: "#1E3A5F"/g, 'backgroundColor: "#11274c"'],
];

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  for (const [re, to] of reps) {
    s = s.replace(re, to);
  }
  if (s !== before) fs.writeFileSync(file, s);
}
