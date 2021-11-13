'use strict';
const TestTokenPayload = require('./token_payload_test');
const Jwt = require('@hapi/jwt');

module.exports = class TestHelper {
  // constructor(client, function_name, username, key, scope) {

  constructor(client, function_name) {
      this.client=client;
      this.function_name=function_name;
      this.errResult;
      this.owner; 
      this.username;
      this.payload;
      // this.payload = new TestTokenPayload().userTokenPayload(username, key, scope); 
      // this.token = Jwt.token.generate(payload, secret);

  }
  async post(apiTest,owners){
    // [Post an array of test json chelates]
    // expect apiTest to have multiple owners
    // eslint-disable-next-line no-constant-condition

    for (let i in apiTest) {
      
      // console.log('i', apiTest[i]);
      this.owner = apiTest[i].owner;
      this.key = apiTest[i].owner;
      this.username = owners[this.owner].username; 
      this.scope = 'api_user';
      let secret = process.env.JWT_SECRET;
      this.payload = new TestTokenPayload().userTokenPayload(this.username, this.key, this.scope); 

      this.token = Jwt.token.generate(this.payload, secret);
      this.token = `("${this.token}")`;
      this.owner = `("${this.owner}")`;

      // [Insert a transation when test is invoked]
      const resA = await this.client.query(
        {
          text: `select * from api_0_0_1.${this.function_name}($1::TOKEN,$2::JSONB,$3::OWNER_ID)`,
          values: [this.token,
                  JSON.stringify(apiTest[i].form),
                  this.owner
                  ]
        }   
      );
      if (!resA) {
        throw new Error("TestHelper failed");
      } else if (resA.rows[0][this.function_name].status !== '200') {
        throw new Error("TestHelper record POST failed " + JSON.stringify(resA.rows[0][this.function_name]));
      }
      // console.log('resA', resA.rows[0]);
    }

  }

};
