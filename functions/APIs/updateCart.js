"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
  
 
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME,
   
    Key: {
      customerId: event.requestContext.identity.cognitoIdentityId,
      bookId: data.bookId
    },
    
    UpdateExpression: "SET quantity = :quantity",
    ExpressionAttributeValues: {
      ":quantity": data.quantity
    },
    ReturnValues: "ALL_NEW"
  };
 
  dynamoDb.update(params, (error, data) => {
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
      headers: headers
    };
    callback(null, response);
  });
}   
