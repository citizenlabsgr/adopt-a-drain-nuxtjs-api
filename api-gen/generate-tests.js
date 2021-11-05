'use strict';

const fs = require('fs');
const Util = require('./lib/util.js');
const Script = require('./lib/script.js');
const HasFunctionTemplate = require('./lib/has_function_template.js');
const InsertTemplate = require('./lib/insert_template.js');
const PostTemplate = require('./lib/post_template.js');
const SigninPostTemplate = require('./lib/signin_post_template.js');
const PutTemplate = require('./lib/put_template.js');

const GetTemplate = require('./lib/get_template.js');
const DeleteTemplate = require('./lib/delete_template.js');
const FileHelper = require('./lib/file_helper.js');
// const TokenTemplate = require('./lib/token_template.js');
// missing :PutTemplate
console.log('[Load Settings]');
let settings = JSON.parse(fs.readFileSync(`${__dirname}/settings/settings.json`));
console.log('[Load Test Data]');

let testdata = JSON.parse(fs.readFileSync(`${__dirname}/settings/settings.data.json`));
console.log('[Merge Test Data into Settings] ',);
let util = new Util();
settings['data'] = testdata['data']; 
// console.log('testdata', testdata);
testdata = undefined;
let i = 1;
// console.log('settings', settings);

console.log('[Process tests for the Token/user types]');
let fileList = [];
let fileNameList = [];
let classList = [];
let apiTestFolder = 'api-tests';

    for (let t in settings.tokens) {    

        // console.log('JSON 4');
        let token_name = settings.tokens[t].name;
        let claim = settings.tokens[t].claim;
        let role = settings.tokens[t].role; // get role from token settings
        // console.log('role', role);
        for (let a in settings.tokens[t].api) {
            let api_key =settings.tokens[t].api[a];

            let file_name = `${api_key}.${token_name}.test.js`;
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

            // inject role array into api_settings when not found
            if (!settings.api_settings[api_key].roles) { 
                settings.api_settings[api_key].roles = [];
            } 
            settings.api_settings[api_key].roles.push(role);

            let api_settings = settings.api_settings[api_key];
            // console.log('api_settings add role', api_settings);

            if (!api_settings) {
                console.error('Api_Settigs[',api_key,'] Not Found');
            }

            let token_statement = `base_0_0_1.sign('${JSON.stringify(claim)}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)`;

            let script = new Script(token_statement);

            let method = api_settings.method.toUpperCase();

            console.log(`${i} [* Write ${file_name}]`);

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
                    // [Get multiple]
                    for (let i in data) {
                        script.add(new GetTemplate(
                        token_name,
                        claim,
                        api_settings, 
                        data[i]));
                    } 
                    
                    break;
                case 'POST':
                    // console.log('method', method);
                    // [Setup Tokens]
                    // script.setTokens(new TokenTemplate(version,data));
                    
                    // [Post multiple records]
                    if (api_settings.name.name !== 'signin') {
                        for (let i in data) {
                            script.add(new PostTemplate(
                            token_name,
                            claim,
                            api_settings, 
                            data[i]));
                        }  
                    } else { // signin patch
                        script.setData(new InsertTemplate(version,data));
                        // console.log('SignIn Patch');
                        for (let i in patch_data) {
                            script.add(new SigninPostTemplate(
                            token_name,
                            claim,
                            api_settings, 
                            patch_data[i]));
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
            // [Generate individual test files]
            let scrpt = script.templatize();   
            
            /*
            let file_name = `${api_key}.${token_name}.test.js`;
            let filename = `${__dirname}/${apiTestFolder}/${file_name}`;
            
            let classname = `${util.toTitleCase(api_key)}`;
            let tokenname = `${util.toTitleCase(token_name.replace('_','-'))}`;
            // console.log('api_settings.active', api_settings.active);

            */
            // [Generate active tests]
            let fileHelper = new FileHelper(`${__dirname}/${apiTestFolder}`, file_name);
            if (api_settings.active) {

                fileList.push(filename);
                fileNameList.push(file_name);
                classList.push(classname);
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

        console.log('--');
        // break;
    }
console.log('[Generate active tests]');
console.log('fileList', fileList);
console.log('classList', classList);
const apiTestCollectionName = '0.api-test-collection.js';
let collectionFileHelper = new FileHelper(`${__dirname}/${apiTestFolder}`, apiTestCollectionName);
let declarations = '';
let instances = '';
for (i in fileNameList) {
    
   declarations += `const ${classList[i]} = require('./${fileNameList[i]}');` +'\n';
}
for (i in classList) {
   instances += `      this.push(new ${classList[i]}('api', apiVersion, baseVersion));`+'\n';
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

// let data = settings.chelates[settings.apis[settings.tokens[t].api[a]].expected[e]];
// let api_key = ''; 
// let data = setting.data[]; 
// let insertTemplate = new InsertTemplate(version,data);
/*
let script = new Script(insertTemplate);

script.add(new HasFunctionTemplate(
                                   settings.tokens[t].name,
                                   settings.tokens[t].claim,
                                   settings.apis[settings.tokens[t].api[a]]));
*/
/*                                   
for (let t in settings.tokens) {
    console.log('t',t, settings.tokens[t].name);
    for (let a in settings.tokens[t].api ) {
       // console.log('  a', a, settings.tokens[t].api[a]);
       let apis_key = settings.tokens[t].api[a];
       console.log('apis_key',apis_key);
       console.log('xxx',settings.apis[settings.tokens[t].api[a]]);
       // console.log('  a', a, settings.tokens[t].api[a],settings.apis[settings.tokens[t].api[a]]);

       // for (let e in settings.tokens[t].api[a]) {
       //    console.log('    e', e , settings.tokens[t].api[a][e]);
       // }
    }
}    
*/
// console.log('',);

// let scpt = script.templatize();

// console.log('script', scpt);

/*
for (let t in settings.tokens){
    // console.log('token is ', settings.tokens[t]);
    let token_name = settings.tokens[t].name;
    
    for (let a in settings.tokens[t].api) {
        let tmpl;
        switch(settings.tokens[t].api[a].method) {
            case 'get':
            case 'GET':
                console.log('GET');
                break;
            case 'delete':
            case 'DELETE':
                console.log('DELETE');
                
            break;       
            case 'post':
            case 'POST':
                // console.log('POST');
                script.add(new HasFunctionTemplate('api','001', token_name, settings.tokens[t].api[a]));
                // console.log('tmpl', tmpl.templatize());
            break;
            case 'put':
            case 'PUT':
                console.log('PUT');

            break;                  

        }

    
    }
}
*/
// console.log('script', script.run());

// sql functions

console.log('JSON out');
function trim_after(value, delimeter) {
    // remove last delimeter and everything after
    
    let parts = value.split(delimeter);
    parts = parts.splice(0,parts.length-1);
    return parts.join(delimeter);
}