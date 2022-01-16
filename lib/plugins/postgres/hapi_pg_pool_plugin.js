'use strict';

const { Pool } = require('pg');

const pools = {};
let run_once = false;
const PG_CON = []; // this "global" is local to the plugin.

exports.plugin = {
    pkg: require('../../../package.json'),
    version: '1.0.0',

    register: async function (server) {
      // [# Hapi Postgres Client Pool Plugin]
      // [Description: Create several database connections to speed things up.]

       server.ext({
         type: 'onPreAuth',
         method: async function (request, h) {
          const connectionString = h.realm.pluginOptions.config.database_url;
          let ln = '0';
           try {
              /* $lab:coverage:off$ */
              if (!('pool' in pools)) {
                 // [* Initialize connection pool with databse_url config]
                 // console.log('Initialize Pool') ;
                 const docker_env = h.realm.pluginOptions.config.docker_env;

                 if (connectionString) {
                    const conn_config = {
                      connectionString: connectionString,
                      ssl: {
                        sslmode: 'require',
                        rejectUnauthorized: false,
                      }
                    };

                    if (docker_env) {
                      // [* Remove SSL during development]
                      delete conn_config['ssl'];
                      console.error('    Remove SSL in docker ', docker_env);
                    }
                    ln = '0.1';
                    pools['pool'] = new Pool(conn_config);

                  }

               }
               ln = '1';
               if (request.route.settings.auth) {
                  ln = '1.1';
                  // [Retrieve a client connection from pool When authenticated]
                  // if ('pool' in pools) {console.log('pool is in pools');}
                  let client  = await pools.pool.connect();
                  ln = '1.2';
                  PG_CON.push({ client });
                  ln = '1.3';
                  client.connection.setMaxListeners(18);
                  request.pg = client;

               } else {
                 new Error('Hapi_pg_pool_plugin not authenticated');
               }
               if (!request.pg && request.route.settings.auth) {
                 // some routes require authentication and those routes also require a db connection
                throw Error('hapi_pg_pool_plugin, client undefined');
               }
               ln = '2';
               if(!run_once) {

                 run_once = true;

                 server.events.on('stop', async function () { // only one server.on('stop') listener
                   // [Register handler to close connections when app is shutdown/stopped]
                   ln = '2.1';
                   PG_CON.forEach(async function (con) { // close all the connections
                                 await con.client.end();
                               });
                 });

               }
              /* $lab:coverage:on$ */

           } catch(err) {
            /* $lab:coverage:off$ */
             console.error('!!! MAKE SURE DATABASE IS RUNNING!!! A');
             console.error('!!! Check connection string password');
             console.error('err', err);
             console.error('line: ', ln);
             // console.error('connectionString', connectionString);
            /* $lab:coverage:on$ */
            } finally {
             // eslint-disable-next-line no-unsafe-finally
             return h.continue;
           }
         }
       });
     }

};
