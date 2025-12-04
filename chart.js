// Chart calculation and insights rendering (v4.0 - with Dignity, Balance, and Rulership Bridges)

// --- CONSTANTS ---
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

// Defined for specific use cases
const PERSONAL_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
const PERSONAL_INNER_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']; // For aspecting Outer Planets
const OUTER_PLANETS = ['Uranus', 'Neptune', 'Pluto']; // For aspecting inner planets
const CORE_POINTS = ['Sun', 'Moon', 'Ascendant', 'Midheaven'];
const ANGULAR_HOUSES = [1, 4, 7, 10];
const ELEMENTS = { fire: ['Aries', 'Leo', 'Sagittarius'], earth: ['Taurus', 'Virgo', 'Capricorn'], air: ['Gemini', 'Libra', 'Aquarius'], water: ['Cancer', 'Scorpio', 'Pisces'] };
const MODALITIES = { cardinal: ['Aries', 'Cancer', 'Libra', 'Capricorn'], fixed: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'], mutable: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'] };
const PLANET_FOCUS = { Sun: 'core identity and purpose', Moon: 'emotional landscape', Mercury: 'mental wiring and communication', Venus: 'love language and aesthetics', Mars: 'drive and passion', Jupiter: 'growth instincts', Saturn: 'discipline and long-term lessons', Uranus: 'need for freedom', Neptune: 'dream life and intuition', Pluto: 'depth work and transformation', Ascendant: 'outer expression', Midheaven: 'public calling' };
const SIGN_ARCHETYPES = { Aries: { element: 'fire', modality: 'cardinal', tone: 'bold, instinctive, pioneering' }, Taurus: { element: 'earth', modality: 'fixed', tone: 'grounded, sensual, steady' }, Gemini: { element: 'air', modality: 'mutable', tone: 'curious, quick, versatile' }, Cancer: { element: 'water', modality: 'cardinal', tone: 'protective, feeling-forward, nurturing' }, Leo: { element: 'fire', modality: 'fixed', tone: 'expressive, heart-led, magnetic' }, Virgo: { element: 'earth', modality: 'mutable', tone: 'discerning, service-focused, precise' }, Libra: { element: 'air', modality: 'cardinal', tone: 'harmonizing, relational, diplomatic' }, Scorpio: { element: 'water', modality: 'fixed', tone: 'intense, investigative, all-or-nothing' }, Sagittarius: { element: 'fire', modality: 'mutable', tone: 'truth-seeking, adventurous, optimistic' }, Capricorn: { element: 'earth', modality: 'cardinal', tone: 'strategic, disciplined, legacy-minded' }, Aquarius: { element: 'air', modality: 'fixed', tone: 'visionary, future-focused, unconventional' }, Pisces: { element: 'water', modality: 'mutable', tone: 'sensitive, poetic, compassionate' } };
const CATEGORY_FOCUS = { love: { planets: ['Venus', 'Moon', 'Mars'], houses: [5, 7, 8], label: 'Love & Relationships' }, money: { planets: ['Sun', 'Saturn', 'Jupiter', 'Mercury'], houses: [2, 6, 10], label: 'Money & Career' }, general: { planets: ['Sun', 'Moon', 'Ascendant', 'Midheaven'], houses: [1, 9, 10], label: 'General & Personality' }, communication: { planets: ['Mercury', 'Moon', 'Uranus', 'Venus'], houses: [3, 11], label: 'Communication & Social' } };
const ASPECTS = [{ name: 'conjunction', angle: 0, orb: 8, weight: 38, category: 'core' }, { name: 'sextile', angle: 60, orb: 4, weight: 22, category: 'gift' }, { name: 'square', angle: 90, orb: 6, weight: 26, category: 'challenge' }, { name: 'trine', angle: 120, orb: 6, weight: 28, category: 'gift' }, { name: 'opposition', angle: 180, orb: 7, weight: 30, category: 'challenge' }];
const CATEGORY_LABELS = { core: 'Core Energy', gift: 'Natural Talent', challenge: 'Growth Tension', shadow: 'Hidden Pattern', growth: 'Key Lesson' };

// --- DIGNITY CONSTANT ---
const DIGNITY_MAP = {
    Sun: { Aries: 0.15, Leo: 0.25, Libra: -0.15, Aquarius: -0.25 },
    Moon: { Taurus: 0.25, Cancer: 0.15, Scorpio: -0.15, Capricorn: -0.25 },
    Mercury: { Gemini: 0.25, Virgo: 0.25, Sagittarius: -0.15, Pisces: -0.25 },
    Venus: { Taurus: 0.25, Libra: 0.25, Aries: -0.15, Scorpio: -0.15, Virgo: -0.25, Pisces: 0.15 },
    Mars: { Aries: 0.25, Scorpio: 0.25, Capricorn: 0.15, Taurus: -0.15, Libra: -0.25, Cancer: -0.25 },
    Jupiter: { Sagittarius: 0.25, Pisces: 0.25, Cancer: 0.15, Gemini: -0.15, Virgo: -0.15, Capricorn: -0.25 },
    Saturn: { Capricorn: 0.25, Aquarius: 0.25, Libra: 0.15, Cancer: -0.25, Leo: -0.25, Aries: -0.25 }
};

// --- NEW RULERSHIP CONSTANT (Traditional) ---
const RULERSHIP_MAP = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn',
    Pisces: 'Jupiter'
};

// --- HEADLINE MAP (Dynamic Titles) ---
const HEADLINE_MAP = {
    // Single Planets
    Sun: 'THE HERO', Moon: 'THE SOUL', Ascendant: 'THE FACE', Midheaven: 'THE LEGACY',
    Mercury: 'THE MESSENGER', Venus: 'THE ARTIST', Mars: 'THE WARRIOR',
    Jupiter: 'THE SAGE', Saturn: 'THE BUILDER', Uranus: 'THE AWAKENER',
    Neptune: 'THE DREAMER', Pluto: 'THE ALCHEMIST', NorthNode: 'THE COMPASS',
    Chiron: 'THE HEALER',

    // Pairs (Bidirectional lookup required in logic)
    Sun_Moon: 'THE CORE', Sun_Mars: 'THE ENGINE', Sun_Jupiter: 'THE BEACON',
    Sun_Saturn: 'THE ANCHOR', Sun_Uranus: 'THE REBEL', Sun_Neptune: 'THE MYSTIC',
    Sun_Pluto: 'THE PHOENIX',

    Moon_Mercury: 'THE STORYTELLER', Moon_Venus: 'THE LOVER', Moon_Mars: 'THE FUSE',
    Moon_Saturn: 'THE FORTRESS', Moon_Uranus: 'THE STORM', Moon_Neptune: 'THE DREAM',
    Moon_Pluto: 'THE DEPTHS',

    Mercury_Mars: 'THE DEBATER', Mercury_Saturn: 'THE ARCHITECT', Mercury_Uranus: 'THE INVENTOR',
    Mercury_Neptune: 'THE POET', Mercury_Pluto: 'THE DETECTIVE',

    Venus_Mars: 'THE SPARK', Venus_Jupiter: 'THE HEDONIST', Venus_Saturn: 'THE CONTRACT',
    Venus_Uranus: 'THE MAVERICK', Venus_Neptune: 'THE MUSE', Venus_Pluto: 'THE OBSESSION',

    Mars_Jupiter: 'THE CRUSADER', Mars_Saturn: 'THE HAMMER', Mars_Uranus: 'THE REVOLUTION',
    Mars_Neptune: 'THE WAVE', Mars_Pluto: 'THE VOLCANO',

    Jupiter_Saturn: 'THE STRATEGIST', Jupiter_Uranus: 'THE BREAKTHROUGH',
    Jupiter_Neptune: 'THE VISIONARY',

    Saturn_Uranus: 'THE DISRUPTOR', Saturn_Neptune: 'THE DISSOLVER', Saturn_Pluto: 'THE RECKONING'
};

// --- SENTENCE ATOMS (The Boom) - SEPARATED TO AVOID KEY CONFLICTS ---

// IDENTITY MAP (Energy Card)
// Verbs are structured to work with "who [verb] through/against/past [ENEMY]"
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

// SHADOW MAP (Enemy Card) - Just arrays of strings (UPPERCASE)
// These work with prepositions: "through/against/past [ENEMY]"
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

// QUEST MAP (Direction Card)
// Verbs are lowercase since they're used in the sentence: "to [verb] [TEXT]"
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

// --- BOOM SCREEN GENERATOR ---
// Load validated sentences (loaded once on page load)
let validatedSentences = null;
let validatedSentencesLoading = false;

async function loadValidatedSentences() {
    if (validatedSentences) return validatedSentences;
    if (validatedSentencesLoading) {
        // Wait for ongoing load
        while (validatedSentencesLoading) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return validatedSentences;
    }

    validatedSentencesLoading = true;
    try {
        const response = await fetch('boom_sentences_final.json');
        if (response.ok) {
            const data = await response.json();
            validatedSentences = data.sentences || null;
            console.log(`✓ Loaded ${Object.keys(validatedSentences || {}).length} validated boom sentences`);
        } else {
            console.warn('Could not load validated sentences, falling back to atoms');
        }
    } catch (e) {
        console.warn('Could not load validated sentences, falling back to atoms:', e);
    } finally {
        validatedSentencesLoading = false;
    }

    return validatedSentences;
}

// Build lookup key from insights
function buildSentenceKey(energy, enemy, direction) {
    // Extract identity key from energy insight
    let identityKey = null;
    if (energy.planets && energy.planets.length === 2) {
        identityKey = `${energy.planets[0]}_${energy.planets[1]}`;
    } else if (energy.planets && energy.planets.length === 1) {
        identityKey = energy.planets[0];
    } else if (energy.id) {
        // Try to extract from id like "Sun_Mars_square" -> "Sun_Mars"
        const parts = energy.id.split('_');
        if (parts.length >= 2) {
            identityKey = `${parts[0]}_${parts[1]}`;
        } else {
            identityKey = parts[0];
        }
    }

    // Extract shadow key from enemy insight
    let shadowKey = null;
    if (enemy.type === 'square') {
        shadowKey = 'square';
    } else if (enemy.type === 'opposition') {
        shadowKey = 'opposition';
    } else if (enemy.planets && enemy.planets.includes('Saturn')) {
        shadowKey = 'Saturn';
    } else if (enemy.planets && enemy.planets.includes('Neptune')) {
        shadowKey = 'Neptune';
    } else if (enemy.planets && enemy.planets.includes('Pluto')) {
        shadowKey = 'Pluto';
    } else if (enemy.planets && enemy.planets.includes('Mars')) {
        shadowKey = 'Mars';
    } else if (enemy.planets && enemy.planets.includes('Uranus')) {
        shadowKey = 'Uranus';
    } else if (enemy.house === 12) {
        shadowKey = 'House_12';
    } else if (enemy.type === 'square') {
        shadowKey = 'square';
    } else if (enemy.type === 'opposition') {
        shadowKey = 'opposition';
    }

    // Extract quest key from direction insight
    let questKey = null;
    if (direction.house) {
        questKey = `House_${direction.house}`;
    } else if (direction.id && direction.id.includes('NorthNode')) {
        questKey = 'NorthNode';
    } else if (direction.id) {
        // Try to extract house from id
        const houseMatch = direction.id.match(/House[_\s]?(\d+)/i);
        if (houseMatch) {
            questKey = `House_${houseMatch[1]}`;
        } else if (direction.id.includes('NorthNode')) {
            questKey = 'NorthNode';
        }
    }

    if (identityKey && shadowKey && questKey) {
        return `${identityKey}_${shadowKey}_${questKey}`;
    }

    return null;
}

