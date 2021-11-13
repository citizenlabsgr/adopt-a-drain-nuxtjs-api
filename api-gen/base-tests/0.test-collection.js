
// this file was generated
const Comment = require('../../lib/runner/comment.js');
const Extension = require('../../models/db/extension.js');

// [Pull together all testing files and run them.]
const Query = require('./query.test.js');
const Update = require('./update.test.js');
const Delete = require('./delete.test.js');
const Insert = require('./insert.test.js');
const ChangedKey = require('./changed_key.test.js');

const Chelate = require('./chelate.test.js');
const GetJwtClaims = require('./get_jwt_claims.test.js');
const GetJwtSecret = require('./get_jwt_secret.test.js');
const ValidateChelate = require('./validate_chelate.test.js');
const ValidateCredentials = require('./validate_credentials.test.js');
const ValidateForm = require('./validate_form.test.js');
const ValidateToken = require('./validate_token.test.js');
const Table = require('./table.test.js');

module.exports = class BaseTests extends Array {

    constructor(apiVersion, baseVersion) {
      /* $lab:coverage:off$ */
      super();
  
      this.push(new Comment('-- Enable Api Testing'));
      this.push(new Extension('pgtap','public'));

      this.push(new ChangedKey('base', apiVersion, baseVersion));
      this.push(new Chelate('base', apiVersion, baseVersion));
      this.push(new GetJwtClaims('base', apiVersion, baseVersion));
      this.push(new GetJwtSecret('base', apiVersion, baseVersion));
      this.push(new ValidateChelate('base', apiVersion, baseVersion));
      this.push(new ValidateCredentials('base', apiVersion, baseVersion));
      this.push(new ValidateForm('base', apiVersion, baseVersion));
      this.push(new ValidateToken('base', apiVersion, baseVersion));
      this.push(new Table('base', apiVersion, baseVersion));

      this.push(new Query('base', apiVersion, baseVersion));
      this.push(new Update('base', apiVersion, baseVersion));
      this.push(new Delete('base', apiVersion, baseVersion));
      this.push(new Insert('base', apiVersion, baseVersion));
      
      /* $lab:coverage:on$ */
    }    
  };
