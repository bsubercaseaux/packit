for ((i = 5; i <= 50; i++)); do
     if ! [ -f recs/recs-$i.txt ]; then
        python3.11 recs-dp.py $i recs/recs-$i.txt
        python3.11 placer.py  -n $i -r recs/recs-$i.txt -sb
    fi
    if [ -f cnfs/packit-$i.cnf ]; then
        # mv cnfs/packit-$i.cnf cnfs/packit-$i.cnf.bak 
        # scranfilize cnfs/packit-$i.cnf.bak -f 0 -v 0 -P > cnfs/packit-$i.cnf
        if ! [ -f results/packit-$i.txt ]; then
            echo "starting packit-$i"
            kissat cnfs/packit-$i.cnf > results/packit-$i.txt
            echo "packit-$i done"
        fi
    fi
done


