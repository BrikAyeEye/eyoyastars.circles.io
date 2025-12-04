const fs = require('fs');

// Load the raw combinations
const raw = JSON.parse(fs.readFileSync('boom_combinations_raw.json', 'utf8'));

// Load core sentences for context
let coreSentences = {};
try {
    const simple = JSON.parse(fs.readFileSync('library_simple.json', 'utf8'));
    coreSentences = simple.descriptions || {};
} catch (e) {
    console.warn('Could not load library_simple.json for context');
}

// Validation and improvement function
function validateAndImprove(combo) {
    const { identity, verb1, preposition, shadow, verb2, quest, full } = combo;
    
    // Basic grammar checks
    const issues = [];
    
    // Check 1: Verb + Shadow compatibility
    const shadowLower = shadow.toLowerCase();
    const verbLower = verb1.toLowerCase();
    
    // Invalid combinations
    if (verbLower === 'overcomes' && (shadowLower.includes('fog') || shadowLower.includes('veil') || shadowLower.includes('haze'))) {
        issues.push('overcomes does not work with fog/veil/haze');
    }
    if (verbLower === 'parts' && (shadowLower.includes('conflict') || shadowLower.includes('battle'))) {
        issues.push('parts does not work with conflict/battle');
    }
    if (verbLower === 'breaks' && !preposition && !shadowLower.includes('restriction') && !shadowLower.includes('wall')) {
        issues.push('breaks needs preposition for most shadows');
    }
    
    // Check 2: Preposition usage
    if (preposition && !['through', 'against', 'past', 'beyond'].includes(preposition)) {
        issues.push('invalid preposition');
    }
    
    // Check 3: Sentence flow
    if (full.includes('  ')) {
        issues.push('double space');
    }
    if (!full.endsWith('.')) {
        issues.push('missing period');
    }
    
    // Improvement suggestions
    const improvements = {
        verb1: verb1,
        preposition: preposition,
        verb2: verb2
    };
    
    // Improve verb1 based on shadow
    if (shadowLower.includes('resistance') || shadowLower.includes('opposition') || shadowLower.includes('the divide')) {
        if (verbLower !== 'overcomes' && verbLower !== 'transcends' && verbLower !== 'bridges') {
            improvements.verb1 = 'overcomes';
        }
    } else if (shadowLower.includes('conflict') || shadowLower.includes('friction') || shadowLower.includes('the battle') || shadowLower.includes('tension')) {
        if (verbLower !== 'overcomes' && verbLower !== 'resolves' && verbLower !== 'wins') {
            improvements.verb1 = 'overcomes';
        }
    } else if (shadowLower.includes('the fog') || shadowLower.includes('the veil') || shadowLower.includes('illusion') || shadowLower.includes('the haze')) {
        if (verbLower !== 'parts' && verbLower !== 'lifts' && verbLower !== 'clears') {
            improvements.verb1 = 'parts';
        }
    } else if (shadowLower.includes('the void') || shadowLower.includes('the abyss')) {
        if (verbLower !== 'parts' && verbLower !== 'illuminates') {
            improvements.verb1 = 'parts';
        }
    } else if (shadowLower.includes('restriction') || shadowLower.includes('the wall') || shadowLower.includes('limitation') || shadowLower.includes('the cage')) {
        if (verbLower !== 'breaks' && verbLower !== 'shatters' && verbLower !== 'scales') {
            improvements.verb1 = 'breaks';
            improvements.preposition = 'through';
        }
    }
    
    // Improve verb2 based on quest
    const questLower = quest.toLowerCase();
    if (questLower.includes('legacy') || questLower.includes('impact')) {
        if (!['build', 'forge', 'architect', 'create'].includes(verb2)) {
            improvements.verb2 = 'build';
        }
    } else if (questLower.includes('joy') || questLower.includes('vision')) {
        if (!['create', 'manifest', 'birth'].includes(verb2)) {
            improvements.verb2 = 'manifest';
        }
    } else if (questLower.includes('destiny') || questLower.includes('purpose')) {
        if (!['fulfill', 'reach', 'claim'].includes(verb2)) {
            improvements.verb2 = 'fulfill';
        }
    } else if (questLower.includes('connection') || questLower.includes('meaning')) {
        if (!['forge', 'build', 'find'].includes(verb2)) {
            improvements.verb2 = 'forge';
        }
    }
    
    // Generate improved sentence
    const improvedPreposition = improvements.preposition ? improvements.preposition + ' ' : '';
    const improvedFull = `You are ${identity} who ${improvements.verb1} ${improvedPreposition}${shadow} to ${improvements.verb2} ${quest}.`;
    
    return {
        ...combo,
        issues: issues,
        improved: {
            verb1: improvements.verb1,
            preposition: improvements.preposition || '',
            verb2: improvements.verb2,
            full: improvedFull
        },
        needsReview: issues.length > 0 || 
                     improvements.verb1 !== verb1 || 
                     improvements.preposition !== preposition || 
                     improvements.verb2 !== verb2
    };
}

// Process all combinations
const validated = {};
let needsReview = 0;
let totalIssues = 0;

Object.keys(raw.combinations).forEach(key => {
    const variations = raw.combinations[key];
    
    // For now, take the first variation and validate it
    // Later we can pick the best variation
    const combo = variations[0];
    const validatedCombo = validateAndImprove(combo);
    
    if (validatedCombo.needsReview) {
        needsReview++;
        totalIssues += validatedCombo.issues.length;
    }
    
    // Store the improved version
    validated[key] = {
        identity: validatedCombo.identity,
        verb1: validatedCombo.improved.verb1,
        preposition: validatedCombo.improved.preposition,
        shadow: validatedCombo.shadow,
        verb2: validatedCombo.improved.verb2,
        quest: validatedCombo.quest,
        full: validatedCombo.improved.full,
        original: validatedCombo.full,
        issues: validatedCombo.issues
    };
});

const output = {
    total: Object.keys(validated).length,
    needsReview: needsReview,
    totalIssues: totalIssues,
    validatedAt: new Date().toISOString(),
    sentences: validated
};

fs.writeFileSync('boom_sentences_validated.json', JSON.stringify(output, null, 2));

console.log(`\nValidation complete:`);
console.log(`- Total combinations: ${output.total}`);
console.log(`- Need review: ${needsReview}`);
console.log(`- Total issues found: ${totalIssues}`);
console.log(`\nSaved to boom_sentences_validated.json`);
console.log(`\nNext step: Review and improve sentences that need work.`);


