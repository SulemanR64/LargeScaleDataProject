SELECT c.Fuel_Type AS 'Fuel Type', 
CASE 
	WHEN c.Engine_Size < 1.5 THEN 'Small (<1.5L)'
    WHEN c.Engine_Size BETWEEN 1.5 and 2.5 THEN 'Medium (Between 1.5L and 2.5L)'
    WHEN c.Engine_Size >2.5 THEN 'Large (>2.5L)'
END AS 'Size', format(AVG(c.Mileage),2) AS 'Average Mileage'
FROM cars c
GROUP BY c.Fuel_Type, 
CASE 
	WHEN c.Engine_Size < 1.5 THEN 'Small (<1.5L)'
    WHEN c.Engine_Size BETWEEN 1.5 and 2.5 THEN 'Medium (Between 1.5L and 2.5L)'
    WHEN c.Engine_Size >2.5 THEN 'Large (>2.5L)'
END 
ORDER BY c.Fuel_Type, 'Size';