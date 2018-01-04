import { getClient as getDynamoClient } from '../../db/dynamoDBClient';
import { GetItemOutput, GetItemInput, PutItemInput, PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { Request, Response } from 'express';

const getUser = (req: Request, res: Response) => {
  const usersTable = process.env.USERS_TABLE;
  if(!usersTable) {
    res.status(400).json({ error: 'Could not find USERS_TABLE' });
    return;
  }

  const params: GetItemInput = {
    TableName: usersTable,
    Key: {
      userId: {'S': req.params.userId},
    }
  };

  const getPromise = getDynamoClient().getItem(params).promise();
  getPromise.then((data: GetItemOutput) => {
    if (data.Item) {
      const {userId, name} = data.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }).catch((error: AWSError) => {
    res.status(400).json({ error: 'Could not get user' });
  });
};

const putUser = (req: Request, res: Response) => {
  const usersTable = process.env.USERS_TABLE;
  if(!usersTable) {
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
    TableName: usersTable,
    Item: {
      userId: {'S': userId},
      name: {'S': name}
    }
  };
  const putPromise = getDynamoClient().putItem(params).promise();
  putPromise.then((data: PutItemOutput) => {
    res.json({ userId, name });
  }).catch((error: AWSError) => {
    console.log(error);
    res.status(400).json({ error: 'Could not create user' });
  });
};

export { getUser, putUser };