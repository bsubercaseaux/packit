import argparse

parser = argparse.ArgumentParser(description='Rectangle decomposition')
parser.add_argument('-n', metavar='n', type=int, help='The given N')
# parser.add_argument('-q', metavar='q', type=int, help='The given quality value')
# parser.add_argument('-K', metavar='K', type=int, help='The given number of rectangles')
parser.add_argument('-o', metavar='o', type=str, help='The output file')

args = parser.parse_args()
N = args.n
#q = args.q
#K = args.K
output_file = args.o

def is_valid(rectangles, N):

    # Check if the rectangles sum up to N*N
    total_area = sum(x * y for x, y in rectangles)
    return total_area <= N * N
    

def backtrack(rectangles, N, i=1):
    if sum(x * y for x, y in rectangles) == N * N:
        return rectangles
    
    possible_rectangles = []
    side_ub = min(i, N)
    for a in range(1, side_ub+1):
        for b in range(a, side_ub+1):
            if a*b in [i, i+1]:
                possible_rectangles.append((a, b))
                
    possible_rectangles = list(set(possible_rectangles))
    # Try adding each possible rectangle to the set
    for new_rectangle in possible_rectangles:
            rectangles.append(new_rectangle)
            if is_valid(rectangles, N):
                result = backtrack(rectangles, N, i+1)
                if result:
                    return result
            rectangles.pop()
    return None

result = backtrack([], N)

if result:
    print(f"Rectangle-decomposition for {N}x{N}", result)
    if output_file:
        with open(output_file, 'w') as f:
            # f.write(f"{N}\n")
            for rectangle in result:
                f.write(f"{rectangle[0]} {rectangle[1]}\n")
else:
    print("No valid rectangle-decomposition found.")
