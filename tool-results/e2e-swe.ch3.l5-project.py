STORIES = [
    {'key': 'ST-1', 'priority': 'Must', 'story': 'As a clerk, I want to flag a patient, so that the clinician prepares before the visit.'},
    {'key': 'ST-2', 'priority': 'Must', 'story': 'As a clerk, I want to search by phone, so that I can fix misspelled records inline.'},
    {'key': 'ST-3', 'priority': 'Should', 'story': 'As a manager, I want weekly no-show rates, so that staffing can be planned.'},
    {'key': 'ST-4', 'priority': 'Must', 'story': 'As a clinician, I want faster charts.'},
]
ABUSES = [
    {'actor': 'front-desk clerk', 'action': 'check in an arriving patient'},
    {'actor': 'impostor', 'action': 'reset another users password', 'stride': 'Spoofing'},
    {'actor': 'clinician', 'action': 'open the day visit list'},
    {'actor': 'ex-employee', 'action': 'read records with revoked rights', 'stride': 'Elevation of privilege'},
]
MISUSERS = {'impostor', 'ex-employee', 'stranger'}

def valid_story(s):
    return s.startswith('As a ') and ', I want ' in s and ', so that ' in s

def build_pack():
    pack = []
    for st in STORIES:
        ok = valid_story(st['story'])
        pack.append((st['key'], st['priority'], ok))
        print('%s %s %s' % (st['key'], st['priority'], 'valid' if ok else 'INVALID'))
    valid = sum(1 for _, _, ok in pack if ok)
    must = sum(1 for _, p, ok in pack if ok and p == 'Must')
    print('stories: %d valid: %d must: %d' % (len(STORIES), valid, must))
    n_abuse = 0
    for a in ABUSES:
        if a['actor'] in MISUSERS:
            n_abuse += 1
            print('abuse: %s/%s' % (a['actor'], a['action']))
    print('abuses: %d' % n_abuse)
    return pack

build_pack()