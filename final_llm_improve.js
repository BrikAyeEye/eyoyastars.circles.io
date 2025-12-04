const fs = require('fs');

// Load current sentences
const current = JSON.parse(fs.readFileSync('boom_sentences_final.json', 'utf8'));

// Comprehensive improvement rules based on your examples
function finalImprove(sentence) {
    const { identity, verb1, preposition, shadow, verb2, quest } = sentence;
    const shadowLower = shadow.toLowerCase();
    const questLower = quest.toLowerCase();
    const identityLower = identity.toLowerCase();
    
    let improvedVerb1 = verb1;
    let improvedPreposition = preposition;
    let improvedVerb2 = verb2;
    let improvedQuest = quest;
    
    // Special cases based on your examples:
    
    // 1. "You are A HERO who overcomes CONFLICT to manifest JOY."
    if (identity === 'A HERO' && shadowLower.includes('conflict') && questLower.includes('joy')) {
        improvedVerb2 = 'manifest';
        improvedQuest = 'JOY';
    }
    
    // 2. "You are A SEER who parts THE VOID to fulfill THE CALL OF DESTINY."
    if (identity === 'A SEER' && shadowLower.includes('void') && questLower.includes('destiny')) {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
        improvedVerb2 = 'fulfill';
        improvedQuest = 'THE CALL OF DESTINY';
    }
    
    // 3. "You are A WARRIOR who fights through ALL OBSTACLES to forge CONNECTION AND MEANING."
    if (identity === 'A WARRIOR' && questLower.includes('connection')) {
        // For House_7, use "CONNECTION AND MEANING"
        if (questLower.includes('connection') && !questLower.includes('meaning')) {
            improvedQuest = 'CONNECTION AND MEANING';
        }
        // For fog/veil, use "parts" not "fights through"
        if (shadowLower.includes('fog') || shadowLower.includes('veil')) {
            improvedVerb1 = 'parts';
            improvedPreposition = '';
        }
    }
    
    // General improvements for better flow:
    
    // Verb1 improvements based on shadow
    if (shadowLower.includes('the void') || shadowLower.includes('the abyss')) {
        if (identity === 'A SEER' || identity === 'THE DEPTHS') {
            improvedVerb1 = 'parts';
            improvedPreposition = '';
        }
    }
    
    // Quest improvements for more meaning
    if (questLower.includes('destiny') && !questLower.includes('call')) {
        improvedQuest = 'THE CALL OF DESTINY';
    }
    
    if (questLower.includes('connection') && questLower.includes('house_7')) {
        // This is tricky - we'd need to know the house from the key
        // For now, if it's just "CONNECTION", consider adding "AND MEANING"
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

console.log(`Final improvement pass on ${keys.length} sentences...`);

keys.forEach(key => {
    const original = current.sentences[key];
    improved[key] = finalImprove(original);
});

// Save
const output = {
    total: keys.length,
    improvedAt: new Date().toISOString(),
    sentences: improved
};

fs.writeFileSync('boom_sentences_final.json', JSON.stringify(output, null, 2));

console.log(`✅ Final improvements complete`);
console.log(`Saved to boom_sentences_final.json`);


