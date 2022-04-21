const openGeocoder = require('node-open-geocoder')

let exported = {
    description: "Contains method for geocoding and address validation",
    validate: async (address, callbackFns) => {
        await openGeocoder()
            .geocode(address)
            .end((err, res) => {
                callbackFns(res[0]);
            });
    },

};

module.exports = exported;