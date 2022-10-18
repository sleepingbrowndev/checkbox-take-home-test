import db from './db';

async function getTaskById(postId: string) {
    try {
        const query = `SELECT * FROM tasks WHERE id = :taskId`;
        const results = await db.query(query, { postId });
        return results.records[0];
    } catch (err) {
        console.log('Postgres error: ', err);
        return null;
    }
}

export default getTaskById;