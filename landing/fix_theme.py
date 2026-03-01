"""Replace all blue/navy colors in Remix dark theme with black/gold."""
import re

THEME = r"E:\Essentialis\Essentialis\landing\public\remix\assets\css\themes\remix-dark_tvx1s2.css"

c = open(THEME, "r", encoding="utf-8", errors="replace").read()

# Navy/blue backgrounds → true black
REPLACEMENTS = {
    # Navy backgrounds → black
    "#222336": "#0a0a0a",
    "#2a2c3f": "#0a0a0a",
    "#333446": "#111111",
    "#1a1a3e": "#000000",
    "#1a223e": "#000000",
    "#191b29": "#000000",
    "#1b1e2e": "#000000",
    "#252640": "#0a0a0a",
    "#2c2f4a": "#111111",
    "#2d3048": "#111111",
    "#36395a": "#1a1a1a",
    "#3e4162": "#1a1a1a",
    "#41445e": "#222222",
    
    # Blue accent → gold
    "#3498db": "#d4af37",
    "#2980b9": "#b8941f",
    "#007aa6": "#d4af37",
    "#007AA6": "#d4af37",
    "#2a9fd8": "#d4af37",
    "#2A9FD8": "#d4af37",
    "#5db0d7": "#d4af37",
    "#5DB0D7": "#d4af37",
    "#1a73e8": "#d4af37",
    "#4083a9": "#c9a525",
    "#6c757d": "#888888",  # muted gray stays gray, just neutral
    
    # Lighter blue-grays → neutral grays
    "#a2a3bd": "#aaaaaa",
    "#dee2e6": "#cccccc",
    "#f8f9fa": "#e0e0e0",
}

count = 0
for old, new in REPLACEMENTS.items():
    n = c.count(old) + c.count(old.upper()) + c.count(old.lower())
    if n > 0:
        c = c.replace(old, new)
        c = c.replace(old.upper(), new)
        c = c.replace(old.lower(), new)
        count += n
        print(f"  {old} -> {new}: {n} replacements")

# Also fix editor foreground color if it's too dark
# The default dark theme might have dark text colors
# Look for the editor foreground and ensure it's light
c = c.replace("color:#000", "color:#e0e0e0")
c = c.replace("color: #000", "color: #e0e0e0")

open(THEME, "w", encoding="utf-8").write(c)
print(f"\nTotal replacements: {count}")
