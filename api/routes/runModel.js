const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');


// GET method route for running the model and returning results
router.get('/', function(req, res, next) {
    runScript(req.query.age, req.query.race, res);
});

function runScript(age, race, res) {
    var jsonData = [];
    const process = spawn('python', ['./script1.py', age, race]);
    
    process.stdout.on('data', function(data) {
        jsonData.push(data);
    });

    process.stderr.on('data', function(data){
        res.send(data.toString());
    });

    process.stdout.on('close', function(code) {
        console.log('child process close all stdio with code', code);
        res.send(jsonData.join(""));
    })
}

module.exports = router;
