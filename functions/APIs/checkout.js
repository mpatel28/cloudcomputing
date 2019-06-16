"use strict";

const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {

  
  
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.ORDERS_TABLE, 
    Item: {
      customerId: event.requestContext.identity.cognitoIdentityId,
      orderId: uuid.v1(),
      orderDate: Date.now(),
      books: data.books,
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
 
  
  let deleteParam = {}
  data.books.forEach( function(item) {
    deleteParam = {
      TableName: process.env.CART_TABLE,
      Key: {
        customerId: event.requestContext.identity.cognitoIdentityId,
        bookId: item.bookId
      }
    }
 
    dynamoDb.delete(deleteParam, (error, data) => {
     
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
  });      
}
