/*
// guest is an application guest that can post to the /user route
// user is an application user that can interact with a single account
*/
module.exports = class TokenPayload {
  constructor() {
    // constructor(aud = 'citizenlabs-api', iss = 'citizenlabs', sub = 'client-api', user = 'guest', scope = 'api_guest', key = '0') {
    // aud, iss, and sub are also set in server.js
    // and in .env
    this.token_payload = {
      aud: 'citizenlabs-api',
      iss: 'citizenlabs',
      sub: 'client-api',
      user: 'guest',
      scope: 'api_guest',
      key: '0',
    };
    // this.lapse = 5000; // milliseconds
  }

  payload() {
    return this.token_payload;
  }

  aud(aud) {
    this.token_payload.aud = aud;
    return this;
  }
  
  exp(expires) {
    // adds attribute when called/set
    this.token_payload.exp = expires;
  }

  iss(iss) {
    this.token_payload.iss = iss;
    return this;
  }

  sub(sub) {
    this.token_payload.sub = sub;
    return this;
  }

  user(user) {

    this.token_payload.user = user;
    return this;
  }

  scope(scope) {

    /* $lab:coverage:off$ */
    if (typeof scope === 'string') {
      this.token_payload.scope = scope;
    } else if (typeof scope === 'object') {
      this.token_payload.scope = scope;
    }
    /* $lab:coverage:on$ */
    return this;
  }

  key(key) {
    // console.log('key ', key);

    this.token_payload.key = key;
    return this;
  }
  
  timeout(lapse_in_milli_sec) {
    // console.log('timeout ', lapse_in_milli_sec);
    // this.lapse = lapse_in_milli_sec;
    this.exp(new Date().getTime() + lapse_in_milli_sec );
    return this;
  }

  remove(claim) {
    delete this.token_payload[claim];
    return this;
  }
};
