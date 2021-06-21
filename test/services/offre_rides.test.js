const assert = require('assert');
const app = require('../../src/app');

describe('\'offre_rides\' service', () => {
  it('registered the service', () => {
    const service = app.service('offre-rides');

    assert.ok(service, 'Registered the service');
  });
});
