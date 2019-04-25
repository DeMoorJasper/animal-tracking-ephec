const AWS = require("./aws");
const uuidv4 = require("uuid/v4");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getAll() {
  let params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  let result = await dynamoDb
    .scan({
      TableName: process.env.DYNAMODB_TABLE
    })
    .promise();

  return result.Items;
}

async function add(locationData) {
  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: locationData
  };

  return dynamoDb.put(params).promise();
}

exports.getAll = getAll;
exports.add = add;
