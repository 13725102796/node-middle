const Readable = require('stream').Readable;
// var util = require('util');
const fs = require('fs');
// var co = require('co');
var options = [{
    id: "A",
    html: "moduleA",
    delay: 1000
  },
  {
    id: "B",
    html: "moduleB",
    delay: 0
  },
  {
    id: "C",
    html: "moduleC",
    delay: 2000
  }
];
// let stateA = false
class View extends Readable {
  // static stateA = false
  constructor(ctx,filePath) {
    super({objectMode: true});
    // this.ctx = ctx
    this.filePath = filePath
    this.stateA = false
    this.render(ctx)
    
  }

  _opt(item) {
    const that = this
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        console.log('执行' + item.id)
        if (item.id == 'A' && !that.stateA) {
          that.stateA = true
          setTimeout(()=>{
            that._opt(item)
          },1000)
          console.log("A模块加载失败")
          // reject('A模块加载失败')
          return
        } 
        that.push(  item.html );
        return resolve(item);
      }, item.delay);

    });
  }
  async render(ctx) {
    // var layoutHtml = fs.readFileSync(__dirname + this.filePath).toString();
    

    // fetch data and render
    const objStr = '{ streem: '
    this.push(objStr);
    var exec = options.map((item)=>{
      // 对失败进行处理，让其走成功流程 
      const promise = this._opt(item).catch((err)=>{
        // console.log(err)
        if(err) {ctx.onerror(err)}
          
      })
      return promise
    });
    // console.log('promise.all')
    await Promise.all(exec)
    this.push('}');
    // end the stream
    this.push(null);
    // ctx.status = 200;

  }
  _read(){}


}

module.exports = View