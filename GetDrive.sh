#!/bin/bash
j=`df -T |grep ^/dev*  | wc -l`
k=0
#echo $j
echo "["
df -T |grep ^/dev*  | \
while read i
do
echo "{"
Drive=`echo $i | awk '{print $7}'`
FileSystem=`echo $i | awk '{print $2}'`
FreeSpace=`echo $i | awk '{print $5}'`
TotalSpace=`echo $i | awk '{print $3}'`
UsedSpace=`echo $i | awk '{print $4}'`
Percentage=`echo $i | awk '{print $6}'`
echo "\"Drive\": \"$Drive\","
echo "\"APS\": \"True\","
echo "\"DriveType\": \"Fixed\","
echo "\"FS\": \"$FileSystem\","
echo "\"FreeSpace\": \"$FreeSpace\","
echo "\"TotalSpace\": \"$TotalSpace\","
echo "\"UsedSpace\": \"$UsedSpace\","
echo "\"Percentage\": \"$Percentage\","
echo "\"Label\": \"N/A\""
k=$((k+1))
#echo $k
if [ $k  -lt $j ]
then
echo "},"
else 
echo "}"
fi
#  echo "line: " $i
  	
done
echo "]"
