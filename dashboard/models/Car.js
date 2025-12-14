const mongoose = require("mongoose")
const CarScheme = new mongoose.schema({
_id: String,
manufacturer: String,
model: String,
YearOfManufacturing: Number,
EngineSize: Number,
FuelType: String,
mileage: Number,
price: Number,
dealer: {
    DealerName: String,
    DealerCity: String,
    latitude: Number,
    longitude: Number
},
features: [String],
ServiceHistory: [{
    type: mongoose.schema.Types.Mixed
    }],
AccidentHistory: [{
    type: mongoose.schema.Types.Mixed
    }]
}, {
    collection: 'cars',
    timestamps: false,
    strict: false
});

module.exports = mongoose.model('Car', CarScheme)