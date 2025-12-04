# ⚡ Quick Start

## 1. Test the System

```bash
cd charter/atoms
node synthesize.js
```

This will:
- Load all atoms
- Create a test chart
- Generate compositions for 3 topics
- Save JSON files ready for LLM

## 2. Use in Your Code

```javascript
const AtomEngine = require('./atoms/atom_engine');
const ChartParser = require('./atoms/chart_parser');

const engine = new AtomEngine();
const parser = new ChartParser();

engine.load();

// Your chart data (from astro library)
const rawChart = {
  sun: { sign: 'Aries', house: 1 },
  moon: { sign: 'Gemini', house: 7 },
  // ... other planets
};

const parsedChart = parser.parse(rawChart);
const composition = engine.composeForLLM(parsedChart, 'career_and_money');

// Send composition to LLM API
// composition contains: topic, sun, moon, planets, modifiers, instruction
```

## 3. Add Atoms

Edit the JSON files directly:

- `placements.json` - Add `{Planet}_{Sign}` entries
- `houses.json` - Add `{Planet}_{House}` entries (use "1st", "2nd", etc.)
- `modifiers.json` - Add element/modality/aspect modifiers

## 4. Categories

Atoms are auto-categorized, but you can filter:

```javascript
// Get only "drive" category atoms
const driveAtoms = engine.getPlacementAtoms('Mars', 'Taurus', 'drive');
```

Available categories:
- `identity`, `drive`, `emotional_style`, `work`, `money`
- `relationships`, `learning`, `obstacles`, `gifts`, `patterns`

## 5. LLM Integration

The composition JSON is ready to send to any LLM:

```javascript
const prompt = `
You are an expert astrologer. Synthesize these atomic insights:

${JSON.stringify(composition, null, 2)}

${composition.instruction}
`;

// Send to OpenAI, Anthropic, etc.
const response = await llm.complete(prompt);
```

---

**That's it!** Start writing atoms and watch your interpretations come alive. 🎯




