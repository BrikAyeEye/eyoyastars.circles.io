const fs = require('fs');

// Load sentences
const current = JSON.parse(fs.readFileSync('boom_sentences_final.json', 'utf8'));

// Comprehensive improvement function
// This will be enhanced with LLM review in batches
function comprehensiveImprove(sentence, key) {
    const { identity, verb1, preposition, shadow, verb2, quest } = sentence;
    const shadowLower = shadow.toLowerCase();
    const questLower = quest.toLowerCase();
    const identityLower = identity.toLowerCase();
    
    let improvedVerb1 = verb1;
    let improvedPreposition = preposition;
    let improvedVerb2 = verb2;
    let improvedQuest = quest;
    
    // Extract house/pattern from key for context
    const isHouse7 = key.includes('House_7');
    const isHouse10 = key.includes('House_10');
    const isNorthNode = key.includes('NorthNode');
    const isHouse5 = key.includes('House_5');
    
    // IMPROVEMENT RULES:
    
    // 1. North Node + Destiny = "THE CALL OF DESTINY"
    if (isNorthNode && questLower.includes('destiny')) {
        improvedQuest = 'THE CALL OF DESTINY';
        improvedVerb2 = 'fulfill';
    }
    
    // 2. House 7 + Connection = "CONNECTION AND MEANING" (when appropriate)
    if (isHouse7 && questLower.includes('connection') && !questLower.includes('meaning')) {
        // Use "CONNECTION AND MEANING" for more impactful combinations
        if (shadowLower.includes('fog') || shadowLower.includes('veil') || shadowLower.includes('resistance')) {
            improvedQuest = 'CONNECTION AND MEANING';
        }
    }
    
    // 3. SEER + VOID = "parts THE VOID"
    if (identity === 'A SEER' && shadowLower.includes('void')) {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    }
    
    // 4. HERO + CONFLICT + JOY = "manifest JOY"
    if (identity === 'A HERO' && shadowLower.includes('conflict') && questLower.includes('joy')) {
        improvedVerb2 = 'manifest';
        improvedQuest = 'JOY';
    }
    
    // 5. WARRIOR + FOG = "parts THE FOG" (not "fights through")
    if (identity === 'A WARRIOR' && (shadowLower.includes('fog') || shadowLower.includes('veil'))) {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    }
    
    // 6. REBEL + RESISTANCE + LEGACY = "build A LEGACY"
    if (identity === 'A REBEL' && shadowLower.includes('resistance') && questLower.includes('legacy')) {
        improvedVerb1 = 'overcomes';
        improvedPreposition = '';
        improvedVerb2 = 'build';
        improvedQuest = 'A LEGACY';
    }
    
    // 7. General: Use more evocative verbs
    // For void/abyss with mystical identities
    if ((identity === 'A SEER' || identity === 'THE DEPTHS' || identity === 'A TRANSFORMER') && 
        (shadowLower.includes('void') || shadowLower.includes('abyss'))) {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    }
    
    // For fog/veil with any identity - "parts" works better than "overcomes"
    if (shadowLower.includes('fog') || shadowLower.includes('veil') || shadowLower.includes('haze')) {
        if (improvedVerb1 === 'overcomes') {
            improvedVerb1 = 'parts';
            improvedPreposition = '';
        }
    }
    
    // Generate improved sentence
    const prepText = improvedPreposition ? improvedPreposition + ' ' : '';
    const improvedFull = `You are ${identity} who ${improvedVerb1} ${prepText}${shadow} to ${improvedVerb2} ${improvedQuest}.`;
    
    return {
        identity: identity,
        verb1: improvedVerb1,
        preposition: improvedPreposition,
        shadow: shadow,
        verb2: improvedVerb2,
        quest: improvedQuest,
        full: improvedFull
    };
}

// Process all sentences
const improved = {};
const keys = Object.keys(current.sentences);

console.log(`Comprehensive improvement on ${keys.length} sentences...\n`);

let changed = 0;
keys.forEach(key => {
    const original = current.sentences[key];
    const improvedSentence = comprehensiveImprove(original, key);
    
    if (improvedSentence.full !== original.full) {
        changed++;
    }
    
    improved[key] = improvedSentence;
});

// Save
const output = {
    total: keys.length,
    changed: changed,
    improvedAt: new Date().toISOString(),
    sentences: improved
};

fs.writeFileSync('boom_sentences_final.json', JSON.stringify(output, null, 2));

console.log(`✅ Improved ${changed} sentences`);
console.log(`Total: ${keys.length} sentences`);
console.log(`Saved to boom_sentences_final.json`);

// Show examples
console.log(`\nExample improvements:\n`);
const examples = [
    'Sun_opposition_House_5',
    'Moon_Pluto_Pluto_NorthNode',
    'Uranus_opposition_House_10',
    'Mars_square_House_7'
];

examples.forEach(key => {
    if (improved[key]) {
        console.log(`${key}:`);
        console.log(`  ${improved[key].full}`);
    }
});


