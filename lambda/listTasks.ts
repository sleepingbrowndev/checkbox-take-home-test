import db from './db';

async function listTasks() {
    try {
        const result = await db.query(`SELECT * FROM tasks`);
        return result.records;
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default listTasks;