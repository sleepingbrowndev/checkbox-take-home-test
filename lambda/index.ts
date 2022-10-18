import createTask from './createTask';
import listTasks from './listTasks';
import updateTask from './updateTask';
import deleteTask from './deleteTask';
import getTaskById from './getTaskById';
import Task from './Task';

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        task: Task,
        taskId: string
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case 'createTask':
            return await createTask(event.arguments.task);
        case 'listTasks':
            return await listTasks();
        case 'updateTask':
            return await updateTask(event.arguments.task);
        case 'deleteTask':
            return await deleteTask(event.arguments.taskId);
        case 'getTaskById':
            return await getTaskById(event.arguments.taskId);
        default:
            return null;
    }
}