'use strict';
const pg = require('pg');

const Graph = require('./graph.js');

/* eslint-disable no-undef */

// console.log('C __filename', __filename);

// const pg = require('pg');

module.exports = class Runner extends Graph {
  constructor(debug = false) {
    // $lab:coverage:off$
    super();
    this.debug = debug;
    this.list = [];
    this.result = false;
    this.err = false;
    this.graph = [];
    this.connectionString = false;
    this.connectionConfig = false;
    this.client = false;
      // $lab:coverage:on$
  }

  getSource() {
    return __filename.replace(__dirname,'');
  }

  setConnectionString(connectionString) {
    this.connectionString = connectionString;
    this.connectionConfig = {
      connectionString: connectionString,
      ssl: {
        sslmode: 'require',
        rejectUnauthorized: false
      }
    };

    return this;
  }

  getClient() {
    this.connect();
    return this.client;
  }

  connect() {
    // this.client=false;
    if (process.env.DOCKER_ENV) {
      // [* Remove SSL during development]
      delete this.connectionConfig['ssl'];
      // console.error('Remove SSL in docker ', process.env.DOCKER_ENV);
      this.addGlyph('     |','   [Disable SSL in Docker] ', `source: ${this.getSource()}`);
      this.addGlyph('     |','     |');
    }
    // console.log('this.client ', this.client);
    if (!this.client) {
      this.client = new pg.Client(this.connectionConfig);
      this.client.connect();
      this.addGlyph('     |','   [Connect to DB]');
      this.addGlyph('     |','     |');
    }
    // console.log('this.client ', this.client);

    return this;
  }

  disconnect() {
    if(this.client) {
      this.addGlyph('     |','   [Disconnect]');
      this.addGlyph('     |','     |');

      this.client.end();
    }
  }

  getOutputFrom(i) {
    return this.list[i].getOutputs();
  }
  // $lab:coverage:off$
  add(step) {
    step.setIdx(this.list.length);
    // add db client in runner before use of step
    this.list.push(step);
    return this;
  }

  async run() {

    this.addGlyph('   [ * ]',`   [ * ]   `,`   source: ${this.getSource()}`);
    this.addGlyph('     |','     |');

    if (this.debug) {
      this.addGlyph('   [Debug is ON]','   [Debug is ON]');
      this.addGlyph('     |','     |');
    }

    if (this.list.length === 0) {
      this.addGlyph('   [No Steps Defined]','   [No Steps Defined]');
      this.addGlyph('     |','     |');
    }

    for (let i in this.list) {

      if (this.list[i].is_db_enabled) {
        this.list[i].setClient(this.getClient());
      }

      await this.list[i].run();

      this.addGlyph(this.list[i].getGraph());

      if (this.list[i].err) {

        break;
      }

      // this.addGlyph('     |                    |');
      this.addGlyph('     |','     |');

    }
    this.addGlyph('     |','     |');

    this.disconnect();

    this.addGlyph('   [ = ]','   [ = ]');

    this.showGraph();
    return this;
  }
  showGraph() {
    console.log(this.graph.join('\n'));
  }
  // $lab:coverage:on$
};
