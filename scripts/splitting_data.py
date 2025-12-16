import pandas as pd 
import os 


inputfile = 'LargeScaleDataProject/data/raw/CarSales_Dataset.csv'
outputdir = 'LargeScaleDataProject/data/processed_data/RBDMS'

df = pd.read_csv(inputfile)
os.makedirs(outputdir, exist_ok= True)

#Manufacturers Table
manufacturers = df[['Manufacturer']].drop_duplicates()
manufacturers = manufacturers.sort_values('Manufacturer')
manufacturers = manufacturers.reset_index(drop= True)
manufacturers['manufacturersID'] = range(1, len(manufacturers)+1)
manufacturers = manufacturers[['manufacturersID', 'Manufacturer']]
manufacturers.to_csv(f'{outputdir}/manufacturers.csv', index= False)

#Models Table
models = df[['Manufacturer', 'Model']].drop_duplicates()
models = models.sort_values(['Manufacturer', 'Model']).reset_index(drop= True)
models = models.merge (
    manufacturers[['Manufacturer', 'manufacturersID']],
    on= 'Manufacturer',
    how= 'left'
)
models['ModelID'] = range(1, len(models)+1)
models = models[['ModelID', 'Model', 'manufacturersID']]
models = models.rename(columns={'Model': 'Model_Name'})
models.to_csv(f'{outputdir}/models.csv',  index= False)

#Dealers Table
dealers = df[['DealerName', 'DealerCity', 'Latitude', 'Longitude']].drop_duplicates()
dealers = dealers.sort_values('DealerName').reset_index(drop= True)
dealers.to_csv(f'{outputdir}/dealers.csv', index= False)

#Features Table
features = df[['Features']].drop_duplicates()
features = features.sort_values('Features').reset_index(drop= True)
features = features.rename(columns={'Features': 'FearureName'})
features.to_csv(f'{outputdir}/features.csv', index= False)

#Cars Table
cars = df.groupby('CarID').first().reset_index()
cars = cars.merge(
    manufacturers[['Manufacturer', 'manufacturersID']],
    on= 'Manufacturer',
    how= 'left'
)
models_lookup = models.rename(columns={'Model_Name': 'Model'})
cars = cars.merge(
    models_lookup[['Model', 'manufacturersID', 'ModelID']],
    on= ['Model', 'manufacturersID'],
    how= 'left'
)
cars_final = cars[[
    'CarID',
    'ModelID',
    'Engine size',
    'Fuel_Type',
    'Year_of_Manufacturing',
    'Mileage',
    'Price',
    'DealerName'
]].rename(columns={'Engine size': 'Engine_Size'})
cars_final.to_csv(f'{outputdir}/cars.csv', index= False)

#CarFeatures Junction Table
car_features = df[['CarID', 'Features']].drop_duplicates()
car_features = car_features.sort_values(['CarID', 'Features']).reset_index(drop= True)
car_features = car_features.rename(columns={'Features': 'FeatureName'})
car_features.to_csv(f'{outputdir}/carfeatures.csv', index= False)

#ServiceRecords Table
has_service = df[df['ServiceID'].notna()]
service_records = has_service[[
    'ServiceID',
    'CarID',
    'Date_of_Service',
    'ServiceType',
    'Cost_of_Service'
]].drop_duplicates(subset=['ServiceID']).sort_values('ServiceID').reset_index(drop= True)
service_records.to_csv(f'{outputdir}/servicerecord.csv', index= False)

#AccidentRecord Table
has_accident = df[df['AccidentID'].notna()]
accident_records = has_accident[[
    'AccidentID',
    'CarID',
    'Date_of_Accident',
    'Description',
    'Cost_of_Repair',
    'Severity'
]].drop_duplicates(subset= ['AccidentID']).sort_values('AccidentID').reset_index(drop= True)
accident_records.to_csv(f'{outputdir}/accidentrecord.csv', index= False)

