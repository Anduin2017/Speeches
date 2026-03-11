#!/bin/bash

echo "Compiling slides.md to index.html using Pandoc..."

# Use pandoc to compile the markdown to reveal.js html, linking to the local node_modules folder inside Slides/
pandoc -t revealjs -s slides.md -o index.html \
    -V revealjs-url=node_modules/reveal.js \
    -V theme=white \
    --mathjax="node_modules/mathjax/tex-chtml.js" \
    --slide-level=2

# Inject sync.js for cross-device speaker remote
sed -i 's|</body>|<script src="sync.js"></script>\n    </body>|' index.html

echo "Compilation successful!"
