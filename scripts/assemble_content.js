const fs = require('fs');
const path = require('path');

// Paths
const atomsDir = path.join(__dirname, '..', 'atoms');
const outputFile = path.join(__dirname, '..', 'content_generated.json');

// Load Atoms
const placements = JSON.parse(fs.readFileSync(path.join(atomsDir, 'placements.json'), 'utf8'));
const houses = JSON.parse(fs.readFileSync(path.join(atomsDir, 'houses.json'), 'utf8'));
const modifiers = JSON.parse(fs.readFileSync(path.join(atomsDir, 'modifiers.json'), 'utf8'));

console.log("Loaded Atoms:");
console.log(`- Placements: ${Object.keys(placements.atoms).length}`);
console.log(`- Houses: ${Object.keys(houses.atoms).length}`);
console.log(`- Modifiers: ${Object.keys(modifiers.modifiers).length} categories`);

// The "Mixer" Function
// In a real "God Mode" scenario, this would call an LLM API.
// For now, we simulate synthesis by concatenating atoms.
function synthesize(placementKey, houseKey) {
    const placementAtoms = placements.atoms[placementKey];
    const houseAtoms = houses.atoms[houseKey];

    if (!placementAtoms || !houseAtoms) return null;

    // Simulate AI Synthesis
    const title = `${placementAtoms.archetype} in ${houseAtoms.domain}`;

    // Grab 2 random atoms from placement and 2 from house
    const p1 = placementAtoms.atoms[0];
    const p2 = placementAtoms.atoms[1];
    const h1 = houseAtoms.atoms[0];
    const h2 = houseAtoms.atoms[1];

    const text = `${p1} ${h1} ${p2} ${h2} This combination suggests that ${placementAtoms.archetype.toLowerCase()} energy is focused on ${houseAtoms.domain.toLowerCase()}.`;

    return {
        title: title,
        text: text
    };
}

// Generate Content
const generatedContent = {
    meta: {
        version: "2.0",
        type: "Atomic Generated"
    },
    planets_in_houses: {}
};

// Example Generation Loop
// We'll generate combinations for the data we have
const planets = ['Sun', 'Moon'];
const signs = ['Aries', 'Taurus', 'Gemini'];
const housesList = ['1st', '6th', '7th'];

planets.forEach(planet => {
    generatedContent.planets_in_houses[planet] = {};

    signs.forEach(sign => {
        const placementKey = `${planet}_${sign}`;

        housesList.forEach(house => {
            const houseKey = `${planet}_${house}`;
            const result = synthesize(placementKey, houseKey);

            if (result) {
                if (!generatedContent.planets_in_houses[planet][sign]) {
                    generatedContent.planets_in_houses[planet][sign] = {};
                }
                generatedContent.planets_in_houses[planet][sign][house] = result;
            }
        });
    });
});

// Write Output
fs.writeFileSync(outputFile, JSON.stringify(generatedContent, null, 2));
console.log(`\nGenerated content written to ${outputFile}`);

// Preview one entry
const sample = generatedContent.planets_in_houses['Sun']['Aries']['1st'];
if (sample) {
    console.log("\nSample Output (Sun in Aries in 1st House):");
    console.log(`Title: ${sample.title}`);
    console.log(`Text: ${sample.text}`);
}
