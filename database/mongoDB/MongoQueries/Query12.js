db.cars.aggregate([
    {
      $unwind: "$ServiceHistory"
    },
    {
      $addFields: {
        servicedate: {
          $dateFromString: {
            dateString: "$ServiceHistory.DateOfService",
            format: "%d/%m/%Y"
          }
        }
      }
    },
    {
      $addFields: {
        serviceyear: {$year: "$servicedate"}
      }
    },
    {
      $match:{
        serviceyear: {$gte: 2020}
      }
    },
    {
      $group:{
        _id: "$serviceyear",
        numberofservices: {$sum: 1}
      }
    },
    {
      $sort: {_id: 1}
    },
    {
      $project: {
        _id: 0,
        "Service Year": "$_id",
        "Number of Services": "$numberofservices"
      }
    }
  ]);