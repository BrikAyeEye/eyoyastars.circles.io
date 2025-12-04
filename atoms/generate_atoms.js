const fs = require('fs');
const path = require('path');

/**
 * ATOM GENERATOR
 * 
 * Generates all 1,920 atoms (960 placements + 960 houses) systematically.
 * Uses the vivid, punchy style from content.json.
 */

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const HOUSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

// Element and modality mappings
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

// House domains
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

// Load existing content.json for style reference
const contentPath = path.join(__dirname, '..', 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Generate placement atoms
function generatePlacementAtoms() {
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
            
            // Check if we have existing content
            if (content.planets_in_signs?.[planet]?.[sign]) {
                const existing = content.planets_in_signs[planet][sign];
                const textParts = existing.text.split('. ').filter(p => p.length > 10);
                
                placements.atoms[key] = {
                    archetype: existing.title || `The ${sign} ${planet}`,
                    element: SIGN_ELEMENTS[sign],
                    modality: SIGN_MODALITIES[sign],
                    atoms: textParts.length >= 8 ? textParts.slice(0, 8) : [
                        ...textParts,
                        ...generatePlacementAtomVariations(planet, sign, textParts.length)
                    ]
                };
            } else {
                // Generate new atoms
                placements.atoms[key] = {
                    archetype: `The ${sign} ${planet}`,
                    element: SIGN_ELEMENTS[sign],
                    modality: SIGN_MODALITIES[sign],
                    atoms: generatePlacementAtomVariations(planet, sign, 0)
                };
            }
        }
    }

    return placements;
}

// Generate house atoms
function generateHouseAtoms() {
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
            
            // Check if we have existing content
            if (content.planets_in_houses?.[planet]?.[house]) {
                const existing = content.planets_in_houses[planet][house];
                const textParts = existing.text.split('. ').filter(p => p.length > 10);
                
                houses.atoms[key] = {
                    domain: domain,
                    atoms: textParts.length >= 8 ? textParts.slice(0, 8) : [
                        ...textParts,
                        ...generateHouseAtomVariations(planet, house, domain, textParts.length)
                    ]
                };
            } else {
                // Generate new atoms
                houses.atoms[key] = {
                    domain: domain,
                    atoms: generateHouseAtomVariations(planet, house, domain, 0)
                };
            }
        }
    }

    return houses;
}

// Generate placement atom variations
function generatePlacementAtomVariations(planet, sign, existingCount) {
    const needed = 8 - existingCount;
    if (needed <= 0) return [];
    
    const element = SIGN_ELEMENTS[sign];
    const modality = SIGN_MODALITIES[sign];
    const planetFocus = {
        'Sun': 'identity', 'Moon': 'emotions', 'Mercury': 'mind',
        'Venus': 'love', 'Mars': 'action', 'Jupiter': 'expansion',
        'Saturn': 'discipline', 'Uranus': 'freedom', 'Neptune': 'dreams',
        'Pluto': 'transformation'
    };
    
    const templates = [
        `Your ${planetFocus[planet]} ${element === 'fire' ? 'ignites' : element === 'earth' ? 'grounds' : element === 'air' ? 'elevates' : 'flows'} through ${sign.toLowerCase()} energy.`,
        `${modality === 'cardinal' ? 'You initiate' : modality === 'fixed' ? 'You anchor' : 'You adapt'} with ${sign.toLowerCase()} precision.`,
        `${sign} ${planet.toLowerCase()} means you ${getPlanetAction(planet, sign)}.`,
        `The ${sign} ${planet} archetype ${getSignQuality(sign)}.`,
        `You ${getPlanetVerb(planet)} ${getSignStyle(sign)}.`,
        `${planet} in ${sign} ${getElementQuality(element)}.`,
        `Your ${planetFocus[planet]} ${getModalityQuality(modality)}.`,
        `${sign} ${planet.toLowerCase()} ${getCombinationQuality(planet, sign)}.`
    ];
    
    return templates.slice(0, needed).map(t => expandTemplate(t, planet, sign, element, modality));
}

// Generate house atom variations
function generateHouseAtomVariations(planet, house, domain, existingCount) {
    const needed = 8 - existingCount;
    if (needed <= 0) return [];
    
    const houseNum = parseInt(house);
    const planetFocus = {
        'Sun': 'identity', 'Moon': 'emotions', 'Mercury': 'communication',
        'Venus': 'values', 'Mars': 'action', 'Jupiter': 'expansion',
        'Saturn': 'structure', 'Uranus': 'innovation', 'Neptune': 'intuition',
        'Pluto': 'transformation'
    };
    
    const templates = [
        `${planet} in the ${house} house ${getHouseAction(houseNum)}.`,
        `Your ${planetFocus[planet]} ${getHouseFocus(houseNum)}.`,
        `The ${house} house ${planet.toLowerCase()} ${getHouseQuality(houseNum)}.`,
        `You ${getPlanetVerb(planet)} through ${domain.toLowerCase()}.`,
        `${planet} ${house} ${getHousePlanetCombination(planet, houseNum)}.`,
        `Your ${planetFocus[planet]} ${getHouseDomainAction(domain)}.`,
        `${house} house ${planet.toLowerCase()} ${getHousePlanetQuality(planet, houseNum)}.`,
        `The ${domain} ${planet.toLowerCase()} ${getHousePlanetStyle(planet, houseNum)}.`
    ];
    
    return templates.slice(0, needed).map(t => expandHouseTemplate(t, planet, house, domain, houseNum));
}

