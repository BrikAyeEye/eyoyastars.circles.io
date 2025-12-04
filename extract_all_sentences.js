const fs = require('fs');

const data = JSON.parse(fs.readFileSync('boom_sentences_final.json', 'utf8'));

const sentences = Object.entries(data.sentences).map(([key, sentence]) => ({
    key: key,
    sentence: sentence.full
}));

// Check for issues
const issues = [];
sentences.forEach(({ key, sentence }) => {
    // Check for missing "who"
    if (!sentence.includes(' who ')) {
        issues.push({ key, sentence, issue: 'Missing "who"' });
    }
    // Check for wrong capitalization in verbs
    if (sentence.match(/to [A-Z][A-Z]+ /)) {
        issues.push({ key, sentence, issue: 'Quest verb is uppercase' });
    }
    // Check for "overcomes" without "who"
    if (sentence.match(/You are [A-Z ]+ overcomes/)) {
        issues.push({ key, sentence, issue: 'Missing "who" before verb' });
    }
});

console.log(`Total sentences: ${sentences.length}`);
console.log(`Issues found: ${issues.length}\n`);

if (issues.length > 0) {
    console.log('Issues:');
    issues.slice(0, 20).forEach(({ key, sentence, issue }) => {
        console.log(`${issue}: ${key}`);
        console.log(`  ${sentence}\n`);
    });
}

// Write all sentences to file
let output = `=== ALL BOOM SCREEN SENTENCES (${sentences.length} total) ===\n\n`;
sentences.forEach(({ key, sentence }) => {
    output += `[${key}]\n${sentence}\n\n`;
});

fs.writeFileSync('all_boom_sentences.txt', output, 'utf8');
console.log(`\nAll sentences written to all_boom_sentences.txt`);