async function generateLifeSentence(insights) {
    if (!insights || insights.length < 3) return;

    const energy = insights[0];
    const enemy = insights[1];
    const direction = insights[2];

    // Try to use validated sentences first
    const sentences = await loadValidatedSentences();
    const sentenceKey = buildSentenceKey(energy, enemy, direction);

    if (sentences && sentenceKey && sentences[sentenceKey]) {
        const sentence = sentences[sentenceKey];

        // Populate screen with validated sentence
        const identityEl = document.getElementById('boom-identity');
        const shadowEl = document.getElementById('boom-shadow');
        const questEl = document.getElementById('boom-quest');

        if (identityEl) identityEl.textContent = sentence.identity;
        if (shadowEl) shadowEl.textContent = sentence.shadow;
        if (questEl) questEl.textContent = sentence.quest;

        const verb1El = document.getElementById('boom-verb1');
        const verb2El = document.getElementById('boom-verb2');
        const prepEl = document.getElementById('boom-preposition');

        if (verb1El) verb1El.textContent = sentence.verb1;
        if (verb2El) verb2El.textContent = sentence.verb2;
        if (prepEl) prepEl.textContent = sentence.preposition ? sentence.preposition + ' ' : '';

        // Make highlighted words clickable
        const navigateToCard = (cardIndex) => {
            const screen = document.getElementById('boom-screen');
            if (screen) screen.style.display = 'none';

            const cards = document.querySelectorAll('.insight-card');
            if (cards[cardIndex]) {
                cards[cardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                cards[cardIndex].classList.add('pulse');
                setTimeout(() => cards[cardIndex].classList.remove('pulse'), 2000);
            }
        };

        if (identityEl) identityEl.onclick = () => navigateToCard(0);
        if (shadowEl) shadowEl.onclick = () => navigateToCard(1);
        if (questEl) questEl.onclick = () => navigateToCard(2);

        // Add hover effects
        [identityEl, shadowEl, questEl].forEach(el => {
            if (el) {
                el.style.cursor = 'pointer';
                el.classList.add('boom-highlight');
            }
        });

        return; // Successfully used validated sentence
    }

    // Fallback: Simple descriptive sentence (states the obvious)
    // Format: "You have [ENERGY] energy, [ENEMY] obstacles, and [DIRECTION] life goal"
    const getSimpleName = (insight) => {
        if (insight.title) {
            // Use the title directly (e.g., "Saturn in Capricorn", "Sun-Mars Square", "House 10")
            return insight.title.toUpperCase();
        } else if (insight.planets && insight.planets.length === 2) {
            // Two planets (e.g., "Sun-Mars")
            return `${insight.planets[0]}-${insight.planets[1]}`.toUpperCase();
        } else if (insight.planets && insight.planets.length === 1) {
            // Single planet
            return insight.planets[0].toUpperCase();
        } else if (insight.house) {
            // House-based
            return `HOUSE ${insight.house}`;
        } else if (insight.id) {
            // Fallback to id
            return insight.id.replace(/_/g, ' ').toUpperCase();
        }
        return 'UNKNOWN';
    };

    const energyName = getSimpleName(energy);
    const enemyName = getSimpleName(enemy);
    const directionName = getSimpleName(direction);

    // Update the sentence structure to show: "You have [ENERGY] energy, [ENEMY] obstacles, and [DIRECTION] life goal"
    const boomText = document.querySelector('#boom-screen .boom-text');
    if (boomText) {
        boomText.innerHTML = `
            You <span id="boom-verb1">have</span> <span class="boom-highlight" id="boom-identity">${energyName}</span> energy,
            <span class="boom-highlight" id="boom-shadow">${enemyName}</span> obstacles,
            and <span class="boom-highlight" id="boom-quest">${directionName}</span> <span id="boom-verb2">life goal</span>.
        `;

        // Get elements after innerHTML update
        const identityEl = document.getElementById('boom-identity');
        const shadowEl = document.getElementById('boom-shadow');
        const questEl = document.getElementById('boom-quest');

        // Make highlighted words clickable
        const navigateToCard = (cardIndex) => {
            const screen = document.getElementById('boom-screen');
            if (screen) screen.style.display = 'none';

            const cards = document.querySelectorAll('.insight-card');
            if (cards[cardIndex]) {
                cards[cardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                cards[cardIndex].classList.add('pulse');
                setTimeout(() => cards[cardIndex].classList.remove('pulse'), 2000);
            }
        };

        if (identityEl) {
            identityEl.onclick = () => navigateToCard(0);
            identityEl.style.cursor = 'pointer';
        }
        if (shadowEl) {
            shadowEl.onclick = () => navigateToCard(1);
            shadowEl.style.cursor = 'pointer';
        }
        if (questEl) {
            questEl.onclick = () => navigateToCard(2);
            questEl.style.cursor = 'pointer';
        }
    }

    return; // Successfully used simple descriptive sentence

    // OLD FALLBACK (kept for reference, but now we use simple descriptive above)
    // Fallback to atom-based generation
    const identityObj = getSentenceAtom(energy, 'IDENTITY') || { text: 'A FORCE', verb: 'who fights' };
    const shadowText = getSentenceAtom(enemy, 'SHADOW') || 'RESISTANCE'; // Shadow is uppercase
    const questObj = getSentenceAtom(direction, 'QUEST') || { verb: 'BUILD', text: 'A LEGACY' };

    // Determine preposition and verb based on shadow type
    // Uses better, more meaningful verbs that work grammatically
    const getPrepositionAndVerb = (shadow, identityVerb) => {
        const shadowLower = shadow.toLowerCase();

        // Map shadows to better verb + preposition combinations
        const shadowMap = {
            // Resistance/opposition - overcome, transcend
            'resistance': { verb: 'overcomes', prep: '' },
            'the divide': { verb: 'bridges', prep: '' },
            'opposition': { verb: 'transcends', prep: '' },
            'the pull': { verb: 'navigates', prep: 'through' },

            // Conflict/battle - overcome (not "conquers against")
            'conflict': { verb: 'overcomes', prep: '' },
            'friction': { verb: 'smooths', prep: '' },
            'the battle': { verb: 'wins', prep: '' },
            'tension': { verb: 'resolves', prep: '' },

            // Fog/illusion - part, pierce through
            'the fog': { verb: 'parts', prep: '' },
            'the veil': { verb: 'lifts', prep: '' },
            'illusion': { verb: 'shatters', prep: '' },
            'the haze': { verb: 'clears', prep: '' },

            // Void/abyss - part (as in "parts the void")
            'the void': { verb: 'parts', prep: '' },
            'destruction': { verb: 'transforms', prep: '' },
            'obsession': { verb: 'releases', prep: '' },
            'the abyss': { verb: 'illuminates', prep: '' },

            // Restriction/wall - break through
            'restriction': { verb: 'breaks', prep: 'through' },
            'the wall': { verb: 'scales', prep: '' },
            'limitation': { verb: 'transcends', prep: '' },
            'the cage': { verb: 'shatters', prep: '' },

            // Burnout/fire - transform, move through
            'burnout': { verb: 'transforms', prep: '' },
            'the fire': { verb: 'tames', prep: '' },
            'exhaustion': { verb: 'renews', prep: '' },

            // Chaos/disruption - channel, navigate
            'chaos': { verb: 'channels', prep: '' },
            'the rebellion': { verb: 'harnesses', prep: '' },
            'disruption': { verb: 'orchestrates', prep: '' },
            'the break': { verb: 'mends', prep: '' },

            // Unconscious/shadow - illuminate, integrate
            'the unconscious': { verb: 'illuminates', prep: '' },
            'the shadow': { verb: 'integrates', prep: '' },
            'isolation': { verb: 'transcends', prep: '' },
            'the hidden': { verb: 'reveals', prep: '' }
        };

        const match = shadowMap[shadowLower];
        if (match) {
            return { verb: match.verb, prep: match.prep };
        }

        // Default: use identity verb with "through"
        return { verb: identityVerb.replace('who ', ''), prep: 'through' };
    };

    const identityVerbBase = identityObj.verb.replace('who ', '');
    const { verb: actionVerb, prep: preposition } = getPrepositionAndVerb(shadowText, identityVerbBase);

    // 2. Populate Screen
    const identityEl = document.getElementById('boom-identity');
    const shadowEl = document.getElementById('boom-shadow');
    const questEl = document.getElementById('boom-quest');

    identityEl.textContent = identityObj.text;
    // Use the improved action verb
    document.getElementById('boom-verb1').textContent = actionVerb;
    // Set preposition (element should exist in HTML)
    const prepositionEl = document.getElementById('boom-preposition');
    if (prepositionEl) {
        prepositionEl.textContent = preposition ? preposition + ' ' : '';
    }
    shadowEl.textContent = shadowText;
    // Quest verb is already lowercase
    document.getElementById('boom-verb2').textContent = questObj.verb;
    questEl.textContent = questObj.text;

    // Make highlighted words clickable - navigate to corresponding cards
    const navigateToCard = (cardIndex) => {
        const screen = document.getElementById('boom-screen');

        // 1. Fade out current text
        screen.classList.remove('visible');

        setTimeout(() => {
            // 2. Update content to show the Insight
            const insight = insights[cardIndex]; // Use the insights parameter
            const label = ['ENERGY', 'ENEMY', 'DIRECTION'][cardIndex];

            // Clear existing content
            screen.innerHTML = '';

            // Create new content structure matching Boom Screen style
            const newContent = document.createElement('div');
            newContent.className = 'boom-content';
            newContent.style.textAlign = 'center';
            newContent.style.maxWidth = '900px';
            newContent.style.padding = '2rem';

            newContent.innerHTML = `
                <div class="boom-text" style="font-size: 8rem; margin-bottom: 0; line-height: 1; font-weight: 900; letter-spacing: -0.05em;">${label}</div>
                <div class="boom-text" style="font-size: 2rem; font-weight: 400; opacity: 0.9; margin-bottom: 3rem; color: var(--color-accent-blue);">${insight.hook}</div>
                
                <!-- PAYWALL / UNLOCK SECTION -->
                <div id="boom-locked-content" style="display: none;">
                    <div class="boom-text" style="font-size: 1.4rem; font-weight: 300; line-height: 1.6; opacity: 0.8; max-width: 700px; margin: 0 auto;">${insight.fullText}</div>
                </div>
                
                <button id="boom-unlock-btn" class="boom-btn" style="margin-top: 2rem; border-color: var(--color-accent-green); color: var(--color-accent-green); font-weight: 700;">
                    UNLOCK FULL READING
                </button>
                
                <button id="boom-back-btn" class="boom-btn" style="margin-top: 4rem; opacity: 0.5; font-size: 0.9rem; display: none;">BACK TO ORBIT</button>
            `;

            screen.appendChild(newContent);

            // Add unlock handler - Show pricing modal
            document.getElementById('boom-unlock-btn').onclick = () => {
                showPricingModal(cardIndex, insights);
            };

            // Add back button handler
            document.getElementById('boom-back-btn').onclick = () => {
                screen.classList.remove('visible');
                setTimeout(() => {
                    generateLifeSentence(insights).catch(console.error);
                }, 1000);
            };

            // 3. Fade in
            requestAnimationFrame(() => {
                screen.classList.add('visible');
            });

        }, 1000); // Wait for fade out
    };

    identityEl.style.cursor = 'pointer';
    shadowEl.style.cursor = 'pointer';
    questEl.style.cursor = 'pointer';

    identityEl.onclick = () => navigateToCard(0);
    shadowEl.onclick = () => navigateToCard(1);
    questEl.onclick = () => navigateToCard(2);

    // 3. Show Screen
    const screen = document.getElementById('boom-screen');
    screen.style.display = 'flex';
    // Small delay to allow display:flex to apply before opacity transition
    setTimeout(() => {
        screen.classList.add('visible');
    }, 50);

    // 4. Handle Exit (Unlock All Cards) - REMOVED "Explain This" button logic
    // The single card view is now the primary way to consume content.
}

// --- PRICING MODAL ---
function showPricingModal(cardIndex, insights) {
    const modal = document.getElementById('pricing-modal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        modal.classList.add('visible');
    });

    // Store context for unlock
    window.currentUnlockContext = { cardIndex, insights };

    // Add listeners to pricing buttons (only once)
    if (!window.pricingListenersAdded) {
        const pricingBtns = document.querySelectorAll('.pricing-btn');
        pricingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tier = btn.dataset.tier;
                const price = btn.dataset.price;
                handlePurchase(tier, price);
            });
        });
        window.pricingListenersAdded = true;
    }
}

