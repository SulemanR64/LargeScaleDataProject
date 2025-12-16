db.cars.aggregate([
    {
      $addFields: {
        vehicleage:{$subtract: [2025, "$YearOfManufacturing"]},
        numberservices: {$size: {$ifNull: ["$ServiceHistory", []]}}
      }
    },
    {
      $match: {
        YearOfManufacturing:{$lt: 2015},
        numberservices: {$gt: 2}
      }
    },
    {
      $sort: {vehicleage: -1}
    },
    {
      $project: {
        _id: 0,
        "Car ID": "$_id",
        "Vehicle":{$concat: ["$manufacturer", " ", "$model"]},
        "Year of Manufacture": "$YearOfManufacturing",
        "Age": "$vehicleage",
        "No. Of Services Done": "$numberservices"
      }
    }
  ]);