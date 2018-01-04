// How to test with serverless-dynamodb-local
// https://medium.com/99xtechnology/serverless-dynamodb-local-unit-testing-619151fb8641
import chai = require('chai');
import chaiHttp = require('chai-http');
import { DynamoDB } from 'aws-sdk';
import { getDynamoDBInstance } from '../../../db/dynamoDB';
import app from '../../../server';

const DUMMY_USER_ID = 'dummyuserid';
const DUMMY_USER_NAME = 'dummyusername';
const END_POINT = '/api/users';
const TABLE_NAME = 'DUMMY_USERS_TABLE';
const PORT = 9999;
const server = app.listen(PORT);

chai.use(chaiHttp);

describe('server/routers/api/users.controller', () => {
  let dbClient;
  beforeAll((done) => {
    process.env.IS_OFFLINE = 'true';
    dbClient = getDynamoDBInstance();
    createUsersTable(dbClient, () => {
      done();
    });
  });

  afterAll((done) => {
    deleteUsersTable(dbClient, () => {
      server.close(done);
    });
  });

  describe('GET /users/:userId (`getUser` handler)', () => {
    describe('If process.env.USERS_TABLE is undefined', () => {
      beforeAll(() => {
        process.env.USERS_TABLE = undefined;
      });

      it('returns 400 error with a message "Could not find USERS_TABLE"', (done) => {
        chai.request(server)
          .get(`${END_POINT}/${DUMMY_USER_ID}`)
          .set(
            'Content-Type', 'application/json'
          )
          .end((err, res) => {
            expect(err.status).toEqual(400);
            expect(err.response.body.error).toEqual('Could not find USERS_TABLE');
            done();
          });
      });
    });

    describe('If process.env.USERS_TABLE is defined but the table does not exist in db.', () => {
      beforeAll(() => {
        process.env.USERS_TABLE = 'INVALID_TABLE';
      });

      it('returns 400 error with a message "Could not get user"', (done) => {
        chai.request(server)
          .get(`${END_POINT}/${DUMMY_USER_ID}`)
          .set(
            'Content-Type', 'application/json'
          )
          .end((err, res) => {
            expect(err.status).toEqual(400);
            expect(err.response.body.error).toEqual('Could not get user');
            done();
          });
      });
    });

    describe('If process.env.USERS_TABLE is defined', () => {
      beforeAll(() => {
        process.env.USERS_TABLE = TABLE_NAME;
      });

      it('returns 404 error with a message "User not found"', (done) => {
        chai.request(server)
          .get(`${END_POINT}/${DUMMY_USER_ID}`)
          .set(
            'Content-Type', 'application/json'
          )
          .end((err, res) => {
            expect(err.status).toEqual(404);
            expect(err.response.body.error).toEqual('User not found');
            done();
          });
      });
    });
  });

  describe('POST /users (`putUser` handler)', () => {
    const createUserData = (userId, name) => ({userId, name});

    describe('If process.env.USERS_TABLE is undefined', () => {
      beforeAll(() => {
        process.env.USERS_TABLE = undefined;
      });

      it('returns 400 error with a message "Could not find USERS_TABLE"', (done) => {
        chai.request(server)
          .post(`${END_POINT}`)
          .set('Content-Type', 'application/json')
          .send(createUserData(DUMMY_USER_ID, DUMMY_USER_NAME))
          .end((err, res) => {
            expect(err.status).toEqual(400);
            expect(err.response.body.error).toEqual('Could not find USERS_TABLE');
            done();
          });
      });
    });

    describe('If process.env.USERS_TABLE is defined but the table does not exist in db.', () => {
      beforeAll(() => {
        process.env.USERS_TABLE = 'INVALID_TABLE';
      });

      it('returns 400 error with a message "Could not create user"', (done) => {
        chai.request(server)
          .post(`${END_POINT}`)
          .set('Content-Type', 'application/json')
          .send(createUserData(DUMMY_USER_ID, DUMMY_USER_NAME))
          .end((err, res) => {
            expect(err.status).toEqual(400);
            expect(err.response.body.error).toEqual('Could not create user');
            done();
          });
      });
    });

    describe('If process.env.USERS_TABLE is defined', () => {
      beforeAll(() => {
        process.env.USERS_TABLE = TABLE_NAME;
      });

      it('returns user data when creating a new user succeeded.', (done) => {
        chai.request(server)
          .post(`${END_POINT}`)
          .set('Content-Type', 'application/json')
          .send(createUserData(DUMMY_USER_ID, DUMMY_USER_NAME))
          .end((err, res) => {
            expect(err).toEqual(null);
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(createUserData(DUMMY_USER_ID, DUMMY_USER_NAME));

            chai.request(server)
              .get(`${END_POINT}/${DUMMY_USER_ID}`)
              .set('Content-Type', 'application/json')
              .end((err, res) => {
                expect(err).toEqual(null);
                expect(res.status).toEqual(200);
                expect(res.body).toEqual({
                  userId: DUMMY_USER_ID,
                  name: DUMMY_USER_NAME
                });
                done();
              });
          });
      });
    });
  });
});

const createUsersTable = (dynamoDB: AWS.DynamoDB, callback) => {
  const params = {
    TableName: TABLE_NAME,
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  };
  dynamoDB.createTable(params, (err, data) => {
    if(err) {
      console.error(err, 'in createUsersTable function');
    }
    callback();
  });
};

const deleteUsersTable = (dynamoDB: AWS.DynamoDB, callback) => {
  const params = {
    TableName: TABLE_NAME,
  };
  dynamoDB.deleteTable(params, (err, data) => {
    if(err) {
      console.error(err, 'in deleteUsersTable function');
    }
    callback();
  });
};