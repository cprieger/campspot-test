// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of GapRules.
//
// @module
// ---------------------------------------------------------------------------------------------------------------------
const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');

/**
 * Class for checking gap rules
 */
class GapRules {
    /**
     * Valid campsite determination.
     *
     * @param gapRule {integer}
     * @param campsites {object} - A list of valid campsites
     * @param reservations {object} - a list of valid reservations --wouldn't generally do it this way
     */
    validSites(gapRule, campsites, reservations, dateToSearch) {

        /**
         * I could have done this inside the manager and there is a good argument for that. I just didn't want to include
         * moment in the manager when the only rule check on dates is happening here.
         * The plan being to encapsulate volatility at the engine level.
         */
        let startDate = moment(dateToSearch.startDate);
        let endDate = moment(dateToSearch.endDate);

        return Promise.map(campsites, (campsite) => {
            /**
             * the ID of the current campsite.
             * @type {number}
             */
            let currentCampsiteID = campsite.id;
            /**
             * Get all of the current reservations.
             * @type {[number]}
             */
            let currentReservations = _.filter(reservations, {campsiteId: currentCampsiteID});

            return {
                campsiteID: campsite.id,
                campsiteName: campsite.name,
                reservations: currentReservations
            }
        })
            .map((formattedCampsite) => {
                let reservationValidity = [];

                let conflict = false;
                let pickle = _.map(formattedCampsite.reservations, (reservation) => {

                    //Lets get our dates in the correct type
                    let reservedStartDate = moment(reservation.startDate);
                    let reservedEndDate = moment(reservation.endDate);

                    /**
                     * This piece is cool. I chose moment because it shorthands date checking. You can do the same with
                     * just plain ol javascript and math, but math is hard.
                     */
                    /**
                     * if search start date is after reservation start date and search start date is before reservation end date it is INVALID
                     * if end date is after reservation start date and search start date is before reservation start date it is valid
                     */
                    if (startDate.isAfter(reservedStartDate) && startDate.isBefore(reservedEndDate))
                    {
                        /**
                         * if conflict is ever true we want it to remain that way. Ternary is a nice clean way of doing that.
                         * @type {boolean}
                         */
                        conflict = conflict || true;
                    }
                    else if (endDate.isAfter(reservedStartDate) && startDate.isBefore(reservedStartDate))
                    {
                        conflict = conflict || true;
                    }

                    /**
                     * The only gaps that matter are the start gap and the end gap.
                     */
                    let startGap = Math.abs(startDate.diff(reservedEndDate, 'days'));
                    let endGap = Math.abs(endDate.diff(reservedStartDate, 'days'));

                    /**
                     * making some assumptions here. HOpe it checks out.
                     * @type {boolean}
                     */
                    let gapChecksOut = ((startGap >= gapRule.gapSize) || startGap === 1)
                        && ((endGap >= gapRule.gapSize) || endGap === 1);

                    /**
                     * This cool little trick is going to help us not have to go out of scope.
                     */
                    reservationValidity.push({valid: (!conflict && gapChecksOut)});

                    return reservation;
                });

                /**
                 * nom nom nom lodash nom nom nom
                 * What I mean by that is this reads exactly like it should.
                 * If every reservation is valid then we have a valid campsite.
                 *
                 * @type {boolean}
                 */
                formattedCampsite.isValid = _.every(reservationValidity, 'valid');

                /**
                 * this keeps us in bluebird land. I like bluebird as a library.
                 */
                return Promise.resolve(formattedCampsite);
            });
    }
}

module.exports = new GapRules;
// ---------------------------------------------------------------------------------------------------------------------
