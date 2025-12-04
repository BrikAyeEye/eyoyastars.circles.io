const AtomEngine = require('./atom_engine');
const ChartParser = require('./chart_parser');
const fs = require('fs');
const path = require('path');

/**
 * SYNTHESIS DEMO
 * 
 * Demonstrates how to use the atom engine to compose interpretations.
 * In production, this would call an LLM API to synthesize the atoms.
 */

// Initialize
const engine = new AtomEngine();
const parser = new ChartParser();

// Load atoms
console.log('Loading atoms...\n');
engine.load();

// Create a test chart
console.log('Creating test chart...\n');
const testChart = parser.createTestChart();
const parsedChart = parser.parse(testChart);

console.log('Chart Analysis:');
console.log(`- Element Balance:`, parsedChart.analysis.element_balance);
console.log(`- Modality Balance:`, parsedChart.analysis.modality_balance);
console.log(`- Empty Houses:`, parsedChart.analysis.empty_houses);
console.log(`- Aspects:`, parsedChart.analysis.aspects.length);
console.log('');

// Compose atoms for different topics
const topics = ['career_and_money', 'relationships', 'identity'];

for (const topic of topics) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TOPIC: ${topic.toUpperCase()}`);
    console.log('='.repeat(60));

    const composition = engine.composeForLLM(parsedChart, topic);

    // Display summary
    console.log(`\nSun Sign Atoms: ${composition.sun.sign_atoms.length}`);
    console.log(`Sun House Atoms: ${composition.sun.house_atoms.length}`);
    console.log(`Moon Sign Atoms: ${composition.moon.sign_atoms.length}`);
    console.log(`Moon House Atoms: ${composition.moon.house_atoms.length}`);
    console.log(`Other Planets: ${composition.planets.length}`);
    console.log(`Modifiers: ${composition.modifiers.length}`);

    // Show sample atoms
    console.log('\n--- Sample Atoms ---');
    if (composition.sun.sign_atoms.length > 0) {
        console.log(`\nSun in ${parsedChart.sun.sign} (sample):`);
        console.log(`  "${composition.sun.sign_atoms[0].atom_text}"`);
        console.log(`  Category: ${composition.sun.sign_atoms[0].category}`);
        console.log(`  Tags: ${composition.sun.sign_atoms[0].tags.join(', ')}`);
    }

    if (composition.sun.house_atoms.length > 0) {
        console.log(`\nSun in ${parsedChart.sun.house}th House (sample):`);
        console.log(`  "${composition.sun.house_atoms[0].atom_text}"`);
    }

    if (composition.modifiers.length > 0) {
        console.log(`\nModifier (sample):`);
        console.log(`  "${composition.modifiers[0].atom_text}"`);
    }

    // Save composition to file (for LLM processing)
    const outputPath = path.join(__dirname, `composition_${topic}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(composition, null, 2));
    console.log(`\n✓ Saved composition to: ${outputPath}`);

    // Show LLM instruction
    console.log(`\n--- LLM Instruction ---`);
    console.log(composition.instruction);
}

console.log(`\n${'='.repeat(60)}`);
console.log('SYNTHESIS COMPLETE');
console.log('='.repeat(60));
console.log('\nNext steps:');
console.log('1. Review the composition JSON files');
console.log('2. Send to LLM API with the instruction');
console.log('3. LLM will synthesize atoms into beautiful prose');
console.log('\nExample LLM prompt structure:');
console.log(`
You are an expert astrologer. Synthesize these atomic insights into a cohesive interpretation.

ATOMS:
${JSON.stringify(engine.composeForLLM(parsedChart, 'career_and_money'), null, 2)}

INSTRUCTION:
${engine.composeForLLM(parsedChart, 'career_and_money').instruction}

Generate a 5-7 sentence interpretation that weaves these themes naturally.
`);