function handlePurchase(tier, price) {
    // Check if already unlocked
    const unlocked = localStorage.getItem('charter_unlocked');
    if (unlocked) {
        unlockContent(tier);
        return;
    }

    // LEMONSQUEEZY INTEGRATION
    console.log(`Processing payment: ${tier} tier - $${price}`);

    // LemonSqueezy checkout URLs (replace with your actual checkout URLs)
    const checkoutUrls = {
        core: 'https://yourstore.lemonsqueezy.com/checkout/buy/CORE_VARIANT_ID',
        full: 'https://yourstore.lemonsqueezy.com/checkout/buy/FULL_VARIANT_ID'
    };

    // Add success URL parameter to return user after payment
    const successUrl = encodeURIComponent(window.location.href + '?unlock=' + tier);
    const checkoutUrl = checkoutUrls[tier] + '?checkout[custom][unlock_tier]=' + tier;

    // PRODUCTION: Redirect to LemonSqueezy
    // window.location.href = checkoutUrl;

    // TESTING: Auto-unlock after delay (comment out for production)
    console.log('Would redirect to:', checkoutUrl);
    setTimeout(() => {
        localStorage.setItem('charter_unlocked', tier);
        unlockContent(tier);
    }, 500);
}

function unlockContent(tier) {
    const modal = document.getElementById('pricing-modal');

    // Hide modal
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    // Get context
    const { cardIndex, insights } = window.currentUnlockContext || {};
    if (!insights) return;

    // Unlock the current card
    const btn = document.getElementById('boom-unlock-btn');
    const content = document.getElementById('boom-locked-content');
    const backBtn = document.getElementById('boom-back-btn');

    if (btn) btn.style.display = 'none';
    if (content) {
        content.style.display = 'block';
        content.classList.add('animate-enter');
    }
    if (backBtn) backBtn.style.display = 'inline-block';

    // TODO: If tier is "full", unlock additional content
    // For now, both tiers unlock the same thing (3 insights)
}

function getSentenceAtom(insight, type) {
    // Select the correct map based on type
    const sourceMap = type === 'IDENTITY' ? IDENTITY_MAP :
        type === 'SHADOW' ? SHADOW_MAP :
            QUEST_MAP;

    // Helper to randomly select from array or return value
    const pickRandom = (val) => {
        if (Array.isArray(val)) {
            return val[Math.floor(Math.random() * val.length)];
        }
        return val;
    };

    // Helper to extract value based on type
    const resolve = (val) => {
        if (!val) return null;

        // Shadow is simple (just a string or array of strings)
        if (type === 'SHADOW') {
            return pickRandom(val);
        }

        // Identity/Quest are objects with text/verb (or arrays of text/verb)
        if (typeof val === 'object' && !Array.isArray(val)) {
            return {
                text: pickRandom(val.text),
                verb: pickRandom(val.verb)
            };
        }

        // Fallback for legacy strings
        return { text: val, verb: 'FIGHTING' };
    };

    // Try specific ID first (e.g., Sun_Uranus, House_10)
    if (sourceMap[insight.id]) return resolve(sourceMap[insight.id]);

    // Try parts (e.g., Sun, Uranus, square)
    if (insight.planets) {
        // Try pair
        const pairKey = `${insight.planets[0]}_${insight.planets[1]}`;
        if (sourceMap[pairKey]) return resolve(sourceMap[pairKey]);

        // Try single planet (first one usually dominant)
        if (sourceMap[insight.planets[0]]) return resolve(sourceMap[insight.planets[0]]);
    }

    // Try aspect/type
    if (insight.type && sourceMap[insight.type]) return resolve(sourceMap[insight.type]);

    // Try house
    if (insight.house) {
        const houseKey = `House_${insight.house}`;
        if (sourceMap[houseKey]) return resolve(sourceMap[houseKey]);
    }

    return null;
}

// Check URL for unlock parameter (from LemonSqueezy success redirect)
function checkForUnlockParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const unlockTier = urlParams.get('unlock');

    if (unlockTier) {
        // Save unlock status
        localStorage.setItem('charter_unlocked', unlockTier);

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);

        console.log(`✓ Payment successful! Unlocked ${unlockTier} tier`);
    }
}

