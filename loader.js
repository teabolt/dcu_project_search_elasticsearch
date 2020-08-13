import fetch from 'node-fetch';

const PROJECTS_URL = 'https://raw.githubusercontent.com/teabolt/dcu_eng_comp_projects_dataset/master/booklets_data';

/* Fetch projects data for a single year. */
export async function fetchData(year) {
    try {
        const res = await fetch(`${PROJECTS_URL}/${year}.json`);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

/* Version fetched projects data. */
export function versionData(data, year) {
    return data.map((project) => {
        return {
            ...project,
            year,
        };
    })
}

/* Transform source JSON data into ElasticSearch bulk request format. */
export function bulkPrepare(data, year) {
    const bulk = [];
    data.forEach((project, i) => {
        bulk.push({
            index: { _id: `${year}${i}` }
        }, project)
    });
    return bulk;
}
