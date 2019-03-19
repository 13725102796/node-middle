const Router = require('koa-router')
const path = require('path')
const router = new Router()
const View = require('./../view1')
const Step = require('./../stepData')

// const { Readable } = require('stream');
const redis = require('redis')
const client = redis.createClient(6379,'127.0.0.1')
client.on('error', function (err) {
  console.log('Error ' + err);
});
function getRedis(name){
  return new Promise((resolve,reject)=>{
    client.get(name, function(err, reply) {
      // reply is null when the key is missing
      if(err || !reply){
        resolve(false)
      } 
      // 延长过期时间
      
      resolve(reply)
    });
  })
}
// function setRedis(name,val){
//   client.get(name, function(err, reply) {
//     // reply is null when the key is missing
//     if(err || !reply){
//       resolve(false)
//     } 
//     resolve(reply)
//   });
// }
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
  .get('/step', async (ctx, next) => {
    // ctx.type = 'html';
    // console.log(ctx.request.url)
    console.log(ctx.originalUrl)
    ctx.type = 'text/plain; charset=utf-8'
    const redisData = await getRedis(ctx.originalUrl)
    if(redisData){
      ctx.body = {
        err_code: 10000,
        result: redisData,
        from: 'redis 输出'
      }
      return 
    } 
      // 获取数据输出
    const data = '这是test数据'
    client.set(ctx.originalUrl, data , 'EX', 3600*72)
    ctx.body = {
      err_code: 10000,
      result: data,
      from: '非redis 输出'
    }
  
    
    
    // filePath 当前文件路径
    

    
    // next()

    // ctx.body = {
    //   msg: 'yes'
    // }
  })

module.exports = router
