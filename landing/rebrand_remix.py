"""
Surgical rebranding of Remix IDE -> Essentialis Dev.
Only replaces USER-FACING display text.
Does NOT touch internal code identifiers, plugin names, or module references.
"""
import os, glob

REMIX_DIR = r"E:\Essentialis\Essentialis\landing\public\remix"

js_files = [f for f in glob.glob(os.path.join(REMIX_DIR, "*.js"))
            if os.path.getsize(f) > 500 and not f.endswith(".map")]

print(f"Processing {len(js_files)} JS files...")

REPLACEMENTS = [
    # Title / brand
    ("Remix IDE", "Essentialis Dev"),
    ("Remix - Ethereum IDE", "Essentialis Dev"),
    ("Remix - Pair programmer", "Essentialis Dev"),

    # Welcome
    ("Welcome to Remix ", "Welcome to Essentialis Dev "),
    ("welcome to Remix", "welcome to Essentialis Dev"),

    # Settings
    ("Remix Settings", "Essentialis Dev Settings"),
    ("Remix settings", "Essentialis Dev settings"),

    # Desktop
    ("Remix Desktop Release", "Desktop Release"),
    ("Download Remix Desktop Windows", "Download Essentialis Desktop"),
    ("Remix Desktop", "Essentialis Desktop"),
    ("Download Remix", "Download Essentialis"),
    ("Other versions and platforms", ""),

    # Guide
    ("Remix Guide Videos", "Dev Guide Videos"),
    ("Remix Guide", "Dev Guide"),

    # AI panel
    ("REMIXAI ASSISTANT", "ESSENTIALIS AI"),
    ("RemixAI Assistant", "Essentialis AI"),
    ("RemixAI provides you personalized guidance as you build. It can break down concepts, answer questions about blockchain technology and assist you with your smart contracts.", ""),
    ("RemixAI provides", "Essentialis AI provides"),
    ("Build with AI", ""),
    ("AI copilot", ""),
    ("AI Copilot", ""),
    ("Explain contract", ""),
    ("Create new workspace with AI", ""),

    # Support/donate
    ("Consider Supporting Remix", "Welcome to Essentialis Dev"),

    # Tagline
    ("Learn, Explore, Create", "Build. Deploy. Own."),
    ("Learn. Explore. Create.", "Build. Deploy. Own."),

    # VM display name
    ("Remix VM (", "Essentialis VM ("),

    # Plugin
    ("Remix Plugin Manager", "Plugin Manager"),

    # Did you know bar
    ("Did you know?", ""),
    ("You can learn Solidity basics and more using the Learneth plugin.", ""),

    # Scam alert footer
    ("Scam Alert", ""),

    # Display Remix in safe contexts
    (">Remix</", ">Essentialis</"),
    (">Remix<", ">Essentialis<"),
    ("Remix version", "Essentialis Dev version"),

    # v1.5.0 release notes
    ("v1.5.0 Release", "v1.5.0"),
    ("Remix v", "Essentialis Dev v"),

    # Colors - primary blues to gold
    ("#007aa6", "#b8941f"),
    ("#007AA6", "#b8941f"),
    ("#2a9fd8", "#d4af37"),
    ("#2A9FD8", "#d4af37"),
    ("#5db0d7", "#d4af37"),
    ("#5DB0D7", "#d4af37"),
    ("#4083a9", "#c9a525"),
    ("#3498db", "#d4af37"),
    ("#2980b9", "#b8941f"),
    ("#1a73e8", "#d4af37"),
]

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

print(f"\nTotal: {modified} / {len(js_files)} files modified")
