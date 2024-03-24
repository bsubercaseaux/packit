import argparse

parser = argparse.ArgumentParser(description='Convert match to tikz')
parser.add_argument('-f','--filename', type=str, required=True, help='The filename of the match')
parser.add_argument('-s', '--scale', type=float, default=1.0, help='The scale of the tikz picture')

args = parser.parse_args()
filename = args.filename
scale = args.scale

matrix = []
with open(filename, 'r') as f:
    for line in f:
        tokens = line[:-2].split(' ')
        matrix.append(tokens)

N = len(matrix)
#print(len(matrix))
# print(rf"\begin{{scope}}[scale={scale}]")


def int_to_letter(i):
    if i < 27:
        return chr(ord('a') - 1 + i)
    elif (i-26) < 27:
        return chr(ord('A') - 1 + (i-26))
    else:
        return int_to_letter(i//52) + int_to_letter(i-52)


print(r"\begin{figure}[h]")
print(r"\centering")
print(r"\scalebox{0.75}{")
print(r"\begin{tikzpicture}")
for i in range(N):
    #   print(f'len(matrix[{i}]) = {len(matrix[i])}')
    for j in range(N):
        if matrix[i][j] == '-':
            print(rf"\onesquareTwo{{ {(j)*scale} }}{{ {(N - i)*scale} }}{{\colG}}{{\;}}")
        else:
            let = int_to_letter(int(matrix[i][j]))
            col_id = '\col' + let
            num_id = r'\num' + let
            print(rf"\onesquareTwo{{ {(j)*scale} }}{{ {(N - i)*scale} }}{{{col_id}}}{{{num_id}}}")
print(r"\end{tikzpicture}")
print(r"}")
print(rf"\caption{{A perfect game of \packit for the ${N} \times {N}$ grid.}}")
print(rf"\label{{fig:solved-{N}}}")
print(rf"\end{{figure}}")
# print(r"\end{scope}")

