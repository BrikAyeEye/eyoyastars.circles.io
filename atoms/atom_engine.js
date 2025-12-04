const fs = require('fs');
const path = require('path');

/**
 * ATOM ENGINE
 * 
 * Loads atoms from JSON files and composes them for LLM synthesis.
 * Designed to be easily migrated to PostgreSQL later.
 */

class AtomEngine {
    constructor(atomsDir = path.join(__dirname)) {
        this.atomsDir = atomsDir;
        this.placements = null;
        this.houses = null;
        this.modifiers = null;
        this.loaded = false;
    }

    /**
     * Load all atom files into memory
     */
    load() {
        try {
            const placementsPath = path.join(this.atomsDir, 'placements.json');
            const housesPath = path.join(this.atomsDir, 'houses.json');
            const modifiersPath = path.join(this.atomsDir, 'modifiers.json');

            this.placements = JSON.parse(fs.readFileSync(placementsPath, 'utf8'));
            this.houses = JSON.parse(fs.readFileSync(housesPath, 'utf8'));
            this.modifiers = JSON.parse(fs.readFileSync(modifiersPath, 'utf8'));

            this.loaded = true;
            console.log(`✓ Loaded ${Object.keys(this.placements.atoms).length} placement atoms`);
            console.log(`✓ Loaded ${Object.keys(this.houses.atoms).length} house atoms`);
            console.log(`✓ Loaded modifiers: ${Object.keys(this.modifiers.modifiers).length} categories`);

            return true;
        } catch (error) {
            console.error('Error loading atoms:', error);
            return false;
        }
    }

    /**
     * Get atoms for a planet+sign placement
     * @param {string} planet - e.g., "Sun", "Moon", "Mars"
     * @param {string} sign - e.g., "Aries", "Taurus"
     * @param {string} category - Optional filter: "identity", "drive", "emotional_style", etc.
     * @returns {Array} Array of atom objects
     */
    getPlacementAtoms(planet, sign, category = null) {
        if (!this.loaded) this.load();

        const key = `${planet}_${sign}`;
        const placement = this.placements.atoms[key];

        if (!placement) {
            console.warn(`No atoms found for ${planet} in ${sign}`);
            return [];
        }

        // Convert to atom objects (matching DB schema)
        const atoms = placement.atoms.map((atomText, index) => ({
            id: `${key}_${index + 1}`,
            type: 'planet_sign',
            planet: planet,
            sign: sign,
            house: null,
            category: category || this._inferCategory(atomText, placement),
            atom_text: atomText,
            strength: placement.strength || 1.0,
            tags: this._extractTags(placement, atomText)
        }));

        // Filter by category if specified
        if (category) {
            return atoms.filter(a => a.category === category);
        }

        return atoms;
    }

    /**
     * Get atoms for a planet+house placement
     * @param {string} planet - e.g., "Sun", "Moon", "Mars"
     * @param {number} house - 1-12
     * @param {string} category - Optional filter
     * @returns {Array} Array of atom objects
     */
    getHouseAtoms(planet, house, category = null) {
        if (!this.loaded) this.load();

        // Try both formats: "Sun_1st" and "Sun_1"
        const key1 = `${planet}_${house}`;
        const key2 = `${planet}_${this._formatHouse(house)}`;
        const houseData = this.houses.atoms[key2] || this.houses.atoms[key1];

        if (!houseData) {
            console.warn(`No atoms found for ${planet} in ${house}th House`);
            return [];
        }

        const atoms = houseData.atoms.map((atomText, index) => ({
            id: `${key}_${index + 1}`,
            type: 'planet_house',
            planet: planet,
            sign: null,
            house: house,
            category: category || this._inferCategory(atomText, houseData),
            atom_text: atomText,
            strength: houseData.strength || 1.0,
            tags: this._extractTags(houseData, atomText)
        }));

        if (category) {
            return atoms.filter(a => a.category === category);
        }

        return atoms;
    }

