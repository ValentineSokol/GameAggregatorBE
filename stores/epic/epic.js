const adapter = require('./adapter.js');

const baseUrl = 'https://store.epicgames.com/graphql';

const searchGame = async (term) => {
    const response = await fetch(`${baseUrl}?operationName=searchStoreQuery&variables=%7B%22allowCountries%22:%22UA%22,%22category%22:%22games%2Fedition%2Fbase%7Cbundles%2Fgames%7Cgames%2Fedition%7Ceditors%7Caddons%7Cgames%2Fdemo%7Csoftware%2Fedition%2Fbase%22,%22count%22:40,%22country%22:%22UA%22,%22keywords%22:%22${term}%22,%22locale%22:%22en-US%22,%22sortBy%22:%22relevancy,viewableDate%22,%22sortDir%22:%22DESC,DESC%22,%22tag%22:%22%22,%22withPrice%22:true%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%227d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437%22%7D%7D`);
    const data = await response.json();
    return adapter(data);
}

module.exports = { searchGame };