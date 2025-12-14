SELECT f.FeatureName AS 'Feature Name', COUNT(DISTINCT c.CarID) AS 'Number of Cars With Given Feature'  
FROM cars c, features f, carfeatures cf
WHERE c.CarID = cf.CarID AND cf.FeatureName = f.FeatureName AND c.Price > 25000
GROUP by f.FeatureName
ORDER BY COUNT(DISTINCT c.CarID) DESC;
