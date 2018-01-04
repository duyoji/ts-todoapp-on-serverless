import * as AWS from 'aws-sdk';

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDBClient: AWS.DynamoDB.DocumentClient;
if (IS_OFFLINE === 'true') {
  dynamoDBClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:8000',
    region: 'localhost',
  });
} else {
  dynamoDBClient = new AWS.DynamoDB.DocumentClient();
}

export default dynamoDBClient;
