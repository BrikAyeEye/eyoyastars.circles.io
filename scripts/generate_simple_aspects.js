const fs = require('fs');
const path = require('path');

/**
 * GENERATE SIMPLE ASPECTS LIBRARY
 * 
 * Generates crude simple versions for all aspects from content.json
 * Uses same approach as library_simple.json
 */

const contentPath = path.join(__dirname, '..', 'content.json');
const aspectsPath = path.join(__dirname, '..', 'library_aspects.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
let aspectsLib = { aspects: {}, patterns: {} };

// Load existing if it exists
if (fs.existsSync(aspectsPath)) {
    aspectsLib = JSON.parse(fs.readFileSync(aspectsPath, 'utf8'));
}

// Generate crude simple version from polished text
function generateCrudeSimple(text) {
    if (!text || text.length === 0) return null;
    
    // Split into sentences
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // Take first 2-3 sentences, make them simpler
    let crude = '';
    const numSentences = Math.min(3, sentences.length);
    
    for (let i = 0; i < numSentences; i++) {
        let sentence = sentences[i];
        
        // Simplify some phrases
        sentence = sentence
            .replace(/Your head and heart/g, 'You')
            .replace(/You oscillate between/g, 'You swing between')
            .replace(/You toggle between/g, 'You swing between')
            .replace(/You ping-pong between/g, 'You swing between');
        
        crude += sentence;
        if (!sentence.endsWith('.') && !sentence.endsWith('!')) {
            crude += '.';
        }
        if (i < numSentences - 1) {
            crude += ' ';
        }
    }
    
    // Add shadow if it's a challenging aspect (square, opposition)
    // Or keep it positive if harmonious (trine, sextile, some conjunctions)
    const hasShadow = text.toLowerCase().includes('tension') || 
                      text.toLowerCase().includes('challenge') ||
                      text.toLowerCase().includes('conflict') ||
                      text.toLowerCase().includes('struggle');
    
    if (hasShadow && !crude.includes('but') && !crude.includes('though')) {
        crude += ' Generally, people appreciate this, but for some it can be challenging.';
    }
    
    return crude.trim();
}

// Process all aspects from content.json
function processAspects() {
    const aspects = content.aspects || {};
    let count = 0;
    let newEntries = 0;
    
    // Process each planet pair
    for (const [planet1, planetPairs] of Object.entries(aspects)) {
        for (const [planet2, aspectTypes] of Object.entries(planetPairs)) {
            for (const [aspectType, data] of Object.entries(aspectTypes)) {
                const key = `${planet1}_${planet2}_${aspectType}`;
                
                // Skip if already exists
                if (aspectsLib.aspects[key] && aspectsLib.aspects[key].length > 0) {
                    continue;
                }
                
                // Get text from content.json
                const text = typeof data === 'string' ? data : (data.text || '');
                
                if (!text) continue;
                
                // Generate crude version
                const crude = generateCrudeSimple(text);
                
                if (!crude) continue;
                
                // Store it
                if (!aspectsLib.aspects[key]) {
                    aspectsLib.aspects[key] = [];
                }
                aspectsLib.aspects[key].push(crude);
                
                newEntries++;
                count++;
            }
        }
    }
    
    // Handle outer planet aspects (they might be in different format)
    // Check for outer planet keys
    const outerPlanets = ['Uranus', 'Neptune', 'Pluto'];
    const innerPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
    
    for (const inner of innerPlanets) {
        if (!aspects[inner]) continue;
        
        for (const outer of outerPlanets) {
            if (!aspects[inner][outer]) continue;
            
            for (const [aspectType, data] of Object.entries(aspects[inner][outer])) {
                const key = `${inner}_${outer}_${aspectType}_outer`;
                
                // Skip if already exists
                if (aspectsLib.aspects[key] && aspectsLib.aspects[key].length > 0) {
                    continue;
                }
                
                const text = typeof data === 'string' ? data : (data.text || '');
                if (!text) continue;
                
                const crude = generateCrudeSimple(text);
                if (!crude) continue;
                
                if (!aspectsLib.aspects[key]) {
                    aspectsLib.aspects[key] = [];
                }
                aspectsLib.aspects[key].push(crude);
                
                newEntries++;
                count++;
            }
        }
    }
    
    console.log(`Processed ${count} aspects, ${newEntries} new entries`);
    return newEntries;
}

// Save
function save() {
    fs.writeFileSync(aspectsPath, JSON.stringify(aspectsLib, null, 2), 'utf8');
    console.log(`Saved to ${aspectsPath}`);
}

// Run
if (require.main === module) {
    const newCount = processAspects();
    save();
    console.log(`\nDone! Generated ${newCount} new simple aspect versions.`);
    console.log(`Total aspects in library: ${Object.keys(aspectsLib.aspects).length}`);
}

module.exports = { generateCrudeSimple, processAspects };



