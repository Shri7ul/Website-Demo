import re, html, os

BASE = "C:/Users/USER/AppData/Local/Temp/rr_pages"

for name in ["projects.html", "member.html", "Advisors.html"]:
    p = os.path.join(BASE, name)
    h = open(p, encoding="utf-8", errors="replace").read()
    h = re.sub(r"<script.*?</script>", "", h, flags=re.S | re.I)
    h = re.sub(r"<style.*?</style>", "", h, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", "\n", h)
    t = html.unescape(t)
    lines = [l.strip() for l in t.split("\n")]
    lines = [l for l in lines if l and len(l) > 1]
    # dedupe consecutive
    out = []
    for l in lines:
        if not out or out[-1] != l:
            out.append(l)
    print("=" * 70)
    print(name, "->", len(out), "lines")
    print("=" * 70)
    print("\n".join(out[:120]))
    print()
