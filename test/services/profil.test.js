const assert = require('assert');
const app = require('../../src/app');

describe('\'profil\' service', () => {
  it('registered the service', () => {
    const service = app.service('profil');

    assert.ok(service, 'Registered the service');
  });
});
