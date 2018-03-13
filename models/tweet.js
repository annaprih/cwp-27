/**
 * Created by annae on 06.03.2018.
 */
module.exports = (Sequelize, sequelize)=>{
    return sequelize.define('Tweet',{
        "id":{type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        "message": Sequelize.STRING,
        "publishedOn": Sequelize.STRING,
        "authorId": Sequelize.INTEGER
    })
};