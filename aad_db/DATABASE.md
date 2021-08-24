## Hobby Limits
* Heroku Postgres settings are available only to production-class plans (Standard, Premium, Private, and Shield) on Postgres 9.6 and above. 
* Hobby-tier plans include the default settings, which cannot be reconfigured.

## Not Hobby Friendly
* ALTER DATABASE <database naem> SET "app.settings.jwt_secret" TO 'galvaston';
* set_config is not hobby friendly
