import {Todo} from './TodoItem';



type TodoItemProps = {
    todos: TodoItem[];
    onToggleCompleted: (id: string) => void;
    onEdit: (todo: Todo) => void;
};

function TodoItem(props: TodoItemProps){
    const {todos, onToggleCompleted, onEdit} = props;

    return(
        <div>
            {todos.map((todo) => (
                <span> [todo.todoItem]</span>
            ))}
        </div>
    )
}

export default TodoItem;