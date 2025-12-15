const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const Car = require('./models/Car');
const connectionString = "mongodb://localhost:27017/CarSales?retryWrites=true";
mongoose.connect(connectionString, {
  family: 4,
  tls: false
})
.then(() => console.log("Connected to MongoDB database"))
.catch(err => console.error(" MongoDB connection error:", err));
function buildFilter(query) {
  const filter = {}; 
  if (query.manufacturer) filter.manufacturer = query.manufacturer;
  if (query.fuelType) filter.FuelType = query.fuelType;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.minYear || query.maxYear) {
    filter.YearOfManufacturing = {};
    if (query.minYear) filter.YearOfManufacturing.$gte = Number(query.minYear);
    if (query.maxYear) filter.YearOfManufacturing.$lte = Number(query.maxYear);
  }
  return filter;
}
// API ends
app.get('/api/manufacturers', async (req, res) => {
  try {
    const manufacturers = await Car.distinct('manufacturer');
    res.json(manufacturers.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/fuel-types', async (req, res) => {
  try {
    const fuelTypes = await Car.distinct('FuelType');
    res.json(fuelTypes.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/stats', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    
    const totalCars = await Car.countDocuments(filter);
    const manufacturers = await Car.distinct('manufacturer', filter);
    const fuelTypes = await Car.distinct('FuelType', filter);
    res.json({
      totalCars,
      totalManufacturers: manufacturers.length,
      fuelTypes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// START APIS WIRH FILTERS
app.get('/api/price-by-manufacturer', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    
    const data = await Car.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$manufacturer',
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgPrice: -1 } },
      { $limit: 10 }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fuel-type-distribution', async (req, res) => {
  try {
    const filter = buildFilter(req.query);   
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

app.get('/api/feature-popularity', async (req, res) => {
  try {
    const filter = buildFilter(req.query); 
    const data = await Car.aggregate([
      { $match: filter },
      { $unwind: '$features' },
      {
        $group: {
          _id: '$features',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dealer-distribution', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    
    const data = await Car.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$dealer.DealerCity',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/service-history', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    
    const data = await Car.aggregate([
      { $match: filter },
      {
        $project: {
          serviceCount: { $size: { $ifNull: ['$ServiceHistory', []] } }
        }
      },
      {
        $group: {
          _id: '$serviceCount',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// TODO: FIX THIS CARS TAKING FOREVER TO LOAD,
app.get('/api/cars', async (req, res) => {
    try {
      const filter = buildFilter(req.query);
      const limit = parseInt(req.query.limit) || 100;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
      const totalCount = await Car.countDocuments(filter);
      const cars = await Car.find(filter)
        .skip(skip)
        .limit(limit)
        .lean();
      res.json({
        cars: cars,
        totalCount: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        carsPerPage: limit
      });
    } catch (error) {
      console.error('❌ ERROR in /api/cars:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Start server
const PORT = 3000;
app.listen(PORT, () => {
});