SELECT c.CarID, concat(m.Manufacturers, ' ', mo.Model_Name) AS 'Vehicle', c.Year_of_Manufacturing AS 'Year', COUNT(ar.AccidentID) AS 'Number of Accidents', concat('£', format(SUM(ar.Cost_of_Repair), 2)) AS 'Total Repair Cost', 
(SELECT MAX(str_to_date(sr.Date_of_Service, '%d/%m/%Y')) FROM servicerecord sr WHERE sr.CarID = c.CarID) AS 'Last Service Date'
FROM cars c
JOIN models mo ON c.ModelID = mo.modelID 
JOIN manufacturers m ON m.manufacturersID = mo.manufacturersID 
JOIN accidentrecord ar ON ar.CarID = c.CarID
WHERE str_to_date(ar.Date_of_Accident, '%d/%m/%Y') >= date_sub(curdate(), INTERVAL 24 month)
AND NOT EXISTS(
    SELECT 1
    FROM servicerecord sr
    WHERE sr.CarID = c.CarID AND str_to_date(sr.Date_of_Service, '%d/%m/%Y') >= date_sub(curdate(), INTERVAL 24 month)
    )
GROUP BY c.CarID, concat(m.Manufacturers, ' ', mo.Model_Name), c.Year_of_Manufacturing
ORDER BY `Number of Accidents` DESC