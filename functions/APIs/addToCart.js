"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
   const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME, 
    
    Item: {
      customerId: event.requestContext.identity.cognitoIdentityId,
      bookId: data.bookId,
      quantity: data.quantity,
      price: data.price,
    }
  };

  dynamoDb.put(params, (error, data) => {
    
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
