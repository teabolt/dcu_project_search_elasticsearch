echo "Health"
curl -X GET "http://localhost:9200/_cat/health?v"
echo "Nodes"
curl -X GET "http://localhost:9200/_cat/nodes?v&pretty"
