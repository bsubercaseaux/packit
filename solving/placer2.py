from eznf import modeler
import argparse

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
            Z.add_sclause(
                modeler.Implication(
                    modeler.And(Z.interval_contains(f"x_{k_1}", i), Z.interval_contains(f"x_{k_2}", i)),
                    Z.v(f"c_({k_1},{k_2})")))
                    
        for j in range(N):
            Z.add_sclause(
                modeler.Implication(
                  modeler.And(Z.interval_contains(f"y_{k_1}", j), Z.interval_contains(f"y_{k_2}", j)),
                  -Z.v(f"c_({k_1},{k_2})")))
        
## Symmetry breaking:
# the left-top corner has smallest value amongst all corners
# meaning that if its value is i, that implies the other corners don't have value [0, ... i-1].
if symmetry_breaking:
    print("Using symmetry breaking")
    for k in range(len(rectangles)):
        Z.add_clause([Z.v(f"h_{0}")])

Z.serialize(f"packit-{N}-{r}.cnf")

