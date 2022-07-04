import { Sequelize } from "sequelize";

const dbName = process.env.DB_NAME || 'denker';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';

export const db = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql'
});

try {
    db.authenticate()
    console.log(`Conectado ao banco de dados`)
} catch(err){
    console.log(`Não foi possível conectar: ${err}`)
}