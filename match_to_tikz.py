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
# print(rf"\begin{{scope}}[scale={scale}]")
for i in range(N):
    for j in range(N):
        if matrix[i][j] == '-':
            print(rf"\onesquare{{ {(j)*scale} }}{{ {(N - i)*scale} }}{{\colG}}{{\;}}")
        else:
            let = chr(ord('a') -1 + int(matrix[i][j]))
            col_id = '\col' + let
            num_id = r'\num' + let
            print(rf"\onesquare{{ {(j)*scale} }}{{ {(N - i)*scale} }}{{{col_id}}}{{{num_id}}}")
# print(r"\end{scope}")