// Helper functions for generating vivid, punchy atoms
function getPlanetAction(planet, sign) {
    const actions = {
        'Sun': {
            'Aries': 'charge first and ask questions later',
            'Taurus': 'build with deliberate patience',
            'Gemini': 'think in parallel universes',
            'Cancer': 'protect what matters most',
            'Leo': 'command attention effortlessly',
            'Virgo': 'perfect every detail',
            'Libra': 'balance beauty and truth',
            'Scorpio': 'dive into hidden depths',
            'Sagittarius': 'chase horizons relentlessly',
            'Capricorn': 'climb with iron discipline',
            'Aquarius': 'rewrite the rules',
            'Pisces': 'dissolve boundaries'
        }
    };
    return actions[planet]?.[sign] || `express ${planet.toLowerCase()} energy`;
}

function getSignQuality(sign) {
    const qualities = {
        'Aries': 'demands action and immediacy',
        'Taurus': 'values stability and substance',
        'Gemini': 'thrives on variety and curiosity',
        'Cancer': 'protects through emotional intelligence',
        'Leo': 'radiates confidence and warmth',
        'Virgo': 'refines through precision',
        'Libra': 'seeks harmony and beauty',
        'Scorpio': 'transforms through intensity',
        'Sagittarius': 'expands through truth-seeking',
        'Capricorn': 'builds through discipline',
        'Aquarius': 'innovates through detachment',
        'Pisces': 'transcends through compassion'
    };
    return qualities[sign] || 'expresses unique qualities';
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
        'Aries': 'with immediate impact',
        'Taurus': 'through steady accumulation',
        'Gemini': 'with quick wit',
        'Cancer': 'through emotional depth',
        'Leo': 'with dramatic flair',
        'Virgo': 'through meticulous precision',
        'Libra': 'with elegant balance',
        'Scorpio': 'through intense transformation',
        'Sagittarius': 'with philosophical breadth',
        'Capricorn': 'through disciplined mastery',
        'Aquarius': 'with revolutionary vision',
        'Pisces': 'through compassionate dissolution'
    };
    return styles[sign] || 'uniquely';
}

function getElementQuality(element) {
    const qualities = {
        'fire': 'burns with passion and initiative',
        'earth': 'grounds through practicality and stability',
        'air': 'elevates through intellect and communication',
        'water': 'flows through emotion and intuition'
    };
    return qualities[element] || 'expresses elemental energy';
}

function getModalityQuality(modality) {
    const qualities = {
        'cardinal': 'initiates change',
        'fixed': 'maintains stability',
        'mutable': 'adapts fluidly'
    };
    return qualities[modality] || 'expresses modality';
}

function getCombinationQuality(planet, sign) {
    // This would be expanded with actual astrological knowledge
    return `creates a unique ${planet.toLowerCase()}-${sign.toLowerCase()} expression`;
}

function expandTemplate(template, planet, sign, element, modality) {
    // Replace placeholders with actual content
    return template
        .replace(/\{planet\}/g, planet)
        .replace(/\{sign\}/g, sign)
        .replace(/\{element\}/g, element)
        .replace(/\{modality\}/g, modality);
}

// House-specific helpers
function getHouseAction(houseNum) {
    const actions = {
        1: 'defines your core identity',
        2: 'shapes your values and resources',
        3: 'activates your communication style',
        4: 'roots your sense of home',
        5: 'expresses your creativity',
        6: 'structures your daily work',
        7: 'focuses on partnerships',
        8: 'transforms through shared resources',
        9: 'expands through philosophy',
        10: 'builds your public reputation',
        11: 'connects through community',
        12: 'dissolves into the collective'
    };
    return actions[houseNum] || 'expresses house energy';
}

function getHouseFocus(houseNum) {
    const focuses = {
        1: 'shows up first',
        2: 'accumulates value',
        3: 'processes information',
        4: 'creates sanctuary',
        5: 'plays and creates',
        6: 'serves and refines',
        7: 'partners and balances',
        8: 'transforms and merges',
        9: 'seeks truth',
        10: 'achieves recognition',
        11: 'builds networks',
        12: 'transcends boundaries'
    };
    return focuses[houseNum] || 'expresses house focus';
}

function getHouseQuality(houseNum) {
    return getHouseAction(houseNum);
}

function getHousePlanetCombination(planet, houseNum) {
    return `${getPlanetVerb(planet)}s through ${getHouseFocus(houseNum)}`;
}

function getHouseDomainAction(domain) {
    return `activates in ${domain.toLowerCase()}`;
}

function getHousePlanetQuality(planet, houseNum) {
    return `${getPlanetVerb(planet)}s ${getHouseAction(houseNum)}`;
}

function getHousePlanetStyle(planet, houseNum) {
    return `${getPlanetVerb(planet)}s ${getHouseFocus(houseNum)}`;
}

function expandHouseTemplate(template, planet, house, domain, houseNum) {
    return template
        .replace(/\{planet\}/g, planet)
        .replace(/\{house\}/g, house)
        .replace(/\{domain\}/g, domain)
        .replace(/\{houseNum\}/g, houseNum);
}

// Main generation
console.log('Generating placement atoms...');
const placements = generatePlacementAtoms();
fs.writeFileSync(
    path.join(__dirname, 'placements.json'),
    JSON.stringify(placements, null, 4)
);
console.log(`✓ Generated ${Object.keys(placements.atoms).length} placement atoms`);

console.log('Generating house atoms...');
const houses = generateHouseAtoms();
fs.writeFileSync(
    path.join(__dirname, 'houses.json'),
    JSON.stringify(houses, null, 4)
);
console.log(`✓ Generated ${Object.keys(houses.atoms).length} house atoms`);

console.log('\n✅ Atom generation complete!');
console.log(`Total: ${Object.keys(placements.atoms).length + Object.keys(houses.atoms).length} atoms`);





