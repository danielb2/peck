## peck

Require multiple files in a directory

### Peck(dirname, [options])

Peck reads in a directory and transform all files into camelCase based on
filename rules using proper underscores. hello_world.js becomes helloWorld.

``` javascript
var Controllers = Peck(__dirname + '/controllers');

hapiServer.route({ path: '/generate-categories/status', method: 'GET', config: Controllers.status });
```

#### Options

Where options is an object with the following properties:

* `include` - Array or string of specific files to include. Optional
* `exclude` - Array or string of specific files to exclude. Optional


