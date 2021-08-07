

module.exports = async function(req, res, next) {
  const ip = req.ip ||
  req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddres


 if (!['127.0.0.1', '188.170.77.185', '188.170.85.185'].includes(ip)) return
  next()
}
