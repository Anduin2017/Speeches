#!/bin/bash

echo "Compiling slides.md to index.html using Pandoc..."

# Use pandoc to compile the markdown to reveal.js html, linking to the local node_modules folder inside Slides/
pandoc -t revealjs -s slides.md -o index.html \
    -V revealjs-url=node_modules/reveal.js \
    -V theme=white \
    --mathjax="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS_HTML-full" \
    --slide-level=2

echo "Compilation successful!"
