'use strict';
/*
Generates database tests
for each token
*

*/
const fs = require('fs');
const Util = require('./lib/util.js');
const Script = require('./lib/script.js');
const HasFunctionTemplate = require('./lib/has_function_template.js');
const InsertTemplate = require('./lib/insert_template.js');
const PostTemplate = require('./lib/post_template.js');
const SigninPostTemplate = require('./lib/signin_post_template.js');
const SignupPostTemplate = require('./lib/signup_post_template.js');

const PutTemplate = require('./lib/put_template.js');

const GetTemplate = require('./lib/get_template.js');
const GetTemplateMultiPart = require('./lib/get_template_multi_part.js');
const DeleteTemplate = require('./lib/delete_template.js');
const FileHelper = require('./lib/file_helper.js');
const Settings = require('./lib/settings.js');
// const TokenTemplate = require('./lib/token_template.js');
// missing :PutTemplate
console.log('[Load Settings]');

let settings = new Settings().get();

console.log('settings', settings);

let util = new Util();

let i = 1;
console.log('[Validate Settings]');

console.log('[Process tests for the Token/user types]');
let fileList = [];
let fileNameList = [];
let classList = [];
let tokenNameList =[];
let apiTestFolder = 'api-tests';

// let functionFolder = `${__dirname}/${apiTestFolder}`;
let functionFolder = `${__dirname.replace('/api-gen','')}/models/db`;

