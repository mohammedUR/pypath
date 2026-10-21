RULES = [
    ("pipe-filter", ("stream",)),
    ("client-server", ("shared", "remote")),
    ("mvc", ("ui",)),
]

SCENARIOS = [
    ("S1", {"stream": True, "ui": False, "shared": False, "remote": False}),
    ("S2", {"shared": True, "remote": True, "stream": False, "ui": False}),
    ("S3", {"ui": True, "stream": False, "shared": False, "remote": False}),
]
EXPECTED = {"S1": "pipe-filter", "S2": "client-server", "S3": "mvc"}

def select(traits):
    for name, needs in RULES:
        if all(traits.get(t, False) for t in needs):
            return name
    return "layered"

hits = 0
for sid, traits in SCENARIOS:
    pick = select(traits)
    print(sid + ": " + str(pick))
    if pick == EXPECTED[sid]:
        hits += 1
print("matched: %d/%d" % (hits, len(SCENARIOS)))
