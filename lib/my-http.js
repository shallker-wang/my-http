/* @author shallker.wang@profero.com */

var HTTP = require('http'),
    HTTPS = require('https'),
    URL = require('url'),
    Bupper = require('bupper');

/* my node http interface */
function MyHttp() {

  var debug = false;
  var log = function() {
    if (debug) console.log.apply(console, [].slice.call(arguments));
  }

  var self = this;

  this.methodsAllowed = ['GET', 'POST', 'DELETE', 'PUT', 'UPDATE'];
  this.callback = {};
  this.option = {
    'method': 'GET'
  };

  /* set request options */
  this.set = function(name, value) {
    if (this.set[name]) return this.set[name](value);
    this.option[name] = value;
    return this;
  }

  /* parse url setting */
  this.set.url = function(url) {
    var parse = URL.parse(url);
    self.set('protocol', parse.protocol);
    self.set('hostname', parse.hostname);
    self.set('host', parse.host);
    self.set('port', parse.port);
    self.set('path', parse.path);
    self.set('query', parse.query);
    return self;
  }

  /* filter method setting */
  this.set.method = function(method) {
    if (self.methodsAllowed.indexOf(method) === -1) {
      throw new Error('method ' + method + ' is not allowed');
    }
    self.option.method = method;
    return self;
  }

  /* transform object data to chunk string */
  this.set.data = function(data) {
    if (typeof data === 'object') {
      data = JSON.parse(data);
    }
    this.option.data = data;
    return self;
  }

  /* set request header */
  this.setHeader = function(name, value) {
    if (! this.option.headers) this.option.headers = {};
    this.option.headers[name] = value;
  }

  /* 
   * register event listener
   * available events, 'error', 'response', 'complete'
   */
  this.on = function(event, callback) {
    this.callback[event] = callback;
  }

  this.initProtocol = function(protocol) {
    if (protocol === 'https:') {
      return HTTPS;
    }
    return HTTP;
  }

  this.request = function(onComplete) {
    log('this.option', this.option);
    if (onComplete === undefined) {
      this.callback.complete = this.callback.complete || function() {};
    } else {
      this.callback.complete = onComplete;
    }
    var protocol = this.initProtocol(this.option.protocol);
    var req = protocol.request(this.option, this.onResponse.bind(this));
    req.on('error', this.onError.bind(this));
    if (this.option.data) req.write(this.option.data);
    req.end();
  }

  /* request response callback */
  this.onResponse = function(res) {
    this.trigger('response', res.statusCode, res);
    res.on('data', function(chunk) {
      Bupper.add(chunk);
    })
    res.on('end', function() {
      var buff = Bupper.combine();
      self.trigger('complete', [buff.toString(), res]);
    })
  }

  /* request error callback */
  this.onError = function() {
    this.trigger('error', arguments);
  }

  /* trigger an event from callback stack */
  this.trigger = function(ev, args) {
    var callback;
    if (callback = this.callback[ev]) {
      return callback.apply(this, args);
    }
  }

  /* enable verbose mode */
  this.debug = function(set) {
    if (set) debug = true;
  }
}

module.exports = MyHttp;
