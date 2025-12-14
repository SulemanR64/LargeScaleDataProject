SELECT m.Manufacturers AS 'Manufacturer', COUNT(ar.AccidentID) AS 'Total Number of Accidents',
SUM(CASE WHEN ar.Severity = 'Minor' THEN 1 ELSE 0 END) AS 'Minor',
SUM(CASE WHEN ar.Severity = 'Moderate' THEN 1 ELSE 0 END) AS 'Moderate',
SUM(CASE WHEN ar.Severity = 'Major' THEN 1 ELSE 0 END) AS 'Major',
SUM(CASE WHEN ar.Severity = 'Severe' THEN 1 ELSE 0 END) AS 'Severe',round(SUM(CASE WHEN ar.Severity = 'Minor' THEN 1 ELSE 0 END) * 100.0 / COUNT(ar.AccidentID)) AS 'Minor Accident %',
round(SUM(CASE WHEN ar.Severity = 'Moderate' THEN 1 ELSE 0 END) * 100.0 / COUNT(ar.AccidentID)) AS 'Moderate Accident %',
round(SUM(CASE WHEN ar.Severity = 'Major' THEN 1 ELSE 0 END) * 100.0 / COUNT(ar.AccidentID)) AS 'Major Accident %',
round(SUM(CASE WHEN ar.Severity = 'Severe' THEN 1 ELSE 0 END) * 100.0 / COUNT(ar.AccidentID)) AS 'Severe Accident %'
FROM manufacturers m
JOIN models mo ON m.manufacturersID = mo.manufacturersID
JOIN cars c ON mo.modelID = c.ModelID
JOIN accidentrecord ar ON c.CarID = ar.CarID
GROUP BY m.Manufacturers
ORDER BY COUNT(ar.AccidentID) DESC;