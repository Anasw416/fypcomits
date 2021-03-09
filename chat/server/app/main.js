const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('config');
const app = express();
const DbConnect = require('./startup/dbconnect');
const Routes = require('./startup/routes');
var cors = require('cors');
const port = process.env.PORT || 1337;

// Socket setup
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer();
server.on('request', app);
const io = socketio(server,
        {
            cors: {
                origin: "https://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        }
    );
app.use(cors())
app.options('*', cors());
const socketEvents = require('./sockets');
socketEvents(io);

// Logging Middleware
if (port === 1337) { app.use(morgan('dev')); }

// Server up static files from '../../public'
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors());


var dbConnect = new DbConnect();
return dbConnect.initialize()
    .then(() => {
        var routes = new Routes(app);
        return routes;
    })
    .then(()=>{
      // Sync database then start listening if we are running the file directly
// Needed to remove errors during http testing
      if (module === require.main) {
        server.listen(port, () => {
          console.log('----- HTTP Server Started! -----');
          console.log(`Server is listening on port ${port}`);
        });
      }

    })





module.exports = app;
