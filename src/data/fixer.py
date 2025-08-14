import os
import re
import json

# Folder to scan
FOLDER = "./chemistry-mcq"

# Regex to find unescaped LaTeX macros like \frac, \sqrt, \times (but not \\frac etc.)
latex_macro_pattern = re.compile(r'(?<!\\)\\([a-zA-Z]+)')

# Count stats
fixed_file_count = 0
fixed_macro_count = 0

def escape_latex_macros(text):
    """Escape all LaTeX macros like \frac -> \\frac safely."""
    return latex_macro_pattern.sub(r'\\\\\1', text)

# Process all JSON files in the folder
for filename in os.listdir(FOLDER):
    if filename.endswith(".json"):
        filepath = os.path.join(FOLDER, filename)

        with open(filepath, 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)
            except json.JSONDecodeError:
                print(f"❌ JSON error in: {filename}")
                continue

        # Serialize and escape macros
        original_str = json.dumps(data, ensure_ascii=False)
        fixed_str = escape_latex_macros(original_str)

        # If changes occurred, re-parse and pretty-write it
        if original_str != fixed_str:
            fixed_data = json.loads(fixed_str)
            with open(filepath, 'w', encoding='utf-8') as file:
                json.dump(fixed_data, file, ensure_ascii=False, indent=2)
            fixed_file_count += 1
            fixed_macro_count += len(latex_macro_pattern.findall(original_str))
            print(f"✅ Fixed: {filename}")

print(f"\n🎯 Done! Fixed {fixed_macro_count} macros in {fixed_file_count} file(s).")
