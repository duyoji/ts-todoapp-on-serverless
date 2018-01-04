import { Router } from 'express';
import { getUser, putUser } from './users.controller';

const router = Router();
const END_POINT = '/users';

router.get(`${END_POINT}/:userId`, getUser);
router.post(END_POINT, putUser);

export default router;