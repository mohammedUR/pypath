GRAPH = {
    "app":     ["router", "auth", "notify", "logging"],
    "router":  ["auth", "models"],
    "auth":    ["notify", "models"],
    "notify":  ["auth"],
    "models":  [],
    "logging": [],
}
LIMIT = 3

def fan_out(graph, mod):
    return len(graph[mod])

def fan_in(graph, mod):
    return sum(1 for deps in graph.values() if mod in deps)

def find_cycle(graph):
    color = {m: 0 for m in graph}   # 0 white, 1 gray, 2 black
    path = []

    def walk(node):
        color[node] = 1
        path.append(node)
        for nxt in graph[node]:
            if color[nxt] == 1:
                return path[path.index(nxt):] + [nxt]
            if color[nxt] == 0:
                found = walk(nxt)
                if found:
                    return found
        path.pop()
        color[node] = 2
        return None

    for m in graph:
        if color[m] == 0:
            found = walk(m)
            if found:
                return found
    return None

edges = sum(len(deps) for deps in GRAPH.values())
print("modules: %d edges: %d" % (len(GRAPH), edges))
print("fan-in auth: %d fan-out app: %d" % (fan_in(GRAPH, "auth"), fan_out(GRAPH, "app")))
for mod in GRAPH:
    if fan_out(GRAPH, mod) > LIMIT:
        print("smell: %s fan-out %d" % (mod, fan_out(GRAPH, mod)))
cycle = find_cycle(GRAPH)
if cycle:
    print("cycle:", " -> ".join(cycle))
else:
    print("cycle: none")