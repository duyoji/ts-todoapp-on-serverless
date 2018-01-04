import usersRouter from '../../../routers/api/users.router';
import { getUser, putUser } from '../../../routers/api/users.controller';

describe('routers/api/users.router', () => {
  describe('GET /users/:userId', () => {
    it('should include getUser and putUser as paths', () => {
      const route = usersRouter.stack[0].route;
      expect(route.path).toEqual('/users/:userId');
      expect(route.stack[0].method).toEqual('get');
      expect(route.stack[0].handle).toEqual(getUser);
    });
  });

  describe('POST /users', () => {
    it('should include getUser and putUser as paths', () => {
      const route = usersRouter.stack[1].route;
      expect(route.path).toEqual('/users');
      expect(route.stack[0].method).toEqual('post');
      expect(route.stack[0].handle).toEqual(putUser);
    });
  });
});
