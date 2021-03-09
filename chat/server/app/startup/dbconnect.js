const db = require('../../../../library/sequelize-cli/models');
const logger = require('../../../utils/logger');

class DbConnect {
    initialize() {
        return new Promise((resolve, reject) => {

            db.sequelize.sync({ force: false })
                        .then(() => {
                            console.log('Sequelize Database has been connected.')
                            resolve('Database Connected');
                        })
                        .catch((error) => {
                            console.log(error);
                            logger.error(`Mysql issues : ${error}`);
                            reject(new Error(`Mysql issues : ${error}`));
                        });
        });
    }
}

module.exports = DbConnect;