# -*- coding: utf-8 -*-
"""
Created on Wed Apr 15 16:36:59 2020

@author: Shinjae Yoo
"""

import pickle
from knn import y_train, num_nta

from sklearn import preprocessing
le = preprocessing.LabelEncoder()

X_test = [(4, 3, 3, 6, 1, 3)]

loaded_model = pickle.load(open('knn_model.sav', 'rb'))
distances, indices = loaded_model.kneighbors(X_test)

#calculating weights of n closest ntas
neigh_arr = []
weighted_neigh_arr = [0] * num_nta
for i in indices[0]:
    neigh_arr.append(y_train[i])
    weighted_neigh_arr[y_train[i]] += 1
print(weighted_neigh_arr)

#res_arr = le.inverse_transform(result)
#print("Result:", result, res_arr)