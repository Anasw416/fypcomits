const config = require('config');
const authenticate = require('../../middleware/authenticate');
const groups = require('../routes');
const logger = require('../../../utils/logger');

class Routes {

    constructor(app) {
        this.configureCors(app);

        app.use(authenticate);
        app.use("/groups",groups);
        app.use("/", function (req, res) {
            res.status(404).send("Woops! 404 Not Found");
        });
    }

    configureCors(app) {
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET');
            res.setHeader('Cache-Control', 'no-cache');
            next();
        });
    }
}
module.exports = Routes;
