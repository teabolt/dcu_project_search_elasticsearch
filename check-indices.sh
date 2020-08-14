source .env

curl -X GET "$CLUSTER/_cat/indices?v"
