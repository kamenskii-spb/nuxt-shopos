const consola = require('consola')
const {Nuxt, Builder} = require('nuxt')
const app = require('./app')
// const path = require('path')

const http = require('http')
const https = require('https')
const fs = require( 'fs' )

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')


async function start() {
  // Init Nuxt.js

  const nuxt = new Nuxt(config)
  const {host, port} = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)


  const httpServer = http.createServer(app)

  if (config.dev) {
    httpServer.listen(port, host, () => {
      consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
      })
    });
  } else {
    const privateKey = fs.readFileSync(
        '/etc/letsencrypt/live/xn--90aefn7bgcp.xn--p1ai/privkey.pem', 'utf8'
    );
    const certificate = fs.readFileSync(
        '/etc/letsencrypt/live/xn--90aefn7bgcp.xn--p1ai/cert.pem', 'utf8'
    );
    const ca = fs.readFileSync(
        '/etc/letsencrypt/live/xn--90aefn7bgcp.xn--p1ai/chain.pem', 'utf8'
    );

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(port, host, () => {
      consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
      })
    });

    httpsServer.listen( 443, host, () => {
      consola.ready({
        message: `Server listening on https://${host}:443`,
        badge: true
      })
    });
  }
}
start()
