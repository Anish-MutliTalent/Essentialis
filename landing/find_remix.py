"""Find the exact pattern for the REMIX text in the navbar."""
import re, glob, os

D = r"E:\Essentialis\Essentialis\landing\public\remix"
for f in glob.glob(os.path.join(D, "*.js")):
    if os.path.getsize(f) < 500 or f.endswith(".map"):
        continue
    c = open(f, "r", encoding="utf-8", errors="replace").read()
    
    # Search broadly for REMIX near navbar/menubar/header patterns
    for m in re.finditer(r'REMIX', c):
        s = max(0, m.start()-80)
        e = min(len(c), m.end()+80)
        ctx = c[s:e].replace('\n', ' ').replace('\r', ' ')
        # Only show if it's near UI rendering patterns
        if any(k in ctx.lower() for k in ['jsx', 'render', 'menu', 'bar', 'nav', 'header', 'logo', 'brand', 'title', 'label', 'span', 'div', 'class']):
            print(f"{os.path.basename(f)}:")
            print(f"  {repr(ctx)}")
            print()
