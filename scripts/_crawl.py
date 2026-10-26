import re, os, json

BASE = "C:/Users/USER/AppData/Local/Temp/rr_pages"
assets = {}
for f in sorted(os.listdir(BASE)):
    if not f.endswith(".html"):
        continue
    h = open(os.path.join(BASE, f), encoding="utf-8", errors="replace").read()
    urls = re.findall(r'(?:src|href)="([^"]+\.(?:png|jpg|jpeg|webp|svg|gif|mp4|ico|glb|gltf))"', h, re.I)
    for u in urls:
        if u.startswith("http"):
            continue
        assets.setdefault(u, set()).add(f)
    # also alt attributes paired with images
    for m in re.finditer(r'<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"', h, re.I):
        print("%-40s alt=%r  [%s]" % (m.group(1), m.group(2), f))

print()
print("=== unique local assets across all pages ===")
for u in sorted(assets):
    print("%-44s %s" % (u, ",".join(sorted(assets[u]))))
print()
print("TOTAL", len(assets))
