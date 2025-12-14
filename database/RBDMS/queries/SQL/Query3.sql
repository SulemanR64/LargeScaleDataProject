SELECT c.CarID AS 'Car ID', concat(m.Manufacturers, ' ', mo.Model_Name) AS 'Car Make & Model',  c.Year_of_Manufacturing AS 'Year', COUNT(ar.AccidentID) AS 'Number of Accidents' 
FROM cars c, models mo, manufacturers m, accidentrecord ar
WHERE c.ModelID = mo.modelID AND m.manufacturersID = mo.manufacturersID AND c.CarID = ar.CarID
GROUP BY c.CarID, concat(m.Manufacturers, ' ', mo.Model_Name), c.Year_of_Manufacturing
HAVING COUNT(ar.AccidentID) > 2
ORDER BY 'Number of Accidents';