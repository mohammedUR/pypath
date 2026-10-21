STAGE_COST = {'requirements': 1, 'design': 5, 'code': 10, 'testing': 20, 'production': 100}

def balance(scope, time, cost, flex):
    # the responsibility gate runs first: some demands are refused, not traded
    if flex == 'crunch':
        return 'refuse: crunch hides the trade-off'
    capacity = time * cost
    if scope <= capacity:
        return 'ship as planned'
    over = scope - capacity
    if flex == 'scope':
        return 'cut scope: %d' % over
    if flex == 'time':
        return 'move date: +%d months' % (-(-over // cost))
    return 'hire: +%d devs' % (-(-over // time))

print(balance(8, 4, 2, 'scope'))
print(balance(12, 4, 2, 'time'))
print(balance(12, 4, 2, 'cost'))
print(balance(8, 4, 2, 'crunch'))
print('crunch escapes: %d units vs caught in requirements: %d' % (
    4 * STAGE_COST['production'], 4 * STAGE_COST['requirements']))