SELECT ServiceType, COUNT(*) AS 'Number Of Times Service Was Performed In The Last 2 Years'
FROM servicerecord
WHERE str_to_date(Date_of_Service, '%d/%m/%Y') >= date_sub(curdate(), INTERVAL 2 YEAR) 
GROUP BY ServiceType
ORDER BY COUNT(*) DESC;