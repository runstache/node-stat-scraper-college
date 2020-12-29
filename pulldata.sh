for week in 16
do
  for groupId in 80 1 151 4 5 12 18 15 17 9 8 37 81 20 40 48 32 22 24 21 25 26 27 28 31 29 30 35
  do
    echo "Pulling Week $week for GroupId $groupId"
    command="node index.js $week $groupId"  
    eval $command
  done
done