// Main function called from onboarding.js
window.renderChartInsights = async function (payload, skipBoomScreen = false) {
    currentPayload = payload;

    // Auto-save chart data to localStorage (seamless persistence)
    try {
        const chartData = {
            payload: payload,
            timestamp: Date.now(),
            skipBoomScreen: skipBoomScreen
        };
        localStorage.setItem('aether_chart_data', JSON.stringify(chartData));
    } catch (e) {
        console.warn('Could not save chart to localStorage:', e);
    }

    // Show loading state - REMOVED to prevent jarring transition
    // The previous screen will stay visible until the Boom Screen overlay fades in
    const insightsList = document.getElementById('insights-list');

    // Calculate real chart (falls back to synthetic on error)
    const chart = await buildRealChart(payload);

    const chartContext = {
        usedVariants: { planetSign: {}, aspects: {}, elements: {}, retro: {}, houses: {}, angular: {}, bridges: {}, general: {}, balance: {} }
    };

    // Use power-first algorithm to get the triad
    const triad = selectPowerTriad(chart);

    // Convert configurations to full insights
    const insights = [
        convertConfigToInsight(triad[0], 'energy', chart, chartContext),
        convertConfigToInsight(triad[1], 'enemy', chart, chartContext),
        convertConfigToInsight(triad[2], 'direction', chart, chartContext)
    ].filter(Boolean);

    const bridgedInsights = insights;

    insightsList.innerHTML = '';

    // Create container for the top row (Energy vs Enemy)
    const conflictRow = document.createElement('div');
    conflictRow.className = 'conflict-row';
    insightsList.appendChild(conflictRow);

    // Pre-process insights for display and Boom Screen
    const processedInsights = bridgedInsights.map((insight, index) => {
        // Parse the text to find the "Hook" (First sentence)
        let text = insight.text;

        // Handle array wrapping
        if (Array.isArray(text)) {
            text = text[0];
        }

        // Final type check
        if (typeof text !== 'string') {
            text = "Content signal lost. Re-calibrating...";
        }

        const match = text.match(/^(.+?[.!?])(\s|$)/);
        const hook = match ? match[1] : text;
        const fullText = match ? text.substring(match[0].length) : '';

        // Determine status color based on category
        let statusColor = 'var(--color-text-dim)';
        if (insight.category === 'gift') statusColor = 'var(--color-accent-green)';
        if (insight.category === 'challenge') statusColor = 'var(--color-accent-amber)';
        if (insight.category === 'core') statusColor = 'var(--color-accent-blue)';

        // Role-based headlines for the triad
        const roleHeadlines = ['⚡ ENERGY', '🔥 ENEMY', '🧭 DIRECTION'];
        let headline = null;

        // Use role headline if it's one of the first 3 cards (the triad)
        if (index < 3) {
            headline = roleHeadlines[index];
        } else {
            // Fallback to dynamic headline map for any bonus cards
            if (insight.planets && insight.planets.length > 0) {
                if (insight.planets.length === 1) {
                    headline = HEADLINE_MAP[insight.planets[0]];
                } else if (insight.planets.length === 2) {
                    const p1 = insight.planets[0];
                    const p2 = insight.planets[1];
                    headline = HEADLINE_MAP[`${p1}_${p2}`] || HEADLINE_MAP[`${p2}_${p1}`];
                } else if (insight.planets.length > 2) {
                    if (insight.id.includes('stellium')) headline = 'THE GATHERING';
                    else if (insight.id.includes('element')) headline = 'THE ELEMENT';
                }
            }
        }

        // Format the subtitle (original title)
        const subtitle = insight.title ? insight.title.replace(' in ', ' // ').toUpperCase() : null;

        // If we have a headline, show it prominently with subtitle in smaller text
        // Otherwise fall back to just showing the subtitle or "COSMIC DATA"
        const displayTitle = headline
            ? `${headline}${subtitle ? `<span style="opacity: 0.5; margin-left: 8px; font-size: 0.85em;">// ${subtitle}</span>` : ''}`
            : (subtitle || 'COSMIC // DATA');

        return { ...insight, hook, fullText, statusColor, subtitle, displayTitle };
    });

    // --- BOOM SCREEN LOGIC ---
    // Check if we should skip boom screen (returning visitor)
    const savedChart = localStorage.getItem('aether_chart_data');
    const shouldSkipBoom = savedChart && JSON.parse(savedChart).skipBoomScreen;

    if (!shouldSkipBoom) {
        generateLifeSentence(processedInsights).catch(console.error);
    } else {
        // Skip boom screen - go straight to results
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'flex';
        }
        // Unlock all cards immediately
        setTimeout(() => {
            document.querySelectorAll('.paywall-overlay').forEach(overlay => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            });
            document.querySelectorAll('.full-text.locked').forEach(text => {
                text.classList.remove('locked');
            });
            document.querySelectorAll('.insight-card').forEach(card => {
                card.style.display = 'block';
            });
        }, 500);
    }

    // Render cards
    processedInsights.forEach((insight, index) => {
        const item = document.createElement('div');
        item.className = 'insight-card animate-enter';
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.display = 'none'; // HIDDEN BY DEFAULT until selected from Boom Screen

        // Apply specific classes and IDs for the layout
        if (index === 0) { item.classList.add('energy-card'); item.id = 'card-energy'; }
        if (index === 1) { item.classList.add('enemy-card'); item.id = 'card-enemy'; }
        if (index === 2) { item.classList.add('direction-card'); item.id = 'card-direction'; }

        // Get content
        const { displayTitle, hook, fullText, subtitle, statusColor } = insight;

        // Simple role labels
        const roleLabels = ['ENERGY', 'ENEMY', 'DIRECTION'];
        const label = roleLabels[index];

        item.innerHTML = `
            <div class="card-label">${label}</div>
            <div class="card-content" style="display: none;">
                <p>${hook}</p>
                <div class="content-wrapper">
                    <div class="full-text locked">
                        <p>${fullText}</p>
                        ${insight.bridge ? `<div class="bridge-text"><strong>TRANSFER:</strong> ${insight.bridge}</div>` : ''}
                    </div>
                    <div class="paywall-overlay">
                        <button class="unlock-btn">
                            <span class="unlock-icon">🔓</span>
                            Unlock Full Reading
                            <span class="beta-badge">FREE BETA</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add unlock button handler
        const unlockBtn = item.querySelector('.unlock-btn');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card expansion
                const overlay = item.querySelector('.paywall-overlay');
                const fullText = item.querySelector('.full-text');

                // Remove paywall
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    fullText.classList.remove('locked');
                }, 300);
            });
        }

        // Add click interaction to toggle content
        item.addEventListener('click', (e) => {
            // Don't toggle if clicking the unlock button
            if (e.target.closest('.unlock-btn')) return;

            const content = item.querySelector('.card-content');
            const isVisible = content.style.display === 'block';

            // Close all other cards
            document.querySelectorAll('.card-content').forEach(c => {
                c.style.display = 'none';
            });

            // Toggle this card
            if (!isVisible) {
                content.style.display = 'block';
            }
        });

        // Append all cards to the conflict row (side by side)
        conflictRow.appendChild(item);
    });

    // Update Header (Simplified)
    document.getElementById('result-name').textContent = "";
    document.getElementById('chart-info').innerHTML = "";

    // Show results section - MOVED TO BOOM SCREEN EXIT
    // const resultsSection = document.getElementById('results-section');
    // resultsSection.style.display = 'flex';

    // Scroll to top
    window.scrollTo(0, 0);
}; // END window.renderChartInsights


// ===== UTILITY FUNCTIONS (Top-Level) =====

// City Autocomplete Logic
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Hardcoded fallback cities for when API fails
const FALLBACK_CITIES = [
    { name: "London, United Kingdom", lat: 51.5074, lng: -0.1278 },
    { name: "New York, USA", lat: 40.7128, lng: -74.0060 },
    { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
    { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
    { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
    { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437 },
    { name: "Berlin, Germany", lat: 52.5200, lng: 13.4050 },
    { name: "Mumbai, India", lat: 19.0760, lng: 72.8777 },
    { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
    { name: "Singapore", lat: 1.3521, lng: 103.8198 },
    { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832 },
    { name: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
    { name: "Mexico City, Mexico", lat: 19.4326, lng: -99.1332 },
    { name: "Moscow, Russia", lat: 55.7558, lng: 37.6173 },
    { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 }
];

async function fetchCitySuggestions(query) {
    if (query.length < 2) return;
    const datalist = document.getElementById('city-suggestions');
    datalist.innerHTML = '';

    try {
        // Try Open-Meteo API first
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await response.json();

        if (data.results) {
            data.results.forEach(item => {
                const option = document.createElement('option');
                const parts = [item.name, item.admin1, item.country].filter(Boolean);
                option.value = parts.join(', ');
                datalist.appendChild(option);
            });
            return; // Success
        }
    } catch (error) {
        console.warn('API failed, using fallback cities:', error);
    }

    // Fallback: Filter hardcoded list
    const lowerQuery = query.toLowerCase();
    FALLBACK_CITIES.filter(c => c.name.toLowerCase().includes(lowerQuery))
        .slice(0, 5)
        .forEach(city => {
            const option = document.createElement('option');
            option.value = city.name;
            datalist.appendChild(option);
        });
}

const handleCityInput = debounce((e) => {
    fetchCitySuggestions(e.target.value);
}, 300);

// Back button logic (Tabs removed)
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back-btn');
    const cityInput = document.getElementById('inputCity');

    if (cityInput) {
        cityInput.addEventListener('input', handleCityInput);
    }

    if (backBtn) { // FIX: Check if backBtn exists
        backBtn.addEventListener('click', () => {
            // Show onboarding UI
            document.querySelector('header').style.display = 'flex';
            document.querySelector('main').style.display = 'flex';
            document.getElementById('navContainer').style.display = 'flex';
            document.getElementById('results-section').style.display = 'none';

            // Reset form
            currentPayload = null;
            document.getElementById('inputDob').value = '';
            document.getElementById('inputTime').value = '';
            document.getElementById('inputCity').value = '';
            document.getElementById('progressBar').style.width = '33.33%';
            document.getElementById('stepIndicator').textContent = 'Step 1 / 3';

            // Reset to step 1
            document.getElementById('step1').style.display = 'flex';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
            document.getElementById('step1').classList.add('animate-enter');

            // Focus first input
            setTimeout(() => {
                document.getElementById('inputDob').focus();
            }, 100);
        });
    }
});
// Real chart calculation using astronomical formulas
async function buildRealChart(payload) {
    try {
        // Parse birth date and time
        const [year, month, day] = payload.birthDate.split('-').map(Number);
        const [hours, minutes] = (payload.birthTime || '12:00').split(':').map(Number);

        // Create date object in UTC (will need timezone adjustment)
        const birthDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        // Get coordinates for city (using geocoding API)
        const coords = await getCityCoordinates(payload.city);
        if (!coords) {
            console.warn('Could not geocode city, using synthetic chart');
            return buildSyntheticChart(payload);
        }

        // Calculate Julian Day
        const jd = toJulianDay(birthDate);

        // Calculate planetary positions
        const placements = {};

        for (const planet of PLANETS) {
            const position = calculatePlanetPosition(planet, jd);
            const signIndex = Math.floor(position / 30);
            const degree = position % 30;
            const house = calculateHouse(position, coords.lat, coords.lng, jd);
            const retrograde = isRetrograde(planet, jd);

            placements[planet] = {
                sign: SIGNS[signIndex],
                degree: parseFloat(degree.toFixed(1)),
                house: house,
                retrograde: retrograde
            };
        }

        // Calculate Ascendant and Midheaven
        const { ascendant, midheaven } = calculateAscendantAndMC(coords.lat, coords.lng, jd);

        // Add ASC and MC to placements for easy lookup
        placements.Ascendant = ascendant;
        placements.Midheaven = midheaven;

        // Infer all 12 house cusps (Simulating Whole Sign Houses based on Ascendant)
        const houseCusps = {};
        const startSignIndex = SIGNS.indexOf(ascendant.sign);
        for (let i = 1; i <= 12; i++) {
            const signIndex = (startSignIndex + i - 1) % SIGNS.length;
            houseCusps[i] = SIGNS[signIndex];
        }

        return { placements, houseCusps };
    } catch (error) {
        console.error('Error calculating real chart:', error);
        return buildSyntheticChart(payload);
    }
}

// Fallback synthetic chart
function buildSyntheticChart(payload) {
    const seed = `${payload.name}|${payload.birthDate}|${payload.birthTime}|${payload.city}`;
    const rand = createRNG(seed);
    const placements = {};
    PLANETS.forEach((planet) => {
        const signIndex = Math.floor(rand() * SIGNS.length);
        const degree = Math.round(rand() * 29 + rand()).toFixed(1);
        const absoluteDegree = signIndex * 30 + parseFloat(degree);
        placements[planet] = { sign: SIGNS[signIndex], degree: absoluteDegree, house: Math.floor(rand() * 12) + 1, retrograde: rand() > 0.8 };
    });

    // ASC and MC generation
    const ascSignIndex = Math.floor(rand() * SIGNS.length);
    const mcSignIndex = Math.floor(rand() * SIGNS.length);
    const asc = { sign: SIGNS[ascSignIndex], degree: Math.round(rand() * 30).toFixed(1), house: 1 };
    const mc = { sign: SIGNS[mcSignIndex], degree: Math.round(rand() * 30).toFixed(1), house: 10 };

    // Infer all 12 house cusps (Simulating Whole Sign Houses based on Ascendant)
    const houseCusps = {};
    const startSignIndex = SIGNS.indexOf(asc.sign);
    for (let i = 1; i <= 12; i++) {
        const signIndex = (startSignIndex + i - 1) % SIGNS.length;
        houseCusps[i] = SIGNS[signIndex];
    }

    // Add ASC and MC to placements for easy lookup later
    placements.Ascendant = asc;
    placements.Midheaven = mc;

    // Return the combined chart object
    return { placements, houseCusps };
}

// Helper functions for real calculations
async function getCityCoordinates(city) {
    try {
        // 1. Try Open-Meteo API
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return { lat: result.latitude, lng: result.longitude };
        }
    } catch (error) {
        console.warn('Geocoding API failed, checking fallback list:', error);
    }

    // 2. Try Fallback List
    const fallback = FALLBACK_CITIES.find(c => c.name.toLowerCase().includes(city.toLowerCase()));
    if (fallback) return { lat: fallback.lat, lng: fallback.lng };

    // 3. Last Resort: Return Default (Greenwich) to prevent app crash
    console.warn('City not found, using default coordinates (Greenwich)');
    return { lat: 51.48, lng: 0.0 };
}

function toJulianDay(date) {
    const time = date.getTime();
    return (time / 86400000) + 2440587.5;
}

function calculatePlanetPosition(planet, jd) {
    // Simplified calculation - for production, use Swiss Ephemeris or VSOP87
    const T = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000

    let meanLongitude = 0;

    // Basic orbital elements (simplified)
    switch (planet) {
        case 'Sun':
            meanLongitude = 280.4665 + 36000.7698 * T;
            break;
        case 'Moon':
            meanLongitude = 218.3165 + 481267.8813 * T;
            break;
        case 'Mercury':
            meanLongitude = 252.2509 + 149472.6746 * T;
            break;
        case 'Venus':
            meanLongitude = 181.9798 + 58517.8157 * T;
            break;
        case 'Mars':
            meanLongitude = 355.4333 + 19140.2993 * T;
            break;
        case 'Jupiter':
            meanLongitude = 34.3515 + 3034.9057 * T;
            break;
        case 'Saturn':
            meanLongitude = 50.0774 + 1222.1138 * T;
            break;
        case 'Uranus':
            meanLongitude = 314.0550 + 428.4669 * T;
            break;
        case 'Neptune':
            meanLongitude = 304.3487 + 218.4862 * T;
            break;
        case 'Pluto':
            meanLongitude = 238.9581 + 145.2078 * T;
            break;
    }

    // Normalize to 0-360
    meanLongitude = meanLongitude % 360;
    if (meanLongitude < 0) meanLongitude += 360;

    return meanLongitude;
}

function calculateHouse(planetLongitude, lat, lng, jd) {
    // Simplified house calculation (Placidus system approximation)
    const lst = calculateLocalSiderealTime(lng, jd);
    const ascendant = calculateAscendantFromLST(lst, lat);
    const houseSize = 30; // Simplified: equal houses
    const relativePos = (planetLongitude - ascendant + 360) % 360;
    return Math.floor(relativePos / houseSize) + 1;
}

function calculateLocalSiderealTime(lng, jd) {
    const T = (jd - 2451545.0) / 36525.0;
    let theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000.0;
    theta = (theta + lng) % 360;
    if (theta < 0) theta += 360;
    return theta;
}

function calculateAscendantFromLST(lst, lat) {
    // Simplified ascendant calculation
    const obliquity = 23.4393; // Earth's axial tilt
    const tanLat = Math.tan(lat * Math.PI / 180);
    const tanObl = Math.tan(obliquity * Math.PI / 180);
    const asc = Math.atan2(Math.cos(lst * Math.PI / 180), -Math.sin(lst * Math.PI / 180) * tanLat + tanObl / Math.cos(lst * Math.PI / 180));
    let ascDeg = asc * 180 / Math.PI;
    if (ascDeg < 0) ascDeg += 360;
    return ascDeg;
}

function calculateAscendantAndMC(lat, lng, jd) {
    const lst = calculateLocalSiderealTime(lng, jd);
    const ascendantDeg = calculateAscendantFromLST(lst, lat);
    const mcDeg = (lst + 90) % 360;

    const ascSignIndex = Math.floor(ascendantDeg / 30);
    const mcSignIndex = Math.floor(mcDeg / 30);

    return {
        ascendant: {
            sign: SIGNS[ascSignIndex],
            degree: parseFloat((ascendantDeg % 30).toFixed(1)),
            house: 1
        },
        midheaven: {
            sign: SIGNS[mcSignIndex],
            degree: parseFloat((mcDeg % 30).toFixed(1)),
            house: 10
        }
    };
}

function isRetrograde(planet, jd) {
    // Simplified retrograde detection (would need velocity calculation for accuracy)
    const T = (jd - 2451545.0) / 36525.0;
    if (planet === 'Mercury' || planet === 'Venus') {
        // Inner planets have frequent retrogrades
        return Math.random() > 0.7; // Simplified
    }
    return Math.random() > 0.9; // Outer planets less frequent
}

// --- MODIFIED extractPatterns FUNCTION ---
function extractPatterns(chart, category, chartContext) {
    const patterns = [];
    const focus = CATEGORY_FOCUS[category];
    // Now pulling Ascendant/Midheaven from the combined placements object
    const coreMap = { Sun: chart.placements.Sun, Moon: chart.placements.Moon, Ascendant: chart.placements.Ascendant, Midheaven: chart.placements.Midheaven };

    // 1. Core Points (Sun, Moon, Asc, MC)
    Object.entries(coreMap).forEach(([point, data]) => {
        const baseWeight = 40;
        const bonuses = computeBonuses(point, data, focus);
        // Pass the house (data.house) to describePlanetInSign
        // Note: Asc/MC usually have house 1/10 assigned in our logic, but we should pass it if available.
        // For Asc/MC, the key might just be "Ascendant_Sign" without house, or "Ascendant_Sign_1st".
        // Let's pass data.house.
        patterns.push({
            id: `${point}_core`,
            planets: [point],
            category: 'core',
            score: scorePattern(baseWeight, 1, bonuses),
            title: `${point} in ${data.sign}`,
            text: describePlanetInSign(point, data.sign, { ...chartContext, house: data.house })
        });
    });

    // 2. Personal Planets in Sign (Mercury-Saturn, excluding Sun/Moon which are already in Core)
    PERSONAL_PLANETS.filter(p => p !== 'Sun' && p !== 'Moon').forEach((planet) => {
        const placement = chart.placements[planet];
        const baseWeight = 25;
        const intensity = ANGULAR_HOUSES.includes(placement.house) ? 1.1 : 0.9;
        const bonuses = computeBonuses(planet, placement, focus);

        // If the dignity score is negative (a debility/fall), push it to the 'challenge' category
        let categoryOverride = planet === 'Saturn' ? 'growth' : 'gift';
        if (getPlanetConditionScore(planet, placement.sign) < -0.15) {
            categoryOverride = 'challenge';
        }

        patterns.push({
            id: `${planet}_sign`,
            planets: [planet],
            category: categoryOverride,
            score: scorePattern(baseWeight, intensity, bonuses),
            title: `${planet} in ${placement.sign}`,
            text: describePlanetInSign(planet, placement.sign, { ...chartContext, house: placement.house })
        });
    });

    // 3. Aspect Patterns
    patterns.push(...buildAspectPatterns(chart, focus, chartContext));

    // 4. Element, Retrograde, House Emphasis
    const elementPattern = detectElementDominance(chart, chartContext);
    if (elementPattern) patterns.push(elementPattern);

    // Detect Element/Modality Blind Spots
    patterns.push(...detectBalanceBlindSpots(chart, chartContext));

    const retroPattern = detectRetrogradeStory(chart, focus, chartContext);
    if (retroPattern) patterns.push(retroPattern);
    patterns.push(...detectHouseEmphasis(chart, focus, chartContext));

    // --- PHASE 2: CURIOUS INSIGHTS ---

    // 5. Stelliums (4+ planets in same sign or house)
    patterns.push(...detectStelliums(chart, chartContext));

    // 6. North Node & Chiron (if available)
    if (chart.placements.NorthNode) {
        const nn = chart.placements.NorthNode;
        patterns.push({
            id: 'NorthNode',
            planets: ['NorthNode'],
            category: 'soul',
            score: 100, // Always high priority
            title: `North Node in ${nn.sign}`,
            text: describePhase2Pattern('north_node', `NorthNode_${nn.sign}_${nn.house}`)
        });
    }
    if (chart.placements.Chiron) {
        const ch = chart.placements.Chiron;
        patterns.push({
            id: 'Chiron',
            planets: ['Chiron'],
            category: 'healing',
            score: 95, // High priority
            title: `Chiron in ${ch.sign}`,
            text: describePhase2Pattern('chiron', `Chiron_${ch.sign}_${ch.house}`)
        });
    }

    // 7. Aspect Patterns (Yod, T-Square, Grand Trine)
    // For now, we use a placeholder detection or simple logic
    // patterns.push(...detectGeometricPatterns(chart));

    return patterns;
}

// Helper to describe Phase 2 patterns
function describePhase2Pattern(type, key) {
    if (CORE_DESCRIPTIONS[type] && CORE_DESCRIPTIONS[type][key]) {
        return CORE_DESCRIPTIONS[type][key];
    }
    return null;
}

function detectStelliums(chart, chartContext) {
    const patterns = [];
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    // Count by Sign
    const signCounts = {};
    planets.forEach(p => {
        if (chart.placements[p]) {
            const sign = chart.placements[p].sign;
            signCounts[sign] = (signCounts[sign] || 0) + 1;
        }
    });

    Object.entries(signCounts).forEach(([sign, count]) => {
        if (count >= 4) {
            patterns.push({
                id: `stellium_${sign}`,
                planets: [], // Generic
                category: 'curious',
                score: 150, // Massive boost to ensure visibility
                title: `Stellium in ${sign}`,
                text: describePhase2Pattern('stelliums', `stellium_${sign}`)
            });
        }
    });

    // Count by House
    const houseCounts = {};
    planets.forEach(p => {
        if (chart.placements[p]) {
            const house = chart.placements[p].house;
            houseCounts[house] = (houseCounts[house] || 0) + 1;
        }
    });

    Object.entries(houseCounts).forEach(([house, count]) => {
        if (count >= 4) {
            patterns.push({
                id: `stellium_house_${house}`,
                planets: [],
                category: 'curious',
                score: 150,
                title: `Stellium in ${getOrdinalSuffix(house)} House`,
                text: describePhase2Pattern('stelliums', `stellium_house_${house}`)
            });
        }
    });

    return patterns;
}

function getPlanetConditionScore(planet, sign) {
    if (!DIGNITY_MAP[planet]) return 0;
    return DIGNITY_MAP[planet][sign] || 0;
}

function buildAspectPatterns(chart, focus, chartContext) {
    const patterns = [];
    const placements = chart.placements;

    // A. Personal Planets (Sun-Saturn) aspects with each other
    for (let i = 0; i < PERSONAL_PLANETS.length; i += 1) {
        for (let j = i + 1; j < PERSONAL_PLANETS.length; j += 1) {
            const pA = PERSONAL_PLANETS[i];
            const pB = PERSONAL_PLANETS[j];
            const planetA = placements[pA];
            const planetB = placements[pB];
            if (!planetA || !planetB) continue;

            const diff = angularDifference(planetA.degree, planetB.degree);
            const aspect = ASPECTS.find((a) => Math.abs(diff - a.angle) <= a.orb);
            if (!aspect) continue;

            const orb = Math.abs(diff - aspect.angle);
            const intensity = 1 - (orb / aspect.orb);
            const bonuses = computeAspectBonuses([pA, pB], planetA, planetB, focus);

            let category = aspect.category;
            if (category === 'challenge' && ['Saturn', 'Pluto'].some((p) => [pA, pB].includes(p))) {
                category = 'shadow';
            } else if (category === 'core' && ['Sun', 'Moon'].some((p) => [pA, pB].includes(p))) {
                category = 'core';
            }

            patterns.push({
                id: `${pA}_${pB}_${aspect.name}`,
                planets: [pA, pB],
                category: category,
                score: scorePattern(aspect.weight, intensity, bonuses),
                text: describeAspect(pA, planetA.sign, pB, planetB.sign, aspect.name, chartContext)
            });
        }
    }

    // B. Inner Personal Planets (Sun-Mars) aspects with Outer Planets (Uranus, Neptune, Pluto)
    PERSONAL_INNER_PLANETS.forEach((pA) => {
        OUTER_PLANETS.forEach((pB) => {
            const planetA = placements[pA];
            const planetB = placements[pB];
            if (!planetA || !planetB) return;

            const diff = angularDifference(planetA.degree, planetB.degree);
            const aspect = ASPECTS.find((a) => Math.abs(diff - a.angle) <= a.orb);
            if (!aspect) return;

            const orb = Math.abs(diff - aspect.angle);
            const intensity = 1 - (orb / aspect.orb);
            const bonuses = computeAspectBonuses([pA, pB], planetA, planetB, focus);

            // Aspects to outer planets are always high impact for challenge/growth/shadow
            const baseWeight = aspect.weight + 10; // Increase weight for gravity
            let category = 'growth';
            if (aspect.category === 'challenge') category = 'shadow';
            if (aspect.category === 'core') category = 'core';

            patterns.push({
                id: `${pA}_${pB}_${aspect.name}_outer`,
                planets: [pA, pB],
                category: category,
                score: scorePattern(baseWeight, intensity, bonuses),
                text: describeAspect(pA, planetA.sign, pB, planetB.sign, aspect.name, chartContext)
            });
        });
    });

    return patterns;
}

function detectElementDominance(chart, chartContext) {
    const counts = { fire: 0, earth: 0, air: 0, water: 0 };
    const total = PERSONAL_PLANETS.length;
    PERSONAL_PLANETS.forEach((planet) => {
        const placement = chart.placements[planet];
        if (!placement) return;
        const entry = Object.entries(ELEMENTS).find(([, signs]) => signs.includes(placement.sign));
        if (entry) counts[entry[0]] += 1;
    });
    const maxElement = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const average = total / 4;
    const difference = maxElement[1] - average;
    if (difference >= 1.5) {
        return { id: `element_${maxElement[0]}`, planets: [], category: difference >= 2.5 ? 'shadow' : 'growth', score: scorePattern(30, difference / total, 0), text: describeElementDominance(maxElement[0], maxElement[1], total, chartContext) };
    }
    return null;
}

function detectBalanceBlindSpots(chart, chartContext) {
    const patterns = [];
    // Only count Sun through Saturn (personal planets)
    const placementSigns = PERSONAL_PLANETS.map(p => chart.placements[p]?.sign).filter(Boolean);

    // 1. Element Blind Spots (Zero placements)
    Object.entries(ELEMENTS).forEach(([element, signs]) => {
        const count = placementSigns.filter(sign => signs.includes(sign)).length;
        if (count === 0) {
            patterns.push({
                id: `missing_${element}`,
                planets: [],
                category: 'shadow',
                score: scorePattern(35, 1, 0),
                text: describeMissingBalance(element, 'element', chartContext)
            });
        }
    });

    // 2. Modality Blind Spots (Zero placements)
    Object.entries(MODALITIES).forEach(([modality, signs]) => {
        const count = placementSigns.filter(sign => signs.includes(sign)).length;
        if (count === 0) {
            patterns.push({
                id: `missing_${modality}`,
                planets: [],
                category: 'shadow',
                score: scorePattern(35, 1, 0),
                text: describeMissingBalance(modality, 'modality', chartContext)
            });
        }
    });

    return patterns;
}

function detectRetrogradeStory(chart, focus, chartContext) {
    const retroPlanets = PERSONAL_PLANETS.filter((planet) => chart.placements[planet]?.retrograde);
    if (retroPlanets.length < 2) return null;
    const focusBonus = retroPlanets.some((planet) => focus.planets.includes(planet)) ? 0.15 : 0;
    return { id: 'retrograde_cluster', planets: retroPlanets, category: 'growth', score: scorePattern(32, retroPlanets.length / PERSONAL_PLANETS.length, focusBonus), text: describeRetrogradeCluster(retroPlanets, chartContext) };
}

function detectHouseEmphasis(chart, focus, chartContext) {
    const counts = new Array(12).fill(0);
    PERSONAL_PLANETS.forEach((planet) => {
        const house = chart.placements[planet]?.house;
        if (house) counts[house - 1] += 1;
    });
    const maxCount = Math.max(...counts);
    const patterns = [];
    if (maxCount >= 3) {
        const houseIndex = counts.indexOf(maxCount) + 1;
        const focusBonus = focus.houses.includes(houseIndex) ? 0.2 : 0;
        patterns.push({ id: `house_cluster_${houseIndex}`, planets: [], category: focus.houses.includes(houseIndex) ? 'core' : 'growth', score: scorePattern(34, maxCount / PERSONAL_PLANETS.length, focusBonus), text: describeHouseCluster(houseIndex, maxCount, chartContext) });
    }
    const angularCount = counts[0] + counts[3] + counts[6] + counts[9];
    if (angularCount >= 3) {
        patterns.push({ id: 'angular_focus', planets: [], category: 'core', score: scorePattern(36, angularCount / PERSONAL_PLANETS.length, 0.1), text: describeAngularFocus(angularCount, chartContext) });
    }
    return patterns;
}

function selectTopInsights(patterns, limit = 3) {
    const sorted = [...patterns].sort((a, b) => b.score - a.score);
    const selected = [];
    const planetUsage = {};
    const minScoreThreshold = 18;

    // --- ANCHOR LOGIC ---
    // Force the best "Anchor" (Sun or Ascendant) to be the first insight.
    // This ensures the user always sees a "Golden Dictionary" description first.
    const anchor = sorted.find(p => (p.id === 'Sun_sign' || p.id === 'Ascendant_sign') && p.score >= minScoreThreshold);

    if (anchor) {
        selected.push(anchor);
        trackUsage(anchor, planetUsage);
    }
    // --------------------

    const ensureCategory = (category) => {
        if (selected.length >= limit) return;
        const candidate = sorted.find((pattern) => pattern.category === category && !selected.includes(pattern) && canUsePattern(pattern, planetUsage) && pattern.score >= minScoreThreshold);
        if (candidate) { selected.push(candidate); trackUsage(candidate, planetUsage); }
    };

    ['core', 'gift', 'challenge', 'shadow', 'growth'].forEach(ensureCategory);

    for (const pattern of sorted) {
        if (selected.length >= limit) break;
        if (selected.includes(pattern)) continue;
        if (!canUsePattern(pattern, planetUsage)) continue;
        selected.push(pattern);
        trackUsage(pattern, planetUsage);
    }

    if (selected.length < limit) {
        for (const pattern of sorted) {
            if (selected.length >= limit) break;
            if (selected.includes(pattern)) continue;
            selected.push(pattern);
        }
    }

    // --- BONUS: CURIOUS INSIGHT ---
    // Look for a high-value "Curious" insight (Stellium, Node, Chiron)
    // that wasn't already selected.
    const curiousCategories = ['curious', 'soul', 'healing'];
    const bonus = sorted.find(p =>
        curiousCategories.includes(p.category) &&
        !selected.includes(p) &&
        p.text // Must have content
    );

    if (bonus) {
        selected.push(bonus);
    }
    // ------------------------------

    return selected.slice(0, limit + 1); // Allow up to 4 insights
}

function canUsePattern(pattern, usageMap) {
    if (!pattern.planets || pattern.planets.length === 0) return true;
    return pattern.planets.every((planet) => (usageMap[planet] || 0) < 2);
}

function trackUsage(pattern, usageMap) {
    pattern.planets.forEach((planet) => { usageMap[planet] = (usageMap[planet] || 0) + 1; });
}

function scorePattern(baseWeight, intensity = 1, bonus = 0) {
    return Math.round(baseWeight * intensity * (1 + bonus) * 10) / 10;
}

function computeBonuses(point, placement, focus) {
    let bonus = 0;
    // 1. Focus Relevance
    if (focus.planets.includes(point)) bonus += 0.18;
    if (focus.houses.includes(placement.house)) bonus += 0.12;
    if (ANGULAR_HOUSES.includes(placement.house)) bonus += 0.15;

    // 2. Dignity/Condition Bonus
    const conditionScore = getPlanetConditionScore(point, placement.sign);
    if (conditionScore > 0) { // Only add positive bonus for rulership/exaltation
        bonus += conditionScore;
    } else if (conditionScore < 0) { // For detriments/falls, we let the negative impact the base score directly via intensity
        bonus += conditionScore * -1; // Convert negative to positive bonus to slightly increase overall score
    }

    return bonus;
}

function computeAspectBonuses(planets, placementA, placementB, focus) {
    let bonus = 0;
    if (planets.some((planet) => focus.planets.includes(planet))) bonus += 0.12;
    if ([placementA.house, placementB.house].some((house) => focus.houses.includes(house))) bonus += 0.08;
    return bonus;
}



// --- POWER-FIRST SELECTION ALGORITHM ---
function selectPowerTriad(chart) {
    const configurations = [];
    const placements = chart.placements;
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    // 1. DETECT TIGHT CONJUNCTIONS (within 8°)
    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const pA = planets[i];
            const pB = planets[j];
            const placA = placements[pA];
            const placB = placements[pB];
            if (!placA || !placB) continue;

            const diff = angularDifference(placA.degree, placB.degree);
            if (diff <= 8) {
                let power = 100; // Base power for conjunction
                if (OUTER_PLANETS.includes(pA) || OUTER_PLANETS.includes(pB)) power += 50;
                if (ANGULAR_HOUSES.includes(placA.house) && ANGULAR_HOUSES.includes(placB.house)) power += 30;
                if ([1, 10].includes(placA.house)) power += 20;

                configurations.push({
                    type: 'conjunction',
                    planets: [pA, pB],
                    power: power,
                    house: placA.house,
                    sign: placA.sign,
                    id: `${pA}_${pB}_conjunction`
                });
            }
        }
    }

    // 2. DETECT HARD ASPECTS (squares, oppositions)
    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const pA = planets[i];
            const pB = planets[j];
            const placA = placements[pA];
            const placB = placements[pB];
            if (!placA || !placB) continue;

            const diff = angularDifference(placA.degree, placB.degree);

            // Check for square (90°, orb 6°)
            if (Math.abs(diff - 90) <= 6) {
                let power = 80;
                if (pA === 'Sun' || pB === 'Sun' || pA === 'Moon' || pB === 'Moon') power += 40;
                if (pA === 'Saturn' || pB === 'Saturn') power += 30;
                if (ANGULAR_HOUSES.includes(placA.house) && ANGULAR_HOUSES.includes(placB.house)) power += 20;

                configurations.push({
                    type: 'square',
                    planets: [pA, pB],
                    power: power,
                    house: placA.house,
                    sign: placA.sign,
                    id: `${pA}_${pB}_square`
                });
            }

            // Check for opposition (180°, orb 7°)
            if (Math.abs(diff - 180) <= 7) {
                let power = 80;
                if (pA === 'Sun' || pB === 'Sun' || pA === 'Moon' || pB === 'Moon') power += 40;
                if (pA === 'Saturn' || pB === 'Saturn') power += 30;
                if (ANGULAR_HOUSES.includes(placA.house) && ANGULAR_HOUSES.includes(placB.house)) power += 20;

                configurations.push({
                    type: 'opposition',
                    planets: [pA, pB],
                    power: power,
                    house: placA.house,
                    sign: placA.sign,
                    id: `${pA}_${pB}_opposition`
                });
            }
        }
    }

    // 3. DETECT ANGULAR + DIGNIFIED single planets
    planets.forEach(planet => {
        const plac = placements[planet];
        if (!plac) return;

        let power = 0;
        if (ANGULAR_HOUSES.includes(plac.house)) power += 40;

        const dignityScore = getPlanetConditionScore(planet, plac.sign);
        if (dignityScore > 0) power += 30;

        const fireSign = SIGN_ARCHETYPES[plac.sign]?.element === 'fire';
        if (fireSign) power += 20;

        if (power >= 60) {
            configurations.push({
                type: 'single',
                planets: [planet],
                power: power,
                house: plac.house,
                sign: plac.sign,
                id: `${planet}_${plac.sign}`
            });
        }
    });

    // 4. SORT BY POWER
    configurations.sort((a, b) => b.power - a.power);

    // 5. ASSIGN ROLES TO TOP 3
    const roles = { energy: null, enemy: null, direction: null };

    for (const config of configurations) {
        // Determine nature
        const isEnergy = config.planets.some(p => ['Sun', 'Mars', 'Jupiter'].includes(p)) ||
            SIGN_ARCHETYPES[config.sign]?.element === 'fire' ||
            [1, 5, 9, 10].includes(config.house);

        const isEnemy = config.type === 'square' || config.type === 'opposition' ||
            config.planets.includes('Saturn') ||
            config.house === 12 ||
            getPlanetConditionScore(config.planets[0], config.sign) < 0;

        const isDirection = config.type === 'conjunction' && config.planets.some(p => OUTER_PLANETS.includes(p)) ||
            [2, 8, 10].includes(config.house) ||
            !config.planets.some(p => ['Mars'].includes(p));

        // Assign to first available role
        if (!roles.energy && isEnergy) {
            roles.energy = config;
        } else if (!roles.enemy && isEnemy) {
            roles.enemy = config;
        } else if (!roles.direction && isDirection) {
            roles.direction = config;
        }

        // Stop when all roles filled
        if (roles.energy && roles.enemy && roles.direction) break;
    }

    // 6. Fill any missing roles with top configurations
    if (!roles.energy) roles.energy = configurations[0];
    if (!roles.enemy) roles.enemy = configurations[1];
    if (!roles.direction) roles.direction = configurations[2];

    return [roles.energy, roles.enemy, roles.direction].filter(Boolean);
}

function convertConfigToInsight(config, role, chart, chartContext) {
    if (!config) return null;

    const planets = config.planets;
    let title, text, category;

    // Determine category based on role
    if (role === 'energy') category = 'core';
    else if (role === 'enemy') category = 'challenge';
    else if (role === 'direction') category = 'growth';

    // Generate title and text based on configuration type
    if (config.type === 'conjunction') {
        const [p1, p2] = planets;
        title = `${p1}-${p2} Conjunction`;
        text = describeAspect(p1, config.sign, p2, config.sign, 'conjunction', chartContext);
    } else if (config.type === 'square') {
        const [p1, p2] = planets;
        const plac2 = chart.placements[p2];
        title = `${p1}-${p2} Square`;
        text = describeAspect(p1, config.sign, p2, plac2.sign, 'square', chartContext);
    } else if (config.type === 'opposition') {
        const [p1, p2] = planets;
        const plac2 = chart.placements[p2];
        title = `${p1}-${p2} Opposition`;
        text = describeAspect(p1, config.sign, p2, plac2.sign, 'opposition', chartContext);
    } else {
        // Single planet
        const planet = planets[0];
        title = `${planet} in ${config.sign}`;
        text = describePlanetInSign(planet, config.sign, { ...chartContext, house: config.house });
    }

    return {
        id: config.id,
        planets: planets,
        type: config.type,      // Preserve type for sentence lookup
        house: config.house,     // Preserve house for sentence lookup
        category: category,
        score: config.power,
        title: title,
        text: text
    };
}

// --- BRIDGE DESCRIPTION FUNCTIONS ---
/**
 * Creates a narrative link between a house and where its ruling planet is placed.
 * @param {object} chart - The synthetic chart object.
 * @param {number} houseNumber - The house number to check (1-12).
 * @param {object} chartContext - Context object for variant rotation.
 * @returns {string|null} The descriptive bridge text.
 */
function getRulershipBridge(chart, houseNumber, chartContext) {
    const cuspSign = chart.houseCusps[houseNumber];
    if (!cuspSign) return null;

    const rulingPlanet = RULERSHIP_MAP[cuspSign];
    const rulerPlacement = chart.placements[rulingPlanet];

    if (!rulingPlanet || !rulerPlacement || rulerPlacement.house === houseNumber) return null; // Skip if in own house or ruler not found

    const houseNames = {
        1: 'Self', 2: 'Values', 3: 'Mind', 4: 'Home', 5: 'Creativity', 6: 'Routine',
        7: 'Partnership', 8: 'Transformation', 9: 'Wisdom', 10: 'Career', 11: 'Community', 12: 'Spirit'
    };

    const planetNames = {
        Sun: 'Identity', Moon: 'Emotions', Mercury: 'Mind', Venus: 'Love', Mars: 'Drive',
        Jupiter: 'Growth', Saturn: 'Structure', Uranus: 'Change', Neptune: 'Dreams', Pluto: 'Power'
    };

    const targetHouse = houseNames[houseNumber];
    const rulerName = planetNames[rulingPlanet] || rulingPlanet;
    const sourceHouse = houseNames[rulerPlacement.house];

    // Simpler, more conversational bridge
    const text = `**Connection:** Your path to **${targetHouse}** runs through **${sourceHouse}**. Why? Because ${rulingPlanet} (your guide for ${targetHouse}) is stationed there.`;

    return rotateVariant([text], chartContext?.usedVariants?.bridges, `ruler_h${houseNumber}`);
}



// --- DESCRIPTION HELPER FUNCTIONS ---
function describeMissingBalance(type, balanceType, chartContext) {
    const descriptions = {
        element: {
            fire: 'Without Fire placements, you might struggle to access raw motivation, spontaneity, or personal passion.',
            earth: 'With no Earth planets, staying grounded, managing material resources, or establishing concrete routines may be a lifelong challenge.',
            air: 'A lack of Air can lead to difficulty with objectivity, distance, and clear, non-emotional communication.',
            water: 'Zero Water placements suggests a blind spot around emotional depth, intuition, and deep empathy; you prioritize logic over feeling.'
        },
        modality: {
            cardinal: 'With no Cardinal placements, initiating new projects or making sharp, decisive pivots might feel difficult.',
            fixed: 'A lack of Fixed energy suggests that maintaining stable momentum, digging in, or resisting change requires conscious effort.',
            mutable: 'Zero Mutable planets can mean difficulty adapting, switching gears, or integrating disparate ideas without tension.'
        }
    };
    const key = `${balanceType}_${type}`;
    const variants = [
        `**Blind Spot Alert:** ${descriptions[balanceType][type] || 'This area is missing from your core configuration.'}`,
        `The lack of ${type} energy in your chart means you often compensate for this missing quality. ${descriptions[balanceType][type] || ''}`,
        `You have no personal planets in ${type} signs. This indicates that while you excel elsewhere, you're constantly learning to master this type of energy. ${descriptions[balanceType][type] || ''}`
    ];
    return rotateVariant(variants, chartContext?.usedVariants?.balance, key);
}

