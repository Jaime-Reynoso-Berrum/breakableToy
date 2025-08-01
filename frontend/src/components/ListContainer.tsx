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
        <div>
            <h2 style={{position: 'fixed',
                top: '190px',
                right: '25rem',
                left: '25rem',}}>My Todo List</h2>

            <div
                style = {{
                    border: '1px solid black',
                    display: 'grid',
                    gridTemplateColumns: '1fr 4fr 2fr 3fr 2fr',
                    fontWeight: 'bold',
                    backgroundColor: 'lightgray',
                    position: 'fixed',
                    top: '250px',
                    right: '25rem',
                    left: '25rem',
                    }}
                >
                <div style={{ border: '1px solid black', padding: '8px'}}>Done</div>
                <div style={{ border: '1px solid black', padding: '8px'}}>Task</div>
                <div style={{ border: '1px solid black', padding: '8px'}}>Priority</div>
                <div style={{ border: '1px solid black', padding: '8px'}}>Due Date</div>
                <div style={{ border: '1px solid black', padding: '8px'}}>Edit/Delete</div>
            </div>

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