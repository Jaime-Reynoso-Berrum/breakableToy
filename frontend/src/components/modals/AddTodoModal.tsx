import {useState} from "react";

type AddModalProps = {
    todoItem: string;
    setTodoItem: (value: string) => void;
    priority: number;
    setPriority: (value: number) => void;
    dueDate: string | null;
    setDueDate: (value: string | null) => void;
    onClose: () => void;
    onSubmit: () => void;
};

function AddTodoModal({
    todoItem,
    setTodoItem,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    onClose,
    onSubmit,
    }: AddModalProps){
    const [errorMessage, setErrorMessage] = useState("");

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setPriority(parseInt(e.target.value));
    };

    const handleAddClick = () => {
        if (todoItem.trim() === ""){
            setErrorMessage("Please include a description for your todo item");
            return;
        }
        if (todoItem.length > 120) {
            setErrorMessage("Todo description must be less tha 120 characters");
            return;
        }
        setErrorMessage("");
        onSubmit()
    }

    return (
        <div style = {{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 9999,
            }}
        >
            <div
                style = {{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    width: '320px',
                }}
                >
                <h2 style = {{ marginBottom: '12px' }}>Add Todo Item</h2>
                <label>
                    Todo Item:<br />
                    <input
                        type = "text"
                        placeholder = "Todo description"
                        value = {todoItem}
                        onChange = {e => setTodoItem(e.target.value)}
                        style = {{ width: '100%', marginBottom: '12px' }}
                    />
                </label>
                {errorMessage && (
                    <p style={{ color: 'red', marginBottom: '12px'}}>{errorMessage}</p>
                )}
                <label>
                    Priority:<br />

                    <select value = {priority} onChange = {handlePriorityChange} style = {{ width: '100%', marginBottom: '16px' }}>
                        <option value = {1}>High Priority</option>
                        <option value = {2}>Medium Priority</option>
                        <option value = {3}>Low Priority</option>
                    </select>
                </label>
                <label>
                    Due date (optional):<br />
                    <input
                        type = "datetime-local"
                        value = {dueDate ?? ''}
                        onChange = {e => setDueDate(e.target.value || null)}
                        style = {{ width: '100%', marginBottom: '16px' }}
                    />
                    <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick = {onClose} style = {{ cursor: 'pointer', padding: '8px 16px' }}>
                            Cancel
                        </button>
                        <button onClick = {handleAddClick} style = {{ cursor: 'pointer', padding: '8px 16px' }}>
                            Add Todo Item
                        </button>
                    </div>
                </label>
            </div>
        </div>
    );
}

export default AddTodoModal;