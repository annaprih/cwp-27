/**
 * Created by annae on 02.03.2018.
 */
module.exports = (Sequelize, config) => {
    const sequelize = new Sequelize(config.db.name,
        config.db.user, config.db.password,{
            host: config.db.host,
            dialect: 'mysql',
            logging: false,
            define: {
                timestamps: true,
                paranoid: true,
                defaultScope: {
                    where: { deletedAt: { $eq: null } }
                }
            }
        });

    const User = require('../models/user')(Sequelize, sequelize);
    const Tweet = require('../models/tweet')(Sequelize, sequelize);
    const Like = require('../models/like')(Sequelize, sequelize);

    Like.belongsTo(User, {constraint:false, foreignKey: 'authorId'});
    User.hasMany(Like, {constraint: false, foreignKey: 'authorId'});
    Tweet.belongsTo(User, {constraint: false, foreignKey: 'authorId'});
    User.hasMany(Tweet, {constraint: false, foreignKey: 'authorId'});
    Like.belongsTo(Tweet, {constraint:false, foreignKey: 'tweetId'});
    Tweet.hasMany(Like, {constraint: false, foreignKey: 'tweetId'});

    return {
        users: User,
        tweets: Tweet,
        likes: Like,

        sequelize,
        Sequelize
    };
};