const app = require('./app')// import the express application
const http = require('http')// imports Node's built-in web server module
const config = require('./utils/config')//import ENV variables
const logger = require('./utils/logger')

const server = http.createServer(app) //create http web server

//##################### RUN THE SERVER ##################
//const PORT = process.env.PORT

server.listen(config.PORT,() => {
  logger.info(`server running on port ${config.PORT}`);
});
//#######################################################