    /**
     * Get modifier atoms based on chart analysis
     * @param {Object} chartAnalysis - { element_balance, modality_balance, aspects, empty_houses }
     * @returns {Array} Array of modifier atoms
     */
    getModifierAtoms(chartAnalysis) {
        if (!this.loaded) this.load();

        const modifierAtoms = [];

        // Element balance modifiers
        if (chartAnalysis.element_balance) {
            const elements = chartAnalysis.element_balance;
            for (const [element, count] of Object.entries(elements)) {
                if (count >= 4) {
                    const key = `${element}_high`;
                    const atoms = this.modifiers.modifiers.elements?.[key] || [];
                    atoms.forEach((atomText, index) => {
                        modifierAtoms.push({
                            id: `mod_${key}_${index + 1}`,
                            type: 'modifier',
                            modifier_type: 'element_balance',
                            trigger: { [`${element}_high`]: true },
                            atom_text: atomText,
                            strength: 1.0,
                            tags: [element, 'high']
                        });
                    });
                } else if (count <= 1) {
                    const key = `${element}_low`;
                    const atoms = this.modifiers.modifiers.elements?.[key] || [];
                    atoms.forEach((atomText, index) => {
                        modifierAtoms.push({
                            id: `mod_${key}_${index + 1}`,
                            type: 'modifier',
                            modifier_type: 'element_balance',
                            trigger: { [`${element}_low`]: true },
                            atom_text: atomText,
                            strength: 1.0,
                            tags: [element, 'low']
                        });
                    });
                }
            }
        }

        // Modality balance modifiers
        if (chartAnalysis.modality_balance) {
            const modalities = chartAnalysis.modality_balance;
            for (const [modality, count] of Object.entries(modalities)) {
                if (count >= 4) {
                    const key = `${modality}_high`;
                    const atoms = this.modifiers.modifiers.modalities?.[key] || [];
                    atoms.forEach((atomText, index) => {
                        modifierAtoms.push({
                            id: `mod_${key}_${index + 1}`,
                            type: 'modifier',
                            modifier_type: 'modality_balance',
                            trigger: { [`${modality}_high`]: true },
                            atom_text: atomText,
                            strength: 1.0,
                            tags: [modality, 'high']
                        });
                    });
                }
            }
        }

        // Aspect modifiers
        if (chartAnalysis.aspects) {
            for (const aspect of chartAnalysis.aspects) {
                const { planet1, planet2, type } = aspect;
                const isHard = ['square', 'opposition'].includes(type);
                const key = `${planet1}_${planet2}_${isHard ? 'Hard' : 'Soft'}`;
                const atoms = this.modifiers.modifiers.aspect_archetypes?.[key] || [];
                atoms.forEach((atomText, index) => {
                    modifierAtoms.push({
                        id: `mod_aspect_${key}_${index + 1}`,
                        type: 'modifier',
                        modifier_type: 'aspect',
                        trigger: { [`${planet1}_${type}_${planet2}`]: true },
                        atom_text: atomText,
                        strength: 1.0,
                        tags: [planet1, planet2, type, isHard ? 'hard' : 'soft']
                    });
                });
            }
        }

        return modifierAtoms;
    }

    /**
     * Compose all relevant atoms for a chart into LLM-ready JSON
     * @param {Object} chart - Parsed chart data
     * @param {string} topic - e.g., "career_and_money", "relationships", "identity"
     * @returns {Object} Composed atoms ready for LLM synthesis
     */
    composeForLLM(chart, topic = null) {
        if (!this.loaded) this.load();

        const composition = {
            topic: topic || 'general',
            sun: {
                sign_atoms: [],
                house_atoms: []
            },
            moon: {
                sign_atoms: [],
                house_atoms: []
            },
            ascendant: [],
            planets: [],
            modifiers: []
        };

        // Process Sun
        if (chart.sun) {
            if (chart.sun.sign) {
                composition.sun.sign_atoms = this.getPlacementAtoms('Sun', chart.sun.sign, topic);
            }
            if (chart.sun.house) {
                composition.sun.house_atoms = this.getHouseAtoms('Sun', chart.sun.house, topic);
            }
        }

        // Process Moon
        if (chart.moon) {
            if (chart.moon.sign) {
                composition.moon.sign_atoms = this.getPlacementAtoms('Moon', chart.moon.sign, topic);
            }
            if (chart.moon.house) {
                composition.moon.house_atoms = this.getHouseAtoms('Moon', chart.moon.house, topic);
            }
        }

        // Process Ascendant
        if (chart.ascendant) {
            composition.ascendant = this.getPlacementAtoms('Ascendant', chart.ascendant.sign, topic);
        }

        // Process other planets
        const otherPlanets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
        for (const planet of otherPlanets) {
            if (chart[planet.toLowerCase()]) {
                const placement = chart[planet.toLowerCase()];
                const planetData = {
                    planet: planet,
                    sign_atoms: [],
                    house_atoms: []
                };

                if (placement.sign) {
                    planetData.sign_atoms = this.getPlacementAtoms(planet, placement.sign, topic);
                }
                if (placement.house) {
                    planetData.house_atoms = this.getHouseAtoms(planet, placement.house, topic);
                }

                composition.planets.push(planetData);
            }
        }

        // Process modifiers
        if (chart.analysis) {
            composition.modifiers = this.getModifierAtoms(chart.analysis);
        }

        // Add instruction for LLM
        composition.instruction = this._generateInstruction(topic);

        return composition;
    }

