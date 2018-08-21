import * as Koa from 'koa';
import * as mount from 'koa-mount';
import { userAuthApi } from './app';

const app = new Koa();

app.use(mount('/users', userAuthApi));
app.listen(3000);
