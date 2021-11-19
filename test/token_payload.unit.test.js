/* eslint-disable no-multi-assign */
// 'use strict';

const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = Lab.script();

const TokenPayload = require('../lib/auth/token_payload');
const UserTokenPayload = require('../lib/auth/token_payload_user.js');

describe('Token Payloads', () => {
  

  it('Guest Token Payload', () => {
    const pl = {
      aud: 'citizenlabs-api',
      iss: 'citizenlabs',
      sub: 'client-api',
      user: 'guest',
      scope: 'api_guest',
      key: '0',
    };
    const tokenPayload = new TokenPayload();

    expect(tokenPayload).to.exist();
    expect(tokenPayload.payload() === pl);
    expect(tokenPayload.aud('xxx').payload().aud === 'xxx');
    expect(tokenPayload.iss('yyy').payload().iss === 'yyy');
    expect(tokenPayload.sub('aaa').payload().sub === 'aaa');
    expect(tokenPayload.user('bbb').payload().user === 'bbb');
    expect(tokenPayload.scope('ccc').payload().scope === 'ccc');
    expect(tokenPayload.key('duckduckgoose').payload().key === 'duckduckgoose');

    expect(!('key' in tokenPayload.remove('key').payload()));
  });

  it('User Token Payload', () => {
    const pl = {
      aud: 'citizenlabs-api',
      iss: 'citizenlabs',
      sub: 'client-api',
      user: 'adopter@user.com',
      scope: 'api_user',
      key: 'duckduckgoose'
    };
    // const username='adopter@user.com';
    // const key='duckduckgoose';
    // const scope='api_user';
    const lapse_in_millisec = 5000;
    const tokenPayload = new UserTokenPayload(pl.user,
                                              pl.key);
    
    expect(tokenPayload).to.exist();
    expect(tokenPayload.payload() === pl);
    expect(tokenPayload.payload().scope === pl.scope);
    expect(tokenPayload.payload().lapse === lapse_in_millisec);

  });

});
