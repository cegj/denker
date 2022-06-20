import { Sequelize } from "sequelize";

export const db = new Sequelize('denker', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    db.authenticate()
    console.log(`Conectado ao banco de dados`)
} catch(err){
    console.log(`Não foi possível conectar: ${err}`)
}