import csv 
import json 
csv_dir = 'LargeScaleDataProject/data/processed_data/RBDMS'

def lookup_data():
    manufacturers = {}
    with open(f"{csv_dir}/manufacturers.csv", encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            manufacturers[int(row['manufacturersID'])] = row['Manufacturer']
    
    models = {}
    with open(f"{csv_dir}/models.csv", encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            models[int(row['ModelID'])] = {
                'name':row['Model_Name'],
                'manufacturer_id':int(row['manufacturersID'])
            }
    
    dealers = {}
    with open(f"{csv_dir}/dealers.csv", encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            dealers[int(row['DealerName'])] = {
                'city':row['DealerCity'],
                'latitude':float(row['Latitude']) if row['Latitude'] else None,
                'longitude':float(row['Longitude']) if row['Longitude'] else None
            }
    print(f"✓ Loaded {len(manufacturers)} manufacturers")
    print(f"✓ Loaded {len(models)} models")
    print(f"✓ Loaded {len(dealers)} dealers")

    return manufacturers, models, dealers

        

