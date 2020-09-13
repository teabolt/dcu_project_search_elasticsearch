source .env

curl "$CLUSTER/_cat/health?v"

curl -X PUT "$CLUSTER/projects"

curl -X PUT "$CLUSTER/projects/?pretty" -H 'Content-Type: application/json' -d'
{
  "mappings": {
      "properties": {
        "students": {
          "type": "nested"
        }
      }
  }
}
'

curl -X POST "$CLUSTER/projects/_refresh?pretty"
