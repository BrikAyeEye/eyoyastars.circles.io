const fs = require('fs');

// Load all libraries
const simple = JSON.parse(fs.readFileSync('library_simple.json', 'utf8'));
const aspects = JSON.parse(fs.readFileSync('library_aspects.json', 'utf8'));
const phase2 = JSON.parse(fs.readFileSync('library_phase2.json', 'utf8'));

let output = '=== ALL SENTENCES FROM ASTROLOGY LIBRARIES ===\n\n';
let totalCount = 0;

// Extract Planet-Sign-House combinations
output += '=== PLANET-SIGN-HOUSE COMBINATIONS (library_simple.json) ===\n\n';
Object.keys(simple.descriptions).sort().forEach(key => {
    const sentences = simple.descriptions[key];
    if (Array.isArray(sentences)) {
        sentences.forEach(s => {
            if (s && s.trim()) {
                output += `[${key}]\n${s.trim()}\n\n`;
                totalCount++;
            }
        });
    } else if (sentences && sentences.trim()) {
        output += `[${key}]\n${sentences.trim()}\n\n`;
        totalCount++;
    }
});

// Extract Aspects
output += '\n\n=== ASPECTS (library_aspects.json) ===\n\n';
Object.keys(aspects.aspects || {}).sort().forEach(key => {
    const entry = aspects.aspects[key];
    if (Array.isArray(entry) && entry[0] && entry[0].trim()) {
        output += `[${key}]\n${entry[0].trim()}\n\n`;
        totalCount++;
    } else if (entry && typeof entry === 'string' && entry.trim()) {
        output += `[${key}]\n${entry.trim()}\n\n`;
        totalCount++;
    }
});

// Extract Phase 2 patterns
output += '\n\n=== PHASE 2 PATTERNS (library_phase2.json) ===\n\n';

// Stelliums
Object.keys(phase2.stelliums || {}).sort().forEach(key => {
    if (phase2.stelliums[key] && phase2.stelliums[key].trim()) {
        output += `[${key}]\n${phase2.stelliums[key].trim()}\n\n`;
        totalCount++;
    }
});

// North Node
Object.keys(phase2.north_node || {}).sort().forEach(key => {
    if (phase2.north_node[key] && phase2.north_node[key].trim()) {
        output += `[${key}]\n${phase2.north_node[key].trim()}\n\n`;
        totalCount++;
    }
});

// Chiron
Object.keys(phase2.chiron || {}).sort().forEach(key => {
    if (phase2.chiron[key] && phase2.chiron[key].trim()) {
        output += `[${key}]\n${phase2.chiron[key].trim()}\n\n`;
        totalCount++;
    }
});

// Add summary at the end
output += `\n\n=== SUMMARY ===\nTotal sentences extracted: ${totalCount}\n`;

// Write to file
fs.writeFileSync('all_sentences.txt', output, 'utf8');
console.log(`Done! Extracted ${totalCount} sentences and wrote to all_sentences.txt`);


