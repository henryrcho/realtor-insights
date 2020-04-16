# -*- coding: utf-8 -*-
"""
Created on Wed Apr 15 16:36:59 2020

@author: Shinjae Yoo
"""

import sys
import pandas as pd
import json
import pickle
from knn import y_train, num_nta

if(len(sys.argv) > 1):
    n1, n2, n3, n4, n5, n6 = int(sys.argv[1]), int(sys.argv[2]), \
    int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
else:
    n1, n2, n3, n4, n5, n6 = 4, 3, 3, 6, 1, 3

#X_test = [(4, 3, 3, 6, 1, 3)]
X_test = [(n1, n2, n3, n4, n5, n6)]

loaded_model = pickle.load(open('knn_model.sav', 'rb'))
distances, indices = loaded_model.kneighbors(X_test)

#calculating weights of n closest ntas
neigh_arr = []
weighted_neigh_arr = [0] * num_nta
for i in indices[0]:
    neigh_arr.append(y_train[i])
    weighted_neigh_arr[y_train[i]] += 1
#print(weighted_neigh_arr)

#make dictionary for JSON
prob_dict = []      #list of dictionaries
#Note: manually removed cemeteries and Rikers Island and Airport
df_age = pd.read_excel (r'./data/nyc_popn.xlsx')
comm_name = df_age['comm'].tolist()

for i in range(num_nta):
    prob_dict.append({'district': comm_name[i][5:], 'probability' : weighted_neigh_arr[i]/1000})

#Write JSON here...
#with open('probability.json', 'w') as f:
#    json.dump(prob_dict, f)

print(json.dumps(prob_dict))
sys.stdout.flush()