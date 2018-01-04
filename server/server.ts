import * as express from 'express';
import * as bodyParser from 'body-parser';
import apiUsersRouter from './routers/api/users.router';

const app = express();
app.use('/api', [
  bodyParser.json({ strict: false }),
  apiUsersRouter
]);

export default app;
