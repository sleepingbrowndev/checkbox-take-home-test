import Task from './Task';
import db from './db';

async function updateTask(task: Task) {
    // Dynamic task updates
    if (Object.entries(task).length === 1) return;
    let query = `UPDATE tasks SET`;
    const updateVariables: { [key: string]: string } = { id: task.id };
    Object.entries(task).forEach(item => {
        if (item[0] === 'id') return;
        updateVariables[item[0]] = item[1];
        if (Object.keys(updateVariables).length > 2) {
            query = `${query},`;
        }
        query = `${query} ${item[0]} = :${item[0]} `;
    })
    query = query + 'where id = :id';
    try {
        await db.query(query, updateVariables)
        return task
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default updateTask;