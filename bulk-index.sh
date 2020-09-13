source .env

BULK_FILE=$1

echo "Indexing $BULK_FILE at $CLUSTER"

curl -H "Content-Type: application/json" -X POST "$CLUSTER/projects/_bulk?pretty" --data-binary "@$BULK_FILE"
