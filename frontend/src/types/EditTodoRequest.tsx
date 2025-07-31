export type EditTodoRequest = {
    todoItem: string,
    priority: number;
    dueDate: string | null;
    delete: boolean;
}