const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const passKey = require('./authentication-pass-key');
const { Verifier } = require('@feathersjs/authentication-jwt');

class JWTVerifier extends Verifier {
  async verify(req, payload, done) {
    let user;

    try {
      // if (payload.userId) {
      //   user = await this.app.api.service('users').get(payload.userId);
      // } else if (payload.clientId) {
      //   user = await this.app.api.service('clients').get(payload.attendeeId);
      // }
      user = await this.app.api.service('users').get(payload.userId);

      done(null, user, payload);
    } catch (err) {
      done(err);
    }
  }
}

class clientLocalVerifier extends Verifier {
  async verify(req, username, password, done) {
    // TODO: enhance to work with crypted passwords
    const query = {
      query: {
        password: password,
        $and: [
          {
            fields: {
              $elemMatch: {
                key: 'email',
                value: username
              }
            }
          }
        ],
        $limit: 1
      }
    };

    try {
      const clients = await this.app.api.service('client').find(query);
      const client = clients.data[0];

      if (client) {
        done(null, client, { clientId: client._id });
      } else {
        done(null, false);
      }
    } catch (err) {
      done('incorrect paramater');
    }
  }
}

class CustomVerifier extends jwt.Verifier {
  verify(req, payload, done) {
    super.verify(req, payload, (err, user, superPayload = {}) => {
      const finalPayload = { ...superPayload, deviceId: payload.deviceId };
      done(err, user, finalPayload);
    });
  }
}

const handleDeviceId = async context => {
  if (context.data.deviceId) {
    // find record in 'deviceAssignments' with user = context.user._id
    const device = await context.app.api
      .service('devices')
      .find({ query: { user: context.params.user._id } });
    //
    // if not found:
    //   check if max number of assigned devices isn't reached, throw error if reached ????
    //   create with {user: context.user._id, deviceId: context.data.deviceId}
    if (!device.data[0]) {
      const newDevice = {
        user: context.params.user._id,
        deviceId: context.data.deviceId
      };
      await context.app.api.service('devices').create(newDevice);
    }
    context.params.payload = context.params.payload || {};
    Object.assign(context.params.payload, {
      deviceId: context.data.deviceId
    });
  } else {
    return context;
  }
};

module.exports = function(app) {
  const config = app.get('authentication');
  // Set up authentication with the secret

  app.configure(authentication(config));
  app.configure(jwt({ Verifier: JWTVerifier }));
  app.configure(jwt({ Verifier: CustomVerifier }));
  app.configure(local(config.local));
  app.configure(passKey());
  app.configure(
    local({ ...config.local, name: 'client-local', Verifier: clientLocalVerifier })
  );
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.api.service('authentication').hooks({
    before: {
      create: [
        passKey.hooks.addPassword,
        authentication.hooks.authenticate(config.strategies),
        handleDeviceId
      ],
      remove: [authentication.hooks.authenticate('jwt')]
    }
  });
};
