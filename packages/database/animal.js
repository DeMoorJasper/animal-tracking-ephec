const AWS = require("./aws");
const uuidv4 = require("uuid/v4");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_TYPE = "animal";

async function getAll() {
  let params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  let result = await dynamoDb
    .query({
      TableName: process.env.DYNAMODB_TABLE,
      ExpressionAttributeNames: {
        "#t": "type"
      },
      ExpressionAttributeValues: {
        ":t": TABLE_TYPE
      },
      KeyConditionExpression: "#t = :t"
    })
    .promise();

  return result.Items;
}

async function add(animalData) {
  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: Object.assign({ type: TABLE_TYPE, id: uuidv4() }, animalData)
  };

  return dynamoDb.put(params).promise();
}

exports.getAll = getAll;
exports.add = add;
