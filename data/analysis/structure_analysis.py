

import pandas as pd
import numpy as py

#load dataset into a dataframe 
df = pd.read_csv('LargeScaleDataProject/data/raw/CarSales_Dataset.csv') 
#alert us if there was an issue with loading the csv file
print("\n \n data was loaded successfully :)")

#display first 15 rows of sample data 
print("\n" + "="*80)
print("FIRST 15 ROWS OF SAMPLE DATA")
print("="*80)
print(df.head(15))

#work out the no. of rows and columns in the dataset
rows, columns = df.shape
print(f"\n dataset has {rows:,} rows and {columns:,} columns")

#list all column names
print("\n" + "="*80)
print("COLUMN NAMES")
print("="*80)
for i, columns in enumerate(df.columns, start=1):
    print(f"{i:2d}. {columns}")

#list all data types 
print("\n" + "="*80)
print("DATA TYPES")
print("="*80)
print(df.dtypes)