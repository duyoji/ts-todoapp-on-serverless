import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk/lib/error';
import { GetItemOutput, GetItemInput, PutItemInput, PutItemOutput } from 'aws-sdk/clients/dynamodb';

const USERS_TABLE = process.env.USERS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb: AWS.DynamoDB.DocumentClient;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};


const app = express();

app.use(bodyParser.json({ strict: false }));

// Get User endpoint
app.get('/users/:userId', (req, res) => {
  if(!USERS_TABLE) {
    res.status(400).json({ error: 'Could not find USERS_TABLE' });
    return;
  }

  const params: GetItemInput = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    }
  };

  const getPromise = dynamoDb.get(params).promise();
  getPromise.then((data: GetItemOutput) => {
    if (data.Item) {
      const {userId, name} = data.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }).catch((error: AWSError) => {
    console.error(error);
    res.status(400).json({ error: 'Could not get user' });
  });
});

// Create User endpoint
app.post('/users', (req, res) => {
  if(!USERS_TABLE) {
    res.status(400).json({ error: 'Could not find USERS_TABLE' });
    return;
  }

  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params: PutItemInput = {
    TableName: USERS_TABLE,
    Item: { userId, name }
  };
  const putPromise = dynamoDb.put(params).promise();
  putPromise.then((data: PutItemOutput) => {
    res.json({ userId, name });
  }).catch((error: AWSError) => {
    console.log(error);
      res.status(400).json({ error: 'Could not create user' });
  });
})

export default app;
