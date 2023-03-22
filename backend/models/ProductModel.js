import { Sequelize } from "sequelize";
import db from "../config/Database.js";    

const {DataTypes} = Sequelize;

const Product = db.define('produits',{
    nom: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    description : DataTypes.TEXT,
    rating:  DataTypes.FLOAT,
    prix: DataTypes.DECIMAL(10,2),
    category_id: DataTypes.INTEGER
}, {
    freezeTableName: true
});

export default Product;

(async()=> {
    await db.sync();
})();