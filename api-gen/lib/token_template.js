'use strict';

module.exports = class InsertTemplate {
    constructor(version, claims) {
        this.claims = claims;
        this.version = version;
    }
    
    toString() {
        return `token := base_0_0_1.sign(${this.claims}::JSON, ${this.jwt_secret}::TEXT)`;
    }
};