const fs = require('fs');

// Copy the maps from chart.js
const IDENTITY_MAP = {
    Sun: { text: ['A HERO', 'A LEADER', 'A FORCE'], verb: ['who conquers', 'who drives', 'who commands'] },
    Moon: { text: ['A SOUL', 'A FEELER', 'A TIDE'], verb: ['who navigates', 'who responds', 'who flows'] },
    Ascendant: { text: ['A PRESENCE', 'A MASK', 'A FACE'], verb: ['who projects', 'who wears', 'who shows'] },
    Mercury: { text: ['A THINKER', 'A MIND', 'A WIRE'], verb: ['who decodes', 'who processes', 'who connects'] },
    Venus: { text: ['A LOVER', 'A MAGNET', 'A HEART'], verb: ['who unites', 'who attracts', 'who embraces'] },
    Mars: { text: ['A WARRIOR', 'A FIGHTER', 'A BLADE'], verb: ['who fights', 'who charges', 'who strikes'] },
    Jupiter: { text: ['A SAGE', 'A VISIONARY', 'AN EXPANDER'], verb: ['who expands', 'who amplifies', 'who grows'] },
    Saturn: { text: ['A BUILDER', 'AN ARCHITECT', 'A STONE'], verb: ['who structures', 'who constructs', 'who carves'] },
    Uranus: { text: ['A REBEL', 'A DISRUPTOR', 'AN AWAKENER'], verb: ['who shatters', 'who breaks', 'who liberates'] },
    Neptune: { text: ['A DREAMER', 'A MYSTIC', 'A DISSOLVER'], verb: ['who dissolves', 'who transcends', 'who flows'] },
    Pluto: { text: ['A FORCE', 'A TRANSFORMER', 'THE DEPTHS'], verb: ['who transforms', 'who transmutes', 'who rises'] },

    Sun_Moon: { text: ['A CORE', 'THE WHOLE', 'A UNITY'], verb: ['who aligns', 'who integrates', 'who fuses'] },
    Sun_Mars: { text: ['A FORCE', 'AN ENGINE', 'A FIRE'], verb: ['who drives', 'who propels', 'who burns'] },
    Sun_Uranus: { text: ['A REBEL', 'A DISRUPTOR', 'AN AWAKENER'], verb: ['who breaks', 'who shatters', 'who liberates'] },
    Sun_Pluto: { text: ['A PHOENIX', 'A TRANSFORMER', 'THE DEPTHS'], verb: ['who rises', 'who transmutes', 'who dives'] },
    Moon_Pluto: { text: ['A SEER', 'THE DEPTHS', 'A TRANSFORMER'], verb: ['who pierces', 'who dives', 'who transmutes'] },
    Mercury_Uranus: { text: ['AN INVENTOR', 'A HACKER', 'A WIRE'], verb: ['who hacks', 'who rewires', 'who cracks'] },
    Mars_Saturn: { text: ['A STRATEGIST', 'A HAMMER', 'A FOUNDATION'], verb: ['who overcomes', 'who builds', 'who forges'] },
    Mars_Pluto: { text: ['A VOLCANO', 'A FORCE', 'THE DEPTHS'], verb: ['who erupts', 'who transforms', 'who consumes'] },
    Venus_Pluto: { text: ['AN OBSESSION', 'A MAGNET', 'DEPTH'], verb: ['who consumes', 'who pulls', 'who fuses'] }
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
    House_1: { verb: ['master', 'claim', 'become'], text: ['YOURSELF', 'AUTONOMY', 'FREEDOM'] },
    House_2: { verb: ['build', 'secure', 'anchor'], text: ['VALUE', 'WORTH', 'FOUNDATION'] },
    House_3: { verb: ['find', 'express', 'claim'], text: ['YOUR VOICE', 'CONNECTION', 'CLARITY'] },
    House_4: { verb: ['secure', 'build', 'anchor'], text: ['FOUNDATION', 'ROOTS', 'SAFETY'] },
    House_5: { verb: ['create', 'birth', 'express', 'manifest'], text: ['A MASTERPIECE', 'JOY', 'YOUR VISION'] },
    House_6: { verb: ['perfect', 'master', 'refine'], text: ['YOUR CRAFT', 'MASTERY', 'SERVICE'] },
    House_7: { verb: ['forge', 'build', 'find'], text: ['CONNECTION', 'UNION', 'PARTNERSHIP', 'CONNECTION AND MEANING'] },
    House_8: { verb: ['trigger', 'activate', 'embrace'], text: ['TRANSFORMATION', 'DEPTH', 'POWER'] },
    House_9: { verb: ['discover', 'seek', 'uncover'], text: ['TRUTH', 'MEANING', 'FREEDOM'] },
    House_10: { verb: ['build', 'forge', 'architect'], text: ['A LEGACY', 'IMPACT', 'AUTHORITY'] },
    House_11: { verb: ['manifest', 'build', 'activate'], text: ['A VISION', 'THE FUTURE', 'CHANGE'] },
    House_12: { verb: ['find', 'dissolve into', 'reach'], text: ['PEACE', 'TRANSCENDENCE', 'SURRENDER'] },
    NorthNode: { verb: ['fulfill', 'reach', 'claim'], text: ['DESTINY', 'YOUR PURPOSE', 'EVOLUTION', 'THE CALL OF DESTINY'] }
};

