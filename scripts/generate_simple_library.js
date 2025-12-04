const fs = require('fs');
const path = require('path');

/**
 * GENERATE SIMPLE LIBRARY - ALL COMBINATIONS
 * 
 * Parses manual_generation_batches.md and generates crude simple versions
 * Uses varied openings and natural mixing of atoms
 */

const batchesPath = path.join(__dirname, '..', 'manual_generation_batches.md');
const simplePath = path.join(__dirname, '..', 'library_simple.json');

let simpleLib = { descriptions: {} };

// Load existing simple library if it exists
if (fs.existsSync(simplePath)) {
    simpleLib = JSON.parse(fs.readFileSync(simplePath, 'utf8'));
}

// Parse a batch entry to extract planet, sign, house, and atoms
function parseBatchEntry(text) {
    const match = text.match(/## (\w+) in (\w+) in (\d+)(?:st|nd|rd|th) House/);
    if (!match) return null;
    
    const [, planet, sign, houseNum] = match;
    const house = `${houseNum}${getOrdinalSuffix(parseInt(houseNum))}`;
    
    // Extract sign atoms
    const signAtomsMatch = text.match(/Here are atoms describing \w+ in \w+:\n((?:- .+\n?)+)/);
    const signAtoms = signAtomsMatch 
        ? signAtomsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
        : [];
    
    // Extract house atoms
    const houseAtomsMatch = text.match(/Here are atoms describing \w+ in the \d+(?:st|nd|rd|th) House:\n((?:- .+\n?)+)/);
    const houseAtoms = houseAtomsMatch
        ? houseAtomsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
        : [];
    
    return { planet, sign, house, signAtoms, houseAtoms };
}

function getOrdinalSuffix(num) {
    const j = num % 10, k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

// Generate crude simple version with VARIED openings
function generateCrudeSimple(planet, sign, house, signAtoms, houseAtoms) {
    if (signAtoms.length === 0 || houseAtoms.length === 0) return null;
    
    // Vary the opening - sometimes start with house, sometimes sign, different atoms
    const useHouseFirst = Math.random() > 0.5;
    const startIndex = Math.floor(Math.random() * Math.min(3, useHouseFirst ? houseAtoms.length : signAtoms.length));
    
    let crude = '';
    
    if (useHouseFirst) {
        // Start with house atom
        crude = houseAtoms[startIndex];
        if (!crude.endsWith('.') && !crude.endsWith(',')) crude += ',';
        
        // Add sign energy
        const signIndex = Math.floor(Math.random() * Math.min(3, signAtoms.length));
        let signAtom = signAtoms[signIndex];
        if (signAtom.startsWith('You ')) {
            signAtom = signAtom.charAt(0).toLowerCase() + signAtom.slice(1);
        }
        crude += ' and ' + signAtom;
        if (!crude.endsWith('.')) crude += '.';
        
        // Add another key point (alternate)
        if (houseAtoms.length > startIndex + 1) {
            crude += ' ' + houseAtoms[startIndex + 1];
            if (!crude.endsWith('.')) crude += '.';
        } else if (signAtoms.length > signIndex + 1) {
            crude += ' ' + signAtoms[signIndex + 1];
            if (!crude.endsWith('.')) crude += '.';
        }
    } else {
        // Start with sign atom
        crude = signAtoms[startIndex];
        if (!crude.endsWith('.') && !crude.endsWith(',')) crude += ',';
        
        // Add house context
        const houseIndex = Math.floor(Math.random() * Math.min(3, houseAtoms.length));
        let houseAtom = houseAtoms[houseIndex];
        if (houseAtom.startsWith('You ')) {
            houseAtom = houseAtom.charAt(0).toLowerCase() + houseAtom.slice(1);
        }
        crude += ' and ' + houseAtom;
        if (!crude.endsWith('.')) crude += '.';
        
        // Add another key point
        if (signAtoms.length > startIndex + 1) {
            crude += ' ' + signAtoms[startIndex + 1];
            if (!crude.endsWith('.')) crude += '.';
        } else if (houseAtoms.length > houseIndex + 1) {
            crude += ' ' + houseAtoms[houseIndex + 1];
            if (!crude.endsWith('.')) crude += '.';
        }
    }
    
    // Add shadow/cost (vary the phrasing)
    const shadowPhrases = [
        'Generally, people appreciate this, but for some it can be challenging.',
        'Generally, people appreciate this, but for some it can feel too intense.',
        'Generally, people appreciate this, but for some it can feel too much.',
        'People either appreciate this or find it overwhelming.',
        'This works well, though some find it too much.'
    ];
    const shadow = shadowPhrases[Math.floor(Math.random() * shadowPhrases.length)];
    crude += ' ' + shadow;
    
    return crude.trim();
}

// Process all batches
function processAllBatches() {
    const batchesText = fs.readFileSync(batchesPath, 'utf8');
    
    // Split into individual entries
    const entries = batchesText.split(/═══════════════════════════════════════════════════════════════════════════/);
    
    let count = 0;
    let newEntries = 0;
    let skipped = 0;
    
    console.log(`Processing ${entries.length} entries...`);
    
    for (const entry of entries) {
        const parsed = parseBatchEntry(entry);
        if (!parsed) continue;
        
        const { planet, sign, house, signAtoms, houseAtoms } = parsed;
        const key = `${planet}_${sign}_${house}`;
        
        // Skip if already exists
        if (simpleLib.descriptions[key] && simpleLib.descriptions[key].length > 0) {
            skipped++;
            continue;
        }
        
        // Generate crude version
        const crude = generateCrudeSimple(planet, sign, house, signAtoms, houseAtoms);
        
        if (!crude) {
            console.warn(`Failed to generate for ${key}`);
            continue;
        }
        
        // Store it
        if (!simpleLib.descriptions[key]) {
            simpleLib.descriptions[key] = [];
        }
        simpleLib.descriptions[key].push(crude);
        
        newEntries++;
        count++;
        
        if (count % 50 === 0) {
            console.log(`Processed ${count} entries, ${newEntries} new, ${skipped} skipped...`);
            // Save periodically
            fs.writeFileSync(simplePath, JSON.stringify(simpleLib, null, 2), 'utf8');
        }
    }
    
    // Final save
    fs.writeFileSync(simplePath, JSON.stringify(simpleLib, null, 2), 'utf8');
    
    console.log(`\nDone! Generated ${newEntries} new simple versions.`);
    console.log(`Skipped ${skipped} existing entries.`);
    console.log(`Total entries in library: ${Object.keys(simpleLib.descriptions).length}`);
}

// Run
if (require.main === module) {
    processAllBatches();
}

module.exports = { generateCrudeSimple, parseBatchEntry };
