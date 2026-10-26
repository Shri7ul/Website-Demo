"""Reorganise recovered source assets into a production structure.

Originals are kept in public/assets/source/ untouched. This script produces
named copies under public/assets/<group>/ so filenames state their subject.
"""

import os
import shutil

SRC = "D:/website/Intereactive_URRT-website/public/assets/source"
OUT = "D:/website/Intereactive_URRT-website/public/assets"

MAP = {
    # brand
    "umrt_logo.png": "brand/urrt-logo.png",
    "urrt_text.png": "brand/urrt-wordmark.png",
    "aboutuslogo.png": "brand/urrt-mark-square.png",
    "uiu-logo.png": "brand/uiu-logo.png",
    "cair-logo.png": "brand/cair-logo.png",
    # robots / aegis
    "t1.jpeg": "robots/aegis/aegis-workshop-front.jpg",
    "t2.jpeg": "robots/aegis/aegis-obstacle-rear.jpg",
    "t3.jpeg": "robots/aegis/aegis-obstacle-side.jpg",
    # robots / zugbee x1
    "prototype-x1.jpeg": "robots/zugbee-x1/zugbee-x1-campus.jpg",
    "prototype-x1-1.jpeg": "robots/zugbee-x1/zugbee-x1-grass.jpg",
    "prototype-x1-2.jpeg": "robots/zugbee-x1/zugbee-x1-steps.jpg",
    "prototype-x1-3.jpeg": "robots/zugbee-x1/zugbee-x1-detail.jpg",
    # events
    "a2.png": "events/team-competition-outdoor.png",
    "a3.png": "events/team-competition-rover.png",
    "ok3.png": "events/team-competition-arrival.png",
    "ho1.jpg": "events/team-review-table.jpg",
    "ho2.jpg": "events/team-gathering-01.jpg",
    "ho3.jpg": "events/team-gathering-02.jpg",
    "ho4.jpg": "events/team-gathering-03.jpg",
    "ho5.jpg": "events/team-workshop.jpg",
    "Team.jpg": "events/team-campus-rover.jpg",
    "a1.png": "events/rover-competition-composite.png",
    # advisors
    "abul-kashem-VC-UIU.jpg": "advisors/abul-kashem-mia.jpg",
    "Dr.-Hasan-Sarwar.jpg": "advisors/hasan-sarwar.jpg",
    "abid.jpg": "advisors/abid-hossain.jpg",
    # partners
    "DFRobot-logo.png": "partners/dfrobot.png",
    "Dassauly-systemes-logo.png": "partners/dassault-systemes.png",
    "solidworks-logo.png": "partners/solidworks.png",
    "protospace-logo.png": "partners/protospace.png",
    # press
    "daily-star-logo.png": "press/the-daily-star.png",
    "Prothom_Alo_logo.svg.png": "press/prothom-alo.png",
    "the-business-standard-logo-02.png": "press/the-business-standard.png",
    "newspaper.png": "press/press-clipping.png",
    # merch
    "cap.jpeg": "resources/urrt-cap.jpg",
    "tshirt.png": "resources/urrt-tshirt.png",
}

MEMBERS = {
    "rois.jpg": "dewan-rois-bin-omar.jpg",
    "mahir.jfif": "mahir-faisal-nafis.jpg",
    "shoukhin.jpg": "ahmed-jebail-shoukhin.jpg",
    "athin.jpg": "nazmul-hasan-athin.jpg",
    "yeahyea.jpeg": "md-yeahyea-hassan-siddique.jpg",
    "mathin.jpeg": "mathin-ahmed.jpg",
    "salman.jpg": "nurer-raihan-salmaan.jpg",
    "adipta.jfif": "adipta-shaha.jpg",
    "nazmul.jpg": "nazmul-hasan-nayem.jpg",
    "usha.jpg": "jannatul-haque-usha.jpg",
    "simi.jpeg": "tanjila-akter-simi.jpg",
    "illin.jpg": "dayad-muhammad-illin.jpg",
    "ifti.jpg": "iftiaque-ahmed-auporba.jpg",
    "saad.jpg": "saad-ahmmed-tonmoy.jpg",
    "sokanto.jpeg": "sokanto-roy.jpg",
}
MAP.update({"images/" + k: "team/" + v for k, v in MEMBERS.items()})
MAP.update({k: "team/" + v for k, v in MEMBERS.items()})

moved, missing = 0, []
for src, dst in MAP.items():
    sp = os.path.join(SRC, os.path.basename(src))
    dp = os.path.join(OUT, dst)
    if not os.path.exists(sp):
        missing.append(src)
        continue
    os.makedirs(os.path.dirname(dp), exist_ok=True)
    shutil.copy2(sp, dp)
    moved += 1

print("copied:", moved)
print("missing:", missing if missing else "none")

# favicon from the official badge
badge = os.path.join(SRC, "umrt_logo.png")
if os.path.exists(badge):
    shutil.copy2(badge, "D:/website/Intereactive_URRT-website/app/icon.png")
    print("favicon: app/icon.png")
