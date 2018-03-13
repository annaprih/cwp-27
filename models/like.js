/**
 * Created by annae on 06.03.2018.
 */
module.exports = (Sequelize, sequelize)=>{
    return sequelize.define('Like',{
        "id":{type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        "tweetId": Sequelize.INTEGER,
        "authorId": Sequelize.INTEGER
    })
};