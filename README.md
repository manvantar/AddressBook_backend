# AddressBook_backend
MongoDB, Express, NodeJS

- ### Requirements
For development, you will only need mongoDB, Node.js and a node packages and npm in your environment.

### Node
- #### Node installation on Windows
 Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

    If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.17.0
  
    $ npm --version
    6.14.13

## Install
  $ git clone https://github.com/manvantar/AddressBook_backend.git

  $ cd AddressBook_backend
  
  $ npm install

## Configure app 
  after installation create '.env' file in AddressBook_backend root path and then add the "DATABASE_URL,SERVER_PORT,JWT_KEY and JWT_TIMER" environment variables for your customisation

## Running the app
  $npm start

## Testing the app
  $npm test