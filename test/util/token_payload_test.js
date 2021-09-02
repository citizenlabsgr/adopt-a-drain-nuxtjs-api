const TokenPayload = require('../../lib/auth/token_payload.js');

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
    if (!username){
      throw 'user_TokenPayload is requires a username';
    }
    if (!key){
      throw 'user_TokenPayload is requires a key';
    }
    if (!key.includes('#') ) {
      throw 'user_TokenPayload requires a key with a #, eg guid#somevalue';
    }
    if (!scope){
      throw 'user_TokenPayload is requires a scope';
    }
    return new TokenPayload()
                 .user(username)
                 .key(key)
                 .scope_(scope)
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
                 .scope_('api_admin')
                 .payload();
  }
  /*
  user_TokenPayload(username, id, scope) {
    return new TokenPayload()
                 .user(username)
                 .iid(id)
                 .scope(scope)
                 .payload();
  }
  */
};
