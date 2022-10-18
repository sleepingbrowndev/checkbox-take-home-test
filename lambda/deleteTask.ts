import db from './db';

async function deleteTask(taskId: string) {
    try {
        const query = `DELETE FROM tasks WHERE id = :taskId`;
        const result = await db.query(query, { taskId });
        if (result.numberOfRecordsUpdated === 1) return taskId;
        return null;
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default deleteTask;