from eznf import modeler
import itertools
import argparse
import matplotlib.pyplot as plt
import numpy as np
import random

parser = argparse.ArgumentParser(description='Packit placement problem')
parser.add_argument('-n', type=int, help='The given N')
parser.add_argument('-r', metavar='r', type=str, help='A rectangle decomposition file')
parser.add_argument('-sb', '--symmetry-breaking', action='store_true', help='Whether to use symmetry breaking')
parser.add_argument('-c', '--cnc', action='store_true', help='Whether to do CnC')
parser.add_argument('--sol', metavar='sol', type=str, help='A solution file')

args = parser.parse_args()
N = args.n
r = args.r
cnc = args.cnc
symmetry_breaking = args.symmetry_breaking
sol_file = args.sol
Z = modeler.Modeler()

rectangles = []
with open(r, 'r') as file:
    for line in file:
        line = line.strip()
        if line:
            x, y = line.split()
            rectangles.append((int(x), int(y)))
            
        
# Encoding
for k, size in enumerate(rectangles):
    Z.add_var(f"h_{k}", f"the {k}-th rec appears horizontally")
    Z.add_svar(f"x_{k}", "ORDER_INTERVAL", description=f"horizontal interval of the {k}-th rec", interval=(0, N), active_length=(f"h_{k}", size[0], size[1]))
    Z.add_svar(f"y_{k}", "ORDER_INTERVAL", description=f"vertical interval of the {k}-th rec", interval=(0, N), active_length=(f"h_{k}", size[1], size[0]))
## No overlaps :)
for k_1, s1, in enumerate(rectangles):
    for k_2, s2 in enumerate(rectangles[k_1+1:], start=k_1+1):
        Z.add_var(f"c_({k_1},{k_2})", f"captures relationship between the {k_1}-th and {k_2}-th almost squares")
        
        for i in range(N):
            Z.add_sclause(f"x_{k_1}[{i}] and x_{k_2}[{i}] => c_({k_1},{k_2})")
                    
        for j in range(N):
            Z.add_sclause(f"y_{k_1}[{j}] and y_{k_2}[{j}] => -c_({k_1},{k_2})")
        
## Symmetry breaking:
# the left-top corner has smallest value amongst all corners
# meaning that if its value is i, that implies the other corners don't have value [0, ... i-1].
if symmetry_breaking:
    print("Using symmetry breaking")
    #for k in range(len(rectangles)):
    if len(rectangles) > 0:
        Z.add_clause([Z.v(f"h_{len(rectangles)-1}")])
       #Z.add_clause([Z.v(f"h_{0}")])
    # have rectangle 1 in the top-left quadrant
    if len(rectangles) > 5:
        for i in range(N//2, N):
            Z.add_sclause(modeler.Not(Z.interval_contains(f"x_0", i)))
            Z.add_sclause(modeler.Not(Z.interval_contains(f"y_0", i)))
        #    Z.add_sclause(modeler.Not(Z.interval_contains(f"y_0", i)))
        # Z.add_sclause(modeler.Not(Z.interval_contains(f"y_1", i)))
        

if Z.n_clauses() > 0:
    Z.serialize(f"cnfs/packit-{N}.cnf")

if cnc:
    def cubing(n_vars):
        cubes = []
    
        total_variables = [Z.v(f"c_({k_1},{k_2})") for k_1 in range(n_vars) for k_2 in range(k_1+1, n_vars)]
        variables = random.sample(total_variables, n_vars)
        for valuation in itertools.product([0, 1], repeat=n_vars):
            cubes.append([v if b else -v for v, b in zip(variables, valuation)])
        
        # for combination in itertools.combinations(range(num_rectangles), num_positions):
        #     for perm in itertools.permutations(combination):
        #         conjuncts = []
        #         for idx, pos_idx in zip(perm, range(num_positions)):
        #             x, y = positions[pos_idx]
        #             conjuncts.append(modeler.And(Z.interval_contains(f"x_{idx}", x), Z.interval_contains(f"y_{idx}", y)))
                
        #         cube = conjuncts[0]
        #         for conjunct in conjuncts[1:]:
        #             cube = modeler.And(cube, conjunct)
        #         cubes.append(cube.to_clauses())
        
        return cubes
        
    Z.cube_and_conquer(lambda: cubing(15))

def plot_colored_grid(data, grid=True, labels=False, frame=True):
    """Plot 2d matrix with grid with well-defined colors for specific boundary values.
    
    :param data: 2d matrix
    :param bounds: bounds between which the respective color will be plotted
    :param grid: whether grid should be plotted
    :param labels: whether labels should be plotted
    :param frame: whether frame should be plotted
    """
    
    flattened = [item for sublist in data for item in sublist]
    N_colors = len(set(flattened))
    # create discrete colormap with N_colors 
    cmap = plt.colormaps.get_cmap('Dark2')
    # norm = plt.colors.BoundaryNorm(bounds, cmap.N)
    
    # enable or disable frame
    plt.figure(frameon=frame)
    
    # show grid
    if grid:
        plt.grid(axis='both', color='k', linewidth=2) 
        plt.xticks(np.arange(0.5, len(data), 1))  # correct grid sizes
        plt.yticks(np.arange(0.5, len(data), 1))
    
    # add text labels
    if labels:
        for i in range(len(data)):
            for j in range(len(data)):
                plt.text(j, i, data[i][j], ha="center", va="center", color="k", size="small")
    
    # remove ticks and ax labels
    plt.tick_params(bottom=False, top=False, left=False, right=False, labelbottom=False, labelleft=False)
    modular_data = [[(8*x*x + 1) % 127 for x in row] for row in data]
    # plot data matrix
    plt.imshow(modular_data, cmap=cmap)
    plt.show()

# Decoding
def to_grid(sem_valuation):
    grid = [[0 for _ in range(N)] for _ in range(N)]
    for k, s in enumerate(rectangles):
        x = sem_valuation[f"x_{k}"]
        y = sem_valuation[f"y_{k}"]
        for i in x.active_range:
            for j in y.active_range:
                grid[j][i] = k + 1
                
    
    # draw the grid
    # plot_colored_grid(grid, labels=True)
    def map_val(val):
        if val > 0:
            return str(val)
        else:
            return '-'
    def map_vals(row):
        return list(map(map_val, row))
    grid_str = "\n".join([" ".join(map(map_val, row)) + " " for row in grid])
    # print(grid_str)
    return grid_str
        

if sol_file is not None:
    print(Z.decode_from_sol(sol_file, to_grid))
