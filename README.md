# User Portal for Drive

This is the user portal for Drive. It helps storage providers to create their CMT wallet and use that to receive payment for their registered storage space.

## Prerequisite

- NodeJS
- NPM
- MongoDB

The project is supposed to run together on a [CMT Travis Node](http://travis-faucet.cybermiles.io/) to secure the access of the wallet keys. For testing purpose, it can also run separately and use HTTP provider to talk to Travis if the safety of the private key is not a concern.

The web portal itself is platform independant and should be able to run on Linux, Windows and macOS.

On Ubuntu 18, the dependencies could be installed using the following commands:
```bash
$ sudo apt-get update
$ sudo apt-get install nodejs npm mongodb
```

## Installation

1. Clone or download the repository.

2. Run the following command to install the dependencies from NPM and run the build script to convert React JSX to javascript and package them into a single `bundle.js`.

```bash
$ cd src
$ npm install
$ npm run-script build
```

## Run

1. Check if any configurations in src/config/bdweb.conf.sample needs to be changed. Save the changes as src/config/bdweb.conf if any changes.

2. Make sure mongod is started. On Ubuntu 18, this can be done using the following command:

```bash
systemctl start mongodb.service
```

3. Execute the following command to start the server.

```bash
$ cd src
$ node index.js
```

Then the portal should be able to be accessed in the browser as the following URL (change the port if modified in bdweb.conf):

http://localhost:8080

## Development

For development purpose, the following command can be run to monitor the changes in client scripts (.js and .jsx) and update the bundle JS file accordingly.

```bash
$ cd src
$ npx webpack --watch --mode=development --devtool source-map
```

## Basic Folder Structure

```
src             Root folder that contains the project entry and router
 |-- config
 |-- frame      Initial HTML frame page
 |-- lib        Server side NodeJS handlers
 |-- public     Public resource files
 |-- scripts    Client side (browser) JSX and JS files
```