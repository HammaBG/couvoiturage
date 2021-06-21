const idParameter = {
  description: 'ID of item to return',
  name: '_id',
  in: 'path',
  required: true,
  schema: {
    type: 'string'
  }
};

const swaggerConfig = app => ({
  docsPath: '/docs',
  uiIndex: true,
  openApiVersion: 3,
  specs: {
    info: {
      title: 'documentation DMS',
      description: 'Documentation DMS',
      version: '2.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  defaults: {
    operations: {
      get: {
        parameters: [idParameter]
      },
      update: {
        parameters: [idParameter]
      },
      patch: {
        parameters: [idParameter]
      },
      remove: {
        parameters: [idParameter]
      }
    }
  }
});

swaggerConfig.idParameter = idParameter;

module.exports = swaggerConfig;
