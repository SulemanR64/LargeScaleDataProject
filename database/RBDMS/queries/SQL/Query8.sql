SELECT c.CarID, concat(m.Manufacturers, ' ', mo.Model_Name) AS 'Vehicle', c.Year_of_Manufacturing, (2025 - c.Year_of_Manufacturing) AS 'Vehicle Age (Years)', COUNT(sr.ServiceID) AS 'Number of Services Received' 
FROM cars c, models mo, manufacturers m, servicerecord sr 
WHERE c.CarID = sr.CarID AND m.manufacturersID = mo.manufacturersID AND c.ModelID = mo.modelID AND c.Year_of_Manufacturing < 2015
GROUP BY c.CarID, concat(m.Manufacturers, ' ', mo.Model_Name), c.Year_of_Manufacturing
HAVING COUNT(sr.ServiceID) > 2
ORDER BY (2025 - c.Year_of_Manufacturing) DESC;
