SELECT c.Fuel_Type, COUNT(*) AS 'Number of Cars', concat('£', format(avg(c.Price), 2)) AS 'Average Sell Price'
FROM cars c 
GROUP BY c.Fuel_Type
ORDER BY COUNT(*) DESC;