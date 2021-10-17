// 'use strict';

const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

// eslint-disable-next-line no-multi-assign
const { describe, it } = exports.lab = Lab.script();

// const Chelate = require('../lib/chelates/chelate.js');
// const Co nsts = require('../lib/constants/co nsts.js');
const UserTokenPayload = require('../lib/auth/token_payload_user');

describe('User Token Payload', () => {
  const lapse_time = 1000; // one second
  const pl = {
    aud: 'citizenlabs-api',
    iss: 'citizenlabs',
    key: 'duckduckgoose',
    scope: 'api_user',
    sub: 'client-api',
    user: 'user@user.com',
  };

  it('API UserTokenPayload Payload', () => {
    const userTokenPayload = new UserTokenPayload(pl.user, 
                                                  pl.key, 
                                                  pl.scope, 
                                                  lapse_time);
    // console.log('guestTokenPayload',guestTokenPayload.token_payload);
    // expect(userTokenPayload).to.exist();
    expect(userTokenPayload.token_payload.user).to.equal(pl.user);
    expect(userTokenPayload.token_payload.key).to.equal(pl.key);
  });
});
