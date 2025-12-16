db.cars.aggregate([
    {
      $match:{
        price: {$gte: 25000}
      }
    },
    {
      $unwind: "$features"
    },
    {
      $group: {
        _id: "$features",
        numberofcars:{$sum: 1}
      }
    },
    {
      $project:{
        _id:0,
        "Feature": "$_id",
        "Number Of Cars With Feature": "$numberofcars"
      }
    }
  ]);