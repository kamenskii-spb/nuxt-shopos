const NodeCache = require( 'node-cache' )
const cache = new NodeCache( {stdTTL: 100, checkperiod: 120} )
const ttl = 3600

const set = (name, obj) => {
  cache.set( name, obj, ttl )
}
const get = (name) => {
  return cache.get(name)
}
const clear = () => {
  cache.flushAll()
}

module.exports = {set, clear, get}
