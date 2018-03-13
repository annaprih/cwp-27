/**
 * Created by annae on 06.03.2018.
 */
module.exports = (Sequelize, sequelize)=>{
    return sequelize.define('User',{
        "id":{type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        "name": Sequelize.STRING,
        "email": Sequelize.STRING
    })
};