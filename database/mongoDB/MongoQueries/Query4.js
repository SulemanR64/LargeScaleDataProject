db.cars.aggregate([
    {
      $unwind: "$ServiceHistory"
    },
    {
      $addFields: {
        serviceDate: {
          $dateFromString: {
            dateString: "$ServiceHistory.DateOfService",
            format: "%d/%m/%Y"
          }
        }
      }
    },
    {
      $match: {
        serviceDate: {
          $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 2))
        }
      }
    },
    {
      $group: {
        _id: "$ServiceHistory.ServiceType",
        count: {$sum: 1}
      }
    },
    {
      $sort: {count: -1}
    },
    {
      $project: {
        _id: 0,
        "Service Type": "$_id",
        "Number of Times Performed in Last 2 Years": "$count"
      }
    }
  ]);