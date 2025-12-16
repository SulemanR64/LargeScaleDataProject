db.cars.aggregate([
    {
      $group: {
        _id: {
          manufacturer: "$manufacturer",
          year: "$YearOfManufacturing"
        },
        avgprice: {$avg: "$price"}
      }
    },
    {
      $sort: {
        "id_manufacturer": 1, "_id.year": 1
      }
    },
    {
      $project: {
        _id:0,
        "Manufacturer": "$_id.manufacturer",
        "Year": "$_id.year",
        "Average Sale Price That Year": {
          $concat: ["£", {$toString: {$round: ["$avgprice", 2]}}]
        }
      }
    }
  ]).pretty();