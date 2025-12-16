db.cars.aggregate([
    {
      $group: {
        _id: "$dealer.DealerName",
        total: {$sum: 1},
        withaccident: {
          $sum: {
            $cond:[
              {$gt: [{$size: {$ifNull: ["$AccidentHistory", []]}}, 0]},
            1,
            0
              ]
            }
          }
        }
      },
    {
      $addFields: {
        ratio: {
          $round: [
            {$multiply: [{$divide: ["$withaccident", "$total",]}, 100]},
            2
          ]
        }
      }
    },
    {
      $sort: {ratio: -1}
    },
    {
      $limit: 3
    },
    {
      $project :{
        _id: 0,
        "Dealership Name": "$_id",
        "Total Num of Cars SOld": "$total",
        "Num of Cars With Accidents": "$withaccident",
        "Ratio": "$ratio"
      }
    }
  ]);