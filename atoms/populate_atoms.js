const fs = require('fs');
const path = require('path');

/**
 * POPULATE ATOMS FROM CONTENT.JSON
 * 
 * Extracts all atoms from content.json and populates the atom files.
 * Then generates missing atoms using astrological knowledge.
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

// Extract text into atoms (split by sentences)
function extractAtoms(text) {
    return text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 15 && s.length < 200)
        .slice(0, 8);
}

// Generate placements
function populatePlacements() {
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
            
            // Get from content.json if available
            if (content.planets_in_signs?.[planet]?.[sign]) {
                const existing = content.planets_in_signs[planet][sign];
                const atoms = extractAtoms(existing.text);
                
                // If we have the title, use it as archetype
                const archetype = existing.title || `The ${sign} ${planet}`;
                
                placements.atoms[key] = {
                    archetype: archetype,
                    element: SIGN_ELEMENTS[sign],
                    modality: SIGN_MODALITIES[sign],
                    atoms: atoms.length >= 8 ? atoms : [...atoms, ...generateMissingPlacementAtoms(planet, sign, atoms.length)]
                };
            } else {
                // Generate from scratch
                placements.atoms[key] = {
                    archetype: `The ${sign} ${planet}`,
                    element: SIGN_ELEMENTS[sign],
                    modality: SIGN_MODALITIES[sign],
                    atoms: generatePlacementAtoms(planet, sign)
                };
            }
        }
    }

    return placements;
}

// Generate houses
function populateHouses() {
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
            
            // Check aspects in content.json
            if (content.aspects?.[planet]) {
                // Try to find house-related content
                // This is a fallback - we'll generate most from scratch
            }
            
            // Check if we have any existing house content
            const existingAtoms = [];
            
            houses.atoms[key] = {
                domain: domain,
                atoms: existingAtoms.length >= 8 ? existingAtoms : generateHouseAtoms(planet, house, domain)
            };
        }
    }

    return houses;
}

// Generate placement atoms using astrological knowledge
function generatePlacementAtoms(planet, sign) {
    // This will be populated with real astrological meanings
    // For now, return placeholders that will be replaced
    return [
        `${planet} in ${sign} expresses ${SIGN_ELEMENTS[sign]} energy through ${SIGN_MODALITIES[sign]} modality.`,
        `The ${sign} ${planet.toLowerCase()} archetype ${getSignQuality(sign)}.`,
        `You ${getPlanetExpression(planet)} ${getSignStyle(sign)}.`,
        `${planet} ${sign.toLowerCase()} ${getElementExpression(SIGN_ELEMENTS[sign])}.`,
        `Your ${getPlanetFocus(planet)} ${getModalityExpression(SIGN_MODALITIES[sign])}.`,
        `${sign} ${planet.toLowerCase()} means ${getCombinationMeaning(planet, sign)}.`,
        `The ${planet} ${sign} combination ${getPlanetSignQuality(planet, sign)}.`,
        `You ${getPlanetAction(planet)} ${getSignAction(sign)}.`
    ];
}

// Generate house atoms
function generateHouseAtoms(planet, house, domain) {
    return [
        `${planet} in the ${house} house activates ${domain.toLowerCase()}.`,
        `Your ${getPlanetFocus(planet)} ${getHouseFocus(house)}.`,
        `The ${house} house ${planet.toLowerCase()} ${getHousePlanetMeaning(planet, house)}.`,
        `You ${getPlanetExpression(planet)} through ${domain.toLowerCase()}.`,
        `${planet} ${house} ${getHousePlanetAction(planet, house)}.`,
        `Your ${getPlanetFocus(planet)} ${getHouseDomainAction(domain)}.`,
        `The ${domain} ${planet.toLowerCase()} ${getHousePlanetQuality(planet, house)}.`,
        `You ${getPlanetAction(planet)} ${getHouseAction(house)}.`
    ];
}

function generateMissingPlacementAtoms(planet, sign, existingCount) {
    const needed = 8 - existingCount;
    return generatePlacementAtoms(planet, sign).slice(0, needed);
}

// Helper functions with real astrological meanings
function getSignQuality(sign) {
    const qualities = {
        'Aries': 'demands immediate action and bold initiative',
        'Taurus': 'builds through steady, tangible progress',
        'Gemini': 'thrives on mental stimulation and variety',
        'Cancer': 'protects through emotional intelligence and nurturing',
        'Leo': 'radiates confidence, warmth, and creative expression',
        'Virgo': 'refines through meticulous attention to detail',
        'Libra': 'seeks harmony, beauty, and balanced relationships',
        'Scorpio': 'transforms through intense depth and emotional power',
        'Sagittarius': 'expands through truth-seeking and philosophical exploration',
        'Capricorn': 'builds through disciplined ambition and long-term planning',
        'Aquarius': 'innovates through detached objectivity and revolutionary vision',
        'Pisces': 'transcends through compassionate dissolution and spiritual connection'
    };
    return qualities[sign];
}

function getPlanetExpression(planet) {
    const expressions = {
        'Sun': 'express your core identity',
        'Moon': 'process your emotions',
        'Mercury': 'communicate your thoughts',
        'Venus': 'attract what you value',
        'Mars': 'take action with',
        'Jupiter': 'expand through',
        'Saturn': 'structure through',
        'Uranus': 'innovate through',
        'Neptune': 'dream through',
        'Pluto': 'transform through'
    };
    return expressions[planet] || 'express';
}

function getSignStyle(sign) {
    const styles = {
        'Aries': 'immediate, direct impact',
        'Taurus': 'steady, sensual accumulation',
        'Gemini': 'quick, versatile communication',
        'Cancer': 'emotional, protective depth',
        'Leo': 'dramatic, confident flair',
        'Virgo': 'precise, analytical refinement',
        'Libra': 'elegant, diplomatic balance',
        'Scorpio': 'intense, transformative power',
        'Sagittarius': 'philosophical, adventurous breadth',
        'Capricorn': 'disciplined, ambitious mastery',
        'Aquarius': 'revolutionary, detached vision',
        'Pisces': 'compassionate, intuitive dissolution'
    };
    return styles[sign];
}

function getElementExpression(element) {
    const expressions = {
        'fire': 'burns with passion, initiative, and spontaneous action',
        'earth': 'grounds through practicality, stability, and tangible results',
        'air': 'elevates through intellect, communication, and mental agility',
        'water': 'flows through emotion, intuition, and deep feeling'
    };
    return expressions[element];
}

function getModalityExpression(modality) {
    const expressions = {
        'cardinal': 'initiates change and takes leadership',
        'fixed': 'maintains stability and demonstrates persistence',
        'mutable': 'adapts fluidly and embraces flexibility'
    };
    return expressions[modality];
}

function getCombinationMeaning(planet, sign) {
    // This would be expanded with actual combinations
    return `a unique expression of ${planet.toLowerCase()} energy through ${sign.toLowerCase()}`;
}

function getPlanetSignQuality(planet, sign) {
    return `creates a powerful synthesis of ${planet.toLowerCase()} and ${sign.toLowerCase()} energies`;
}

function getPlanetAction(planet) {
    const actions = {
        'Sun': 'shine',
        'Moon': 'feel',
        'Mercury': 'think',
        'Venus': 'attract',
        'Mars': 'act',
        'Jupiter': 'expand',
        'Saturn': 'structure',
        'Uranus': 'disrupt',
        'Neptune': 'dream',
        'Pluto': 'transform'
    };
    return actions[planet] || 'express';
}

function getSignAction(sign) {
    return `with ${sign.toLowerCase()} energy`;
}

function getPlanetFocus(planet) {
    const focuses = {
        'Sun': 'identity',
        'Moon': 'emotional nature',
        'Mercury': 'mental processes',
        'Venus': 'values and attractions',
        'Mars': 'drive and action',
        'Jupiter': 'expansion and growth',
        'Saturn': 'structure and discipline',
        'Uranus': 'innovation and freedom',
        'Neptune': 'dreams and intuition',
        'Pluto': 'transformation and power'
    };
    return focuses[planet] || 'energy';
}

function getHouseFocus(house) {
    const focuses = {
        '1st': 'shows up first in your identity',
        '2nd': 'accumulates in your values',
        '3rd': 'processes through communication',
        '4th': 'roots in your home life',
        '5th': 'expresses through creativity',
        '6th': 'structures in daily work',
        '7th': 'focuses on partnerships',
        '8th': 'transforms through shared resources',
        '9th': 'expands through philosophy',
        '10th': 'builds your public reputation',
        '11th': 'connects through community',
        '12th': 'dissolves into the collective'
    };
    return focuses[house] || 'expresses house energy';
}

function getHousePlanetMeaning(planet, house) {
    return `${getPlanetAction(planet)}s through ${getHouseFocus(house)}`;
}

function getHouseDomainAction(domain) {
    return `activates in ${domain.toLowerCase()}`;
}

function getHousePlanetQuality(planet, house) {
    return `${getPlanetAction(planet)}s ${getHouseFocus(house)}`;
}

function getHouseAction(house) {
    return `in the ${house} house`;
}

function getHousePlanetAction(planet, house) {
    return `${getPlanetAction(planet)}s ${getHouseFocus(house)}`;
}

// Run
console.log('Populating placement atoms from content.json...');
const placements = populatePlacements();
fs.writeFileSync(
    path.join(__dirname, 'placements.json'),
    JSON.stringify(placements, null, 4)
);
console.log(`✓ Populated ${Object.keys(placements.atoms).length} placement atoms`);

console.log('Populating house atoms...');
const houses = populateHouses();
fs.writeFileSync(
    path.join(__dirname, 'houses.json'),
    JSON.stringify(houses, null, 4)
);
console.log(`✓ Populated ${Object.keys(houses.atoms).length} house atoms`);

console.log('\n✅ Population complete!');
console.log(`Total atoms: ${Object.keys(placements.atoms).length + Object.keys(houses.atoms).length}`);





