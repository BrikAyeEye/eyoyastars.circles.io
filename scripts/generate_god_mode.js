const fs = require('fs');
const path = require('path');

/**
 * GOD MODE CONTENT GENERATOR
 * 
 * Generates synthesized astrological descriptions by combining atoms from:
 * - placements.json (Planet in Sign)
 * - houses.json (Planet in House)
 * 
 * Uses OpenAI API to synthesize atoms into punchy, high-quality descriptions.
 * 
 * Usage:
 *   node generate_god_mode.js --test      # Generate 5 test combinations
 *   node generate_god_mode.js --full      # Generate all 1,440 combinations
 */

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const TEST_MODE = process.argv.includes('--test');
const OUTPUT_FILE = TEST_MODE ? 'content_generated_test.json' : 'content_generated.json';

// Planets to process
const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Load atoms
const atomsDir = path.join(__dirname, '..', 'atoms');
const placements = JSON.parse(fs.readFileSync(path.join(atomsDir, 'placements.json'), 'utf8'));
const houses = JSON.parse(fs.readFileSync(path.join(atomsDir, 'houses.json'), 'utf8'));

/**
 * Call OpenAI API to synthesize atoms
 */
async function synthesizeWithLLM(planet, sign, house, signAtoms, houseAtoms) {
    // Load training examples
    let trainingExamples = [];
    try {
        const trainingData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'training_examples.json'), 'utf8'));
        trainingExamples = trainingData.examples;
    } catch (e) {
        console.warn("Warning: Could not load training_examples.json. Using default system message.");
    }

    // Select 3 random examples to use as few-shot
    const shuffled = trainingExamples.sort(() => 0.5 - Math.random());
    const selectedExamples = shuffled.slice(0, 3);

    let systemMessage = `You are an astrologer writing punchy, grounded descriptions. Your voice is:
- CONCRETE, not metaphorical (say "brick by brick" not "like a shield")
- DIRECT, not flowery (say "you build safety" not "you wield emotional maturity")
- SPECIFIC, not vague (say "rules no one else sees" not "emotional boundaries")
- REAL, not inspirational (show the cost, not just the strength)
- PERSONAL, start sentences with "You" or "Your [trait]"

Here are examples of the tone we want:
`;

    selectedExamples.forEach(ex => {
        systemMessage += `
Example (${ex.planet} in ${ex.sign} in ${ex.house}${getOrdinalSuffix(ex.house)} House):
"${ex.description}"
`;
    });

    systemMessage += `
Write like these examples: concrete, specific, grounded. No fluff.`;

    const userMessage = `Here are atoms describing ${planet} in ${sign}:
${signAtoms.map(a => `- ${a}`).join('\n')}

Here are atoms describing ${planet} in the ${house}${getOrdinalSuffix(house)} House:
${houseAtoms.map(a => `- ${a}`).join('\n')}

Combine these into a single 400-500 character insight.

CRITICAL INSTRUCTIONS:
1. START IMMEDIATELY with the description. DO NOT say "Your ${planet} in ${sign}..." or "This placement means...".
2. Use a direct, punchy tone. Make it feel like a personal callout.
3. Avoid explanatory phrases like "This blend suggests" or "This combination creates".
4. Avoid em dashes (—). Use commas, periods, or semicolons.
5. If there is a shadow/cost, include it.
6. Write exactly like the examples provided in the system message.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.5,
            max_tokens: 200
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

/**
 * Get ordinal suffix (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Format house key (e.g., "Sun_1st")
 */
function formatHouseKey(planet, house) {
    return `${planet}_${house}${getOrdinalSuffix(house)}`;
}

/**
 * Generate test combinations (5 diverse examples)
 */
function getTestCombinations() {
    return [
        { planet: 'Sun', sign: 'Aries', house: 1 },      // Aligned (fire + identity)
        { planet: 'Moon', sign: 'Gemini', house: 10 },   // Contrasting (scattered + structured)
        { planet: 'Venus', sign: 'Aquarius', house: 4 }, // Paradox (detached + home)
        { planet: 'Saturn', sign: 'Cancer', house: 4 },  // Shadow (control + emotion)
        { planet: 'Jupiter', sign: 'Sagittarius', house: 9 } // Cruisy (luck + expansion)
    ];
}

/**
 * Generate all combinations
 */
function getAllCombinations() {
    const combinations = [];
    for (const planet of PLANETS) {
        for (const sign of SIGNS) {
            for (const house of HOUSES) {
                combinations.push({ planet, sign, house });
            }
        }
    }
    return combinations;
}

/**
 * Main generation function
 */
async function generate() {
    // Validate API key
    if (!OPENAI_API_KEY) {
        console.error('❌ Error: OPENAI_API_KEY environment variable not set');
        console.error('Set it with: $env:OPENAI_API_KEY="your-api-key"');
        process.exit(1);
    }

    const combinations = TEST_MODE ? getTestCombinations() : getAllCombinations();
    const total = combinations.length;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`GOD MODE CONTENT GENERATOR`);
    console.log('='.repeat(60));
    console.log(`Mode: ${TEST_MODE ? 'TEST (5 combinations)' : 'FULL (1,440 combinations)'}`);
    console.log(`Output: ${OUTPUT_FILE}`);
    console.log(`Estimated cost: $${(total * 0.002).toFixed(2)} (at ~$0.002 per combination)`);
    console.log('='.repeat(60));
    console.log('');

    // Confirm if full mode
    if (!TEST_MODE) {
        console.log('⚠️  WARNING: This will generate 1,440 descriptions and cost ~$3-5.');
        console.log('⚠️  Run with --test first to validate quality.');
        console.log('');
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const results = {
        metadata: {
            generated_at: new Date().toISOString(),
            total_combinations: total,
            mode: TEST_MODE ? 'test' : 'full'
        },
        planets_in_signs_and_houses: {}
    };

    let completed = 0;
    let errors = 0;

    for (const { planet, sign, house } of combinations) {
        try {
            // Get atoms
            const signKey = `${planet}_${sign}`;
            const houseKey = formatHouseKey(planet, house);

            const signAtoms = placements.atoms[signKey]?.atoms || [];
            const houseAtoms = houses.atoms[houseKey]?.atoms || [];

            if (signAtoms.length === 0 || houseAtoms.length === 0) {
                console.warn(`⚠️  Missing atoms for ${planet} in ${sign} in ${house}${getOrdinalSuffix(house)} House`);
                errors++;
                continue;
            }

            // Synthesize
            console.log(`[${completed + 1}/${total}] Generating: ${planet} in ${sign} in ${house}${getOrdinalSuffix(house)} House...`);
            const description = await synthesizeWithLLM(planet, sign, house, signAtoms, houseAtoms);

            // Store result
            if (!results.planets_in_signs_and_houses[planet]) {
                results.planets_in_signs_and_houses[planet] = {};
            }
            if (!results.planets_in_signs_and_houses[planet][sign]) {
                results.planets_in_signs_and_houses[planet][sign] = {};
            }
            results.planets_in_signs_and_houses[planet][sign][house] = description;

            completed++;

            // Rate limit: 60 requests per minute (1 per second)
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`❌ Error generating ${planet} in ${sign} in ${house}${getOrdinalSuffix(house)} House:`, error.message);
            errors++;
        }
    }

    // Save results
    const outputPath = path.join(__dirname, '..', OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log('');
    console.log('='.repeat(60));
    console.log('GENERATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`✓ Generated: ${completed} descriptions`);
    console.log(`✗ Errors: ${errors}`);
    console.log(`✓ Saved to: ${outputPath}`);
    console.log('');

    if (TEST_MODE) {
        console.log('Next steps:');
        console.log('1. Review the generated descriptions in content_generated_test.json');
        console.log('2. If quality looks good, run: node generate_god_mode.js --full');
    }
}

// Run
generate().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
