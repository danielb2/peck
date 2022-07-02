## peck [![Build Status](https://travis-ci.org/danielb2/peck.svg?branch=master)](https://travis-ci.org/danielb2/peck)

Require multiple files in a directory

### Peck(dirname, [options])

Peck reads in a directory and transform all files into camelCase based on
filename rules using proper underscores. hello_world.js, and hello-world.js become helloWorld.

For a directory controllers containing a filename status.js, foo/bar.js among others:

```javascript
var Controllers = Peck(__dirname + "/controllers", {
    include: "foo_bar.js",
});
console.log(Controllers); //  => { fooBar: require('foo/bar.js') }

var Controllers = Peck(__dirname + "/controllers", {});
console.log(Controllers); //  => { fooBar: require('foo/bar.js'), status: require('status.js') }

var Controllers = Peck(__dirname + "/controllers", {
    exclude: "status.js",
});
console.log(Controllers); //  => { fooBar: require('foo/bar.js') }
```

note that if you have a structure such as `controllers/users/login.js` and
`controllers/users.js` which has a module.exports.logout function, the
respective objects will be merged to contain both a login and a logout function.
If the users.js has `modules.exports = []` the array will completely be ignored
since objects can't merge with arrays.

#### Options

Where options is an object with the following properties:

-   `include` - Array or string of specific files to include. Optional
-   `exclude` - Array or string of specific files to exclude. Optional
