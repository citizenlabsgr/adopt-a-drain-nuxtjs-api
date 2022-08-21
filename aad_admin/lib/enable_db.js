'use strict';
const Step = require('./step.js');
const AdminTokenPayload = require('../../lib/auth/token_payload_admin.js');
const Jwt = require('@hapi/jwt');

module.exports = class EnableDb extends Step {
    constructor() {
      super();
      this.is_db_enabled = true;
      this.client=false; // referenct to client in runner
      // this.connectionString=false;

      this.token = Jwt.token.generate(
        new AdminTokenPayload('admin@aad.com','api_admin').payload(),
        process.env.JWT_SECRET
      );
      this.owner = 'api_admin';

    }

    setClient(client) {
      this.client = client;
      // this.addGlyph('   [Connect]','   [Connect]');
      // this.addGlyph('     |','     |');
      return this;
    }

    getClient() {
      if (!this.client) {
        throw new Error('Client not set');
      }
      return this.client;
    }
    //     async deleteGroup(documentName, functionName) {
    async deleteGroup(functionName, documentName) {
      try {
        let token = `("${this.token.replace('Bearer ','')}")`;
        let owner = `("${this.owner}")`;
        let id = `("${documentName}","*")`;
        let q = `select * from api_0_0_1.${functionName}($1::TOKEN,$2::OWNER_ID,$3::PRIMARYKEY)`;
        //         let q = `select * from api_0_0_1.${functionName}($1::TOKEN,$2::OWNER_ID,$3::IDENTITY)`;
        let queryObj;

        queryObj = {
          text: q,
          values: [token,
                   owner,
                   id
                  ]
        };
        let res = await this.client.query(queryObj);
        this.result = res.rows[0][functionName];
        await this.client.query('COMMIT');
      } catch(err) {
        console.error('EnableDB err ', err);
        this.setError(err);
        await this.client.query('ROLLBACK');
      }
      return this.result;
    }

    async insertForm(form, functionName) {
      // this inserts chelate into db
      // you must have admin privileges
      // console.log('chelate ', chelate);
      try {
        // console.log('insertForm 1');
        // let secret = process.env.JWT_SECRET;
        // let token = `("${req.headers.authorization.replace('Bearer ','')}")`;
        // owner = `("${owner}")`;
        let token = `("${this.token.replace('Bearer ','')}")`;
        let owner = `("${this.owner}")`;
        // let form = chelate.form;
        // console.log('token ', token);
        // console.log('owner ', owner);
        // console.log('form ',form);
        // [Get a database client from request]
        // console.log('insertForm 2');

        // [Get pk from request.payload]
        let q = `select * from api_0_0_1.${functionName}($1::TOKEN,$2::OWNER_ID,$3::JSONB)`;
        // console.log('q ', q);
        // console.log('form', form);
        // console.log('insertForm 3');

        // [ User into the database]
        // console.log('client ', this.client);
        // await this.client.query('BEGIN').catch((err) => {console.error('error A BEGIN', err);});
        await this.client.query('BEGIN');
        // console.log('insertForm 5');
        // console.log('form ',form);
        let queryObj;
        queryObj = {
              text: q,
              values: [
                token,
                owner,
                form
              ]
        };
        // console.log('insertChelate 6');

        // console.log('queryObj ', JSON.stringify(queryObj));
        // console.log('insertChelate 7');

        // let res = await this.client.query(queryObj).catch(() => {console.error('error B QUERY');});
        let res = await this.client.query(queryObj);
        // console.log('insertChelate 8');
          // console.log('q ', q);

        // console.log('res ', JSON.stringify(res));
        this.result = res.rows[0][functionName];
        // await this.client.query('COMMIT').catch((err) => {console.error('error C COMMIT ', err);});

        await this.client.query('COMMIT');
        // console.log('insertChelate out');

      } catch(err) {
        this.setError(err);

        console.error(`EnableDb insertForm err ${err}`);
        // console.log('EnableDb insertChelate Rollback');
        //         await this.client.query('ROLLBACK').catch(() => {console.error('error D ROLLBACK');});

        await this.client.query('ROLLBACK');
        // throw new Error(err);
      }
      // console.log('enable_db insertForm result', this.result);
      return this.result;
    }
};
