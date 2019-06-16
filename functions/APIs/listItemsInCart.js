"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
  
  

  const params = {
    TableName: process.env.TABLE_NAME, 
    KeyConditionExpression: "customerId = :customerId",
    ExpressionAttributeValues: {
      ":customerId": event.requestContext.identity.cognitoIdentityId
    }
  };

  dynamoDb.query(params, (error, data) => {
    
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials" : true
    };

    
    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: error
      };
      callback(null, response);
      return;
   }

    
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(data.Items)
    };
    callback(null, response);
  });
}
