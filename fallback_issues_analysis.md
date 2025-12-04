# Analysis: Why Fallback is Triggered (Causing Bad Sentences)

## Root Cause: Missing Properties in Insight Objects

### Issue #1: `convertConfigToInsight` Doesn't Preserve `type` Property
**Location:** Line 1621-1662

**Problem:**
- `convertConfigToInsight` receives a `config` object that has `type: 'square'`, `type: 'opposition'`, or `type: 'single'`
- But the returned insight object only includes: `id`, `planets`, `category`, `score`, `title`, `text`
- **The `type` property is NOT copied to the insight object**

**Impact:**
- In `buildSentenceKey` (line 186-189), it checks `enemy.type === 'square'` and `enemy.type === 'opposition'`
- But `enemy` is an insight object that doesn't have a `type` property!
- So `shadowKey` will be `null` for square/opposition aspects
- This causes `buildSentenceKey` to return `null`
- Which triggers the fallback to atom generation

### Issue #2: `convertConfigToInsight` Doesn't Preserve `house` Property
**Location:** Line 1621-1662

**Problem:**
- `convertConfigToInsight` receives a `config` object that has `house: 10` (or other house number)
- But the returned insight object doesn't include the `house` property
- **The `house` property is NOT copied to the insight object**

**Impact:**
- In `buildSentenceKey` (line 210), it checks `direction.house`
- But `direction` is an insight object that doesn't have a `house` property!
- So `questKey` will be `null` for house-based directions
- This causes `buildSentenceKey` to return `null`
- Which triggers the fallback to atom generation

### Issue #3: Shadow Key Extraction Logic Has Redundant Checks
**Location:** Line 184-206

**Problem:**
- Lines 186-189 check for `enemy.type === 'square'` and `enemy.type === 'opposition'`
- Lines 202-205 check for the SAME conditions again (redundant)
- But more importantly, these checks will NEVER work because `enemy` doesn't have a `type` property (see Issue #1)

**Impact:**
- The shadow key extraction fails for square/opposition aspects
- Falls back to planet-based checks (Saturn, Neptune, etc.)
- But if the enemy is a square/opposition aspect, it won't match any planet checks either
- Result: `shadowKey` is `null`

### Issue #4: Quest Key Extraction Only Checks `direction.house`
**Location:** Line 208-222

**Problem:**
- Only checks `direction.house` (line 210), but insight objects don't have `house` property
- Falls back to parsing `direction.id` for house numbers or NorthNode
- But if the direction is a planet placement (not a house), the `id` might be like `"Mars_Aries"` which doesn't contain "House"

**Impact:**
- For planet-based directions (not house-based), `questKey` will be `null`
- This causes `buildSentenceKey` to return `null`
- Which triggers the fallback

### Issue #5: Identity Key Extraction May Fail for Single Planets
**Location:** Line 168-182

**Problem:**
- Checks `energy.planets` array first
- But if `energy.planets` is empty or undefined, falls back to parsing `energy.id`
- For single planets, `id` is like `"Mars_Aries"` (planet_sign format)
- The parsing logic splits on `_` and takes first 2 parts, which would give `"Mars_Aries"` instead of just `"Mars"`

**Impact:**
- For single planet energies, might generate key like `"Mars_Aries_opposition_House_10"` instead of `"Mars_opposition_House_10"`
- This won't match the validated sentences which use `"Mars_opposition_House_10"`

### Issue #6: No Debugging/Logging to See Why Lookup Fails
**Location:** Line 238-242

**Problem:**
- No console.log to show what `sentenceKey` was generated
- No console.log to show if `sentences` loaded successfully
- No console.log to show if lookup failed and why

**Impact:**
- Hard to debug why fallback is triggered
- Can't see if it's a key mismatch or a loading issue

## Summary of Fallback Triggers

The fallback will be triggered when:

1. **Enemy is a square/opposition aspect** → `enemy.type` is undefined → `shadowKey` is null → lookup fails
2. **Direction is house-based** → `direction.house` is undefined → `questKey` is null → lookup fails  
3. **Direction is planet-based (not house)** → `direction.house` is undefined → `questKey` is null → lookup fails
4. **Energy is single planet with sign in id** → Key format mismatch → lookup fails
5. **JSON file fails to load** → `sentences` is null → lookup fails
6. **Generated key doesn't exist in JSON** → `sentences[sentenceKey]` is undefined → lookup fails

## The Bad Sentence Example

"You are A BLADE overcomes RESISTANCE to BUILD A LEGACY"

This happens because:
1. Lookup fails (due to one of the issues above)
2. Falls back to atom generation (line 290)
3. Atom generation uses `getSentenceAtom` which randomly picks from arrays
4. For Mars identity, it picks "A BLADE" (one of 3 options)
5. The old atom generation code doesn't properly format the sentence
6. Missing "who" and wrong capitalization in quest verb

## Recommended Fixes (for reference, not implementing)

1. **Fix `convertConfigToInsight`** to preserve `type` and `house`:
   ```javascript
   return {
       id: config.id,
       planets: planets,
       type: config.type,  // ADD THIS
       house: config.house,  // ADD THIS
       category: category,
       score: config.power,
       title: title,
       text: text
   };
   ```

2. **Fix identity key extraction** for single planets:
   ```javascript
   } else if (energy.id) {
       const parts = energy.id.split('_');
       if (parts.length === 2 && parts[1] in SIGN_ARCHETYPES) {
           // It's planet_sign format, use just planet
           identityKey = parts[0];
       } else if (parts.length >= 2) {
           identityKey = `${parts[0]}_${parts[1]}`;
       } else {
           identityKey = parts[0];
       }
   }
   ```

3. **Add debugging** to see what's happening:
   ```javascript
   const sentenceKey = buildSentenceKey(energy, enemy, direction);
   console.log('Lookup key:', sentenceKey);
   console.log('Energy:', energy);
   console.log('Enemy:', enemy);
   console.log('Direction:', direction);
   ```


