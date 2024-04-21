list=$(ls /dev/tty* | grep -E 'USB|ACM|AMA')
list=$(echo $list | sed 's/ /,/g')
IFS=',' read -r -a array <<< "$list"
for element in "${array[@]}"
do
	echo $element $(udevadm info --name=$element | grep -E 'ID_VENDOR_FROM_DATABASE|ID_MODEL_FROM_DATABASE' | awk -F'=' '{print $2}')
done
