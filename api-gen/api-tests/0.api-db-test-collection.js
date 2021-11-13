
// this file was generated
const Comment = require('../../lib/runner/comment.js');
const Extension = require('../../models/db/extension.js');

// [Pull together all testing files and run them.]
const FunctionSignupPostGuestTokenTest = require('./signup-post.guest_token.db.test.js');
const FunctionSigninPostGuestTokenTest = require('./signin-post.guest_token.db.test.js');
const FunctionAdopteeGetTmbrGuestTokenTest = require('./adoptee-get-tmbr.guest_token.db.test.js');
const FunctionAdopterDeleteTvUserTokenTest = require('./adopter-delete-tv.user_token.db.test.js');
const FunctionAdopterGetTiUserTokenTest = require('./adopter-get-ti.user_token.db.test.js');
const FunctionAdopterPutTijUserTokenTest = require('./adopter-put-tij.user_token.db.test.js');
const FunctionAdopteeDeleteTvoUserTokenTest = require('./adoptee-delete-tvo.user_token.db.test.js');
const FunctionAdopteeGetTioUserTokenTest = require('./adoptee-get-tio.user_token.db.test.js');
const FunctionAdopteeGetTmbrUserTokenTest = require('./adoptee-get-tmbr.user_token.db.test.js');
const FunctionAdopteePostTjoUserTokenTest = require('./adoptee-post-tjo.user_token.db.test.js');
const FunctionAdopteePutTijoUserTokenTest = require('./adoptee-put-tijo.user_token.db.test.js');
const FunctionAdopterDeleteTvoAdminTokenTest = require('./adopter-delete-tvo.admin_token.db.test.js');
const FunctionAdopterGetTioAdminTokenTest = require('./adopter-get-tio.admin_token.db.test.js');
const FunctionAdopterPostTjoAdminTokenTest = require('./adopter-post-tjo.admin_token.db.test.js');
const FunctionAdopterPutTijoAdminTokenTest = require('./adopter-put-tijo.admin_token.db.test.js');
const FunctionAdopteeDeleteTvoAdminTokenTest = require('./adoptee-delete-tvo.admin_token.db.test.js');

module.exports = class ApiTests extends Array {

    constructor(apiVersion, baseVersion) {
      /* $lab:coverage:off$ */
      super();
  
      this.push(new Comment('-- Enable Api Testing'));
      this.push(new Extension('pgtap','public'));

     
            this.push(new FunctionSignupPostGuestTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionSigninPostGuestTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeGetTmbrGuestTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterDeleteTvUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterGetTiUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterPutTijUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeDeleteTvoUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeGetTioUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeGetTmbrUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteePostTjoUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteePutTijoUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterDeleteTvoAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterGetTioAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterPostTjoAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterPutTijoAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeDeleteTvoAdminTokenTest('api', apiVersion, baseVersion));

      
      /* $lab:coverage:on$ */
    }    
  };
