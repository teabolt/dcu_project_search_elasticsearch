source .env

curl -X POST "$CLUSTER/projects/_refresh?pretty"
