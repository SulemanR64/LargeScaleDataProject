SELECT m.Manufacturers AS 'Manufacturer Name', c.Year_of_Manufacturing AS 'Year of Manufacturing', concat('£', format(AVG(c.Price), 2)) AS 'Average Sale Price'
FROM manufacturers m, cars c, models mo
WHERE mo.modelID =c.ModelID AND mo.manufacturersID = m.manufacturersID
GROUP BY m.Manufacturers, c.Year_of_Manufacturing
ORDER BY m.Manufacturers, c.Year_of_Manufacturing;
