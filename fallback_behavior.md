# What Happens When No Validated Sentence is Found

## The Fallback Flow

### Step 1: Lookup Attempt (Line 238-242)
```javascript
const sentences = await loadValidatedSentences();
const sentenceKey = buildSentenceKey(energy, enemy, direction);

if (sentences && sentenceKey && sentences[sentenceKey]) {
    // Use validated sentence ✅
    return;
}
```

**This fails when:**
- `sentences` is `null` (JSON file didn't load)
- `sentenceKey` is `null` (couldn't build the key)
- `sentences[sentenceKey]` is `undefined` (key doesn't exist in JSON)

### Step 2: Fallback to Atom Generation (Line 290+)
If lookup fails, it falls back to the **old atom-based generation system**:

```javascript
// Fallback to atom-based generation
const identityObj = getSentenceAtom(energy, 'IDENTITY') || { text: 'A FORCE', verb: 'who fights' };
const shadowText = getSentenceAtom(enemy, 'SHADOW') || 'RESISTANCE';
const questObj = getSentenceAtom(direction, 'QUEST') || { verb: 'BUILD', text: 'A LEGACY' };
```

### Step 3: Dynamic Sentence Construction (Line 295-378)
The fallback system:
1. Gets random atoms from IDENTITY_MAP, SHADOW_MAP, QUEST_MAP
2. Uses `getPrepositionAndVerb` to determine verbs
3. Constructs the sentence piece by piece
4. Populates the HTML elements

## Problems with the Fallback

### Issue 1: Random Selection
- `getSentenceAtom` randomly picks from arrays
- For Mars identity: could pick "A HERO", "A FIGHTER", or "A BLADE" randomly
- This creates inconsistency

### Issue 2: Verb Extraction Bug
- Line 359: `identityVerbBase = identityObj.verb.replace('who ', '')`
- If `identityObj.verb` is `'who fights'`, it becomes `'fights'`
- But if the verb doesn't have "who " prefix, it might not work correctly

### Issue 3: Quest Verb Capitalization
- Line 377: `document.getElementById('boom-verb2').textContent = questObj.verb;`
- `questObj.verb` comes from `getSentenceAtom` which might return uppercase
- But the validated sentences use lowercase verbs

### Issue 4: Missing "who" in Sentence Structure
- The fallback constructs: `"You are [IDENTITY] [verb] [preposition] [SHADOW] to [verb] [QUEST]"`
- But if `identityObj.verb` is already `'who fights'`, extracting just `'fights'` loses the "who"
- This can create: "You are A BLADE overcomes RESISTANCE to BUILD A LEGACY" (missing "who")

## When Fallback is Triggered

1. **JSON file fails to load** → `sentences` is `null`
2. **Key can't be built** → `sentenceKey` is `null` (missing type/house - now fixed!)
3. **Key doesn't exist** → `sentences[sentenceKey]` is `undefined`
   - This happens for combinations not in the 2,080 validated sentences
   - Example: A rare combination like `"Jupiter_Uranus_Pluto_House_11"` might not exist

## Current Status

✅ **Fixed:** Missing `type` and `house` properties (now preserved)
⚠️ **Remaining:** Fallback still has bugs that can produce bad sentences

## Recommendations

1. **Add logging** to see when/why fallback is triggered:
   ```javascript
   if (!sentences || !sentenceKey || !sentences[sentenceKey]) {
       console.warn('Falling back to atom generation:', {
           sentences: !!sentences,
           sentenceKey: sentenceKey,
           exists: sentences && sentences[sentenceKey] ? 'yes' : 'no'
       });
   }
   ```

2. **Fix fallback verb extraction** to ensure "who" is always included

3. **Ensure quest verbs are lowercase** in the fallback

4. **Consider generating missing sentences** for combinations that don't exist yet


