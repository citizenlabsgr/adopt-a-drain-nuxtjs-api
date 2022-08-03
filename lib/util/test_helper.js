'use strict';
// const TestTokenPayload = require('../lib/util/token_payload_test.js');
// const UserTokenPayload = require('./token_payload_test.js');
const UserTokenPayload = require('../auth/token_payload_user.js');
const AdminTokenPayload = require('../auth/token_payload_admin.js');

const Jwt = require('@hapi/jwt');

module.exports = class TestHelper {
/* $lab:coverage:off$ */
  constructor(client, function_name) {
      this.client=client;
      this.function_name=function_name;
      this.errResult;
      this.owner;
      this.username;
      this.payload;
      this.showData = false;

  }
  isShowData() {
      return this.showData;
  }
  setShowData(tf) {
      this.showData = tf;
      return this;
  }
  /* Sample Post Code
    try{
      // [Optionally insert a test user when test in header]
      if (apiTest) {
        await client.query('BEGIN'); // start transaction to rollback test data
        let function_name = 'adoptee';
        let apiTest = JSON.parse(apiTest);
        let testHelper = new TestHelper(client, function_name);
        await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
      }
    } catch (err) {
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptee DELETE TEST  (TOKEN, OWNER, IDENTITY) err', err);
    }
  */

  async post(apiTest, owners){
    //  console.log('route helper post 1');
    // [Post an array of test json chelates]
    // expect apiTest to have multiple owners
    // use await testHelper.post() in test
    // Uses user_token
    if (!apiTest || typeof(apiTest) !== 'object' ) {
       throw new Error(`TestHelper.post bad apiTest ${this.function_name} apTest is ${apiTest}`);
    }
    if (!owners || typeof(apiTest) !== 'object' ) {
        throw new Error(`TestHelper.post bad owners for ${this.function_name} ${owners}`);
     }
    for (let i in apiTest) {

      // console.log('i', apiTest[i]);
      // post test data with a user token
      this.owner = apiTest[i].owner;
      this.key = apiTest[i].owner;
      this.username = owners[this.owner].username;
      // this.scope = 'api_user';
      this.scope = owners[this.owner].scope;

      let secret = process.env.JWT_SECRET;
      // console.log(`testhelper token username ${this.username} key ${this.key} scope ${this.scope}`);
      // this.payload = new TestTokenPayload().userTokenPayload(this.username, this.key, this.scope);

      this.payload = new UserTokenPayload(this.username, this.key).scope(this.scope).payload();
      // this.payload = new UserTokenPayload(this.username, this.key).userTokenPayload(this.username, this.key);
      this.token = Jwt.token.generate(this.payload, secret);

      this.token = `("${this.token}")`;
      this.owner = `("${this.owner}")`;

      // [Insert a transation when test is invoked]
      // console.log('route helper ', apiTest[i].form);
      //  console.log('route helper post ', apiTest[i]);
        if (this.isShowData()) {
            console.log('TestHelper post ', apiTest[i]);
        }
        const resA = await this.client.query(
            {
                text: `select * from base_0_0_1.insert($1::JSONB,$2::OWNER_ID)`,
                values: [
                    JSON.stringify(apiTest[i]),
                    this.owner
                ]
            }
        );
        if (this.isShowData() && !resA) {

                console.log('testhelper insert failure', resA);

        }
      if (!resA) {
        throw new Error("TestHelper failed");
      // } else if (resA.rows[0][this.function_name].status !== '200') {
      } else if (resA.rowCount === 0) {

        throw new Error("TestHelper x record POST failed " + JSON.stringify(resA.rows[0][this.function_name]));
      }
        // console.log('testhelper out');

      // console.log('resA', resA.rows[0]);
    }

  }
  async postAdmin(apiTest, owners){
      // console.log('route helper postAdmin 1');

    // [Post an array of test json chelates]
    // expect apiTest to have multiple owners
    // use await testHelper.post() in test
    // Uses user_token
    if (!apiTest || typeof(apiTest) !== 'object' ) {
       throw new Error(`TestHelper.postAdmin bad apiTest ${this.function_name} apTest is ${apiTest}`);
    }
    if (!owners || typeof(apiTest) !== 'object' ) {
        throw new Error(`TestHelper.postAdmin bad owners for ${this.function_name} ${owners}`);
    }
    for (let i in apiTest) {

      // console.log('i', apiTest[i]);
      // post test data with a user token
      this.owner = apiTest[i].owner;
      this.key = apiTest[i].owner;
      this.username = owners[this.owner].username;
      // this.scope = 'api_user';
      this.scope = owners[this.owner].scope;

      let secret = process.env.JWT_SECRET;

      this.payload = new AdminTokenPayload(this.username, this.key).scope(this.scope).payload();
      // console.log('payload ', this.payload);
      // this.payload = new UserTokenPayload(this.username, this.key).userTokenPayload(this.username, this.key);
      this.token = Jwt.token.generate(this.payload, secret);

      this.token = `("${this.token}")`;
      this.owner = `("${this.owner}")`;

      // [Insert a transation when test is invoked]
      // console.log('route helper ', apiTest[i]);
        if (this.isShowData()) {
            console.log('TestHelper post ', apiTest[i]);
        }
        const resA = await this.client.query(
            {
                text: `select * from base_0_0_1.insert($1::JSONB,$2::OWNER_ID)`,
                values: [
                    JSON.stringify(apiTest[i]),
                    this.owner
                ]
            }
        );
        /*
        const resA = await this.client.query(
        {
          text: `select * from api_0_0_1.${this.function_name}($1::TOKEN,$2::OWNER_ID,$3::JSONB)`,
          values: [this.token,
                   this.owner,
                   JSON.stringify(apiTest[i].form)
                  ]
        }
      );
      */

      // console.log('testhelper ', resA.rows[0]);
      if (!resA) {
        throw new Error("TestHelper failed");
      // } else if (resA.rows[0][this.function_name].status !== '200') {
      } else if (resA.rowCount === 0) {
        throw new Error("TestHelper Admin record POST failed " + JSON.stringify(resA.rows[0][this.function_name]));
      }

      // console.log('resA', resA.rows[0]);
    }

  }
/* $lab:coverage:off$ */
};
