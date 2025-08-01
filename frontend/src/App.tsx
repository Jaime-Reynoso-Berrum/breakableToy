import {useEffect, useState} from 'react'
import './App.css'
import AddTodoModal from "./components/modals/AddTodoModal.tsx";
import EditTodoModal from "./components/modals/EditTodoModal.tsx"
import FilterBar from "./components/FilterBar.tsx";
import MetricsFooter from "./components/MetricsFooter.tsx";
import ListContainer from "./components/ListContainer.tsx";
import {
    addTodo,
    completeTodo,
    editTodo, filterByCompleted,
    filterByPriority,
    filterByQuery,
    getMetrics, getOriginalList,
    undoCompleteTodo
} from "./api/api.ts";
import type {Todo} from "./types/AddTodoRequest.tsx";


function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [newTodoItem, setNewTodoItem] = useState('');
  const [newPriority, setNewPriority] = useState(1);
  const [newDueDate, setNewDueDate] = useState<string | null>(null);

  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const [EditingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [queryFilter, setQueryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<number>(0);
  const [completedFilter, setCompletedFilter] = useState<0 | 1| 2>(0);
  const [metrics, setMetrics] = useState<string[]>([]);

  // useEffect(() => {
  //     const metricsOnLaunch = async () => {
  //         try {
  //             const data = await getMetrics();
  //             setMetrics(data);
  //         } catch (error){
  //             console.log("Failed to grab metrics", error);
  //         }
  //     };
  //     metricsOnLaunch();
  // }, []);

  const handleAdd = async () => {

      try {
          const newTodo = await addTodo({todoItem: newTodoItem, priority: newPriority, dueDate: newDueDate,});
          setTodos(prev => [...prev, newTodo]);
      } catch (error) {
          console.error("Error adding Todo", error);
      }
      setNewTodoItem('');
      setNewPriority(1);
      setNewDueDate(null);
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

  const handleFilterChange = async () => {
      try {
          let filtered: Todo[] = [];

          if (queryFilter.trim() !== "") {
              filtered = await filterByQuery(queryFilter);
          } else if (priorityFilter !== 0) {
              filtered = await filterByPriority(priorityFilter);
          } else if (completedFilter !== 0) {
              filtered = await filterByCompleted(completedFilter);
          } else {
              filtered = await getOriginalList();
          }

          setTodos(filtered);
      } catch (e) {
          console.log("Filter failed", e);
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
        onFilterChange={handleFilterChange}
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
                    todoItem={newTodoItem}
                    setTodoItem={setNewTodoItem}
                    priority={newPriority}
                    setPriority={setNewPriority}
                    dueDate={newDueDate}
                    setDueDate={setNewDueDate}
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
