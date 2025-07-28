
export type Todo = {
    id: string;
    todoItem: string;
    priority: number;
    creationDate: string;
    doneDate: string;
    dueDate: string | null;
    completed: boolean;
};

type TodoItemProps = {
    todo: Todo;
    onToggleCompleted: (id: string) => void;
    onEdit: (todo: Todo) => void;
};

function TodoItem(props : TodoItemProps){
    const { todo, onToggleCompleted, onEdit } = props;

    return(
        <div>
            <input
                type = 'checkbox'
                checked = {todo.completed}
                onChange = {() => onToggleCompleted(todo.id)}
            />
            <p><strong>{todo.todoItem}</strong></p>
            <p><strong>{todo.priority}</strong></p>
            <p><strong>{todo.dueDate ? todo.dueDate : "No due date"}</strong></p>
            <button onClick = {() => onEdit(todo)}> Edit/Delete</button>
        </div>
    );
}

export default TodoItem;