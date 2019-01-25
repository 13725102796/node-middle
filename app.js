const Koa = require('koa');
const app = new Koa();
const View = require('./view1')

app.use(async ctx => {
  ctx.type = 'html';
  // console.log('koa')
  ctx.onerror = (err)=>{
    if(err) console.log('err',err)
    
  }
  
  ctx.body = new View(ctx);

});



app.listen(3000);