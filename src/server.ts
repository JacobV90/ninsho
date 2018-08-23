import * as Koa from 'koa';
import { Ninsho } from './app';
const config = require('../config.json').auth0;

const app = new Koa();
const ninsho: Ninsho = new Ninsho(config);

app.use(ninsho.mountApi());
app.listen(3000);
