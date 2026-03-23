import fs from 'fs';

const fetchJson = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.json();
};

const flatten = (arr) => arr.reduce((acc, val) => 
  Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []
);

async function main() {
  console.log('Fetching Index...');
  const index = await fetchJson('https://www.sefaria.org/api/index/Pesach_Haggadah');
  
  // Find the Pesach Haggadah root node
  const rootNode = index.nodes ? index : index.schema; // depending on API version
  
  let currentGroup = 'Kadesh';
  const groupResults = {};
  
  // Main groups mapping based on English title prefixes (Sefaria nodes often start with these)
  const groupNames = {
    'Kadesh': 'kadesh',
    'Urchatz': 'urchatz',
    'Karpas': 'karpas',
    'Yachatz': 'yachatz',
    'Magid': 'maggid',
    'Maggid': 'maggid',
    'Rachtzah': 'rachtzah',
    'Motzi Matzah': 'motzi-matzah',
    'Maror': 'maror',
    'Korech': 'korech',
    'Shulchan Orech': 'shulchan-orech',
    'Tzafun': 'tzafun',
    'Barech': 'barech',
    'Hallel': 'hallel',
    'Nirtzah': 'nirtzah'
  };

  async function walk(node, path = []) {
    const enTitle = node.title || (node.titles && node.titles.find(t => t.lang === 'en')?.text);
    
    // Check if we entered a new major group
    for (const prefix of Object.keys(groupNames)) {
      if (enTitle && enTitle.startsWith(prefix)) {
        currentGroup = groupNames[prefix];
      }
    }

    if (node.nodes) {
      for (const child of node.nodes) {
        await walk(child, [...path, enTitle]);
      }
    } else if (node.nodeType === 'JaggedArrayNode' || !node.nodes) {
      const ref = [...path, enTitle].filter(Boolean).join(', ');
      console.log(`Fetching ref: ${ref}`);
      try {
        const textData = await fetchJson(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0&pad=0`);
        const heTexts = textData.he ? flatten(textData.he) : [];
        const plainText = heTexts.map(t => t.replace(/<[^>]*>?/gm, '')).join('\n\n');
        
        if (!groupResults[currentGroup]) groupResults[currentGroup] = [];
        if (plainText.trim()) groupResults[currentGroup].push(plainText);
      } catch (e) {
        console.error(`Error on ${ref}:`, e.message);
      }
    }
  }
  
  await walk(rootNode);
  
  // Combine paragraphs for each group
  const finalResults = {};
  for (const group in groupResults) {
    finalResults[group] = groupResults[group].join('\n\n');
  }
  
  fs.writeFileSync('./fetched_texts.json', JSON.stringify(finalResults, null, 2));
  console.log('Successfully wrote full Haggadah text to fetched_texts.json');
}

main().catch(console.error);
