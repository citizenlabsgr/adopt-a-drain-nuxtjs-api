# Roles

api_guest
api_user
api_admin

## Token Roles

## Claims

guest_claims see Details.md
user_claims see Details.md
admin_claims see Details.md

## Default User
guest



## Javascript

Guest Token

```
const payload = new GuestTokenPayload().payload();
const secret = process.env.JWT_SECRET;

let guest_token = Jwt.token.generate(payload, secret);
```

User Token

```
const key = '1k2kekd84';
const username = 'someone@somewhere.com';
const lapse_in_millisec=5000;
const scope = 'api_user';

const payload = new UserTokenPayload(username, key, scope, lapse_in_millisec).payload();

const secret = process.env.JWT_SECRET;
const user_token = Jwt.token.generate(payload, secret);

```

Admin Token

```
const key = '1k2kekd84';
const username = 'someone@somewhere.com';

const payload = new AdminTokenPayload(username, key).payload();
const secret = process.env.JWT_SECRET;
const admin_token = `Bearer ${Jwt.token.generate(payload, secret)}`;
```

## SQL

Guest Token

```
base_0_0_1.sign(
  '{
     "aud":"citizenlabs-api",
     "iss":"citizenlabs",
     "sub":"client-api",
     "user":"guest",
     "scope":"api_guest",
     "key":"0"
   }'::JSON,
   base_0_0_1.get_jwt_secret()::TEXT
)::TOKEN
```

User Token

```
base_0_0_1.sign(
  '{
     "aud":"citizenlabs-api",
     "iss":"citizenlabs",
     "sub":"client-api",
     "user":"<user-email-value>",
     "scope":"api_user",
     "key":"<user-owner-key-value>"
   }'::JSON,
   base_0_0_1.get_jwt_secret()::TEXT
)::TOKEN
```

Admin Token

```
base_0_0_1.sign(
  '{
     "aud":"citizenlabs-api",
     "iss":"citizenlabs",
     "sub":"client-api",
     "user":"<user-email-value>",
     "scope":"api_admin",
     "key":"<user-owner-key-value>"
   }'::JSON,
   base_0_0_1.get_jwt_secret()::TEXT
)::TOKEN
```
