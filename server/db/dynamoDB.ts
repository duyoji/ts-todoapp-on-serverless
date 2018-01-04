import * as AWS from 'aws-sdk';

// Singleton
let dynamoDB: AWS.DynamoDB | undefined;
const getDynamoDBInstance = () : AWS.DynamoDB  => {
  if(dynamoDB) {
    return dynamoDB;
  }

  // process.env.IS_OFFLINE is set by `serverless-offline` (a plugin.)
  const IS_OFFLINE = process.env.IS_OFFLINE;
  if (IS_OFFLINE === 'true') {
    dynamoDB = new AWS.DynamoDB({
      endpoint: 'http://localhost:8000',
      region: 'localhost',
    });
  } else {
    dynamoDB = new AWS.DynamoDB();
  }

  return dynamoDB;
};

const disconnect = () => {
  dynamoDB = undefined;
};


export { getDynamoDBInstance, disconnect };