    /**
     * Generate LLM instruction based on topic
     */
    _generateInstruction(topic) {
        const instructions = {
            'career_and_money': 'Synthesize into a single 5–7 sentence insight, focusing only on practical career and financial themes. Be specific and actionable.',
            'relationships': 'Synthesize into a single 5–7 sentence insight about relationship patterns, partnership needs, and emotional connection style.',
            'identity': 'Synthesize into a single 5–7 sentence insight about core identity, self-expression, and how this person shows up in the world.',
            'general': 'Synthesize these atoms into a cohesive 5–7 sentence interpretation that weaves together the key themes naturally.'
        };

        return instructions[topic] || instructions['general'];
    }

    /**
     * Infer category from atom text and placement data
     */
    _inferCategory(atomText, placementData) {
        const text = atomText.toLowerCase();
        const domain = placementData.domain?.toLowerCase() || '';
        const archetype = placementData.archetype?.toLowerCase() || '';

        // Category keywords
        if (text.includes('work') || text.includes('career') || text.includes('job') || domain.includes('work')) {
            return 'work';
        }
        if (text.includes('money') || text.includes('wealth') || text.includes('financial') || text.includes('resource')) {
            return 'money';
        }
        if (text.includes('relationship') || text.includes('partner') || text.includes('love') || domain.includes('relationship')) {
            return 'relationships';
        }
        if (text.includes('emotion') || text.includes('feel') || text.includes('mood') || archetype.includes('heart')) {
            return 'emotional_style';
        }
        if (text.includes('learn') || text.includes('think') || text.includes('mind') || text.includes('curiosity')) {
            return 'learning';
        }
        if (text.includes('identity') || text.includes('self') || text.includes('who you are') || domain.includes('identity')) {
            return 'identity';
        }
        if (text.includes('drive') || text.includes('action') || text.includes('motivation') || text.includes('energy')) {
            return 'drive';
        }
        if (text.includes('obstacle') || text.includes('challenge') || text.includes('difficulty') || text.includes('struggle')) {
            return 'obstacles';
        }
        if (text.includes('gift') || text.includes('talent') || text.includes('strength') || text.includes('power')) {
            return 'gifts';
        }

        return 'patterns'; // default
    }

    /**
     * Extract tags from placement data and atom text
     */
    _extractTags(placementData, atomText) {
        const tags = [];

        // Add element
        if (placementData.element) {
            tags.push(placementData.element);
        }

        // Add modality
        if (placementData.modality) {
            tags.push(placementData.modality);
        }

        // Add domain keywords
        if (placementData.domain) {
            const domainWords = placementData.domain.toLowerCase().split(/[&\s]+/);
            tags.push(...domainWords.filter(w => w.length > 2));
        }

        // Extract keywords from atom text
        const keywords = ['practicality', 'body-focus', 'grounding', 'stability', 'slow_build', 'partnership', 'activation'];
        for (const keyword of keywords) {
            if (atomText.toLowerCase().includes(keyword.replace('_', ' '))) {
                tags.push(keyword);
            }
        }

        return [...new Set(tags)]; // Remove duplicates
    }

    /**
     * Format house number to ordinal (1 -> "1st", 2 -> "2nd", etc.)
     */
    _formatHouse(house) {
        if (typeof house === 'string' && house.match(/\d+(st|nd|rd|th)/)) {
            return house; // Already formatted
        }
        const num = parseInt(house);
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = num % 100;
        return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
}

module.exports = AtomEngine;
