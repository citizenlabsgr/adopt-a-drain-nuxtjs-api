
// this file was generated
const Comment = require('../../lib/runner/comment.js');
const Extension = require('../../models/db/extension.js');

// [Pull together all testing files and run them.]
const FunctionSignupPostGuestTokenTest = require('./signup-post.guest_token.db.test.js');
const FunctionSigninPostGuestTokenTest = require('./signin-post.guest_token.db.test.js');
const FunctionAdopteeGetTmbrGuestTokenTest = require('./adoptee-get-tmbr.guest_token.db.test.js');
const FunctionDocumentGetToiGuestTokenTest = require('./document-get-toi.guest_token.db.test.js');
const FunctionAdopterDeleteToiUserTokenTest = require('./adopter-delete-toi.user_token.db.test.js');
const FunctionAdopterGetToiUserTokenTest = require('./adopter-get-toi.user_token.db.test.js');
const FunctionAdopterPutToijUserTokenTest = require('./adopter-put-toij.user_token.db.test.js');
const FunctionAdopteeDeleteToiUserTokenTest = require('./adoptee-delete-toi.user_token.db.test.js');
const FunctionAdopteeGetToiUserTokenTest = require('./adoptee-get-toi.user_token.db.test.js');
const FunctionAdopteeGetTmbrUserTokenTest = require('./adoptee-get-tmbr.user_token.db.test.js');
const FunctionAdopteePostTojUserTokenTest = require('./adoptee-post-toj.user_token.db.test.js');
const FunctionAdopteePutToijUserTokenTest = require('./adoptee-put-toij.user_token.db.test.js');
const FunctionDocumentGetToiUserTokenTest = require('./document-get-toi.user_token.db.test.js');
const FunctionAdopterDeleteToiAdminTokenTest = require('./adopter-delete-toi.admin_token.db.test.js');
const FunctionAdopterGetToiAdminTokenTest = require('./adopter-get-toi.admin_token.db.test.js');
const FunctionAdopterPostTojAdminTokenTest = require('./adopter-post-toj.admin_token.db.test.js');
const FunctionAdopterPutToijAdminTokenTest = require('./adopter-put-toij.admin_token.db.test.js');
const FunctionAdopteeDeleteToiAdminTokenTest = require('./adoptee-delete-toi.admin_token.db.test.js');
const FunctionDocumentDeleteToiAdminTokenTest = require('./document-delete-toi.admin_token.db.test.js');
const FunctionDocumentGetToiAdminTokenTest = require('./document-get-toi.admin_token.db.test.js');
const FunctionDocumentPostTojAdminTokenTest = require('./document-post-toj.admin_token.db.test.js');

module.exports = class ApiTests extends Array {

    constructor(apiVersion, baseVersion) {
      /* $lab:coverage:off$ */
      super();

      this.push(new Comment('-- Enable Api Testing'));
      this.push(new Extension('pgtap','public'));


            this.push(new FunctionSignupPostGuestTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionSigninPostGuestTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeGetTmbrGuestTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionDocumentGetToiGuestTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterDeleteToiUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterGetToiUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterPutToijUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeDeleteToiUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeGetToiUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeGetTmbrUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteePostTojUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteePutToijUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionDocumentGetToiUserTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterDeleteToiAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterGetToiAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterPostTojAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopterPutToijAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionAdopteeDeleteToiAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionDocumentDeleteToiAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionDocumentGetToiAdminTokenTest('api', apiVersion, baseVersion));
      this.push(new FunctionDocumentPostTojAdminTokenTest('api', apiVersion, baseVersion));


      /* $lab:coverage:on$ */
    }
  };
