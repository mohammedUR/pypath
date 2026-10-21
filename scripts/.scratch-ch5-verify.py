#!/usr/bin/env python3
"""Verify every runnable snippet for SWE ch5 lessons; print exact stdout."""
import contextlib
import io
import sys

sys.stdout.reconfigure(encoding="utf-8")

SNIPPETS = {}

# ---------------- L1 ----------------
SNIPPETS["l1.predict"] = '''
story = "As a cardholder, I want to withdraw cash"
gaps = ["how is identity proven?",
        "what if the balance is low?",
        "when does the card come back?"]
print("words in story:", len(story.split()))
for g in gaps:
    print("story is silent on:", g)
'''

SNIPPETS["l1.worked"] = '''
REQUIRED_FIELDS = ("actor", "goal", "preconditions", "steps")

def validate_uc(uc):
    """Return (ok, problems) for one use-case record."""
    problems = []
    for field in REQUIRED_FIELDS:
        if not uc.get(field):
            problems.append("missing:" + field)
    for i, s in enumerate(uc.get("steps", []), 1):
        low = s.lower()
        if "cardholder" not in low and "system" not in low:
            problems.append(f"step {i}: who acts?")
    return (len(problems) == 0, problems)

good = {"actor": "Cardholder", "goal": "Withdraw cash",
        "preconditions": ["ATM in service", "card is valid"],
        "steps": ["The Cardholder inserts a card.",
                  "The system validates the PIN.",
                  "The system dispenses the cash."]}
bad = {"actor": "", "goal": "Click the withdraw button", "steps": []}

for name, uc in (("good", good), ("bad", bad)):
    ok, problems = validate_uc(uc)
    print(name, "OK" if ok else "BROKEN", problems)
'''

SNIPPETS["l1.ex1.solution"] = '''
def check_record(uc):
    """Return a list of problem strings; empty list = complete record."""
    problems = []
    if not uc.get("actor"):
        problems.append("no actor")
    if not uc.get("goal"):
        problems.append("no goal")
    if not uc.get("preconditions"):
        problems.append("no preconditions")
    steps = uc.get("steps", [])
    if len(steps) < 2:
        problems.append("too few steps")
    return problems

record = {"actor": "Cardholder", "goal": "",
          "preconditions": ["ATM in service"],
          "steps": ["The Cardholder inserts a card."]}

problems = check_record(record)
for p in problems:
    print("fix:", p)
print("problems:", len(problems))
'''

SNIPPETS["l1.ex3.trace"] = '''
uc = {"actor": "Cardholder", "goal": "Withdraw cash",
      "preconditions": ["ATM has cash"],
      "steps": ["The Cardholder enters a PIN.",
                "The system dispenses the cash."]}
print("actor:", uc["actor"])
print("goal:", uc["goal"])
print("steps:", len(uc["steps"]))
inside = uc["actor"] in ("ATM software", "database", "PIN pad")
print("actor outside the system:", not inside)
'''

SNIPPETS["l1.sandbox"] = '''
REQUIRED_FIELDS = ("actor", "goal", "preconditions", "steps")

def validate_uc(uc):
    problems = ["missing:" + f for f in REQUIRED_FIELDS if not uc.get(f)]
    return (not problems, problems)

my_uc = {"actor": "Bank Employee",
         "goal": "Reload cash cassettes",
         "preconditions": ["shift started"],
         "steps": ["The Bank Employee opens the cassette bay.",
                   "The system logs the refill."]}

ok, problems = validate_uc(my_uc)
print(my_uc["actor"], "->", my_uc["goal"], ":", "OK" if ok else problems)
'''

# ---------------- L2 ----------------
SNIPPETS["l2.predict"] = '''
basic = ["insert card", "enter PIN", "enter amount", "take cash"]
breaks = ["wrong PIN", "insufficient funds", "machine out of cash", "network lost"]
print("happy path:", len(basic), "steps")
print("ways it breaks:", len(breaks))
for b in breaks:
    print("-", b)
'''

