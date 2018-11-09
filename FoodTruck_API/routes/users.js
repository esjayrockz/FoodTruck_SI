const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

let awsConfig = {
    "region" : "us-east-1",
    "endPoint" : "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId" : "",
    "secretAccessKey" : ""
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

const CUSTOMER_TABLE = "customertable";

//GET /users/:userName
router.get('/:userName', function(req, res) {
    const userName = req.params.userName;
    console.log('reading user data' , userName);
    let userData = {
        TableName : CUSTOMER_TABLE,
        Key: {
            "username" : userName
        }
    };
    docClient.get(userData, function(err, result) {
        if(err){
            console.log('Error retrieving user information' , err);
            res.status(500).json({
                error:err,
                message : 'Error reading user information'
            });
        }else{
            console.log('User data read successfully', result);
            if(Object.keys(result).length === 0 && result.constructor === Object){
                res.status(200).json({
                    message : 'User doesnt exist',
                    result : false
                });
            }
            else {
                res.status(200).json({
                    message : 'Success',
                    result
                });
            }
        }
    });
});

//POST /users
router.post('/', function(req, res) {
    console.log('inserting user data' , req.body);
    let newUser = {
        "username" : req.body.username,
        "email" : req.body.email
    };
    let insertData = {
        TableName: CUSTOMER_TABLE,
        Item: newUser,
        ReturnValues: 'ALL_OLD'
    };
    docClient.put(insertData, function(err, result){
        console.log(result);
        if(err){
            console.log('Error inserting user information' , err);
            res.status(500).json({
                error:err,
                message : 'Error inserting user information'
            });
        }else{
            console.log('User data inserted successfully', JSON.stringify(result, null, 2));
            res.status(200).json({
                message : 'Success',
                result
            });
        }
    });
});

router.delete('/:userName', function(req, res) {
    const userName = req.params.userName;
    console.log('Inside delete user ', userName);
    let deleteData = {
        TableName : CUSTOMER_TABLE,
        Key : {
            "username" : userName
        }
    };
    docClient.delete(deleteData, function(err,result){
        if(err){
            console.log('Error deleting user ', err);
            res.status(500).json({
                message : 'Error deleting user',
                error: err
            });
        }else{
            console.log('Delete user success' , result);
            res.status(200).json({
                message : 'Delete user success',
                result : result
            });
        }
    });
});

module.exports = router;
