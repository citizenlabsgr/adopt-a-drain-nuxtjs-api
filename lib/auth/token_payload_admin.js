const TokenPayload = require('./token_payload.js');

module.exports = class AdminTokenPayload extends TokenPayload {
    constructor(username, key){
        super();
        this.user(username);
        this.key(key);
        this.scope('api_admin');
        this.timeout(5000);
        // this.exp(new Date().getTime() + lapse_in_millisec );

    }

};
