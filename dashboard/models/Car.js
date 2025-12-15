const mongoose = require("mongoose")
const CarSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.Mixed
    }],
AccidentHistory: [{
    type: mongoose.Schema.Types.Mixed
    }]
}, {
    collection: 'cars',
    timestamps: false,
    strict: false
});

module.exports = mongoose.model('Car', CarSchema)