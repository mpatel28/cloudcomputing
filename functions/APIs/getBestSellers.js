"use strict";

const redis = require("redis");


exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    console.log("Creating client.");
    var redisClient = redis.createClient(6379, process.env.URL, {no_ready_check: true}); 
    console.log("Client created.");
    
    redisClient.on("error", function (err) {
      console.log("Redis error encountered", err);
    });
    
    redisClient.on("end", function() {
      console.log("Redis connection closed");
    });
    
    var key = "TopBooks:AllTime"

    
    redisClient.zrevrange(key, 0, 19, (error, members) => {
      
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
        body: JSON.stringify(members)
      };
      callback(null, response);
    });
}
