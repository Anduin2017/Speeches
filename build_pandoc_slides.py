import re
import os

with open('Notes.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's cleanly split by '##', '###', '#'
sections = re.split(r'\n(?=#{1,3} )', '\n' + text)

os.makedirs('Slides', exist_ok=True)
try:
    images = os.listdir('Slides/Pics')
except:
    images = []

image_keywords = {}
for img in images:
    name_no_ext = os.path.splitext(img)[0].lower()
    words = name_no_ext.replace('_', ' ').split()
    image_keywords[img] = words

def get_matching_image(text):
    text_lower = text.lower()
    best_match = None
    best_score = 0
    for img, words in image_keywords.items():
        score = sum(1 for w in words if len(w)>2 and w in text_lower)
        if 'hnsw' in text_lower and 'hnsw' in img.lower(): score += 10
        if '聚类' in text_lower and 'clustering' in img.lower(): score += 10
        if 'a100' in text_lower and 'a100' in img.lower(): score += 10
        if '机架' in text_lower and 'rack' in img.lower(): score += 10
        if ('显卡' in text_lower or '算力' in text_lower) and 'dgx' in img.lower(): score += 5
        if 'mcp' in text_lower and 'mcp' in img.lower(): score += 10
        if 'rag' in text_lower and 'rag' in img.lower(): score += 10
        if '向量' in text_lower and 'vector' in img.lower(): score += 10
        if '嵌入' in text_lower and 'embedding' in img.lower(): score += 10
        if '神经网络' in text_lower and 'neural' in img.lower(): score += 10
        if '模型大小' in text_lower and 'size' in img.lower(): score += 10
        if 'agent' in text_lower and 'agent' in img.lower(): score += 5
        if score > best_score:
            best_score = score
            best_match = img
    
    if best_score >= 1 or ('算力' in text_lower and best_score >= 0.5):
        if best_match:
            return best_match
    return None


md_out = """---
title: "Moog Speech AI"
author: "Moog"
theme: league
revealjs-url: "https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0"
slideNumber: true
transition: slide
---
"""

for sec in sections:
    sec = sec.strip()
    if not sec: continue
    
    # Extract header and body
    lines = sec.split('\n')
    header = lines[0]
    body = "\n".join(lines[1:]).strip()
    
    is_demo = 'demo' in header.lower()
    img_match = get_matching_image(body) if not is_demo else None

    if is_demo:
        md_out += f"\n{header} {{data-background-color='white'}}\n\n"
        md_out += "::: {.incremental}\n"
        md_out += "- <span style='color:black; font-size:1.5em; font-weight:bold;'>✨ 此处为实际操作演示环节 ✨</span>\n"
        md_out += "- <span style='color:black;'>请看大屏幕演示</span>\n"
        md_out += ":::\n\n"
        
        md_out += "::: notes\n"
        md_out += body + "\n"
        md_out += ":::\n\n"
    else:
        md_out += f"\n{header}\n\n"
        if img_match:
            md_out += f"![](Pics/{img_match})\n\n"
        
        # Turn paragraphs into incremental blocks if they are not lists
        paragraphs = [p.strip() for p in body.split('\n\n') if p.strip()]
        if paragraphs:
            md_out += "::: {.incremental}\n"
            for p in paragraphs:
                if p.startswith('-') or p.startswith('*'):
                    md_out += f"{p}\n"
                else:
                    md_out += f"- {p}\n"
            md_out += ":::\n\n"
            
            # also put the raw text in notes just in case
            md_out += "::: notes\n"
            md_out += body + "\n"
            md_out += ":::\n\n"

with open('Slides/slides.md', 'w', encoding='utf-8') as f:
    f.write(md_out)

