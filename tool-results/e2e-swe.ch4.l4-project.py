stories = [
    # (id, checklist_ok, points, value 1-10)
    ("S1", True,  2, 6),   # schedule view (reference story)
    ("S2", True,  5, 9),   # booking + conflict detection
    ("S3", False, 8, 8),   # SMS reminders: no acceptance test yet
    ("S4", True,  3, 4),   # PDF export
    ("S5", True,  2, 3),   # dark mode
    ("S6", True,  8, 7),   # payment integration
]
VELOCITY = 12

ready = sorted((s for s in stories if s[1]), key=lambda s: s[3] / s[2], reverse=True)

picked, used = [], 0
for sid, ok, pts, val in ready:
    if used + pts <= VELOCITY:
        picked.append(sid)
        used += pts

blocked = sum(1 for s in stories if not s[1])
left = [sid for sid, ok, pts, val in ready if sid not in picked]

print(f"board: {len(stories)} stories, {blocked} blocked by checklist")
print("picked:", " ".join(picked), f"({used}/{VELOCITY} pts)")
print("left:", " ".join(left) or "-")