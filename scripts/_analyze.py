import re

h = open("C:/Users/USER/AppData/Local/Temp/rr_index.html", encoding="utf-8", errors="replace").read()

print("=== Aegis context ===")
for m in re.finditer(r"[Aa]egis", h):
    s = max(0, m.start() - 250)
    print(repr(h[s:m.end() + 250]))
    print("-" * 60)

print()
print("=== hrefs ===")
for u in sorted(set(re.findall(r'href="([^"#]+)"', h))):
    print(u)

print()
print("=== youtube embeds ===")
for u in sorted(set(re.findall(r'(?:youtube\.com/embed/[\w-]+|youtu\.be/[\w-]+)', h))):
    print(u)

print()
print("=== name counts ===")
for name in ["Zugbee", "AXIOS", "TELOS", "URRT", "UMRT", "RoboCup"]:
    print(name, h.count(name))
