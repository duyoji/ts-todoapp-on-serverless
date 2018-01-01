import app from '../server';

describe('server/server.ts', () => {
  it('should export default app.', () => {
    expect(typeof app).toEqual('function');

  });
});
