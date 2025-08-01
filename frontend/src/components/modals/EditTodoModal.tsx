import {useState} from "react";

interface EditModalProps {
    id: string;
    currentItem: string;
    currentPriority: number;
    currentDueDate: string;
    onClose: () => void;
    onEdit: (
        id: string,
        currentItem: string,
        currentPriority: number,
        currentDueDate: string,
        toDelete: boolean,
    ) => void;
}

function EditTodoModal({
                           id,
                           currentItem,
                           currentPriority,
                           currentDueDate,
                           onClose, onEdit,
                       }: EditModalProps){

    const [todoItem, setTodoItem] = useState(currentItem);
    const [priority, setPriority] = useState(currentPriority);
    const [dueDate, setDueDate] = useState(currentDueDate);

    const handleSave = () => {
        onEdit(id, todoItem, priority, dueDate, false);
        onClose();
    }

    const handleDelete = () => {
        onEdit(id, todoItem, priority, dueDate, true);
        onClose();
    }

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPriority(parseInt(e.target.value));
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
                <h2 style = {{ marginBottom: '12px' }}>Edit Todo Item</h2>
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
                    <select value = {priority} onChange = {handlePriorityChange} style = {{ width: '100%', marginBottom: '16px' }}>
                        <option value = {1}>High Priority</option>
                        <option value = {2}>Medium Priority</option>
                        <option value = {3}>Low Priority</option>
                    </select>
                </label>
                <label>
                    Due date (optional):<br />
                    <input
                        type = "dateTime-local"
                        value = {dueDate ?? ''}
                        onChange = {e => setDueDate(e.target.value || '')}
                        style = {{ width: '100%', marginBottom: '16px' }}
                    />
                    <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick = {handleSave} style = {{ padding: '8px 16px' }}>
                            Save Changes
                        </button>
                        <button onClick = {onClose} style = {{ padding: '8px 16px' }}>
                            Cancel
                        </button>
                        <button onClick = {handleDelete} style = {{ padding: '8px 16px' }}>
                            DELETE ITEM
                        </button>

                    </div>
                </label>
            </div>
        </div>
    );
}

export default EditTodoModal;