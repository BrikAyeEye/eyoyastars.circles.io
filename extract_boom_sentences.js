const fs = require('fs');

// These are the maps from chart.js
const IDENTITY_MAP = {
    Sun: { text: ['A HERO', 'A LEADER', 'A FORCE'], verb: ['CONQUERING', 'DRIVING', 'COMMANDING'] },
    Moon: { text: ['A SOUL', 'A FEELER', 'A TIDE'], verb: ['NAVIGATING', 'RESPONDING', 'FLOWING'] },
    Ascendant: { text: ['A PRESENCE', 'A MASK', 'A FACE'], verb: ['PROJECTING', 'WEARING', 'SHOWING'] },
    Mercury: { text: ['A THINKER', 'A MIND', 'A WIRE'], verb: ['DECODING', 'PROCESSING', 'CONNECTING'] },
    Venus: { text: ['A LOVER', 'A MAGNET', 'A HEART'], verb: ['UNITING', 'ATTRACTING', 'EMBRACING'] },
    Mars: { text: ['A WARRIOR', 'A FIGHTER', 'A BLADE'], verb: ['FIGHTING', 'CHARGING', 'STRIKING'] },
    Jupiter: { text: ['A SAGE', 'A VISIONARY', 'AN EXPANDER'], verb: ['EXPANDING', 'AMPLIFYING', 'GROWING THROUGH'] },
    Saturn: { text: ['A BUILDER', 'AN ARCHITECT', 'A STONE'], verb: ['STRUCTURING', 'CONSTRUCTING', 'CARVING THROUGH'] },
    Uranus: { text: ['A REBEL', 'A DISRUPTOR', 'AN AWAKENER'], verb: ['SHATTERING', 'BREAKING', 'LIBERATING'] },
    Neptune: { text: ['A DREAMER', 'A MYSTIC', 'A DISSOLVER'], verb: ['DISSOLVING', 'TRANSCENDING', 'FLOWING THROUGH'] },
    Pluto: { text: ['A FORCE', 'A TRANSFORMER', 'THE DEPTHS'], verb: ['TRANSFORMING', 'TRANSMUTING', 'RISING FROM'] },

    Sun_Moon: { text: ['A CORE', 'THE WHOLE', 'A UNITY'], verb: ['ALIGNING', 'INTEGRATING', 'FUSING'] },
    Sun_Mars: { text: ['A FORCE', 'AN ENGINE', 'A FIRE'], verb: ['DRIVING', 'PROPELLING', 'BURNING THROUGH'] },
    Sun_Uranus: { text: ['A REBEL', 'A DISRUPTOR', 'AN AWAKENER'], verb: ['BREAKING', 'SHATTERING', 'LIBERATING'] },
    Sun_Pluto: { text: ['A PHOENIX', 'A TRANSFORMER', 'THE DEPTHS'], verb: ['RISING FROM', 'TRANSMUTING', 'DIVING THROUGH'] },
    Moon_Pluto: { text: ['A SEER', 'THE DEPTHS', 'A TRANSFORMER'], verb: ['PIERCING', 'DIVING THROUGH', 'TRANSMUTING'] },
    Mercury_Uranus: { text: ['AN INVENTOR', 'A HACKER', 'A WIRE'], verb: ['HACKING', 'REWIRING', 'CRACKING'] },
    Mars_Saturn: { text: ['A STRATEGIST', 'A HAMMER', 'A FOUNDATION'], verb: ['OVERCOMING', 'BUILDING THROUGH', 'FORGING PAST'] },
    Mars_Pluto: { text: ['A VOLCANO', 'A FORCE', 'THE DEPTHS'], verb: ['ERUPTING THROUGH', 'TRANSFORMING', 'CONSUMING'] },
    Venus_Pluto: { text: ['AN OBSESSION', 'A MAGNET', 'DEPTH'], verb: ['CONSUMING', 'PULLING', 'FUSING WITH'] }
};

const SHADOW_MAP = {
    square: ['CONFLICT', 'FRICTION', 'THE BATTLE', 'TENSION'],
    opposition: ['RESISTANCE', 'THE DIVIDE', 'OPPOSITION', 'THE PULL'],
    Saturn: ['RESTRICTION', 'THE WALL', 'LIMITATION', 'THE CAGE'],
    Neptune: ['THE FOG', 'THE VEIL', 'ILLUSION', 'THE HAZE'],
    Pluto: ['DESTRUCTION', 'THE VOID', 'OBSESSION', 'THE ABYSS'],
    Mars: ['BURNOUT', 'CONFLICT', 'THE FIRE', 'EXHAUSTION'],
    Uranus: ['CHAOS', 'THE REBELLION', 'DISRUPTION', 'THE BREAK'],
    House_12: ['THE UNCONSCIOUS', 'THE SHADOW', 'ISOLATION', 'THE HIDDEN']
};