SNIPPETS["l2.worked"] = '''
MAIN = ["insert card", "read card, prompt for PIN", "enter PIN",
        "validate PIN with bank", "enter amount", "dispense cash", "return card"]

ALTS = {
    (4, "pin wrong"): {"name": "A1 incorrect PIN",
                       "steps": ["show attempts left", "re-prompt PIN"],
                       "resume": 4},
    (5, "low balance"): {"name": "A3 insufficient funds",
                         "steps": ["show message"],
                         "resume": 5},
}

def walk(events):
    """events: {step_number: condition}; steps without an event are 'ok'."""
    events = dict(events)
    path = []
    i = 1
    guard = 0
    while i <= len(MAIN) and guard < 30:
        guard += 1
        cond = events.get(i, "ok")
        if cond != "ok" and (i, cond) in ALTS:
            alt = ALTS[(i, cond)]
            path.append(f"step{i} ALT({alt['name']})")
            for s in alt["steps"]:
                path.append(f"step{i}: {s}")
            del events[i]
            i = alt["resume"]
        else:
            path.append(f"step{i} ok")
            i += 1
    return " -> ".join(path)

print(walk({4: "pin wrong", 5: "low balance"}))
'''

SNIPPETS["l2.ex1.solution"] = '''
MAIN = ["insert card", "enter PIN", "enter amount", "dispense cash"]
ALTS = {
    (3, "no funds"): {"name": "A3 no funds",
                      "steps": ["show message"],
                      "resume": 3},
}

def walk(events):
    events = dict(events)
    path = []
    i = 1
    guard = 0
    while i <= len(MAIN) and guard < 30:
        guard += 1
        cond = events.get(i, "ok")
        if cond != "ok" and (i, cond) in ALTS:
            alt = ALTS[(i, cond)]
            path.append(f"step{i} ALT({alt['name']})")
            for s in alt["steps"]:
                path.append(f"step{i}: {s}")
            del events[i]
            i = alt["resume"]
        else:
            path.append(f"step{i} ok")
            i += 1
    return " -> ".join(path)

ALTS[(4, "machine empty")] = {"name": "A4 machine empty",
                              "steps": ["show message", "offer smaller amount"],
                              "resume": 4}
print(walk({4: "machine empty"}))
'''

SNIPPETS["l2.ex2.trace"] = '''
alts = {"A1": (4, "resume at 4"), "A2": (4, "end use case"),
        "A3": (8, "resume at 6"), "B1": ("4-8", "end use case")}
for name in sorted(alts):
    at, outcome = alts[name]
    print(name, "at step", at, "->", outcome)
'''

SNIPPETS["l2.sandbox"] = '''
MAIN = ["open app", "choose item", "pay", "confirm"]
ALTS = {}
# Try: ALTS[(2, "sold out")] = {"name": "A1 sold out",
#         "steps": ["show similar items"], "resume": 2}

def walk(events):
    events = dict(events)
    path, i, guard = [], 1, 0
    while i <= len(MAIN) and guard < 30:
        guard += 1
        cond = events.get(i, "ok")
        if cond != "ok" and (i, cond) in ALTS:
            alt = ALTS[(i, cond)]
            path.append(f"step{i} ALT({alt['name']})")
            for s in alt["steps"]:
                path.append(f"step{i}: {s}")
            del events[i]
            i = alt["resume"]
        else:
            path.append(f"step{i} ok")
            i += 1
    return " -> ".join(path)

print(walk({}))
'''

# ---------------- L3 ----------------
SNIPPETS["l3.predict"] = '''
UI_WORDS = ("button", "field", "tap", "hash", "SHA-256")
steps = [
    "The Cardholder authenticates.",
    "The Cardholder taps ENTER; the system SHA-256-hashes the digits.",
    "The Cardholder enters a PIN; the system validates it.",
]
for i, s in enumerate(steps, 1):
    hits = [w for w in UI_WORDS if w in s]
    print(f"step{i}", "ui-leaks:" + ",".join(hits) if hits else "clean-so-far")
'''

