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
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleSave = () => {
        onEdit(id, todoItem, priority, dueDate, false);
        onClose();
    }

    const handleDeleteClick = () => {
        setShowConfirmDelete(true);
    }

    const handleConfirmDelete =() => {
        onEdit(id, todoItem, priority, dueDate, true);
        setShowConfirmDelete(false);
        onClose();
    }

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
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
                {!showConfirmDelete ? (
                    <>
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
                                type = "datetime-local"
                                value = {dueDate ?? ''}
                                onChange = {e => setDueDate(e.target.value || '')}
                                style = {{ width: '100%', marginBottom: '16px' }}
                            />
                        </label>
                            <div style = {{ display: 'flex', justifyContent: 'space-between', gap: '8px'}}>
                                <button onClick = {handleSave} style = {{ border: '1px solid black', cursor: 'pointer', padding: '8px 16px' }}>
                                    Save Changes
                                </button>
                                <button onClick = {onClose} style = {{ border: '1px solid black', cursor: 'pointer', padding: '8px 16px' }}>
                                    Cancel
                                </button>
                                <button onClick = {handleDeleteClick} style = {{ border: '1px solid black', cursor: 'pointer', padding: '8px 16px' }}>
                                    DELETE ITEM
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 style ={{ marginBottom: '16px', color: 'red' }}>Confirm Delete</h2>
                            <p style={{ marginBottom: '20px'}}>
                                Are you sure you want to delete this item?<br/>
                                This action can NOT be undoe
                            </p>
                            <div style = {{ display: 'flex', justifyContent: 'space-between', gap: '8px'}}>
                                <button onClick = {handleCancelDelete} style={{ cursor: 'poiunter', padding: '8px 16px', backgroundColor: "gray"}}>
                                    Cancel
                                </button>
                                <button onClick = {handleConfirmDelete} style={{ cursor: 'poiunter', padding: '8px 16px', backgroundColor: "gray"}}>
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
}

export default EditTodoModal;