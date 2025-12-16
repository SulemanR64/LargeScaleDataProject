db.cars.aggregate([
    {
      $addFields: {
        numberofaccidents: {$size: {$ifNull: ["$AccidentHistory", [] ]}}
      }
    },
    {
      $match: {
        numberofaccidents: {$gt: 2}
      }
    },
    {
      $sort: {
        numberofaccidents: -1
      }
    },
    {
      $project: {
        _id: 0,
        "Car ID": "$_id",
        "Vehicle": {$concat: ["$manufacturer", " ", "$model"]},
        "Year": "$YearOfManufacturing",
        "Number Of Accidents": "$numberofaccidents"
      }
    }
  ]);