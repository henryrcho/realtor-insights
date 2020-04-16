const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');


// Dictionaries to translate input for model
const ageDict = {'20-24': 0, '25-34': 1, '35-44': 2, '45-54': 3, '55-59': 4, '60-64': 5, '65-74': 6, '75-84': 7, '85+': 8};
const raceDict = {'Hispanic': 0, 'Caucasian': 1, 'African American': 2, 'Asian': 3, 'Other': 4};
const occupationDict = {
    'Agriculture, forestry, fishing, hunting, or mining': 0, 
    'Construction': 1,
    'Manufacturing': 2, 
    'Wholesale trade':3, 
    'Retail trade':4, 
    'Transportation, warehousing, or utilities': 5,
    'Information': 6, 
    'Finance, insurance, real estate, or rental & leasing': 7, 
    'Professional, scientific, management, administrative, or waste management services': 8,
    'Educational services, health care, or social assistance': 9, 
    'Arts, entertainment, recreation, accommodation, or food services':10,
    'Other services, except public administration': 11, 
    'Public administration': 12
};
const incomeDict = {
    'Less than $10,000': 0, 
    '$10,000 to $14,999': 1, 
    '$15,000 to $24,999': 2, 
    '$25,000 to $34,999': 3, 
    '$35,000 to $49,999': 4, 
    '$50,000 to $74,999': 5, 
    '$75,000 to $99,999': 6, 
    '$100,000 to $149,999': 7, 
    '$150,000 to $199,999': 8, 
    '$200,000 or more': 9
};
const bedroomDict = {'0 bedrooms': 0, '1 bedroom': 1, '2 bedrooms': 2, '3 bedrooms': 3, '4 bedrooms': 4, '5 or more bedrooms': 5};
const vehicleOptions = {'0 vehicles': 0, '1 vehicle': 1, '2 vehicles': 2, '3 or more vehicles': 3};

// GET method route for running the model and returning results
router.get('/', function(req, res, next) {
    if (!((req.query.age in ageDict) && (req.query.race in raceDict) && (req.query.occupation in occupationDict) &&
        (req.query.income in incomeDict) && (req.query.bedrooms in bedroomDict) && (req.query.vehicles in vehicleOptions))) {
        return res.status(500).send('Invalid query parameters.')
    }

    runScript(
        ageDict[req.query.age], 
        raceDict[req.query.race],
        occupationDict[req.query.occupation],
        incomeDict[req.query.income],
        bedroomDict[req.query.bedrooms],
        vehicleOptions[req.query.vehicles],
        res
    );
});

/**
 * Send user input to model, process, and return results
 * @param {*} age User age
 * @param {*} race User race
 * @param {*} occupation User occupation
 * @param {*} income User income
 * @param {*} bedrooms User number of bedrooms
 * @param {*} vehicles User number of vehicles
 * @param {*} res Response for request
 */
function runScript(age, race, occupation, income, bedrooms, vehicles, res) {
    var jsonData = [];
    const process = spawn('python3', ['./knn_script.py', age, race, occupation, income, bedrooms, vehicles]);
    
    process.stdout.on('data', function(data) {
        return jsonData.push(data);
    });

    process.stdout.on('close', function(code) {
        console.log('child process close all stdio with code', code);
        return res.send(jsonData.join(""));
    });

    process.stderr.on('data', function(data){
        return res.send(data.toString());
    });
}

module.exports = router;
