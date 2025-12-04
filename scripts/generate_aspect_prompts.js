const fs = require('fs');

// Define all the combinations we need

// 1. Personal Planet Aspects (Sun-Saturn with each other)
const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const aspects = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];

const personalAspects = [];
for (let i = 0; i < personalPlanets.length; i++) {
    for (let j = i + 1; j < personalPlanets.length; j++) {
        for (const aspect of aspects) {
            personalAspects.push({
                type: 'aspect',
                planet1: personalPlanets[i],
                planet2: personalPlanets[j],
                aspect: aspect,
                key: `${personalPlanets[i]}_${personalPlanets[j]}_${aspect}`
            });
        }
    }
}

// 2. Outer Planet Aspects (Sun-Mars with Uranus, Neptune, Pluto)
const innerPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
const outerPlanets = ['Uranus', 'Neptune', 'Pluto'];

const outerAspects = [];
for (const inner of innerPlanets) {
    for (const outer of outerPlanets) {
        for (const aspect of aspects) {
            outerAspects.push({
                type: 'outer_aspect',
                planet1: inner,
                planet2: outer,
                aspect: aspect,
                key: `${inner}_${outer}_${aspect}_outer`
            });
        }
    }
}

// 3. Element Dominance
const elementDominance = [
    { type: 'element_dominance', element: 'fire', key: 'element_fire' },
    { type: 'element_dominance', element: 'earth', key: 'element_earth' },
    { type: 'element_dominance', element: 'air', key: 'element_air' },
    { type: 'element_dominance', element: 'water', key: 'element_water' }
];

// 4. Element/Modality Blind Spots
const blindSpots = [
    { type: 'blind_spot', category: 'element', name: 'fire', key: 'missing_fire' },
    { type: 'blind_spot', category: 'element', name: 'earth', key: 'missing_earth' },
    { type: 'blind_spot', category: 'element', name: 'air', key: 'missing_air' },
    { type: 'blind_spot', category: 'element', name: 'water', key: 'missing_water' },
    { type: 'blind_spot', category: 'modality', name: 'cardinal', key: 'missing_cardinal' },
    { type: 'blind_spot', category: 'modality', name: 'fixed', key: 'missing_fixed' },
    { type: 'blind_spot', category: 'modality', name: 'mutable', key: 'missing_mutable' }
];

// 5. House Emphasis
const houseEmphasis = [];
for (let i = 1; i <= 12; i++) {
    houseEmphasis.push({
        type: 'house_emphasis',
        house: i,
        key: `house_cluster_${i}`
    });
}

// 6. Angular Focus
const angularFocus = [
    { type: 'angular_focus', key: 'angular_focus' }
];

// Combine all
const allCombinations = [
    ...personalAspects,
    ...outerAspects,
    ...elementDominance,
    ...blindSpots,
    ...houseEmphasis,
    ...angularFocus
];

console.log(`Total combinations: ${allCombinations.length}`);

// Helper function for ordinal suffix
function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

// Generate prompts
let output = `# Aspect & Pattern Generation Prompts

Total prompts: ${allCombinations.length}

These are organized into batches of 9 for easier copy-pasting into ChatGPT.

---

`;

const batchSize = 9;
const totalBatches = Math.ceil(allCombinations.length / batchSize);

for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, allCombinations.length);
    const batch = allCombinations.slice(start, end);

    output += `## Batch ${batchIndex + 1} of ${totalBatches}\n\n`;
    output += `Copy this entire section into ChatGPT:\n\n`;
    output += `---\n\n`;

    batch.forEach((combo, index) => {
        const promptNum = start + index + 1;

        if (combo.type === 'aspect' || combo.type === 'outer_aspect') {
            // Aspect prompt
            const aspectDescriptions = {
                conjunction: 'merged with / fused to',
                sextile: 'harmonizing with / supporting',
                square: 'in tension with / challenging',
                trine: 'flowing naturally with / amplifying',
                opposition: 'balancing / opposing'
            };

            output += `### ${promptNum}. ${combo.planet1} ${combo.aspect} ${combo.planet2}\n\n`;
            output += `Write a punchy, direct description for when **${combo.planet1}** is **${aspectDescriptions[combo.aspect]}** **${combo.planet2}**.\n\n`;
            output += `**Key:** \`${combo.key}\`\n\n`;
            output += `**Guidelines:**\n`;
            output += `- Start with impact/effect, not explanation\n`;
            output += `- 2-3 sentences max\n`;
            output += `- Use "you" voice\n`;
            output += `- Show the dynamic between the two planets\n`;
            output += `- Avoid astro jargon\n\n`;

        } else if (combo.type === 'element_dominance') {
            // Element dominance
            output += `### ${promptNum}. ${combo.element.toUpperCase()} Dominance\n\n`;
            output += `Write a description for when someone has a **dominant ${combo.element} element** in their chart (60%+ of personal planets).\n\n`;
            output += `**Key:** \`${combo.key}\`\n\n`;
            output += `**Guidelines:**\n`;
            output += `- Describe the core drive/energy of ${combo.element}\n`;
            output += `- 1-2 sentences\n`;
            output += `- Direct, punchy tone\n\n`;

        } else if (combo.type === 'blind_spot') {
            // Blind spot
            output += `### ${promptNum}. Missing ${combo.name.toUpperCase()} (Blind Spot)\n\n`;
            output += `Write a description for when someone has **zero personal planets** in ${combo.name} ${combo.category === 'element' ? 'signs' : 'modality'}.\n\n`;
            output += `**Key:** \`${combo.key}\`\n\n`;
            output += `**Guidelines:**\n`;
            output += `- Frame as a growth edge, not a deficit\n`;
            output += `- 1-2 sentences\n`;
            output += `- What they're learning to access\n\n`;

        } else if (combo.type === 'house_emphasis') {
            // House emphasis
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

            output += `### ${promptNum}. ${getOrdinalSuffix(combo.house)} House Emphasis (3+ planets)\n\n`;
            output += `Write a description for when someone has **3 or more planets** in the **${getOrdinalSuffix(combo.house)} house** (theme: ${houseThemes[combo.house]}).\n\n`;
            output += `**Key:** \`${combo.key}\`\n\n`;
            output += `**Guidelines:**\n`;
            output += `- Show how this area dominates their life\n`;
            output += `- 1-2 sentences\n`;
            output += `- Concrete, lived experience\n\n`;

        } else if (combo.type === 'angular_focus') {
            // Angular focus
            output += `### ${promptNum}. Angular House Focus (3+ planets in 1st/4th/7th/10th)\n\n`;
            output += `Write a description for when someone has **3 or more planets** in **angular houses** (1st, 4th, 7th, 10th).\n\n`;
            output += `**Key:** \`${combo.key}\`\n\n`;
            output += `**Guidelines:**\n`;
            output += `- Emphasize visibility, impact, presence\n`;
            output += `- 1-2 sentences\n`;
            output += `- They can't hide\n\n`;
        }

        output += `---\n\n`;
    });

    output += `\n\n`;
}

// Write to file
const outputPath = 'C:\\Users\\bk\\.gemini\\antigravity\\brain\\c718828b-c70a-46c7-9375-f0701f5bf003\\aspect_generation_prompts.md';
fs.writeFileSync(outputPath, output, 'utf8');

console.log(`✓ Generated ${allCombinations.length} prompts in ${totalBatches} batches`);
console.log(`✓ Saved to: ${outputPath}`);
