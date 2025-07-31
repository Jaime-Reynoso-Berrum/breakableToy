import type {Todo} from "../types/AddTodoRequest.tsx";


type TodoItemProps = {
    todo: Todo;
    completeTodo: (id: string) => void;
    onEdit: (todo: Todo) => void;
};

function TodoItem(props : TodoItemProps){
    const { todo, completeTodo, onEdit } = props;

    return(
        <div style = {{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid black'}}>
            <input
                type = 'checkbox'
                checked = {todo.completed}
                onChange = {() => completeTodo(todo.id)}
            />
            <p><strong>{todo.todoItem}</strong></p>
            <p><strong>{todo.priority}</strong></p>
            <p><strong>{todo.dueDate ? todo.dueDate : "No due date"}</strong></p>
            <button style = {{border: '1px solid black'}} onClick = {() => onEdit(todo)}> Edit/Delete</button>
        </div>
    );
}

export default TodoItem;