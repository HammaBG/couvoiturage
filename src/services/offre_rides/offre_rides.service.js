// Initializes the `offre_rides` service on path `/offre-rides`
const { OffreRides } = require('./offre_rides.class');
const createModel = require('../../models/offre_rides.model');
const hooks = require('./offre_rides.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.api.use('/offre-rides', new OffreRides(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.api.service('offre-rides');

  service.hooks(hooks);
};
