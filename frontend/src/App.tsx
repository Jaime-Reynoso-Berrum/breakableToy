import {useCallback, useEffect, useState} from 'react'
import './App.css'
import AddTodoModal from "./components/modals/AddTodoModal.tsx";
import EditTodoModal from "./components/modals/EditTodoModal.tsx"
import FilterBar from "./components/FilterBar.tsx";
import MetricsFooter from "./components/MetricsFooter.tsx";
import ListContainer from "./components/ListContainer.tsx";
import {
    addTodo,
    completeTodo,
    editTodo,
    getMetrics, getTodos,
    undoCompleteTodo
} from "./api/api.ts";
import type {Todo} from "./types/AddTodoRequest.tsx";


function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [queryFilter, setQueryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<number>(0);
  const [completedFilter, setCompletedFilter] = useState<0 | 1| 2>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [sortByDueDate, setSortByDueDate] = useState(true);

  const [newTodoItem, setNewTodoItem] = useState('');
  const [newPriority, setNewPriority] = useState(1);
  const [newDueDate, setNewDueDate] = useState<string | null>(null);

  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const [EditingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [metrics, setMetrics] = useState<string[]>([]);

  const isLastPage = todos.length < 10;

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
      handleFilterChange();
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
          handleFilterChange();

      } catch (error){
          console.error("Failed to toggle complete", error);
      }
  }

  const handleFilterChange = useCallback(async () => {
      try {
          const filtered = await getTodos(queryFilter, priorityFilter, completedFilter,  currentPage, ascending, sortByDueDate);

          setTodos(filtered);
      } catch (e) {
          console.log("Filter failed", e);
      }
  }, [queryFilter, priorityFilter, completedFilter, currentPage, ascending, sortByDueDate]);

  useEffect(() => {
            handleFilterChange();
        }, [handleFilterChange]
  );

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

        {/* button bar */}
            <div
                style={{
                    position:'fixed',
                    top: '150px',
                    zIndex: 1050,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',

                }}>
                <button style = {{ marginRight: '15rem', border: '1px solid black'}} onClick={() => setAddModalOpen(true)}>Add a Todo Item</button>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
                    <button onClick={() => setSortByDueDate(prev => !prev)} style = {{ marginRight: '8px', border: '1px solid black'}}>
                        Sort by: {sortByDueDate ? "Due Date" : "Priority"}
                    </button>
                    <button onClick={() => setAscending(prev => !prev)} style = {{ border: '1px solid black'}}>
                        Order : {ascending  ? "Ascending" : "Descending"}
                    </button>
                </div>

            </div>

        <div>
            <h1>My Todo List</h1>
            <ListContainer
                todos={todos}
                CompleteItem={CompleteItem}
                onEdit={openEditModal}
            />
            <div style={{
                position: 'fixed',
                bottom: '120px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                margin: '1rem' }}
            >
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    style = {{ marginRight: '5px', border: '1px solid black'}} disabled={currentPage === 1}
                    >
                    Prev Page
                </button>
                <span> Page {currentPage} </span>
                <button
                    disabled={isLastPage} style = {{ marginLeft: '5px', border: '1px solid black'}} onClick={() => setCurrentPage(p => p + 1)}>Next Page
                </button>
            </div>

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
