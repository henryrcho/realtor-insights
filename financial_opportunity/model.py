import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import mean_squared_error as MSE
from math import sqrt
from pandas.plotting import autocorrelation_plot
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import pmdarima as pm
import json
from datetime import datetime

'''
Helper functions adapted from:
https://medium.com/@feraguilari/time-series-analysis-modfinalproyect-b9fb23c28309
'''

def melt_data(df):
    melted = pd.melt(df, id_vars = ['RegionName'], var_name = 'time')
    melted['time'] = pd.to_datetime(melted['time'], infer_datetime_format = True)
    melted = melted.dropna(subset = ['value'])
    return melted

def train_test(df):
    train = df[:-12]
    test = df[-12:]
    return train, test

def train_test_model_fit(df, pdq, pdqs):
    train, test = train_test(df)
    model = SARIMAX(train, order = pdq, seasonal_order = pdqs)
    model_fit = model.fit(disp = False)
    return train, test, model_fit

def train_RMSE(train, model_fit, display = False):
    predictions = model_fit.predict(start = -12)
    rmse = sqrt(MSE(train[-12:], predictions))
    print('Train RMSE: %.5f' % rmse)
    if display:
        plt.figure(figsize = (13,6))
        plt.plot(train[-12:], label = 'Actual', color = 'b')
        plt.plot(predictions, label = 'Predicted', color = 'r')
        plt.title('Train Data vs. Predictions')
        plt.xlabel('Time')
        plt.ylabel('ZHVI')
        plt.legend(loc = 'best')
        plt.show()
    return rmse

def test_RMSE(train, test, model_fit, display = False):
    predictions = model_fit.predict(end = len(train) + 11)
    rmse = sqrt(MSE(test, predictions[-12:]))
    print('Test RMSE: %.5f' % rmse)
    if display:
        plt.figure(figsize = (13,6))
        plt.plot(test, label = 'Actual', color = 'b')
        plt.plot(predictions[-12:], label = 'Predicted', color = 'r')
        plt.title('Test Data vs. Predictions')
        plt.xlabel('Time')
        plt.ylabel('ZHVI')
        plt.legend(loc = 'best')
        plt.show()
    return rmse

def forecast_model(df, pdq, pdqs, display = False):
    model = SARIMAX(df, order = pdq, seasonal_order = pdqs)
    model_fit = model.fit(disp = False)
    predictions = model_fit.get_prediction(start = len(df), end = len(df) + 59, dynamic = True)
    confidence = predictions.conf_int(alpha = 0.05)
    if display:
        fig, ax = plt.subplots(figsize = (13,6))
        df.plot(label = 'Historic')
        predictions.predicted_mean.plot(label = 'Forecast')
        ax.fill_between(confidence.index, confidence.iloc[:,0], confidence.iloc[:,1],
                        color = 'k', alpha = .25, label = 'Confidence Interval')
        plt.title('Forecast of Home Values')
        plt.xlabel('Time')
        plt.ylabel('ZHVI')
        plt.legend(loc = 'best')
        plt.show()
    return predictions.predicted_mean, confidence

start = datetime.now()
df_zillow = pd.read_csv('Neighborhood_Zhvi_AllHomes.csv')
df_neighborhoods = df_zillow[df_zillow['City'] == 'New York']
train_file = open('train.txt', 'w')
test_file = open('test.txt', 'w')
data = []
count = 0
for regionID in df_neighborhoods.RegionID.unique():
    print(count)
    count += 1
    df_neighborhood = df_neighborhoods[df_neighborhoods['RegionID'] == regionID]
    df_neighborhood = df_neighborhood.drop(['RegionID', 'City', 'State', 'Metro', 'CountyName', 'SizeRank'], axis = 1)
    df_neighborhood = melt_data(df_neighborhood).set_index('time')
    df_neighborhood = df_neighborhood.asfreq('MS')
    region = df_neighborhood['RegionName'][0]
    df_neighborhood['ret'] = np.nan * len(df_neighborhood)
    for i in range(len(df_neighborhood) - 1):
        df_neighborhood.ret.iloc[i + 1] = (df_neighborhood.value.iloc[i + 1]/df_neighborhood.value.iloc[i]) - 1
    df_ret = df_neighborhood.value.dropna()
    model = pm.auto_arima(df_ret, m = 12, information_criterion = 'aic', stepwise = True, suppress_warnings = True, error_action = 'ignore')
    pdq = model.order
    pdqs = model.seasonal_order
    train, test, model_fit = train_test_model_fit(df_ret, pdq = pdq, pdqs = pdqs)
    try:
        train_result = train_RMSE(train, model_fit)
        train_file.write("%f\n" % train_result)
    except:
        print('Error while training')
    try:
        test_result = test_RMSE(train, test, model_fit)
        test_file.write("%f\n" % test_result)
    except:
        print('Error while testing')
    predicted, confidence = forecast_model(df_ret, pdq = pdq, pdqs = pdqs)

    entry = {}
    entry['id'] = int(regionID)
    entry['district'] = region
    entry['year_1'] = predicted[11]/df_neighborhood.value[-1] - 1
    entry['year_3'] = predicted[35]/df_neighborhood.value[-1] - 1
    entry['year_5'] = predicted[59]/df_neighborhood.value[-1] - 1

    projection = []
    assert(len(predicted) == len(confidence))
    for i in range(len(predicted)):
        point = {}
        point['date'] = predicted.index[i].__str__()
        point['value'] = predicted[i]
        point['lower_ci'] = confidence.iloc[i,0]
        point['upper_ci'] = confidence.iloc[i,1]
        projection.append(point)
    entry['projection'] = projection
    data.append(entry)

    current = []
    df_value = df_neighborhood.value
    for i in range(len(df_value)):
        point = {}
        point['date'] = df_value.index[i].__str__()
        point['value'] = df_value[i]
        current.append(point)
    entry['current'] = current

with open('dummy_data.json', 'w') as out_file:
    json.dump(data, out_file)

end = datetime.now()
print('Start time: ' + start.strftime('%H:%M:%S'))
print('End time: ' + end.strftime('%H:%M:%S'))
