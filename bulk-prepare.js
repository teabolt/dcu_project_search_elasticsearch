import fs from "fs";
import path from "path";

import fetch from "node-fetch";

const PROJECTS_URL =
  "https://raw.githubusercontent.com/teabolt/dcu_eng_comp_projects_dataset/master/booklets_data";

const SAVE_DIR = "./bulk-data";

const YEARS = [
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
];

// Don't include projects with the following ID's
const PROJECT_BLOCKLIST = ["2017163"];

// Command line arguments
const args = process.argv.slice(2);

// Take the rest of the arguments as years to prepare.
const years = args;

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
  });
}

export function generateProjectId(year, idx) {
  return `${year}${idx}`;
}

/* Transform source JSON data into ElasticSearch bulk request format. */
export function bulkPrepare(data, year) {
  const bulk = [];
  data.forEach((project, i) => {
    const projectId = generateProjectId(year, i);
    // Don't include blocked projects
    if (!PROJECT_BLOCKLIST.some((blockedId) => blockedId === projectId)) {
      bulk.push(
        {
          index: { _id: projectId },
        },
        project
      );
    }
  });
  return bulk;
}

/* This downloads the data of the listed years and transforms it into a format
   suitable for ElasticSearch bulk requests.
*/
function loadYears(yearsForPreparation = YEARS) {
  if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR);
  }

  yearsForPreparation.forEach(async (year) => {
    const data = await fetchData(year);
    const versionedData = versionData(data, year);
    const bulkData = bulkPrepare(versionedData, year);
    const json =
      bulkData.map(JSON.stringify).reduce((prev, next) => `${prev}\n${next}`) +
      "\n";
    fs.writeFileSync(path.join(SAVE_DIR, `${year}.txt`), json);
  });
}

// Default to all years if none are specified
loadYears(years.length > 0 ? years : undefined);
