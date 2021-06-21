// Initializes the `users` service on path `/users`
const createService = require('feathers-mongoose');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  const users = createService(options);

  users.docs = {
    securities: 'all',
    definitions: {
      users: Model.schema.jsonSchema(),
      users_list: {
        type: 'array',
        items: { $ref: '#/components/schemas/users' }
      }
    }
  };

  // Initialize our service with any options it requires
  app.api.use('/users', users);

  // Get our initialized service so that we can register hooks
  const service = app.api.service('users');

  service.hooks(hooks);
};
