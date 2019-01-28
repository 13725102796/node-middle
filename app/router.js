const Router = require('koa-router')
const path = require('path')
const router = new Router()
const View = require('./../view1')

router
  .get('/', (ctx) => {
    ctx.body = 'hello koa'
  })
  .get('/index', (ctx, next) => {
    ctx.type = 'html';
    ctx.onerror = (err)=>{
      if(err) console.log('err',err)
    }
    // filePath 当前文件路径
    ctx.body = new View(ctx,'/app/view/layout.html');
    // ctx.body = "hello index，这是index哦"
  })

module.exports = router
