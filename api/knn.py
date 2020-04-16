# -*- coding: utf-8 -*-
"""
Created on Fri Mar  6 00:21:46 2020

@author: Shinjae Yoo
"""

#age
#race
#employment industry
#income and benefits
#number of bedrooms
#number of vehicles

#from numpy import random
import json
from random import choices
import pandas as pd
import pickle
#path = "r'D:\GitHub\realtor-insights\Personal_Fit_Model"
#Note: removed QN98 Airport, BX98 Rikers Island1, and cemeteries
#Note: changed MN01 Marble Hill2-Inwood to remove number
#todo: perhaps change name of nyc_popn to nyc_age
df_age = pd.read_excel (r'./data/nyc_popn.xlsx')
df_race = pd.read_excel (r'./data/nyc_race.xlsx')
df_ind = pd.read_excel (r'./data/nyc_empind.xlsx')
df_inc = pd.read_excel (r'./data/nyc_income.xlsx')
df_bed = pd.read_excel (r'./data/nyc_bedroom.xlsx')
df_veh = pd.read_excel (r'./data/nyc_vehicle.xlsx')

age = list(df_age)[2:]              #column header
pop_arr = df_age.values.tolist()    #list of all elements in row in a list

race = list(df_race)[2:]            #column header
race_arr = df_race.values.tolist()  #list of all elements in row in a list

ind = list(df_ind)[2:]              #column header
ind_arr = df_ind.values.tolist()    #list of all elements in row in a list

inc = list(df_inc)[2:]              #column header
inc_arr = df_inc.values.tolist()    #list of all elements in row in a list

bed = list(df_bed)[2:]              #column header
bed_arr = df_bed.values.tolist()    #list of all elements in row in a list

veh = list(df_veh)[2:]              #column header
veh_arr = df_veh.values.tolist()    #list of all elements in row in a list

#temporary list for attributes to feed knn
knn_age = []
knn_race = []
knn_ind = []
knn_inc = []
knn_bed = []
knn_veh = []
knn_comm = []

num_nta = 0

for comm in range(len(pop_arr)):
    #Note len(pop_arr) is 192
    #Remove Airport, Rikers Island
    
    #set-up of community code and scaling population
    comm_code = pop_arr[comm][0]
    num_nta += 1
    k_factor_demo = pop_arr[comm][1]//1000     #create points to a factor of 1e3

    #logic for age
    weights_age = pop_arr[comm][2:]
    sample_age = choices(age, weights_age, k=k_factor_demo)

    #logic for race
    weights_race = race_arr[comm][2:]
    sample_race = choices(race, weights_race, k=k_factor_demo) #same k as age

    #logic for employment industry
    #k_factor_econ = ind_arr[comm][1]//1000
    weights_ind = ind_arr[comm][2:]
    sample_ind = choices(ind, weights_ind, k=k_factor_demo)

    #logic for income
    weights_inc = inc_arr[comm][2:]
    sample_inc = choices(inc, weights_inc, k=k_factor_demo) #same k as age

    #logic for bedroom
    weights_bed = bed_arr[comm][2:]
    sample_bed = choices(bed, weights_bed, k=k_factor_demo) #same k as age
    
    #logic for vehicles
    weights_veh = veh_arr[comm][2:]
    sample_veh = choices(veh, weights_veh, k=k_factor_demo) #same k as age 

    #fill knn arrays
    knn_age.extend(sample_age)
    knn_race.extend(sample_race)
    knn_ind.extend(sample_ind)
    knn_inc.extend(sample_inc)
    knn_bed.extend(sample_bed)
    knn_veh.extend(sample_veh)
    knn_comm.extend([comm_code]*k_factor_demo)

#test with just age and race

#preprocessing
#age[2,7,12,17,22,30,40,50,57,62,70,80,88]
#   [0,1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12]
#race
from sklearn import preprocessing
le = preprocessing.LabelEncoder()

age_encoded = le.fit_transform(knn_age)
race_encoded = le.fit_transform(knn_race)
ind_encoded = le.fit_transform(knn_ind)
inc_encoded = le.fit_transform(knn_inc)
bed_encoded = le.fit_transform(knn_bed)
veh_encoded = le.fit_transform(knn_veh)     #makes pred worse

label = le.fit_transform(knn_comm)
#features = list(zip(age_encoded, race_encoded))
features = list(zip(age_encoded, race_encoded, ind_encoded, inc_encoded, bed_encoded, veh_encoded))

