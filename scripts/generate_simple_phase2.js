const fs = require('fs');
const path = require('path');

/**
 * GENERATE SIMPLE PHASE2 LIBRARY
 * 
 * Generates crude simple versions for all phase2 "curious" insights
 * - Stelliums (sign and house)
 * - North Node (sign + house)
 * - Chiron (sign + house)
 * - Aspect patterns
 */

const phase2Path = path.join(__dirname, '..', 'library_phase2.json');

let phase2Lib = {
    stelliums: {},
    north_node: {},
    chiron: {},
    aspect_patterns: {}
};

// Load existing if it exists
if (fs.existsSync(phase2Path)) {
    phase2Lib = JSON.parse(fs.readFileSync(phase2Path, 'utf8'));
}

const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const signArchetypes = {
    Aries: 'bold, pioneering, instinctive',
    Taurus: 'grounded, sensual, steady',
    Gemini: 'curious, quick, versatile',
    Cancer: 'protective, feeling-forward, nurturing',
    Leo: 'expressive, heart-led, magnetic',
    Virgo: 'discerning, service-focused, precise',
    Libra: 'harmonizing, relational, diplomatic',
    Scorpio: 'intense, investigative, all-or-nothing',
    Sagittarius: 'truth-seeking, adventurous, optimistic',
    Capricorn: 'strategic, disciplined, legacy-minded',
    Aquarius: 'visionary, future-focused, unconventional',
    Pisces: 'sensitive, poetic, compassionate'
};

const houseThemes = {
    1: 'self/identity/appearance',
    2: 'money/values/resources',
    3: 'communication/learning/siblings',
    4: 'home/family/roots',
    5: 'creativity/romance/play',
    6: 'work/health/service',
    7: 'partnerships/relationships',
    8: 'transformation/intimacy/shared resources',
    9: 'philosophy/travel/expansion',
    10: 'career/public life/legacy',
    11: 'community/friendships/ideals',
    12: 'spirituality/unconscious/solitude'
};

function getOrdinalSuffix(num) {
    const j = num % 10, k = num % 100;
    let suffix = 'th';
    if (j === 1 && k !== 11) suffix = 'st';
    else if (j === 2 && k !== 12) suffix = 'nd';
    else if (j === 3 && k !== 13) suffix = 'rd';
    return num + suffix;
}

// Generate crude simple version
function generateCrudeSimple(type, sign, house, pattern) {
    let crude = '';
    
    if (type === 'stellium_sign') {
        const archetype = signArchetypes[sign];
        crude = `You have 4 or more planets in ${sign}, and this energy dominates everything. ${archetype.charAt(0).toUpperCase() + archetype.slice(1)} energy runs your entire chart. You can't escape this focus, it's your default setting.`;
    } else if (type === 'stellium_house') {
        const theme = houseThemes[house];
        crude = `You have 4 or more planets in the ${getOrdinalSuffix(house)} house, and ${theme} consumes your life. This area is all-consuming, you can't ignore it. Everything revolves around this domain.`;
    } else if (type === 'north_node') {
        const archetype = signArchetypes[sign];
        const theme = houseThemes[house];
        crude = `Your North Node is in ${sign} in the ${getOrdinalSuffix(house)} house. This is your life purpose, your soul mission. You're here to learn ${archetype} energy through ${theme}. This is what you're growing toward, not where you start.`;
    } else if (type === 'chiron') {
        const archetype = signArchetypes[sign];
        const theme = houseThemes[house];
        crude = `Your Chiron is in ${sign} in the ${getOrdinalSuffix(house)} house. This is where you're wounded, and where you become a healer. The pain in ${theme} around ${archetype} energy becomes your gift to others.`;
    } else if (type === 'aspect_pattern') {
        if (pattern === 'yod') {
            crude = `You have a Yod in your chart, a rare configuration that creates a sense of fate and destiny. Two planets sextile each other and both quincunx a third, creating intense pressure and purpose. This feels like you're being pushed toward something specific.`;
        } else if (pattern === 't_square') {
            crude = `You have a T-Square in your chart, three planets forming intense tension that demands resolution. Two squares and an opposition create drive and conflict that you must work through. This creates intense motivation but also constant pressure.`;
        } else if (pattern === 'grand_trine') {
            crude = `You have a Grand Trine in your chart, three planets forming three trines in the same element. This creates natural talent and flow, but can lead to complacency. Things come easy, but you might avoid the growth that comes from challenge.`;
        }
    }
    
    return crude.trim();
}

// Process all phase2 items
function processPhase2() {
    let count = 0;
    let newEntries = 0;
    
    // 1. Stelliums by sign
    signs.forEach(sign => {
        const key = `stellium_${sign}`;
        if (!phase2Lib.stelliums[key] || phase2Lib.stelliums[key] === '') {
            const crude = generateCrudeSimple('stellium_sign', sign, null, null);
            phase2Lib.stelliums[key] = crude;
            newEntries++;
        }
        count++;
    });
    
    // 2. Stelliums by house
    houses.forEach(house => {
        const key = `stellium_house_${house}`;
        // Force regeneration to fix house numbers
        const crude = generateCrudeSimple('stellium_house', null, house, null);
        phase2Lib.stelliums[key] = crude;
        newEntries++;
        count++;
    });
    
    // 3. North Node
    signs.forEach(sign => {
        houses.forEach(house => {
            const key = `NorthNode_${sign}_${house}`;
            // Force regeneration to fix house numbers
            const crude = generateCrudeSimple('north_node', sign, house, null);
            phase2Lib.north_node[key] = crude;
            newEntries++;
            count++;
        });
    });
    
    // 4. Chiron
    signs.forEach(sign => {
        houses.forEach(house => {
            const key = `Chiron_${sign}_${house}`;
            // Force regeneration to fix house numbers
            const crude = generateCrudeSimple('chiron', sign, house, null);
            phase2Lib.chiron[key] = crude;
            newEntries++;
            count++;
        });
    });
    
    // 5. Aspect patterns
    const patterns = ['yod', 't_square', 'grand_trine'];
    patterns.forEach(pattern => {
        if (!phase2Lib.aspect_patterns[pattern] || phase2Lib.aspect_patterns[pattern] === '') {
            const crude = generateCrudeSimple('aspect_pattern', null, null, pattern);
            phase2Lib.aspect_patterns[pattern] = crude;
            newEntries++;
        }
        count++;
    });
    
    console.log(`Processed ${count} items, ${newEntries} new entries`);
    return newEntries;
}

// Save
function save() {
    fs.writeFileSync(phase2Path, JSON.stringify(phase2Lib, null, 2), 'utf8');
    console.log(`Saved to ${phase2Path}`);
}

// Run
if (require.main === module) {
    const newCount = processPhase2();
    save();
    console.log(`\nDone! Generated ${newCount} new simple phase2 versions.`);
    console.log(`Total items: ${Object.keys(phase2Lib.stelliums).length + Object.keys(phase2Lib.north_node).length + Object.keys(phase2Lib.chiron).length + Object.keys(phase2Lib.aspect_patterns).length}`);
}

module.exports = { generateCrudeSimple, processPhase2 };

