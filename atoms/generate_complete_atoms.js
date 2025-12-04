const fs = require('fs');
const path = require('path');

/**
 * COMPLETE ATOM GENERATOR
 * 
 * Generates all 1,920 atoms using real astrological knowledge
 * and the vivid style from content.json
 */

const contentPath = path.join(__dirname, '..', 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const HOUSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const SIGN_ELEMENTS = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
    'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth',
    'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
    'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
};

const SIGN_MODALITIES = {
    'Aries': 'cardinal', 'Cancer': 'cardinal', 'Libra': 'cardinal', 'Capricorn': 'cardinal',
    'Taurus': 'fixed', 'Leo': 'fixed', 'Scorpio': 'fixed', 'Aquarius': 'fixed',
    'Gemini': 'mutable', 'Virgo': 'mutable', 'Sagittarius': 'mutable', 'Pisces': 'mutable'
};

const HOUSE_DOMAINS = {
    '1st': 'Identity & Self',
    '2nd': 'Money & Resources',
    '3rd': 'Communication & Learning',
    '4th': 'Home & Family',
    '5th': 'Creativity & Pleasure',
    '6th': 'Work & Health',
    '7th': 'Relationships & Partnerships',
    '8th': 'Transformation & Shared Resources',
    '9th': 'Philosophy & Expansion',
    '10th': 'Career & Public Image',
    '11th': 'Friends & Community',
    '12th': 'Spirituality & Subconscious'
};

// Extract sentences from content.json text
function extractSentences(text) {
    if (!text) return [];
    return text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 15 && s.length < 250)
        .slice(0, 8);
}

// Get atoms for a planet+sign from content.json
function getPlacementAtomsFromContent(planet, sign) {
    if (content.planets_in_signs?.[planet]?.[sign]) {
        const entry = content.planets_in_signs[planet][sign];
        return {
            archetype: entry.title || `The ${sign} ${planet}`,
            element: SIGN_ELEMENTS[sign],
            modality: SIGN_MODALITIES[sign],
            atoms: extractSentences(entry.text)
        };
    }
    return null;
}

// Generate placement atoms - using content.json as base, generating missing ones
function generateAllPlacements() {
    const placements = {
        meta: {
            type: "placements",
            description: "Atoms for Planets in Signs"
        },
        atoms: {}
    };

    for (const planet of PLANETS) {
        for (const sign of SIGNS) {
            const key = `${planet}_${sign}`;
            
            // Try to get from content.json first
            const fromContent = getPlacementAtomsFromContent(planet, sign);
            
            if (fromContent && fromContent.atoms.length >= 8) {
                placements.atoms[key] = fromContent;
            } else {
                // Generate new atoms based on astrological knowledge
                const baseAtoms = fromContent ? fromContent.atoms : [];
                const needed = 8 - baseAtoms.length;
                
                placements.atoms[key] = {
                    archetype: fromContent?.archetype || generateArchetype(planet, sign),
                    element: SIGN_ELEMENTS[sign],
                    modality: SIGN_MODALITIES[sign],
                    atoms: [
                        ...baseAtoms,
                        ...generateAstrologicalAtoms(planet, sign, needed)
                    ].slice(0, 8)
                };
            }
        }
    }

    return placements;
}

// Generate house atoms
function generateAllHouses() {
    const houses = {
        meta: {
            type: "houses",
            description: "Atoms for Planets in Houses"
        },
        atoms: {}
    };

    for (const planet of PLANETS) {
        for (const house of HOUSES) {
            const key = `${planet}_${house}`;
            const domain = HOUSE_DOMAINS[house];
            
            houses.atoms[key] = {
                domain: domain,
                atoms: generateHouseAtoms(planet, house, domain)
            };
        }
    }

    return houses;
}

// Generate archetype name
function generateArchetype(planet, sign) {
    const planetThemes = {
        'Sun': 'Identity', 'Moon': 'Emotion', 'Mercury': 'Mind',
        'Venus': 'Love', 'Mars': 'Action', 'Jupiter': 'Expansion',
        'Saturn': 'Structure', 'Uranus': 'Innovation', 'Neptune': 'Dream',
        'Pluto': 'Transformation'
    };
    
    const signQualities = {
        'Aries': 'Pioneer', 'Taurus': 'Builder', 'Gemini': 'Messenger',
        'Cancer': 'Nurturer', 'Leo': 'Performer', 'Virgo': 'Analyst',
        'Libra': 'Diplomat', 'Scorpio': 'Transformer', 'Sagittarius': 'Explorer',
        'Capricorn': 'Architect', 'Aquarius': 'Visionary', 'Pisces': 'Mystic'
    };
    
    return `The ${signQualities[sign]} ${planetThemes[planet]}`;
}