#split train/test
#from sklearn.model_selection import train_test_split
#X_train, X_test, y_train, y_test = train_test_split(features, label, test_size=0.1, shuffle = False, stratify = None)

X_train, y_train = features, label

#build knn model
#from sklearn.neighbors import KNeighborsClassifier
#knn = KNeighborsClassifier(n_neighbors=100)
#knn.fit(X_train, y_train)
#y_pred = knn.predict(X_test)

if __name__ == "__main__":
    # this won't be run when imported

    #find n nearest neighbours
    from sklearn.neighbors import NearestNeighbors
    nbrs = NearestNeighbors(n_neighbors = 1000, algorithm = 'ball_tree')
    nbrs.fit(X_train, y_train)
    
    #try pickle
    pickle.dump(nbrs, open('./data/knn_model.sav', 'wb'))

#make dictionary for JSON
median_dict = []      #list of dictionaries

#list of other dictionaries
ageDict = ['20-24', '25-34', '35-44', '45-54', '55-59', '60-64', '65-74', '75-84', '85+']
raceDict = ['Latino', 'Caucasian', 'African American', 'Asian', 'Other']
occupationDict = ['Agriculture, forestry, fishing, hunting, or mining', 
    'Construction',
    'Manufacturing', 
    'Wholesale trade', 
    'Retail trade', 
    'Transportation, warehousing, or utilities',
    'Information', 
    'Finance, insurance, real estate, or rental & leasing', 
    'Professional, scientific, management, administrative, or waste management services',
    'Educational services, health care, or social assistance', 
    'Arts, entertainment, recreation, accommodation, or food services',
    'Other services, except public administration', 
    'Public administration'
]
incomeDict = [
    'Less than $10,000', 
    '$10,000 to $14,999', 
    '$15,000 to $24,999', 
    '$25,000 to $34,999', 
    '$35,000 to $49,999', 
    '$50,000 to $74,999', 
    '$75,000 to $99,999', 
    '$100,000 to $149,999', 
    '$150,000 to $199,999', 
    '$200,000 or more'
]
bedroomDict = ['0 bedrooms', '1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '5 or more bedrooms']
vehicleOptions = ['0 vehicles', '1 vehicle', '2 vehicles', '3 or more vehicles']

comm_name = df_age['comm'].tolist()
for i in range(num_nta):
    
    #find median age
    age_total = pop_arr[i][1]
    age_ctr = 0
    age_sum = 0
    while(age_sum < age_total/2):
        age_ctr += 1
        age_sum += pop_arr[i][age_ctr+1]
    median_age = ageDict[age_ctr-1]
    
    #find majority race
    race_val_max = max(race_arr[i][2:])
    race_ind_max = race_arr[i][2:].index(race_val_max)
    maj_race = raceDict[race_ind_max]
    
    #find majority employment industry
    ind_val_max = max(ind_arr[i][2:])
    ind_ind_max = ind_arr[i][2:].index(ind_val_max)
    maj_ind = occupationDict[ind_ind_max]
    
    #find median income
    inc_total = inc_arr[i][1]
    inc_ctr = 0
    inc_sum = 0
    while(inc_sum < inc_total/2):
        inc_ctr += 1
        inc_sum += inc_arr[i][inc_ctr+1]
    median_inc = incomeDict[inc_ctr-1]
    
    #find median number of bedrooms
    bed_total = bed_arr[i][1]
    bed_ctr = 0
    bed_sum = 0
    while(bed_sum < bed_total/2):
        bed_ctr += 1
        bed_sum += bed_arr[i][bed_ctr+1]
    median_bed = bedroomDict[bed_ctr-1]
    
    #find median number of vehicles
    veh_total = veh_arr[i][1]
    veh_ctr = 0
    veh_sum = 0
    while(veh_sum < veh_total/2):
        veh_ctr += 1
        veh_sum += veh_arr[i][veh_ctr+1]
    median_veh = vehicleOptions[veh_ctr-1]
    
    median_dict.append({'district': comm_name[i][5:], \
                        'median_age': median_age, \
                        'majority_race': maj_race, \
                        'majority_empind': maj_ind, \
                        'median_income': median_inc, \
                        'median_bed': median_bed, \
                        'median_veh': median_veh})

#Write JSON here...
with open('median.json', 'w') as f:
    json.dump(median_dict, f)