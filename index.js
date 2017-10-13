// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of index.js.
//
// @module
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Where it all begins...
 */
const dateSearch = require('./managers/DateSearch');
const Promise = require('bluebird');

Promise.resolve(dateSearch.searchDate())
    .then((results) =>
{
    console.log(results);
    return results;
});

// ---------------------------------------------------------------------------------------------------------------------