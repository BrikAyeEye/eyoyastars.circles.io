const fs = require('fs');

// Load validated sentences
const validated = JSON.parse(fs.readFileSync('boom_sentences_validated.json', 'utf8'));

// Load core sentences for context
let coreSentences = {};
try {
    const simple = JSON.parse(fs.readFileSync('library_simple.json', 'utf8'));
    coreSentences = simple.descriptions || {};
} catch (e) {
    console.warn('Could not load library_simple.json');
}

// Sample a batch for review
const keys = Object.keys(validated.sentences);
const batchSize = 50;
const batches = [];

for (let i = 0; i < keys.length; i += batchSize) {
    batches.push(keys.slice(i, i + batchSize));
}

console.log(`Total sentences: ${keys.length}`);
console.log(`Batches: ${batches.length} (${batchSize} per batch)`);
console.log(`\nFirst batch (${batches[0].length} sentences):\n`);

batches[0].forEach(key => {
    const s = validated.sentences[key];
    console.log(`${key}: ${s.full}`);
});

// Save batch info for processing
fs.writeFileSync('boom_batches_info.json', JSON.stringify({
    total: keys.length,
    batchSize: batchSize,
    totalBatches: batches.length,
    batches: batches.map((b, i) => ({ batchNum: i + 1, keys: b }))
}, null, 2));

console.log(`\nBatch info saved to boom_batches_info.json`);


