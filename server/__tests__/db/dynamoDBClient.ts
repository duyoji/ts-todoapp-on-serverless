import { getClient, disconnect } from '../../db/dynamoDBClient';

describe('db/dynamoDBClient', () => {
  afterEach(() => {
    disconnect();
  });

  describe('When process.env.IS_OFFLINE is true', () => {
    it('should set localhost as a region.', () => {
      process.env.IS_OFFLINE = 'true';
      const dynamoDB = getClient();
      expect(dynamoDB.config.endpoint).toEqual('http://localhost:8000');
      expect(dynamoDB.config.region).toEqual('localhost');
    });
  });

  describe('When process.env.IS_OFFLINE is false', () => {
    it('should set no options', () => {
      process.env.IS_OFFLINE = 'false';
      const dynamoDB = getClient();
      expect(dynamoDB.config.endpoint).toEqual('dynamodb.undefined.amazonaws.com');
      expect(dynamoDB.config.region).toEqual(undefined);
    });
  });
});
