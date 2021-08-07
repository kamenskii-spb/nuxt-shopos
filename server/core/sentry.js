const keys = require('../keys')

const Sentry = require('@sentry/node')
Sentry.init({ dsn: keys.SentryDSN })


module.exports = Sentry
