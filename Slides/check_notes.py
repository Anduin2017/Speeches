import re

with open('slides.md', 'r') as f:
    lines = f.readlines()

in_notes = False
anomalies = []

for i, line in enumerate(lines):
    if '::: notes' in line:
        in_notes = True
    elif in_notes and line.strip() == ':::':
        in_notes = False
    elif in_notes and re.match(r'^#+\s', line.strip()):
        anomalies.append((i+1, line.strip()))

if anomalies:
    print("Found headers inside notes:")
    for num, txt in anomalies:
        print(f"Line {num}: {txt}")
else:
    print("No headers found inside notes!")
