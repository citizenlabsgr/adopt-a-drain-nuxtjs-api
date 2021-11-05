
// this file was generated
const Comment = require('../../lib/runner/comment.js');
const Extension = require('../../models/db/extension.js');

// [Pull together all testing files and run them.]
const SignupPost = require('./signup-post.guest_token.test.js');
const SigninPost = require('./signin-post.guest_token.test.js');
const AdopterDeleteTv = require('./adopter-delete-tv.user_token.test.js');
const AdopterGetTi = require('./adopter-get-ti.user_token.test.js');
const AdopterPutTij = require('./adopter-put-tij.user_token.test.js');
const AdopteeDeleteTv = require('./adoptee-delete-tv.user_token.test.js');
const AdopteeGetTi = require('./adoptee-get-ti.user_token.test.js');
const AdopteeGetTo = require('./adoptee-get-to.user_token.test.js');
const AdopteePostTj = require('./adoptee-post-tj.user_token.test.js');
const AdopteePutTij = require('./adoptee-put-tij.user_token.test.js');
const AdopterDeleteTvo = require('./adopter-delete-tvo.admin_token.test.js');
const AdopterGetTio = require('./adopter-get-tio.admin_token.test.js');
const AdopterPostTjo = require('./adopter-post-tjo.admin_token.test.js');
const AdopterPutTijo = require('./adopter-put-tijo.admin_token.test.js');
const AdopteeDeleteTvo = require('./adoptee-delete-tvo.admin_token.test.js');

module.exports = class ApiTests extends Array {

    constructor(apiVersion, baseVersion) {
      /* $lab:coverage:off$ */
      super();
  
      this.push(new Comment('-- Enable Api Testing'));
      this.push(new Extension('pgtap','public'));

     
            this.push(new SignupPost('api', apiVersion, baseVersion));
      this.push(new SigninPost('api', apiVersion, baseVersion));
      this.push(new AdopterDeleteTv('api', apiVersion, baseVersion));
      this.push(new AdopterGetTi('api', apiVersion, baseVersion));
      this.push(new AdopterPutTij('api', apiVersion, baseVersion));
      this.push(new AdopteeDeleteTv('api', apiVersion, baseVersion));
      this.push(new AdopteeGetTi('api', apiVersion, baseVersion));
      this.push(new AdopteeGetTo('api', apiVersion, baseVersion));
      this.push(new AdopteePostTj('api', apiVersion, baseVersion));
      this.push(new AdopteePutTij('api', apiVersion, baseVersion));
      this.push(new AdopterDeleteTvo('api', apiVersion, baseVersion));
      this.push(new AdopterGetTio('api', apiVersion, baseVersion));
      this.push(new AdopterPostTjo('api', apiVersion, baseVersion));
      this.push(new AdopterPutTijo('api', apiVersion, baseVersion));
      this.push(new AdopteeDeleteTvo('api', apiVersion, baseVersion));

      
      /* $lab:coverage:on$ */
    }    
  };
