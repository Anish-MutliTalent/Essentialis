"""Extract all data-id and id values from Remix JS bundles."""
import re, glob, os

D = r"E:\Essentialis\Essentialis\landing\public\remix"
ids = set()
for f in glob.glob(os.path.join(D, "*.js")):
    if os.path.getsize(f) > 500 and not f.endswith(".map"):
        content = open(f, "r", encoding="utf-8", errors="replace").read()
        # data-id patterns
        ids.update(re.findall(r'data-id[=:]\s*["\x27]([\w\-\.]+)["\x27]', content))
        ids.update(re.findall(r'setAttribute\(["\x27]data-id["\x27],\s*["\x27]([\w\-\.]+)', content))
        # id patterns for panels, plugins, home
        ids.update(re.findall(r'\bid=["\x27]([\w\-]*(?:panel|Panel|home|Home|plugin|Plugin|pinned|Pinned|sidebar|Sidebar|icon|Icon)[\w\-]*)["\x27]', content))

print(f"Found {len(ids)} unique IDs")
kw = ["home", "ai", "remix", "copilot", "scam", "learn", "panel", "pinned",
      "tab", "icon", "vertical", "sidebar", "plugin", "main", "terminal"]
for x in sorted(ids):
    if any(k in x.lower() for k in kw):
        print(f"  {x}")
print("---ALL---")
for x in sorted(ids)[:80]:
    print(f"  {x}")
