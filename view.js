var Readable = require('stream').Readable;
var util = require('util');
var co = require('co');
var fs = require('fs');

module.exports = View
var options = [
  {id:"A",html:"moduleA",delay:1000},
  {id:"B",html:"moduleB",delay:0},
  {id:"C",html:"moduleC",delay:2000}
];


util.inherits(View, Readable);

function View(context) {
  Readable.call(this, {});

  // render the view on a different loop
  co.call(this, this.render).catch(context.onerror);
}

View.prototype._read = function () {};

View.prototype.render = function () {
  // flush layout and assets
  var layoutHtml = fs.readFileSync(__dirname + "/app/view/layout.html").toString();
  this.push(layoutHtml);
  
  // fetch data and render
  

  const opt = (item) => {
    const that = this
    return new Promise(function (resolve, reject) {
    setTimeout(()=>{
      // if(item.id == 'A') return reject('123456')
      that.push('<script>renderFlushCon("#'+item.id+'","'+item.html+'");</script>');
        resolve(item);
      }, item.delay);
      
    });
  }
  var exec = options.map(function(item){ return opt(item); });
  const flush =  async ()=>{  
    await Promise.all(exec)
    this.push('</body></html>');
        // end the stream
    this.push(null);
  }

  flush()

  
  
};