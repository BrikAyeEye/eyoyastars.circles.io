const fs = require('fs');
const path = require('path');

const atomsDir = path.join(__dirname, '..', 'atoms');
const placements = JSON.parse(fs.readFileSync(path.join(atomsDir, 'placements.json'), 'utf8'));
const houses = JSON.parse(fs.readFileSync(path.join(atomsDir, 'houses.json'), 'utf8'));

const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

let output = '# Manual Generation Batches (9 Items Each)\n\n';
output += 'Use these batches to generate the library in ChatGPT.\n';
output += 'Each batch contains 9 fully spelled-out prompts.\n';
output += 'Copy the entire block and paste into ChatGPT.\n\n';
output += 'Total Batches: 160\n\n';

let allItems = [];

// 1. Generate all 1440 individual prompts
planets.forEach(planet => {
    signs.forEach(sign => {
        const signKey = `${planet}_${sign}`;
        const signAtoms = placements.atoms[signKey]?.atoms || [];

        if (signAtoms.length === 0) return;

        for (let house = 1; house <= 12; house++) {
            const houseKey = `${planet}_${house}${getOrdinalSuffix(house)}`;
            const houseAtoms = houses.atoms[houseKey]?.atoms || [];

            let itemPrompt = `## ${planet} in ${sign} in ${house}${getOrdinalSuffix(house)} House\n`;
            itemPrompt += `You are an astrologer writing for a modern, self-aware audience.\n`;
            itemPrompt += `Here are atoms describing ${planet} in ${sign}:\n`;
            signAtoms.forEach(a => itemPrompt += `- ${a}\n`);
            itemPrompt += `Here are atoms describing ${planet} in the ${house}${getOrdinalSuffix(house)} House:\n`;
            houseAtoms.forEach(a => itemPrompt += `- ${a}\n`);
            itemPrompt += `Combine these into a single 400-500 character insight about "${planet} in ${sign} in the ${house}${getOrdinalSuffix(house)} House."\n`;
            itemPrompt += `Use a direct, punchy tone. Make it feel like a personal callout, not a horoscope.\n`;
            itemPrompt += `Avoid phrases like "you express" or "this placement suggests."\n`;
            itemPrompt += `Avoid em dashes (—). Use commas, periods, or semicolons instead.\n`;
            itemPrompt += `If this placement has a clear shadow, cost, or trade-off, include it.\n`;
            itemPrompt += `If it is genuinely harmonious, celebrate it without forcing a downside.\n`;
            itemPrompt += `Astrology should feel true, not flattering—but also not artificially negative.\n`;

            allItems.push(itemPrompt);
        }
    });
});

// 2. Group into batches of 9 with extra spacing
const BATCH_SIZE = 9;
for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batchItems = allItems.slice(i, i + BATCH_SIZE);

    output += `\n\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    output += `## BATCH ${batchNum} (Items ${i + 1}-${i + batchItems.length})\n\n`;
    output += '```\n';
    output += `I will paste ${batchItems.length} prompts below. Please generate a response for EACH one.\n\n`;
    output += batchItems.join('\n\n═══════════════════════════════════════════════════════════════════════════\n\n');
    output += '\n```\n\n';
}

fs.writeFileSync('manual_generation_batches.md', output);
console.log(`Generated manual_generation_batches.md with ${Math.ceil(allItems.length / BATCH_SIZE)} batches.`);
