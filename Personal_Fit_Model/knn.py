# -*- coding: utf-8 -*-
"""
Created on Fri Mar  6 00:21:46 2020

@author: sinco
"""
#from numpy import random
from random import choices
import pandas as pd
#path = "r'D:\GitHub\realtor-insights\Personal_Fit_Model"
df_popn = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_popn.xlsx')
df_race = pd.read_excel (r'D:\GitHub\realtor-insights\Personal_Fit_Model\nyc_race.xlsx')
#age = [2,7,12,17,22,30,40,50,57,62,70,80,88]
age = list(df_popn)[2:]
pop_arr = df_popn.values.tolist()

race = list(df_race)[2:]
race_arr = df_race.values.tolist()
comm_dict = {}

knn_age = []
knn_race = []
knn_comm = []

for comm in range(len(pop_arr)):
    
    #logic for age
    comm_code = pop_arr[comm][0]
    k_factor = pop_arr[comm][1]//1000     #create points to a factor of 1e3
    weights_age = pop_arr[comm][2:]
    sample_age = choices(age, weights_age, k=k_factor)
    
    #logic for race
    weights_race = race_arr[comm][2:]
    sample_race = choices(race, weights_race, k=k_factor) #same k as age
    
    #start filling dictionary
    #may not be necessary
    comm_dict[comm_code] = {}
    comm_dict[comm_code]['k'] = k_factor
    comm_dict[comm_code]['age'] = sample_age
    comm_dict[comm_code]['race'] = sample_race
    
    #fill knn arrays
    knn_age.extend(sample_age)
    knn_race.extend(sample_race)
    knn_comm.extend([comm_code]*k_factor)

#test with just age and race

#preprocessing
#age[2,7,12,17,22,30,40,50,57,62,70,80,88]
#   [0,1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12]
#race
from sklearn import preprocessing
le = preprocessing.LabelEncoder()
age_encoded = le.fit_transform(knn_age)
race_encoded = le.fit_transform(knn_race)
label = le.fit_transform(knn_comm)
features = list(zip(age_encoded, race_encoded))

#split train/test
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(features, label, test_size=0.3)

#build knn model
from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(n_neighbors=20)
knn.fit(X_train, y_train)
y_pred = knn.predict(X_test)

#check accuracy

#with age and race
    #~1.0 to 1.5% with k = 5
    #1.0 to 2.0 with k =10
    #1.4 to 2.2 with k = 15
    #>1.8 with k = 20-30
    
from sklearn import metrics
print("Accuracy:",metrics.accuracy_score(y_test, y_pred))