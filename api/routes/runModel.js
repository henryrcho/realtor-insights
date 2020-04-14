const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');


// GET method route for running the model and returning results
router.get('/', function(req, res, next) {
    runScript(
        req.query.age, 
        req.query.race,
        req.query.occupation,
        req.query.income,
        req.query.bedrooms,
        req.query.vehicles,
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
    // TODO: replace ./script1.py with pickled knn model
    const process = spawn('python', ['./script1.py', age, race, occupation, income, bedrooms, vehicles]);
    
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
