db.cars.aggregate([
    {
      $match: {_id: "C02744"}
    },
    {
      $project: {
        history:{
          $concatArrays: [
            {
              $map:{
                input: {$ifNull: ["$ServiceHistory", []]},
                as: "s",
                in: {
                  type: "service",
                  id:"$$s.ServiceID",
                  date:"$$s.DateOfService",
                  description:"$$s.ServiceType",
                  cost: "$$s.CostOfService"
                }
              }
            },
            {
              $map: {
                input: {$ifNull: ["$ServiceHistory", []]},
                as: "a",
                in: {
                  type: "accident",
                  id:"$$a.accidentID",
                  date:"$$a.DateOfAccident",
                  description:"$$a.Description",
                  cost: "$$a.CostOfRepair",
                  severity: "$$a.Severity"
                }
              }
            }
          ]
        }
      }
    },
    {
      $unwind: "$history"
    },
    {
      $replaceRoot: {newRoot: "$history"}
    }
  ]);