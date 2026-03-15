const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'speeches');
const distDir = path.join(__dirname, 'dist');
const distSpeechesDir = path.join(distDir, 'speeches');

// Create dist directories
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(distSpeechesDir)) fs.mkdirSync(distSpeechesDir, { recursive: true });

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    
    fs.readdirSync(from).forEach(element => {
        const fromElement = path.join(from, element);
        const toElement = path.join(to, element);
        if (fs.lstatSync(fromElement).isFile()) {
            fs.copyFileSync(fromElement, toElement);
        } else {
            copyFolderSync(fromElement, toElement);
        }
    });
}

// Read speeches
let speeches = [];
if (fs.existsSync(srcDir)) {
    const folders = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());
    
    for (const folder of folders) {
        const folderPath = path.join(srcDir, folder);
        const destFolder = path.join(distSpeechesDir, folder);
        
        // Ensure slides.md exists
        if (fs.existsSync(path.join(folderPath, 'slides.md'))) {
            speeches.push({
                id: folder,
                name: folder.replace(/-/g, ' ').toUpperCase(),
                bg: fs.existsSync(path.join(folderPath, 'background.jpeg')) ? `speeches/${folder}/background.jpeg` : ''
            });

            // Copy all assets over from this speech folder (including Pics) to dist
            copyFolderSync(folderPath, destFolder);
            
            // Build index.html using Pandoc
            const slidesMdPath = path.join(folderPath, 'slides.md');
            const outputPath = path.join(destFolder, 'index.html');
            
            console.log(`Compiling ${folder} using pandoc...`);
            try {
                // Compile using the exact parameters used in the old compile.sh, but adjusting paths
                // since the output is in dist/speeches/folder/
                // And node_modules will be at dist/node_modules/
                execSync(`pandoc -t revealjs -s "${slidesMdPath}" -o "${outputPath}" -V revealjs-url=../../node_modules/reveal.js -V theme=white --mathjax="../../node_modules/mathjax/tex-chtml.js" --slide-level=2`, { stdio: 'inherit' });
            } catch (err) {
                console.error(`Failed to compile ${folder}:`, err.message);
            }
        }
    }
}

// Copy dependencies for runtime
const modulesToCopy = ['reveal.js', 'mathjax'];
modulesToCopy.forEach(mod => {
    const srcMod = path.join(__dirname, 'node_modules', mod);
    const destMod = path.join(distDir, 'node_modules', mod);
    if (fs.existsSync(srcMod)) {
        copyFolderSync(srcMod, destMod);
    }
});

// Generate Home Page (Index)
const cardsHtml = speeches.map(s => `
    <a href="speeches/${s.id}/index.html" class="card">
        ${s.bg ? `<div class="card-bg" style="background-image: url('${s.bg}')"></div>` : `<div class="card-bg" style="background-color: #333"></div>`}
        <div class="card-content">
            <h2>${s.name}</h2>
        </div>
    </a>
`).join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Speeches</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #111; color: white; margin: 0; padding: 2rem; }
        h1 { text-align: center; margin-bottom: 2rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
        .card { position: relative; display: block; height: 200px; border-radius: 12px; overflow: hidden; text-decoration: none; color: white; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
        .card:hover { transform: translateY(-5px); }
        .card-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; transition: transform 0.5s; }
        .card:hover .card-bg { transform: scale(1.05); }
        .card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)); }
        .card-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; z-index: 1; }
        .card h2 { margin: 0; font-size: 1.5rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
    </style>
</head>
<body>
    <h1>My Presentations</h1>
    <div class="grid">
        ${cardsHtml || '<p style="text-align:center;grid-column:1/-1">No speeches found. Create a folder in the "speeches" directory with a slides.md file!</p>'}
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
console.log('Build complete. Files written to /dist');
