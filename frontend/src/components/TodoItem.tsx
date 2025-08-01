import type {Todo} from "../types/AddTodoRequest.tsx";

type TodoItemProps = {
    todo: Todo;
    CompleteItem: (id: string) => void;
    onEdit: (todo: Todo) => void;
};

function getBackgroundColor(dueDate: string| null): string {
    if (!dueDate) return 'gray';

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
                        display: 'grid',
                        gridTemplateColumns: '1fr 4fr 2fr 3fr 2fr',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'black',
                        borderBottom: '1px solid black'}}>
            <input
                style={{ borderRight: '1px solid black', padding: '8px', alignItems: 'center'}}
                type = 'checkbox'
                checked = {todo.completed}
                onChange = {() => CompleteItem(todo.id)}
            />
            <div style={{ borderRight: '1px solid black', padding: '8px'}}><strong>{todo.todoItem}</strong></div>
            <div style={{ borderRight: '1px solid black', padding: '8px'}}><strong>{todo.priority}</strong></div>
            <div style={{ borderRight: '1px solid black', padding: '8px'}}><strong>{todo.dueDate ? todo.dueDate : "No due date"}</strong></div>
            <button style = {{ cursor: 'pointer', border: '1px solid black'}} onClick = {() => onEdit(todo)}> Edit/Delete</button>
        </div>
    );
}

export default TodoItem;