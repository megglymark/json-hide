var compile = require('./compiler')
var filter = require('./filter')

function mask (obj, mask, value) {
  return filter(obj, compile(mask), value) || null
}

mask.compile = compile
mask.filter = filter

module.exports = mask