const QUEST_MAP = {
    House_1: { verb: ['MASTER', 'CLAIM', 'BECOME'], text: ['YOURSELF', 'AUTONOMY', 'FREEDOM'] },
    House_2: { verb: ['BUILD', 'SECURE', 'ANCHOR'], text: ['VALUE', 'WORTH', 'FOUNDATION'] },
    House_3: { verb: ['FIND', 'EXPRESS', 'CLAIM'], text: ['YOUR VOICE', 'CONNECTION', 'CLARITY'] },
    House_4: { verb: ['SECURE', 'BUILD', 'ANCHOR'], text: ['FOUNDATION', 'ROOTS', 'SAFETY'] },
    House_5: { verb: ['CREATE', 'BIRTH', 'EXPRESS'], text: ['A MASTERPIECE', 'JOY', 'YOUR VISION'] },
    House_6: { verb: ['PERFECT', 'MASTER', 'REFINE'], text: ['YOUR CRAFT', 'MASTERY', 'SERVICE'] },
    House_7: { verb: ['FORGE', 'BUILD', 'FIND'], text: ['CONNECTION', 'UNION', 'PARTNERSHIP'] },
    House_8: { verb: ['TRIGGER', 'ACTIVATE', 'EMBRACE'], text: ['TRANSFORMATION', 'DEPTH', 'POWER'] },
    House_9: { verb: ['DISCOVER', 'SEEK', 'UNCOVER'], text: ['TRUTH', 'MEANING', 'FREEDOM'] },
    House_10: { verb: ['BUILD', 'FORGE', 'ARCHITECT'], text: ['A LEGACY', 'IMPACT', 'AUTHORITY'] },
    House_11: { verb: ['MANIFEST', 'BUILD', 'ACTIVATE'], text: ['A VISION', 'THE FUTURE', 'CHANGE'] },
    House_12: { verb: ['FIND', 'DISSOLVE INTO', 'REACH'], text: ['PEACE', 'TRANSCENDENCE', 'SURRENDER'] },
    NorthNode: { verb: ['FULFILL', 'REACH', 'CLAIM'], text: ['DESTINY', 'YOUR PURPOSE', 'EVOLUTION'] }
};

let output = '=== BOOM SCREEN SENTENCE ATOMS ===\n\n';
output += 'These are the building blocks for the "Boom Screen" sentences.\n';
output += 'Format: "You are [IDENTITY] [verb] [ENEMY], [verb] [DIRECTION]"\n\n';

// IDENTITY MAP
output += '=== IDENTITY (Energy Card) ===\n\n';
Object.keys(IDENTITY_MAP).sort().forEach(key => {
    const entry = IDENTITY_MAP[key];
    output += `[${key}]\n`;
    output += `  Text options: ${entry.text.join(', ')}\n`;
    output += `  Verb options: ${entry.verb.join(', ')}\n\n`;
});

// SHADOW MAP
output += '\n=== SHADOW (Enemy Card) ===\n\n';
Object.keys(SHADOW_MAP).sort().forEach(key => {
    const entry = SHADOW_MAP[key];
    output += `[${key}]\n`;
    output += `  Options: ${entry.join(', ')}\n\n`;
});

// QUEST MAP
output += '\n=== QUEST (Direction Card) ===\n\n';
Object.keys(QUEST_MAP).sort().forEach(key => {
    const entry = QUEST_MAP[key];
    output += `[${key}]\n`;
    output += `  Verb options: ${entry.verb.join(', ')}\n`;
    output += `  Text options: ${entry.text.join(', ')}\n\n`;
});

// Generate example combinations
output += '\n=== EXAMPLE BOOM SCREEN SENTENCES ===\n\n';
output += 'Examples of how these combine:\n\n';

// Example 1: Uranus (REBEL) + opposition (RESISTANCE) + House_10 (A LEGACY)
output += 'Example 1:\n';
output += '  Identity: A REBEL (Uranus)\n';
output += '  Verb: liberating (Uranus verb)\n';
output += '  Enemy: RESISTANCE (opposition)\n';
output += '  Verb: build (House_10 verb)\n';
output += '  Direction: A LEGACY (House_10 text)\n';
output += '  Result: "You are A REBEL liberating RESISTANCE to build A LEGACY."\n\n';

// Example 2: Sun (A HERO) + square (CONFLICT) + House_5 (JOY)
output += 'Example 2:\n';
output += '  Identity: A HERO (Sun)\n';
output += '  Verb: conquering (Sun verb)\n';
output += '  Enemy: CONFLICT (square)\n';
output += '  Verb: create (House_5 verb)\n';
output += '  Direction: JOY (House_5 text)\n';
output += '  Result: "You are A HERO conquering CONFLICT to create JOY."\n\n';

// Example 3: Moon_Pluto (A SEER) + Pluto (THE VOID) + NorthNode (DESTINY)
output += 'Example 3:\n';
output += '  Identity: A SEER (Moon_Pluto)\n';
output += '  Verb: piercing (Moon_Pluto verb)\n';
output += '  Enemy: THE VOID (Pluto)\n';
output += '  Verb: fulfill (NorthNode verb)\n';
output += '  Direction: DESTINY (NorthNode text)\n';
output += '  Result: "You are A SEER piercing THE VOID to fulfill DESTINY."\n\n';

// Count totals
const identityCount = Object.keys(IDENTITY_MAP).length;
const shadowCount = Object.keys(SHADOW_MAP).length;
const questCount = Object.keys(QUEST_MAP).length;

output += `\n=== SUMMARY ===\n`;
output += `Identity atoms: ${identityCount}\n`;
output += `Shadow atoms: ${shadowCount}\n`;
output += `Quest atoms: ${questCount}\n`;
output += `\nTotal possible combinations: ${identityCount} × ${shadowCount} × ${questCount} = ${identityCount * shadowCount * questCount} unique Boom Screen sentences\n`;

fs.writeFileSync('boom_screen_sentences.txt', output, 'utf8');
console.log('Done! Wrote Boom Screen sentence atoms to boom_screen_sentences.txt');


