import os
path_exists=lambda path:os.path.exists(path)

range_of_interest = list(range(5, 51))

for i in range_of_interest:
    cnf_path = f"cnfs/packit-{i}.cnf"
    if path_exists(cnf_path):
        with open(cnf_path, 'r') as F:
            header = F.readline()
            tokens = header[:-1].split(' ')
            R = [i, tokens[2], tokens[3]]
            print(rf"{R[0]} & {R[1]} & {R[2]} & 0.0 & 0.0 \\")

