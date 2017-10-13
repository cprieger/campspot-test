// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of ReadFromFile.
//
// @module
// ---------------------------------------------------------------------------------------------------------------------

const fileData = require('../test-data/mock-data.json');

class DateSearchRA {
    constructor()
    {
    }

    /**
     * Get the data from our resource in this case a file.
     */
    getTestData() {
        return fileData;
    }
}

module.exports = new DateSearchRA();
// ---------------------------------------------------------------------------------------------------------------------