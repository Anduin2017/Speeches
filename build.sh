#!/bin/bash
python3 build_pandoc_slides.py
pandoc -t revealjs -s Slides/slides.md -o Slides/index.html -V theme=night -V revealjs-url=https://unpkg.com/reveal.js@4.5.0 --katex=https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/
echo "Compiled successfully with Pandoc & KaTeX via unpkg CDN!"
