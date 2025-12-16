import pandas as pd
import json
import os 

output = 'LargeScaleDataProject/data/processed_data/mongoDB'
os.makedirs(output, exist_ok=True)
csvloc = 'LargeScaleDataProject/data/processed_data/RBDMS'
ar_df = pd.read_csv(f'{csvloc}/accidentrecord.csv')
cf_df = pd.read_csv(f'{csvloc}/carfeatures.csv')
cars_df = pd.read_csv(f'{csvloc}/cars.csv')
dealers_df = pd.read_csv(f'{csvloc}/dealers.csv')
features_df = pd.read_csv(f'{csvloc}/features.csv')
manufacturers_df = pd.read_csv(f'{csvloc}/manufacturers.csv')
models_df = pd.read_csv(f'{csvloc}/models.csv')
sr_df = pd.read_csv(f'{csvloc}/servicerecord.csv')

cars_collection = []
for idx, car in cars_df.iterrows():
    model = models_df[models_df['ModelID'] == car['ModelID']].iloc[0]
    manufacturer = manufacturers_df[manufacturers_df['manufacturersID'] == model['manufacturersID']].iloc[0]
    dealer = dealers_df[dealers_df['DealerName'] == car['DealerName']].iloc[0]
    car_features = cf_df[cf_df['CarID'] == car['CarID']]['FeatureName'].tolist()
    
    services = sr_df[sr_df['CarID'] == car['CarID']]
    service_history = []
    for _, service in services.iterrows():
        service_history.append({
            "ServiceID": service['ServiceID'],
            "DateOfService": service['Date_of_Service'],
            "ServiceType": service['ServiceType'],
            "CostOfService": float(service['Cost_of_Service'])
        })
    
    accidents = ar_df[ar_df['CarID'] == car['CarID']]
    accident_history = []
    for _, accident in accidents.iterrows():
        accident_history.append({
            "accidentID": accident['AccidentID'],
            "DateOfAccident": accident['Date_of_Accident'],
            "Description": accident['Description'],
            "CostOfRepair": float(accident['Cost_of_Repair']),
            "Severity": accident['Severity']
        })
    
    doc = {
        "_id": car['CarID'],
        "manufacturer": manufacturer['Manufacturer'],
        "model": model['Model_Name'],
        "YearOfManufacturing": int(car['Year_of_Manufacturing']),
        "EngineSize": float(car['Engine_Size']),
        "FuelType": car['Fuel_Type'],
        "mileage": int(car['Mileage']),
        "price": float(car['Price']),
        "dealer": {
            "DealerName": dealer['DealerName'],
            "DealerCity": dealer['DealerCity'],
            "latitude": float(dealer['Latitude']),
            "longitude": float(dealer['Longitude'])
        },
        "features": car_features,
        "ServiceHistory": service_history,
        "AccidentHistory": accident_history
    }
    cars_collection.append(doc)
    outputloc = os.path.join(output, 'cars.json')
    with open(outputloc, 'w',) as f:
        json.dump(cars_collection, f, indent=2)


