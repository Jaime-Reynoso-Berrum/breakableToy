import {useEffect, useState} from 'react'
import './App.css'
import AddTodoModal from "./components/modals/AddTodoModal.tsx";
import EditTodoModal from "./components/modals/EditTodoModal.tsx"
import FilterBar from "./components/FilterBar.tsx";
import MetricsFooter from "./components/MetricsFooter.tsx";
import ListContainer from "./components/ListContainer.tsx";
import {addTodo, completeTodo, editTodo, filterByQuery, getMetrics, undoCompleteTodo} from "./api/api.ts";
import type {Todo} from "./types/AddTodoRequest.tsx";


function App() {
  // dummy todo data
  const [todos, setTodos] = useState<Todo[]>([
      { id: '1', todoItem: 'Test item 1', priority: 2, creationDate: '', doneDate: '', dueDate:'2025-08-01T08:00', completed: false, deleteFlag: false},
      { id: '2', todoItem: 'Test item 2', priority: 1, creationDate: '', doneDate: '', dueDate: '', completed: false, deleteFlag:false},

  ])
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const [EditingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [queryFilter, setQueryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<number>(0);
  const [completedFilter, setCompletedFilter] = useState<boolean | null>(null);
  const [metrics, setMetrics] = useState<string[]>([]);

  useEffect(() => {
      const metricsOnLaunch = async () => {
          try {
              const data = await getMetrics();
              setMetrics(data);
          } catch (error){
              console.log("Failed to grab metrics", error);
          }
      };
      metricsOnLaunch();
  }, []);

  const handleAdd = async (todoItem: string, priority: number, dueDate: string | null) => {
      console.log("New todo: ", {todoItem, priority, dueDate });

      try {
          const newTodo = await addTodo({todoItem, priority, dueDate,});

          setTodos(prev => [...prev, newTodo]);
      } catch (error) {
          console.error("Error adding Todo", error);
      }
      setAddModalOpen(false);
  }

  const openEditModal = (todo: Todo) => {
      setEditingTodo(todo);
      setEditModalOpen(true);
}
  const handleEdit = async ( id: string, todoItem: string, priority: number, dueDate: string, deleteFlag: boolean = false) => {
      console.log('Editing todo item: ', {id, todoItem, priority, dueDate, deleteFlag });

      try {
          const editedTodo: Todo = await editTodo(id, {
                                                  todoItem,
                                                  priority,
                                                  dueDate: dueDate.trim() === "" ? null : dueDate,
                                                  deleted: deleteFlag,
          });

          if(deleteFlag) {
              setTodos(prev => prev.filter(todo => todo.id !== id));
          } else if  (editedTodo) {
              setTodos(prev => prev.map(todo => (todo.id === id ? editedTodo: todo)));
          }
      } catch (error) {
          console.error("Error edditing Todo", error);
      }

      setEditModalOpen(false);
      setEditingTodo(null);

    }

    const handleQueryFilter = async () => {
      const filtered = await filterByQuery(queryFilter);
      setTodos(filtered);
    }

    const CompleteItem = async (id: string) => {
      const todo  = todos.find(todo => todo.id === id);
      if (!todo) return;

      try {
          let updatedTodo: Todo;

          if (!todo.completed){
              updatedTodo = await completeTodo(id);
          } else {
              updatedTodo = await undoCompleteTodo(id);
          }
          const updatedMetrics = await getMetrics();
          setMetrics(updatedMetrics);

          setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo))
          );
      } catch (error){
          console.error("Failed to toggle complete", error);
      }
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
        onQueryFilter={handleQueryFilter}
        />
        <div>
            <button style = {{ border: '1px solid black'}} onClick={() => setAddModalOpen(true)}>Add a Todo Item</button>


            <ListContainer
                todos={todos}
                CompleteItem={CompleteItem}
                onEdit={openEditModal}
            />


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
        <MetricsFooter metrics={metrics} />
    </>
  )
}

export default App