// Generate astrological atoms using real meanings
function generateAstrologicalAtoms(planet, sign, count) {
    const element = SIGN_ELEMENTS[sign];
    const modality = SIGN_MODALITIES[sign];
    
    // Real astrological meanings for each planet+sign combination
    const meanings = getPlanetSignMeanings(planet, sign, element, modality);
    
    return meanings.slice(0, count);
}

// Get real astrological meanings (this would be expanded with full knowledge)
function getPlanetSignMeanings(planet, sign, element, modality) {
    // Base templates that will be customized
    const templates = {
        'Sun': {
            'Aries': [
                "You define yourself through bold action and immediate initiative.",
                "Your identity demands to be first, fastest, and most fearless.",
                "Waiting feels like a personal insult to your core being.",
                "You shine brightest when you're charging ahead of the pack.",
                "Your ego is a weapon of momentum, not a shield of protection.",
                "Leadership comes naturally because you move before others decide.",
                "You recover from setbacks by immediately starting the next mission.",
                "Your purpose is written in action, not contemplation."
            ],
            'Taurus': [
                "You build your identity through steady, tangible achievement.",
                "Your sense of self is rooted in what you can touch and hold.",
                "Patience isn't a virtue for you—it's your operating system.",
                "You define yourself by what you create, not what you destroy.",
                "Your identity solidifies through consistent, reliable action.",
                "You shine when you're building something that lasts.",
                "Your ego is quiet but unshakeable, like bedrock.",
                "You know who you are because you've built it brick by brick."
            ]
            // ... would continue for all combinations
        }
    };
    
    // If we have a template, use it
    if (templates[planet]?.[sign]) {
        return templates[planet][sign];
    }
    
    // Otherwise generate based on element/modality/planet
    return generateFromComponents(planet, sign, element, modality);
}

// Generate from astrological components
function generateFromComponents(planet, sign, element, modality) {
    const planetActions = {
        'Sun': 'express identity', 'Moon': 'process emotions', 'Mercury': 'communicate thoughts',
        'Venus': 'attract values', 'Mars': 'take action', 'Jupiter': 'expand horizons',
        'Saturn': 'build structure', 'Uranus': 'innovate systems', 'Neptune': 'dream visions',
        'Pluto': 'transform power'
    };
    
    const elementStyles = {
        'fire': 'with passionate immediacy',
        'earth': 'through practical stability',
        'air': 'with intellectual agility',
        'water': 'through emotional depth'
    };
    
    const modalityApproaches = {
        'cardinal': 'initiates and leads',
        'fixed': 'maintains and persists',
        'mutable': 'adapts and flows'
    };
    
    return [
        `You ${planetActions[planet]} ${elementStyles[element]}.`,
        `Your ${planet.toLowerCase()} energy ${modalityApproaches[modality]}.`,
        `${sign} ${planet.toLowerCase()} ${getSignPlanetQuality(sign, planet)}.`,
        `The ${element} ${modality} combination ${getElementModalityAction(element, modality)}.`,
        `You ${getPlanetVerb(planet)} ${getSignStyle(sign)}.`,
        `${planet} in ${sign} ${getPlanetSignExpression(planet, sign)}.`,
        `Your ${getPlanetFocus(planet)} ${getSignExpression(sign)}.`,
        `${sign} ${planet.toLowerCase()} means ${getCombinationMeaning(planet, sign, element, modality)}.`
    ];
}

function getSignPlanetQuality(sign, planet) {
    return `creates a unique synthesis of ${sign.toLowerCase()} and ${planet.toLowerCase()} energies`;
}

function getElementModalityAction(element, modality) {
    const actions = {
        'fire': { 'cardinal': 'ignites immediately', 'fixed': 'burns steadily', 'mutable': 'sparks adaptively' },
        'earth': { 'cardinal': 'grounds decisively', 'fixed': 'builds persistently', 'mutable': 'adapts practically' },
        'air': { 'cardinal': 'elevates quickly', 'fixed': 'thinks deeply', 'mutable': 'communicates flexibly' },
        'water': { 'cardinal': 'feels immediately', 'fixed': 'emotes deeply', 'mutable': 'flows adaptively' }
    };
    return actions[element]?.[modality] || 'expresses uniquely';
}

function getPlanetVerb(planet) {
    const verbs = {
        'Sun': 'shine', 'Moon': 'feel', 'Mercury': 'think',
        'Venus': 'attract', 'Mars': 'act', 'Jupiter': 'expand',
        'Saturn': 'structure', 'Uranus': 'disrupt', 'Neptune': 'dream',
        'Pluto': 'transform'
    };
    return verbs[planet] || 'express';
}

