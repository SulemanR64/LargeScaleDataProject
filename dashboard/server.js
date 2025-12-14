const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const Car = require ('./models/Car');
const connectionString = "mongodb://localhost:27017/CarSales?retryWrites=true";
mongoose.connect(connectionString, {
    family: 4,
    tls: false
})
.then(() => console.log("Connected"))
.catch(err => console.error("Connection error:", err));

function buildfilter(query) {
    const filter = {};
    if (query.manufacturer) filter.manufacturer = query.manufacturer;
    if (query.FuelType) filter.FuelType = query.FuelType;
    if (query.minprice || query.maxprice) {
        filter.price = {};
        if (query.minprice) filter.price.$gte = Number(query.minprice);
        if (query.maxprice) filter.price.$lte = Number(query.maxprice);
    }
    if (query.minyear || query.maxyear) {
        filter.YearOfManufacturing = {};
        if (query.minyear) filter.YearOfManufacturing.$gte = Number(query.minyear);
        if (query.maxyear) filter.YearOfManufacturing.$lte = Number(query.maxyear);
    }
    return filter;
}

app.get('api/manufacturers', async (req, res) => {
    try {
        const manufacturer = await Car.distinct('manufacturer');
        res.json(manufacturers.sort());
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get('api/fuel-types', async (req, res) => {
    try{
        const FuelTypes = await Car.distinct('FuelType');
        res.json(FuelTypes.sort());
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});
app.get('api/stats', async (req, res) => {
    try {
        const filter = buildfilter(req.query);
        const totalcars = await Car.countDocuments(filter);
        const manufacturers = await Car.distinct('manufacturer', filter);
        const FuelTypes = await Car.distinct('Fueltype', filter);
        res.json({
            totalcars,
            totalManufacturers: manufacturers.length,
            FuelTypes
        });
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

// continue tomorrow, start with easy one like avg price by manufacturer

app.get('api/price-by-manufacturer', async (req, res) => {
    try{
        const filter = buildfilter(req.query);
        const data = await Car.aggregate([
            {$match: filter},
            {$group: {
                _id: '$manufacturer',
                avgPrice: {$avg: '$price'},
                count: {$sum: 1}
            }
        },
        {$sort: {avgPrice: -1}},
        {$limit: 10}
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
app.get('/api/fuel-type-distribution', async (req, res) => {
    try {
      const filter = buildfilter(req.query);
      
      const data = await Car.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$FuelType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const PORT = 3000;
  app.listen(PORT, () => console.log('server running at http://localhost:${PORT}'));
  