if (!validateSettings(settings, functionFolder)) {
    console.log('Invalid Settings');
}
// GENERATE DATABASE TESTS
    console.log('# Tests');
    for (let t in settings.tokens) {
        // Process Tokens with Claims

        // console.log('JSON 4');
        let token_name = settings.tokens[t].name;
        let claim = settings.tokens[t].claim;
        let role = settings.tokens[t].role; // get role from token settings
        // console.log('role', role);
        for (let a in settings.tokens[t].api) {
            // iterate
            // Build filename
            // Build classname
            let api_key =settings.tokens[t].api[a];
            // let folder =  `${__dirname}/${apiTestFolder}`;
            // let filename =  getTestFileName(folder, api_key, token_name);


            let file_name = `${api_key}.${token_name}.db.test.js`;
            let filename = `${__dirname}/${apiTestFolder}/${file_name}`;

            let classname = `${util.toTitleCase(api_key)}`;
            let tokenname = `${util.toTitleCase(token_name.replace('_','-'))}`;

            if (!settings.data) {
                console.log(api_key, 'Data Not Defined');
            }
            let version = settings.version;
            // get insert data
            let data = settings.data[api_key];
            if (!data) { // patch
                // console.log('trim_after ', trim_after(api_key,'-'));
                data = settings.data[trim_after(api_key,'-')];
            }
            // get patch data
            let patch_data = settings.data[`${api_key}-patch`];
            // test type
            try {
                if (!hasTestType(settings.api_settings[api_key])){
                    settings.api_settings[api_key].testtype;
                }
                // if (!settings.api_settings[api_key].roles) {
                //    settings.api_settings[api_key].roles = [];
                // }
            } catch(err) {
                throw new Error(`Api testtype not found in ${api_key}`);
            }
            // inject role array into api_settings when not found
            // console.log('settings.api_settings',settings.api_settings);
            // console.log('api_key',api_key);
            // console.log('settings.api_settings[api_key]',settings.api_settings[api_key]);
            try {
                if (!hasRoles(settings.api_settings[api_key])){
                    settings.api_settings[api_key].roles = [];
                }
                // if (!settings.api_settings[api_key].roles) {
                //    settings.api_settings[api_key].roles = [];
                // }
            } catch(err) {
                throw new Error(`Api roles not found in ${api_key}`);
            }
            settings.api_settings[api_key].roles.push(role);

            let api_settings = settings.api_settings[api_key];
            // console.log('api_settings add role', api_settings);

            if (!api_settings) {
                console.error('Api_Settigs[',api_key,'] Not Found');
                throw new Error(`Missing api_setting for ${api_key}`);
            }

            let token_statement = `base_0_0_1.sign('${JSON.stringify(claim)}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)`;

            let script = new Script(token_statement);

            let method = api_settings.method.toUpperCase();

            console.log(`    ${i} [* Write ${file_name}]`);

            script.add(new HasFunctionTemplate(api_settings));

            switch(method){
                case 'DELETE':
                    if (!data) {
                        console.log('     -  method', method, ' data', api_key, ' is ', data);
                    }
                    // [Setup Tokens]
                    // script.setTokens(new TokenTemplate(version,data));
                    // [Insert a test record to delete]
                    script.setData(new InsertTemplate(version,data));
                    // [Handle multiple deletes]
                    // console.log('     -  data', api_key, ' is ', data);

                    for (let i in data) {
                        // console.log('    i',i);
                        script.add(new DeleteTemplate(
                        token_name,
                        claim,
                        api_settings,
                        data[i]));
                    }
                    break;
                case 'GET':
                    // console.log('method', method);
                    // put inserts here
                    // [Setup Tokens]
                    // script.setTokens(new TokenTemplate(version,data));
                    // [Insert a test record to query]
                    script.setData(new InsertTemplate(version,data));
                    switch(api_settings.test_type) {
                      case 'single':
                        // [Get single]
                        for (let i in data) {
                            script.add(new GetTemplate(
                            token_name,
                            claim,
                            api_settings,
                            data[i]));
                        }
                        break;
                      case 'multipart':
                        // [Get Multiple]
                        script.add(new GetTemplateMultiPart(
                          token_name,
                          claim,
                          api_settings,
                          data)
                        );

                        break;
                    }
                    break;
                case 'POST':
                    // console.log('method', method);
                    // [Setup Tokens]
                    // script.setTokens(new TokenTemplate(version,data));

                    // [Post multiple records]
                    if (api_settings.name.name === 'signup') {
                        for (let i in data) {
                            script.add(new SignupPostTemplate(
                            token_name,
                            claim,
                            api_settings,
                            data[i]));
                        }

                    } else if (api_settings.name.name === 'signin') { // signin patch
                        script.setData(new InsertTemplate(version,data));
                        // console.log('SignIn Patch');
                        for (let i in patch_data) {
                            script.add(new SigninPostTemplate(
                            token_name,
                            claim,
                            api_settings,
                            patch_data[i]));
                        }
                    } else {
                        for (let i in data) {
                            script.add(new PostTemplate(
                            token_name,
                            claim,
                            api_settings,
                            data[i]));
                        }
                    }
                    break;
                case 'PUT':
                    // console.log('method', method);

                    // [Setup Tokens]
                    // script.setTokens(new TokenTemplate(version,data));
                    // [Insert test data for put]
                    script.setData(new InsertTemplate(version,data));
                    for (let i in data) {
                        script.add(new PutTemplate(
                            token_name,
                            claim,
                            api_settings,
                            data[i]));
                    }
                    break;
                default:
                    throw new Error(`Undefined Method ${method}`);
            }
            console.log('   ');
            // [Generate individual test files]
            let scrpt = script.templatize();
            // [Generate active tests]

            let fileHelper = new FileHelper(`${__dirname}/${apiTestFolder}`, file_name);

            if (api_settings.active) {

                fileList.push(filename);
                fileNameList.push(file_name);
                classList.push(classname);
                tokenNameList.push(`${util.toTitleCase(token_name.replace('_','-'))}`);
            let ms = `
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class Function${classname}${tokenname}Test extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = \`${scrpt}\`;
        }
    };
            `;
            fileHelper.write(ms);

          } else {
              fileHelper.delete();

          }
            // console.log('script', scrpt);
            i++;
        }
        // console.log('  ');
        // console.log('--');
        // break;
    }
console.log('# Test Files');
console.log('fileList', fileList);
console.log('classList', classList);
console.log('tokenNameList', tokenNameList);
const apiTestCollectionName = '0.api-db-test-collection.js';
let collectionFileHelper = new FileHelper(`${__dirname}/${apiTestFolder}`, apiTestCollectionName);
let declarations = '';
let instances = '';
for (i in fileNameList) {
   declarations += `const Function${classList[i]}${tokenNameList[i]}Test = require('./${fileNameList[i]}');` +'\n';
}
for (i in classList) {
   instances += `      this.push(new Function${classList[i]}${tokenNameList[i]}Test('api', apiVersion, baseVersion));`+'\n';
}
collectionFileHelper.write(`
// this file was generated
const Comment = require('../../lib/runner/comment.js');
const Extension = require('../../models/db/extension.js');

// [Pull together all testing files and run them.]
${declarations}
module.exports = class ApiTests extends Array {

    constructor(apiVersion, baseVersion) {
      /* $lab:coverage:off$ */
      super();

      this.push(new Comment('-- Enable Api Testing'));
      this.push(new Extension('pgtap','public'));


      ${instances}

      /* $lab:coverage:on$ */
    }
  };
`);

// sql functions

