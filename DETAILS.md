# Details
Details is a master list of useful project information.

# Index

> [Architecture](#architecture)

> [Configuration Settings](#configuration-settings)

> [Platforms](#platforms)

> [Processes](#processes )

# Addons

* # airbreak
    [airbrake](https://airbrake.io) is application monitoring

* # heroku-postgresql
    [heroku-postgresql](https://elements.heroku.com/addons/heroku-postgresql) is a database

* # sendgrid
    [sendgrid](https://sendgrid.com) is an email api

# Architecture
```
[App] <---> [API] <---> [Database]
```

* Application (App)
* Application Programming Interface (API)
* Database (DB) 
* Chelate is {"pk":"", "sk":"", "tk":"", "form":"", "active": true, "owner_key": "created":"","updated":""}

# Configuration Settings
* Setting: API_TOKEN
* Setting: DATABASE_URL
* Setting: HOST
* Setting: JWT_SECRET
* Setting: JWT_CLAIMS
* Setting: NODE_ENV
* Setting: NPM_CONFIG_PRODUCTION
* Setting: PORT 
* Setting: postdeploy
* Setting: POSTGRES_DB
* Setting: POSTGRES_USER
* Setting: POSTGRES_PASSWORD
* Setting: POSTGRES_JWT_SECRET
* Setting: POSTGRES_API_PASSWORD
* Setting: POSTGRES_JWT_CLAIMS

# Forms
* Form: __Adoptee__ is {"name": "", "drain_id": "", "lat": 0.0, "lon": 0.0}
* Form: __SignIn__ is {"username": "","password":""}
* Form: __SignUp__ is {"username": "", "displayname":"", "password":""}
* Form: __User__ is {"username": "", "displayname": "password", ""}

# Platforms

* Platform: __GitHub__ (GH)
* Platform: __Heroku__ (HK)

# Processes 

* Process: Connect to GitHub
* Process: Create Database
* Process: Create JWT_CLAIMS 
* Process: Create JWT_SECRET 
* Process: Create API_TOKEN for Development
    Use a python script to generate development token 
    ```
    # eg
    
    import uuid
    import jwt

    def main():
        # claim is same as POSTGRES_JWT_CLAIMS and JWT_CLAIMS
        claim = {"aud":"lyttlebit-api", 
                 "iss":"lyttlebit", 
                 "sub":"client-api", 
                 "user":"guest", 
                 "scope":"api_guest", 
                 "key":"0"}
        password = str(uuid.uuid4())
        # go get the from syslog_ident from heroku postgres (SHOW ALL;)
        password = 'PASSWORDmustBEATLEAST32CHARSLONGLONG'
        jwt_token = jwt.encode(claim, password, algorithm="HS256")

        print('claim', claim)
        print('password: ', password)
        print('Bearer', jwt_token)

    if __name__ == "__main__":
        main()
    ```
* Process: Create API_TOKEN for Production
    Use a python script to generate production token 
    ```
    # eg
    
    import uuid
    import jwt

    def main():
        # claim is same as POSTGRES_JWT_CLAIMS and JWT_CLAIMS
        claim = {"aud":"lyttlebit-api", 
                 "iss":"lyttlebit", 
                 "sub":"client-api", 
                 "user":"guest", 
                 "scope":"api_guest", 
                 "key":"0"}
        password = str(uuid.uuid4())
        # go get the from syslog_ident from heroku postgres (SHOW ALL;)
        password = 'xe5d9645_302a_493d_b9de_207dxa16ba9b'
        jwt_token = jwt.encode(claim, password, algorithm="HS256")

        print('claim', claim)
        print('password: ', password)
        print('Bearer', jwt_token)

    if __name__ == "__main__":
        main()
    ```
* Process: Create API for Development
* Process: Create API for Production
* Process: Create Database for Development
* Process: Create Database for Production
* Process: Create Database Table for Development
* Process: Create Database Table for Production
* Process: Create Database Functions for Development
* Process: Create Database Functions for Production
* Process: Create GitHub Actions
* Process: Create GitHub Repository

* MBR is {"west": 0.0, "east": 0.0, "north": 0.0, "south": 0.0}
* MBR is Minimum Bounding Rectangle
* Minimum Bounding Rectangle is MBR 

* Update GitHub Repository
* Update API_TOKEN 
    * On change, update JWT_SECRET
* Update JWT_CLAIMS 
    * On change, update JWT_SECRET and create new API_TOKEN 
* Update JWT_SECRET 
    * On change, manually create new API_TOKEN 
