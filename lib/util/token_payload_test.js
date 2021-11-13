const TokenPayload = require('../auth/token_payload');

// const TokenPayload = require('../../lib/auth/token_payload.js');

module.exports = class TestTokenPayload {
  constructor() {
  }

  // user post payload

  badIssTokenPayload() {
    return new TokenPayload()
                 .iss('bad-iss-claim-value')
                 .payload();
  }
  missingIssTokenPayload() {
    return new TokenPayload()
                 .remove('iss')
                 .payload();
  }
  badAudTokenPayload() {
    return new TokenPayload()
                 .aud('bad-aud-claim-value')
                 .payload();
  }
  missingAudTokenPayload() {
    return (new TokenPayload())
                 .remove('aud')
                 .payload();
  }
  guestTokenPayload() {
    return new TokenPayload()
                 .payload();
  }
  fakeGuestTokenPayload() {
    return new TokenPayload()
                 .payload();
  }
  missingUserTokenPayload() {
    return new TokenPayload()
                 .remove('user')
                 .payload();
  }
  missingScopeTokenPayload() {
    return new TokenPayload()
                 .remove('scope')
                 .payload();
  }

  userTokenPayload(username, key, scope) {
    if (!username) {
      throw new Error('user_TokenPayload is requires a username');
    }

    if (!key) {
      throw new Error('user_TokenPayload is requires a key');
    }
    
    // if (!key.includes('#') ) {
    //  throw new Error('user_TokenPayload requires a key with a #, eg guid#somevalue');
    // }
    
    if (!scope) {
      throw new Error('user_TokenPayload is requires a scope');
    }

    return new TokenPayload()
                 .user(username)
                 .key(key)
                 .scope(scope)
                 .payload();
  }
  
  adminTokenPayload(username, key) {
    if (!username){
      throw 'admin_TokenPayload is requires a username';
    }
    if (!key){
      throw 'admin_TokenPayload is requires a key';
    }
    return new TokenPayload()
                 .user(username)
                 .key(key)
                 .scope('api_admin')
                 .payload();
  }

};
