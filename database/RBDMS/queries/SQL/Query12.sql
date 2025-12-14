SELECT year(str_to_date(sr.Date_of_Service, '%d/%m/%Y')) AS 'Service Year', COUNT(sr.ServiceID) AS 'Number of Services'
FROM servicerecord sr
WHERE year(str_to_date(sr.Date_of_Service, '%d/%m/%Y')) >= 2020
GROUP BY `Service Year`
ORDER BY `Service Year` DESC; 