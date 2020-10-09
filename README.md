# Elasticsearch for DCU Project Search

`docker-compose up` to start an ElasticSearch cluster.

`./bootstrap` to create an index for the projects on the cluster.

`npm run start` to download the required dependencies for node scripts.

`node bulk-prepare.js` to convert JSON in the dataset repo to bulk format.

`./bulk-index.sh bulk-data/2020.txt` to index "2020.txt".

`./check-cluster.sh` to check the cluster's status.

`./check-indices.sh` to check the indices of the cluster.

`./refresh.sh` to refresh the cluster indices.

Example uses:

Search:

```
curl -X GET "\$CLUSTER/projects/\_search?pretty" -H 'Content-Type: application/json' -d'
{
"query": { "multi_match": { "query": "cloud" } }
}
'
```

Single field:

```
curl -X GET "\$CLUSTER/projects/\_search?pretty" -H 'Content-Type: application/json' -d'
{
"query": { "match": { "year": "2020" } }
}
'
```

By ID:

```
curl -X GET "\$CLUSTER/projects/\_doc/20200?pretty"
```

Aggregate:

```
curl -X GET "\$CLUSTER/projects/\_search?pretty" -H 'Content-Type: application/json' -d'
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
```

Delete a document:

```
curl -X DELETE "$CLUSTER/projects/_doc/id"
```
