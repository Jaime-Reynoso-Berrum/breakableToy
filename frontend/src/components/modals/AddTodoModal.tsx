import {useState} from "react";

interface AddModalProps {
    onClose: () => void;
    onSubmit: (todoItem: string, priority: number, dueDate: string | null) => void;
}

function AddTodoModal({ onClose, onSubmit }: AddModalProps){
    const [todoItem, setTodoItem] = useState('');
    const [priority, setPriority] = useState(1);
    const [dueDate, setDueDate] = useState<string | null > (null);

    const handleSubmit = () => {
        onSubmit(todoItem, priority, dueDate);
        onClose();
    };

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
                        value = {todoItem}
                        onChange = {e => setTodoItem(e.target.value)}
                        style = {{ width: '100%', marginBottom: '12px' }}
                    />
                </label>
                <label>
                    Priority:<br />
                    <input
                        type = "number"
                        min={1}
                        max={3}
                        value = {priority}
                        onChange = {e => setPriority(parseInt(e.target.value))}
                        style = {{ width: '100%', marginBottom: '12px' }}
                    />
                </label>
                <label>
                    Due date (optional):<br />
                    <input
                        type = "dateTime-local"
                        value = {dueDate ?? ''}
                        onChange = {e => setDueDate(e.target.value || null)}
                        style = {{ width: '100%', marginBottom: '16px' }}
                    />
                    <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick = {onClose} style = {{ padding: '8px 16px' }}>
                            Cancel
                        </button>
                        <button onClick = {handleSubmit} style = {{ padding: '8px 16px' }}>
                            Add Todo Item
                        </button>
                    </div>
                </label>
            </div>
        </div>
    );
}

export default AddTodoModal;