import os
import re

directory = r'C:\Users\rojas\OneDrive\Documentos\GitHub\pedregal\Frontend\appweb\src\app'

def fix_path(match):
    path = match.group(1)
    # Add space before any letter
    path = re.sub(r'([a-zA-Z])', r' \1 ', path)
    # Collapse multiple spaces
    path = re.sub(r'\s+', ' ', path).strip()
    return f'd="{path}"'

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = re.sub(r'd="([^"]+)"', fix_path, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f"Fixed {filepath}")

print(f"Total fixed: {count}")
