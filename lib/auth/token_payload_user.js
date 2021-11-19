const TokenPayload = require('./token_payload.js');

module.exports = class UserTokenPayload extends TokenPayload {
    constructor(username, key){
        super();
        this.user(username);
        this.key(key);
        this.scope('api_user');
        this.timeout(5000);
        // this.exp(new Date().getTime() + this.lapse );
        // console.log('current time :', this.token_payload.exp);
        // console.log('lapse        :         ', lapse_in_millisec);
        // this.exp(this.token_payload.exp + lapse_in_millisec);
        // console.log('expires at   :', this.token_payload.exp);
    }

};
