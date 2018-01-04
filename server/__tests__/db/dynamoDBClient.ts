import { getClient, disconnect } from '../../db/dynamoDBClient';

describe('db/dynamoDBClient', () => {
  afterEach(() => {
    disconnect();
  });

  describe('When process.env.IS_OFFLINE is true', () => {
    it('should set localhost as a region.', () => {
      process.env.IS_OFFLINE = 'true';
      const dynamoDB = getClient();
      expect(dynamoDB.options.endpoint).toEqual('http://localhost:8000');
      expect(dynamoDB.options.region).toEqual('localhost');
    });
  });

  describe('When process.env.IS_OFFLINE is false', () => {
    it('should set no options', () => {
      process.env.IS_OFFLINE = 'false';
      const dynamoDB = getClient();
      expect(dynamoDB.options.endpoint).toEqual(undefined);
      expect(dynamoDB.options.region).toEqual(undefined);
    });
  });
});
