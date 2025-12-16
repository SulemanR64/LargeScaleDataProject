db.cars.aggregate([
    {
      $addFields:{
        totalrepaircost: {
          $sum:{
            $map:{
              input:{$ifNull: ["$AccidentHistory", []]},
              as: "a",
              in: "$$a.CostOfRepair"
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$manufacturer",
        totalcarssold: {$sum: 1},
        gross:{$sum: "$price"},
        avgrepaircost: {$avg: "$totalrepaircost"}
      }
    },
    {
      $addFields: {
        net:{
          $subtract:[
            "$gross",
            {$multiply: ["$totalcarssold", "$avgrepaircost"]}
          ]
        }
      }
    },
    {
      $sort: {net: -1}
    },
    {
      $project: {
        _id:0,
        "Manufacturers": "$_id",
        "Total Cars Sold": "$totalcarssold",
        "Gross Sales": {
          $concat:["£", {$toString: {$round: ["$gross", 2]}}]
        },
          "Avg Repair Cost": {
            $concat:["£", {$toString: {$round: ["$avgrepaircost", 2]}}]
          },
        "Net Profit": {
          $concat:["£", {$toString: {$round: ["$net", 2]}}]
        }
        }
      }
  ]);