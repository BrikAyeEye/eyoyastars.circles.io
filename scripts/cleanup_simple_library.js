const fs = require('fs');
const path = require('path');

/**
 * CLEANUP SIMPLE LIBRARY
 * 
 * - Remove em dashes
 * - Fix capitalization (Your at start)
 * - Don't start sentences with "and"
 * - Shorten long sentences
 * - Basic grammar cleanup
 */

const simplePath = path.join(__dirname, '..', 'library_simple.json');

let simpleLib = JSON.parse(fs.readFileSync(simplePath, 'utf8'));

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
    
    // Split very long sentences (over 150 chars) at periods
    const sentences = text.split(/([.!?])\s+/);
    let cleaned = '';
    let currentSentence = '';
    
    for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i];
        const punctuation = sentences[i + 1] || '';
        
        if (sentence) {
            currentSentence = sentence.trim();
            
            // If sentence is too long, try to split at commas
            if (currentSentence.length > 150) {
                const parts = currentSentence.split(/,/);
                if (parts.length > 1) {
                    // Split into two sentences at a natural break
                    const midPoint = Math.floor(parts.length / 2);
                    const firstPart = parts.slice(0, midPoint).join(',').trim();
                    const secondPart = parts.slice(midPoint).join(',').trim();
                    
                    if (firstPart && secondPart) {
                        cleaned += firstPart + '. ' + secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
                    } else {
                        cleaned += currentSentence;
                    }
                } else {
                    cleaned += currentSentence;
                }
            } else {
                cleaned += currentSentence;
            }
            
            if (punctuation) {
                cleaned += punctuation + ' ';
            }
        }
    }
    
    // Fix missing spaces after commas
    cleaned = cleaned.replace(/,([A-Za-z])/g, ', $1');
    
    // Fix comma followed by capitalized word (should be period)
    // Common patterns: ", Your", ", Home", ", Learning", ", Spirituality", etc.
    cleaned = cleaned.replace(/, (Your|Home|Learning|Spirituality|Emotional|Nothing|You|Your|Money|Boredom|Patience|Friendship|Career|Self-discovery|Service|Missions|People|This|Generally|People)( [a-z])/g, '. $1$2');
    
    // Fix lowercase word after period (should be capitalized)
    cleaned = cleaned.replace(/\. ([a-z][a-z]+ [a-z])/g, (match, p1) => {
        return '. ' + p1.charAt(0).toUpperCase() + p1.slice(1);
    });
    
    // Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Fix double periods
    cleaned = cleaned.replace(/\.\./g, '.');
    cleaned = cleaned.replace(/\.\s+\./g, '.');
    
    // Ensure proper spacing after punctuation
    cleaned = cleaned.replace(/([.!?])([A-Za-z])/g, '$1 $2');
    
    // Fix "your" capitalization after punctuation
    cleaned = cleaned.replace(/([.!?])\s+your /g, '$1 Your ');
    
    // Remove leading/trailing spaces
    cleaned = cleaned.trim();
    
    // Ensure it ends with punctuation
    if (cleaned && !cleaned.match(/[.!?]$/)) {
        cleaned += '.';
    }
    
    return cleaned;
}

// Process all descriptions
let count = 0;
let fixed = 0;

for (const [key, versions] of Object.entries(simpleLib.descriptions)) {
    if (Array.isArray(versions)) {
        for (let i = 0; i < versions.length; i++) {
            const original = versions[i];
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
fs.writeFileSync(simplePath, JSON.stringify(simpleLib, null, 2), 'utf8');

console.log(`Processed ${count} entries`);
console.log(`Fixed ${fixed} entries`);
console.log('Cleanup complete!');

