# Pricing Tiers Exploration

## The Tiers
- **Core Chart** - $2
- **In-Depth Reading** - $10
- **Something Else** - $20

---

## Design Principles

### Keep It Seamless
- No popups that break the flow
- Pricing appears naturally when needed
- Feels like an upgrade, not a paywall

### Browser Game Feel
- Free to explore
- Pay to go deeper
- No pressure, just options

---

## Option 1: After Boom Screen (Recommended)

### Flow
```
1. Boom Screen appears (free)
2. User clicks "UNLOCK FULL READING"
3. Pricing modal appears (seamless fade)
4. User chooses tier
5. Content unlocks based on tier
```

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│   You are A REBEL who breaks...     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  UNLOCK FULL READING        │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘

[Click "UNLOCK FULL READING"]

┌─────────────────────────────────────┐
│                                     │
│   Choose Your Reading              │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  CORE CHART          $2     │   │
│   │  Your 3 core insights        │   │
│   │  ✓ Energy, Enemy, Direction │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  IN-DEPTH READING    $10    │   │
│   │  Full chart analysis         │   │
│   │  ✓ All 3 insights           │   │
│   │  ✓ House interpretations     │   │
│   │  ✓ Aspect analysis          │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  COMPLETE READING    $20    │   │
│   │  Everything + more           │   │
│   │  ✓ All above                 │   │
│   │  ✓ Transits & timing        │   │
│   │  ✓ Personalized guidance    │   │
│   └─────────────────────────────┘   │
│                                     │
│   [Continue with Core Chart - Free] │
│                                     │
└─────────────────────────────────────┘
```

### Implementation
- Modal appears after "UNLOCK FULL READING" click
- Smooth fade-in, no jarring popup
- "Continue with Core Chart - Free" option at bottom
- If they choose free, show core 3 cards
- If they pay, unlock based on tier

---

## Option 2: Progressive Unlock

### Flow
```
1. Boom Screen (free)
2. User clicks "UNLOCK FULL READING"
3. Core 3 cards unlock (free)
4. Each card has "Go Deeper" button
5. Clicking "Go Deeper" shows pricing
```

### Visual Design
```
┌─────────────────────────────────────┐
│  ENERGY                            │
│  [Hook text...]                    │
│                                     │
│  [Full text blurred...]             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  GO DEEPER                  │   │
│  │  $2 - This insight           │   │
│  │  $10 - All insights          │   │
│  │  $20 - Complete reading     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Implementation
- Core 3 cards unlock for free
- Each card has a "Go Deeper" button
- Clicking shows pricing options
- User can unlock individual or all

---

## Option 3: Subtle Upgrade Prompt

### Flow
```
1. Boom Screen (free)
2. User clicks "UNLOCK FULL READING"
3. Core 3 cards unlock (free)
4. Subtle banner at top: "Want more? $10 for full reading"
5. User can ignore or click
```

### Visual Design
```
┌─────────────────────────────────────┐
│  [Banner] Want more insights?       │
│  Get full reading for $10 →        │
└─────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ ENERGY   │ │ ENEMY    │ │ DIRECTION │
│ [Content]│ │ [Content]│ │ [Content] │
└──────────┘ └──────────┘ └──────────┘
```

### Implementation
- Core 3 cards always free
- Banner appears at top
- Non-intrusive, can be dismissed
- Clicking banner shows pricing modal

---

## Option 4: Tier Selection on Boom Screen

### Flow
```
1. Boom Screen appears
2. Instead of "UNLOCK FULL READING" button
3. Show 3 tier buttons directly
4. User chooses before seeing content
```

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│   You are A REBEL who breaks...     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  CORE CHART          $2     │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  IN-DEPTH READING    $10    │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  COMPLETE READING    $20    │   │
│   └─────────────────────────────┘   │
│                                     │
│   [View Core Chart - Free]          │
│                                     │
└─────────────────────────────────────┘
```

### Implementation
- Replace "UNLOCK FULL READING" with tier buttons
- "View Core Chart - Free" at bottom
- User chooses tier before content loads
- Content unlocks based on selection

---

## Recommended: Option 1 (After Boom Screen)

### Why?
- **Natural flow**: Boom screen → Want more → Pricing
- **No pressure**: They've already seen the hook
- **Clear value**: They know what they're getting
- **Seamless**: Modal feels like next step, not interruption

### User Journey
```
1. Enter DOB → Boom Screen
   → "This is about ME" (emotional hook)

