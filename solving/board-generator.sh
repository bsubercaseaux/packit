#!/usr/bin/python3
for ((i = 5; i <= 50; i++)); do
    if  [ -f results/packit-$i.txt ]; then
        python3.11 placer.py -n $i -r recs/recs-$i.txt --sol results/packit-$i.txt > boards/$i.txt
        echo "Generated board $i"
    fi
done


