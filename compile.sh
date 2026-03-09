#!/bin/bash

echo "Compiling slides.md to index.html using Pandoc..."

# Use pandoc to compile the markdown to reveal.js html
pandoc -t revealjs -s Slides/slides.md -o Slides/index.html \
    -V revealjs-url=https://unpkg.com/reveal.js/@5.1.0/ \
    -V theme=white \
    --mathjax \
    --slide-level=2

echo "Compilation successful!"
