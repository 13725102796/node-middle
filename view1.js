const Readable = require('stream').Readable;
var util = require('util');
const fs = require('fs');
var co = require('co');
var options = [
  { id: "A", html: "moduleA", delay: 1000 },
  { id: "B", html: "moduleB", delay: 0 },
  { id: "C", html: "moduleC", delay: 2000 }
];

class View extends Readable {
  constructor(opt) {
    super(opt);
  }
  _opt(item) {
    // const that = this

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // if(item.id == 'A') return reject('123456')
        this.push('<script>renderFlushCon("#' + item.id + '","' + item.html + '");</script>');
        resolve(item);
      }, item.delay);

    });
  }
  async _flushable() {

    var layoutHtml = fs.readFileSync(__dirname + "/app/view/layout.html").toString();
    this.push(layoutHtml);

    // fetch data and render


    const opt = (item) => {
      const that = this
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          // if(item.id == 'A') return reject('123456')
          that.push('<script>renderFlushCon("#' + item.id + '","' + item.html + '");</script>');
          resolve(item);
        }, item.delay);

      });
    }
    var exec = options.map(function (item) { return opt(item); });
    const flush = async () => {
      await Promise.all(exec)
      this.push('</body></html>');
      // end the stream
      this.push(null);
    }

    flush()

  }
  _read() {

  }

}
co.call(View, this._flushable)
// util.inherits(View, Readable);

module.exports = View