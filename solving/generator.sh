for ((i = 5; i <= 50; i++)); do
    python3 recs-packit.py -n $i -o recs-$i.txt
done
