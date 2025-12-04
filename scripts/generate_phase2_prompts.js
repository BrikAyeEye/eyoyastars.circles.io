const fs = require('fs');

const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Helper for ordinal suffix
function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

// House themes
const houseThemes = {
    1: 'self/identity/appearance',
    2: 'money/values/resources',
    3: 'communication/learning/siblings',
    4: 'home/family/roots',
    5: 'creativity/romance/play',
    6: 'work/health/service',
    7: 'partnerships/relationships',
    8: 'transformation/intimacy/shared resources',
    9: 'philosophy/travel/expansion',
    10: 'career/public life/legacy',
    11: 'community/friendships/ideals',
    12: 'spirituality/unconscious/solitude'
};

const signArchetypes = {
    Aries: 'bold, pioneering, instinctive',
    Taurus: 'grounded, sensual, steady',
    Gemini: 'curious, quick, versatile',
    Cancer: 'protective, feeling-forward, nurturing',
    Leo: 'expressive, heart-led, magnetic',
    Virgo: 'discerning, service-focused, precise',
    Libra: 'harmonizing, relational, diplomatic',
    Scorpio: 'intense, investigative, all-or-nothing',
    Sagittarius: 'truth-seeking, adventurous, optimistic',
    Capricorn: 'strategic, disciplined, legacy-minded',
    Aquarius: 'visionary, future-focused, unconventional',
    Pisces: 'sensitive, poetic, compassionate'
};

let allPrompts = [];

// 1. STELLIUMS (4+ planets in same sign)
signs.forEach(sign => {
    allPrompts.push({
        type: 'stellium_sign',
        key: `stellium_${sign}`,
        title: `Stellium in ${sign}`,
        prompt: `Write a punchy, direct description for when someone has **4 or more planets in ${sign}**.

**Key:** \`stellium_${sign}\`

**Context:** ${sign} is ${signArchetypes[sign]}. A stellium means extreme focus/obsession in this energy.

**Guidelines:**
- Show the intensity and single-minded focus
- 2-3 sentences max
- Use "you" voice
- Emphasize how this dominates their entire chart
- Avoid astro jargon`
    });
});

// 2. STELLIUMS (4+ planets in same house)
houses.forEach(house => {
    allPrompts.push({
        type: 'stellium_house',
        key: `stellium_house_${house}`,
        title: `Stellium in ${getOrdinalSuffix(house)} House`,
        prompt: `Write a punchy, direct description for when someone has **4 or more planets in the ${getOrdinalSuffix(house)} house**.

**Key:** \`stellium_house_${house}\`

**Context:** The ${getOrdinalSuffix(house)} house governs ${houseThemes[house]}. A stellium means this life area is ALL-CONSUMING.

**Guidelines:**
- Show how this area dominates their entire life
- 2-3 sentences max
- Use "you" voice
- Concrete, lived experience
- Avoid astro jargon`
    });
});

// 3. NORTH NODE (life purpose)
signs.forEach(sign => {
    houses.forEach(house => {
        allPrompts.push({
            type: 'north_node',
            key: `NorthNode_${sign}_${house}`,
            title: `North Node in ${sign}, ${getOrdinalSuffix(house)} House`,
            prompt: `Write a punchy, direct description for when someone's **North Node** is in **${sign}** in the **${getOrdinalSuffix(house)} house**.

**Key:** \`NorthNode_${sign}_${house}\`

**Context:** 
- North Node = life purpose, soul mission, what you're here to learn
- ${sign} = ${signArchetypes[sign]}
- ${getOrdinalSuffix(house)} house = ${houseThemes[house]}

**Guidelines:**
- Frame as a calling/mission, not a personality trait
- 2-3 sentences max
- Use "you" voice
- Show the growth edge
- Avoid astro jargon`
        });
    });
});