console.log('JSON out');
function trim_after(value, delimeter) {
    // remove last delimeter and everything after

    let parts = value.split(delimeter);
    parts = parts.splice(0,parts.length-1);
    return parts.join(delimeter);
}

function hasTestType(api_setting) {
  // check api_settings
  if (!api_setting) {
      return false;
  }
  if (api_setting.test_type) {
      return true;
  }
  return false;
}
function hasRoles(api_setting) {
    // check api_settings for role
    // console.log('hasRoles', api_setting);
    if (!api_setting) {
        return false;
    }
    if (api_setting.roles) {
        return true;
    }
    return false;
}
/*
function getTestFileName(folder, api_key, token_name) {
    let file_name = `${folder}/${api_key}.${token_name}.db.test.js`;
    return file_name;
}
*/

function getFunctionFileName(folder, api_key) {
    let file_name = `function_${api_key.replace('-','_').replace('-','_').replace('-','_')}.js`;
    file_name = `${folder}/${file_name}`;
    return file_name;
}
/*
function formatFunctionParametersSmall(api_setting) {
    let rc = '';
    for (let i in api_setting.params) {
        rc += api_setting.params[i].type[0];
    }
    return rc.toLowerCase();
}
*/

function formatFunctionParametersTypes(api_setting) {
    let rc = '';
    for (let i in api_setting.params) {
        if (rc.length > 0) {rc +=',';}
        rc += api_setting.params[i].type;
    }
    return rc.toLowerCase();
}

function validateSettings(settings,functionFolder) {
    let rc = true;
    let data_key = false;
    // let function_name = '';
    // [Check api_settings]
    console.log('# Api Settings');
    let i = 1;
    for (let t in settings.tokens) {
        for (let a in settings.tokens[t].api) {
            let api_key =settings.tokens[t].api[a];
            let status = 'Ok';

            if (settings.api_settings[api_key]) {
                data_key = api_key;

            } else {
                status = `Missing api ${api_key}`;
                rc = false;
            }
            if(!hasRoles(settings.api_settings[api_key])){
                status = `Add roles to api_settings: ${api_key}`;
            }

            // console.log(`api_key ${api_key} Primary: ${primary} hasDefault: ${has_default}`);
            console.log(`    ${i} ${status} API ${api_key}(${data_key}) `);
            i += 1;
        }

    }

    // [Check data]
    console.log('# Data');
    i = 1;
    for (let t in settings.tokens) {
        for (let a in settings.tokens[t].api) {
            let api_key =settings.tokens[t].api[a];
            if (settings.data[api_key]) {
                data_key = api_key;
            } else if (settings.data[trim_after(api_key,'-')]) {
                data_key = trim_after(api_key,'-');
            } else {
                rc = false;
            }

            // console.log(`api_key ${api_key} Primary: ${primary} hasDefault: ${has_default}`);
            console.log(`    ${i} api_key ${api_key} data_key: ${data_key}`);
            i++;
        }
    }
    // [Check functions]
    // function getFunctionFileName(folder, api_key, token_name) {
    // let folder = `${__dirname}/${functionFolder}`;
    console.log('# Expected Functions (found files)');
    i = 1;
    for (let t in settings.tokens) {
        // let token_name = settings.tokens[t].name;

        for (let a in settings.tokens[t].api) {
            let status = '';
            let api_key =settings.tokens[t].api[a];
            let api_setting = settings.api_settings[api_key];
            let function_name = api_setting.name.name;
            let group_name = api_setting.name.group;
            let folder = `${functionFolder}/${group_name}/${settings.api_settings[api_key].version}`;
            let filename = getFunctionFileName(folder, api_key) ;
            let paramTypes = formatFunctionParametersTypes(api_setting);

            // let api_name = settings.api_settings[api_key].name.name;
            // function_name = ;
            // console.log('name', api_name);

            status = `UNDEFINED Function File(${filename})  `;
            if (fs.existsSync(filename)) {
                status = 'Ok';
            }
            console.log(`    ${i} ${status} ${function_name}(${paramTypes}), `);
            i++;
            /*
            if (settings.data[api_key]) {
                data_key = api_key;
            } else if (settings.data[trim_after(api_key,'-')]) {
                data_key = trim_after(api_key,'-');
            } else {
                rc = false;
            }
            */

            // console.log(`api_key ${api_key} Primary: ${primary} hasDefault: ${has_default}`);
            // console.log(`    * api_key ${api_key} data_key: ${data_key}`);

        }
    }
    return rc;
}
