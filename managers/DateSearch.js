// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of DateSearch.
//
// @module
// ---------------------------------------------------------------------------------------------------------------------

const DateSearchRA = require('../resource-access/DateSearchRA');
const gapRules = require('../engines/GapRules');
/**
 * This class is for date searching.
 */
class DateSearch {
    /**
     * For simplicity sake i'm just goign to load the file/resources here.
     * @param loadData
     */
    constructor(){
        /**
         * read from file
         */
         this.data = DateSearchRA.getTestData();
    }

    /**
     * Can be exposed as an endpoint for searching dates.
     * @param payload
     */
    searchDate(payload){
        payload = payload || {};
        /**
         * We will use whatever is passed in or we will use the static data date search.
         */

        /**
         * Date range that was searched.
         */
        const dateToSearch = payload.dateSearchObject || this.data.search;

        /**
         * The gap rules to follow this object confuses me to no end. I'm not sure if i'm supposed to account for them
         * both or if i'm supposed to use one of them. I chose to just grab one of them if it isn't specifically passed in.
         */
        const gapRule = payload.gapRules || this.data.gapRules[1];

        /**
         * The campsites list. Pretending we are goign out and getting it in the RA.
         */
        const campsitesToSearch = payload.campsitesToSearch || this.data.campsites;

        /**
         * This one I would never do this way. But going to load the data here. Pretend it is going out and getting it.
         */
        const reservations = this.data.reservations;

        return gapRules.validSites(gapRule, campsitesToSearch, reservations, dateToSearch);
    }

}

module.exports = new DateSearch();
// ---------------------------------------------------------------------------------------------------------------------