SNIPPETS["l3.worked"] = '''
VERBS = ("insert", "enter", "select", "confirm", "dispense",
         "return", "print", "read", "display", "prompt", "validate")
UI_WORDS = ("button", "click", "field", "tap", "hash")

def lint_step(step):
    words = step.split()
    problems = []
    if not words or words[0].lower() not in VERBS:
        problems.append("no-verb-start")
    leaks = [w for w in UI_WORDS if w in step.lower()]
    if leaks:
        problems.append("ui:" + ",".join(leaks))
    return problems

steps = ["Insert a bank card.",
         "Click the Withdraw button.",
         "SHA-256-hash the typed digits.",
         "Dispense the cash."]
for i, s in enumerate(steps, 1):
    verdict = lint_step(s) or ["clean"]
    print(f"step{i}:", " ".join(verdict))
print("clean:", sum(1 for s in steps if not lint_step(s)), "/", len(steps))
'''

SNIPPETS["l3.ex1.solution"] = '''
VERBS = ("insert", "enter", "select", "confirm", "dispense",
         "return", "print", "read", "display", "prompt", "validate")
UI_WORDS = ("button", "click", "field", "tap", "hash")

def lint_uc(steps):
    clean = 0
    for i, s in enumerate(steps, 1):
        problems = []
        if not s.split() or s.split()[0].lower() not in VERBS:
            problems.append("no-verb-start")
        leaks = [w for w in UI_WORDS if w in s.lower()]
        if leaks:
            problems.append("ui:" + ",".join(leaks))
        if problems:
            print(f"step{i}:", " ".join(problems))
        else:
            clean += 1
            print(f"step{i}: clean")
    print("clean:", clean, "/", len(steps))
    return clean

uc_steps = ["Insert a bank card.",
            "Tap the amount field.",
            "Dispense the cash."]
lint_uc(uc_steps)
'''

SNIPPETS["l3.ex3.trace"] = '''
notation = {"actor": "stick figure", "use case": "oval",
            "system boundary": "box", "association": "plain line"}
for key in ("actor", "use case", "system boundary", "association"):
    print(key, "=", notation[key])
'''

SNIPPETS["l3.sandbox"] = '''
VERBS = ("insert", "enter", "select", "confirm", "dispense",
         "return", "print", "read", "display", "prompt", "validate")
UI_WORDS = ("button", "click", "field", "tap", "hash")

def lint_step(step):
    problems = []
    if not step.split() or step.split()[0].lower() not in VERBS:
        problems.append("no-verb-start")
    leaks = [w for w in UI_WORDS if w in step.lower()]
    if leaks:
        problems.append("ui:" + ",".join(leaks))
    return problems

mine = ["Enter a PIN.", "Validate the PIN with the bank.", "Print a receipt."]
for i, s in enumerate(mine, 1):
    print(f"step{i}:", " ".join(lint_step(s) or ["clean"]))
'''

# ---------------- L4 ----------------
SNIPPETS["l4.predict"] = '''
withdraw_auth = "validate PIN, 3 tries max"
balance_auth = "validate PIN, 5 tries max"   # drifted copy!
print("same rule?", withdraw_auth == balance_auth)
print("cost of copies: they drift")
'''

SNIPPETS["l4.worked"] = '''
REGISTRY = {
    "Authenticate Cardholder": {"steps": ["Read card", "Validate PIN"]},
    "Check Balance": {"steps": ["Include Authenticate Cardholder", "Show balance"]},
}

def trace(name, indent=""):
    for s in REGISTRY[name]["steps"]:
        if s.startswith("Include "):
            print(indent + "-> include:", s[len("Include "):])
            trace(s[len("Include "):], indent + "  ")
        else:
            print(indent + "-", s)

trace("Check Balance")
'''

