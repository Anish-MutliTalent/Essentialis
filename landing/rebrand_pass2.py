"""
Pass 2: Fix remaining Remix branding that the first rebrand missed.
Targets only safe quoted-string replacements.
"""
import os, glob, re

REMIX_DIR = r"E:\Essentialis\Essentialis\landing\public\remix"

# All JS files
js_files = [f for f in glob.glob(os.path.join(REMIX_DIR, "*.js"))
            if os.path.getsize(f) > 500 and not f.endswith(".map")]

# Additional targeted replacements — patterns found still in the bundles
REPLACEMENTS = [
    # Top bar — the app name displayed as standalone "REMIX" in the navbar
    # These appear as quoted strings in JSX/template code
    ('"REMIX"', '"ESSENTIALIS"'),
    ("'REMIX'", "'ESSENTIALIS'"),
    
    # README content template (the default workspace README)
    ("REMIX IDE", "ESSENTIALIS DEV"),
    ("Remix Project: https://remix-project.org", "Essentialis Dev"),
    ("remix-ide.readthedocs.io", "docs.essentialis.io"),
    ("github.com/ethereum/remix-project", "essentialis.io"),
    ("https://medium.com/remix-ide", "https://essentialis.io"),
    ("https://discord.gg/", ""),
    ("remix.ethereum.org", "essentialis.io"),
    ("Official website about the Remix Project", "Official website"),
    ("Official documentation", "Documentation"),
    
    # Scam alert text
    ("The only URL Remix uses is remixethereum.org", ""),
    ("Beware of online videos promoting", ""),
    ("liquidity front runner bots", ""),
    ("Additional safety tips", ""),
    ("ScamAlert", ""),
    ("scamAlert", ""),
    
    # Bottom status bar
    ("remix as git repo", "git repo"),
    ("remixd", "local"),
    
    # Remaining "Remix " with trailing space (safe — only in display contexts)
    ("Remix Project", "Essentialis Dev"),
    ("remix-project", "essentialis-dev"),
    ("Remix workspace", "Essentialis workspace"),
    
    # Terminal welcome
    ("Welcome to Remix ", "Welcome to Essentialis Dev "),
    
    # Keyboard shortcuts text — "Remix" standalone
    ("Remix Project", "Essentialis Dev"),
]

print(f"Processing {len(js_files)} JS files...")
modified = 0
for fpath in js_files:
    with open(fpath, "r", encoding="utf-8", errors="replace") as fp:
        content = fp.read()
    original = content
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)
    if content != original:
        with open(fpath, "w", encoding="utf-8") as fp:
            fp.write(content)
        modified += 1
        print(f"  Modified: {os.path.basename(fpath)}")

# Also fix the default workspace README.txt template in common bundle
common = os.path.join(REMIX_DIR, "common.0.71.0.1757439800232.js")
if os.path.exists(common):
    with open(common, "r", encoding="utf-8", errors="replace") as fp:
        content = fp.read()
    original = content
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)
    if content != original:
        with open(common, "w", encoding="utf-8") as fp:
            fp.write(content)
        modified += 1
        print(f"  Modified: common bundle")

print(f"\nTotal: {modified} files modified")

# Verify: search for remaining "REMIX" in display contexts
print("\nRemaining 'REMIX' occurrences:")
for fpath in js_files + ([common] if os.path.exists(common) else []):
    with open(fpath, "r", encoding="utf-8", errors="replace") as fp:
        content = fp.read()
    for m in re.finditer(r'["\x27]REMIX["\x27]', content):
        s = max(0, m.start()-30)
        e = min(len(content), m.end()+30)
        print(f"  {os.path.basename(fpath)}: {repr(content[s:e])}")
