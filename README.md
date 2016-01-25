# Scheduling app

# Live dev server
https://guarded-waters-3652.herokuapp.com

Use any credentials in fixtures

```
groupmember/secret
groupowner/secret
```

## Installing libraries

### Linux
```bash
# Install node and node package manager
sudo apt-get install git nodejs npm
```

### Mac
```bash
brew install node git
```

### Windows
```
TODO
```

## Setting up environment
```bash
# Install node utilities
# (Might have to clear npm cache if issues occur)
# To clear cache:
# npm cache clear
sudo npm install -g bower ionic grunt-cli
# Setup and clone repository
mkdir ~/git
cd ~/git
git clone https://bitbucket.org/teamevolution/schedulingapp
> Enter your username/password
# Install node project modules
cd schedulingapp
npm install
# Wait for awhile...
```

## Run the server



```bash
cd ~/git/schedulingapp
# Using Grunt (to relaunch server when changes are made)
grunt server
# Using node
node server.js
```

## Run ionic (mobile front-end)

Ionic will auto refresh as front end files are edited

```bash
# Running ionic
cd ~/git/schedulingapp/ionic
ionic serve
# Open browser http://localhost:8100
```

## Running tests
```bash
grunt simplemocha
```

## Populating database with fixtures (without running tests)
```bash
export LOAD_FIXTURES="true"
grunt simplemocha
```

## Populating database with fixtures when server starts up
```bash
# NOTE: Code will not run when NODE_ENV="PROD"
export LOAD_FIXTURES="true"
export CAN_DROP_TABLES="true"
node server.js
```

## Using Node.js cluster capabilities
```bash
# Use 4 workers
export WORKERS="4"
node server.js
```

## Configuring push notifications
```bash
# Google cloud messaging
export PUSH_GCM_KEY="gcm_key"
# Apple push notifictions
export PUSH_APN_CERT="apn_certficiate"
export PUSH_APN_KEY="apn_key"
# Windows notification service
export PUSH_WNS_ID="wns_app_id"
export PUSH_WNS_SECRET="wns_secret"
```

## Configuring gmail for sending emails
```bash
# configure with username/password
export GMAIL_USER="user@gmail.com"
export GMAIL_PASS="using_passwords_instead_of_oauth"
# or with OAuth
export GMAIL_CLIENT_ID="your_client_id"
export GMAIL_REFRESH_TOKEN="your_refresh_token"
export GMAIL_ACCESS_TOKEN="your_access_token"
# specify the url of the webserver (for sending links in emails)
export WEB_URL="https://www.proxyshift.com"
# configure RabbitMQ
export CLOUDAMQP_URL="url_to_rabbitmq_server"
# spawn 4 workers per worker that gets ran
export RABBIT_WORKERS="4"
```
