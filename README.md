# JSON Hide [![Build Status](https://img.shields.io/travis/megglymark/json-hide.svg)](http://travis-ci.org/megglymark/json-hide) [![NPM version](https://img.shields.io/npm/v/@megglymark/json-hide.svg)](https://www.npmjs.com/package/@megglymark/json-hide) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This is a fork of [JSON Mask](https://github.com/nemtsov/json-mask)

While JSON Mask is used for selecting specific values in a object/array, JSON Hide is used for hiding that value. \
This is useful if you come across a situation where you may want to log data but don't want to reveal sensitive information


```js
var hide = require('@megglymark/json-hide');
hide({ p: { a: 1, b: 2 }, z: 1 }, 'p/a,z'); // {p: {a: '********', b: 2}, z: '********'}
```

If you've used the Google APIs, and provided a `?fields=` query-string to get a
[Partial Response](https://developers.google.com/+/api/#partial-responses), you've
already used this language.

## Installation
```
npm install --save @megglymark/json-hide
```
## Usage
```javascript
hide(object, mask, [replacement])
```
 - `object (Object)` - Original object with values to be hidden.
 - `mask (string)` - Masking string used to determine which values should be hidden. [Syntax](##Syntax)
 - `[replacement] (string)` - Value that will be used to mask values. **Default:** `********`
 - Returns: `Object` - Object with with replaced values based on the mask string.

## Syntax

The syntax is loosely based on XPath:

- `a,b,c` comma-separated list will select multiple fields
- `a/b/c` path will select a field from its parent
- `a(b,c)` sub-selection will select many fields from a parent
- `a/*/c` the star `*` wildcard will select all items in a field

Take a look at `test/index-test.js` for examples of all of these and more.

## Grammar

```
  Props ::= Prop | Prop "," Props
   Prop ::= Object | Array
 Object ::= NAME | NAME "/" Object
  Array ::= NAME "(" Props ")"
   NAME ::= ? all visible characters ?
```

## Examples

Identify the fields you want to keep:

```js
var fields = 'url,object(content,attachments/url)';
```

From this sample object:

```js
var originalObj = {
  id: 'z12gtjhq3qn2xxl2o224exwiqruvtda0i',
  url: 'https://plus.google.com/102817283354809142195/posts/F97fqZwJESL',
  object: {
    objectType: 'note',
    content:
      'A picture... of a space ship... launched from earth 40 years ago.',
    attachments: [
      {
        objectType: 'image',
        url: 'http://apod.nasa.gov/apod/ap110908.html',
        image: { height: 284, width: 506 }
      }
    ]
  },
  provider: { title: 'Google+' }
};
```

Here's what you'll get back:

```js
var expectObj = {
  id: 'z12gtjhq3qn2xxl2o224exwiqruvtda0i',
  url: '********',
  object: {
    objectType: 'note',
    content: '********',
    attachments: [
      {
        objectType: 'image',
        url: '********'
        image: { height: 284, width: 506 }
      }
    ]
  }
  provider: {title: 'Google+' }
};
```

Let's test that:

```js
var hide = require('@megglymark/json-hide');
var assert = require('assert');

var maskedObj = hide(originalObj, fields);
assert.deepEqual(maskedObj, expectObj);
```

### Hidden Responses Server Example

```js
var http = require('http');
var url = require('url');
var hide = require('@megglymark/json-hide');
var server;

server = http.createServer(function(req, res) {
  var fields = url.parse(req.url, true).query.fields;
  var data = {
    firstName: 'Mohandas',
    lastName: 'Gandhi',
    aliases: [
      {
        firstName: 'Mahatma',
        lastName: 'Gandhi'
      },
      {
        firstName: 'Bapu'
      }
    ]
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(hide(data, fields, 'qqqqqqqqqqqqqqqqqqqqqqqqq')));
});

server.listen(4000);
```

Let's test it:

```bash
$ curl 'http://localhost:4000'
{"firstName":"Mohandas","lastName":"Gandhi","aliases":[{"firstName":"Mahatma","lastName":"Gandhi"},{"firstName":"Bapu"}]}

$ # Let's hide the last name
$ curl 'http://localhost:4000?fields=lastName'
{"firstName":"Mohandas","lastName":"qqqqqqqqqqqqqqqqqqqqqqqqq","aliases":[{"firstName":"Mahatma","lastName":"Gandhi"},{"firstName":"Bapu"}]}

$ # Now, let's hide all first names
$ curl 'http://localhost:4000?fields=firstName,aliases(firstName)'
{"firstName":"********","lastName":"Gandhi","aliases":[{"firstName":"********","lastName":"Gandhi"},{"firstName":"********"}]}
```

**Note:** a few more examples are in the `/example` folder.


## License

[MIT](/LICENSE)
