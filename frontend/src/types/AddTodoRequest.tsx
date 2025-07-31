export type Todo = {
    id: string;
    todoItem: string;
    priority: number;
    creationDate: string;
    dueDate: string | null;
    doneDate: string | null;
    completed: boolean;
    deleteFlag: false;
};