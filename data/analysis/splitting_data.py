import pandas as pd 
import os 

inputfile = 'LargeScaleDataProject/data/raw/CarSales_Dataset.csv'
outputdir = 'LargeScaleDataProject/data/processed_data'

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
