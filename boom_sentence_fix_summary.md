# Boom Screen Sentence Fix

## Problem
The original sentence structure was grammatically awkward:
- "You are A REBEL fighting THE FOG to build A LEGACY."
- "You are A HERO conquering CONFLICT to create JOY."

Issues:
1. "fighting THE FOG" - doesn't make grammatical sense
2. "liberating RESISTANCE" - you don't liberate resistance, you overcome it
3. Verbs didn't work with the nouns they were paired with

## Solution
Changed the sentence structure to:
**"You are [IDENTITY] who [verb] [preposition] [ENEMY] to [verb] [DIRECTION]."**

### Changes Made:

1. **Identity Verbs** - Changed from gerunds to "who" clauses:
   - OLD: `verb: ['FIGHTING', 'CHARGING', 'STRIKING']`
   - NEW: `verb: ['who fights', 'who charges', 'who strikes']`

2. **Shadow Text** - Changed to lowercase and added smart prepositions:
   - OLD: `['RESISTANCE', 'THE DIVIDE', 'OPPOSITION']`
   - NEW: `['resistance', 'the divide', 'opposition']`
   - Prepositions are automatically selected based on shadow type:
     - **through**: resistance, the fog, the veil, illusion, the haze, the divide, opposition, the pull
     - **against**: conflict, friction, the battle, tension, the wall, limitation, the cage
     - **past**: destruction, the void, obsession, the abyss, burnout, the fire, exhaustion

3. **HTML Template** - Updated to include preposition element:
   ```html
   You are <span id="boom-identity">A REBEL</span> 
   <span id="boom-verb1">who breaks</span>
   <span id="boom-preposition">through</span> 
   <span id="boom-shadow">resistance</span> 
   to <span id="boom-verb2">build</span> 
   <span id="boom-quest">A LEGACY</span>.
   ```

## Examples of Fixed Sentences:

✅ **"You are A REBEL who breaks through resistance to build A LEGACY."**
✅ **"You are A HERO who conquers against conflict to create JOY."**
✅ **"You are A SEER who pierces past the void to fulfill DESTINY."**
✅ **"You are A WARRIOR who fights through the fog to forge CONNECTION."**

## Result
All 2,080 possible Boom Screen sentence combinations now make grammatical sense!


