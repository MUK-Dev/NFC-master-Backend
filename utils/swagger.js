const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const { version } = require('../package.json')

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'NFC Master API',
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          in: 'header',
          name: 'Authorization',
          description: 'Bearer <token>',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'],
}

const swaggerUiOptions = {
  explorer: true,
}

const swaggerSpec = swaggerJSDoc(options, swaggerUiOptions)

function swaggerDocs(app, port) {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

module.exports = swaggerDocs
