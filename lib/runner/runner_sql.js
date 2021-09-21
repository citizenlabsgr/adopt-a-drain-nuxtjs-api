'use strict';
/* eslint-disable no-undef */

const pg = require('pg');

module.exports = class SqlRunner {
  constructor(connectionString) {
    // $lab:coverage:off$
      this.list = [];
      // console.log('Table')
      this.result = false;
      this.err = false;
      this.connectionString = connectionString;
      this.connectionConfig = {
        connectionString: connectionString,
        ssl: {
          sslmode: 'require',
          rejectUnauthorized: false,
        }
      };
      /*
      if (process.env.NODE_ENV !== 'production' 
          && process.env.NODE_ENV !== 'staging'
          && process.env.NODE_ENV !== 'test') {
        // [* Remove SSL when NODE_ENV !== production]
        // if (!('NPM_CONFIG_PRODUCTION' in process.env)) {
          console.log('ssl turned off');
          delete this.connectionConfig['ssl'];
        // }
      }
      */
      if (process.env.DOCKER_ENV) {
        // [* Remove SSL during development]
        delete this.connectionConfig['ssl'];
        console.error('Remove SSL in docker ', process.env.DOCKER_ENV);
      } 
      this.client=false;

      this.client = new pg.Client(this.connectionConfig);

      this.client.connect();
      // $lab:coverage:on$
  }    
  // $lab:coverage:off$
  add(sqlObject) {
    this.list.push(sqlObject);
    return this;
  }

  load(list) {
    for (let i in list) {
      this.add(list[i]);
    }
    return this;
  }

  end() {
    console.log('* SqlRunner ending...');
    if(this.client) {
      console.log('* SqlRunner disconnect');
      this.client.end();
    }
  }
  
  async run() {
    console.log('* SqlRunner run start');

    if (this.length === 0) {
      console.log('* SqlRunner No sql defined');
    }

    for (let i in this.list) {
      await this.list[i].run(this.client).catch((err) => {
        console.error('runner_sql err', err);
      });
    }  
    this.client.end();
    console.log('* SqlRunner out');

    return this;
  }
  // $lab:coverage:on$
};