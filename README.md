# Elasticsearch for DCU Project Search

REST API with curl:
curl -X<VERB> '<PROTOCOL>://<HOST>:<PORT>/<PATH>?<QUERY_STRING>' -d '<BODY>'

List indices:
curl localhost:9200/_cat/indices

Delete an index:
curl -X DELETE localhost:9200/indexname

Search:
curl -X GET "localhost:9200/projects/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "description": "cloud" } }
}
'

Aggregate:
curl -X GET "localhost:9200/projects/_search?pretty" -H 'Content-Type: application/json' -d'
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
