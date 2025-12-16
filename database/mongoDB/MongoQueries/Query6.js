db.cars.aggregate([
    {
      $addFields: {
        enginesize:{
          $switch: {
            branches: [
              {
                case: {$lt: ["$EngineSize", 1.5]},
                then: "Small (<1.5L)"
              },
              {
                case: {
                  and: [
                    {$gte: ["$EngineSize", 1.5]},
                    {$lte: ["$EngineSize", 2.5]}
                  ]
                },
                then: "Medium (1.5-2.5L)"
              },
              {
                case: {$gte: ["$EngineSize", 2.5]},
                then: "Large ( >2.5L)"
              }
            ]
          }
        }
      }
    },
    {
      $group: {
        _id: {
          fuelType: "$FuelType",
          category: "$enginesize"
        },
        AVgMileage: {$avg: "$mileage"}
      }
    },
    {
      $sort: {
        "_id.fuelType": 1,
        "_id.category": 1
      }
    },
    {
      $project: {
        _id: 0,
        "Fuel Type": "$_id.fuelType",
        "Engine Size": "_id.category",
        "Avg Miles": {$round: ["$AVgMileage", 2]}
      }
    }
  ]);