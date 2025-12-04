const fs = require('fs');

// Load validated sentences
const validated = JSON.parse(fs.readFileSync('boom_sentences_validated.json', 'utf8'));

// Improvement rules based on semantic meaning and flow
function improveSentence(combo) {
    const { identity, verb1, preposition, shadow, verb2, quest } = combo;
    const shadowLower = shadow.toLowerCase();
    const questLower = quest.toLowerCase();
    
    let improvedVerb1 = verb1;
    let improvedPreposition = preposition;
    let improvedVerb2 = verb2;
    let improvedQuest = quest;
    
    // Improve verb1 based on shadow type (more meaningful verbs)
    if (shadowLower.includes('resistance') || shadowLower.includes('opposition') || shadowLower.includes('the divide')) {
        improvedVerb1 = 'overcomes';
        improvedPreposition = '';
    } else if (shadowLower.includes('conflict') || shadowLower.includes('friction') || shadowLower.includes('the battle') || shadowLower.includes('tension')) {
        improvedVerb1 = 'overcomes';
        improvedPreposition = '';
    } else if (shadowLower.includes('the fog') || shadowLower.includes('the veil') || shadowLower.includes('illusion') || shadowLower.includes('the haze')) {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    } else if (shadowLower.includes('the void') || shadowLower.includes('the abyss')) {
        improvedVerb1 = 'parts';
        improvedPreposition = '';
    } else if (shadowLower.includes('destruction') || shadowLower.includes('obsession')) {
        improvedVerb1 = 'transforms';
        improvedPreposition = '';
    } else if (shadowLower.includes('restriction') || shadowLower.includes('the wall') || shadowLower.includes('limitation') || shadowLower.includes('the cage')) {
        improvedVerb1 = 'breaks';
        improvedPreposition = 'through';
    } else if (shadowLower.includes('burnout') || shadowLower.includes('the fire') || shadowLower.includes('exhaustion')) {
        improvedVerb1 = 'transforms';
        improvedPreposition = '';
    } else if (shadowLower.includes('chaos') || shadowLower.includes('the rebellion') || shadowLower.includes('disruption') || shadowLower.includes('the break')) {
        improvedVerb1 = 'channels';
        improvedPreposition = '';
    } else if (shadowLower.includes('the unconscious') || shadowLower.includes('the shadow') || shadowLower.includes('isolation') || shadowLower.includes('the hidden')) {
        improvedVerb1 = 'illuminates';
        improvedPreposition = '';
    }
    
    // Improve verb2 + quest based on quest type (more meaningful combinations)
    if (questLower.includes('yourself') || questLower.includes('autonomy') || questLower.includes('freedom')) {
        improvedVerb2 = 'claim';
        if (questLower.includes('yourself')) improvedQuest = 'YOURSELF';
        else if (questLower.includes('autonomy')) improvedQuest = 'AUTONOMY';
        else improvedQuest = 'FREEDOM';
    } else if (questLower.includes('joy') || questLower.includes('vision') || questLower.includes('masterpiece')) {
        improvedVerb2 = 'manifest';
        if (questLower.includes('joy')) improvedQuest = 'JOY';
        else if (questLower.includes('vision')) improvedQuest = 'YOUR VISION';
        else improvedQuest = 'A MASTERPIECE';
    } else if (questLower.includes('legacy') || questLower.includes('impact') || questLower.includes('authority')) {
        improvedVerb2 = 'build';
        if (questLower.includes('legacy')) improvedQuest = 'A LEGACY';
        else if (questLower.includes('impact')) improvedQuest = 'IMPACT';
        else improvedQuest = 'AUTHORITY';
    } else if (questLower.includes('destiny') || questLower.includes('purpose') || questLower.includes('evolution')) {
        improvedVerb2 = 'fulfill';
        if (questLower.includes('destiny') && questLower.includes('call')) improvedQuest = 'THE CALL OF DESTINY';
        else if (questLower.includes('destiny')) improvedQuest = 'DESTINY';
        else if (questLower.includes('purpose')) improvedQuest = 'YOUR PURPOSE';
        else improvedQuest = 'EVOLUTION';
    } else if (questLower.includes('connection') || questLower.includes('meaning') || questLower.includes('union') || questLower.includes('partnership')) {
        improvedVerb2 = 'forge';
        if (questLower.includes('connection') && questLower.includes('meaning')) improvedQuest = 'CONNECTION AND MEANING';
        else if (questLower.includes('connection')) improvedQuest = 'CONNECTION';
        else if (questLower.includes('union')) improvedQuest = 'UNION';
        else if (questLower.includes('partnership')) improvedQuest = 'PARTNERSHIP';
        else improvedQuest = 'MEANING';
    } else if (questLower.includes('transformation') || questLower.includes('depth') || questLower.includes('power')) {
        improvedVerb2 = 'embrace';
        if (questLower.includes('transformation')) improvedQuest = 'TRANSFORMATION';
        else if (questLower.includes('depth')) improvedQuest = 'DEPTH';
        else improvedQuest = 'POWER';
    } else if (questLower.includes('truth') || questLower.includes('meaning') && !questLower.includes('connection')) {
        improvedVerb2 = 'discover';
        if (questLower.includes('truth')) improvedQuest = 'TRUTH';
        else improvedQuest = 'MEANING';
    } else if (questLower.includes('peace') || questLower.includes('transcendence') || questLower.includes('surrender')) {
        improvedVerb2 = 'find';
        if (questLower.includes('peace')) improvedQuest = 'PEACE';
        else if (questLower.includes('transcendence')) improvedQuest = 'TRANSCENDENCE';
        else improvedQuest = 'SURRENDER';
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
const keys = Object.keys(validated.sentences);

console.log(`Processing ${keys.length} sentences...`);

keys.forEach(key => {
    const original = validated.sentences[key];
    improved[key] = improveSentence(original);
});

// Save improved sentences
const output = {
    total: keys.length,
    improvedAt: new Date().toISOString(),
    sentences: improved
};

fs.writeFileSync('boom_sentences_final.json', JSON.stringify(output, null, 2));

console.log(`\n✅ Improved ${keys.length} sentences`);
console.log(`Saved to boom_sentences_final.json`);

// Show sample improvements
console.log(`\nSample improvements:\n`);
const sampleKeys = keys.slice(0, 5);
sampleKeys.forEach(key => {
    const orig = validated.sentences[key];
    const impr = improved[key];
    if (orig.full !== impr.full) {
        console.log(`${key}:`);
        console.log(`  Before: ${orig.full}`);
        console.log(`  After:  ${impr.full}\n`);
    }
});


