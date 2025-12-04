create database if not exists carsales;
use carsales;

-- turn off FK checks so tables can be dropped if they already exist
set foreign_key_checks = 0;

-- drop tables if they already exist 
drop table if exists accidentrecord;
drop table if exists servicerecord;
drop table if exists carfeatures;
drop table if exists features;
drop table if exists cars;
drop table if exists models;
drop table if exists dealers;
drop table if exists manufacturers;

-- turn FK checks back on
set foreign_key_checks = 1;

-- create tables 
create table manufacturers(
    manufacturersID int primary key auto_increment, 
    Manufacturers varchar(100) not null unique
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
create table models(
    modelID int primary key,
    Model_Name varchar(100) not null,
    manufacturersID int not null,
    foreign key(manufacturersID) references manufacturers(manufacturersID)
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
create table dealers(
    DealerName varchar(200) primary key,
    DealerCity varchar(100),
    Latitude decimal(10, 6),
    Longitude decimal(10,6)
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
create table cars(
    CarID varchar(10) primary key,
    ModelID int not null,
    Engine_Size decimal(10,2),
    Fuel_Type varchar(50),
    Year_of_Manufacturing int,
    Mileage int,
    Price decimal(10,2),
    DealerName varchar(200) not null,
    foreign key (ModelID) references models(modelID),
    foreign key (DealerName) references dealers(DealerName)
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
create table features(
    FeatureName varchar(100) primary key
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
create table carfeatures(
    CarID varchar(10) not null,
    FeatureName varchar(100) not null,
    primary key (CarID, FeatureName),
    foreign key (CarID) references cars(CarID) on delete cascade,
    foreign key (FeatureName) references features(FeatureName)
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
create table servicerecord(
    ServiceID varchar(10) primary key, 
    CarID varchar(10) not null,
    Date_of_Service varchar(20),
    ServiceType varchar(100),
    Cost_of_Service decimal(10,2),
    foreign key (CarID) references cars(CarID) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
create table accidentrecord(
    AccidentID varchar(10) primary key,
    CarID varchar(10) not null,
    Date_of_Accident varchar(20),
    Description varchar(300), 
    Cost_of_Repair decimal(10,6),
    Severity varchar(50),
    foreign key (CarID) references cars(CarID) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate = utf8mb4_unicode_ci;
