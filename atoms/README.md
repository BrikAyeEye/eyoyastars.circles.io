# 🌐 Atom System

**File-based atomic interpretation system for astrological charts.**

This system breaks down astrological interpretations into reusable "atoms" that can be composed and synthesized by LLMs into personalized readings.

---

## 📁 Structure

```
atoms/
├── placements.json    # Planet+Sign atoms (e.g., "Mars in Taurus")
├── houses.json        # Planet+House atoms (e.g., "Mars in 7th House")
├── modifiers.json     # Modifiers (elements, modalities, aspects)
├── atom_engine.js     # Core engine for loading and querying atoms
├── chart_parser.js    # Parses charts and calculates modifiers
└── synthesize.js      # Demo script showing how to compose atoms
```

---

## 🧩 Atom Types

### 1. **Placement Atoms** (`placements.json`)
Planet + Sign combinations.

**Key Format:** `{Planet}_{Sign}` (e.g., `Sun_Aries`, `Mars_Taurus`)

**Structure:**
```json
{
  "Sun_Aries": {
    "archetype": "The Pioneer",
    "element": "fire",
    "modality": "cardinal",
    "atoms": [
      "You are the spark that starts the fire.",
      "Patience is a concept you understand intellectually but reject emotionally."
    ]
  }
}
```

### 2. **House Atoms** (`houses.json`)
Planet + House combinations.

**Key Format:** `{Planet}_{House}` (e.g., `Sun_1st`, `Mars_7th`)

**Structure:**
```json
{
  "Sun_1st": {
    "domain": "Identity & Self",
    "atoms": [
      "You are here to be seen, not to hide.",
      "Your presence enters the room before you do."
    ]
  }
}
```

### 3. **Modifiers** (`modifiers.json`)
Element balance, modality balance, and aspect archetypes.

**Structure:**
```json
{
  "modifiers": {
    "elements": {
      "fire_high": ["Your chart burns with excess heat..."],
      "earth_low": ["You struggle to bring your ideas down to reality..."]
    },
    "modalities": {
      "fixed_high": ["Once you decide, God himself couldn't move you."]
    },
    "aspect_archetypes": {
      "Sun_Moon_Hard": ["Your head and heart are in a constant civil war."]
    }
  }
}
```

---

## 🚀 Usage

### Basic Example

```javascript
const AtomEngine = require('./atom_engine');
const ChartParser = require('./chart_parser');

// Initialize
const engine = new AtomEngine();
const parser = new ChartParser();

// Load atoms
engine.load();

// Parse a chart
const rawChart = {
  sun: { sign: 'Aries', house: 1 },
  moon: { sign: 'Gemini', house: 7 }
};
const parsedChart = parser.parse(rawChart);

// Compose atoms for LLM
const composition = engine.composeForLLM(parsedChart, 'career_and_money');

// Send to LLM API
// composition contains all relevant atoms + instruction
```

### Get Specific Atoms

```javascript
// Get all atoms for Mars in Taurus
const atoms = engine.getPlacementAtoms('Mars', 'Taurus');

// Filter by category
const driveAtoms = engine.getPlacementAtoms('Mars', 'Taurus', 'drive');

// Get house atoms
const houseAtoms = engine.getHouseAtoms('Sun', 1); // 1st house
```

---

## 📊 Categories

Atoms are automatically categorized (or can be explicitly set):

- `identity` - Core self, self-expression
- `drive` - Motivation, action, energy
- `emotional_style` - How emotions are processed
- `work` - Career, vocation, daily work
- `money` - Finances, resources, material security
- `relationships` - Partnerships, love, connection
- `learning` - Education, thinking, curiosity
- `obstacles` - Challenges, difficulties
- `gifts` - Talents, strengths, powers
- `patterns` - General patterns (default)

---

## 🔄 How It Works

1. **Parse Chart** → Extract placements, calculate element/modality balance, find aspects
2. **Query Atoms** → Load relevant placement and house atoms for each planet
3. **Query Modifiers** → Load modifiers based on chart analysis (e.g., high fire, empty houses)
4. **Compose JSON** → Structure all atoms into LLM-ready format
5. **LLM Synthesis** → Send to LLM API to weave atoms into beautiful prose

---

## 📝 Writing Atoms

### Placement Atoms

For each planet+sign combination, write 8-10 one-liner atoms that capture different facets:

```json
"Mars_Taurus": {
  "archetype": "The Juggernaut",
  "element": "earth",
  "modality": "fixed",
  "atoms": [
    "Once you commit, nothing short of tectonic plates will move you.",
    "Persistence is your artillery.",
    "You'd rather break obstacles than compromise."
  ]
}
```

### House Atoms

For each planet+house combination, write 8-10 atoms focused on that house's domain:

```json
"Mars_7th": {
  "domain": "Relationships",
  "atoms": [
    "Energy rises in one-to-one dynamics.",
    "You activate through collaboration and negotiation."
  ]
}
```

### Modifiers

Write modifiers that apply when certain chart conditions are met:

```json
"fire_high": [
  "Your chart burns with excess heat, leading to burnout.",
  "Impulse control is not your strong suit."
]
```

---

## 🎯 Target: 1,920 Atoms

**Breakdown:**
- **960 placement atoms** (10 planets × 12 signs × 8 atoms each)
- **960 house atoms** (10 planets × 12 houses × 8 atoms each)
- **~100 modifiers** (elements, modalities, aspects, empty houses)

---

## 🔮 Migration to Database

The atom structure is designed to map directly to PostgreSQL:

```sql
CREATE TABLE atoms (
  id VARCHAR PRIMARY KEY,
  type VARCHAR,  -- 'planet_sign' | 'planet_house' | 'modifier'
  planet VARCHAR,
  sign VARCHAR,
  house INTEGER,
  category VARCHAR,
  atom_text TEXT,
  strength FLOAT,
  tags JSONB
);
```

The `atom_engine.js` already returns objects matching this schema, making migration straightforward.

---

## 🧪 Testing

Run the demo:

```bash
cd charter/atoms
node synthesize.js
```

This will:
1. Load all atoms
2. Create a test chart
3. Compose atoms for multiple topics
4. Save composition JSON files
5. Show sample output

---

## 📚 Next Steps

1. **Write atoms** - Populate `placements.json` and `houses.json` with 1,920 atoms
2. **Test synthesis** - Use composition JSON with LLM APIs
3. **Refine categories** - Adjust category inference logic
4. **Add more modifiers** - Expand `modifiers.json` with more patterns
5. **Migrate to DB** - When ready to scale, migrate to PostgreSQL

---

## 💡 Tips

- **Keep atoms short** - One sentence, vivid and memorable
- **Vary perspectives** - Mix first-person, second-person, descriptive
- **Use tags** - Help LLM understand context (e.g., "practicality", "body-focus")
- **Test compositions** - Run `synthesize.js` regularly to see how atoms combine
- **Version control** - JSON files are git-friendly, easy to review and merge

---

**Ready to build your atom library!** 🚀




