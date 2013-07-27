my-http
==========

My Node http interface.

## Installation
Use npm:
```shell
npm install git://github.com/shallker-wang/my-http.git
```

Or add to your package dependencies:
```json
{
  "dependencies": {
    "my-http": "git://github.com/shallker-wang/my-http.git"
  }
}
```

## Quick Start
Require and create an instance of `MyHttp`:
```javascript
var MyHttp = require('my-http');
var http = new MyHttp();
var data = JSON.stringify({name: 'Curry Chicken'});
http.set('url', 'http://site.com/api/food/');
http.set('method', 'POST');
http.set('data', data);
http.setHeader('Content-Type', 'application/json;charset=utf-8');
http.setHeader('Content-Length', data.length);
http.on('error', function(err) {
  console.log('Handling error');
});
http.on('complete', onComplete);
http.request(onComplete);
function onComplete(result, res) {
  console.log('Done');
}
```

## APIs
Set URL:
```javascript
http.set('url', 'http://site.com/api/user');
```

Set method:
```javascript
http.set('method', 'POST');
```

Set data:
```javascript
http.set('data', 'Hello, World!');
```

Set a header:
```javascript
http.setHeader('Content-Type', 'application/json');
```

Set event listeners:
```javascript
http.on('error', function(err) {})
http.on('response', function(res) {})
http.on('complete', function(data) {})
```

Make a request:
```javascript
http.request();
```

## Todo
* ~~write a test~~