2. Click "UNLOCK FULL READING"
   → "I want to know more" (curiosity)

3. Pricing modal appears
   → "What level do I want?" (choice)

4. Select tier
   → Content unlocks (satisfaction)

5. Explore
   → "This is mine" (ownership)
```

---

## Pricing Modal Design

### Layout
```
┌─────────────────────────────────────────┐
│                                         │
│   Choose Your Reading                  │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  CORE CHART            $2      │   │
│   │  Your 3 core insights           │   │
│   │  ✓ Energy, Enemy, Direction    │   │
│   │  ✓ Full descriptions           │   │
│   │                                 │   │
│   │  [Select]                      │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  IN-DEPTH READING      $10     │   │
│   │  Full chart analysis            │   │
│   │  ✓ All 3 insights              │   │
│   │  ✓ House interpretations       │   │
│   │  ✓ Aspect analysis            │   │
│   │  ✓ Bridge connections         │   │
│   │                                 │   │
│   │  [Select]                      │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  COMPLETE READING      $20     │   │
│   │  Everything + more               │   │
│   │  ✓ All above                    │   │
│   │  ✓ Transits & timing           │   │
│   │  ✓ Personalized guidance       │   │
│   │  ✓ Future insights             │   │
│   │                                 │   │
│   │  [Select]                      │   │
│   └─────────────────────────────────┘   │
│                                         │
│   [Continue with Core Chart - Free]    │
│                                         │
└─────────────────────────────────────────┘
```

### Styling
- Dark theme (matches site)
- Cards with subtle glow on hover
- Selected tier highlighted
- "Continue Free" link at bottom (subtle, not pushy)
- Smooth animations

---

## What Each Tier Unlocks

### Core Chart - $2
- ✓ 3 core insights (Energy, Enemy, Direction)
- ✓ Full descriptions for each
- ✓ Bridge connections
- ✓ Basic interpretations

### In-Depth Reading - $10
- ✓ Everything in Core Chart
- ✓ All 12 house interpretations
- ✓ Aspect analysis (squares, oppositions, etc.)
- ✓ Element balance
- ✓ Retrograde insights
- ✓ Angular house emphasis

### Complete Reading - $20
- ✓ Everything in In-Depth
- ✓ Current transits
- ✓ Timing insights
- ✓ Personalized guidance
- ✓ Future trend analysis
- ✓ Relationship compatibility (if applicable)

---

## Implementation Notes

### Free Tier (Core Chart)
- Always available
- 3 core insights
- Full descriptions
- No payment required

### Paid Tiers
- Payment processing (Stripe?)
- Save purchase to localStorage
- Unlock content based on tier
- Remember purchase on return

### Return Visitor
- If they paid before: Auto-unlock based on tier
- If they didn't pay: Show core chart (free)
- No re-prompting for payment

---

## Questions to Answer

1. **What's in "Something Else" ($20)?**
   - Transits?
   - Timing?
   - Future insights?
   - Personalized guidance?

2. **Payment Method?**
   - Stripe?
   - PayPal?
   - Crypto?
   - Other?

3. **Free Tier Always Available?**
   - Yes (recommended)
   - Or require payment for any content?

4. **Return Visitor Behavior?**
   - Remember purchase?
   - Auto-unlock based on tier?
   - Or show pricing again?

---

## Next Steps

1. Decide on tier content (what's in each?)
2. Design pricing modal UI
3. Implement payment processing
4. Test user flow
5. Polish animations and transitions

