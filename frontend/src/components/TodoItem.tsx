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

function formatDueDate(dueDate: string | null): string {
    if (!dueDate) return "No due date";
    const date = new Date(dueDate);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function priorityWordMap(priority: number) {
    switch(priority){
        case 1: return "High";
        case 2: return "Medium";
        case 3: return "Low";
        default: break;
    }
}

function TodoItem(props : TodoItemProps){
    const { todo, CompleteItem, onEdit } = props;

    return(
        <div style = {{ backgroundColor: getBackgroundColor(todo.dueDate),
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        display: 'grid',
                        gridTemplateColumns: '1fr 4fr 2fr 3fr 2fr',
                        alignItems: 'center',
                        color: 'black',
                        borderBottom: '1px solid black'}}>
            <div style={{ borderRight: '1px solid black', borderLeft: '1px solid black', padding: '8px', alignItems: 'center', justifyContent: 'center'}}>
                <input
                    style = {{ border: '3px solid black'}}
                    type = 'checkbox'
                    checked = {todo.completed}
                    onChange = {() => CompleteItem(todo.id)}
                />
            </div>
            <div style={{ borderRight: '1px solid black', padding: '8px'}}><strong>{todo.todoItem}</strong></div>
            <div style={{ borderRight: '1px solid black', padding: '8px'}}><strong>{priorityWordMap(todo.priority)}</strong></div>

            <div style={{ borderRight: '1px solid black', padding: '8px'}} title = {formatDueDate(todo.dueDate)}><strong>{formatDueDate(todo.dueDate)}</strong></div>
            <button style = {{ backgroundColor: 'lightpink', padding: '2px 4px', cursor: 'pointer', border: '2px solid black'}} onClick = {() => onEdit(todo)}> Edit/Delete</button>
        </div>
    );
}

export default TodoItem;