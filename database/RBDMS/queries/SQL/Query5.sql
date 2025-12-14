SELECT c.CarID AS 'Car ID', concat(m.Manufacturers, ' ', mo.Model_Name) AS 'Make & Model', c.Year_of_Manufacturing AS 'Year',  COUNT(ar.AccidentID) AS 'Number of Incidents', concat('£', format(SUM(ar.Cost_of_Repair), 2)) AS 'Total Repair Cost'
FROM cars c, accidentrecord ar, models mo, manufacturers m
WHERE c.CarID = ar.CarID AND mo.manufacturersID = m.manufacturersID AND c.ModelID = mo.modelID
GROUP BY c.CarID, concat(m.Manufacturers, ' ', mo.Model_Name), c.Year_of_Manufacturing
HAVING SUM(ar.Cost_of_Repair) > 2000
ORDER BY SUM(ar.Cost_of_Repair) DESC;