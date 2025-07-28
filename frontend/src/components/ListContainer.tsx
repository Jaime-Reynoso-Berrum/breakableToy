import TodoItem from './TodoItem';
import type {Todo} from './TodoItem';




type TodoItemProps = {
    todos: Todo[];
    onToggleCompleted: (id: string) => void;
    onEdit: (todo: Todo) => void;
};

function ListContainer(props: TodoItemProps){
    const {todos, onToggleCompleted, onEdit} = props;

    return(
        <div>
            {todos.map((todo) => (
                <TodoItem
                    key= {todo.id}
                    todo = {todo}
                    onToggleCompleted={onToggleCompleted}
                    onEdit = {onEdit}
                />
            ))}
        </div>
    )
}

export default ListContainer;