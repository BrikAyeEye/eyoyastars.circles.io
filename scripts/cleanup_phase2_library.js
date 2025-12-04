const fs = require('fs');
const path = require('path');

/**
 * CLEANUP PHASE2 LIBRARY
 * 
 * Same cleanup as simple library but for phase2
 */

const phase2Path = path.join(__dirname, '..', 'library_phase2.json');

let phase2Lib = JSON.parse(fs.readFileSync(phase2Path, 'utf8'));

function cleanupText(text) {
    if (!text) return text;
    
    // Remove em dashes
    text = text.replace(/—/g, ',');
    text = text.replace(/–/g, ',');
    
    // Fix "your" at start of sentences
    text = text.replace(/^your /gi, 'Your ');
    text = text.replace(/\. your /g, '. Your ');
    text = text.replace(/, your /g, ', your ');
    
    // Don't start sentences with "and"
    text = text.replace(/^and /gi, '');
    text = text.replace(/\. and /g, '. ');
    text = text.replace(/, and /g, ', ');
    
    // Fix other common capitalization issues
    text = text.replace(/^you /gi, 'You ');
    text = text.replace(/\. you /g, '. You ');
    
    // Fix missing spaces after commas
    text = text.replace(/,([A-Za-z])/g, ', $1');
    
    // Fix comma followed by capitalized word (should be period)
    text = text.replace(/, (Your|Home|Learning|Spirituality|Emotional|Nothing|You|Your|Money|Boredom|Patience|Friendship|Career|Self-discovery|Service|Missions|People|This|Generally|People|This|You|Your|Everything|This|You're|Your)( [a-z])/g, '. $1$2');
    
    // Fix lowercase word after period (should be capitalized)
    text = text.replace(/\. ([a-z][a-z]+ [a-z])/g, (match, p1) => {
        return '. ' + p1.charAt(0).toUpperCase() + p1.slice(1);
    });
    
    // Clean up multiple spaces
    text = text.replace(/\s+/g, ' ');
    
    // Fix double periods
    text = text.replace(/\.\./g, '.');
    text = text.replace(/\.\s+\./g, '.');
    
    // Ensure proper spacing after punctuation
    text = text.replace(/([.!?])([A-Za-z])/g, '$1 $2');
    
    // Fix "your" capitalization after punctuation
    text = text.replace(/([.!?])\s+your /g, '$1 Your ');
    
    // Remove leading/trailing spaces
    text = text.trim();
    
    // Ensure it ends with punctuation
    if (text && !text.match(/[.!?]$/)) {
        text += '.';
    }
    
    return text;
}

// Process all categories
let count = 0;
let fixed = 0;

// Process stelliums
for (const [key, text] of Object.entries(phase2Lib.stelliums)) {
    if (!text || text === '') continue;
    const cleaned = cleanupText(text);
    if (cleaned !== text) {
        phase2Lib.stelliums[key] = cleaned;
        fixed++;
    }
    count++;
}

// Process north_node
for (const [key, text] of Object.entries(phase2Lib.north_node)) {
    if (!text || text === '') continue;
    const cleaned = cleanupText(text);
    if (cleaned !== text) {
        phase2Lib.north_node[key] = cleaned;
        fixed++;
    }
    count++;
}

// Process chiron
for (const [key, text] of Object.entries(phase2Lib.chiron)) {
    if (!text || text === '') continue;
    const cleaned = cleanupText(text);
    if (cleaned !== text) {
        phase2Lib.chiron[key] = cleaned;
        fixed++;
    }
    count++;
}

// Process aspect_patterns
for (const [key, text] of Object.entries(phase2Lib.aspect_patterns)) {
    if (!text || text === '') continue;
    const cleaned = cleanupText(text);
    if (cleaned !== text) {
        phase2Lib.aspect_patterns[key] = cleaned;
        fixed++;
    }
    count++;
}

// Save
fs.writeFileSync(phase2Path, JSON.stringify(phase2Lib, null, 2), 'utf8');

console.log(`Processed ${count} entries`);
console.log(`Fixed ${fixed} entries`);
console.log('Cleanup complete!');



