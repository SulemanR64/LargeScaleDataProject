db.cars.aggregate([
    {
      $addFields: {
        recentaccidents: {
          $filter: {
            input: { $ifNull: ["$AccidentHistory", []] },
            as: "a",
            cond: {
              $gte: [
                { $dateFromString: { dateString: "$$a.DateOfAccident", format: "%d/%m/%Y" } },
                new Date(new Date().setMonth(new Date().getMonth() - 24))
              ]
            }
          }
        },
        recentservices: {
          $filter: {
            input: { $ifNull: ["$ServiceHistory", []] },
            as: "s",
            cond: {
              $gte: [
                { $dateFromString: { dateString: "$$s.DateOfService", format: "%d/%m/%Y" } },
                new Date(new Date().setMonth(new Date().getMonth() - 24))
              ]
            }
          }
        }
      }
    },
    {
      $match: {
        $expr: {
          $and: [
            { $gt: [{ $size: "$recentaccidents" }, 0] },
            { $eq: [{ $size: "$recentservices" }, 0] }
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        carId: "$_id",
        manufacturer: 1,
        model: 1,
        accidents: { $size: "$recentaccidents" }
      }
    }
  ]);