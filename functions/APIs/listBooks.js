"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
  
 
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials" : true
  };

  
  if (event.queryStringParameters) {
    const params = {
      TableName: process.env.TABLE_NAME, 
      IndexName: "category-index",
     
      KeyConditionExpression: "category = :category",
      ExpressionAttributeValues: {
        ":category": event.queryStringParameters.category
      }
    };
    dynamoDb.query(params, (error, data) => {
      
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
  
 else {
    const params = {
      TableName: process.env.TABLE_NAME 
    };
 
    dynamoDb.scan(params, (error, data) => {
      
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
}
