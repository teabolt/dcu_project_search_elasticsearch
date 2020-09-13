source .env

curl "$CLUSTER/_cat/health?v"

curl -X PUT "$CLUSTER/projects/_mapping?pretty" -H 'Content-Type: application/json' -d'
{
  "properties": {
    "students": {
      "type": "nested"
    }
  }
}
'

curl -X POST "$CLUSTER/projects/_refresh?pretty"
