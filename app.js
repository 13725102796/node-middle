const Koa = require('koa');
const app = new Koa();
const View = require('./view')

app.use(async ctx => {
  ctx.type = 'html';
  ctx.onerror = ()=>{
    console.log('err111s')
  }
  ctx.body = new View(ctx);

});


app.listen(3000);