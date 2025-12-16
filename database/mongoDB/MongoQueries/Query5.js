db.cars.aggregate([
    {
    $unwind: "$AccidentHistory"
  },
  {
    $group: {
      _id: "$_id",
      manufacturer: {$first: "$manufacturer"},
      model: {$first: "$model"},
      year: {$first: "$YearOfManufacturing"},
      RepairCost: {$sum: "$AccidentHistory.CostOfRepair"},
      NumOfIncidents: {$sum: 1}
    }
  },
  {
    $match: {
      RepairCost: {$gt: 2000}
    }
  },
    {
      $sort: {RepairCost: -1}
    },
    {
      $project: {
        _id:0,
        "Car ID": "_$id",
        "Vehicle": {$concat: ["$manufacturer", " ", "$model"]},
        "Number Of Incidents": "$NumOfIncidents",
        "Total Repair Costs": {
          $concat: ["£", {$toString: {$round: ["$RepairCost", 2]}}]
        }
      }
    }
]);