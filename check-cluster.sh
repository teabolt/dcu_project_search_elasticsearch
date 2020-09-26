echo "Health"
curl -X GET "$CLUSTER/_cat/health?v"
echo "Nodes"
curl -X GET "$CLUSTER/_cat/nodes?v&pretty"
