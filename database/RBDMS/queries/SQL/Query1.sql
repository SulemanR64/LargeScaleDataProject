SELECT d.DealerName AS 'Dealership Name', COUNT(c.CarID) AS 'Number Of Cars Sold', concat('£', format(SUM(c.Price), 2)) AS 'Total Sales Value'
FROM dealers d, cars c 
WHERE d.DealerName = c.DealerName
GROUP BY d.DealerName
ORDER BY SUM(c.Price) DESC; 
