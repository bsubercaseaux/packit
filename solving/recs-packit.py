import localsolver
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-t', '--time', type=int, default=10) 
parser.add_argument('-n', type=int, required=True)
parser.add_argument('-o', type=str)
args = parser.parse_args()
time_limit = args.time
output_file = args.o
N = args.n

with localsolver.LocalSolver() as ls:
    #
    # Declare the optimization model
    #
    m = ls.model
    decompositions = {}
    for i in range(1, N+1):
        for j in range(i, N+1):
            rec = (i, j)
            area = i*j
            if (area-1) not in decompositions and area != 1:
                decompositions[area-1] = []
            if area not in decompositions:
                decompositions[area] = []

            if area != 1: decompositions[area-1].append(rec)
            decompositions[area].append(rec)
            decompositions[area] = list(set(decompositions[area]))
            

    areas = {}
    variables = {}
    for turn in decompositions.keys():
        variables[turn] = []
        areas[turn] = []
        for rec in decompositions[turn]:
            variables[turn].append(m.bool())
            areas[turn].append(rec[0]*rec[1])

    m.constraint(m.sum(v for v in variables[1]) == 1)
    
    turns = list(decompositions.keys())
    for turn in turns[:1]:
        m.constraint(m.sum(v for v in variables[turn]) <= 1)
        
    for id, turn in enumerate(turns):
        if id < len(turns)-1:
            m.constraint(m.sum(v for v in variables[turn]) >= m.sum(v for v in variables[turns[id+1]]))
        else:
            m.constraint(m.sum(v for v in variables[turn]) <= m.sum(v for v in variables[turns[id-1]]))

    
    area_sum = m.sum(areas[turn][i]*variables[turn][i] for turn in turns for i in range(len(variables[turn])) )
    m.constraint(area_sum == N*N)
    
    m.minimize(areas[1][0]*variables[1][0])
    m.close()
    
    ls.param.time_limit = time_limit
    ls.solve()
    answer  = []
    print(area_sum.value)
        
    # recomputed_area_sum = 0

    for turn in variables.keys():
        for i, var in enumerate(variables[turn]):
            if var.value == 1:
                
                print(f"turn {turn}", decompositions[turn][i], f" has area {areas[turn][i]}")
                answer.append(decompositions[turn][i])
            

    output_file_name = f"packit-{N}.txt"
    
    if output_file is not None:
        output_file_name = output_file
    
    with open(output_file_name, 'w') as ofile:
        if localsolver.LSSolutionStatus[0] == localsolver.LSSolutionStatus.INCONSISTENT:
            ofile.write('NO SOLUTION\n')
        else:
            for rec in answer:
                ofile.write(f"{rec[0]} {rec[1]}\n")
