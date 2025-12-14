SELECT c.DealerName AS 'Dealer Name', COUNT(DISTINCT c.CarID) AS 'Total Number of Cars Sold' , COUNT(DISTINCT ar.CarID) AS 'Number of Accident Prone Cars Sold', ROUND(COUNT(DISTINCT ar.CarID) * 100 / COUNT(DISTINCT c.CarID), 2) AS 'Ratio'
FROM cars c
LEFT JOIN accidentrecord ar ON c.CarID = ar.CarID
GROUP BY c.DealerName
ORDER BY Ratio DESC
LIMIT 3;