const fs = require('fs');

// Load sentences
const current = JSON.parse(fs.readFileSync('boom_sentences_final.json', 'utf8'));

// This processes ALL sentences with comprehensive improvements
// Making them more meaningful and poetic while keeping the 3 capitalized elements

function batchImprove(sentence, key) {
    const { identity, verb1, preposition, shadow, verb2, quest } = sentence;
    const shadowLower = shadow.toLowerCase();
    const questLower = quest.toLowerCase();
    
    let improvedVerb1 = verb1;
    let improvedPreposition = preposition;
    let improvedVerb2 = verb2;
    let improvedQuest = quest;
    
    // Extract context from key
    const isHouse5 = key.includes('House_5');
    const isHouse7 = key.includes('House_7');
    const isHouse10 = key.includes('House_10');
    const isNorthNode = key.includes('NorthNode');
    
    // COMPREHENSIVE IMPROVEMENT RULES:
    
    // === SHADOW-SPECIFIC VERB IMPROVEMENTS ===
    
    // THE VOID / THE ABYSS → "parts" (more poetic than "transforms")
    if (shadow === 'THE VOID' || shadow === 'THE ABYSS') {
        if (identity === 'A SEER' || identity === 'THE DEPTHS' || identity === 'A TRANSFORMER') {
            improvedVerb1 = 'parts';
            improvedPreposition = '';
        } else if (improvedVerb1 === 'transforms') {
            improvedVerb1 = 'parts';
            improvedPreposition = '';
        }
    }
    
    // THE FOG / THE VEIL / THE HAZE → "parts" (always more poetic)
    if (shadow === 'THE FOG' || shadow === 'THE VEIL' || shadow === 'THE HAZE') {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    }
    
    // RESISTANCE / OPPOSITION → "overcomes"
    if (shadow === 'RESISTANCE' || shadow === 'OPPOSITION' || shadow === 'THE DIVIDE') {
        improvedVerb1 = 'overcomes';
        improvedPreposition = '';
    }
    
    // CONFLICT / FRICTION / THE BATTLE → "overcomes"
    if (shadow === 'CONFLICT' || shadow === 'FRICTION' || shadow === 'THE BATTLE' || shadow === 'TENSION') {
        improvedVerb1 = 'overcomes';
        improvedPreposition = '';
    }
    
    // RESTRICTION / THE WALL / LIMITATION → "breaks through"
    if (shadow === 'RESTRICTION' || shadow === 'THE WALL' || shadow === 'LIMITATION' || shadow === 'THE CAGE') {
        improvedVerb1 = 'breaks';
        improvedPreposition = 'through';
    }
    
    // DESTRUCTION / OBSESSION → "transforms" (appropriate)
    if (shadow === 'DESTRUCTION' || shadow === 'OBSESSION') {
        if (improvedVerb1 !== 'transforms' && improvedVerb1 !== 'parts') {
            improvedVerb1 = 'transforms';
            improvedPreposition = '';
        }
    }
    
    // === QUEST-SPECIFIC IMPROVEMENTS ===
    
    // North Node → always "THE CALL OF DESTINY"
    if (isNorthNode && questLower.includes('destiny') && !questLower.includes('call')) {
        improvedQuest = 'THE CALL OF DESTINY';
        improvedVerb2 = 'fulfill';
    }
    
    // House 5 + JOY → "manifest JOY" (not "create A MASTERPIECE")
    if (isHouse5 && questLower.includes('masterpiece')) {
        // For HERO/REBEL/WARRIOR, prefer JOY
        if (identity === 'A HERO' || identity === 'A REBEL' || identity === 'A WARRIOR') {
            improvedVerb2 = 'manifest';
            improvedQuest = 'JOY';
        }
    }
    
    // House 7 + Connection → "CONNECTION AND MEANING" for impactful shadows
    if (isHouse7 && quest === 'CONNECTION') {
        // Use "AND MEANING" for fog, veil, resistance, void (more poetic)
        if (shadow === 'THE FOG' || shadow === 'THE VEIL' || shadow === 'RESISTANCE' || 
            shadow === 'THE VOID' || shadow === 'THE HAZE') {
            improvedQuest = 'CONNECTION AND MEANING';
        }
    }
    
    // House 10 + Legacy → "build A LEGACY"
    if (isHouse10 && questLower.includes('legacy')) {
        improvedVerb2 = 'build';
        improvedQuest = 'A LEGACY';
    }
    
    // === IDENTITY-SPECIFIC IMPROVEMENTS ===
    
    // SEER + VOID → "parts THE VOID"
    if (identity === 'A SEER' && shadow === 'THE VOID') {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    }
    
    // WARRIOR + FOG → "parts THE FOG" (not "fights through")
    if (identity === 'A WARRIOR' && (shadow === 'THE FOG' || shadow === 'THE VEIL')) {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    }
    
    // REBEL + RESISTANCE → "overcomes RESISTANCE"
    if (identity === 'A REBEL' && shadow === 'RESISTANCE') {
        improvedVerb1 = 'overcomes';
        improvedPreposition = '';
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

console.log(`Batch LLM improvement on ${keys.length} sentences...\n`);

let changed = 0;
keys.forEach(key => {
    const original = current.sentences[key];
    const improvedSentence = batchImprove(original, key);
    
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

// Show your specific examples
console.log(`\nYour examples:\n`);
const examples = {
    'Hero + Conflict + Joy': improved['Sun_square_House_5'],
    'Hero + Resistance + Joy': improved['Sun_opposition_House_5'],
    'Seer + Void + Destiny': Object.values(improved).find(s => s.identity === 'A SEER' && s.shadow === 'THE VOID' && s.quest.includes('DESTINY')),
    'Rebel + Resistance + Legacy': improved['Uranus_opposition_House_10'],
    'Warrior + Fog + Connection': Object.values(improved).find(s => s.identity === 'A WARRIOR' && s.shadow === 'THE FOG' && s.quest.includes('CONNECTION'))
};

Object.entries(examples).forEach(([name, sentence]) => {
    if (sentence) {
        console.log(`${name}:`);
        console.log(`  ${sentence.full}\n`);
    } else {
        console.log(`${name}: Not found\n`);
    }
});


