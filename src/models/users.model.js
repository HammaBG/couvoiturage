const { GENDER } = require('../constants');

module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const users = new mongooseClient.Schema(
    {
      username: { type: String, unique: true, index: true },
      password: { type: String, index: true },
      phoneNumber: { type: String, index: true },
      email: { type: String },
      photo: { type: String },
    },
    {
      timestamps: true,
      collation: { locale: 'fr', strength: 1 }
    }
  );

  users.index({ createdAt: -1 });
  users.index({ lastName: 1, firstName: 1 });

  return mongooseClient.model('users', users);
};
