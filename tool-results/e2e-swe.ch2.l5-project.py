WORK = [
    ('F1', 3, 0),
    ('F2', 2, 1),
    ('F3', 4, 0),
    ('F4', 2, 1),
    ('F5', 3, 1),
    ('F6', 2, 0),
]
WINDOW = 7
LATE_FIX = 9
EARLY_FIX = 4
ESCAPED_COST = 12
TOTAL = sum(f[1] for f in WORK)
N_DEFECTS = sum(f[2] for f in WORK)

def simulate_waterfall(work):
    found = escaped = 0
    cost = 0
    done = 0
    for fid, pts, defect in work:
        cost += pts
        done += pts
        if defect:
            if done >= TOTAL - WINDOW:
                found += 1
                cost += LATE_FIX
                print('waterfall: fix %s late for %d' % (fid, LATE_FIX))
            else:
                escaped += 1
                cost += ESCAPED_COST
                print('waterfall: %s cold at test time -> escaped' % fid)
    print('waterfall: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))
    return {'found': found, 'escaped': escaped, 'cost': cost}

def simulate_agile(work, per_iter=2):
    found = escaped = 0
    cost = 0
    for i in range(0, len(work), per_iter):
        batch = work[i:i + per_iter]
        built = 0
        for fid, pts, defect in batch:
            cost += pts
            built += pts
        for fid, pts, defect in batch:
            if defect:
                if built <= WINDOW:
                    found += 1
                    cost += EARLY_FIX
                    print('agile: fix %s inside iteration for %d' % (fid, EARLY_FIX))
                else:
                    escaped += 1
                    cost += ESCAPED_COST
    print('agile: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))
    return {'found': found, 'escaped': escaped, 'cost': cost}

wf = simulate_waterfall(WORK)
ag = simulate_agile(WORK)
print('result: same %d points, cost %d vs %d, escaped %d vs %d' % (TOTAL, wf['cost'], ag['cost'], wf['escaped'], ag['escaped']))