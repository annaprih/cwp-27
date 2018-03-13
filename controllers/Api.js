/**
 * Created by annae on 03.03.2018.
 */
const express = require('express');

module.exports = (db)=>{
    const router = express.Router();

    const user = require('./UserController')(db.users);
    const tweet = require('./TweetController')(db.tweets, db.users);
    const like = require('./LikeController')(db.likes);

    router.use('/user', user);
    router.use('/user', tweet);
    router.use('/user', like);

    return router;
};
