const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');


// Configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});
const s3 = new AWS.S3();

// GET method route for downloading/retrieving file
router.get('/:file_name', function(req, res, next) {
  retrieveFile(req.params.file_name, res);
});

/**
 * Retrieve file from AWS S3 instance, and return json representation
 * @param {*} filename file to retrieve
 * @param {*} res json object
 */
function retrieveFile(filename, res){
  // Configuring parameters
  const getParams = {
    Bucket: process.env.S3_BUCKET,
    Key: filename
  };

  s3.getObject(getParams, function(err, data) {
    // Handle error
    if (err){
      return res.status(400).send({ success:false, err:err });
    }
    // Success
    else {
      return res.send(data.Body.toString());
    }
  });
}

module.exports = router;
