const fs = require('fs');
const path = require('path');

/**
 * CLEANUP ASPECTS LIBRARY
 * 
 * Same cleanup as simple library but for aspects
 */

const aspectsPath = path.join(__dirname, '..', 'library_aspects.json');

let aspectsLib = JSON.parse(fs.readFileSync(aspectsPath, 'utf8'));

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
    text = text.replace(/, (Your|Home|Learning|Spirituality|Emotional|Nothing|You|Your|Money|Boredom|Patience|Friendship|Career|Self-discovery|Service|Missions|People|This|Generally|People)( [a-z])/g, '. $1$2');
    
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

// Process all aspects
let count = 0;
let fixed = 0;

for (const [key, versions] of Object.entries(aspectsLib.aspects)) {
    if (Array.isArray(versions)) {
        for (let i = 0; i < versions.length; i++) {
            const original = versions[i];
            if (!original || original === '') continue;
            
            const cleaned = cleanupText(original);
            
            if (cleaned !== original) {
                versions[i] = cleaned;
                fixed++;
            }
            count++;
        }
    }
}

// Save
fs.writeFileSync(aspectsPath, JSON.stringify(aspectsLib, null, 2), 'utf8');

console.log(`Processed ${count} entries`);
console.log(`Fixed ${fixed} entries`);
console.log('Cleanup complete!');

