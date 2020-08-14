# Elasticsearch for DCU Project Search

`npm run start` to convert projects JSON to bulk data ready to be consumed by ElasticSearch.

`docker-compose up` to start an ElasticSearch cluster.

`./bootstrap` to index bulk project data on a fresh cluster.

`./check-cluster.sh` to check the cluster's status.

`./check-indices.sh` to check the indices of the cluster.

Example uses:

Search:
curl -X GET "localhost:9200/projects/\_search?pretty" -H 'Content-Type: application/json' -d'
{
"query": { "match": { "description": "cloud" } }
}
'

Aggregate:
curl -X GET "localhost:9200/projects/\_search?pretty" -H 'Content-Type: application/json' -d'
{
"size": 0,
"aggs": {
"group_by_supervisor": {
"terms": {
"field": "supervisor.keyword"
}
}
}
}
'
