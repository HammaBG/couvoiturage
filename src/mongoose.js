const mongoose = require('mongoose');
const createCounters = require('../src/models/counters');
require('mongoose-schema-jsonschema')(mongoose);

module.exports = function(app) {
  mongoose.connect(
    app.get('mongodb'),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  app.set('mongooseClient', mongoose);
  app.set('counters', createCounters(app));
};
