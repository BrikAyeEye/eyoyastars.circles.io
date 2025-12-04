const fs = require('fs');
const path = require('path');

const atomsDir = path.join(__dirname, '..', 'atoms');
const placements = JSON.parse(fs.readFileSync(path.join(atomsDir, 'placements.json'), 'utf8'));
const houses = JSON.parse(fs.readFileSync(path.join(atomsDir, 'houses.json'), 'utf8'));

const combinations = [
    { planet: 'Mercury', sign: 'Pisces', house: 6 },
    { planet: 'Venus', sign: 'Scorpio', house: 8 },
    { planet: 'Mars', sign: 'Virgo', house: 6 },
    { planet: 'Sun', sign: 'Leo', house: 5 },
    { planet: 'Moon', sign: 'Capricorn', house: 10 },
    { planet: 'Jupiter', sign: 'Pisces', house: 12 },
    { planet: 'Mercury', sign: 'Aries', house: 3 },
    { planet: 'Venus', sign: 'Taurus', house: 2 },
    { planet: 'Mars', sign: 'Scorpio', house: 8 },
    { planet: 'Sun', sign: 'Aquarius', house: 11 },
    { planet: 'Moon', sign: 'Aries', house: 1 },
    { planet: 'Mercury', sign: 'Taurus', house: 2 },
    { planet: 'Venus', sign: 'Gemini', house: 3 },
    { planet: 'Mars', sign: 'Cancer', house: 4 },
    { planet: 'Jupiter', sign: 'Leo', house: 5 },
    { planet: 'Saturn', sign: 'Virgo', house: 6 },
    { planet: 'Uranus', sign: 'Libra', house: 7 },
    { planet: 'Neptune', sign: 'Scorpio', house: 8 },
    { planet: 'Pluto', sign: 'Sagittarius', house: 9 },
    { planet: 'Sun', sign: 'Capricorn', house: 10 },
    { planet: 'Moon', sign: 'Aquarius', house: 11 },
    { planet: 'Mercury', sign: 'Pisces', house: 12 },
    { planet: 'Venus', sign: 'Aries', house: 1 },
    { planet: 'Mars', sign: 'Taurus', house: 2 },
    { planet: 'Jupiter', sign: 'Gemini', house: 3 },
    { planet: 'Uranus', sign: 'Leo', house: 5 },
    { planet: 'Neptune', sign: 'Virgo', house: 6 },
    { planet: 'Pluto', sign: 'Libra', house: 7 },
    { planet: 'Sun', sign: 'Scorpio', house: 8 },
    { planet: 'Mercury', sign: 'Capricorn', house: 10 },
    { planet: 'Venus', sign: 'Aquarius', house: 11 },
    { planet: 'Mars', sign: 'Pisces', house: 12 },
    { planet: 'Jupiter', sign: 'Aries', house: 1 },
    { planet: 'Saturn', sign: 'Taurus', house: 2 },
    { planet: 'Uranus', sign: 'Gemini', house: 3 },
    { planet: 'Neptune', sign: 'Cancer', house: 4 },
    { planet: 'Pluto', sign: 'Leo', house: 5 },
    { planet: 'Sun', sign: 'Virgo', house: 6 },
    { planet: 'Moon', sign: 'Libra', house: 7 },
    { planet: 'Mercury', sign: 'Scorpio', house: 8 },
    { planet: 'Venus', sign: 'Sagittarius', house: 9 },
    { planet: 'Mars', sign: 'Capricorn', house: 10 },
    { planet: 'Jupiter', sign: 'Aquarius', house: 11 },
    { planet: 'Saturn', sign: 'Pisces', house: 12 }
];

function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

let output = '# ChatGPT Generation Prompts\n\nGenerate 46 examples using this exact prompt format. Copy each section into ChatGPT one at a time.\n\n';

combinations.forEach((c, index) => {
    const signKey = `${c.planet}_${c.sign}`;
    const houseKey = `${c.planet}_${c.house}${getOrdinalSuffix(c.house)}`;

    const signAtoms = placements.atoms[signKey]?.atoms || [];
    const houseAtoms = houses.atoms[houseKey]?.atoms || [];

    if (signAtoms.length === 0) console.error(`Missing atoms for ${signKey}`);
    if (houseAtoms.length === 0) console.error(`Missing atoms for ${houseKey}`);

    output += `## ${index + 1}. ${c.planet} in ${c.sign} in ${c.house}${getOrdinalSuffix(c.house)} House\n\n`;
    output += '```\n';
    output += 'You are an astrologer writing for a modern, self-aware audience.\n\n';
    output += `Here are atoms describing ${c.planet} in ${c.sign}:\n`;
    signAtoms.forEach(a => output += `- ${a}\n`);
    output += '\n';
    output += `Here are atoms describing ${c.planet} in the ${c.house}${getOrdinalSuffix(c.house)} House:\n`;
    houseAtoms.forEach(a => output += `- ${a}\n`);
    output += '\n';
    output += `Combine these into a single 400-500 character insight.\n`;
    output += `Use a direct, punchy tone. Make it feel like a personal callout, not a horoscope.\n`;
    output += `Avoid phrases like "you express" or "this placement suggests."\n`;
    output += `Avoid em dashes (—). Use commas, periods, or semicolons instead.\n\n`;
    output += `If this placement has a clear shadow, cost, or trade-off, include it. Show how this strength alienates others or creates tension.\n`;
    output += `If this placement is genuinely harmonious or lucky, celebrate it without forcing a downside.\n`;
    output += `Astrology should feel true, not flattering—but also not artificially negative.\n`;
    output += '```\n\n';
    output += '---\n\n';
});

// Write directly to the artifact file
const targetFile = 'C:\\Users\\bk\\.gemini\\antigravity\\brain\\c718828b-c70a-46c7-9375-f0701f5bf003\\chatgpt_generation_prompts.md';
fs.writeFileSync(targetFile, output, 'utf8');
console.log(`Successfully wrote ${combinations.length} prompts to ${targetFile}`);
