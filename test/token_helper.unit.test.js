const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

// eslint-disable-next-line no-multi-assign
const { describe, it } = exports.lab = Lab.script();

// const { init } = require('../lib/server');

const TokenHelper = require('../lib/auth/token_helper');

describe('TokenHelper', () => {
  // Initialize
  it('API new TokenHelper', () => {
    const old_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImNsaWVudC1hcGkiLCJ1c2VyIjoiZXhpc3RpbmcyQHVzZXIuY29tIiwic2NvcGUiOiJhcGlfdXNlciIsImp0aSI6InVzZXJuYW1lI2V4aXN0aW5nMkB1c2VyLmNvbSIsImtleSI6Imd1aWQjOWNiMTI0NzgtM2EzYS00ODVlLTgzYjEtZTkwMjcyMzJhZDllIiwiZXhwIjoxNjMyNDczMzM2LjI5ODk3Nn0.RrT7xOsoe_xHxgwXPgDv34MrPO1CQuZBGXcRRSf25No';

    expect(new TokenHelper(old_token)).to.exist();

  });


  it('API TokenHelper Expired', () => {
    
    const old_claim = {
      "aud": "citizenlabs-api",
      "iss": "citizenlabs",
      "sub": "client-api",
      "user": "existing2@user.com",
      "scope": "api_user",
      "jti": "username#existing2@user.com",
      "key": "guid#9cb12478-3a3a-485e-83b1-e9027232ad9e",
      "exp": 1632473336.298976
    };
    
    
    const old_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImNsaWVudC1hcGkiLCJ1c2VyIjoiZXhpc3RpbmcyQHVzZXIuY29tIiwic2NvcGUiOiJhcGlfdXNlciIsImp0aSI6InVzZXJuYW1lI2V4aXN0aW5nMkB1c2VyLmNvbSIsImtleSI6Imd1aWQjOWNiMTI0NzgtM2EzYS00ODVlLTgzYjEtZTkwMjcyMzJhZDllIiwiZXhwIjoxNjMyNDczMzM2LjI5ODk3Nn0.RrT7xOsoe_xHxgwXPgDv34MrPO1CQuZBGXcRRSf25No';
    const tokenHelper = new TokenHelper(old_token);

    expect(tokenHelper.getClaims()).to.exist();
    
    expect(tokenHelper.getKey()).to.equal(old_claim.key);
    expect(tokenHelper.getDisplayName()).to.equal(old_claim.user);
    expect(tokenHelper.getExpiration()).to.equal(old_claim.exp);
    expect(tokenHelper.getScope()).to.equal(old_claim.scope);
    expect(tokenHelper.getSubject()).to.equal(old_claim.sub);
    expect(tokenHelper.getIssuer()).to.equal(old_claim.iss);
    expect(tokenHelper.isAuthenticated()).to.equal(false);
    expect(tokenHelper.isExpired()).to.equal(true);

  });
  

});
