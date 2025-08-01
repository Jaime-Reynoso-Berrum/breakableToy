import type {Todo} from "../types/AddTodoRequest.tsx";

type TodoItemProps = {
    todo: Todo;
    CompleteItem: (id: string) => void;
    onEdit: (todo: Todo) => void;
};

function getBackgroundColor(dueDate: string| null): string {
    if (!dueDate) return 'transparent';

    const now = new Date();
    const due = new Date(dueDate);
    const msPerDay = 24* 60 * 60 * 1000;
    const difference = Math.ceil((due.getTime() - now.getTime()) / msPerDay);

    if (difference < 7) return 'red';
    if (difference < 14) return 'yellow';
    return 'green';
}



function TodoItem(props : TodoItemProps){
    const { todo, CompleteItem, onEdit } = props;

    return(
        <div style = {{ backgroundColor: getBackgroundColor(todo.dueDate),
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'black',
                        border: '1px solid black'}}>
            <input
                type = 'checkbox'
                checked = {todo.completed}
                onChange = {() => CompleteItem(todo.id)}
            />
            <p><strong>{todo.todoItem}</strong></p>
            <p><strong>{todo.priority}</strong></p>
            <p><strong>{todo.dueDate ? todo.dueDate : "No due date"}</strong></p>
            <button style = {{border: '1px solid black'}} onClick = {() => onEdit(todo)}> Edit/Delete</button>
        </div>
    );
}

export default TodoItem;