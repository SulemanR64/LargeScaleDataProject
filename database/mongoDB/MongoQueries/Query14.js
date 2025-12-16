db.cars.aggregate([
    {
      $unwind: "$AccidentHistory"
    },
    {
      $group: {
        _id: "$manufacturer",
        totalaccidents: { $sum: 1 },
        Minor: {
          $sum: {
            $cond: [{ $eq: ["$AccidentHistory.Severity", "Minor"] }, 1, 0]
          }
        },
        Moderate: {
          $sum: {
            $cond: [{ $eq: ["$AccidentHistory.Severity", "Moderate"] }, 1, 0]
          }
        },
        Major: {
          $sum: {
            $cond: [{ $eq: ["$AccidentHistory.Severity", "Major"] }, 1, 0]
          }
        },
        Severe: {
          $sum: {
            $cond: [{ $eq: ["$AccidentHistory.Severity", "Severe"] }, 1, 0]
          }
        }
      }
    },
    {
      $sort: { totalaccidents: -1 }
    },
    {
      $project: {
        _id: 0,
        Manufacturer: "$_id",
        "Total Accidents": "$totalaccidents",
        Minor: 1,
        Moderate: 1,
        Major: 1,
        Severe: 1
      }
    }
  ]);