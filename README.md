# Ninsho
[![Build Status](https://travis-ci.org/JacobV90/ninsho.svg?branch=master)](https://travis-ci.org/JacobV90/ninsho)
[![Coverage Status](https://coveralls.io/repos/github/JacobV90/ninsho/badge.svg?branch=master)](https://coveralls.io/github/JacobV90/ninsho?branch=master)

## Installation 
```sh
yarn add ninsho
```
## Usage
### Javascript
```javascript
const Koa = require('koa');
const { Ninsho } = require('ninsho');
const app = new Koa();

const ninsho = new Ninsho({
    "domain": "your-domain.auth0.com",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret-shhh"
});

app.use(ninsho.mountApi());
app.listen(3000);
```

### TypeScript
```typescript
import * as Koa from 'koa';
import { Ninsho } from 'ninsho';
const app = new Koa();

const ninsho = new Ninsho({
    "domain": "your-domain.auth0.com",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret-shhh"
});

app.use(ninsho.mountApi());
app.listen(3000);
```
