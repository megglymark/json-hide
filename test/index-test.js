/* global describe, it */

var mask = require('../lib')
var assert = require('assert')
var clone = require('./clone.js')
var { fixture,
  fixtureFilteredKind,
  fixtureFilteredObjectObjectType,
  fixtureFilteredUrlObjectContentAttachmentsUrl
} = require('./fixture/activities.js')
var tests

function A () {
  this.a = 3
  this.b = 4
}
var originalA = new A();
var expectedA = new A();
expectedA.b = '********'

tests = [{
  m: 'a',
  o: null,
  e: null
}, {
  m: 'a',
  o: {b: 1},
  e: {b: 1}
}, {
  m: 'a',
  o: {a: null, b: 1},
  e: {a: '********', b: 1}
}, {
  m: 'a',
  o: [{b: 1}],
  e: [{b: 1}]
}, {
  m: null,
  o: {a: 1},
  e: {a: 1}
}, {
  m: '',
  o: {a: 1},
  e: {a: 1}
}, {
  m: 'a',
  o: {a: 1, b: 1},
  e: {a: '********', b: 1}
}, {
  m: 'notEmptyStr',
  o: {notEmptyStr: ''},
  e: {notEmptyStr: '********'}
}, {
  m: 'notEmptyNum',
  o: {notEmptyNum: 0},
  e: {notEmptyNum: '********'}
}, {
  m: 'a,b',
  o: {a: 1, b: 1, c: 1},
  e: {a: '********', b: '********', c: 1}
}, {
  m: 'obj/s',
  o: {obj: {s: 1, t: 2}, b: 1},
  e: {obj: {s: '********', t: 2}, b: 1}
}, {
  m: 'arr/s',
  o: {arr: [{s: 1, t: 2}, {s: 2, t: 3}], b: 1},
  e: {arr: [{s: '********', t: 2}, {s: '********', t: 3}], b: 1}
}, {
  m: 'a/s/g,b',
  o: {a: {s: {g: 1, z: 1}}, t: 2, b: 1},
  e: {a: {s: {g: '********', z: 1}}, t: 2, b: '********'}
}, {
  m: '*',
  o: {a: 2, b: null, c: 0, d: 3},
  e: {a: '********', b: '********', c: '********', d: '********'}
}, {
  m: 'a/*/g',
  o: {a: {s: {g: 3}, t: {g: 4}, u: {z: 1}}, b: 1},
  e: {a: {s: {g: '********'}, t: {g: '********'}, u: {z: 1}}, b: 1}
}, {
  m: 'a/*',
  o: {a: {s: {g: 3}, t: {g: 4}, u: {z: 1}}, b: 3},
  e: {a: {s: '********', t: '********', u: '********'}, b: 3}
}, {
  m: 'a(g)',
  o: {a: [{g: 1, d: 2}, {g: 2, d: 3}]},
  e: {a: [{g: '********', d: 2}, {g: '********', d: 3}]}
}, {
  m: 'a,c',
  o: {a: [], c: {}},
  e: {a: '********', c: '********'}
}, {
  m: 'b(d/*/z)',
  o: {b: [{d: {g: {z: 22}, b: 34}}]},
  e: {b: [{d: {g: {z: '********'}, b: 34}}]}
}, {
  m: 'url,obj(url,a/url)',
  o: {url: 1, id: '1', obj: {url: 'h', a: [{url: 1, z: 2}], c: 3}},
  e: {url: '********', id: '1', obj: {url: '********', a: [{url: '********', z: 2}], c:3}}
}, {
  m: '*(a,b)',
  o: {p1: {a: 1, b: 1, c: 1}, p2: {a: 2, b: 2, c: 2}},
  e: {p1: {a: '********', b: '********', c: 1}, p2: {a: '********', b: '********', c: 2}}
}, {
  m: 'kind',
  o: clone(fixture),
  e: fixtureFilteredKind
}, {
  m: 'object(objectType)',
  o: clone(fixture),
  e: fixtureFilteredObjectObjectType 
}, {
  m: 'url,object(content,attachments/url)',
  o: clone(fixture),
  e: fixtureFilteredUrlObjectContentAttachmentsUrl
}, {
  m: 'i',
  o: [{i: 1, o: 2}, {i: 2, o: 2}],
  e: [{i: '********', o: 2}, {i: '********', o: 2}]
}, {
  m: 'foo(bar)',
  o: {foo: {biz: 'bar'}},
  e: {foo: {biz: 'bar'}}
}, {
  m: 'foo(bar)',
  o: {foo: {biz: 'baz'}},
  e: {foo: {biz: 'baz'}}
}, {
  m: 'foobar,foobiz',
  o: {foobar: {foo: 'bar'}, foobiz: undefined},
  e: {foobar: '********', foobiz: '********'}
}, {
  m: 'foobar',
  o: {foo: 'bar'},
  e: {foo: 'bar'}
}, {
  m: 'foobar',
  o: [{biz: 'baz'}],
  e: [{biz: 'baz'}]
}, {
  m: 'a',
  o: {a: [0, 0]},
  e: {a: [0, 0]}
}, {
  m: 'a',
  o: {a: [1, 0, 1]},
  e: {a: [1, 0, 1]}
}, {
  m: 'a/b',
  o: {a: originalA},
  e: {a: expectedA}
}]

describe('json-mask', function () {
  var result, i
  for (i = 0; i < tests.length; i++) {
    (function (test) {
      it('should mask ' + test.m + ' in test #' + i, function () {
        result = mask(test.o, test.m)
        assert.deepStrictEqual(result, test.e)
      })
    }(tests[i]))
  }
})
