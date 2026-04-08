const fs = require('fs');
const files = fs.readdirSync('src/content/posts');
for (const f of files.slice(0, 15)) {
  const c = fs.readFileSync('src/content/posts/' + f, 'utf8');
  const m = c.match(/title:\s*['"]?(.*?)['"]?$/m);
  if (m) console.log(f, '-', m[1]);
}