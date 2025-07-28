import {Todo} from './TodoItem';



type TodoItemProps = {
    todos: TodoItem[];
    onToggleCompleted: (id: string) => void;
    onEdit: (todo: TodoItem) => void;
};

function TodoItem(props: TodoItemProps){
    const {Todo} = props;

    return(
        <div>
            {Todo.map((todo) => (
                <TodoItem
                    id = {Todo.id}
                    todoItem: {Todo.todoItem}
                    onToggleCompleted = {onToggleCompleted}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}

export default TodoItem;