import sys

n = int(sys.argv[1])
output = sys.argv[2]

def rectangle(area, max_dim):
    for i in range(1, max_dim+1):
        for j in range(i, max_dim+1):
            if i*j == area:
                return (i, j)


MEMO = {}
def dp(turn, target, n):
    if target == 0:
        return turn == 0
    if turn  == 0 or target < 0:
        return False 
    if (turn, target) in MEMO:
        return MEMO[(turn, target)]
    if dp(turn-1, target-turn, n):
        r = rectangle(area=turn, max_dim=n)
        if r is not None:
            MEMO[(turn, target)] = r
            return MEMO[(turn, target)]
    if dp(turn-1, target-turn-1, n):
        r = rectangle(area=turn+1, max_dim=n)
        if r is not None:
            MEMO[(turn, target)] = r
            return MEMO[(turn, target)]
    MEMO[(turn, target)] = False 
    return False


def process_sol(k, target, n):
    ans = []
    while True:
        if target == 0:
            break
        last_rec = dp(k, target, n) 
        ans.append(last_rec)
        k -= 1 
        target -= last_rec[0]*last_rec[1]
    return ans


def T(n):
    return n*(n+1)//2


def tau(n):
    k = 1
    while T(k) <= n:
        k += 1
    return k - 1


def K(n):
    return tau(n*n)


with open(output, "w") as f:
    sol = dp(K(n), n*n, n)
    if sol:
        full_sol = process_sol(K(n), n*n, n)
        for rec in full_sol:
            f.write(f"{rec[0]} {rec[1]}\n")
