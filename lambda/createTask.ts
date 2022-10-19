import Task from './Task';
import db from './db';
const { v4: uuid } = require('uuid');
const moment = require('moment');

async function createTask(task: Task) {
    if (!task.id) task.id = uuid();
    if (!task.createdat) task.createdat = moment().format();
    if (!task.updatedat) task.updatedat = moment().format();

    const { id, name, description, duedate, createdat, updatedat, status } = task;
    try {
        const query = `INSERT INTO tasks (id,name,description,duedate,createdat,updatedat,status) VALUES(:id,:name,:description,:duedate,:createdat,:updatedat,:status)`;
        await db.query(query, { id, name, description, duedate, createdat, updatedat, status });
        return task;
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default createTask;