// 4. CHIRON (wounded healer)
signs.forEach(sign => {
    houses.forEach(house => {
        allPrompts.push({
            type: 'chiron',
            key: `Chiron_${sign}_${house}`,
            title: `Chiron in ${sign}, ${getOrdinalSuffix(house)} House`,
            prompt: `Write a punchy, direct description for when someone's **Chiron** is in **${sign}** in the **${getOrdinalSuffix(house)} house**.

**Key:** \`Chiron_${sign}_${house}\`

**Context:** 
- Chiron = core wound that becomes a healing gift
- ${sign} = ${signArchetypes[sign]}
- ${getOrdinalSuffix(house)} house = ${houseThemes[house]}

**Guidelines:**
- Name the wound AND the gift
- 2-3 sentences max
- Use "you" voice
- Balance vulnerability with power
- Avoid astro jargon`
        });
    });
});

// 5. ASPECT PATTERNS (generic)
const aspectPatterns = [
    {
        key: 'yod',
        title: 'Yod (Finger of God)',
        description: 'A rare configuration where two planets sextile each other and both quincunx a third planet. Creates a sense of fate/destiny.'
    },
    {
        key: 't_square',
        title: 'T-Square',
        description: 'Three planets forming two squares and an opposition. Creates intense drive and tension that demands resolution.'
    },
    {
        key: 'grand_trine',
        title: 'Grand Trine',
        description: 'Three planets forming three trines in the same element. Creates natural talent and flow, but can lead to complacency.'
    }
];

aspectPatterns.forEach(pattern => {
    allPrompts.push({
        type: 'aspect_pattern',
        key: pattern.key,
        title: pattern.title,
        prompt: `Write a punchy, direct description for when someone has a **${pattern.title}** in their chart.

**Key:** \`${pattern.key}\`

**Context:** ${pattern.description}

**Guidelines:**
- Emphasize the rarity and significance
- 2-3 sentences max
- Use "you" voice
- Show the lived experience
- Avoid astro jargon`
    });
});

console.log(`Total Phase 2 prompts: ${allPrompts.length}`);

// Generate markdown
let output = `# Phase 2: "Curious" Insights Generation Prompts

Total prompts: ${allPrompts.length}

These are organized into batches of 9 for easier copy-pasting into ChatGPT.

---

`;

const batchSize = 9;
const totalBatches = Math.ceil(allPrompts.length / batchSize);

for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, allPrompts.length);
    const batch = allPrompts.slice(start, end);

    output += `## Batch ${batchIndex + 1} of ${totalBatches}\n\n`;
    output += `Copy this entire section into ChatGPT:\n\n`;
    output += `---\n\n`;

    batch.forEach((item, index) => {
        const promptNum = start + index + 1;
        output += `### ${promptNum}. ${item.title}\n\n`;
        output += `${item.prompt}\n\n`;
        output += `---\n\n`;
    });

    output += `\n\n`;
}

// Write to file
const outputPath = 'C:\\Users\\bk\\.gemini\\antigravity\\brain\\c718828b-c70a-46c7-9375-f0701f5bf003\\phase2_generation_prompts.md';
fs.writeFileSync(outputPath, output, 'utf8');

console.log(`✓ Generated ${allPrompts.length} prompts in ${totalBatches} batches`);
console.log(`✓ Saved to: ${outputPath}`);

// Also generate the template JSON
const template = {
    stelliums: {},
    north_node: {},
    chiron: {},
    aspect_patterns: {}
};

allPrompts.forEach(item => {
    if (item.type === 'stellium_sign' || item.type === 'stellium_house') {
        template.stelliums[item.key] = "";
    } else if (item.type === 'north_node') {
        template.north_node[item.key] = "";
    } else if (item.type === 'chiron') {
        template.chiron[item.key] = "";
    } else if (item.type === 'aspect_pattern') {
        template.aspect_patterns[item.key] = "";
    }
});

const templatePath = 'c:\\Users\\bk\\circles.io\\charter\\library_phase2.json';
fs.writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf8');

console.log(`✓ Created template: ${templatePath}`);
