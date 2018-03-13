/**
 * Created by annae on 02.03.2018.
 */
const Sequelize = require('sequelize');
const config = require('./config.json');
const db = require('./Context/db')(Sequelize, config);
const server = require('./server')(db,config);


(async function () {
    db.sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
   // await db.sequelize.sync({force:true});
    server.listen(4000, () => console.log('Running'));
})();