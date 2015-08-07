# Scheduling app

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