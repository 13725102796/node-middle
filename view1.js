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

class View extends Readable {
  constructor(ctx) {
    super(ctx);
    // this.ctx = ctx

    this.render(ctx)
  }

  _opt(item) {
    const that = this
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        console.log('执行' + item.id)
        if (item.id == 'A') return reject('A模块加载失败')
        that.push('<script>renderFlushCon("#' + item.id + '","' + item.html + '");</script>');
        return resolve(item);
      }, item.delay);

    });
  }
  async render(ctx) {
    var layoutHtml = fs.readFileSync(__dirname + "/app/view/layout.html").toString();
    this.push(layoutHtml);

    // fetch data and render

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
    this.push('</body></html>');
    // end the stream
    this.push(null);


  }
  _read() {

  }

}

module.exports = View