const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve) => {
    subscribers.push(resolve);
  });

  const message = await promise;

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message) {
    subscribers.forEach((resolve) => {
      resolve(message);
    });

    subscribers = [];

    ctx.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
