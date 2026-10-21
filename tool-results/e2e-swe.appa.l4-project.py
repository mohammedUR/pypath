REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2
VELOCITY = 9

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT < due:
        print('milestone ' + str(i) + ': ' + name + ' - upcoming')
    elif all(STATUS[rid] == 'done' for rid in needs):
        print('milestone ' + str(i) + ': ' + name + ' - ready')
    else:
        blocked = [rid for rid in needs if STATUS[rid] != 'done']
        print('milestone ' + str(i) + ': ' + name + ' - blocked (' + ' '.join(blocked) + ')')

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')
unfinished_musts = [r[0] for r in REQS if r[2] == 'Must' and STATUS[r[0]] != 'done']
print('risk: ' + str(len(unfinished_musts)) + ' Must not done')
must_total = sum(r[4] for r in REQS if r[2] == 'Must')
must_done = sum(r[4] for r in REQS if r[2] == 'Must' and STATUS[r[0]] == 'done')
print('must points: ' + str(must_done) + '/' + str(must_total) + ' done at velocity ' + str(VELOCITY) + '/sprint')