// Generate all combinations
const combinations = [];

Object.keys(IDENTITY_MAP).forEach(identityKey => {
    const identity = IDENTITY_MAP[identityKey];
    
    Object.keys(SHADOW_MAP).forEach(shadowKey => {
        const shadows = SHADOW_MAP[shadowKey];
        
        Object.keys(QUEST_MAP).forEach(questKey => {
            const quest = QUEST_MAP[questKey];
            
            // Generate all variations
            identity.text.forEach(identityText => {
                identity.verb.forEach(identityVerb => {
                    shadows.forEach(shadowText => {
                        quest.verb.forEach(questVerb => {
                            quest.text.forEach(questText => {
                                const key = `${identityKey}_${shadowKey}_${questKey}`;
                                
                                // Extract verb from "who [verb]" format
                                const verb1 = identityVerb.replace('who ', '');
                                
                                // Determine preposition based on shadow
                                const shadowLower = shadowText.toLowerCase();
                                let preposition = '';
                                let actionVerb = verb1;
                                
                                // Smart verb + preposition mapping
                                if (shadowLower.includes('resistance') || shadowLower.includes('the divide') || shadowLower.includes('opposition')) {
                                    actionVerb = 'overcomes';
                                } else if (shadowLower.includes('conflict') || shadowLower.includes('friction') || shadowLower.includes('the battle') || shadowLower.includes('tension')) {
                                    actionVerb = 'overcomes';
                                } else if (shadowLower.includes('the fog') || shadowLower.includes('the veil') || shadowLower.includes('illusion') || shadowLower.includes('the haze')) {
                                    actionVerb = 'parts';
                                } else if (shadowLower.includes('the void') || shadowLower.includes('destruction') || shadowLower.includes('obsession') || shadowLower.includes('the abyss')) {
                                    actionVerb = 'parts';
                                } else if (shadowLower.includes('restriction') || shadowLower.includes('the wall') || shadowLower.includes('limitation') || shadowLower.includes('the cage')) {
                                    actionVerb = 'breaks';
                                    preposition = 'through';
                                } else if (shadowLower.includes('burnout') || shadowLower.includes('the fire') || shadowLower.includes('exhaustion')) {
                                    actionVerb = 'transforms';
                                } else if (shadowLower.includes('chaos') || shadowLower.includes('the rebellion') || shadowLower.includes('disruption') || shadowLower.includes('the break')) {
                                    actionVerb = 'channels';
                                } else if (shadowLower.includes('the unconscious') || shadowLower.includes('the shadow') || shadowLower.includes('isolation') || shadowLower.includes('the hidden')) {
                                    actionVerb = 'illuminates';
                                }
                                
                                const fullSentence = `You are ${identityText} who ${actionVerb} ${preposition ? preposition + ' ' : ''}${shadowText} to ${questVerb} ${questText}.`.trim();
                                
                                combinations.push({
                                    key: key,
                                    identityKey: identityKey,
                                    shadowKey: shadowKey,
                                    questKey: questKey,
                                    identity: identityText,
                                    verb1: actionVerb,
                                    preposition: preposition,
                                    shadow: shadowText,
                                    verb2: questVerb,
                                    quest: questText,
                                    full: fullSentence
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Group by key and take first variation (we'll improve all variations later)
const grouped = {};
combinations.forEach(combo => {
    if (!grouped[combo.key]) {
        grouped[combo.key] = [];
    }
    grouped[combo.key].push(combo);
});

// Save for validation
const output = {
    totalCombinations: Object.keys(grouped).length,
    totalVariations: combinations.length,
    combinations: grouped,
    generatedAt: new Date().toISOString()
};

fs.writeFileSync('boom_combinations_raw.json', JSON.stringify(output, null, 2));
console.log(`Generated ${Object.keys(grouped).length} unique combinations with ${combinations.length} total variations`);
console.log('Saved to boom_combinations_raw.json');


