curl "$CLUSTER/_cat/health?v"

curl -X PUT "$CLUSTER/projects/?pretty" -H 'Content-Type: application/json' -d'
{
  "mappings": {
      "properties": {
        "year": {
          "type": "keyword"
        },
        "students": {
          "type": "nested"
        }
      }
  }
}
'

./refresh.sh
