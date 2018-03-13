/**
 * Created by annae on 02.03.2018.
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
module.exports = (db, config) => {
    const apiController = require('./controllers/Api')(db);

    app.use(bodyParser.json());
    app.use('/api', apiController);

    return app;
};