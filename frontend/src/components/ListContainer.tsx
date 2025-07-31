import TodoItem from './TodoItem';
import type {Todo} from "../types/AddTodoRequest.tsx";

type TodoItemProps = {
    todos: Todo[];
    CompleteItem: (id: string) => void;
    onEdit: (todo: Todo) => void;
};

function ListContainer(props: TodoItemProps){
    const {todos, CompleteItem, onEdit} = props;

    return(
        <div style = {{border: '1px solid black'}}>
            {todos.map((todo) => (
                <TodoItem
                    key= {todo.id}
                    todo = {todo}
                    CompleteItem={CompleteItem}
                    onEdit = {onEdit}
                />
            ))}
        </div>
    )
}

export default ListContainer;