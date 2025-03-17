import { DataTypes, Sequelize, Model } from "sequelize";
import { Connection } from "../db/connection";

type includes = '';

const TaskModel = (include?: (includes)[]) => {
	const model = (Connection.getInstance().db as Sequelize).define<Model<ITask>>('tasks', {
	"id": {
		"type": DataTypes.NUMBER.UNSIGNED,
		"primaryKey": true,
		"autoIncrement": true
	},
	"title": {
		"type": DataTypes.STRING(100)
	},
    "description": {
		"type": DataTypes.TEXT
	},
	"status": {
		"type": DataTypes.NUMBER
	},
    
}, { tableName: 'tasks' });

	return model;
}

export interface ITask {
	id?: number,
	title?: string,
	description?: Text,
    status?: string,
}

export default TaskModel;