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
curl -H "Content-Type: application/json" -X POST "$CLUSTER/projects/_bulk?pretty" --data-binary "@bulk-data/2020.txt"
curl -H "Content-Type: application/json" -X POST "$CLUSTER/projects/_bulk?pretty" --data-binary "@bulk-data/2019.txt"

curl -X POST "$CLUSTER/projects/_refresh?pretty"
