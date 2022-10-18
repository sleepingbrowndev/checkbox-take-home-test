import Task from './Task';
import db from './db';
const { v4: uuid } = require('uuid');
const moment = require('moment');

async function createTask(task: Task) {
    if (!task.id) task.id = uuid();
    if (!task.createdAt) task.createdAt = moment().format();
    if (!task.updatedAt) task.updatedAt = moment().format();

    const { id, name, description, dueDate, createdAt, updatedAt, status } = task;
    try {
        const query = `INSERT INTO tasks (id,name,description,dueDate,createdAt,updatedAt,status) VALUES(:id,:name,:description,:dueDate,:createdAt,:updatedAt,:status)`;
        await db.query(query, { id, name, description, dueDate, createdAt, updatedAt, status });
        return task;
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default createTask;