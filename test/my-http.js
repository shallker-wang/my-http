var MyHttp = require('../lib/my-http');

describe('MyHttp.constructor', function() {
  var myHttp = new MyHttp();

  it('should has an empty callback stack', function() {
    myHttp.callback.should.eql({});
  })
})

describe('MyHttp.set', function() {

  var myHttp = new MyHttp();

  it('should set an option to option stack', function() {
    myHttp.set('method', 'POST');
    myHttp.option.method.should.eql('POST');
  })

  it('should parse the set of url', function() {
    myHttp.set('url', 'http://www.my-app.com:8080/user/add?user=shallker');
    myHttp.option.protocol.should.eql('http:');
    myHttp.option.hostname.should.eql('www.my-app.com');
    myHttp.option.host.should.eql('www.my-app.com:8080');
    myHttp.option.query.should.eql('user=shallker');
    myHttp.option.path.should.eql('/user/add?user=shallker');
    myHttp.option.pathname.should.eql('/user/add');
    myHttp.option.port.should.eql('8080');
  })

  it('should throw an error when setting a not allowed method', function() {
    (function() {
      myHttp.set('method', 'KILL');
    }).should.throw();
  })
})

describe('MyHttp.initProtocol', function() {
  it('should return the right protocol based on argument', function() {
    var myHttp = new MyHttp();
    myHttp.initProtocol('http:').should.eql(require('http'));
    myHttp.initProtocol('https:').should.eql(require('https'));
  })
})

describe('MyHttp event', function() {
  var myHttp = new MyHttp();
  function onCompelte() {
    var args = [].slice.call(arguments);
    args.unshift('complete');
    return args;
  }

  describe('MyHttp.on', function() {
    it('should set a callback into callback stack', function() {
      myHttp.on('complete', onCompelte);
      myHttp.callback.complete.should.eql(onCompelte);
    })
  })

  describe('MyHttp.trigger', function() {
    it('should trigger an event from callback stack', function() {
      myHttp.trigger('complete', ['a', 'b']).should.eql(['complete', 'a', 'b']);
    })
  })
})

describe('MyHttp request', function() {

  return;
  
  before(function() {
    console.log('create server');
  })

  it('should be able to make a http request', function(done) {
    var myHttp = new MyHttp();
    myHttp.set('url', 'http://127.0.0.1:8787');
    myHttp.set('method', 'GET');
    myHttp.request(function(data, res) {
      console.log(data);
      done();
    })
  })

  it('should be able to make a https request', function(done) {
    var myHttp = new MyHttp();
    myHttp.set('url', 'https://127.0.0.1:8787');
    myHttp.set('method', 'GET');
    myHttp.request(function(data, res) {
      console.log(data);
      done();
    })
  })
})
