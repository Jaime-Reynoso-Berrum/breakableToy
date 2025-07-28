import { useState } from 'react'
import './App.css'
import AddTodoModal from "./components/modals/AddTodoModal.tsx";
import EditTodoModal from "./components/modals/EditTodoModal.tsx"
import FilterBar from "./components/FilterBar.tsx";
import MetricsFooter from "./components/MetricsFooter.tsx";


interface todo {
    id: string;
    todoItem: string;
    priority: number;
    dueDate: string | null;
}

function App() {
  // dummy todo data
  const [todos, setTodos] = useState<todo[]>([
      { id: '1', todoItem: 'Test item 1', priority: 2, dueDate:'2025-08-01T08:00'},
      { id: '2', todoItem: 'Test item 2', priority: 1, dueDate: ''},

  ])
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const [EditingTodo, setEditingTodo] = useState<todo | null>(null);

  const [queryFilter, setQueryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<number>(0);
  const [completedFilter, setCompletedFilter] = useState<boolean | null>(null);
  const [avgTime, setAvgTime] = useState("00:00:00")

  const handleAdd = (todoItem: string, priority: number, dueDate: string | null) => {
      console.log("New todo: ", {todoItem, priority, dueDate });
      // api calls will go in here
      setAddModalOpen(false);
  }

  const openEditModal = (todo: todo) => {
      setEditingTodo(todo);
      setEditModalOpen(true);
}
  const handleEdit = ( id: string, todoItem: string, priority: number, dueDate: string, deleteFlag: boolean) => {
      console.log('Editing todo item: ', {id, todoItem, priority, dueDate, deleteFlag });

      //api call here

        setEditModalOpen(false);
        setEditingTodo(null);
    }

    const handleOnFilter = () => {
      // api call goes here
        console.log({queryFilter, priorityFilter, completedFilter});
    }

  return (
    <>
        <FilterBar
        queryFilter={queryFilter}
        setQueryFilter={setQueryFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        completedFilter={completedFilter}
        setCompletedFilter={setCompletedFilter}
        onFilter={handleOnFilter}
        />
        <div>
            <button style = {{ border: '1px solid black'}} onClick={() => setAddModalOpen(true)}>Add a Todo Item</button>


            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <strong>{todo.todoItem}</strong> (Priority: {todo.priority})
                        <button style = {{ border: '1px solid black', marginLeft: 10}} onClick={() => openEditModal(todo)}>
                            Edit/Delete
                        </button>
                    </li>
                    ))}
            </ul>

            {AddModalOpen && (
                <AddTodoModal
                    onClose={() => setAddModalOpen(false)}
                    onSubmit={handleAdd}
                />
            )}
            {EditModalOpen && (
                <EditTodoModal
                    id={EditingTodo.id}
                    currentItem={EditingTodo.todoItem}
                    currentPriority={EditingTodo.priority}
                    currentDueDate={EditingTodo.dueDate ?? ''}
                    onClose={() => setEditModalOpen(false)}
                    onEdit={handleEdit}
                />
            )}
        </div>
        <MetricsFooter avgCompletioTime={avgTime} />
    </>
  )
}

export default App
