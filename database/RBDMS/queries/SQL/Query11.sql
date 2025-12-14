SELECT m.Manufacturers, COUNT(c.CarID) AS 'Total Cars Sold',
concat('£', format(SUM(c.Price), 2)) AS 'Gross Sales', 
concat('£', format(AVG(COALESCE(repaircosts.TotalRepairCosts, 0)), 2)) AS 'Average Repair Cost',
concat('£', format(SUM(c.Price) - (COUNT(c.CarID) * AVG(COALESCE(repaircosts.TotalRepairCosts, 0))), 2)) AS 'Net Profit'
FROM manufacturers m  
JOIN models mo ON m.manufacturersID = mo.manufacturersID 
JOIN cars c ON c.ModelID = mo.modelID
LEFT JOIN ( SELECT CarID, SUM(ar.Cost_of_Repair) AS TotalRepairCosts 
           FROM accidentrecord ar
           GROUP BY CarID ) AS repaircosts on c.CarID = repaircosts.CarID
GROUP BY m.Manufacturers
ORDER BY (SUM(c.Price) - (COUNT(c.CarID) * AVG(COALESCE(repaircosts.TotalRepairCosts, 0)))) DESC;
