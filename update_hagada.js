import fs from 'fs';

const fetched = JSON.parse(fs.readFileSync('fetched_texts.json', 'utf8'));
let jsCode = fs.readFileSync('src/data/haggadahData.js', 'utf8');

for (const [id, newText] of Object.entries(fetched)) {
  if (!newText) continue;
  
  // Escape backticks so they don't break the JS template string
  const cleanText = newText.trim().replace(/`/g, '\\`');
  
  // Regex to match the text property belonging to this specific ID
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?text:\\s*\`)[\\s\\S]*?(\`,)`, 'm');
  
  if (regex.test(jsCode)) {
    jsCode = jsCode.replace(regex, `$1${cleanText}$2`);
    console.log(`Updated text for ${id}`);
  } else {
    console.error(`Could not find regex match for id: ${id}`);
  }
}

fs.writeFileSync('src/data/haggadahData.js', jsCode);
console.log('Successfully updated src/data/haggadahData.js with full text!');
