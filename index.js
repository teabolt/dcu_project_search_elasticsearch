import elasticsearch from 'elasticsearch';

import { bulkPrepare, fetchData, versionData } from './loader.js';

const PROJECT_INDEX = 'projects';

const client = new elasticsearch.Client({
    host: process.env.ES_HOST || 'localhost:9200',
    apiVersion: '7.x'
});

// Check if we can reach the cluster
client.ping({}, (err) => {
    if (err) {
        console.error(err)
    }
});

function checkCluster() {
    // Print cluster health
    client.cluster.health({}, (err, res) => {
        if (err) {
            console.error(err)
        }
        console.log(res)
    });
}

checkCluster();

// Create a project index
client.indices.create({
    index: PROJECT_INDEX
}, (err, res) => {
    if (err) {
        console.error(err)
    }
    console.log('Created: ', res)
});

// Set types for certain fields
client.indices.putMapping({
   index: PROJECT_INDEX,
   body: {
       properties: {
           students: {
               type: 'nested',
           },
       },
   },
});

// Load JSON data and prepare it for bulk indexing
const year = '2020';
const data = await fetchData(year);
const versionedData = versionData(data, year);
const bulkData = bulkPrepare(versionedData, year);
console.log(bulkData);

client.bulk({
    index: PROJECT_INDEX,
    body: bulkData,
}, (err, res) => {
    if (err) {
        console.error(err);
    }
    console.log(res);
});

await client.indices.refresh({ index: PROJECT_INDEX })

checkCluster();

client.search({
    index: PROJECT_INDEX,
    body: {
        query: {
            match_all: {},
        },
    }
}, (err, res) => {
    if (err) {
        console.error(err)
    }
    else {
        console.log(res)
        res.hits.hits.forEach((hit) => {
            console.log(hit);
        })
    }
});
