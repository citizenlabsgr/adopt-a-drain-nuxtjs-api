// 'use strict';
// [# aad-api]
// this setup enables testing and prod
// process.setMaxListeners(15); // fail

const { start } = require('./lib/server');

start();
