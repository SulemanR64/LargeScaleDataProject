SELECT concat(m.Manufacturers, ' ', mo.Model_Name) AS 'Vehicle', 'Service' AS 'Type of Incident', sr.ServiceID AS 'Incident ID', sr.Date_of_Service AS 'Incident Date', sr.ServiceType AS 'Incident Description', concat('£', format(sr.Cost_of_Service, 2)) AS 'Cost', 'N/A' AS 'Severity'
FROM servicerecord sr, cars c, manufacturers m, models mo
WHERE sr.CarID = 'C02744' AND sr.CarID = c.CarID AND c.ModelID = mo.modelID AND mo.manufacturersID = m.manufacturersID
UNION ALL 
SELECT concat(m.Manufacturers, ' ', mo.Model_Name) AS 'Vehicle', 'Accident' AS 'Type of Incident', ar.AccidentID AS 'Incident ID', ar.Date_of_Accident AS 'Incident Date', ar.Description AS 'Incident Description', concat('£', format(ar.Cost_of_Repair, 2)) AS 'Cost', ar.Severity
FROM accidentrecord ar, cars c, manufacturers m, models mo 
WHERE ar.CarID = 'C02744' AND ar.CarID = c.CarID AND c.ModelID = mo.modelID AND mo.manufacturersID = m.manufacturersID;