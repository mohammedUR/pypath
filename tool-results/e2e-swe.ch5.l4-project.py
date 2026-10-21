REGISTRY = {
    "Authenticate Cardholder": {
        "steps": ["Read the card", "Prompt for PIN", "Validate PIN with bank"],
    },
    "Assess Withdrawal Fee": {
        "steps": ["Check the network", "Add a fee note"],
        "extends": ("Withdraw Cash", "AmountConfirmed", "out-of-network"),
    },
    "Withdraw Cash": {
        "steps": ["Include Authenticate Cardholder", "Prompt for amount",
                  "point:AmountConfirmed", "Dispense cash"],
    },
}

def run(use_case, conditions=None):
    """Trace one use case. 'Include X' splices X (always runs). 'point:P'
    runs extenders whose (base, point, condition) matches conditions[P]."""
    conditions = dict(conditions or {})
    out = []

    def walk(name, prefix):
        for i, s in enumerate(REGISTRY[name]["steps"], 1):
            tag = f"{prefix}{i}"
            if s.startswith("Include "):
                sub = s[len("Include "):]
                out.append(f"{tag} include>{sub}")
                walk(sub, tag + ".")
            elif s.startswith("point:"):
                point = s[len("point:"):]
                ran = False
                for other in sorted(REGISTRY):
                    ext = REGISTRY[other].get("extends")
                    if (ext and ext[0] == name and ext[1] == point
                            and ext[2] == conditions.get(point)):
                        out.append(f"{tag} extend>{other}")
                        walk(other, tag + ".")
                        ran = True
                if not ran:
                    out.append(f"{tag} pass {point}")
            else:
                out.append(f"{tag} {s}")

    walk(use_case, "U")
    return out

t1 = run("Withdraw Cash", {})
t2 = run("Withdraw Cash", {"AmountConfirmed": "out-of-network"})
print("== S1 ==")
for line in t1:
    print(line)
print("== S2 ==")
for line in t2:
    print(line)
print("summary:",
      "S1 lines=%d extend=%d" % (len(t1), sum("extend>" in x for x in t1)),
      "|",
      "S2 lines=%d extend=%d" % (len(t2), sum("extend>" in x for x in t2)))