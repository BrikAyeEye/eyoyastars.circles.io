# Simple Explanation: Why Lookup Fails

## The Data Flow Problem

### Step 1: Config Objects Are Created (GOOD ✅)
When `selectPowerTriad` creates configurations, they have ALL the data:
```javascript
{
    type: 'opposition',        // ← Has this
    planets: ['Sun', 'Mars'],
    house: 10,                 // ← Has this
    id: 'Sun_Mars_opposition'
}
```

### Step 2: Configs Are Converted to Insights (PROBLEM ❌)
`convertConfigToInsight` receives the config but **doesn't copy `type` and `house`**:
```javascript
return {
    id: config.id,           // ✅ Copied
    planets: planets,        // ✅ Copied
    category: category,      // ✅ Added
    score: config.power,     // ✅ Copied
    title: title,            // ✅ Added
    text: text               // ✅ Added
    // ❌ type: config.type  ← MISSING!
    // ❌ house: config.house ← MISSING!
};
```

### Step 3: Lookup Tries to Read Missing Properties (FAILS ❌)
`buildSentenceKey` tries to read properties that don't exist:
```javascript
// This checks enemy.type, but enemy doesn't have a 'type' property!
if (enemy.type === 'opposition') {
    shadowKey = 'opposition';  // ← This NEVER runs because enemy.type is undefined
}

// This checks direction.house, but direction doesn't have a 'house' property!
if (direction.house) {
    questKey = `House_${direction.house}`;  // ← This NEVER runs because direction.house is undefined
}
```

### Result: Lookup Always Fails
- `shadowKey` = `null` (because `enemy.type` doesn't exist)
- `questKey` = `null` (because `direction.house` doesn't exist)
- `buildSentenceKey` returns `null`
- Lookup fails → Falls back to atom generation → Bad sentences

## Example Scenario

**What SHOULD happen:**
1. Config: `{ type: 'opposition', planets: ['Sun', 'Mars'], house: 10 }`
2. Insight should be: `{ type: 'opposition', planets: ['Sun', 'Mars'], house: 10, ... }`
3. Lookup key: `"Sun_Mars_opposition_House_10"`
4. ✅ Finds sentence: "You are A HERO who overcomes RESISTANCE to build A LEGACY."

**What ACTUALLY happens:**
1. Config: `{ type: 'opposition', planets: ['Sun', 'Mars'], house: 10 }`
2. Insight is: `{ planets: ['Sun', 'Mars'], ... }` ← `type` and `house` are missing!
3. Lookup tries: `enemy.type` → `undefined` → `shadowKey` = `null`
4. Lookup tries: `direction.house` → `undefined` → `questKey` = `null`
5. Lookup key: `null`
6. ❌ Lookup fails → Falls back → Bad sentence

## The Fix

Just add two lines to `convertConfigToInsight`:
```javascript
return {
    id: config.id,
    planets: planets,
    type: config.type,      // ← ADD THIS
    house: config.house,     // ← ADD THIS
    category: category,
    score: config.power,
    title: title,
    text: text
};
```

Then the lookup will work because `enemy.type` and `direction.house` will exist!


