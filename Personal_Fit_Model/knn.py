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
from random import choices
import pandas as pd
import pickle
#path = "r'D:\GitHub\realtor-insights\Personal_Fit_Model"
#Note: removed QN98 Airport, BX98 Rikers Island1, and cemeteries
#Note: changed MN01 Marble Hill2-Inwood to remove number
#todo: perhaps change name of nyc_popn to nyc_age
df_age = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_popn.xlsx')
df_race = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_race.xlsx')
df_ind = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_empind.xlsx')
df_inc = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_income.xlsx')
df_bed = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_bedroom.xlsx')
df_veh = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_vehicle.xlsx')

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

comm_dict = {}      #may not need

num_nta = 0

for comm in range(len(pop_arr)):
    #Note len(pop_arr) is 192
    #Remove Airport, Rikers Island
    
    #set-up of community code and scaling population
    comm_code = pop_arr[comm][0]
    if "cemetery" not in comm_code:
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
    
        #start filling dictionary
        #may not be necessary
        comm_dict[comm_code] = {}
        comm_dict[comm_code]['k'] = k_factor_demo
        #comm_dict[comm_code]['age'] = sample_age
        #comm_dict[comm_code]['race'] = sample_race
    
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
    pickle.dump(nbrs, open('knn_model.sav', 'wb'))
