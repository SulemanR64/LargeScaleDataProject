db.cars.aggregate([
    {$group: {_id:{manufacturer: "$manufacturer", YearOfManufacturing: "$YearOfManufacturing"}},
      AveragePrice:{$avg: "$price"}
    }
  ])