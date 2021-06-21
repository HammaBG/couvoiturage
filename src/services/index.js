const users = require('./users/users.service.js');

const offreRides = require('./offre_rides/offre_rides.service.js');

const profil = require('./profil/profil.service.js');

const requests = require('./requests/requests.service.js');

module.exports = function(app) {
  app.configure(users);

  app.configure(offreRides);
  app.configure(profil);
  app.configure(requests);
};