SNIPPETS["l4.ex1.solution"] = '''
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
                    if ext and ext[0] == name and ext[1] == point \\
                            and ext[2] == conditions.get(point):
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
'''

SNIPPETS["l4.ex1.starter"] = '''
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
    conditions = dict(conditions or {})
    out = []

    def walk(name, prefix):
        for i, s in enumerate(REGISTRY[name]["steps"], 1):
            tag = f"{prefix}{i}"
            # TODO 1: 'Include X' -> append f"{tag} include>{X}" then walk(X, tag + ".")
            # TODO 2: 'point:P' -> run extenders matching (name, P, conditions.get(P));
            #         append f"{tag} extend>{other}" + walk; if none ran append f"{tag} pass {P}"
            # TODO 3: otherwise append f"{tag} {s}"
            pass

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
'''

SNIPPETS["l4.ex2.trace"] = '''
base = "Withdraw Cash"
shared = "Authenticate Cardholder"
optional = "Assess Withdrawal Fee"
print("include:", base, "always performs", shared)
print("extend:", optional, "adds to", base, "only when out-of-network")
print("dependency: base names included; extender names base")
'''

SNIPPETS["l4.ex5.broken"] = '''
REGISTRY = {
    "Authenticate Cardholder": {"steps": ["Read the card", "Prompt for PIN"]},
    "Assess Withdrawal Fee": {
        "steps": ["Check the network", "Add a fee note"],
        "extends": ("Withdraw Cash", "AmountConfirmed", "out-of-network"),
    },
    "Withdraw Cash": {
        "steps": ["Include Authenticate Cardholder",
                  "point:AmountConfirmed", "Dispense cash"],
    },
}

def run(use_case, conditions=None):
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
                for other in sorted(REGISTRY):
                    ext = REGISTRY[other].get("extends")
                    if ext and ext[0] == name and ext[1] == point:
                        out.append(f"{tag} extend>{other}")
                        walk(other, tag + ".")
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
'''

SNIPPETS["l4.ex5.solution"] = '''
REGISTRY = {
    "Authenticate Cardholder": {"steps": ["Read the card", "Prompt for PIN"]},
    "Assess Withdrawal Fee": {
        "steps": ["Check the network", "Add a fee note"],
        "extends": ("Withdraw Cash", "AmountConfirmed", "out-of-network"),
    },
    "Withdraw Cash": {
        "steps": ["Include Authenticate Cardholder",
                  "point:AmountConfirmed", "Dispense cash"],
    },
}

def run(use_case, conditions=None):
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
                    if ext and ext[0] == name and ext[1] == point \\
                            and ext[2] == conditions.get(point):
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
'''

SNIPPETS["l4.sandbox"] = '''
REGISTRY = {
    "Authenticate Cardholder": {"steps": ["Read card", "Validate PIN"]},
    "Withdraw Cash": {"steps": ["Include Authenticate Cardholder",
                                "Dispense cash"]},
    "Reload Cash Cassettes": {"steps": ["Open the bay", "Refill", "Log refill"]},
}

def trace(name, indent=""):
    for s in REGISTRY[name]["steps"]:
        if s.startswith("Include "):
            print(indent + "-> include:", s[len("Include "):])
            trace(s[len("Include "):], indent + "  ")
        else:
            print(indent + "-", s)

trace("Withdraw Cash")
trace("Reload Cash Cassettes")
'''

# ---------------- run all ----------------
for key in sorted(SNIPPETS):
    buf = io.StringIO()
    print(f"##### {key} #####")
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(SNIPPETS[key], f"<{key}>", "exec"), {"__name__": "__main__"})
        out = buf.getvalue()
        if out.strip():
            print(out, end="")
        else:
            print("(no stdout)")
    except BaseException as e:
        print(f"!! RAISED {type(e).__name__}: {e}")
    print()
