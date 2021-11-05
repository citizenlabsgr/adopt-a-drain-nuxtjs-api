'use strict';
/* eslint-disable no-undef */

// const pg = require('pg');

module.exports = class Script {
  constructor(token_statement) {
    // this.token_name = token_name;
    this.token_name = 'token';
    this.token_statement = token_statement;
    this.list = [];
    this.insertTemplate = false; // insertTemplate.toString() || false;
  }
  count() {
    return this.list.length; 
  }
  setData(insertTemplate) {
    
    this.insertTemplate=insertTemplate;
  }
  getData() {
    if (this.insertTemplate) {
      return this.insertTemplate.toString();
    }
    return '/* no setup */';
  }
  // setTokens(tokenTemplate) {
  //  this.tokenTemplate=tokenTemplate;
  // }
  
  // getToken() {
  //  if (this.token_statement) {
  //    return this.token_statement;
  //  }
  //  return '/* no tokens */';
  // } 
  // $lab:coverage:off$
  add(testObject) {
    this.list.push(testObject);
    return this;
  }
  
  toString() {
    return this.templatize();
  }

  templatize() {
    
    let templates = '';
    let method = this.list[0].method;
    // let token_name = this.list[0].token_name;
    let function_name = this.list[0].function_name;
    
    // [evaluate the test objects]
    for (let i in this.list) {
      // console.log('XXX',this.list[i].method);
      // console.log('template', this.list[i].templatize());
      templates += this.list[i].templatize();
      
      // await this.list[i].run().catch((err) => {
      // await this.list[i].run(this.client).catch((err) => {
      //  console.error('runner_sql err', err);
      // });

    }  
    //  this.client.end();
    // console.log('* ScriptRunner out');
    // let function_name = '';
    let test_count = this.count();
    
    return `
    BEGIN;
      -- token : ${this.token_name}
      -- function: ${function_name}
      -- chelate: 
      -- method: ${method}
      -- expected: 
      -- setup: 

      ${this.getData()}

      SELECT plan(${test_count});

      ${templates}
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
  }
  // $lab:coverage:on$
};