const PLANET_KEYWORDS = {
    Sun: 'Identity', Moon: 'Emotions', Mercury: 'Intellect', Venus: 'Love', Mars: 'Drive',
    Jupiter: 'Expansion', Saturn: 'Discipline', Uranus: 'Innovation', Neptune: 'Intuition', Pluto: 'Power',
    Ascendant: 'Persona', Midheaven: 'Ambition'
};

let CORE_DESCRIPTIONS = {};

// Pre-load validated sentences when content library loads
loadValidatedSentences().catch(console.warn);

// Fetch all content libraries
async function loadContentLibrary() {
    try {
        // Load default content first
        const defaultResponse = await fetch('content.json');
        const defaultData = await defaultResponse.json();

        // Load MVP "Simple" Library (Planet/Sign/House)
        let simpleData = { descriptions: {} };
        try {
            const simpleResponse = await fetch('library_simple.json');
            if (simpleResponse.ok) simpleData = await simpleResponse.json();
        } catch (e) { console.warn('Simple library not found'); }

        // Load "God Mode" ChatGPT Library (Planet/Sign/House)
        let chatgptData = { descriptions: {} };
        try {
            const chatgptResponse = await fetch('library_chatgpt.json');
            if (chatgptResponse.ok) chatgptData = await chatgptResponse.json();
        } catch (e) { console.warn('ChatGPT library not found'); }

        // Load Aspects Library
        let aspectsData = { aspects: {}, patterns: {} };
        try {
            const aspectsResponse = await fetch('library_aspects.json?v=' + Date.now());
            if (aspectsResponse.ok) aspectsData = await aspectsResponse.json();
        } catch (e) { console.warn('Aspects library not found', e); }

        // Load Phase 2 Library (Stelliums, Nodes, Chiron, Patterns)
        let phase2Data = { stelliums: {}, north_node: {}, chiron: {}, aspect_patterns: {} };
        try {
            const phase2Response = await fetch('library_phase2.json');
            if (phase2Response.ok) phase2Data = await phase2Response.json();
        } catch (e) { console.warn('Phase 2 library not found'); }

        // Merge logic: Default < Simple < ChatGPT
        CORE_DESCRIPTIONS = {
            ...defaultData,
            overrides: {
                simple: simpleData.descriptions || {},
                godMode: chatgptData.descriptions || {}
            },
            aspects: aspectsData.aspects || {},
            patterns: aspectsData.patterns || {},
            stelliums: phase2Data.stelliums || {},
            north_node: phase2Data.north_node || {},
            chiron: phase2Data.chiron || {},
            aspect_patterns: phase2Data.aspect_patterns || {}
        };

        console.log("Content libraries loaded:", {
            placements: Object.keys(CORE_DESCRIPTIONS.overrides.simple).length + Object.keys(CORE_DESCRIPTIONS.overrides.godMode).length,
            aspects: Object.keys(CORE_DESCRIPTIONS.aspects).length,
            patterns: Object.keys(CORE_DESCRIPTIONS.patterns).length,
            stelliums: Object.keys(CORE_DESCRIPTIONS.stelliums).length,
            nodes: Object.keys(CORE_DESCRIPTIONS.north_node).length,
            chiron: Object.keys(CORE_DESCRIPTIONS.chiron).length,
            aspect_patterns: Object.keys(CORE_DESCRIPTIONS.aspect_patterns).length
        });

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Call immediately
loadContentLibrary();

// Check for unlock parameter on page load (LemonSqueezy success redirect)
checkForUnlockParameter();

function describePlanetInSign(planet, sign, chartContext) {
    // To get the house, we need the full chart object.
    // For now, we'll pass null for house and rely on the caller to be updated later.
    // Or, if chartContext contains the chart, we can derive it.
    let house = null;
    if (chartContext && chartContext.house) {
        house = chartContext.house;
    } else if (chartContext && chartContext.chart && chartContext.chart.placements && chartContext.chart.placements[planet]) {
        house = chartContext.chart.placements[planet].house;
    }

    return getOverrideText(planet, sign, house) ||
        getStandardText(planet, sign, chartContext);
}

function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function getOverrideText(planet, sign, house) {
    if (!CORE_DESCRIPTIONS.overrides) return null;

    // Construct keys
    const houseSuffix = house ? `_${getOrdinalSuffix(house)}` : ''; // e.g. _1st
    const keyFull = `${planet}_${sign}${houseSuffix}`; // Sun_Aries_1st
    const keySign = `${planet}_${sign}`; // Sun_Aries

    // Check God Mode (Priority 1)
    if (CORE_DESCRIPTIONS.overrides.godMode[keyFull]) return CORE_DESCRIPTIONS.overrides.godMode[keyFull];
    if (CORE_DESCRIPTIONS.overrides.godMode[keySign]) return CORE_DESCRIPTIONS.overrides.godMode[keySign];

    // Check Simple Mode (Priority 2)
    if (CORE_DESCRIPTIONS.overrides.simple[keyFull]) return CORE_DESCRIPTIONS.overrides.simple[keyFull];
    if (CORE_DESCRIPTIONS.overrides.simple[keySign]) return CORE_DESCRIPTIONS.overrides.simple[keySign];

    return null;
}

function getStandardText(planet, sign, chartContext) {
    // 1. Check the Golden Dictionary first (Planets in Signs)
    if (CORE_DESCRIPTIONS.planets_in_signs &&
        CORE_DESCRIPTIONS.planets_in_signs[planet] &&
        CORE_DESCRIPTIONS.planets_in_signs[planet][sign]) {

        const entry = CORE_DESCRIPTIONS.planets_in_signs[planet][sign];
        // If it's an object with title/text, return the text (we can use title later)
        if (Array.isArray(entry)) return entry[0];
        return typeof entry === 'string' ? entry : entry.text;
    }

    // 2. Fallback to algorithmic generation for other planets
    const archetype = SIGN_ARCHETYPES[sign];
    const keyword = PLANET_KEYWORDS[planet] || planet;

    // Direct, clear statements
    const variants = [
        `Your **${keyword}** is expressed through the lens of **${sign}**. This means your style is ${archetype.tone}.`,
        `With ${planet} in ${sign}, you approach ${keyword.toLowerCase()} with ${archetype.tone} energy.`,
        `The quality of ${sign} (${archetype.tone}) colors your ${keyword.toLowerCase()}.`
    ];
    return rotateVariant(variants, chartContext?.usedVariants?.planetSign, `${planet}_${sign}`);
}

function describeAspect(planetA, signA, planetB, signB, aspect, chartContext) {
    // 1. Check the Golden Dictionary first (Aspects)
    if (CORE_DESCRIPTIONS.aspects) {
        // Construct keys (bidirectional check)
        const key1 = `${planetA}_${planetB}_${aspect}`;
        const key2 = `${planetB}_${planetA}_${aspect}`;

        // Check for outer planet specific keys (e.g., Sun_Uranus_conjunction_outer)
        // Note: The library uses _outer suffix for some keys, so we check both standard and outer variants
        const key1Outer = `${key1}_outer`;
        const key2Outer = `${key2}_outer`;

        // Try all possible keys
        const entry = CORE_DESCRIPTIONS.aspects[key1] ||
            CORE_DESCRIPTIONS.aspects[key2] ||
            CORE_DESCRIPTIONS.aspects[key1Outer] ||
            CORE_DESCRIPTIONS.aspects[key2Outer];

        if (entry) {
            if (Array.isArray(entry)) return entry[0];
            return typeof entry === 'string' ? entry : entry.text;
        }
    }

    // 2. Fallback to algorithmic generation
    const keyA = PLANET_KEYWORDS[planetA] || planetA;
    const keyB = PLANET_KEYWORDS[planetB] || planetB;

    const aspectDescriptions = {
        conjunction: {
            verb: 'merged with',
            meaning: 'This blends their energies into a single, powerful force.'
        },
        sextile: {
            verb: 'supporting',
            meaning: 'This creates a natural flow of opportunity between them.'
        },
        square: {
            verb: 'in tension with',
            meaning: 'This creates a dynamic friction that pushes you to grow.'
        },
        trine: {
            verb: 'in harmony with',
            meaning: 'These parts of you understand each other effortlessly.'
        },
        opposition: {
            verb: 'opposing',
            meaning: 'This creates a "tug-of-war" where you must find balance.'
        }
    };

    const desc = aspectDescriptions[aspect] || { verb: 'connected to', meaning: 'This links their energies.' };

    // "Venus (Love) is merged with Uranus (Innovation)."
    const sentence1 = `**${planetA}** (${keyA}) is ${desc.verb} **${planetB}** (${keyB}).`;
    const sentence2 = desc.meaning;

    return `${sentence1} ${sentence2}`;
}

function describeElementDominance(element, count, total, chartContext) {
    const elementDescriptions = {
        fire: 'Action, inspiration, and spontaneity drive you.',
        earth: 'Practicality, stability, and tangible results are your focus.',
        air: 'Communication, ideas, and social connection are your fuel.',
        water: 'Emotion, intuition, and depth are your primary language.'
    };
    const label = elementDescriptions[element];
    const intensity = Math.round((count / total) * 100);

    return `**${element.toUpperCase()} Dominance**: With ${intensity}% of your chart in ${element} signs, ${label.toLowerCase()}`;
}

function describeRetrogradeCluster(planets, chartContext) {
    const list = planets.join(', ');
    return `**Retrograde Focus**: You have ${planets.length} planets (${list}) in retrograde. This suggests you are meant to internalize and redefine these energies on your own terms before expressing them outwardly.`;
}

function describeHouseCluster(house, count, chartContext) {
    const descriptions = {
        1: ['You keep reinventing yourself right out in the open.', 'Life keeps asking who you are, and you answer differently each time.'],
        2: ['You track worth, security, and body wisdom like it\'s your job.', 'Money, resources, and physical comfort are never side quests.'],
        3: ['Curiosity and conversations are the drumbeat of your days.', 'You think by talking, learn by asking, and connect through words.'],
        4: ['Home, roots, lineage, and tenderness are never side quests.', 'Your foundation is where everything else gets built.'],
        5: ['You need play, romance, and fertile creativity to feel alive.', 'Life without expression and joy feels like a cage.'],
        6: ['Ritual, service, and caring for the body anchor your purpose.', 'You find meaning in the daily work of keeping things running.'],
        7: ['Every partnership becomes a mirror; you learn in dialogue.', 'Relationships are your primary classroom.'],
        8: ['You magnetize intensity, intimacy, and shadow work.', 'Nothing stays surface-level for long around you.'],
        9: ['Meaning-making, study, and long horizons keep you hopeful.', 'You need big questions and bigger answers.'],
        10: ['You\'re building a public legacy whether you try to or not.', 'Your reputation and impact matter more than you admit.'],
        11: ['Community, future-building, and collective experiments call you.', 'You\'re wired for the group, not just the individual.'],
        12: ['You live half in the seen world, half in the liminal.', 'The hidden, the spiritual, and the unconscious are real places for you.']
    };
    const houseDescs = descriptions[house] || ['This house becomes a repeating theme you can\'t ignore.'];
    return rotateVariant(houseDescs, chartContext?.usedVariants?.houses, `house_${house} `);
}

function describeAngularFocus(count, chartContext) {
    const variants = [
        `${count} of your core placements sit in angular houses(1 / 4 / 7 / 10), so people notice your presence, choices, and pivots instantly.`,
        `With ${count} planets in angular houses, you're built for visibility and immediate impact.`,
        `Your angular emphasis (${count} planets) means you can't hide—your energy shows up fast and clear.`
    ];
    return rotateVariant(variants, chartContext?.usedVariants?.angular, 'angular');
}

function rotateVariant(variants, registry = {}, key = 'default') {
    if (!variants || variants.length === 0) return '';
    const used = registry[key] || 0;
    const next = variants[used % variants.length];
    registry[key] = used + 1;
    return next;
}

// addBridges function removed


function buildChartSummary(chart) {
    // Show top 6 placements + ASC/MC
    const placements = Object.entries(chart.placements)
        .filter(([planet]) => PLANETS.includes(planet)) // Filter for actual planets
        .slice(0, 6)
        .map(([planet, data]) => `${planet}: ${data.sign} ${Math.round(data.degree % 30)}° (H${data.house})`);

    // Add ASC and MC from placements
    placements.push(`ASC: ${chart.placements.Ascendant.sign} (Ruler: ${RULERSHIP_MAP[chart.placements.Ascendant.sign]})`, `MC: ${chart.placements.Midheaven.sign}`);
    return `<p>${placements.join(' · ')}</p>`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function angularDifference(degA, degB) {
    const diff = Math.abs(degA - degB) % 360;
    return diff > 180 ? 360 - diff : diff;
}

function createRNG(seedStr) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i += 1) {
        seed = (seed << 5) - seed + seedStr.charCodeAt(i);
        seed |= 0;
    }
    return function rng() {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
