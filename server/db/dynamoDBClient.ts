import * as AWS from 'aws-sdk';

// Singleton
let dynamoDBClient: AWS.DynamoDB | undefined;
const getClient = () : AWS.DynamoDB  => {
  if(dynamoDBClient) {
    return dynamoDBClient;
  }

  // process.env.IS_OFFLINE is set by `serverless-offline` (a plugin.)
  const IS_OFFLINE = process.env.IS_OFFLINE;
  if (IS_OFFLINE === 'true') {
    dynamoDBClient = new AWS.DynamoDB({
      endpoint: 'http://localhost:8000',
      region: 'localhost',
    });
  } else {
    dynamoDBClient = new AWS.DynamoDB();
  }

  return dynamoDBClient;
};

const disconnect = () => {
  dynamoDBClient = undefined;
};


export { getClient, disconnect };
