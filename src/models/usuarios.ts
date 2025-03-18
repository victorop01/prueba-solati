import { DataTypes, Sequelize, Model } from "sequelize";
import { Connection } from "../db/connection";

type includes = '';

const UsuariosModel = (include?: (includes)[]) => {
	const model = (Connection.getInstance().db as Sequelize).define<Model<IUsuario>>('usuarios', {
	"id": {
		"type": DataTypes.NUMBER.UNSIGNED,
		"primaryKey": true,
		"autoIncrement": true
	},
	"fullname": {
		"type": DataTypes.STRING(100)
	},
	"username": {
		"type": DataTypes.STRING(150)
	},
	"password": {
		"type": DataTypes.STRING(100)
	},
}, { tableName: 'users' });

	return model;
}

export interface IUsuario {
	id?: number,
	username?: string,
	password?: string,
    fullname?: string,
}

export default UsuariosModel;