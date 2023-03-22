import { Sequelize } from "sequelize";

const db = new Sequelize('fashion','root','',{
    host: 'localhost',
    dialect: "mysql"
});

export default db;