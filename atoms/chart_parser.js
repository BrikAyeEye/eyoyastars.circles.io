const fs = require('fs');
const path = require('path');

/**
 * CHART PARSER
 * 
 * Parses chart data and calculates element balance, modality balance,
 * empty houses, and aspects for modifier queries.
 */

class ChartParser {
    /**
     * Parse a chart object into structured format
     * @param {Object} rawChart - Raw chart data (format varies by source)
     * @returns {Object} Parsed chart with analysis
     */
    parse(rawChart) {
        const chart = {
            placements: {},
            analysis: {
                element_balance: { fire: 0, earth: 0, air: 0, water: 0 },
                modality_balance: { cardinal: 0, fixed: 0, mutable: 0 },
                empty_houses: [],
                aspects: []
            }
        };

        // Map of signs to elements
        const signElements = {
            'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
            'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth',
            'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
            'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
        };

        // Map of signs to modalities
        const signModalities = {
            'Aries': 'cardinal', 'Cancer': 'cardinal', 'Libra': 'cardinal', 'Capricorn': 'cardinal',
            'Taurus': 'fixed', 'Leo': 'fixed', 'Scorpio': 'fixed', 'Aquarius': 'fixed',
            'Gemini': 'mutable', 'Virgo': 'mutable', 'Sagittarius': 'mutable', 'Pisces': 'mutable'
        };

        // Process placements
        const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        
        for (const planet of planets) {
            if (rawChart[planet]) {
                const placement = rawChart[planet];
                chart.placements[planet] = {
                    sign: placement.sign || placement.signName,
                    house: placement.house || placement.houseNumber,
                    degree: placement.degree || placement.longitude
                };

                // Count elements
                if (placement.sign || placement.signName) {
                    const sign = placement.sign || placement.signName;
                    const element = signElements[sign];
                    if (element) {
                        chart.analysis.element_balance[element]++;
                    }

                    // Count modalities
                    const modality = signModalities[sign];
                    if (modality) {
                        chart.analysis.modality_balance[modality]++;
                    }
                }
            }
        }

        // Process Ascendant
        if (rawChart.ascendant || rawChart.asc) {
            const asc = rawChart.ascendant || rawChart.asc;
            chart.placements.ascendant = {
                sign: asc.sign || asc.signName,
                house: 1,
                degree: asc.degree || asc.longitude
            };

            // Count ascendant element/modality
            const sign = asc.sign || asc.signName;
            if (sign) {
                const element = signElements[sign];
                if (element) {
                    chart.analysis.element_balance[element]++;
                }
                const modality = signModalities[sign];
                if (modality) {
                    chart.analysis.modality_balance[modality]++;
                }
            }
        }

        // Find empty houses (houses 1-12 with no planets)
        const occupiedHouses = new Set();
        for (const planet of planets) {
            if (chart.placements[planet]?.house) {
                occupiedHouses.add(chart.placements[planet].house);
            }
        }
        for (let i = 1; i <= 12; i++) {
            if (!occupiedHouses.has(i)) {
                chart.analysis.empty_houses.push(i);
            }
        }

        // Process aspects (if provided)
        if (rawChart.aspects && Array.isArray(rawChart.aspects)) {
            chart.analysis.aspects = rawChart.aspects.map(aspect => ({
                planet1: aspect.planet1 || aspect.body1,
                planet2: aspect.planet2 || aspect.body2,
                type: aspect.type || aspect.aspect,
                orb: aspect.orb || 0
            }));
        }

        // Format for atom engine
        return this._formatForAtomEngine(chart);
    }

    /**
     * Format parsed chart for atom engine consumption
     */
    _formatForAtomEngine(parsedChart) {
        const formatted = {
            sun: parsedChart.placements.sun,
            moon: parsedChart.placements.moon,
            ascendant: parsedChart.placements.ascendant,
            mercury: parsedChart.placements.mercury,
            venus: parsedChart.placements.venus,
            mars: parsedChart.placements.mars,
            jupiter: parsedChart.placements.jupiter,
            saturn: parsedChart.placements.saturn,
            uranus: parsedChart.placements.uranus,
            neptune: parsedChart.placements.neptune,
            pluto: parsedChart.placements.pluto,
            analysis: parsedChart.analysis
        };

        return formatted;
    }

    /**
     * Create a simple test chart
     */
    createTestChart() {
        return {
            sun: { sign: 'Aries', house: 1 },
            moon: { sign: 'Gemini', house: 7 },
            mercury: { sign: 'Aries', house: 1 },
            venus: { sign: 'Taurus', house: 2 },
            mars: { sign: 'Leo', house: 5 },
            jupiter: { sign: 'Sagittarius', house: 9 },
            saturn: { sign: 'Capricorn', house: 10 },
            uranus: { sign: 'Aquarius', house: 11 },
            neptune: { sign: 'Pisces', house: 12 },
            pluto: { sign: 'Scorpio', house: 8 },
            ascendant: { sign: 'Aries', house: 1 },
            aspects: [
                { planet1: 'Sun', planet2: 'Moon', type: 'square' },
                { planet1: 'Venus', planet2: 'Mars', type: 'trine' }
            ]
        };
    }
}

module.exports = ChartParser;




