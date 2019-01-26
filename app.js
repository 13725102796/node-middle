const Koa = require('koa');
const app = new Koa();


const router = require('./app/router')

app.use(router.routes())
   .use(router.allowedMethods())


app.use(async ctx => {
  
});



app.listen(3000);