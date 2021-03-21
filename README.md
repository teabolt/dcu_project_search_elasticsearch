# Elasticsearch for DCU Project Search

ElasticSearch is a distributed document-oriented database, that provides search engine capabilities through Apache Lucene and serves queries using HTTP.

We are using ElasticSearch to index final year projects of students at Dublin City University, so that they can be easily retrieved and searched using keywords. See https://github.com/teabolt/dcu_eng_comp_projects_dataset for the data of projects (the "dataset") that is being indexed.

This repository contains a declarative ElasticSearch configuration through Docker Compose, and also helper scripts for getting data into ElasticSearch from our dataset.

## Prerequisites

* Docker
* Docker-compose
* Node.js
* npm
* Shell

## Run an ElasticSearch cluster

Run a single node development ElasticSearch cluster:

`sudo docker-compose up`

Specify the following environment variables to run in a low resource environment:
```
MIN_HEAP_SIZE=128m
MAX_HEAP_SIZE=128m
```

## Index data into ElasticSearch

Before running the scripts, set the environment variable $CLUSTER to the URL of the elasticsearch cluster.

`./check-cluster.sh` checks the health of the ElasticSearch cluster.

`./check-indices.sh` retrieves information about the indices on the ElasticSearch cluster.

`./refresh.sh` refreshes the ElasticSearch cluster indices to retrieve newest information in subsequent calls.

`./index-all.sh IS_NEW=true` sets up a new index for the projects on the cluster and indexes the entire dataset year by year into the ElasticSearch.
Omit the IS_NEW argument to skip setting up a new index on the cluster.

The subsequent scripts explain what `index-all` does:

`./bootstrap` initialises the cluster by creating an index for the projects.

`node bulk-prepare.js` downloads the JSON dataset from GitHub year by year, augments the projects with a project ID attribute, and converts each JSON file to ElasticSearch bulk indexing format at `./bulk-data`.

`node bulk-prepare.js 2020 2019`
Optionally the script takes positional arguments to process specific years only instead of all the years, i.e. 2020 and 2019.

`./bulk-index.sh bulk-data/2020.txt` takes the ElasticSearch bulk index file and indexes (inserts) it into ElasticSearch.

## Query the ElasticSearch cluster

Curl examples.

Keyword based search:

```
curl -X GET "\$CLUSTER/projects/\_search?pretty" -H 'Content-Type: application/json' -d'
{
"query": { "multi_match": { "query": "cloud" } }
}
'
```

Search based on a single field (i.e. year):

```
curl -X GET "\$CLUSTER/projects/\_search?pretty" -H 'Content-Type: application/json' -d'
{
"query": { "match": { "year": "2020" } }
}
'
```

Retrieve a project by ID:

```
curl -X GET "\$CLUSTER/projects/\_doc/20200?pretty"
```

Calculate aggregate statistics:

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

Delete a project:

```
curl -X DELETE "$CLUSTER/projects/_doc/id"
```

## Related Repositories

- Dataset of projects: https://github.com/teabolt/dcu_eng_comp_projects_dataset
- Frontend: https://github.com/teabolt/dcu_project_search_frontend
- Backend: https://github.com/teabolt/dcu_project_search_backend
- Project deployment scripts (docker compose): https://github.com/teabolt/dcu_project_search_deployment

## Credits

- Tomas Baltrunas (https://github.com/teabolt/)

## License

MIT