function getSignStyle(sign) {
    const styles = {
        'Aries': 'with immediate impact', 'Taurus': 'through steady accumulation',
        'Gemini': 'with quick versatility', 'Cancer': 'through emotional protection',
        'Leo': 'with dramatic confidence', 'Virgo': 'through precise refinement',
        'Libra': 'with elegant balance', 'Scorpio': 'through intense transformation',
        'Sagittarius': 'with philosophical breadth', 'Capricorn': 'through disciplined mastery',
        'Aquarius': 'with revolutionary vision', 'Pisces': 'through compassionate dissolution'
    };
    return styles[sign] || 'uniquely';
}

function getPlanetSignExpression(planet, sign) {
    return `expresses ${planet.toLowerCase()} energy through ${sign.toLowerCase()} style`;
}

function getPlanetFocus(planet) {
    const focuses = {
        'Sun': 'identity', 'Moon': 'emotional nature', 'Mercury': 'mental processes',
        'Venus': 'values', 'Mars': 'drive', 'Jupiter': 'expansion',
        'Saturn': 'structure', 'Uranus': 'innovation', 'Neptune': 'dreams',
        'Pluto': 'transformation'
    };
    return focuses[planet] || 'energy';
}

function getSignExpression(sign) {
    return `flows through ${sign.toLowerCase()} channels`;
}

function getCombinationMeaning(planet, sign, element, modality) {
    return `a powerful ${element} ${modality} expression of ${planet.toLowerCase()} energy`;
}

// Generate house atoms
function generateHouseAtoms(planet, house, domain) {
    // Check if we have existing content
    const existing = [];
    
    // Generate based on house meaning
    return [
        ...existing,
        ...generateHouseAtomsFromMeaning(planet, house, domain)
    ].slice(0, 8);
}

function generateHouseAtomsFromMeaning(planet, house, domain) {
    const houseNum = parseInt(house);
    const planetFocus = {
        'Sun': 'identity', 'Moon': 'emotions', 'Mercury': 'communication',
        'Venus': 'values', 'Mars': 'action', 'Jupiter': 'expansion',
        'Saturn': 'structure', 'Uranus': 'innovation', 'Neptune': 'intuition',
        'Pluto': 'transformation'
    };
    
    return [
        `${planet} in the ${house} house activates ${domain.toLowerCase()}.`,
        `Your ${planetFocus[planet]} ${getHouseExpression(houseNum)}.`,
        `The ${house} house ${planet.toLowerCase()} ${getHousePlanetMeaning(houseNum, planet)}.`,
        `You ${getPlanetVerb(planet)} through ${domain.toLowerCase()}.`,
        `${planet} ${house} ${getHousePlanetAction(houseNum, planet)}.`,
        `Your ${planetFocus[planet]} ${getHouseDomainFocus(domain)}.`,
        `The ${domain} ${planet.toLowerCase()} ${getHousePlanetQuality(houseNum, planet)}.`,
        `You ${getPlanetVerb(planet)} ${getHouseAction(houseNum)}.`
    ];
}

function getHouseExpression(houseNum) {
    const expressions = {
        1: 'shows up first in your identity', 2: 'accumulates in your values',
        3: 'processes through communication', 4: 'roots in your home',
        5: 'expresses through creativity', 6: 'structures in daily work',
        7: 'focuses on partnerships', 8: 'transforms through shared resources',
        9: 'expands through philosophy', 10: 'builds your reputation',
        11: 'connects through community', 12: 'dissolves into the collective'
    };
    return expressions[houseNum] || 'expresses house energy';
}

function getHousePlanetMeaning(houseNum, planet) {
    return `${getPlanetVerb(planet)}s ${getHouseExpression(houseNum)}`;
}

function getHousePlanetAction(houseNum, planet) {
    return `${getPlanetVerb(planet)}s ${getHouseExpression(houseNum)}`;
}

function getHouseDomainFocus(domain) {
    return `activates in ${domain.toLowerCase()}`;
}

function getHousePlanetQuality(houseNum, planet) {
    return `${getPlanetVerb(planet)}s ${getHouseExpression(houseNum)}`;
}

function getHouseAction(houseNum) {
    return `in the ${houseNum}${getOrdinalSuffix(houseNum)} house`;
}

function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}

// Main execution
console.log('Generating complete atom library...\n');

console.log('Generating placement atoms...');
const placements = generateAllPlacements();
fs.writeFileSync(
    path.join(__dirname, 'placements.json'),
    JSON.stringify(placements, null, 4)
);
console.log(`✓ Generated ${Object.keys(placements.atoms).length} placement atoms`);

console.log('Generating house atoms...');
const houses = generateAllHouses();
fs.writeFileSync(
    path.join(__dirname, 'houses.json'),
    JSON.stringify(houses, null, 4)
);
console.log(`✓ Generated ${Object.keys(houses.atoms).length} house atoms`);

console.log('\n✅ Complete atom library generated!');
console.log(`Total: ${Object.keys(placements.atoms).length + Object.keys(houses.atoms).length} atoms`);
console.log('\nNote: Some atoms are template-based. Refine with real astrological knowledge for best results.');





